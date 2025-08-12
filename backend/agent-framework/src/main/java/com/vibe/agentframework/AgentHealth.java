package com.vibe.agentframework;

import java.util.Collections;
import java.util.Map;

public class AgentHealth {
  public enum Status { UP, DOWN, DEGRADED }

  private Status status;
  private Map<String, Object> details;

  public AgentHealth() {}

  public AgentHealth(Status status, Map<String, Object> details) {
    this.status = status;
    this.details = details == null ? Collections.emptyMap() : details;
  }

  public static AgentHealth up() { return new AgentHealth(Status.UP, Collections.emptyMap()); }
  public static AgentHealth down(String reason) { return new AgentHealth(Status.DOWN, Map.of("reason", reason)); }
  public static AgentHealth degraded(String reason) { return new AgentHealth(Status.DEGRADED, Map.of("reason", reason)); }

  public Status getStatus() { return status; }
  public void setStatus(Status status) { this.status = status; }
  public Map<String, Object> getDetails() { return details; }
  public void setDetails(Map<String, Object> details) { this.details = details; }
} 