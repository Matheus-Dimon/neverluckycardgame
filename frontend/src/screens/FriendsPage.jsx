import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { friendAPI, gameAPI } from '../utils/api';
import '../styles/styles.css';

const FriendsPage = ({ onBack }) => {
  const { language, t } = useLanguage();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [gameInvites, setGameInvites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFriendsData();
  }, []);

  const loadFriendsData = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      const [friendsData, pendingData, sentData, invitesData] = await Promise.all([
        friendAPI.getFriends(),
        friendAPI.getPendingRequests(),
        friendAPI.getSentRequests(),
        userId ? gameAPI.getPendingInvites(userId) : Promise.resolve([])
      ]);
      setFriends(friendsData);
      setPendingRequests(pendingData);
      setSentRequests(sentData);
      setGameInvites(invitesData);
    } catch (err) {
      setError('Failed to load friends data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await friendAPI.searchUsers(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendAPI.sendFriendRequest(userId);
      setSuccess('Friend request sent successfully!');
      setSearchResults([]);
      setSearchQuery('');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendAPI.acceptRequest(requestId);
      setSuccess('Friend request accepted!');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendAPI.rejectRequest(requestId);
      setSuccess('Friend request rejected!');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await friendAPI.removeFriend(friendId);
      setSuccess('Friend removed successfully!');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInviteFriend = async (friendId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      if (!userId) {
        setError('User not logged in');
        return;
      }
      await gameAPI.inviteFriend(userId, friendId);
      setSuccess('Game invitation sent successfully!');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError('Failed to send game invitation: ' + err.message);
    }
  };

  const handleAcceptGameInvite = async (gameId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      if (!userId) {
        setError('User not logged in');
        return;
      }
      await gameAPI.acceptInvite(gameId, userId);
      setSuccess('Game invitation accepted! Starting game...');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError('Failed to accept game invitation: ' + err.message);
    }
  };

  const handleDeclineGameInvite = async (gameId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      if (!userId) {
        setError('User not logged in');
        return;
      }
      await gameAPI.declineInvite(gameId, userId);
      setSuccess('Game invitation declined.');
      loadFriendsData(); // Refresh data
    } catch (err) {
      setError('Failed to decline game invitation: ' + err.message);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="friends-page-container">
      <div className="friends-page-content">
        <div className="friends-header">
          <h1>Amigos</h1>
          <button
            className="back-button"
            onClick={onBack}
            style={{
              padding: '10px 20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: '2px solid #f5c06b',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Voltar
          </button>
        </div>

        {error && (
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
            <button onClick={clearMessages} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {success && (
          <div style={{
            background: '#e8f5e8',
            color: '#2e7d32',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {success}
            <button onClick={clearMessages} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
        )}

        <div className="add-friend-section">
          <h3>Buscar Usuários</h3>
          <div className="add-friend-input">
            <input
              type="text"
              placeholder="Digite o nome de usuário..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              style={{
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '2px solid #f5c06b',
                background: 'rgba(255,255,255,0.9)',
                marginRight: '10px',
                flex: 1
              }}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="search-results" style={{ marginTop: '10px' }}>
              {searchResults.map(user => (
                <div key={user.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '4px',
                  marginBottom: '5px'
                }}>
                  <span>{user.username}</span>
                  <button
                    onClick={() => handleSendRequest(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#8b5a2b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Enviar Solicitação
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {pendingRequests.length > 0 && (
          <div className="pending-requests">
            <h3>Solicitações Pendentes ({pendingRequests.length})</h3>
            <div className="requests-list">
              {pendingRequests.map(request => (
                <div key={request.id} className="request-card" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <span>{request.sender.username}</span>
                  <div>
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginRight: '8px'
                      }}
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameInvites.length > 0 && (
          <div className="game-invites">
            <h3>Convites para Jogar ({gameInvites.length})</h3>
            <div className="invites-list">
              {gameInvites.map(invite => (
                <div key={invite.id} className="invite-card" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  background: 'rgba(255,255,255,0.9)',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}>
                  <span>Convite de {invite.player1?.username || 'Jogador'}</span>
                  <div>
                    <button
                      onClick={() => handleAcceptGameInvite(invite.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginRight: '8px'
                      }}
                    >
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleDeclineGameInvite(invite.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="friends-list">
          <h3>Lista de Amigos ({friends.length})</h3>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Carregando...</p>
          ) : friends.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              Nenhum amigo adicionado ainda.
            </p>
          ) : (
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-info">
                    <div className="friend-name">{friend.username}</div>
                    <div
                      className="friend-status"
                      style={{
                        color: friend.isOnline ? '#4CAF50' : '#757575',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      ● {friend.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="invite-button"
                      onClick={() => handleInviteFriend(friend.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        marginRight: '8px'
                      }}
                    >
                      Convidar para Jogar
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFriend(friend.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
