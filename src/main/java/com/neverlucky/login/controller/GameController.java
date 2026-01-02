package com.neverlucky.login.controller;

import com.neverlucky.login.dto.GameDTO;
import com.neverlucky.login.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/create")
    public ResponseEntity<GameDTO> createGame(@RequestParam Long player1Id) {
        GameDTO game = gameService.createGame(player1Id);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/invite-friend")
    public ResponseEntity<GameDTO> inviteFriend(@RequestParam Long player1Id, @RequestParam Long friendId) {
        // Verify they are friends (this would be checked in service)
        GameDTO game = gameService.createGame(player1Id);
        // Here you could store the invitation or notify the friend
        return ResponseEntity.ok(game);
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Long gameId) {
        GameDTO game = gameService.getGame(gameId);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/start")
    public ResponseEntity<GameDTO> startGame(@PathVariable Long gameId) {
        GameDTO game = gameService.startGame(gameId);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/play-card")
    public ResponseEntity<GameDTO> playCard(
            @PathVariable Long gameId,
            @RequestParam String cardId,
            @RequestParam String playerKey) {
        GameDTO game = gameService.playCard(gameId, cardId, playerKey);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/end-turn")
    public ResponseEntity<GameDTO> endTurn(@PathVariable Long gameId) {
        GameDTO game = gameService.endTurn(gameId);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/hero-power")
    public ResponseEntity<GameDTO> useHeroPower(
            @PathVariable Long gameId,
            @RequestParam String playerKey,
            @RequestParam String powerId) {
        GameDTO game = gameService.useHeroPower(gameId, playerKey, powerId);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/attack")
    public ResponseEntity<GameDTO> attack(
            @PathVariable Long gameId,
            @RequestParam String attackerId,
            @RequestParam String targetId,
            @RequestParam Boolean targetIsHero,
            @RequestParam String playerKey) {
        GameDTO game = gameService.attack(gameId, attackerId, targetId, targetIsHero, playerKey);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/select-passive-skills")
    public ResponseEntity<GameDTO> selectPassiveSkills(
            @PathVariable Long gameId,
            @RequestBody java.util.List<String> passiveSkills) {
        GameDTO game = gameService.selectPassiveSkills(gameId, passiveSkills);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/select-deck")
    public ResponseEntity<GameDTO> selectDeck(
            @PathVariable Long gameId,
            @RequestBody java.util.List<String> deckCards) {
        GameDTO game = gameService.selectDeck(gameId, deckCards);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/select-hero-powers")
    public ResponseEntity<GameDTO> selectHeroPowers(
            @PathVariable Long gameId,
            @RequestBody java.util.List<String> heroPowers) {
        GameDTO game = gameService.selectHeroPowers(gameId, heroPowers);
        return ResponseEntity.ok(game);
    }
}
