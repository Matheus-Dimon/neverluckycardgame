package com.neverlucky.login.service;

import com.neverlucky.login.model.FriendRequest;
import com.neverlucky.login.model.Friendship;
import com.neverlucky.login.model.User;
import com.neverlucky.login.repository.FriendRequestRepository;
import com.neverlucky.login.repository.FriendshipRepository;
import com.neverlucky.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    public List<User> searchUsers(String query, User currentUser) {
        return userRepository.findByUsernameContainingIgnoreCase(query)
                .stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
    }

    public Optional<FriendRequest> sendFriendRequest(User sender, User receiver) {
        // Check if users are already friends
        if (areFriends(sender, receiver)) {
            return Optional.empty();
        }

        // Check for existing pending request
        Optional<FriendRequest> existingRequest = friendRequestRepository.findBySenderAndReceiver(sender, receiver);
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == FriendRequest.Status.PENDING) {
            return Optional.empty(); // Already sent
        }

        // Check reverse request
        existingRequest = friendRequestRepository.findBySenderAndReceiver(receiver, sender);
        if (existingRequest.isPresent() && existingRequest.get().getStatus() == FriendRequest.Status.PENDING) {
            return Optional.empty(); // Receiver already sent request
        }

        FriendRequest request = new FriendRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        return Optional.of(friendRequestRepository.save(request));
    }

    @Transactional
    public boolean acceptFriendRequest(Long requestId, User receiver) {
        Optional<FriendRequest> requestOpt = friendRequestRepository.findById(requestId);
        if (requestOpt.isEmpty() || !requestOpt.get().getReceiver().getId().equals(receiver.getId())) {
            return false;
        }

        FriendRequest request = requestOpt.get();
        request.setStatus(FriendRequest.Status.ACCEPTED);
        friendRequestRepository.save(request);

        // Create friendship
        Friendship friendship = new Friendship();
        friendship.setUser1(request.getSender());
        friendship.setUser2(request.getReceiver());
        friendshipRepository.save(friendship);

        return true;
    }

    public boolean rejectFriendRequest(Long requestId, User receiver) {
        Optional<FriendRequest> requestOpt = friendRequestRepository.findById(requestId);
        if (requestOpt.isEmpty() || !requestOpt.get().getReceiver().getId().equals(receiver.getId())) {
            return false;
        }

        FriendRequest request = requestOpt.get();
        request.setStatus(FriendRequest.Status.REJECTED);
        friendRequestRepository.save(request);
        return true;
    }

    public List<FriendRequest> getPendingRequests(User user) {
        return friendRequestRepository.findByReceiverAndStatus(user, FriendRequest.Status.PENDING);
    }

    public List<User> getFriends(User user) {
        return friendshipRepository.findFriendsByUser(user)
                .stream()
                .map(f -> f.getUser1().getId().equals(user.getId()) ? f.getUser2() : f.getUser1())
                .collect(Collectors.toList());
    }

    public boolean areFriends(User user1, User user2) {
        return friendshipRepository.findByUser1AndUser2(user1, user2).isPresent() ||
               friendshipRepository.findByUser1AndUser2(user2, user1).isPresent();
    }

    public List<FriendRequest> getSentRequests(User user) {
        return friendRequestRepository.findBySenderAndStatus(user, FriendRequest.Status.PENDING);
    }

    @Transactional
    public boolean removeFriend(User user, Long friendId) {
        User friend = userRepository.findById(friendId).orElse(null);
        if (friend == null) {
            return false;
        }

        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user, friend);
        if (friendship.isEmpty()) {
            friendship = friendshipRepository.findByUser1AndUser2(friend, user);
        }

        if (friendship.isPresent()) {
            friendshipRepository.delete(friendship.get());
            return true;
        }

        return false;
    }
}
