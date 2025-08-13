import axios, { InternalAxiosRequestConfig } from 'axios';
import { User } from 'oidc-client-ts';

const apiBase = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({ baseURL: apiBase });

let currentUser: User | null = null;
export function setAuthUser(user: User | null) { currentUser = user; }

function bearer() {
	return currentUser?.access_token ? { Authorization: `Bearer ${currentUser.access_token}` } : {};
}

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
	const headers = (cfg.headers || {}) as any;
	Object.assign(headers, bearer());
	cfg.headers = headers;
	return cfg;
});

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
	messageId?: string;
	timestamp?: string;
}

export async function sendAgentMessage(message: AgentMessageReq, conversationId?: string) {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' } as Record<string, string>;
	if (conversationId) headers['X-Conversation-Id'] = conversationId;
	const res = await api.post('/api/agents/message', message, { headers });
	return res.data as any;
}

export async function getPrometheusRaw() {
	const res = await api.get('/actuator/prometheus', { responseType: 'text' });
	return res.data as string;
} 