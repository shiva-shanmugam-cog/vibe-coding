import axios from 'axios';
import { User } from 'oidc-client-ts';

const defaultGateway = `${window.location.protocol}//${window.location.hostname}:8080`;
const defaultAudit = `${window.location.protocol}//${window.location.hostname}:8082`;

const apiBase = import.meta.env.VITE_API_BASE_URL || defaultGateway;
const auditBase = import.meta.env.VITE_AUDIT_BASE_URL || defaultAudit;

export const api = axios.create({ baseURL: apiBase, withCredentials: false, timeout: 15000 });
export const auditApi = axios.create({ baseURL: auditBase, withCredentials: false, timeout: 15000 });

let currentUser: User | null = null;
export function setAuthUser(user: User | null) { currentUser = user; }

function bearer() {
  return currentUser?.access_token ? `Bearer ${currentUser.access_token}` : null;
}

api.interceptors.request.use(cfg => {
  const token = bearer();
  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = token;
  }
  return cfg;
});

auditApi.interceptors.request.use(cfg => {
  const token = bearer();
  if (token) {
    cfg.headers = cfg.headers || {};
    (cfg.headers as any).Authorization = token;
  }
  return cfg;
});

function toReadableError(err: any): string {
  if (err?.response) {
    const status = err.response.status;
    const text = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
    return `HTTP ${status}: ${text}`;
  }
  if (err?.request) {
    return 'Network error: request made but no response received';
  }
  return err?.message || 'Unknown error';
}

api.interceptors.response.use(r => r, (err) => Promise.reject(new Error(toReadableError(err))));
auditApi.interceptors.response.use(r => r, (err) => Promise.reject(new Error(toReadableError(err))));

export interface AgentMetricItem {
  displayName: string;
  version: string;
  health: string;
  details?: Record<string, unknown>;
}

export type AgentsMetrics = Record<string, AgentMetricItem>;

export async function getAgentsMetrics() {
  const res = await api.get<AgentsMetrics>('/api/agents/metrics');
  return res.data;
}

export interface AgentMessageReq {
  targetAgentId: string;
  actor?: string;
  type?: string;
  payload?: Record<string, unknown>;
}

export async function sendAgentMessage(message: AgentMessageReq, conversationId?: string) {
  const res = await api.post('/api/agents/message', message, { headers: conversationId ? { 'X-Conversation-Id': conversationId } : {} });
  return res.data;
}

export async function getPrometheusRaw() {
  const res = await api.get('/actuator/prometheus', { responseType: 'text' });
  return res.data as string;
} 