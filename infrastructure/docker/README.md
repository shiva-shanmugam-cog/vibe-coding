# Docker (Local)

Local development stack using Docker Compose.

## Services (planned)

- Zookeeper, Kafka
- Postgres, MongoDB, Redis
- agent-gateway, onboarding-agent, fraud-detection-agent, audit-service
- admin-dashboard, customer-portal
- Prometheus, Grafana

## Commands

- Start: `docker compose up -d`
- Stop: `docker compose down`
- Logs: `docker compose logs -f agent-gateway`

Compose file will be added as `docker-compose.yml` at the repo root or here as needed. 