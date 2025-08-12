package com.vibe.agentframework;

import java.util.concurrent.CompletableFuture;

public interface Agent {
  String getAgentId();
  String getDisplayName();
  String getVersion();

  default void initialize() {}

  CompletableFuture<AgentResponse> processMessage(ConversationContext context, AgentMessage message);

  default void handleAgentMessage(AgentMessage agentMessage) {}

  default AgentHealth getHealth() { return AgentHealth.up(); }

  default AgentCapabilities getCapabilities() { return AgentCapabilities.basic(); }
} 