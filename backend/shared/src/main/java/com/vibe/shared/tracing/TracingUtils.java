package com.vibe.shared.tracing;

public final class TracingUtils {
  private TracingUtils() {}

  public static AutoCloseable startSpan(String name) {
    // Placeholder span; integrate with OpenTelemetry
    return () -> {};
  }
} 