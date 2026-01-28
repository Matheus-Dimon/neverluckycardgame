package com.neverlucky.login.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${JWT_SECRET:}")
    private String jwtSecret;

    private Key secretKey;

    private static final long JWT_EXPIRATION = 1000 * 60 * 60 * 24; // 24h

    @PostConstruct
    public void init() {
        // Evita loop infinito no deploy
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException(
                "JWT_SECRET environment variable must be set and not empty"
            );
        }

        // JJWT exige no mínimo 32 caracteres para HS256
        if (jwtSecret.length() < 32) {
            throw new IllegalStateException(
                "JWT_SECRET must be at least 32 characters long"
            );
        }

        this.secretKey = Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    /* ========================
       TOKEN GENERATION
       ======================== */

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(secretKey)
                .compact();
    }

    /* ========================
       TOKEN EXTRACTION
       ======================== */

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        token = cleanToken(token);

        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /* ========================
       TOKEN VALIDATION
       ======================== */

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, String username) {
        try {
            final String extractedUsername = extractUsername(token);
            return extractedUsername.equals(username) && !isTokenExpired(token);
        } catch (Exception e) {
            // Qualquer erro invalida o token (sem crashar o app)
            return false;
        }
    }

    /* ========================
       HELPERS
       ======================== */

    private String cleanToken(String token) {
        if (token == null) {
            throw new IllegalArgumentException("Token cannot be null");
        }

        if (token.startsWith("Bearer ")) {
            return token.substring(7);
        }

        return token;
    }
}
