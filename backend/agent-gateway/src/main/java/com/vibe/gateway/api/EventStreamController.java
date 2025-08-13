package com.vibe.gateway.api;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class EventStreamController {

  @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
  private String bootstrapServers;

  private final ExecutorService executor = Executors.newCachedThreadPool();

  @GetMapping(value = "/ws/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter stream(@RequestParam(name = "topics") String topicsCsv) {
    List<String> topics = Arrays.stream(topicsCsv.split(","))
      .map(String::trim)
      .filter(s -> !s.isEmpty())
      .toList();

    SseEmitter emitter = new SseEmitter(0L);
    Properties props = new Properties();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "dashboard-" + UUID.randomUUID());
    props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
    props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");

    KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
    consumer.subscribe(topics);

    AtomicBoolean running = new AtomicBoolean(true);

    emitter.onCompletion(() -> { running.set(false); consumer.wakeup(); consumer.close(); });
    emitter.onTimeout(() -> { running.set(false); consumer.wakeup(); consumer.close(); });
    emitter.onError((ex) -> { running.set(false); consumer.wakeup(); consumer.close(); });

    executor.submit(() -> {
      try {
        // Initial heartbeat so client connects immediately
        try { emitter.send(SseEmitter.event().name("ready").data("ok")); } catch (IOException ignore) {}
        while (running.get()) {
          ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
          for (ConsumerRecord<String, String> rec : records) {
            Map<String, Object> payload = new HashMap<>();
            payload.put("topic", rec.topic());
            payload.put("key", rec.key());
            payload.put("timestamp", rec.timestamp());
            payload.put("value", rec.value());
            try {
              emitter.send(SseEmitter.event().name("message").data(payload));
            } catch (IOException e) {
              running.set(false);
              break;
            }
          }
        }
      } catch (Exception ignored) {
      } finally {
        try { emitter.complete(); } catch (Exception ignored) {}
        try { consumer.close(); } catch (Exception ignored) {}
      }
    });

    return emitter;
  }
} 