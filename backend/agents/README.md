# Agents

Production agents built on the `agent-framework` SDK.

## Included

- `onboarding-agent` → Customer Onboarding Assistant
- `fraud-detection-agent` → Fraud Detection Engine

## Create a New Agent (≤ 30 minutes)

1) Scaffold from a template
2) Implement `Agent` methods
3) Add metrics, health, and configuration
4) Register via classpath scanning and start

Minimal example:
```java
@Component
public class ExampleAgent implements Agent {
  public String getAgentId(){ return "example-agent"; }
  public String getDisplayName(){ return "Example Agent"; }
  public String getVersion(){ return "1.0.0"; }
  public CompletableFuture<AgentResponse> processMessage(ConversationContext ctx, AgentMessage msg){
    return CompletableFuture.completedFuture(AgentResponse.info("OK"));
  }
}
``` 