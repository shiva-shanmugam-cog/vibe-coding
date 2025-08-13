window.__ENV__ = window.__ENV__ || {
  // Example defaults; override via k8s ConfigMap mounted to /usr/share/nginx/html/env.js
  VITE_API_BASE_URL: '',
  VITE_AUDIT_BASE_URL: '',
  VITE_EVENTS_WS_URL: '',
  VITE_OIDC_AUTHORITY: '',
  VITE_OIDC_CLIENT_ID: '',
  VITE_OIDC_REDIRECT_URI: '',
  VITE_GRAFANA_DASHBOARD_URL: ''
}; 