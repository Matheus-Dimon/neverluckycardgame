package com.neverlucky.login.controller;

import com.neverlucky.login.model.FriendRequest;
import com.neverlucky.login.model.User;
import com.neverlucky.login.service.FriendService;
import com.neverlucky.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin
public class FriendController {

    @Autowired
    private FriendService friendService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalStateException("Unauthorized");
        }

        User user = userService.findByUsername(authentication.getName());
        if (user == null) {
            throw new IllegalStateException("User not found");
        }

        return user;
    }

    // =========================
    // SEARCH USERS
    // =========================
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String query,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        return ResponseEntity.ok(
                friendService.searchUsers(query, currentUser)
        );
    }

    // =========================
    // SEND FRIEND REQUEST
    // =========================
    @PostMapping("/request/{receiverId}")
    public ResponseEntity<Map<String, Object>> sendFriendRequest(
            @PathVariable Long receiverId,
            Authentication authentication
    ) {
        Map<String, Object> response = new HashMap<>();
        User sender = getCurrentUser(authentication);

        User receiver = userService.findById(receiverId).orElse(null);
        if (receiver == null) {
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (sender.getId().equals(receiverId)) {
            response.put("error", "Cannot add yourself");
            return ResponseEntity.badRequest().body(response);
        }

        var request = friendService.sendFriendRequest(sender, receiver);
        if (request.isEmpty()) {
            response.put("error", "Request already exists or users are already friends");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        response.put("message", "Friend request sent");
        return ResponseEntity.ok(response);
    }

    // =========================
    // PENDING REQUESTS
    // =========================
    @GetMapping("/requests/pending")
    public ResponseEntity<List<FriendRequest>> getPendingRequests(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(friendService.getPendingRequests(user));
    }

    // =========================
    // ACCEPT REQUEST
    // =========================
    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<Map<String, Object>> acceptFriendRequest(
            @PathVariable Long requestId,
            Authentication authentication
    ) {
        Map<String, Object> response = new HashMap<>();
        User user = getCurrentUser(authentication);

        if (!friendService.acceptFriendRequest(requestId, user)) {
            response.put("error", "Invalid request");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("message", "Friend request accepted");
        return ResponseEntity.ok(response);
    }

    // =========================
    // REJECT REQUEST
    // =========================
    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<Map<String, Object>> rejectFriendRequest(
            @PathVariable Long requestId,
            Authentication authentication
    ) {
        Map<String, Object> response = new HashMap<>();
        User user = getCurrentUser(authentication);

        if (!friendService.rejectFriendRequest(requestId, user)) {
            response.put("error", "Invalid request");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("message", "Friend request rejected");
        return ResponseEntity.ok(response);
    }

    // =========================
    // FRIEND LIST
    // =========================
    @GetMapping("/list")
    public ResponseEntity<List<User>> getFriends(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(friendService.getFriends(user));
    }

    // =========================
    // SENT REQUESTS
    // =========================
    @GetMapping("/requests/sent")
    public ResponseEntity<List<FriendRequest>> getSentRequests(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return ResponseEntity.ok(friendService.getSentRequests(user));
    }

    // =========================
    // REMOVE FRIEND
    // =========================
    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<Map<String, Object>> removeFriend(
            @PathVariable Long friendId,
            Authentication authentication
    ) {
        Map<String, Object> response = new HashMap<>();
        User user = getCurrentUser(authentication);

        if (!friendService.removeFriend(user, friendId)) {
            response.put("error", "Failed to remove friend");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("message", "Friend removed successfully");
        return ResponseEntity.ok(response);
    }
}
