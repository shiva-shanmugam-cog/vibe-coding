package com.vibe.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.vibe"})
public class AgentGatewayApplication {
  public static void main(String[] args) {
    SpringApplication.run(AgentGatewayApplication.class, args);
  }
} 