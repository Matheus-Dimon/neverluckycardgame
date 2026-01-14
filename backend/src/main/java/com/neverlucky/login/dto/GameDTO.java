package com.neverlucky.login.dto;

import lombok.Data;
import java.util.List;

@Data
public class GameDTO {
    private Long id;
    private String gamePhase;
    private String turn;
    private Integer turnCount;
    private Boolean gameOver;
    private String winner;

    private Long player1Id;
    private Long player2Id;
    private String player1Username;
    private String player2Username;
    private Long invitedUserId;
    private String invitedUsername;

    private PlayerStateDTO player1State;
    private PlayerStateDTO player2State;

    // Selection data for setup phases
    private List<String> selectedPassiveSkills;
    private List<String> selectedDeckCards;
    private List<String> selectedHeroPowers;

    // Targeting state
    private TargetingDTO targeting;
    private String selectedCardId;

    // Animation state
    private AnimationDTO animation;
    private Boolean isAITurnProcessing;
    private Boolean soundEnabled;

    // Player completion status for setup phases
    private Boolean player1PassiveSkillsComplete;
    private Boolean player2PassiveSkillsComplete;
    private Boolean player1DeckComplete;
    private Boolean player2DeckComplete;
    private Boolean player1HeroPowersComplete;
    private Boolean player2HeroPowersComplete;
}
