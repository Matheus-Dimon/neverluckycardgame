import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Game from './components/Game'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './AuthContext'
import { GameProvider } from './game/context/GameContext'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={
            <ProtectedRoute>
              <GameProvider>
                <Game />
              </GameProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
