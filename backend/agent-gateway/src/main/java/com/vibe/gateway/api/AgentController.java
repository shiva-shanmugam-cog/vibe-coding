package com.vibe.gateway.api;

import com.vibe.agentframework.AgentMessage;
import com.vibe.agentframework.AgentResponse;
import com.vibe.agentframework.ConversationContext;
import com.vibe.gateway.service.AgentOrchestrator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/agents")
public class AgentController {
  private final AgentOrchestrator orchestrator;

  public AgentController(AgentOrchestrator orchestrator) {
    this.orchestrator = orchestrator;
  }

  @PostMapping("/message")
  public CompletableFuture<ResponseEntity<AgentResponse>> postMessage(
      @RequestBody AgentMessage message,
      @RequestHeader(value = "X-Conversation-Id", required = false) String conversationId) {
    ConversationContext ctx = new ConversationContext(conversationId, null);
    return orchestrator.route(ctx, message).thenApply(ResponseEntity::ok);
  }

  @GetMapping("/metrics")
  public ResponseEntity<Map<String, Object>> metrics() {
    return ResponseEntity.ok(orchestrator.snapshotMetrics());
  }
} 