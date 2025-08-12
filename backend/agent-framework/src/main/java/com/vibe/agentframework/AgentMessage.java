package com.vibe.agentframework;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AgentMessage {
  private String messageId;
  private String targetAgentId;
  private String actor;
  private String type;
  private Map<String, Object> payload;
  private Instant timestamp;

  public AgentMessage() {}

  public AgentMessage(String messageId, String targetAgentId, String actor, String type, Map<String, Object> payload, Instant timestamp) {
    this.messageId = messageId;
    this.targetAgentId = targetAgentId;
    this.actor = actor;
    this.type = type;
    this.payload = payload;
    this.timestamp = timestamp == null ? Instant.now() : timestamp;
  }

  public String getMessageId() { return messageId; }
  public void setMessageId(String messageId) { this.messageId = messageId; }

  public String getTargetAgentId() { return targetAgentId; }
  public void setTargetAgentId(String targetAgentId) { this.targetAgentId = targetAgentId; }

  public String getActor() { return actor; }
  public void setActor(String actor) { this.actor = actor; }

  public String getType() { return type; }
  public void setType(String type) { this.type = type; }

  public Map<String, Object> getPayload() { return payload; }
  public void setPayload(Map<String, Object> payload) { this.payload = payload; }

  public Instant getTimestamp() { return timestamp; }
  public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

  @JsonProperty("payload")
  public Map<String, Object> payload() { return payload; }
} 