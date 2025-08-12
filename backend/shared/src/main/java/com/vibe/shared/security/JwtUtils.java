package com.vibe.shared.security;

import java.util.Optional;

public final class JwtUtils {
  private JwtUtils() {}

  public static Optional<String> extractUsernameFromJwt(String bearerToken) {
    if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
      return Optional.empty();
    }
    // Placeholder parsing; integrate with JWT library if needed
    return Optional.empty();
  }
} 