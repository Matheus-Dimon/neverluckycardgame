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
}
