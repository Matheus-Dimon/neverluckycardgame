package com.neverlucky.login.repository;

import com.neverlucky.login.model.Friendship;
import com.neverlucky.login.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE (f.user1 = :user OR f.user2 = :user)")
    List<Friendship> findFriendsByUser(@Param("user") User user);

    Optional<Friendship> findByUser1AndUser2(User user1, User user2);

    Optional<Friendship> findByUser1AndUser2OrUser2AndUser1(User user1, User user2, User user2Alt, User user1Alt);
}
