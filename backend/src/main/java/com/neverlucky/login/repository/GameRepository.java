package com.neverlucky.login.repository;

import com.neverlucky.login.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    // Custom queries can be added here if needed
}
