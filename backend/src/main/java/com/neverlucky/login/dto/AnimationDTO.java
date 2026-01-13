package com.neverlucky.login.dto;

import lombok.Data;

@Data
public class AnimationDTO {
    private Boolean active;
    private String element;
    private String startRect;
    private String endRect;
    private String callbackAction;
}
