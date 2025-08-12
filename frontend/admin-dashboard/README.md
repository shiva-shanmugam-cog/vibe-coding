# Vibe Admin Dashboard (Frontend)

Modern, responsive dashboard to manage agents, monitor performance, trace events, simulate customer onboarding, and view audit logs.

## Quick Start

1. Copy `.env.example` → `.env` (already included as `.env` with defaults) and adjust values.
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`

Open `http://localhost:5173`.

## Integrations

- API (Agent Gateway): `VITE_API_BASE_URL` → uses:
  - `POST /api/agents/message`
  - `GET /api/agents/metrics`
  - `GET /actuator/prometheus`
- Audit Service: `VITE_AUDIT_BASE_URL`
  - `GET /api/audit/search`
- Events Stream: `VITE_EVENTS_WS_URL`
  - Defaults to `http://localhost:8080/ws/events` (SSE). If you point to a `ws://` URL, the UI will use WebSocket instead.
- OIDC (optional): `VITE_OIDC_*` → configure Keycloak. Without OIDC, demo login is provided.

## Keycloak (OIDC) Setup

`backend/docker-compose.yml` now includes a `keycloak` service on port 8081 with a preloaded `demo` realm and client `vibe-admin`:

- Realm: `demo`
- Admin: `admin` / `admin`
- Client: `vibe-admin` (public, PKCE) redirect: `http://localhost:5173/*`
- Roles: `ROLE_ADMIN`, `ROLE_AGENT`, `ROLE_CUSTOMER`

Frontend `.env` (uncomment to enable):

```
VITE_OIDC_AUTHORITY=http://localhost:8081/realms/demo
VITE_OIDC_CLIENT_ID=vibe-admin
VITE_OIDC_REDIRECT_URI=http://localhost:5173
```

## Tests

- `npm run test` to run Vitest.

## Styling

- TailwindCSS
- Recharts for charts

## Build

- `npm run build` → output in `dist/` 