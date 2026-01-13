package com.neverlucky.login.dto;

import lombok.Data;
import java.util.List;

@Data
public class CardDTO {
    private Long id;
    private String cardId;
    private String name;
    private Integer mana;
    private Integer attack;
    private Integer defense;
    private Integer healValue;
    private String image;
    private String rarity;
    private String unitType;

    private List<String> effects;

    // Game state properties
    private String uniqueId;
    private Boolean canAttack;
    private Boolean immuneFirstTurn;
    private Integer turnPlayed;
    private Integer currentTurn;
}
