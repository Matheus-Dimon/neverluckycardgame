package com.neverlucky.login.dto;

import lombok.Data;

@Data
public class HeroPowerDTO {
    private String id;
    private String name;
    private Integer cost;
    private Boolean requiresTarget;
    private String effect;
    private Integer amount;
    private String icon;
    private String description;
}
