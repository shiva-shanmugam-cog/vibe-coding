package com.vibe.agents.onboarding;

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
public class OnboardingAgent implements Agent {
  private final Counter responseCounter;

  public OnboardingAgent(MeterRegistry meterRegistry) {
    this.responseCounter = meterRegistry.counter("agent_response_time_seconds", "agent", getAgentId());
  }

  @Override
  public String getAgentId() { return "onboarding-assistant"; }

  @Override
  public String getDisplayName() { return "Onboarding Agent"; }

  @Override
  public String getVersion() { return "1.0.0"; }

  @Override
  public CompletableFuture<AgentResponse> processMessage(ConversationContext ctx, AgentMessage msg) {
    responseCounter.increment();
    String type = msg.getType() == null ? "" : msg.getType();
    switch (type) {
      case "CUSTOMER_QUERY" -> {
        String intent = (msg.getPayload() != null && msg.getPayload().get("intent") != null)
          ? String.valueOf(msg.getPayload().get("intent"))
          : "";
        if (intent.toLowerCase().contains("open account")) {
          return CompletableFuture.completedFuture(AgentResponse.interactive(
            "Let's start your account opening. Please provide your full name and address.", Map.of("step", "collect_personal_info")));
        } else if (intent.toLowerCase().contains("upload document")) {
          return CompletableFuture.completedFuture(AgentResponse.interactive(
            "Please upload a government-issued ID.", Map.of("step", "document_upload")));
        } else if (intent.toLowerCase().contains("status")) {
          return CompletableFuture.completedFuture(AgentResponse.info("Your onboarding is in progress."));
        }
        return CompletableFuture.completedFuture(AgentResponse.info("How can I help with your onboarding?"));
      }
      default -> {
        return CompletableFuture.completedFuture(AgentResponse.info("Unsupported message type for onboarding"));
      }
    }
  }
} 