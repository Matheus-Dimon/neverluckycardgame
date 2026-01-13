package com.neverlucky.login.repository;

import com.neverlucky.login.model.FriendRequest;
import com.neverlucky.login.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    List<FriendRequest> findByReceiverAndStatus(User receiver, FriendRequest.Status status);

    List<FriendRequest> findBySenderAndStatus(User sender, FriendRequest.Status status);
}
