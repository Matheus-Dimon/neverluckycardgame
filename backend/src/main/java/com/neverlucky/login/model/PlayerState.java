package com.neverlucky.login.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "player_states")
public class PlayerState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer hp;
    private Integer mana;
    private Integer maxMana;
    private Integer armor;
    private Boolean hasUsedHeroPower;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "player_state_id")
    private List<Card> hand;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "player_state_id")
    private List<Card> deck;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "melee_field_id")
    private List<Card> meleeField;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ranged_field_id")
    private List<Card> rangedField;

    @ElementCollection
    @CollectionTable(name = "player_hero_powers", joinColumns = @JoinColumn(name = "player_state_id"))
    @Column(name = "hero_power_id")
    private List<String> heroPowers;

    @ElementCollection
    @CollectionTable(name = "player_passive_skills", joinColumns = @JoinColumn(name = "player_state_id"))
    @Column(name = "passive_skill_id")
    private List<String> passiveSkills;
}
