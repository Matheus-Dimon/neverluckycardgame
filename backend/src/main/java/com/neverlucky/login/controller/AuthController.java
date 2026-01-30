package com.neverlucky.login.controller;

import com.neverlucky.login.config.JwtUtil;
import com.neverlucky.login.model.User;
import com.neverlucky.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        if (user.getUsername() == null || user.getUsername().isBlank()) {
            response.put("error", "Username is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            response.put("error", "Password is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (userService.findByUsername(user.getUsername()) != null) {
            response.put("error", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        userService.register(user);

        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        if (user.getUsername() == null || user.getPassword() == null) {
            response.put("error", "Username and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        boolean authenticated = userService.authenticate(
                user.getUsername(),
                user.getPassword()
        );

        if (!authenticated) {
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        User loggedUser = userService.findByUsername(user.getUsername());
        userService.setOnlineStatus(user.getUsername(), true);

        String token = jwtUtil.generateToken(user.getUsername());

        response.put("token", token);
        response.put("id", loggedUser.getId());
        response.put("username", loggedUser.getUsername());

        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGOUT (JWT REQUIRED)
    // =========================
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        if (authentication == null) {
            response.put("error", "Unauthorized");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        String username = authentication.getName();
        userService.logout(username);

        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
