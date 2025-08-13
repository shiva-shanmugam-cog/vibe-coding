# Backend services on AKS

Services:
- agent-gateway (port 8080): Kafka bridge, API, SSE events
- audit-service (port 8082): Audit API
- onboarding-agent (port 8081)
- fraud-detection-agent (port 8083)

## Build and Push Images
```bash
ACR_NAME=youracr
az acr login -n $ACR_NAME
# From repo root
docker build -t $ACR_NAME.azurecr.io/agent-gateway:latest backend/agent-gateway
docker build -t $ACR_NAME.azurecr.io/audit-service:latest backend/audit-service
docker build -t $ACR_NAME.azurecr.io/onboarding-agent:latest backend/agents/onboarding-agent
docker build -t $ACR_NAME.azurecr.io/fraud-detection-agent:latest backend/agents/fraud-detection-agent

docker push $ACR_NAME.azurecr.io/agent-gateway:latest
docker push $ACR_NAME.azurecr.io/audit-service:latest
docker push $ACR_NAME.azurecr.io/onboarding-agent:latest
docker push $ACR_NAME.azurecr.io/fraud-detection-agent:latest
```

## Deploy
Edit ACR image references in the manifests and apply:
```bash
kubectl apply -f backend/k8s/onboarding-agent.yaml
kubectl apply -f backend/k8s/fraud-detection-agent.yaml
kubectl apply -f backend/k8s/audit-service.yaml
kubectl apply -f backend/k8s/agent-gateway.yaml
```

## Configuration
- agent-gateway requires env vars:
  - `KAFKA_BOOTSTRAP_SERVERS`: e.g., `kafka:9092`
  - `JWKS_URI`: OIDC jwks endpoint
- Set `VITE_API_BASE_URL` in the frontend to the agent-gateway Service/Ingress address.
- Set `VITE_AUDIT_BASE_URL` to the audit-service Service/Ingress if accessed directly; otherwise route via gateway if proxied.
- Events stream: `VITE_EVENTS_WS_URL` → `https://<gateway-ingress>/ws/events`. 