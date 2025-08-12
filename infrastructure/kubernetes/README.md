# Kubernetes

Manifests for deploying agents and supporting services.

## Components

- Deployments + Services for agent-gateway and agents
- Kafka cluster (Strimzi) or external Kafka
- HPA for autoscaling based on CPU and custom metrics

## Notes

- Use Secrets for DB and JWT keys
- NetworkPolicies to restrict traffic
- Readiness/liveness probes via `/actuator/health` 