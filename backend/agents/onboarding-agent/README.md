# Onboarding Agent

Assists new customers through KYC, document verification, and account creation.

## Capabilities

- Start onboarding, collect personal info
- Handle document upload and verification
- Check progress/status
- Collaborate with Fraud Detection via events

## Event Types

- CUSTOMER_QUERY: "open account", "upload document", "status"
- WORKFLOW_TRIGGER: step transitions

## Metrics

- `agent_response_time_seconds`
- `onboarding_workflows_active`
- `document_verification_latency_ms` 