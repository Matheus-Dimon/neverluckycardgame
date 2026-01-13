import React, { useContext } from 'react'
import { HERO_POWER_OPTIONS } from '../utils/constants.js'
import { GameContext } from '../context/GameContext'
import { gameAPI } from '../utils/api.js'

export default function HeroPowerSetup() {
  const { state, dispatch } = useContext(GameContext)
  const pool = state.isMultiplayer ? HERO_POWER_OPTIONS.P2 : HERO_POWER_OPTIONS.P1
  const selected = state.selectedHeroPowers || []

  const toggle = (id) => {
    const newSelected = selected.includes(id) 
      ? selected.filter(x => x !== id) 
      : [...selected, id]
    
    dispatch({ type: 'SET_SELECTED_HERO_POWERS', payload: newSelected })
  }

  const handleStart = async () => {
    if (selected.length < 2) {
      alert('Escolha exatamente 2 poderes de herói para continuar!')
      return
    }

    if (state.isMultiplayer && state.gameId) {
      try {
        // Submit to backend for online multiplayer
        const updatedGame = await gameAPI.selectHeroPowers(state.gameId, state.currentPlayerKey, selected)
        // Update local state with the response
        dispatch({ type: 'UPDATE_GAME_STATE', payload: updatedGame })
      } catch (error) {
        console.error('Failed to submit hero powers:', error)
        alert('Erro ao enviar poderes de herói. Tente novamente.')
      }
    } else if (state.isMultiplayer) {
      dispatch({ type: 'START_MULTIPLAYER_GAME' })
    } else {
      dispatch({ type: 'START_GAME' })
    }
  }

  // Check if we're waiting for the other player in multiplayer
  const isWaitingForOtherPlayer = state.isMultiplayer && state.gameId && selected.length === 2

  const getEffectDescription = (power) => {
    switch(power.effect) {
      case 'damage': return `Causa ${power.amount} de dano`
      case 'heal': return `Restaura ${power.amount} de vida`
      case 'armor': return `Ganha ${power.amount} de armadura`
      case 'draw': return `Compra ${power.amount} carta(s)`
      default: return power.description || 'Efeito especial'
    }
  }

  return (
    <div className="hero-power-setup">
      <div className="setup-header">
        <h2>Escolha seus Poderes de Herói</h2>
        <p className="setup-subtitle">
          {isWaitingForOtherPlayer
            ? "Aguardando o outro jogador..."
            : `Escolha exatamente 2 poderes • ${selected.length} selecionados`
          }
        </p>
      </div>

      <div className="hero-power-grid">
        {pool.map(power => (
          <div 
            key={power.id} 
            className={`hero-power-card ${selected.includes(power.id) ? 'selected' : ''} ${selected.length >= 2 && !selected.includes(power.id) ? 'disabled' : ''}`} 
            onClick={() => {
              if (selected.length >= 2 && !selected.includes(power.id)) return
              toggle(power.id)
            }}
          >
            <div className="power-icon">{power.icon || '✨'}</div>
            <div className="power-info">
              <div className="power-name">{power.name}</div>
              <div className="power-cost">{power.cost} mana</div>
              <div className="power-description">{getEffectDescription(power)}</div>
              {power.requiresTarget && (
                <div className="power-requirement">Requer alvo</div>
              )}
            </div>
            {selected.includes(power.id) && (
              <div className="selected-badge">✓</div>
            )}
          </div>
        ))}
      </div>

      <div className="setup-footer">
        <button
          onClick={handleStart}
          className={`btn btn-primary ${selected.length === 2 && !isWaitingForOtherPlayer ? '' : 'btn-disabled'}`}
          disabled={selected.length !== 2 || isWaitingForOtherPlayer}
        >
          {isWaitingForOtherPlayer
            ? 'Aguardando o outro jogador...'
            : selected.length === 2
              ? 'Começar Jogo! 🎮'
              : `Escolha ${2 - selected.length} poder(es)`
          }
        </button>
      </div>
    </div>
  )
}
