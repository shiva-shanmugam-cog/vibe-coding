# Backend

Java 17 + Spring Boot microservices and SDK enabling a multi-agent, event-driven platform.

## Modules

- `agent-framework`: Agent SDK and standardized interfaces
- `agent-gateway`: API gateway, orchestrator, WebSocket for live metrics
- `agents/onboarding-agent`: Customer Onboarding Assistant
- `agents/fraud-detection-agent`: Fraud Detection Engine
- `audit-service`: Compliance-grade audit trail APIs and storage
- `shared`: Security, tracing, and shared utilities

## Build & Run

- Build (per-module Maven once pom.xml files are added):
  - `mvn -pl agent-framework -am package`
  - `mvn -pl agent-gateway -am package`
- Run locally with Docker Compose (see `infrastructure/docker/README.md`).

## Key Endpoints (agent-gateway)

- `POST /api/agents/message` → route message to target agent
- `GET /api/agents/metrics` → system/agent metrics snapshot
- `GET /actuator/prometheus` → Prometheus metrics

## Events (Kafka)

- `agent.inbound` → inbound messages for orchestrator
- `agent.outbound` → agent responses
- `agent.events` → lifecycle/health/errors
- `transactions.events` → transaction stream for fraud

## Security

- OAuth2 Resource Server (JWT)
- RBAC: `ROLE_ADMIN`, `ROLE_AGENT`, `ROLE_CUSTOMER`
- Audit via `audit-service` 