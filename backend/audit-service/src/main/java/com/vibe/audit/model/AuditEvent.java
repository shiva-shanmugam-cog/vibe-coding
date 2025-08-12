package com.vibe.audit.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditEvent {
  private UUID id;
  private Instant timestamp;
  private String actor;
  private String resource;
  private String action;
  private String ip;
  private String userAgent;
  private Map<String, Object> payload;

  public AuditEvent() {
    this.id = UUID.randomUUID();
    this.timestamp = Instant.now();
  }

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public Instant getTimestamp() { return timestamp; }
  public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
  public String getActor() { return actor; }
  public void setActor(String actor) { this.actor = actor; }
  public String getResource() { return resource; }
  public void setResource(String resource) { this.resource = resource; }
  public String getAction() { return action; }
  public void setAction(String action) { this.action = action; }
  public String getIp() { return ip; }
  public void setIp(String ip) { this.ip = ip; }
  public String getUserAgent() { return userAgent; }
  public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
  public Map<String, Object> getPayload() { return payload; }
  public void setPayload(Map<String, Object> payload) { this.payload = payload; }
} 