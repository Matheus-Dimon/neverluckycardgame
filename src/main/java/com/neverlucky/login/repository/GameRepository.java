package com.neverlucky.login.repository;

import com.neverlucky.login.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByStatusAndPlayer1Id(Game.GameStatus status, Long player1Id);
    List<Game> findByStatus(Game.GameStatus status);
}
