package com.neverlucky.login.controller;

import com.neverlucky.login.model.FriendRequest;
import com.neverlucky.login.model.User;
import com.neverlucky.login.service.FriendService;
import com.neverlucky.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class FriendController {

    @Autowired
    private FriendService friendService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        return userService.findByUsername(username);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<User> users = friendService.searchUsers(query, currentUser);
        return ResponseEntity.ok(users);
    }

@PostMapping("/request/{receiverId}")
    public ResponseEntity<?> sendFriendRequest(@PathVariable Long receiverId, Authentication authentication) {
        try {
            User sender = getCurrentUser(authentication);
            User receiver = userService.findById(receiverId).orElse(null);

            if (receiver == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            if (sender.getId().equals(receiverId)) {
                return ResponseEntity.badRequest().body("Cannot send friend request to yourself");
            }

            var request = friendService.sendFriendRequest(sender, receiver);
            if (request.isPresent()) {
                return ResponseEntity.ok("Friend request sent");
            } else {
                return ResponseEntity.status(409).body("Friend request already exists or users are already friends");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send friend request: " + e.getMessage());
        }
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<FriendRequest>> getPendingRequests(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<FriendRequest> requests = friendService.getPendingRequests(user);
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long requestId, Authentication authentication) {
        User receiver = getCurrentUser(authentication);
        boolean success = friendService.acceptFriendRequest(requestId, receiver);
        if (success) {
            return ResponseEntity.ok("Friend request accepted");
        } else {
            return ResponseEntity.badRequest().body("Invalid request");
        }
    }

    @PostMapping("/requests/{requestId}/reject")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long requestId, Authentication authentication) {
        User receiver = getCurrentUser(authentication);
        boolean success = friendService.rejectFriendRequest(requestId, receiver);
        if (success) {
            return ResponseEntity.ok("Friend request rejected");
        } else {
            return ResponseEntity.badRequest().body("Invalid request");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> getFriends(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<User> friends = friendService.getFriends(user);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/requests/sent")
    public ResponseEntity<List<FriendRequest>> getSentRequests(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<FriendRequest> requests = friendService.getSentRequests(user);
        return ResponseEntity.ok(requests);
    }

    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable Long friendId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        boolean success = friendService.removeFriend(user, friendId);
        if (success) {
            return ResponseEntity.ok("Friend removed successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to remove friend");
        }
    }
}
