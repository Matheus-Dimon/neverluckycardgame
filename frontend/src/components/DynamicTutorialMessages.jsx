import React, { useEffect, useState, useContext } from 'react'
import { GameContext } from '../context/GameContext'
import { useLanguage } from '../context/LanguageContext'

export default function DynamicTutorialMessages() {
  const { state } = useContext(GameContext)
  const { t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [lastGameLogLength, setLastGameLogLength] = useState(0)

  // Define tutorial messages for different actions
  const tutorialMessages = {
    card_played: {
      title: t('tutorial.dynamic.card_played.title') || "Carta Jogada!",
      message: t('tutorial.dynamic.card_played.message') || "Você colocou uma unidade no campo! Agora ela pode atacar no próximo turno.",
      duration: 3000
    },
    attack: {
      title: t('tutorial.dynamic.attack.title') || "Ataque Realizado!",
      message: t('tutorial.dynamic.attack.message') || "Sua unidade atacou! Cada unidade pode atacar apenas uma vez por turno.",
      duration: 3000
    },
    hero_power: {
      title: t('tutorial.dynamic.hero_power.title') || "Poder do Herói Usado!",
      message: t('tutorial.dynamic.hero_power.message') || "Você ativou o poder do herói! Pode usar apenas uma vez por turno.",
      duration: 3000
    },
    turn_start: {
      title: t('tutorial.dynamic.turn_start.title') || "Novo Turno!",
      message: t('tutorial.dynamic.turn_start.message') || "Seu turno começou! Você ganhou mana e uma carta. Planeje suas ações!",
      duration: 3000
    },
    heal: {
      title: t('tutorial.dynamic.heal.title') || "Cura Aplicada!",
      message: t('tutorial.dynamic.heal.message') || "Sua unidade curou um aliado! Clérigos podem curar em vez de atacar.",
      duration: 3000
    }
  }

  useEffect(() => {
    // Only show dynamic messages if in tutorial mode
    if (!state.tutorialMode) return

    // Check for new game log entries
    if (state.gameLog.length > lastGameLogLength) {
      const newEntries = state.gameLog.slice(lastGameLogLength)

      newEntries.forEach(entry => {
        const messageData = tutorialMessages[entry.type]
        if (messageData) {
          const newMessage = {
            id: Date.now() + Math.random(),
            ...messageData,
            timestamp: Date.now()
          }

          setMessages(prev => [...prev, newMessage])

          // Auto-remove message after duration
          setTimeout(() => {
            setMessages(prev => prev.filter(msg => msg.id !== newMessage.id))
          }, messageData.duration)
        }
      })

      setLastGameLogLength(state.gameLog.length)
    }
  }, [state.gameLog, state.tutorialMode, lastGameLogLength])

  // Remove expired messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => prev.filter(msg => Date.now() - msg.timestamp < msg.duration))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (messages.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 3000,
      pointerEvents: 'none'
    }}>
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            border: '2px solid #f5c06b',
            borderRadius: '10px',
            padding: '15px 20px',
            marginBottom: '10px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.8)',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideInRight 0.5s ease-out',
            transform: `translateY(${index * 10}px)`,
            opacity: 1,
            transition: 'all 0.3s ease'
          }}
        >
          <h4 style={{
            color: '#f5c06b',
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            {msg.title}
          </h4>
          <p style={{
            color: '#e2e8f0',
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            {msg.message}
          </p>

          {/* Progress bar for message duration */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '10px',
            right: '10px',
            height: '3px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: '#f5c06b',
              width: '100%',
              animation: `shrink ${msg.duration}ms linear forwards`,
              borderRadius: '2px'
            }} />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}
