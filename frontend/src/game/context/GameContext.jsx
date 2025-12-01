import React, { createContext, useState, useEffect, useCallback } from 'react'
import { makeStartingDeck, makeStartingHeropower, shuffle, applyPassiveEffects, makeOrderedDeck } from '../utils/helpers.js'
import { CARD_OPTIONS, HERO_POWER_OPTIONS, HERO_PASSIVE_OPTIONS, STARTING_HP, STARTING_MANA, CARD_EFFECTS,STARTING_MANAP2 } from '../utils/constants.js'

export const GameContext = createContext(null)

const API_BASE_URL = 'http://localhost:9092/api/game'
const STARTING_DECK_SIZE = 15

// Convert API DTO to frontend format
const convertGameDTOToState = (gameDTO) => {
  if (!gameDTO) return null

  return {
    id: gameDTO.id,
    gamePhase: gameDTO.gamePhase,
    turn: gameDTO.turn === 'PLAYER1' ? 1 : 2,
    turnCount: gameDTO.turnCount,
    gameOver: gameDTO.gameOver,
    winner: gameDTO.winner,

    player1: gameDTO.player1State ? {
      hp: gameDTO.player1State.hp,
      mana: gameDTO.player1State.mana,
      maxMana: gameDTO.player1State.maxMana,
      armor: gameDTO.player1State.armor,
      hasUsedHeroPower: gameDTO.player1State.hasUsedHeroPower,
      hand: gameDTO.player1State.hand || [],
      deck: gameDTO.player1State.deck || [],
      field: {
        melee: gameDTO.player1State.meleeField || [],
        ranged: gameDTO.player1State.rangedField || []
      },
      heroPowers: gameDTO.player1State.heroPowers || [],
      passiveSkills: gameDTO.player1State.passiveSkills || []
    } : null,

    player2: gameDTO.player2State ? {
      hp: gameDTO.player2State.hp,
      mana: gameDTO.player2State.mana,
      maxMana: gameDTO.player2State.maxMana,
      armor: gameDTO.player2State.armor,
      hasUsedHeroPower: gameDTO.player2State.hasUsedHeroPower,
      hand: gameDTO.player2State.hand || [],
      deck: gameDTO.player2State.deck || [],
      field: {
        melee: gameDTO.player2State.meleeField || [],
        ranged: gameDTO.player2State.rangedField || []
      },
      heroPowers: gameDTO.player2State.heroPowers || [],
      passiveSkills: gameDTO.player2State.passiveSkills || []
    } : null,

    selectedCardId: gameDTO.selectedCardId,
    selectedPassiveSkills: gameDTO.selectedPassiveSkills || [],
    selectedDeckCards: gameDTO.selectedDeckCards || [],
    selectedHeroPowers: gameDTO.selectedHeroPowers || [],

    targeting: gameDTO.targeting ? {
      active: gameDTO.targeting.active,
      playerUsing: gameDTO.targeting.playerUsing,
      power: gameDTO.targeting.power,
      healingActive: gameDTO.targeting.healingActive,
      healerId: gameDTO.targeting.healerId,
      healAmount: gameDTO.targeting.healAmount
    } : { active: false, playerUsing: null, power: null, healingActive: false, healerId: null, healAmount: 0 },

    animation: gameDTO.animation || { active: false, element: null, startRect: null, endRect: null, callbackAction: null },
    isAITurnProcessing: gameDTO.isAITurnProcessing || false,
    soundEnabled: gameDTO.soundEnabled !== false
  }
}

const initialState = {
  player1: {
    hp: STARTING_HP,
    mana: STARTING_MANA,
    maxMana: STARTING_MANA,
    hand: [],
    field: { melee: [], ranged: [] },
    deck: shuffle(makeStartingDeck(CARD_OPTIONS.P1, STARTING_DECK_SIZE)),
    heroPowers: makeStartingHeropower(HERO_POWER_OPTIONS.P1),
    hasUsedHeroPower: false,
    armor: 0,
    passiveSkills: [],
  },
  player2: {
    hp: STARTING_HP,
    mana: STARTING_MANAP2,
    maxMana: STARTING_MANAP2,
    hand: [],
    field: { melee: [], ranged: [] },
    deck: shuffle(makeStartingDeck(CARD_OPTIONS.P2, STARTING_DECK_SIZE)),
    heroPowers: makeStartingHeropower(HERO_POWER_OPTIONS.P2),
    hasUsedHeroPower: false,
    armor: 0,
    passiveSkills: [],
  },
  turn: 1,
  turnCount: 1,
  gamePhase: 'START_MENU',
  gameOver: false,
  winner: null,
  selectedCardId: null,
  selectedPassiveSkills: [],
  selectedDeckCards: [],
  selectedHeroPowers: [],
  selectedPassiveSkillsP2: [],
  selectedDeckCardsP2: [],
  selectedHeroPowersP2: [],
  targeting: { active: false, playerUsing: null, power: null, healingActive: false, healerId: null, healAmount: 0 },
  healingTarget: { active: false, healerId: null, healAmount: 0 },
  animation: { active: false, element: null, startRect: null, endRect: null, callbackAction: null },
  isAITurnProcessing: false,
    soundEnabled: true,
}

// API helper functions
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

