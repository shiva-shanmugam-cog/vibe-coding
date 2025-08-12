# Agent Framework (SDK)

Contracts and helpers to implement agents rapidly.

## Key Interfaces

- `Agent`: core lifecycle (`initialize`, `processMessage`, `handleAgentMessage`, `getMetrics`)
- `AgentMessage`: standardized message format
- `AgentResponse`: normalized responses with types (APPROVED, SECURITY_ALERT, INTERACTIVE, etc.)
- `ConversationContext`, `AgentCapabilities`, `AgentHealth`

## Developer Guide

- Implement `Agent` and annotate with `@Component`
- Provide `getAgentId()` unique ID (e.g., `onboarding-assistant`)
- Use `CompletableFuture` for async processing
- Emit Micrometer metrics and expose health

## Example

```java
@Component
public class MyNewAgent implements Agent {
  public String getAgentId(){ return "my-new-agent"; }
  public String getDisplayName(){ return "My New Agent"; }
  public String getVersion(){ return "1.0.0"; }
  public CompletableFuture<AgentResponse> processMessage(ConversationContext ctx, AgentMessage msg){
    return CompletableFuture.completedFuture(AgentResponse.info("Hello from My New Agent"));
  }
}
``` 