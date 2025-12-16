import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import InteractiveTutorial from '../components/InteractiveTutorial';
import '../styles/styles.css';

const HomePage = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { language, switchLanguage, t } = useLanguage();
  const [showTutorial, setShowTutorial] = useState(false);

  const handleLanguageSwitch = () => {
    switchLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <button
          className="language-switcher"
          onClick={handleLanguageSwitch}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: '2px solid #f5c06b',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {language === 'pt' ? t('switchToEnglish') : t('switchToPortuguese')}
        </button>

        <h1 className="game-title">{t('gameTitle')}</h1>
        <p className="game-description">
          {t('gameDescription')}
        </p>

        <div className="homepage-buttons">
          <button className="homepage-button login-btn" onClick={onNavigateToLogin}>
            {t('loginButton')}
          </button>
          <button className="homepage-button register-btn" onClick={onNavigateToRegister}>
            {t('registerButton')}
          </button>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            className="homepage-button"
            onClick={() => setShowTutorial(true)}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(135deg, #8b5a2b, #a67c52)',
              color: 'white',
              border: '2px solid #f5c06b',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            📖 {t('tutorial.start') || 'Start Tutorial'}
          </button>
        </div>

        <div className="game-features">
          <div className="feature">
            <h3>{t('features.decks.title')}</h3>
            <p>{t('features.decks.description')}</p>
          </div>
          <div className="feature">
            <h3>{t('features.heroPowers.title')}</h3>
            <p>{t('features.heroPowers.description')}</p>
          </div>
          <div className="feature">
            <h3>{t('features.battles.title')}</h3>
            <p>{t('features.battles.description')}</p>
          </div>
        </div>
      </div>

      <InteractiveTutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
    </div>
  );
};

export default HomePage;
