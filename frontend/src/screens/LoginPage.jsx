import React, { useState } from 'react';
import '../styles/styles.css';

const LoginPage = ({ onNavigateToRegister, onNavigateToHome, onLoginSuccess }) => {
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
      setError('Nome de usuário e senha são obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (response.ok) {
        // Login successful - store user info and navigate to game
        localStorage.setItem('currentUser', JSON.stringify({
          username: formData.username,
          loggedIn: true
        }));
        onLoginSuccess();
      } else {
        setError('Nome de usuário ou senha incorretos');
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Entrar no Jogo</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Digite seu nome de usuário"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-links">
          <button className="link-button" onClick={onNavigateToRegister}>
            Não tem conta? Cadastre-se
          </button>
          <button className="link-button" onClick={onNavigateToHome}>
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
