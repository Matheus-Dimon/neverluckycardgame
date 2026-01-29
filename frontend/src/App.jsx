import React, { useState, useEffect } from 'react';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import AppScreen from './screens/AppScreen';
import { GameProvider } from './context/GameContext';
import { authAPI } from './utils/api';
import './styles/styles.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tutorialMode, setTutorialMode] = useState(false);

  useEffect(() => {
    // Check if user is already logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.loggedIn) {
          setCurrentUser(userData);
          setIsLoggedIn(true);
          setCurrentScreen('game');
        }
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const navigateToHome = () => setCurrentScreen('home');
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToRegister = () => setCurrentScreen('register');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('game');
  };

  const handleLogout = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.username) {
        await authAPI.logout(currentUser.username);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setTutorialMode(false);
    setCurrentScreen('home');
  };

  const startTutorial = () => {
    setTutorialMode(true);
    setCurrentScreen('game');
  };

  // If user is logged in or in tutorial mode, show the game
  if ((isLoggedIn || tutorialMode) && currentScreen === 'game') {
    return (
      <GameProvider>
        <AppScreen onLogout={handleLogout} currentUser={currentUser} tutorialMode={tutorialMode} />
      </GameProvider>
    );
  }

  // Authentication flow
  switch (currentScreen) {
    case 'login':
      return (
        <LoginPage
          onNavigateToRegister={navigateToRegister}
          onNavigateToHome={navigateToHome}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    case 'register':
      return (
        <RegisterPage
          onNavigateToLogin={navigateToLogin}
          onNavigateToHome={navigateToHome}
        />
      );
    case 'home':
    default:
      return (
        <HomePage
          onNavigateToLogin={navigateToLogin}
          onNavigateToRegister={navigateToRegister}
          onStartTutorial={startTutorial}
        />
      );
  }
};

export default App;
