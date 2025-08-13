# Admin Dashboard on AKS

## Prerequisites
- Azure subscription
- AKS cluster and ACR
- NGINX Ingress Controller or Azure Application Gateway Ingress Controller
- cert-manager (for TLS via LetsEncrypt)

## Build and Push Image
```bash
ACR_NAME=youracr
az acr login -n $ACR_NAME
IMAGE=$ACR_NAME.azurecr.io/admin-dashboard:latest
cd frontend/admin-dashboard
docker build -t $IMAGE .
docker push $IMAGE
```

## Deploy
Edit `k8s/deployment.yaml` image reference and apply:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

## Configure Runtime Env
Edit the `ConfigMap` section in `deployment.yaml` to set API, Audit, Events WS URL, and OIDC settings. These are mounted to `/usr/share/nginx/html/env.js`.

## Azure Monitor and Grafana
- Ensure backend services expose `/actuator/prometheus` (already configured for gateway).
- Install kube-prometheus-stack and Grafana; set `VITE_GRAFANA_DASHBOARD_URL` to a shared dashboard link. 