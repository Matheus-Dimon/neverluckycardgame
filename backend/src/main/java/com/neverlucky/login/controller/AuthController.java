package com.neverlucky.login.controller;

import com.neverlucky.login.config.JwtUtil;
import com.neverlucky.login.model.User;
import com.neverlucky.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        if (userService.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        userService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        if (user.getUsername() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        boolean authenticated = userService.authenticate(
                user.getUsername(),
                user.getPassword()
        );

        if (!authenticated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials");
        }

        User loggedUser = userService.findByUsername(user.getUsername());
        userService.setOnlineStatus(user.getUsername(), true);

        String token = jwtUtil.generateToken(user.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", loggedUser.getId());
        response.put("username", loggedUser.getUsername());

        return ResponseEntity.ok(response);
    }

    // =========================
    // LOGOUT (JWT REQUIRED)
    // =========================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> request) {

        String username = request.get("username");

        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        userService.logout(username);
        return ResponseEntity.ok("Logged out successfully");
    }
}
