# Monitoring

Prometheus + Grafana for metrics and dashboards.

## Prometheus

- Scrapes Spring Boot Actuator `/actuator/prometheus`
- Custom rules for agent performance and fraud alerts

## Grafana

- Dashboards for agent response times, throughput, error rates, fraud events
- Configure datasource pointing to Prometheus

See `grafana/dashboards/` for JSON dashboards. 