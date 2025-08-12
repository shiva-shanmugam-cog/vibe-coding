package com.vibe.agents.fraud;

import com.vibe.agentframework.Agent;
import com.vibe.agentframework.AgentMessage;
import com.vibe.agentframework.AgentResponse;
import com.vibe.agentframework.ConversationContext;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Component
public class FraudDetectionAgent implements Agent {
  private final Counter alertsCounter;
  private final Counter blockedCounter;

  public FraudDetectionAgent(MeterRegistry meterRegistry) {
    this.alertsCounter = meterRegistry.counter("fraud_detection_alerts_total");
    this.blockedCounter = meterRegistry.counter("blocked_transactions_total");
  }

  @Override
  public String getAgentId() { return "fraud-detection-engine"; }

  @Override
  public String getDisplayName() { return "Fraud Detection Agent"; }

  @Override
  public String getVersion() { return "1.0.0"; }

  @Override
  public CompletableFuture<AgentResponse> processMessage(ConversationContext ctx, AgentMessage msg) {
    double amount = 0.0;
    if (msg.getPayload() != null && msg.getPayload().get("amount") instanceof Number n) {
      amount = n.doubleValue();
    }
    if (amount > 10000) {
      alertsCounter.increment();
      blockedCounter.increment();
      return CompletableFuture.completedFuture(
        AgentResponse.securityAlert("High-value transaction flagged", Map.of("amount", amount, "action", "BLOCK"))
      );
    }
    return CompletableFuture.completedFuture(
      AgentResponse.approved("Transaction allowed", Map.of("amount", amount, "action", "ALLOW"))
    );
  }
} 