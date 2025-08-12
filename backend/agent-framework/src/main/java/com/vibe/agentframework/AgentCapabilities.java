package com.vibe.agentframework;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class AgentCapabilities {
  private final List<String> capabilities = new ArrayList<>();

  public AgentCapabilities() {}

  public AgentCapabilities(List<String> initial) {
    if (initial != null) capabilities.addAll(initial);
  }

  public static AgentCapabilities basic() {
    List<String> base = new ArrayList<>();
    base.add("messaging");
    return new AgentCapabilities(base);
  }

  public List<String> getCapabilities() { return Collections.unmodifiableList(capabilities); }

  public AgentCapabilities add(String capability) { this.capabilities.add(capability); return this; }
} 