import React, { useContext } from 'react'
import { HERO_PASSIVE_OPTIONS } from '../utils/constants.js'
import { GameContext } from '../context/GameContext.jsx'
import { gameAPI } from '../utils/api.js'

export default function PassiveSkillsSetup() {
  const { state, dispatch } = useContext(GameContext)
  const pool = HERO_PASSIVE_OPTIONS.P1
  const selected = state.selectedPassiveSkills || []

  const toggle = (id) => {
    const newSelected = selected.includes(id) 
      ? selected.filter(x => x !== id) 
      : [...selected, id]
    
    dispatch({ type: 'SET_SELECTED_PASSIVE_SKILLS', payload: newSelected })
  }

  const handleNext = async () => {
    if (selected.length !== 3) {
      alert('Escolha exatamente 3 habilidades passivas!')
      return
    }

    if (state.isMultiplayer) {
      try {
        // Submit to backend for multiplayer
        const updatedGame = await gameAPI.selectPassiveSkills(state.gameId, state.currentPlayerKey, selected)
        // Update local state with the response
        dispatch({ type: 'UPDATE_GAME_STATE', payload: updatedGame })
      } catch (error) {
        console.error('Failed to submit passive skills:', error)
        alert('Erro ao enviar habilidades passivas. Tente novamente.')
      }
    } else {
      dispatch({ type: 'GO_TO_DECK_SETUP' })
    }
  }

  return (
    <div className="passive-skills-setup">
      <div className="setup-header">
        <h2>⚡ Escolha Suas Habilidades Passivas</h2>
        <p className="setup-subtitle">
          Escolha exatamente 3 habilidades • {selected.length}/3 selecionadas
        </p>
        <p className="setup-note">
          Essas habilidades estarão ativas durante toda a partida
        </p>
      </div>

      <div className="passive-skills-grid">
        {pool.map(skill => (
          <div 
            key={skill.id} 
            className={`passive-skill-card ${selected.includes(skill.id) ? 'selected' : ''} ${selected.length >= 3 && !selected.includes(skill.id) ? 'disabled' : ''}`} 
            onClick={() => {
              if (selected.length >= 3 && !selected.includes(skill.id)) return
              toggle(skill.id)
            }}
          >
            <div className="skill-icon-large">{skill.icon}</div>
            <div className="skill-content">
              <div className="skill-name">{skill.name}</div>
              <div className="skill-description">{skill.description}</div>
            </div>
            {selected.includes(skill.id) && (
              <div className="selected-badge">{selected.indexOf(skill.id) + 1}</div>
            )}
          </div>
        ))}
      </div>

      <div className="setup-footer">
        <button 
          onClick={handleNext} 
          className={`btn btn-primary ${selected.length === 3 ? '' : 'btn-disabled'}`}
          disabled={selected.length !== 3}
        >
          {selected.length === 3 ? 'Próximo: Escolher Deck →' : `Escolha ${3 - selected.length} habilidade(s)`}
        </button>
      </div>
    </div>
  )
}
