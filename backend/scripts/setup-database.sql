-- Database setup script for NeverLucky
-- Run this script to create the database and initial schema

-- Create database (if not exists)
CREATE DATABASE neverlucky;

-- Connect to the database
\c neverlucky;

-- Create tables (Spring Boot will handle this automatically with ddl-auto: update)
-- But you can run this manually if needed:

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id BIGSERIAL PRIMARY KEY,
    player1_id BIGINT REFERENCES users(id),
    player2_id BIGINT REFERENCES users(id),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player states table
CREATE TABLE IF NOT EXISTS player_states (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT REFERENCES games(id),
    user_id BIGINT REFERENCES users(id),
    health INTEGER DEFAULT 30,
    mana INTEGER DEFAULT 0,
    deck_size INTEGER DEFAULT 0,
    hand_size INTEGER DEFAULT 0,
    battlefield_size INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friendships table
CREATE TABLE IF NOT EXISTS friendships (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT REFERENCES users(id),
    user2_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

-- Friend requests table
CREATE TABLE IF NOT EXISTS friend_requests (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT REFERENCES users(id),
    receiver_id BIGINT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    attack INTEGER DEFAULT 0,
    defense INTEGER DEFAULT 0,
    mana_cost INTEGER DEFAULT 0,
    card_type VARCHAR(50),
    rarity VARCHAR(20),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_games_player1 ON games(player1_id);
CREATE INDEX IF NOT EXISTS idx_games_player2 ON games(player2_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_player_states_game ON player_states(game_id);
CREATE INDEX IF NOT EXISTS idx_player_states_user ON player_states(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user1 ON friendships(user1_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user2 ON friendships(user2_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;

-- Verify tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';