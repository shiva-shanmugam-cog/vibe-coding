# Vibe Admin Dashboard (Frontend)

Modern, responsive dashboard to manage agents, monitor performance, trace events, and view audit logs.

## Quick Start

1. Create `.env` with values as needed (see below). Defaults will target local backend ports.
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`

Open `http://localhost:5173`.

## Integrations

- API (Agent Gateway): `VITE_API_BASE_URL` → defaults to `http://localhost:8080`
  - `POST /api/agents/message`
  - `GET /api/agents/metrics`
  - `GET /actuator/prometheus`
- Audit Service: `VITE_AUDIT_BASE_URL` → defaults to `http://localhost:8082`
  - `GET /api/audit/search`
- Events Stream: `VITE_EVENTS_WS_URL`
  - Defaults to `http://localhost:8080/ws/events` (SSE). If you provide a `ws://` URL, the UI will use WebSocket.
- Grafana (optional): `VITE_GRAFANA_DASHBOARD_URL`
  - Provide a public panel URL or a dashboard URL accessible from the browser. The Performance page will embed it and provide an external link.
- OIDC (optional): `VITE_OIDC_*` → configure Keycloak. Without OIDC, demo login is provided.

### Example `.env`

```
# Gateway and Audit
VITE_API_BASE_URL=http://localhost:8080
VITE_AUDIT_BASE_URL=http://localhost:8082

# Events (optional; default uses :8080 SSE)
# VITE_EVENTS_WS_URL=http://localhost:8080/ws/events

# Grafana (optional)
# VITE_GRAFANA_DASHBOARD_URL=http://localhost:3000/d/xxxx/agents?orgId=1&kiosk

# OIDC (optional)
# VITE_OIDC_AUTHORITY=http://localhost:8081/realms/demo
# VITE_OIDC_CLIENT_ID=vibe-admin
# VITE_OIDC_REDIRECT_URI=http://localhost:5173
```

## Tests

- `npm run test` to run Vitest.

## Styling

- TailwindCSS
- Recharts for charts

## Build

- `npm run build` → output in `dist/` 