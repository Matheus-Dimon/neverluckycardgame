import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
instance.interceptors.request.use(
  (config) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data || `HTTP error! status: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Network error - no response received');
    } else {
      throw new Error('Error setting up the request');
    }
  }
);

export const apiRequest = (endpoint, options = {}) => {
  return instance.request({
    url: endpoint,
    ...options
  });
};

export const authAPI = {
  login: (username, password) => apiRequest('/auth/login', {
    method: 'POST',
    data: { username, password }
  }),
  register: (username, password) => apiRequest('/auth/register', {
    method: 'POST',
    data: { username, password }
  }),
  logout: (username) => apiRequest('/auth/logout', {
    method: 'POST',
    data: { username }
  })
};

// Friend-related API calls
export const friendAPI = {
  searchUsers: (query) => apiRequest(`/friends/search?query=${encodeURIComponent(query)}`, { method: 'GET' }),

  sendFriendRequest: (receiverId) => apiRequest(`/friends/request/${receiverId}`, { method: 'POST' }),

  getPendingRequests: () => apiRequest('/friends/requests/pending'),

  acceptRequest: (requestId) => apiRequest(`/friends/requests/${requestId}/accept`, { method: 'POST' }),

  rejectRequest: (requestId) => apiRequest(`/friends/requests/${requestId}/reject`, { method: 'POST' }),

  getFriends: () => apiRequest('/friends/list'),

  getSentRequests: () => apiRequest('/friends/requests/sent'),

  removeFriend: (friendId) => apiRequest(`/friends/remove/${friendId}`, { method: 'DELETE' }),
};

// Game-related API calls
export const gameAPI = {
  inviteFriend: (player1Id, friendId) => apiRequest(`/game/invite-friend?player1Id=${player1Id}&friendId=${friendId}`, {
    method: 'POST'
  }),

  acceptInvite: (gameId, player2Id) => apiRequest(`/game/${gameId}/accept-invite?player2Id=${player2Id}`, {
    method: 'POST'
  }),

  declineInvite: (gameId, playerId) => apiRequest(`/game/${gameId}/decline-invite?playerId=${playerId}`, {
    method: 'POST'
  }),

  getPendingInvites: (userId) => apiRequest(`/game/pending-invites/${userId}`),

  getActiveGames: (userId) => apiRequest(`/game/active-games/${userId}`),

  getGame: (gameId) => apiRequest(`/game/${gameId}`),

  startGame: (gameId) => apiRequest(`/game/${gameId}/start`, { method: 'POST' }),

  selectPassiveSkills: (gameId, playerKey, passiveSkills) => apiRequest(`/game/${gameId}/select-passive-skills?playerKey=${playerKey}`, {
    method: 'POST',
    body: JSON.stringify(passiveSkills)
  }),

  selectDeck: (gameId, playerKey, deckCards) => apiRequest(`/game/${gameId}/select-deck?playerKey=${playerKey}`, {
    method: 'POST',
    body: JSON.stringify(deckCards)
  }),

  selectHeroPowers: (gameId, playerKey, heroPowers) => apiRequest(`/game/${gameId}/select-hero-powers?playerKey=${playerKey}`, {
    method: 'POST',
    body: JSON.stringify(heroPowers)
  }),
};

export default apiRequest;
