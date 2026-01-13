package com.neverlucky.login.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlayerStateDTO {
    private Long id;
    private Integer hp;
    private Integer mana;
    private Integer maxMana;
    private Integer armor;
    private Boolean hasUsedHeroPower;

    private List<CardDTO> hand;
    private List<CardDTO> deck;
    private List<CardDTO> meleeField;
    private List<CardDTO> rangedField;

    private List<String> heroPowers;
    private List<String> passiveSkills;
}
