package com.vibe.gateway.api;

import com.vibe.agentframework.AgentMessage;
import com.vibe.agentframework.AgentResponse;
import com.vibe.agentframework.ConversationContext;
import com.vibe.gateway.service.AgentOrchestrator;
import com.vibe.gateway.service.KafkaEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
  private final AgentOrchestrator orchestrator;
  private final KafkaEventPublisher eventPublisher;

  public AgentController(AgentOrchestrator orchestrator, KafkaEventPublisher eventPublisher) {
    this.orchestrator = orchestrator;
    this.eventPublisher = eventPublisher;
  }

  @PostMapping("/message")
  public CompletableFuture<ResponseEntity<AgentResponse>> postMessage(
      @RequestBody AgentMessage message,
      @RequestHeader(value = "X-Conversation-Id", required = false) String conversationId) {
    ConversationContext ctx = new ConversationContext(conversationId, null);
    eventPublisher.publishAgentInbound(message);
    return orchestrator.route(ctx, message)
      .thenApply(response -> {
        // Publish outbound after processing
        AgentMessage outbound = new AgentMessage(
          message.getMessageId(),
          message.getTargetAgentId(),
          message.getActor(),
          "response",
          Map.of("status", response.getType().name(), "payload", response.getData()),
          message.getTimestamp()
        );
        eventPublisher.publishAgentOutbound(outbound);
        return ResponseEntity.ok(response);
      });
  }

  @GetMapping("/metrics")
  public ResponseEntity<Map<String, Object>> metrics() {
    return ResponseEntity.ok(orchestrator.snapshotMetrics());
  }
} 