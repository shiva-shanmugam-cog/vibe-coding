# Fraud Detection Agent

Real-time transaction and behavior analysis using rules, patterns, and ML scores.

## Inputs

- `transactions.events` stream
- System/customer events via `agent.inbound`

## Outputs

- Alerts to `agent.outbound`
- Block/allow decisions; verification requests

## Metrics

- `fraud_detection_alerts_total`
- `blocked_transactions_total`
- `fraud_analysis_latency_ms` 