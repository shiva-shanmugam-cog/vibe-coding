import axios from 'axios';
import { User } from 'oidc-client-ts';

const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const auditBase = import.meta.env.VITE_AUDIT_BASE_URL || '';

export const api = axios.create({ baseURL: apiBase });
export const auditApi = axios.create({ baseURL: auditBase });

let currentUser: User | null = null;
export function setAuthUser(user: User | null) { currentUser = user; }

function bearer() {
  return currentUser?.access_token ? { Authorization: `Bearer ${currentUser.access_token}` } : {};
}

api.interceptors.request.use(cfg => ({ ...cfg, headers: { ...cfg.headers, ...bearer() } }));
auditApi.interceptors.request.use(cfg => ({ ...cfg, headers: { ...cfg.headers, ...bearer() } }));

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