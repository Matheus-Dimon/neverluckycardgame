import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { authAPI } from '../utils/api';
import '../styles/styles.css';

const RegisterPage = ({ onNavigateToLogin, onNavigateToHome }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError(t('allFieldsRequired'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDontMatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.register(formData.username, formData.password);
      // Registration successful
      alert(t('registrationSuccess'));
      onNavigateToLogin();
    } catch (error) {
      setError(error.message || t('registrationError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>{t('registerTitle')}</h2>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('confirmPasswordLabel')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t('confirmPasswordPlaceholder')}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? t('registering') : t('registerButtonText')}
          </button>
        </form>

        <div className="register-links">
          <button className="link-button" onClick={onNavigateToLogin}>
            {t('hasAccount')}
          </button>
          <button className="link-button" onClick={onNavigateToHome}>
            {t('backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
