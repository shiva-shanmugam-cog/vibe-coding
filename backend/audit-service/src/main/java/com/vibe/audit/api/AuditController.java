package com.vibe.audit.api;

import com.vibe.audit.model.AuditEvent;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit")
public class AuditController {
  private final CopyOnWriteArrayList<AuditEvent> store = new CopyOnWriteArrayList<>();

  @PostMapping
  public ResponseEntity<AuditEvent> ingest(@RequestBody AuditEvent event) {
    store.add(event);
    return ResponseEntity.ok(event);
  }

  @GetMapping("/search")
  public ResponseEntity<List<AuditEvent>> search(
      @RequestParam(value = "actor", required = false) String actor,
      @RequestParam(value = "resource", required = false) String resource
  ) {
    List<AuditEvent> result = store.stream()
      .filter(e -> actor == null || Objects.equals(actor, e.getActor()))
      .filter(e -> resource == null || Objects.equals(resource, e.getResource()))
      .collect(Collectors.toList());
    return ResponseEntity.ok(result);
  }
} 