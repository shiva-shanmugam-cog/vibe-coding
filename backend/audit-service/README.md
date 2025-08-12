# Audit Service

Compliance-grade audit trail for all inbound/outbound events.

## Storage

- PostgreSQL table `audit_events` (JSONB payload, hash, actor, IP, UA, compliant)

## APIs

- `POST /api/audit` → ingest audit events
- `GET /api/audit/search` → query by time/actor/resource

## Notes

- Integrates with orchestrator and security for full trail
- Supports export for compliance reporting 