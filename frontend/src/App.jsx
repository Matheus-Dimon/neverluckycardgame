import React, { useState, useEffect } from 'react';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import AppScreen from './screens/AppScreen';
import './styles/styles.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Temporarily disabled auto-login to show auth pages
  // useEffect(() => {
  //   // Check if user is already logged in on app start
  //   const savedUser = localStorage.getItem('currentUser');
  //   if (savedUser) {
  //     try {
  //       const userData = JSON.parse(savedUser);
  //       if (userData.loggedIn) {
  //         setCurrentUser(userData);
  //         setIsLoggedIn(true);
  //         setCurrentScreen('game');
  //       }
  //     } catch (error) {
  //       localStorage.removeItem('currentUser');
  //     }
  //   }
  // }, []);

  const navigateToHome = () => setCurrentScreen('home');
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToRegister = () => setCurrentScreen('register');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('game');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentScreen('home');
  };

  // If user is logged in, show the game
  if (isLoggedIn && currentScreen === 'game') {
    return <AppScreen onLogout={handleLogout} currentUser={currentUser} />;
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
        />
      );
  }
};

export default App;
