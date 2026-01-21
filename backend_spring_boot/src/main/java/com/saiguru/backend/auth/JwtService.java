package com.saiguru.backend.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationSeconds;

    public JwtService(
        @Value("${saiguru.jwt.secret:saiguru-dev-secret-change-me-please}") String secret,
        @Value("${saiguru.jwt.expirationSeconds:86400}") long expirationSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(UserAccount user) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(expirationSeconds);
        return Jwts.builder()
            .setSubject(user.getUsername())
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expiry))
            .addClaims(Map.of(
                "userId", user.getId(),
                "role", user.getRole().name()
            ))
            .signWith(key)
            .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
    }
}