/* ------------------- PROVIDER WITH API ------------------- */
export function GameProvider({ children }) {
  const [state, setState] = useState(initialState)
  const [gameId, setGameId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedData, setSelectedData] = useState({
    passiveSkills: [],
    deckCards: [],
    heroPowers: []
  })

  // Load game state from API
  const loadGame = useCallback(async (id) => {
    if (!id) return
    setLoading(true)
    try {
      const gameDTO = await apiCall(`/${id}`)
      const gameState = convertGameDTOToState(gameDTO)
      setState(gameState)
      setGameId(id)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new game
  const createGame = useCallback(async (player1Id = 1) => { // Default player ID for now
    setLoading(true)
    try {
      const gameDTO = await apiCall(`/create?player1Id=${player1Id}`, {
        method: 'POST'
      })
      const gameState = convertGameDTOToState(gameDTO)
      setState(gameState)
      setGameId(gameDTO.id)
      setError(null)
      return gameDTO.id
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Generic action dispatcher that calls API
  const dispatch = useCallback(async (action) => {

    setLoading(true)
    try {
      let endpoint = `/${gameId}`
      let method = 'POST'
      let body = null

      switch (action.type) {
        case 'START_GAME':
          // Create game first if it doesn't exist
          let gameIdToUse = gameId
          if (!gameIdToUse) {
            try {
              gameIdToUse = await createGame()
              setGameId(gameIdToUse)
            } catch (err) {
              setError(err.message)
              setLoading(false)
              return
            }
          }
          endpoint = `/${gameIdToUse}/start`
          // Send selected data to backend
          body = {
            selectedPassiveSkills: selectedData.passiveSkills,
            selectedDeckCards: selectedData.deckCards,
            selectedHeroPowers: selectedData.heroPowers
          }
          break
        case 'PLAY_CARD':
          endpoint += '/play-card'
          body = {
            cardId: action.payload.cardId,
            playerKey: action.payload.playerKey
          }
          break
        case 'END_TURN':
          endpoint += '/end-turn'
          break
        case 'HERO_POWER_CLICK':
          endpoint += '/hero-power'
          body = {
            playerKey: action.payload.player,
            powerId: action.payload.powerId
          }
          break
        case 'APPLY_ATTACK_DAMAGE':
          endpoint += '/attack'
          body = {
            attackerId: action.payload.attackerId,
            targetId: action.payload.targetId,
            targetIsHero: action.payload.targetIsHero,
            playerKey: action.payload.playerKey
          }
          break
        case 'SELECT_PASSIVE_SKILLS':
          endpoint += '/select-passive-skills'
          body = action.payload
          break
        case 'SELECT_DECK':
          endpoint += '/select-deck'
          body = action.payload
          break
        case 'SELECT_HERO_POWERS':
          endpoint += '/select-hero-powers'
          body = action.payload
          break
        // Local state updates (no API call needed)
        case 'SELECT_ATTACKER':
        case 'INITIATE_ANIMATION':
        case 'END_ANIMATION':
        case 'SET_AI_PROCESSING':
        case 'GO_TO_PASSIVE_SKILLS':
        case 'SET_SELECTED_PASSIVE_SKILLS':
        case 'GO_TO_DECK_SETUP':
        case 'SET_SELECTED_DECK_CARDS':
        case 'GO_TO_HERO_POWER_OPTIONS':
        case 'SET_SELECTED_HERO_POWERS':
          setState(prevState => {
            if (!prevState) return prevState
            // Handle local state updates
            switch (action.type) {
              case 'SELECT_ATTACKER':
                return {
                  ...prevState,
                  selectedCardId: action.payload.cardId === prevState.selectedCardId ? null : action.payload.cardId
                }
              case 'INITIATE_ANIMATION':
                return {
                  ...prevState,
                  animation: { ...action.payload, active: true }
                }
              case 'END_ANIMATION':
                return {
                  ...prevState,
                  animation: { active: false, element: null, startRect: null, endRect: null, callbackAction: null }
                }
              case 'SET_AI_PROCESSING':
                return {
                  ...prevState,
                  isAITurnProcessing: !!action.payload
                }
              case 'GO_TO_PASSIVE_SKILLS':
                return {
                  ...prevState,
                  gamePhase: 'PASSIVE_SKILLS'
                }
              case 'SET_SELECTED_PASSIVE_SKILLS':
                setSelectedData(prev => ({ ...prev, passiveSkills: action.payload }))
                return {
                  ...prevState,
                  selectedPassiveSkills: action.payload
                }
              case 'GO_TO_DECK_SETUP':
                return {
                  ...prevState,
                  gamePhase: 'SETUP'
                }
              case 'SET_SELECTED_DECK_CARDS':
                setSelectedData(prev => ({ ...prev, deckCards: action.payload }))
                return {
                  ...prevState,
                  selectedDeckCards: action.payload
                }
              case 'GO_TO_HERO_POWER_OPTIONS':
                return {
                  ...prevState,
                  gamePhase: 'HERO_POWER_OPTIONS'
                }
              case 'SET_SELECTED_HERO_POWERS':
                setSelectedData(prev => ({ ...prev, heroPowers: action.payload }))
                return {
                  ...prevState,
                  selectedHeroPowers: action.payload
                }
              default:
                return prevState
            }
          })
          setLoading(false)
          return
        default:
          console.warn('Unknown action type:', action.type)
          setLoading(false)
          return
      }

      // Make API call for server-side actions
      const gameDTO = await apiCall(endpoint, {
        method,
        body: body ? JSON.stringify(body) : null
      })

      const gameState = convertGameDTOToState(gameDTO)
      setState(gameState)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Action failed:', action, err)
    } finally {
      setLoading(false)
    }
  }, [gameId])

  // Initialize game on mount if gameId is available
  useEffect(() => {
    if (gameId && !state) {
      loadGame(gameId)
    }
  }, [gameId, state, loadGame])

  const contextValue = {
    state,
    dispatch,
    gameId,
    loading,
    error,
    createGame,
    loadGame
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}
