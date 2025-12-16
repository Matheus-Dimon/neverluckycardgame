import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function GameLog({ log = [], maxEntries = 20 }) {
  const { t } = useLanguage()
  const logEndRef = useRef(null)

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [log])

  // Format log entries with icons and colors
  const formatLogEntry = (entry, index) => {
    if (typeof entry === 'string') {
      // Legacy string entries
      return {
        text: entry,
        icon: '📝',
        color: '#e2e8f0',
        timestamp: new Date().toLocaleTimeString()
      }
    }

    // Enhanced log entry format
    const { type, player, card, damage, mana, turn, target, effect } = entry

    let icon = '📝'
    let color = '#e2e8f0'
    let text = entry.text || ''

    switch (type) {
      case 'card_played':
        icon = card?.type?.name === 'Clérigo' ? '💉' :
               card?.type?.name === 'Arqueiro' ? '🏹' : '⚔️'
        color = player === 'player1' ? '#60a5fa' : '#f87171'
        text = `${player === 'player1' ? 'You' : 'Opponent'} played ${card?.name || 'a card'} (${card?.mana || 0} mana)`
        break

      case 'attack':
        icon = '⚔️'
        color = '#ff6b6b'
        text = `${card?.name || 'Unit'} attacked ${target?.name || 'target'} for ${damage} damage`
        break

      case 'heal':
        icon = '💚'
        color = '#4ade80'
        text = `${card?.name || 'Unit'} healed ${target?.name || 'target'} for ${damage} HP`
        break

      case 'hero_power':
        icon = '✨'
        color = '#fbbf24'
        text = `${player === 'player1' ? 'You' : 'Opponent'} used hero power: ${effect || 'special ability'}`
        break

      case 'turn_start':
        icon = '🔄'
        color = '#94a3b8'
        text = `Turn ${turn} - ${player === 'player1' ? 'Your' : 'Opponent\'s'} turn`
        break

      case 'mana_gain':
        icon = '💎'
        color = '#a855f7'
        text = `Gained ${mana} mana (total: ${mana})`
        break

      case 'card_draw':
        icon = '🃏'
        color = '#60a5fa'
        text = `Drew a card`
        break

      case 'death':
        icon = '💀'
        color = '#dc2626'
        text = `${card?.name || 'Unit'} died`
        break

      case 'battlecry':
        icon = '🎯'
        color = '#f59e0b'
        text = `${card?.name || 'Card'} battlecry: ${effect || 'special effect'}`
        break

      default:
        text = entry.text || 'Unknown action'
    }

    return {
      text,
      icon,
      color,
      timestamp: entry.timestamp || new Date().toLocaleTimeString()
    }
  }

  const recentLog = log.slice(-maxEntries)

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '300px',
      maxHeight: '400px',
      background: 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))',
      borderRadius: '12px',
      border: '2px solid rgba(139,92,46,0.4)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
      fontFamily: "'MedievalSharp', cursive",
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '2px solid rgba(245,192,107,0.3)',
        background: 'linear-gradient(90deg, rgba(245,192,107,0.1), transparent)'
      }}>
        <h4 style={{
          margin: 0,
          color: '#f5c06b',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          🏰 Game Log
        </h4>
      </div>

      {/* Log Entries */}
      <div style={{
        maxHeight: '320px',
        overflowY: 'auto',
        padding: '8px'
      }}>
        {recentLog.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '14px',
            padding: '20px',
            fontStyle: 'italic'
          }}>
            {t('gamelog.empty') || 'No actions yet...'}
          </div>
        ) : (
          recentLog.map((entry, index) => {
            const formatted = formatLogEntry(entry, index)
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  marginBottom: '4px',
                  background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '16px' }}>{formatted.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: formatted.color,
                    fontSize: '13px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word'
                  }}>
                    {formatted.text}
                  </div>
                  <div style={{
                    color: '#64748b',
                    fontSize: '11px',
                    marginTop: '2px'
                  }}>
                    {formatted.timestamp}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={logEndRef} />
      </div>

      {/* Footer with entry count */}
      {recentLog.length > 0 && (
        <div style={{
          padding: '6px 16px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <span style={{
            color: '#94a3b8',
            fontSize: '11px',
            fontWeight: 'bold'
          }}>
            {recentLog.length} {t('gamelog.entries') || 'entries'}
            {log.length > maxEntries && ` (${log.length - maxEntries} hidden)`}
          </span>
        </div>
      )}
    </div>
  )
}
