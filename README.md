# Multi-Agent Banking Framework

A scalable, extensible multi-agent conversation framework for banking applications with enterprise-grade security, compliance, and real-time monitoring.

## Quick Start

- Prereqs: Docker Desktop, Node 18+, JDK 17+
- Start infrastructure and services (when containers are added):
  - See `infrastructure/docker/README.md` for docker-compose instructions
- Dashboards (after startup):
  - Admin Dashboard: http://localhost:3000
  - Customer Portal: http://localhost:3001
  - Prometheus: http://localhost:9090
  - Grafana: http://localhost:3003

## Architecture

- Event-driven multi-agent system over Kafka (or RabbitMQ)
- Core agents:
  - Customer Onboarding Assistant
  - Fraud Detection Engine
- Standardized Agent Interface with auto-registration and real-time metrics
- Security: OAuth2/JWT, RBAC, AES-256, full audit trails
- Observability: Prometheus + Grafana + OpenTelemetry tracing

## Repository Layout

backend/ - Java Spring Boot services and agent SDK
frontend/ - React dashboards and customer simulation
infrastructure/ - Docker, Kubernetes, monitoring
docs/ - Design docs and API contracts
demo/ - Demo scenarios and data

See READMEs in each module for setup details.

## Event Contracts (JSON)

- Topics: `agent.inbound`, `agent.outbound`, `agent.events`, `transactions.events`
- Message schema:
```
{
  "messageId": "uuid",
  "conversationId": "uuid",
  "customerId": "string",
  "type": "CUSTOMER_QUERY|SYSTEM_EVENT|SECURITY_ALERT|WORKFLOW_TRIGGER",
  "content": "string",
  "metadata": { },
  "timestamp": "ISO-8601",
  "securityContext": { "userId": "string", "roles": ["string"], "authToken": "jwt" }
}
```

## Adding a New Agent (≤ 30 minutes)

1) Copy the template from `backend/agents/README.md`
2) Implement `Agent` interface
3) Register with orchestrator (classpath scanning)
4) Expose Micrometer metrics and health
5) Add service entry in docker/k8s manifests

## Security & Compliance

- OAuth2 Resource Server (JWT)
- RBAC by role/authority
- AES-GCM for PII at rest, TLS 1.3 in transit
- Full audit of inbound/outbound agent events

## Monitoring & Tracing

- Prometheus metrics from all services via Actuator
- Grafana dashboards for performance and fraud
- OpenTelemetry traces for end-to-end workflow

## Performance Targets

- ≥ 1000 concurrent transactions
- p95 agent response < 200ms
- Horizontal autoscaling by CPU and custom metrics 