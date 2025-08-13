package com.vibe.gateway.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vibe.agentframework.AgentMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaEventPublisher {
  private static final Logger log = LoggerFactory.getLogger(KafkaEventPublisher.class);

  private final KafkaTemplate<String, String> kafkaTemplate;
  private final ObjectMapper objectMapper;

  public KafkaEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
    this.kafkaTemplate = kafkaTemplate;
    this.objectMapper = objectMapper;
  }

  public void publishAgentInbound(AgentMessage message) {
    publish("agent.inbound", message);
  }

  public void publishAgentOutbound(AgentMessage message) {
    publish("agent.outbound", message);
  }

  public void publishAgentEvent(String event) {
    kafkaTemplate.send("agent.events", event);
  }

  private void publish(String topic, AgentMessage message) {
    try {
      String value = objectMapper.writeValueAsString(message);
      kafkaTemplate.send(topic, message.getMessageId(), value);
    } catch (JsonProcessingException e) {
      log.warn("Failed to serialize message for topic {}: {}", topic, e.getMessage());
      kafkaTemplate.send(topic, message.getMessageId(), "{}");
    }
  }
} 