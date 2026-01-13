import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { authAPI } from '../utils/api';
import '../styles/styles.css';

const LoginPage = ({ onNavigateToRegister, onNavigateToHome, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.password) {
      setError(t('allFieldsRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login(formData.username, formData.password);
      // Login successful - store user info and JWT token
      localStorage.setItem('currentUser', JSON.stringify({
        username: data.username,
        id: data.id,
        loggedIn: true,
        token: data.token
      }));
      onLoginSuccess();
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        setError(t('loginError'));
      } else {
        setError(t('connectionError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{t('loginTitle')}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t('usernameLabel')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={t('usernamePlaceholder')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('passwordLabel')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('passwordPlaceholder')}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('loggingIn') : t('loginButtonText')}
          </button>
        </form>

        <div className="login-links">
          <button className="link-button" onClick={onNavigateToRegister}>
            {t('noAccount')}
          </button>
          <button className="link-button" onClick={onNavigateToHome}>
            {t('backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
