import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import BackgroundMusic from '../components/BackgroundMusic';
import '../styles/styles.css';

const StartMenu = () => {
  const { dispatch } = useContext(GameContext);

  const handleStartClick = () => {
    dispatch({ type: 'GO_TO_PASSIVE_SKILLS' });
  };

  const handleFriendsClick = () => {
    dispatch({ type: 'GO_TO_FRIENDS' });
  };

  return (
    <div className="start-menu-container">
      <BackgroundMusic />
      <div className="start-menu">
        <button className="start-menu-button" onClick={handleStartClick}>
          Start Game
        </button>
        <button className="start-menu-button friends-button" onClick={handleFriendsClick}>
          Amigos
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
