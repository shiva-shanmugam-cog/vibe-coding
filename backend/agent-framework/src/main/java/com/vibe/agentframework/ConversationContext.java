package com.vibe.agentframework;

import java.util.HashMap;
import java.util.Map;

public class ConversationContext {
  private String conversationId;
  private Map<String, String> attributes = new HashMap<>();

  public ConversationContext() {}

  public ConversationContext(String conversationId, Map<String, String> attributes) {
    this.conversationId = conversationId;
    if (attributes != null) this.attributes.putAll(attributes);
  }

  public String getConversationId() { return conversationId; }
  public void setConversationId(String conversationId) { this.conversationId = conversationId; }

  public Map<String, String> getAttributes() { return attributes; }
  public void setAttributes(Map<String, String> attributes) { this.attributes = attributes; }
} 