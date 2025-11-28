import React, { useContext, useEffect } from 'react';
import App from '../game/screens/AppScreen';
import '../game/styles/styles.css';
import { GameContext } from '../game/context/GameContext';

const Game: React.FC = () => {
  const { createGame, gameId, loading, error } = useContext(GameContext);

  useEffect(() => {
    if (!gameId && !loading) {
      createGame();
    }
  }, [gameId, loading, createGame]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return <App />;
};

export default Game;
