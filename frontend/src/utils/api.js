import { API_BASE_URL, apiRequest } from '../config/api.js';

// Sistema de autenticação
export const authAPI = {
  async login(username, password) {
    console.log('🔐 Attempting login for:', username);
    
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userId', response.id);
      localStorage.setItem('username', response.username);
      console.log('✅ Login successful, token saved');
    }

    return response;
  },

  async register(username, password) {
    console.log('📝 Attempting registration for:', username);
    
    return await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        await apiRequest('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    console.log('🚪 Logged out');
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

// Sistema de jogo
export const gameAPI = {
  async createGame() {
    const token = authAPI.getToken();
    return await apiRequest('/api/game/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getActiveGames() {
    const token = authAPI.getToken();
    return await apiRequest('/api/game/active', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async inviteFriend(friendId) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/game/invite/${friendId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async selectPassiveSkills(gameId, playerKey, skills) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/game/${gameId}/passive-skills`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playerKey, passiveSkills: skills }),
    });
  },

  async selectDeck(gameId, playerKey, cards) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/game/${gameId}/deck`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playerKey, deckCards: cards }),
    });
  },

  async selectHeroPowers(gameId, playerKey, powers) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/game/${gameId}/hero-powers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ playerKey, heroPowers: powers }),
    });
  },
};

// Sistema de amigos
export const friendsAPI = {
  async searchUsers(query) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/friends/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async sendFriendRequest(userId) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/friends/request/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getFriends() {
    const token = authAPI.getToken();
    return await apiRequest('/api/friends/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async getPendingRequests() {
    const token = authAPI.getToken();
    return await apiRequest('/api/friends/requests/pending', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async acceptFriendRequest(requestId) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/friends/requests/${requestId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  async removeFriend(friendId) {
    const token = authAPI.getToken();
    return await apiRequest(`/api/friends/remove/${friendId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};