export type RuntimeEnv = {
  VITE_API_BASE_URL?: string;
  VITE_AUDIT_BASE_URL?: string;
  VITE_EVENTS_WS_URL?: string;
  VITE_OIDC_AUTHORITY?: string;
  VITE_AUTH_URL?: string;
  VITE_OIDC_CLIENT_ID?: string;
  VITE_OIDC_REDIRECT_URI?: string;
  VITE_GRAFANA_DASHBOARD_URL?: string;
};

const w = (typeof window !== 'undefined' ? (window as any) : {}) as any;
const runtime = (w.__ENV__ || {}) as RuntimeEnv;

export const env: RuntimeEnv = {
  VITE_API_BASE_URL: runtime.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL,
  VITE_AUDIT_BASE_URL: runtime.VITE_AUDIT_BASE_URL ?? import.meta.env.VITE_AUDIT_BASE_URL,
  VITE_EVENTS_WS_URL: runtime.VITE_EVENTS_WS_URL ?? import.meta.env.VITE_EVENTS_WS_URL,
  VITE_OIDC_AUTHORITY: runtime.VITE_OIDC_AUTHORITY ?? runtime.VITE_AUTH_URL ?? import.meta.env.VITE_OIDC_AUTHORITY ?? import.meta.env.VITE_AUTH_URL,
  VITE_OIDC_CLIENT_ID: runtime.VITE_OIDC_CLIENT_ID ?? import.meta.env.VITE_OIDC_CLIENT_ID,
  VITE_OIDC_REDIRECT_URI: runtime.VITE_OIDC_REDIRECT_URI ?? import.meta.env.VITE_OIDC_REDIRECT_URI,
  VITE_GRAFANA_DASHBOARD_URL: runtime.VITE_GRAFANA_DASHBOARD_URL ?? import.meta.env.VITE_GRAFANA_DASHBOARD_URL,
};

export function resolveApiBase(): string {
  const defaultGateway = `${window.location.protocol}//${window.location.hostname}:8080`;
  return env.VITE_API_BASE_URL || defaultGateway;
}

export function resolveAuditBase(): string {
  const defaultAudit = `${window.location.protocol}//${window.location.hostname}:8082`;
  return env.VITE_AUDIT_BASE_URL || defaultAudit;
}

export function resolveEventsUrl(): string {
  const defaultSse = `${window.location.protocol}//${window.location.hostname}:8080/ws/events`;
  return env.VITE_EVENTS_WS_URL || defaultSse;
} 