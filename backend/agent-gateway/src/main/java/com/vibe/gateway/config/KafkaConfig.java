package com.vibe.gateway.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
  @Bean
  public NewTopic agentInboundTopic() {
    return TopicBuilder.name("agent.inbound").partitions(1).replicas(1).build();
  }

  @Bean
  public NewTopic agentOutboundTopic() {
    return TopicBuilder.name("agent.outbound").partitions(1).replicas(1).build();
  }

  @Bean
  public NewTopic agentEventsTopic() {
    return TopicBuilder.name("agent.events").partitions(1).replicas(1).build();
  }

  @Bean
  public NewTopic transactionsEventsTopic() {
    return TopicBuilder.name("transactions.events").partitions(1).replicas(1).build();
  }
} 