const API_BASE_URL = 'http://localhost:8081/api';

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

export default apiRequest;
