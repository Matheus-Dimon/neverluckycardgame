package com.neverlucky.login.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "player1_id")
    private User player1;

    @ManyToOne
    @JoinColumn(name = "player2_id")
    private User player2;

    @ManyToOne
    @JoinColumn(name = "invited_user_id")
    private User invitedUser;

    @Enumerated(EnumType.STRING)
    private GameStatus status;

    @Enumerated(EnumType.STRING)
    private GamePhase gamePhase;

    @Enumerated(EnumType.STRING)
    private Turn turn;

    private Integer turnCount;
    private Boolean gameOver;
    private String winner;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player1_state_id")
    private PlayerState player1State;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "player2_state_id")
    private PlayerState player2State;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum GameStatus {
        PENDING, ACCEPTED, DECLINED, ACTIVE, FINISHED
    }

    public enum GamePhase {
        START_MENU, PASSIVE_SKILLS, SETUP, HERO_POWER_OPTIONS, PLAYING
    }

    public enum Turn {
        PLAYER1, PLAYER2
    }
}
