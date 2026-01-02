package com.neverlucky.login.service;

import com.neverlucky.login.dto.*;
import com.neverlucky.login.model.*;
import com.neverlucky.login.repository.GameRepository;
import com.neverlucky.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    public GameDTO createGame(Long player1Id) {
        if (player1Id == null) {
            throw new IllegalArgumentException("Player1 ID cannot be null");
        }
        User player1 = userRepository.findById(player1Id)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Game game = new Game();
        game.setPlayer1(player1);
        game.setStatus(Game.GameStatus.PENDING);
        game.setGamePhase(Game.GamePhase.START_MENU);
        game.setTurn(Game.Turn.PLAYER1);
        game.setTurnCount(1);
        game.setGameOver(false);

        // Initialize player states
        PlayerState p1State = createInitialPlayerState();
        PlayerState p2State = createInitialPlayerState();
        game.setPlayer1State(p1State);
        game.setPlayer2State(p2State);

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO inviteFriend(Long player1Id, Long friendId) {
        if (player1Id == null || friendId == null) {
            throw new IllegalArgumentException("Player IDs cannot be null");
        }
        User player1 = userRepository.findById(player1Id)
                .orElseThrow(() -> new RuntimeException("Player1 not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        Game game = new Game();
        game.setPlayer1(player1);
        game.setStatus(Game.GameStatus.PENDING);
        game.setGamePhase(Game.GamePhase.START_MENU);
        game.setTurn(Game.Turn.PLAYER1);
        game.setTurnCount(1);
        game.setGameOver(false);

        // Initialize player states
        PlayerState p1State = createInitialPlayerState();
        PlayerState p2State = createInitialPlayerState();
        game.setPlayer1State(p1State);
        game.setPlayer2State(p2State);

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO acceptInvite(Long gameId, Long player2Id) {
        if (gameId == null || player2Id == null) {
            throw new IllegalArgumentException("Game ID and Player2 ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        User player2 = userRepository.findById(player2Id)
                .orElseThrow(() -> new RuntimeException("Player2 not found"));

        if (!game.getStatus().equals(Game.GameStatus.PENDING)) {
            throw new RuntimeException("Game invitation is not pending");
        }

        game.setPlayer2(player2);
        game.setStatus(Game.GameStatus.ACCEPTED);
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO declineInvite(Long gameId, Long playerId) {
        if (gameId == null || playerId == null) {
            throw new IllegalArgumentException("Game ID and Player ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (!game.getStatus().equals(Game.GameStatus.PENDING)) {
            throw new RuntimeException("Game invitation is not pending");
        }

        game.setStatus(Game.GameStatus.DECLINED);
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public List<GameDTO> getPendingInvites(Long userId) {
        List<Game> games = gameRepository.findByStatusAndPlayer1Id(Game.GameStatus.PENDING, userId);
        return games.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<GameDTO> getReceivedInvites(Long userId) {
        // This would require a query to find games where userId is not player1 but invitation exists
        // For simplicity, assuming we need to query by status pending and perhaps store invited user separately
        // But for now, we'll assume invites are stored in a way we can query
        return new ArrayList<>(); // Placeholder
    }

    public GameDTO getGame(Long gameId) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return convertToDTO(game);
    }

    public GameDTO startGame(Long gameId) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // For now, just set to PLAYING phase
        game.setGamePhase(Game.GamePhase.PLAYING);
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO playCard(Long gameId, String cardId, String playerKey) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Determine which player is playing
        PlayerState playerState;
        if (game.getPlayer1() != null && game.getPlayer1().getId().toString().equals(playerKey)) {
            playerState = game.getPlayer1State();
            if (!game.getTurn().equals(Game.Turn.PLAYER1)) {
                throw new RuntimeException("Not your turn");
            }
        } else if (game.getPlayer2() != null && game.getPlayer2().getId().toString().equals(playerKey)) {
            playerState = game.getPlayer2State();
            if (!game.getTurn().equals(Game.Turn.PLAYER2)) {
                throw new RuntimeException("Not your turn");
            }
        } else {
            throw new RuntimeException("Player not found in game");
        }

        // Find the card in hand
        Card cardToPlay = playerState.getHand().stream()
                .filter(card -> card.getUniqueId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Card not found in hand"));

        // Check mana cost
        if (playerState.getMana() < cardToPlay.getMana()) {
            throw new RuntimeException("Not enough mana");
        }

        // Determine lane and move card
        Card.Lane lane = cardToPlay.getLane();
        if (lane == Card.Lane.MELEE) {
            playerState.getMeleeField().add(cardToPlay);
        } else {
            playerState.getRangedField().add(cardToPlay);
        }

        // Remove from hand
        playerState.getHand().remove(cardToPlay);

        // Deduct mana
        playerState.setMana(playerState.getMana() - cardToPlay.getMana());

        // Update card state
        cardToPlay.setTurnPlayed(game.getTurnCount());
        cardToPlay.setCanAttack(false);
        cardToPlay.setCurrentTurn(game.getTurnCount());

        // Save and return
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO endTurn(Long gameId) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        PlayerState activePlayerState;

        if (game.getTurn() == Game.Turn.PLAYER1) {
            game.setTurn(Game.Turn.PLAYER2);
            activePlayerState = game.getPlayer2State();
        } else {
            game.setTurn(Game.Turn.PLAYER1);
            game.setTurnCount(game.getTurnCount() + 1);
            activePlayerState = game.getPlayer1State();
        }

        int newMaxMana = Math.min(10, activePlayerState.getMaxMana() + 1);
        activePlayerState.setMaxMana(newMaxMana);
        activePlayerState.setMana(newMaxMana);

        if (!activePlayerState.getDeck().isEmpty()) {
            Card drawnCard = activePlayerState.getDeck().remove(0);
            activePlayerState.getHand().add(drawnCard);
        }

        for (Card card : activePlayerState.getMeleeField()) {
            card.setCanAttack(true);
        }
        for (Card card : activePlayerState.getRangedField()) {
            card.setCanAttack(true);
        }

        activePlayerState.setHasUsedHeroPower(false);

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO useHeroPower(Long gameId, String playerKey, String powerId) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Determine which player is using hero power
        PlayerState playerState;
        if (game.getPlayer1() != null && game.getPlayer1().getId().toString().equals(playerKey)) {
            playerState = game.getPlayer1State();
            if (!game.getTurn().equals(Game.Turn.PLAYER1)) {
                throw new RuntimeException("Not your turn");
            }
        } else if (game.getPlayer2() != null && game.getPlayer2().getId().toString().equals(playerKey)) {
            playerState = game.getPlayer2State();
            if (!game.getTurn().equals(Game.Turn.PLAYER2)) {
                throw new RuntimeException("Not your turn");
            }
        } else {
            throw new RuntimeException("Player not found in game");
        }

        // Check if player has the hero power
        if (!playerState.getHeroPowers().contains(powerId)) {
            throw new RuntimeException("Hero power not available");
        }

        // Check if already used this turn
        if (Boolean.TRUE.equals(playerState.getHasUsedHeroPower())) {
            throw new RuntimeException("Hero power already used this turn");
        }

        // Mark as used and apply power effects
        playerState.setHasUsedHeroPower(true);

        // Apply specific hero power effects
        switch (powerId) {
            case "p1_fireblast":
            case "p2_fireblast":
                // Damage effect - handled by targeting system
                break;
            case "p1_divine_healing":
            case "p2_divine_healing":
                // Heal effect - handled by targeting system
                break;
            case "p1_armor":
            case "p2_armor":
                playerState.setArmor(playerState.getArmor() + 3);
                break;
            case "p1_draw":
            case "p2_draw":
                // Draw 2 cards
                for (int i = 0; i < 2; i++) {
                    if (!playerState.getDeck().isEmpty()) {
                        Card drawnCard = playerState.getDeck().remove(0);
                        playerState.getHand().add(drawnCard);
                    }
                }
                break;
            case "p1_charge":
            case "p2_charge":
                // Grant charge to all melee units this turn
                for (Card card : playerState.getMeleeField()) {
                    card.setCanAttack(true);
                }
                break;
            case "p1_buff_all":
            case "p2_buff_all":
                // +2/+2 to all units
                for (Card card : playerState.getMeleeField()) {
                    card.setAttack(card.getAttack() + 2);
                    card.setDefense(card.getDefense() + 2);
                }
                for (Card card : playerState.getRangedField()) {
                    card.setAttack(card.getAttack() + 2);
                    card.setDefense(card.getDefense() + 2);
                }
                break;
            case "p1_damage_all":
            case "p2_damage_all":
                // Damage all enemy units
                PlayerState opponentState = (playerState == game.getPlayer1State()) ?
                    game.getPlayer2State() : game.getPlayer1State();
                for (Card card : opponentState.getMeleeField()) {
                    int newDefense = Math.max(0, card.getDefense() - 2);
                    card.setDefense(newDefense);
                    if (newDefense <= 0) {
                        opponentState.getMeleeField().remove(card);
                    }
                }
                for (Card card : opponentState.getRangedField()) {
                    int newDefense = Math.max(0, card.getDefense() - 2);
                    card.setDefense(newDefense);
                    if (newDefense <= 0) {
                        opponentState.getRangedField().remove(card);
                    }
                }
                break;
            case "p1_mana_boost":
            case "p2_mana_boost":
                playerState.setMana(playerState.getMana() + 2);
                break;
            case "p1_resurrect":
            case "p2_resurrect":
                // Draw from graveyard (deck represents graveyard in this simplified implementation)
                if (!playerState.getDeck().isEmpty()) {
                    Card resurrectedCard = playerState.getDeck().remove(0);
                    playerState.getHand().add(resurrectedCard);
                }
                break;
            default:
                // Unknown power - no effect
                break;
        }

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO attack(Long gameId, String attackerId, String targetId, Boolean targetIsHero, String playerKey) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Determine which player is attacking
        PlayerState attackerState;
        PlayerState defenderState;
        if (game.getPlayer1() != null && game.getPlayer1().getId().toString().equals(playerKey)) {
            attackerState = game.getPlayer1State();
            defenderState = game.getPlayer2State();
            if (!game.getTurn().equals(Game.Turn.PLAYER1)) {
                throw new RuntimeException("Not your turn");
            }
        } else if (game.getPlayer2() != null && game.getPlayer2().getId().toString().equals(playerKey)) {
            attackerState = game.getPlayer2State();
            defenderState = game.getPlayer1State();
            if (!game.getTurn().equals(Game.Turn.PLAYER2)) {
                throw new RuntimeException("Not your turn");
            }
        } else {
            throw new RuntimeException("Player not found in game");
        }

        // Find attacker card
        Card attacker = findCardInField(attackerState, attackerId);
        if (attacker == null) {
            throw new RuntimeException("Attacker card not found in your field");
        }

        // Check if attacker can attack
        if (!Boolean.TRUE.equals(attacker.getCanAttack())) {
            throw new RuntimeException("This card cannot attack this turn");
        }

        if (targetIsHero) {
            // Attack hero
            int damage = attacker.getAttack();
            defenderState.setHp(defenderState.getHp() - damage);

            // Check for game over
            if (defenderState.getHp() <= 0) {
                game.setGameOver(true);
                game.setWinner(game.getPlayer1().getId().toString().equals(playerKey) ? "player1" : "player2");
            }
        } else {
            // Attack card
            Card target = findCardInField(defenderState, targetId);
            if (target == null) {
                throw new RuntimeException("Target card not found");
            }

            // Calculate damage - if attack >= defense, target dies
            if (attacker.getAttack() >= target.getDefense()) {
                defenderState.getMeleeField().remove(target);
                defenderState.getRangedField().remove(target);
            } else {
                // Counterattack if target is melee (assuming melee can counterattack)
                if (target.getLane() == Card.Lane.MELEE && attacker.getLane() == Card.Lane.MELEE) {
                    if (target.getAttack() >= attacker.getDefense()) {
                        attackerState.getMeleeField().remove(attacker);
                        attackerState.getRangedField().remove(attacker);
                    }
                }
            }
        }

        // Attacker cannot attack again this turn
        attacker.setCanAttack(false);

        // Save and return
        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    private Card findCardInField(PlayerState playerState, String cardId) {
        // Search in melee field
        for (Card card : playerState.getMeleeField()) {
            if (card.getUniqueId().equals(cardId)) {
                return card;
            }
        }
        // Search in ranged field
        for (Card card : playerState.getRangedField()) {
            if (card.getUniqueId().equals(cardId)) {
                return card;
            }
        }
        return null;
    }

    public GameDTO selectPassiveSkills(Long gameId, List<String> passiveSkills) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // For now, assume player1 is selecting passive skills (can be extended for player2)
        PlayerState playerState = game.getPlayer1State();
        if (playerState == null) {
            throw new RuntimeException("Player state not found");
        }

        // Set passive skills
        playerState.setPassiveSkills(passiveSkills);

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO selectDeck(Long gameId, List<String> deckCards) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // For now, assume player1 is selecting deck (can be extended for player2)
        PlayerState playerState = game.getPlayer1State();
        if (playerState == null) {
            throw new RuntimeException("Player state not found");
        }

        // Clear existing deck
        playerState.getDeck().clear();

        // Create cards from deckCards list
        // Note: This is a simplified implementation - in a real game,
        // you'd fetch card data from a database based on card IDs
        for (String cardId : deckCards) {
            Card card = new Card();
            card.setCardId(cardId);
            card.setUniqueId(cardId + "_" + System.currentTimeMillis() + "_" + Math.random());
            card.setName("Card " + cardId); // Placeholder
            card.setMana(1); // Placeholder
            card.setAttack(1); // Placeholder
            card.setDefense(1); // Placeholder
            card.setUnitType(Card.UnitType.WARRIOR); // Placeholder
            card.setCanAttack(false);
            card.setImmuneFirstTurn(false);
            card.setTurnPlayed(0);
            card.setCurrentTurn(0);

            playerState.getDeck().add(card);
        }

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    public GameDTO selectHeroPowers(Long gameId, List<String> heroPowers) {
        if (gameId == null) {
            throw new IllegalArgumentException("Game ID cannot be null");
        }
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // For now, assume player1 is selecting hero powers (can be extended for player2)
        PlayerState playerState = game.getPlayer1State();
        if (playerState == null) {
            throw new RuntimeException("Player state not found");
        }

        // Set hero powers
        playerState.setHeroPowers(heroPowers);

        game = gameRepository.save(game);
        return convertToDTO(game);
    }

    private PlayerState createInitialPlayerState() {
        PlayerState state = new PlayerState();
        state.setHp(30);
        state.setMana(1);
        state.setMaxMana(1);
        state.setArmor(0);
        state.setHasUsedHeroPower(false);

        state.setHand(new ArrayList<>());
        state.setDeck(new ArrayList<>());
        state.setMeleeField(new ArrayList<>());
        state.setRangedField(new ArrayList<>());

        state.setHeroPowers(new ArrayList<>());
        state.setPassiveSkills(new ArrayList<>());

        return state;
    }

    private GameDTO convertToDTO(Game game) {
        GameDTO dto = new GameDTO();
        dto.setId(game.getId());
        dto.setGamePhase(game.getGamePhase().toString());
        dto.setTurn(game.getTurn().toString());
        dto.setTurnCount(game.getTurnCount());
        dto.setGameOver(game.getGameOver());
        dto.setWinner(game.getWinner());

        if (game.getPlayer1State() != null) {
            dto.setPlayer1State(convertPlayerStateToDTO(game.getPlayer1State()));
        }
        if (game.getPlayer2State() != null) {
            dto.setPlayer2State(convertPlayerStateToDTO(game.getPlayer2State()));
        }

        return dto;
    }

    private PlayerStateDTO convertPlayerStateToDTO(PlayerState state) {
        PlayerStateDTO dto = new PlayerStateDTO();
        dto.setId(state.getId());
        dto.setHp(state.getHp());
        dto.setMana(state.getMana());
        dto.setMaxMana(state.getMaxMana());
        dto.setArmor(state.getArmor());
        dto.setHasUsedHeroPower(state.getHasUsedHeroPower());

        dto.setHand(state.getHand().stream()
                .map(this::convertCardToDTO)
                .collect(Collectors.toList()));
        dto.setDeck(state.getDeck().stream()
                .map(this::convertCardToDTO)
                .collect(Collectors.toList()));
        dto.setMeleeField(state.getMeleeField().stream()
                .map(this::convertCardToDTO)
                .collect(Collectors.toList()));
        dto.setRangedField(state.getRangedField().stream()
                .map(this::convertCardToDTO)
                .collect(Collectors.toList()));

        dto.setHeroPowers(state.getHeroPowers());
        dto.setPassiveSkills(state.getPassiveSkills());

        return dto;
    }

    private CardDTO convertCardToDTO(Card card) {
        CardDTO dto = new CardDTO();
        dto.setId(card.getId());
        dto.setCardId(card.getCardId());
        dto.setName(card.getName());
        dto.setMana(card.getMana());
        dto.setAttack(card.getAttack());
        dto.setDefense(card.getDefense());
        dto.setHealValue(card.getHealValue());
        dto.setImage(card.getImage());
        dto.setRarity(card.getRarity());
        dto.setUnitType(card.getUnitType().toString());
        dto.setEffects(card.getEffects());
        dto.setUniqueId(card.getUniqueId());
        dto.setCanAttack(card.getCanAttack());
        dto.setImmuneFirstTurn(card.getImmuneFirstTurn());
        dto.setTurnPlayed(card.getTurnPlayed());
        dto.setCurrentTurn(card.getCurrentTurn());
        return dto;
    }
}
