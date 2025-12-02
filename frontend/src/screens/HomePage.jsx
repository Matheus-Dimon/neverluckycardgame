import React, { useState } from 'react';
import '../styles/styles.css';

const HomePage = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1 className="game-title">NeverLucky Card Game</h1>
        <p className="game-description">
          Um jogo de cartas estratégico onde você constrói seu deck,
          seleciona poderes de herói e enfrenta adversários em batalhas épicas.
        </p>

        <div className="homepage-buttons">
          <button className="homepage-button login-btn" onClick={onNavigateToLogin}>
            Entrar
          </button>
          <button className="homepage-button register-btn" onClick={onNavigateToRegister}>
            Cadastrar
          </button>
        </div>

        <div className="game-features">
          <div className="feature">
            <h3>🃏 Decks Personalizados</h3>
            <p>Monte seu deck com cartas únicas de guerreiros, arqueiros e clérigos.</p>
          </div>
          <div className="feature">
            <h3>⚔️ Poderes de Herói</h3>
            <p>Escolha poderes especiais que definem seu estilo de jogo.</p>
          </div>
          <div className="feature">
            <h3>🎯 Batalhas Estratégicas</h3>
            <p>Posicione suas unidades em linhas melee e ranged para controlar o campo de batalha.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
