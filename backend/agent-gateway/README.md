# Agent Gateway

API gateway, agent orchestrator, and WebSocket broadcaster.

## Responsibilities

- Authenticate/authorize requests (JWT)
- Validate and audit inbound messages
- Route to appropriate agent(s)
- Publish/consume Kafka events
- Stream real-time metrics to dashboards

## APIs

- `POST /api/agents/message` → routes message to agents
- `GET /api/agents/metrics` → system metrics
- `GET /actuator/health` `GET /actuator/prometheus`

## Configuration (application.yml)

- `spring.kafka.bootstrap-servers`
- security: OAuth2 resource server (JWT)
- actuator exposure: health, metrics, prometheus

## Scaling

- Stateless; scale horizontally
- Use Kafka partitions and consumer concurrency 