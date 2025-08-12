package com.vibe.gateway.service;

import com.vibe.agentframework.Agent;
import com.vibe.agentframework.AgentHealth;
import com.vibe.agentframework.AgentMessage;
import com.vibe.agentframework.AgentResponse;
import com.vibe.agentframework.ConversationContext;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class AgentOrchestrator {
  private final Map<String, Agent> agentIdToAgent = new HashMap<>();

  public AgentOrchestrator(List<Agent> agents) {
    for (Agent agent : agents) {
      String id = agent.getAgentId();
      if (agentIdToAgent.containsKey(id)) {
        throw new IllegalStateException("Duplicate agent id: " + id);
      }
      agentIdToAgent.put(id, agent);
    }
  }

  public CompletableFuture<AgentResponse> route(ConversationContext context, AgentMessage message) {
    if (message.getTargetAgentId() == null) {
      return CompletableFuture.completedFuture(AgentResponse.error("targetAgentId is required"));
    }
    Agent agent = agentIdToAgent.get(message.getTargetAgentId());
    if (agent == null) {
      return CompletableFuture.completedFuture(AgentResponse.error("Unknown agent: " + message.getTargetAgentId()));
    }
    return agent.processMessage(context, message);
  }

  public Map<String, Object> snapshotMetrics() {
    Map<String, Object> result = new HashMap<>();
    for (Map.Entry<String, Agent> entry : agentIdToAgent.entrySet()) {
      AgentHealth health = Optional.ofNullable(entry.getValue().getHealth()).orElse(AgentHealth.up());
      result.put(entry.getKey(), Map.of(
        "displayName", entry.getValue().getDisplayName(),
        "version", entry.getValue().getVersion(),
        "health", health.getStatus().name(),
        "details", health.getDetails()
      ));
    }
    return Collections.unmodifiableMap(result);
  }
} 