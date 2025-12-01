package com.neverlucky.login.dto;

import lombok.Data;

@Data
public class TargetingDTO {
    private Boolean active;
    private String playerUsing;
    private HeroPowerDTO power;
    private Boolean healingActive;
    private String healerId;
    private Integer healAmount;
}
