package com.neverlucky.login.controller;

import com.neverlucky.login.dto.GameDTO;
import com.neverlucky.login.model.User;
import com.neverlucky.login.service.GameService;
import com.neverlucky.login.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private UserService userService;

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        return userService.findByUsername(username);
    }

    private boolean isPlayerInGame(User user, Long gameId, String playerKey) {
        GameDTO game = gameService.getGame(gameId);
        if (game == null) return false;

        if ("player1".equals(playerKey) && game.getPlayer1Id() != null) {
            return game.getPlayer1Id().equals(user.getId());
        } else if ("player2".equals(playerKey) && game.getPlayer2Id() != null) {
            return game.getPlayer2Id().equals(user.getId());
        }
        return false;
    }

@PostMapping("/create")
    public ResponseEntity<GameDTO> createGame(@RequestParam Long player1Id) {
        try {
            GameDTO game = gameService.createGame(player1Id);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/invite-friend")
    public ResponseEntity<GameDTO> inviteFriend(@RequestParam Long player1Id, @RequestParam Long friendId, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!currentUser.getId().equals(player1Id)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.inviteFriend(player1Id, friendId);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/accept-invite")
    public ResponseEntity<GameDTO> acceptInvite(@PathVariable Long gameId, @RequestParam Long player2Id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!currentUser.getId().equals(player2Id)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.acceptInvite(gameId, player2Id);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/decline-invite")
    public ResponseEntity<GameDTO> declineInvite(@PathVariable Long gameId, @RequestParam Long playerId, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!currentUser.getId().equals(playerId)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.declineInvite(gameId, playerId);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@GetMapping("/pending-invites/{userId}")
    public ResponseEntity<java.util.List<GameDTO>> getPendingInvites(@PathVariable Long userId, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).build();
            }
            java.util.List<GameDTO> invites = gameService.getPendingInvites(userId);
            if (invites == null) {
                return ResponseEntity.status(404).build();
            }
            return ResponseEntity.ok(invites);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

@GetMapping("/active-games/{userId}")
    public ResponseEntity<java.util.List<GameDTO>> getActiveGamesForUser(@PathVariable Long userId, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!currentUser.getId().equals(userId)) {
                return ResponseEntity.status(403).build();
            }
            java.util.List<GameDTO> games = gameService.getActiveGamesForUser(userId);
            if (games == null) {
                return ResponseEntity.status(404).build();
            }
            return ResponseEntity.ok(games);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

@GetMapping("/{gameId}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Long gameId) {
        try {
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/start")
    public ResponseEntity<GameDTO> startGame(@PathVariable Long gameId) {
        try {
            GameDTO game = gameService.startGame(gameId);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/play-card")
    public ResponseEntity<GameDTO> playCard(
            @PathVariable Long gameId,
            @RequestParam String cardId,
            @RequestParam String playerKey,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!isPlayerInGame(currentUser, gameId, playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.playCard(gameId, cardId, playerKey);
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/end-turn")
    public ResponseEntity<GameDTO> endTurn(@PathVariable Long gameId, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            if (!isPlayerInGame(currentUser, gameId, game.getCurrentPlayerKey())) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO updatedGame = gameService.endTurn(gameId);
            return ResponseEntity.ok(updatedGame);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/hero-power")
    public ResponseEntity<GameDTO> useHeroPower(
            @PathVariable Long gameId,
            @RequestParam String playerKey,
            @RequestParam String powerId,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!isPlayerInGame(currentUser, gameId, playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            if (!game.getCurrentPlayerKey().equals(playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO updatedGame = gameService.useHeroPower(gameId, playerKey, powerId);
            return ResponseEntity.ok(updatedGame);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/attack")
    public ResponseEntity<GameDTO> attack(
            @PathVariable Long gameId,
            @RequestParam String attackerId,
            @RequestParam String targetId,
            @RequestParam Boolean targetIsHero,
            @RequestParam String playerKey,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!isPlayerInGame(currentUser, gameId, playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            if (!game.getCurrentPlayerKey().equals(playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO updatedGame = gameService.attack(gameId, attackerId, targetId, targetIsHero, playerKey);
            return ResponseEntity.ok(updatedGame);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/select-passive-skills")
    public ResponseEntity<GameDTO> selectPassiveSkills(
            @PathVariable Long gameId,
            @RequestParam String playerKey,
            @RequestBody java.util.List<String> passiveSkills,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!isPlayerInGame(currentUser, gameId, playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            if (!game.getCurrentPlayerKey().equals(playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO updatedGame = gameService.selectPassiveSkills(gameId, playerKey, passiveSkills);
            return ResponseEntity.ok(updatedGame);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/select-deck")
    public ResponseEntity<GameDTO> selectDeck(
            @PathVariable Long gameId,
            @RequestParam String playerKey,
            @RequestBody java.util.List<String> deckCards,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!isPlayerInGame(currentUser, gameId, playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            if (!game.getCurrentPlayerKey().equals(playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO updatedGame = gameService.selectDeck(gameId, playerKey, deckCards);
            return ResponseEntity.ok(updatedGame);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

@PostMapping("/{gameId}/select-hero-powers")
    public ResponseEntity<GameDTO> selectHeroPowers(
            @PathVariable Long gameId,
            @RequestParam String playerKey,
            @RequestBody java.util.List<String> heroPowers,
            Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            if (!isPlayerInGame(currentUser, gameId, playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO game = gameService.getGame(gameId);
            if (game == null) {
                return ResponseEntity.status(404).body(null);
            }
            if (!game.getCurrentPlayerKey().equals(playerKey)) {
                return ResponseEntity.status(403).body(null);
            }
            GameDTO updatedGame = gameService.selectHeroPowers(gameId, playerKey, heroPowers);
            return ResponseEntity.ok(updatedGame);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
