const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const getAuthHeaders = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const token = currentUser.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const authAPI = {
  login: (username, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  register: (username, password) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  logout: (username) => apiRequest('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ username })
  })
};

// Friend-related API calls
export const friendAPI = {
  searchUsers: (query) => apiRequest(`/friends/search?query=${encodeURIComponent(query)}`),

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
