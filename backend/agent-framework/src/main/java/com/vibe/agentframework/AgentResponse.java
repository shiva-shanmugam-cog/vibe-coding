package com.vibe.agentframework;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.Collections;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AgentResponse {
  private AgentResponseType type;
  private String message;
  private Map<String, Object> data;
  private Instant timestamp;

  public AgentResponse() {}

  public AgentResponse(AgentResponseType type, String message, Map<String, Object> data, Instant timestamp) {
    this.type = type;
    this.message = message;
    this.data = data == null ? Collections.emptyMap() : data;
    this.timestamp = timestamp == null ? Instant.now() : timestamp;
  }

  public static AgentResponse info(String message) { return new AgentResponse(AgentResponseType.INFO, message, Collections.emptyMap(), Instant.now()); }
  public static AgentResponse approved(String message, Map<String, Object> data) { return new AgentResponse(AgentResponseType.APPROVED, message, data, Instant.now()); }
  public static AgentResponse securityAlert(String message, Map<String, Object> data) { return new AgentResponse(AgentResponseType.SECURITY_ALERT, message, data, Instant.now()); }
  public static AgentResponse interactive(String message, Map<String, Object> data) { return new AgentResponse(AgentResponseType.INTERACTIVE, message, data, Instant.now()); }
  public static AgentResponse error(String message) { return new AgentResponse(AgentResponseType.ERROR, message, Collections.emptyMap(), Instant.now()); }

  public AgentResponseType getType() { return type; }
  public void setType(AgentResponseType type) { this.type = type; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public Map<String, Object> getData() { return data; }
  public void setData(Map<String, Object> data) { this.data = data; }
  public Instant getTimestamp() { return timestamp; }
  public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
} 