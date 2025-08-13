# Customer Portal (Demo)

Simulates customer onboarding and interactions with agents.

## Flows

- Start onboarding → provide info → upload document → check status
- Triggers fraud checks via system events

## Dev

- `npm install`
- `npm run dev`

### Environment variables (optional for OIDC)

- `VITE_API_BASE_URL` (defaults to same origin)
- `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`, `VITE_OIDC_REDIRECT_URI` 