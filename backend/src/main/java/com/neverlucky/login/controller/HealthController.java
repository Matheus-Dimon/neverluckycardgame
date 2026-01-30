package com.neverlucky.login.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "online");
        response.put("service", "NeverLucky Backend API");
        response.put("message", "Backend is running successfully!");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoints", new String[]{
            "/health - Health check",
            "/api/auth/register - User registration",
            "/api/auth/login - User login",
            "/api/game/* - Game endpoints",
            "/api/friends/* - Friends endpoints"
        });
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "neverlucky-backend");
        return response;
    }
}
