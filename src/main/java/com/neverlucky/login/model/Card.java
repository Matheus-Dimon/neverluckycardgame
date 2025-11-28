package com.neverlucky.login.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "cards")
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String cardId; // e.g., "p1_001"

    private String name;
    private Integer mana;
    private Integer attack;
    private Integer defense;
    private Integer healValue;
    private String image;
    private String rarity;

    @Enumerated(EnumType.STRING)
    private UnitType unitType;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "card_effects", joinColumns = @JoinColumn(name = "card_id"))
    @Column(name = "effect_id")
    private List<String> effects;

    // Game state properties
    private String uniqueId; // For tracking in game (e.g., "p1_001_123456_789")
    private Boolean canAttack;
    private Boolean immuneFirstTurn;
    private Integer turnPlayed;
    private Integer currentTurn;

    public enum UnitType {
        WARRIOR, ARCHER, CLERIC
    }

    public enum Lane {
        MELEE, RANGED
    }

    // Helper method to get lane from unit type
    public Lane getLane() {
        return switch (unitType) {
            case WARRIOR -> Lane.MELEE;
            case ARCHER, CLERIC -> Lane.RANGED;
        };
    }
}
