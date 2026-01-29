package com.neverlucky.login.controller;

import com.neverlucky.login.dto.GameDTO;
import com.neverlucky.login.model.User;
import com.neverlucky.login.service.GameService;
import com.neverlucky.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private UserService userService;

    // =========================
    // HELPERS
    // =========================
    private User getCurrentUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("User not authenticated");
        }

        User user = userService.findByUsername(auth.getName());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

    private boolean isPlayer(User user, GameDTO game, String playerKey) {
        if (user == null || game == null || playerKey == null) return false;

        return ("player1".equals(playerKey) && user.getId().equals(game.getPlayer1Id()))
            || ("player2".equals(playerKey) && user.getId().equals(game.getPlayer2Id()));
    }

    // =========================
    // CREATE GAME
    // =========================
    @PostMapping("/create")
    public ResponseEntity<GameDTO> createGame(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(gameService.createGame(user.getId()));
    }

    // =========================
    // INVITES
    // =========================
    @PostMapping("/invite/{friendId}")
    public ResponseEntity<GameDTO> inviteFriend(
            @PathVariable Long friendId,
            Authentication auth
    ) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(gameService.inviteFriend(user.getId(), friendId));
    }

    @PostMapping("/{gameId}/accept")
    public ResponseEntity<GameDTO> acceptInvite(
            @PathVariable Long gameId,
            Authentication auth
    ) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(gameService.acceptInvite(gameId, user.getId()));
    }

    @PostMapping("/{gameId}/decline")
    public ResponseEntity<GameDTO> declineInvite(
            @PathVariable Long gameId,
            Authentication auth
    ) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(gameService.declineInvite(gameId, user.getId()));
    }

    // =========================
    // LISTS
    // =========================
    @GetMapping("/pending")
    public ResponseEntity<List<GameDTO>> pendingInvites(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(gameService.getPendingInvites(user.getId()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<GameDTO>> activeGames(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(gameService.getActiveGamesForUser(user.getId()));
    }

    // =========================
    // GAME FLOW
    // =========================
    @GetMapping("/{gameId}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Long gameId) {
        GameDTO game = gameService.getGame(gameId);
        return game == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/start")
    public ResponseEntity<GameDTO> start(@PathVariable Long gameId) {
        return ResponseEntity.ok(gameService.startGame(gameId));
    }

    @PostMapping("/{gameId}/end-turn")
    public ResponseEntity<GameDTO> endTurn(
            @PathVariable Long gameId,
            Authentication auth
    ) {
        User user = getCurrentUser(auth);
        GameDTO game = gameService.getGame(gameId);

        if (!isPlayer(user, game, game.getCurrentPlayerKey())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(gameService.endTurn(gameId));
    }

    // =========================
    // ACTIONS
    // =========================
    @PostMapping("/{gameId}/play-card")
    public ResponseEntity<GameDTO> playCard(
            @PathVariable Long gameId,
            @RequestParam String cardId,
            @RequestParam String playerKey,
            Authentication auth
    ) {
        User user = getCurrentUser(auth);
        GameDTO game = gameService.getGame(gameId);

        if (!isPlayer(user, game, playerKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(gameService.playCard(gameId, cardId, playerKey));
    }

    @PostMapping("/{gameId}/attack")
    public ResponseEntity<GameDTO> attack(
            @PathVariable Long gameId,
            @RequestParam String attackerId,
            @RequestParam String targetId,
            @RequestParam boolean targetIsHero,
            @RequestParam String playerKey,
            Authentication auth
    ) {
        User user = getCurrentUser(auth);
        GameDTO game = gameService.getGame(gameId);

        if (!isPlayer(user, game, playerKey)
                || !playerKey.equals(game.getCurrentPlayerKey())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                gameService.attack(gameId, attackerId, targetId, targetIsHero, playerKey)
        );
    }
}
