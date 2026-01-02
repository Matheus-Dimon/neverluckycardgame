import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../styles/styles.css';

const FriendsPage = ({ onBack }) => {
  const { language, t } = useLanguage();
  const [friends, setFriends] = useState([
    { id: 1, username: 'PlayerOne', status: 'online' },
    { id: 2, username: 'CardMaster', status: 'offline' },
    { id: 3, username: 'WarLord', status: 'in-game' }
  ]);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddFriend = async () => {
    if (!newFriendUsername.trim()) return;

    setIsAdding(true);
    // Simulate API call
    setTimeout(() => {
      const newFriend = {
        id: friends.length + 1,
        username: newFriendUsername.trim(),
        status: 'offline'
      };
      setFriends([...friends, newFriend]);
      setNewFriendUsername('');
      setIsAdding(false);
    }, 1000);
  };

  const handleRemoveFriend = (friendId) => {
    setFriends(friends.filter(friend => friend.id !== friendId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'in-game': return '#FF9800';
      case 'offline': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'in-game': return 'Em jogo';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
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

        <div className="add-friend-section">
          <h3>Adicionar Amigo</h3>
          <div className="add-friend-input">
            <input
              type="text"
              placeholder="Digite o nome de usuário..."
              value={newFriendUsername}
              onChange={(e) => setNewFriendUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
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
            <button
              onClick={handleAddFriend}
              disabled={isAdding || !newFriendUsername.trim()}
              style={{
                padding: '10px 20px',
                background: isAdding ? '#666' : '#8b5a2b',
                color: 'white',
                border: '2px solid #f5c06b',
                borderRadius: '4px',
                cursor: isAdding ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {isAdding ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </div>

        <div className="friends-list">
          <h3>Lista de Amigos ({friends.length})</h3>
          {friends.length === 0 ? (
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
                        color: getStatusColor(friend.status),
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      ● {getStatusText(friend.status)}
                    </div>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="invite-button"
                      disabled={friend.status !== 'online'}
                      style={{
                        padding: '6px 12px',
                        background: friend.status === 'online' ? '#4CAF50' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: friend.status === 'online' ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        marginRight: '8px'
                      }}
                    >
                      Convidar
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
