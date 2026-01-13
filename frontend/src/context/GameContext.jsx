import React, { createContext, useReducer, useEffect, useRef } from 'react'
import { makeStartingDeck, makeStartingHeropower, shuffle, applyPassiveEffects, makeOrderedDeck } from '../utils/helpers.js'
import { CARD_OPTIONS, HERO_POWER_OPTIONS, HERO_PASSIVE_OPTIONS, STARTING_HP, STARTING_MANA, CARD_EFFECTS,STARTING_MANAP2 } from '../utils/constants.js'

export const GameContext = createContext(null)
const STARTING_DECK_SIZE = 15

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
  isMultiplayer: false,
  targeting: { active: false, playerUsing: null, power: null, healingActive: false, healerId: null, healAmount: 0 },
  healingTarget: { active: false, healerId: null, healAmount: 0 },
  animation: { active: false, element: null, startRect: null, endRect: null, callbackAction: null },
  isAITurnProcessing: false,
  soundEnabled: true,
  gameLog: [],
  tutorialMode: false,
  tutorialStep: 0,
  tutorialHighlights: [],
  tutorialMessage: null,
  tutorialMessageTimeout: null,
}

/* ------------------- AI Selections ------------------- */
function selectAIPassives() {
  const pool = HERO_PASSIVE_OPTIONS.P2
  // Chosen: magia negra, pacto sombrio, vigor das trevas
  const preferred = ['passive_mana_regen_p2', 'passive_cheaper_minions_p2', 'passive_hp_boost_p2']
  const selected = []
  preferred.forEach(id => {
    const skill = pool.find(s => s.id === id)
    if (skill) selected.push(id)
  })
  while (selected.length < 3 && selected.length < pool.length) {
    const random = pool[Math.floor(Math.random() * pool.length)]
    if (!selected.includes(random.id)) selected.push(random.id)
  }
  return selected.slice(0, 3)
}

function selectAIDeck() {
  const pool = CARD_OPTIONS.P2
  let selectedCards = []

  // Group cards by mana cost
  const cardsByMana = {}
  pool.forEach(card => {
    if (!cardsByMana[card.mana]) {
      cardsByMana[card.mana] = []
    }
    cardsByMana[card.mana].push(card)
  })

  // For each mana cost, select 3 cards (or all if less than 3 available)
  Object.keys(cardsByMana).forEach(manaCost => {
    const cards = cardsByMana[manaCost]

    // Score cards: prioritize effects, stats, low cost
    const scoredCards = cards.map(card => ({
      ...card,
      score: (card.attack || 0) + (card.defense || 0) +
             ((card.effects?.length || 0) * 5) +
             (card.mana < 3 ? 15 : 0) -
             (card.mana * 5) +
             Math.random() * 3
    })).sort((a, b) => b.score - a.score)

    // Select top 3 (or all available if less than 3)
    const selectedCount = Math.min(3, scoredCards.length)
    for (let i = 0; i < selectedCount; i++) {
      selectedCards.push(scoredCards[i].id)
    }
  })

  // If we don't have exactly 15 cards, fill with random cards
  while (selectedCards.length < 15) {
    const randomCard = pool[Math.floor(Math.random() * pool.length)]
    if (!selectedCards.includes(randomCard.id)) {
      selectedCards.push(randomCard.id)
    }
  }

  return selectedCards.slice(0, 15)
}

function selectAIPowers() {
  const pool = HERO_POWER_OPTIONS.P2
  // Prefer: cristal arcano and tempestade
  const preferredOrder = ['p2_mana_boost', 'p2_damage_all']
  const selected = []
  preferredOrder.forEach(id => {
    const power = pool.find(p => p.id === id)
    if (power && selected.length < 2) selected.push(id)
  })

  while (selected.length < 2 && selected.length < pool.length) {
    const random = pool[Math.floor(Math.random() * pool.length)]
    if (!selected.includes(random.id)) selected.push(random.id)
  }
  return selected.slice(0, 2)
}

/* ------------------- AUXILIARES ------------------- */
function safeLaneCopy(field = {}) {
  return {
    melee: Array.isArray(field.melee) ? [...field.melee] : [],
    ranged: Array.isArray(field.ranged) ? [...field.ranged] : []
  }
}

function addGameLogEntry(state, entry) {
  const newLog = [...state.gameLog, {
    ...entry,
    timestamp: new Date().toLocaleTimeString()
  }].slice(-50) // Keep only last 50 entries
  return { ...state, gameLog: newLog }
}

function applyDamageToField(field, targetId, dmg, turnCount) {
  if (!targetId) return field
  const safeField = safeLaneCopy(field)
  ;['melee','ranged'].forEach(lane => {
    safeField[lane] = safeField[lane].map(c => {
      if (c.id === targetId) {
        // Verifica imunidade primeira rodada
        if (c.immuneFirstTurn && c.turnPlayed === turnCount) {
          return c // Imune ao dano
        }
        return {...c, defense: c.defense - dmg}
      }
      return c
    })
  })
  ;['melee','ranged'].forEach(lane => {
    safeField[lane] = safeField[lane].filter(c => c.defense > 0)
  })
  return safeField
}

function markAttackerAsUsed(field, attackerId) {
  if (!attackerId) return field
  const safeField = safeLaneCopy(field)
  ;['melee','ranged'].forEach(lane => {
    safeField[lane] = safeField[lane].map(c=> c.id===attackerId ? {...c, canAttack:false} : c)
  })
  return safeField
}

function applyDamageToHero(player, damage) {
  let dmg = damage
  const newPlayer = {...player}
  
  if (newPlayer.armor > 0) {
    const absorbed = Math.min(newPlayer.armor, dmg)
    newPlayer.armor -= absorbed
    dmg -= absorbed
  }
  
  if (dmg > 0) {
    newPlayer.hp = Math.max(0, newPlayer.hp - dmg)
  }
  
  return newPlayer
}

function applyCardEffects(state, card, playerKey) {
  if (!card.effects || card.effects.length === 0) return state
  
  let newState = {...state}
  const opponentKey = playerKey === 'player1' ? 'player2' : 'player1'
  
  card.effects.forEach(effect => {
    if (effect.type === 'BATTLECRY' && effect.trigger === 'ON_PLAY') {
      if (effect.effect === 'DAMAGE_ALL_ENEMIES') {
        const opponent = {...newState[opponentKey]}
        opponent.field = safeLaneCopy(opponent.field)
        ;['melee', 'ranged'].forEach(lane => {
          opponent.field[lane] = opponent.field[lane].map(c => ({
            ...c,
            defense: c.defense - effect.value
          })).filter(c => c.defense > 0)
        })
        newState[opponentKey] = opponent
      } else if (effect.effect === 'HEAL_HERO') {
        const player = {...newState[playerKey]}
        player.hp = player.hp + effect.value // SEM limite!
        newState[playerKey] = player
      } else if (effect.effect === 'HEAL_TARGET' && effect.requiresTarget) {
        // Para clérigos que curam alvos específicos
        // Isso precisa ser tratado com targeting separado
        // Por enquanto, vamos apenas curar o herói
        const player = {...newState[playerKey]}
        player.hp = player.hp + effect.value
        newState[playerKey] = player
      } else if (effect.effect === 'DRAW_CARD') {
        const player = {...newState[playerKey]}
        const drawn = player.deck.slice(0, effect.value).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
        player.hand = [...player.hand, ...drawn]
        player.deck = player.deck.slice(effect.value)
        newState[playerKey] = player
      } else if (effect.effect === 'BUFF_ALL_ALLIES') {
        const player = {...newState[playerKey]}
        player.field = safeLaneCopy(player.field)
        ;['melee', 'ranged'].forEach(lane => {
          player.field[lane] = player.field[lane].map(c => ({
            ...c,
            attack: c.attack + effect.value,
            defense: c.defense + effect.value
          }))
        })
        newState[playerKey] = player
      }
    }
  })

  return newState
}

/* ------------------- HERO POWER ------------------- */
function applyHeroPowerEffect(state, playerKey, power, targetCardId = null, targetIsHero = false) {
  const opponentKey = playerKey === 'player1' ? 'player2' : 'player1'
  const player = {...state[playerKey]}
  const opponent = {...state[opponentKey]}

  if (player.mana < power.cost) return state
  if (player.hasUsedHeroPower) return state

  player.mana -= power.cost
  player.hasUsedHeroPower = true

  switch (power.effect) {
    case 'damage': {
      const dmg = power.amount || 1
      if (targetIsHero) {
        const updatedOpponent = applyDamageToHero(opponent, dmg)
        return {
          ...state,
          [playerKey]: player,
          [opponentKey]: updatedOpponent,
          gameOver: updatedOpponent.hp <= 0,
          winner: updatedOpponent.hp <= 0 ? playerKey : null
        }
      } else if (targetCardId) {
        const updatedField = applyDamageToField(opponent.field, targetCardId, dmg, state.turnCount)
        return {
          ...state,
          [playerKey]: player,
          [opponentKey]: {...opponent, field: updatedField}
        }
      }
      return state
    }

    case 'heal_target': {
      const heal = power.amount || 4
      if (targetIsHero) {
        const updatedPlayer = {...player}
        updatedPlayer.hp = updatedPlayer.hp + heal // Allow overheal
        return {...state, [playerKey]: updatedPlayer}
      } else if (targetCardId) {
        let updatedPlayer = {...player}
        updatedPlayer.field = safeLaneCopy(updatedPlayer.field)
        ;['melee', 'ranged'].forEach(lane => {
          updatedPlayer.field[lane] = updatedPlayer.field[lane].map(c => {
            if (c.id === targetCardId) {
              return {...c, defense: c.defense + heal} // Heal defense as HP for units
            }
            return c
          })
        })
        return {...state, [playerKey]: updatedPlayer}
      }
      return state
    }

    case 'heal': {
      const heal = power.amount || 2
      player.hp = player.hp + heal // SEM limite!
      return {...state, [playerKey]: player}
    }

    case 'armor': {
      const armor = power.amount || 2
      player.armor = (player.armor || 0) + armor
      return {...state, [playerKey]: player}
    }

    case 'draw': {
      const count = power.amount || 1
      const drawn = player.deck.slice(0, count).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
      player.hand = [...player.hand, ...drawn]
      player.deck = player.deck.slice(count)
      return {...state, [playerKey]: player}
    }

    case 'charge_melee': {
      const player = {...state[playerKey]}
      player.field = safeLaneCopy(player.field)
      ;['melee'].forEach(lane => {
        player.field[lane] = player.field[lane].map(c => ({
          ...c,
          canAttack: true
        }))
      })
      return {...state, [playerKey]: player}
    }

    case 'buff_all': {
      console.log(`Aplicando Bênção: +${power.amount || 2}/+${power.amount || 2} a todas unidades de ${playerKey}`)
      const amount = power.amount || 2
      const player = {...state[playerKey]}
      const oldField = player.field
      player.field = safeLaneCopy(player.field)
      ;['melee', 'ranged'].forEach(lane => {
        player.field[lane] = player.field[lane].map(c => ({
          ...c,
          attack: c.attack + amount,
          defense: c.defense + amount
        }))
        console.log(`Bênção aplicada a ${lane}: ${player.field[lane].length} unidades buffs`)
      })
      console.log('Campo antes:', oldField)
      console.log('Campo depois da Bênção:', player.field)
      return {...state, [playerKey]: player}
    }

    case 'damage_all_enemies': {
      console.log(`Aplicando Tempestade: ${power.amount || 2} dano a todas unidades inimigas`)
      const dmg = power.amount || 2
      const opponent = {...state[opponentKey]}
      opponent.field = safeLaneCopy(opponent.field)
      ;['melee', 'ranged'].forEach(lane => {
        const initialCount = opponent.field[lane].length
        opponent.field[lane] = opponent.field[lane].map(c => ({
          ...c,
          defense: c.defense - dmg
        })).filter(c => c.defense > 0)
        const finalCount = opponent.field[lane].length
        console.log(`Tempestade em ${lane}: ${initialCount} -> ${finalCount} unidades restantes`)
      })
      return {
        ...state,
        [playerKey]: player,
        [opponentKey]: opponent
      }
    }

    case 'mana_boost': {
      const amount = power.amount || 2
      player.mana += amount
      return {...state, [playerKey]: player}
    }

    case 'draw_from_graveyard': {
      // Assuming graveyard is not implemented, just draw normal
      const count = power.amount || 1
      const drawn = player.deck.slice(0, count).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
      player.hand = [...player.hand, ...drawn]
      player.deck = player.deck.slice(count)
      return {...state, [playerKey]: player}
    }

    default:
      return state
  }
}

/* ------------------- REDUCER ------------------- */
function reducer(state=initialState, action){
  switch(action.type){

    case 'GO_TO_START_MENU': {
      return { ...state, gamePhase: 'START_MENU', tutorialMode: false };
    }

    case 'GO_TO_FRIENDS': {
      return { ...state, gamePhase: 'FRIENDS' };
    }

    case 'GO_TO_LOGIN': {
      return { ...state, gamePhase: 'LOGIN_PAGE', tutorialMode: false };
    }

    case 'GO_TO_PASSIVE_SKILLS': {
      return { ...state, gamePhase: 'PASSIVE_SKILLS' };
    }

    case 'START_MULTIPLAYER_SETUP': {
      return { ...state, gamePhase: 'PASSIVE_SKILLS', isMultiplayer: true };
    }

    case 'GO_TO_DECK_SETUP_DIRECT': {
      return {...state, gamePhase: 'SETUP', selectedPassiveSkills: []};
    }

    case 'SET_SELECTED_PASSIVE_SKILLS': {
      if (state.isMultiplayer) {
        return {...state, selectedPassiveSkills: action.payload}
      }
      return {...state, selectedPassiveSkills: action.payload}
    }

    case 'GO_TO_DECK_SETUP': {
      if (state.selectedPassiveSkills.length !== 3) return state
      return {...state, gamePhase: 'SETUP'}
    }

    case 'SET_SELECTED_DECK_CARDS': {
      return {...state, selectedDeckCards: action.payload}
    }

    case 'SET_SELECTED_HERO_POWERS': {
      return {...state, selectedHeroPowers: action.payload}
    }

    case 'GO_TO_HERO_POWER_OPTIONS': {
      if (state.selectedDeckCards.length < 15) return state

      // For multiplayer, go to hero power selection phase
      if (state.isMultiplayer) {
        const p2Deck = makeOrderedDeck(CARD_OPTIONS.P2, state.selectedDeckCards)

        return {
          ...state,
          gamePhase: 'HERO_POWER_OPTIONS',
          player2: {
            ...state.player2,
            deck: p2Deck
          }
        }
      }

      // USA A ORDEM ESCOLHIDA - NÃO embaralha
      const p1Deck = makeOrderedDeck(CARD_OPTIONS.P1, state.selectedDeckCards)

      return {
        ...state,
        gamePhase: 'HERO_POWER_OPTIONS',
        player1: {
          ...state.player1,
          deck: p1Deck
        }
      }
    }

    case 'GO_TO_HERO_POWER_OPTIONS_P2': {
      if (state.selectedDeckCards.length < 15) return state

      // For player2 setup in multiplayer
      const p2Deck = makeOrderedDeck(CARD_OPTIONS.P2, state.selectedDeckCards)

      return {
        ...state,
        gamePhase: 'HERO_POWER_OPTIONS',
        player2: {
          ...state.player2,
          deck: p2Deck
        }
      }
    }

    case 'START_GAME': {
      if (state.selectedHeroPowers.length < 2) return state

      // AI selections
      const aiPassives = selectAIPassives()
      const aiDeckCards = selectAIDeck()
      const aiPowers = selectAIPowers()

      const p1Powers = state.selectedHeroPowers.map(powerId => {
        const power = HERO_POWER_OPTIONS.P1.find(p => p.id === powerId)
        return {...power}
      })

      const p2Powers = aiPowers.map(powerId => {
        const power = HERO_POWER_OPTIONS.P2.find(p => p.id === powerId)
        return {...power}
      })

      // Ordered decks
      const p1Deck = makeOrderedDeck(CARD_OPTIONS.P1, state.selectedDeckCards)
      const p2Deck = makeOrderedDeck(CARD_OPTIONS.P2, aiDeckCards)

      let p1 = {
        ...state.player1,
        heroPowers: p1Powers,
        deck: p1Deck,
        passiveSkills: state.selectedPassiveSkills,
        hand: [],
      }

      let p2 = {
        ...state.player2,
        heroPowers: p2Powers,
        deck: p2Deck,
        passiveSkills: aiPassives,
        hand: [],
      }

      // Apply passive effects
      p1 = applyPassiveEffects(p1, state.selectedPassiveSkills)
      p2 = applyPassiveEffects(p2, aiPassives)

      const draw = (p, n) => {
        const drawn = p.deck.slice(0, n).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
        p.hand = [...p.hand, ...drawn]
        p.deck = p.deck.slice(n)
      }

      let startHandP1 = 4

      let startHandP2 = 6

      draw(p1, startHandP1)
      draw(p2, startHandP2)

      return {...state, player1: p1, player2: p2, gamePhase: 'PLAYING', turnCount: 1, selectedPassiveSkillsP2: aiPassives, selectedDeckCardsP2: aiDeckCards, selectedHeroPowersP2: aiPowers}
    }

    case 'START_MULTIPLAYER_GAME': {
      if (state.selectedHeroPowers.length < 2) return state

      // For multiplayer, assume player1 has the same setup as player2 would have
      // In a full implementation, player1 would set up remotely
      // For now, use AI selections for player1 and player2 setup for player2

      const p1Passives = selectAIPassives() // Placeholder for player1 setup
      const p1DeckCards = selectAIDeck()
      const p1Powers = selectAIPowers()

      const p2Powers = state.selectedHeroPowers.map(powerId => {
        const power = HERO_POWER_OPTIONS.P2.find(p => p.id === powerId)
        return {...power}
      })

      // Ordered decks
      const p1Deck = makeOrderedDeck(CARD_OPTIONS.P1, p1DeckCards)
      const p2Deck = makeOrderedDeck(CARD_OPTIONS.P2, state.selectedDeckCards)

      let p1 = {
        ...state.player1,
        heroPowers: p1Powers.map(powerId => {
          const power = HERO_POWER_OPTIONS.P1.find(p => p.id === powerId)
          return {...power}
        }),
        deck: p1Deck,
        passiveSkills: p1Passives,
        hand: [],
      }

      let p2 = {
        ...state.player2,
        heroPowers: p2Powers,
        deck: p2Deck,
        passiveSkills: state.selectedPassiveSkills,
        hand: [],
      }

      // Apply passive effects
      p1 = applyPassiveEffects(p1, p1Passives)
      p2 = applyPassiveEffects(p2, state.selectedPassiveSkills)

      const draw = (p, n) => {
        const drawn = p.deck.slice(0, n).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
        p.hand = [...p.hand, ...drawn]
        p.deck = p.deck.slice(n)
      }

      draw(p1, 4)
      draw(p2, 4) // Both start with 4 cards in multiplayer

      return {
        ...state,
        player1: p1,
        player2: p2,
        gamePhase: 'PLAYING',
        turnCount: 1,
        isMultiplayer: true,
        selectedPassiveSkillsP2: state.selectedPassiveSkills,
        selectedDeckCardsP2: state.selectedDeckCards,
        selectedHeroPowersP2: state.selectedHeroPowers
      }
    }

    case 'LOAD_MULTIPLAYER_GAME': {
      const { gameData, playerKey } = action.payload

      // Convert backend game data to frontend format
      const convertPlayerState = (backendState, isPlayer1) => {
        const cardOptions = isPlayer1 ? CARD_OPTIONS.P1 : CARD_OPTIONS.P2
        const heroOptions = isPlayer1 ? HERO_POWER_OPTIONS.P1 : HERO_POWER_OPTIONS.P2

        return {
          hp: backendState.hp,
          mana: backendState.mana,
          maxMana: backendState.maxMana,
          armor: backendState.armor,
          hand: backendState.hand.map(card => ({
            ...card,
            id: card.uniqueId,
            type: { lane: card.lane, name: card.unitType === 'WARRIOR' ? 'Guerreiro' : 'Clérigo' }
          })),
          deck: backendState.deck.map(card => ({
            ...card,
            id: card.uniqueId,
            type: { lane: card.lane, name: card.unitType === 'WARRIOR' ? 'Guerreiro' : 'Clérigo' }
          })),
          field: {
            melee: backendState.meleeField.map(card => ({
              ...card,
              id: card.uniqueId,
              type: { lane: card.lane, name: card.unitType === 'WARRIOR' ? 'Guerreiro' : 'Clérigo' }
            })),
            ranged: backendState.rangedField.map(card => ({
              ...card,
              id: card.uniqueId,
              type: { lane: card.lane, name: card.unitType === 'WARRIOR' ? 'Guerreiro' : 'Clérigo' }
            }))
          },
          heroPowers: backendState.heroPowers.map(powerId => {
            const power = heroOptions.find(p => p.id === powerId)
            return power ? {...power} : { id: powerId, name: 'Unknown', effect: 'damage', cost: 2, amount: 1 }
          }),
          hasUsedHeroPower: backendState.hasUsedHeroPower,
          passiveSkills: backendState.passiveSkills || []
        }
      }

      let player1, player2, turn

      if (playerKey === 'player1') {
        player1 = convertPlayerState(gameData.player1State, true)
        player2 = convertPlayerState(gameData.player2State, false)
        turn = gameData.turn.toLowerCase()
      } else {
        // If current user is player2, swap the players so player1 is always the current user
        player1 = convertPlayerState(gameData.player2State, false)
        player2 = convertPlayerState(gameData.player1State, true)
        turn = gameData.turn.toLowerCase() === 'player1' ? 'player2' : 'player1'
      }

      return {
        ...state,
        player1,
        player2,
        gamePhase: 'PLAYING',
        turn,
        turnCount: gameData.turnCount,
        gameOver: gameData.gameOver,
        winner: gameData.winner,
        isMultiplayer: true,
        currentPlayerKey: playerKey
      }
    }

    case 'PLAY_CARD': {
      const {cardId, playerKey} = action.payload
      const player = {...state[playerKey]}
      const index = player.hand.findIndex(c => c.id === cardId)
      if (index === -1) return state

      let card = {...player.hand[index]}

      // Aplica modificador de custo de passiva
      if (player.passiveSkills?.some(id => id.includes('cheaper_minions'))) {
        card.mana = Math.max(1, card.mana - 1)
      }

      if (player.mana < card.mana) return state

      player.mana -= card.mana
      player.hand = player.hand.filter(c => c.id !== cardId)

      // Aplica buffs de passivas
      if (player.passiveSkills?.some(id => id.includes('hp_boost'))) {
        card.defense += 1
      }
      if (player.passiveSkills?.some(id => id.includes('atk_boost'))) {
        card.attack += 1
      }
      if (card.type?.lane === 'ranged' && player.passiveSkills?.some(id => id.includes('ranged_damage'))) {
        card.attack += 1
      }

      // Verifica efeitos da carta
      let canAttack = false
      let immuneFirstTurn = false

      if (card.effects) {
        card.effects.forEach(effect => {
          if (effect.effect === 'CHARGE') canAttack = true
          if (effect.effect === 'IMMUNE_FIRST_TURN') immuneFirstTurn = true
        })
      }

      // Passiva de charge para melee
      if (card.type?.lane === 'melee' && player.passiveSkills?.some(id => id.includes('charge_melee'))) {
        canAttack = true
      }

      const lane = card.type?.lane || 'melee'
      const field = safeLaneCopy(player.field)

      // IMPORTANTE: Immune não dá charge!
      card.canAttack = canAttack
      card.immuneFirstTurn = immuneFirstTurn
      card.turnPlayed = state.turnCount
      card.currentTurn = state.turnCount

      field[lane] = [...field[lane], card]

      let newState = {...state, [playerKey]: {...player, field}}

      // Aplica efeitos battlecry
      newState = applyCardEffects(newState, card, playerKey)

      // Add log entry
      newState = addGameLogEntry(newState, {
        type: 'card_played',
        player: playerKey,
        card: card,
        turn: state.turnCount
      })

      return newState
    }

    case 'HERO_POWER_CLICK': {
      const {player: playerKey, powerId} = action.payload
      const player = state[playerKey]
      const heroPowers = Array.isArray(player.heroPowers) ? player.heroPowers : []
      const power = powerId ? heroPowers.find(p => p.id === powerId) : heroPowers[0]
      
      if (!power) return state
      
      let cost = power.cost
      // Passiva de custo reduzido
      if (player.passiveSkills?.some(id => id.includes('hero_power_cheap'))) {
        cost = Math.max(0, cost - 1)
      }
      
      if (player.mana < cost || player.hasUsedHeroPower) return state
      
      const modifiedPower = {...power, cost}
      
      if (!power.requiresTarget) {
        return applyHeroPowerEffect(state, playerKey, modifiedPower)
      }
      
      return {
        ...state, 
        targeting: {
          active: true, 
          playerUsing: playerKey, 
          power: modifiedPower
        }
      }
    }

    case 'APPLY_HERO_POWER_WITH_TARGET': {
      const {playerKey, power, targetCardId, targetIsHero} = action.payload
      const newState = applyHeroPowerEffect(state, playerKey, power, targetCardId, targetIsHero)

      // Add log entry for hero power
      let finalState = addGameLogEntry({...newState, targeting: {active: false, playerUsing: null, power: null, healingActive: false, healerId: null, healAmount: 0}}, {
        type: 'hero_power',
        player: playerKey,
        effect: power.effect,
        turn: state.turnCount
      })

      // Tutorial message for first hero power use is handled automatically by DynamicTutorialMessages component

      return finalState
    }

    case 'INITIATE_HEAL_TARGETING': {
      const { healerId, healAmount } = action.payload
      // Start charging animation for healer (similar to attack)
      const healerEl = document.querySelector(`[data-card-id="${healerId}"]`)
      if (healerEl) {
        const originalTransform = healerEl.style.transform
        healerEl.style.transform = originalTransform + ' translateY(-20px) scale(1.1)'
        setTimeout(() => {
          healerEl.style.transform = originalTransform
        }, 400)
      }
      return {
        ...state,
        targeting: {
          active: false,
          playerUsing: 'player1',
          power: null,
          healingActive: true,
          healerId,
          healAmount
        },
        selectedCardId: null // Deselect any attacker
      }
    }

    case 'APPLY_HEAL_WITH_TARGET': {
      const { targetCardId, targetIsHero } = action.payload
      const { healerId, healAmount } = state.targeting
      const player = { ...state.player1 }

      // Mark healer as used
      player.field = markAttackerAsUsed(player.field, healerId)

      let updatedPlayer = { ...player }

      if (targetIsHero) {
        updatedPlayer.hp = updatedPlayer.hp + healAmount // Allow overheal
      } else if (targetCardId) {
        updatedPlayer.field = safeLaneCopy(updatedPlayer.field)
        ;['melee', 'ranged'].forEach(lane => {
          updatedPlayer.field[lane] = updatedPlayer.field[lane].map(c => {
            if (c.id === targetCardId) {
              return { ...c, defense: c.defense + healAmount } // Allow overheal
            }
            return c
          })
        })
      }



      return {
        ...state,
        player1: updatedPlayer,
        targeting: {active: false, playerUsing: null, power: null, healingActive: false, healerId: null, healAmount: 0}
      }
    }

    case 'CANCEL_TARGETING': {
      return {...state, targeting: {active: false, playerUsing: null, power: null, healingActive: false, healerId: null, healAmount: 0}}
    }

    case 'DRAW_CARD': {
      const {playerKey, count=1} = action.payload
      const player = {...state[playerKey]}
      const drawn = player.deck.slice(0, count).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
      player.hand = [...player.hand, ...drawn]
      player.deck = player.deck.slice(count)
      return {...state, [playerKey]: player}
    }

    case 'SELECT_ATTACKER': {
      const {cardId} = action.payload
      return {...state, selectedCardId: cardId === state.selectedCardId ? null : cardId}
    }

    case 'INITIATE_ANIMATION': {
      return {...state, animation: {...action.payload, active: true}}
    }

    case 'END_ANIMATION': {
      return {...state, animation: {active: false, element: null, startRect: null, endRect: null, callbackAction: null}}
    }

    case 'APPLY_ATTACK_DAMAGE': {
      const {attackerId, targetId, targetIsHero, damage, playerKey} = action.payload
      const opponentKey = playerKey === 'player1' ? 'player2' : 'player1'

      // Marca atacante como usado
      let attacker = {...state[playerKey]}
      attacker.field = markAttackerAsUsed(attacker.field, attackerId)

      // Pega dados do atacante
      const attackerCard = [...state[playerKey].field.melee, ...state[playerKey].field.ranged]
        .find(c => c.id === attackerId)

      let newState = {...state, [playerKey]: attacker}

      // Verifica se é um clérigo (tem healValue e é CLERIC)
      const isCleric = attackerCard?.type.name === 'Clérigo'

      if (targetIsHero) {
        if (isCleric) {
          // Clérigo cura herói aliado
          const player = {...state[playerKey]}
          const healValue = attackerCard.healValue || damage
          player.hp = player.hp + healValue // SEM limite (overheal)
          newState = {...newState, [playerKey]: {...player, field: safeLaneCopy(state[playerKey].field)}}

          // Add log entry for healing
          newState = addGameLogEntry(newState, {
            type: 'heal',
            player: playerKey,
            card: attackerCard,
            damage: healValue,
            target: { name: playerKey === 'player1' ? 'Your Hero' : 'Enemy Hero' }
          })
        } else {
          // Unidade normal ataca herói inimigo
          const opp = applyDamageToHero(state[opponentKey], damage)
          newState = {...newState, [opponentKey]: {...opp, field: safeLaneCopy(state[opponentKey].field)}}

          // Add log entry for attack
          newState = addGameLogEntry(newState, {
            type: 'attack',
            player: playerKey,
            card: attackerCard,
            damage: damage,
            target: { name: opponentKey === 'player1' ? 'Your Hero' : 'Enemy Hero' }
          })

          // Lifesteal
          if (attackerCard?.effects?.some(e => e.effect === 'LIFESTEAL')) {
            const newAttacker = {...newState[playerKey]}
            newAttacker.hp = newAttacker.hp + damage
            newState[playerKey] = newAttacker
          }

          if (opp.hp <= 0) {
            return {...newState, gameOver: true, winner: playerKey}
          }
        }
        return newState
      }

      // Ataque/heal a minion
      let player = {...state[playerKey]}
      let opp = {...state[opponentKey]}

      if (isCleric) {
        // Clérigo cura unidade aliada
        const targetCard = [...state[playerKey].field.melee, ...state[playerKey].field.ranged]
          .find(c => c.id === targetId)

        if (targetCard) {
          const healValue = attackerCard.healValue || damage
          player.field = safeLaneCopy(player.field)
          ;['melee', 'ranged'].forEach(lane => {
            player.field[lane] = player.field[lane].map(c => {
              if (c.id === targetId) {
                return {...c, defense: c.defense + healValue} // SEM limite (overheal)
              }
              return c
            })
          })
          newState = {...newState, [playerKey]: {...player}, [opponentKey]: {...opp, field: safeLaneCopy(state[opponentKey].field)}}

          // Add log entry for healing unit
          newState = addGameLogEntry(newState, {
            type: 'heal',
            player: playerKey,
            card: attackerCard,
            damage: healValue,
            target: targetCard
          })
        }
      } else {
        // Unidade normal ataca minion inimigo
        const targetCard = [...state[opponentKey].field.melee, ...state[opponentKey].field.ranged]
          .find(c => c.id === targetId)

        opp.field = applyDamageToField(opp.field, targetId, damage, state.turnCount)

        // Add log entry for attack
        newState = addGameLogEntry({...newState, [opponentKey]: opp}, {
          type: 'attack',
          player: playerKey,
          card: attackerCard,
          damage: damage,
          target: targetCard
        })

        // CONTRA-ATAQUE: Se MELEE atacou MELEE, o atacante recebe dano de volta
        if (attackerCard?.type?.lane === 'melee' && targetCard?.type?.lane === 'melee') {
          const counterDamage = targetCard.attack || 0
          attacker.field = applyDamageToField(attacker.field, attackerId, counterDamage, state.turnCount)

          // Add log entry for counter attack
          newState = addGameLogEntry(newState, {
            type: 'attack',
            player: opponentKey,
            card: targetCard,
            damage: counterDamage,
            target: attackerCard
          })
        }

        // Lifesteal
        if (attackerCard?.effects?.some(e => e.effect === 'LIFESTEAL')) {
          attacker.hp = attacker.hp + damage
        }

        newState = {...newState, [playerKey]: attacker, [opponentKey]: opp}
      }

      // Tutorial advancement for attack sequence
      if (state.tutorialMode && playerKey === 'player1') {
        if (state.tutorialStep === 2) { // target_selection step - player clicked enemy unit
          // Advance to turn_flow step
          newState = {
            ...newState,
            tutorialStep: 3, // Advance to turn_flow
            tutorialHighlights: ['end-turn']
          }
        } else if (state.tutorialStep === 4) { // attacking step - player completed attack
          // Advance to reinforcement_attack step
          newState = {
            ...newState,
            tutorialStep: 5 // Advance to reinforcement_attack
          }
        }
      }

      return newState
    }

    case 'END_TURN': {
      const nextTurn = state.turn === 1 ? 2 : 1
      const nextKey = nextTurn === 1 ? 'player1' : 'player2'
      const newTurnCount = state.turnCount + 1
      const next = {...state[nextKey], field: safeLaneCopy(state[nextKey].field)}

      next.maxMana = Math.min((next.maxMana || 0) + 1, 10)
      next.mana = next.maxMana
      next.hasUsedHeroPower = false

      // Atualiza turno atual das cartas
      ;['melee', 'ranged'].forEach(lane => {
        next.field[lane] = next.field[lane].map(c => ({
          ...c,
          canAttack: true,
          currentTurn: newTurnCount
        }))
      })

      // Draw automático
      const drawn = next.deck.slice(0, 1).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
      next.hand = [...next.hand, ...drawn]
      next.deck = next.deck.slice(1)

      // Add log entry for turn change
      let newState = {...state, turn: nextTurn, turnCount: newTurnCount, [nextKey]: next}
      newState = addGameLogEntry(newState, {
        type: 'turn_start',
        player: nextKey,
        turn: newTurnCount
      })

      return newState
    }

    case 'RESTART_GAME': {
      return {
        ...initialState,
        player1: {
          ...initialState.player1,
          deck: shuffle(makeStartingDeck(CARD_OPTIONS.P1, STARTING_DECK_SIZE))
        },
        player2: {
          ...initialState.player2,
          deck: shuffle(makeStartingDeck(CARD_OPTIONS.P2, STARTING_DECK_SIZE))
        }
      }
    }

    case 'SET_AI_PROCESSING': {
      return {...state, isAITurnProcessing: !!action.payload}
    }

    case 'START_TUTORIAL': {
      // Start mandatory step-by-step tutorial mode
      // Tutorial deck with proper mana curve: 15 cards for educational gameplay
      const tutorialDeck = [
        // Early Game (Mana 1-3): 7 cards - Focus on basics and positioning
        'p1_001', // Escudeiro (1) - Taunt demonstration
        'p1_002', // Arqueiro Novato (1) - AoE demonstration
        'p1_003', // Acólito (1) - Healing demonstration
        'p1_004', // Lanceiro (2) - Charge demonstration
        'p1_005', // Besteiro (2) - Lifesteal demonstration
        'p1_006', // Cavaleiro (3) - Strong early game
        'p1_007', // Guardião (3) - Taunt positioning

        // Mid Game (Mana 4-6): 6 cards - Strategic depth
        'p1_010', // Paladino (4) - Immune first turn
        'p1_011', // Caçador (4) - Mid game damage
        'p1_012', // Sacerdote (4) - Mid game healing
        'p1_013', // Capitão (5) - Buff allies
        'p1_014', // Mago de Guerra (5) - Deathrattle
        'p1_016', // Campeão (6) - Mid game beater

        // Late Game (Mana 7+): 2 cards - Finishers (kept low for tutorial pacing)
        'p1_019', // General (7) - Late game tank
        'p1_023'  // Dragão (8) - Late game AoE
      ]
      const tutorialPowers = ['damage']

      const p1Deck = makeOrderedDeck(CARD_OPTIONS.P1, tutorialDeck)

      let p1 = {
        ...state.player1,
        heroPowers: tutorialPowers.map(powerId => {
          const power = HERO_POWER_OPTIONS.P1.find(p => p.id === powerId)
          return {...power}
        }),
        deck: p1Deck,
        passiveSkills: [],
        hand: [],
        mana: 2, // Start with enough mana for tutorial
        maxMana: 2
      }

      // Tutorial AI - create deck with mana curve (low cost cards only)
      const pool = CARD_OPTIONS.P2.filter(card => card.mana <= 3) // Only cards with mana cost 1-3
      const selectedCards = []
      const cardsByMana = {}

      // Group by mana cost
      pool.forEach(card => {
        if (!cardsByMana[card.mana]) {
          cardsByMana[card.mana] = []
        }
        cardsByMana[card.mana].push(card)
      })

      // Select 2 cards per mana cost for tutorial (smaller deck)
      Object.keys(cardsByMana).forEach(manaCost => {
        const cards = cardsByMana[manaCost]
        const selectedCount = Math.min(2, cards.length)
        for (let i = 0; i < selectedCount; i++) {
          selectedCards.push(cards[i].id)
        }
      })

      // Ensure we have at least 6 cards for tutorial
      while (selectedCards.length < 6) {
        const randomCard = pool[Math.floor(Math.random() * pool.length)]
        if (!selectedCards.includes(randomCard.id)) {
          selectedCards.push(randomCard.id)
        }
      }

      const aiDeck = selectedCards.slice(0, 6) // Tutorial deck with mana curve
      const p2Deck = makeOrderedDeck(CARD_OPTIONS.P2, aiDeck)

      let p2 = {
        ...state.player2,
        heroPowers: [{name: 'Tutorial', effect: 'damage', cost: 10, amount: 1}], // High cost to prevent use
        deck: p2Deck,
        passiveSkills: [],
        hand: [],
        hp: 5, // Very weak for tutorial
        mana: 1,
        maxMana: 1
      }

      // Apply passive effects (none for tutorial)
      p1 = applyPassiveEffects(p1, [])
      p2 = applyPassiveEffects(p2, [])

      const draw = (p, n) => {
        const drawn = p.deck.slice(0, n).map(c => ({...c, id: `${c.id}_${Date.now()}_${Math.random()}`}))
        p.hand = [...p.hand, ...drawn]
        p.deck = p.deck.slice(n)
      }

      draw(p1, 1) // Tutorial starts with 1 card
      draw(p2, 1)

      return {
        ...state,
        player1: p1,
        player2: p2,
        gamePhase: 'PLAYING',
        turn: 2, // AI starts first in tutorial
        turnCount: 1,
        tutorialMode: true,
        tutorialStep: 0,
        tutorialHighlights: ['hand', 'battlefield', 'hero', 'mana'],
        tutorialUILock: { enabledElements: ['hand', 'board', 'mana'], disabledElements: [] }
      }
    }

    case 'ADVANCE_TUTORIAL': {
      const newStep = state.tutorialStep + 1
      let highlights = []

      // Define highlights based on tutorial step
      switch (newStep) {
        case 1:
          highlights = ['mana']
          break
        case 2:
          highlights = ['hand']
          break
        case 3:
          highlights = ['board']
          break
        case 4:
          highlights = ['hero-power']
          break
        case 5:
          highlights = ['end-turn']
          break
        default:
          highlights = []
      }

      return {
        ...state,
        tutorialStep: newStep,
        tutorialHighlights: highlights
      }
    }

    case 'SET_TUTORIAL_MESSAGE': {
      const { message, duration = 5000 } = action.payload
      if (state.tutorialMessageTimeout) {
        clearTimeout(state.tutorialMessageTimeout)
      }
      const timeout = setTimeout(() => {
        dispatch({ type: 'CLEAR_TUTORIAL_MESSAGE' })
      }, duration)
      return {
        ...state,
        tutorialMessage: message,
        tutorialMessageTimeout: timeout
      }
    }

    case 'CLEAR_TUTORIAL_MESSAGE': {
      if (state.tutorialMessageTimeout) {
        clearTimeout(state.tutorialMessageTimeout)
      }
      return {
        ...state,
        tutorialMessage: null,
        tutorialMessageTimeout: null
      }
    }

    default:
      return state
  }
}
/* ------------------- PROVIDER COM IA ------------------- */
export function GameProvider({children}){
  const [state, dispatch] = useReducer(reducer, initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  // Handle tutorial message timeout
  useEffect(() => {
    if (state.tutorialMessageTimeout) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_TUTORIAL_MESSAGE' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.tutorialMessageTimeout])

  useEffect(() => {
    if (state.turn !== 2 || state.gamePhase !== 'PLAYING' || state.isAITurnProcessing || state.gameOver || state.isMultiplayer) return

    let cancelled = false
    const delay = ms => new Promise(r => setTimeout(r, ms))

    const runAI = async () => {
      dispatch({type: 'SET_AI_PROCESSING', payload: true})
      await delay(800)
      if (cancelled) return

      let mana = stateRef.current.player2.mana
      const aiPlayer = state.player2

      // Special AI for tutorial mode - play cards but don't attack to avoid interfering with tutorial
      if (state.tutorialMode) {
        // Play tutorial card to provide target for player
        let remainingMana = mana
        const handCopy = [...state.player2.hand]
        while (remainingMana > 0) {
          const currentPlayable = handCopy.filter(c => c.mana <= remainingMana)
            .sort((a, b) => a.mana - b.mana) // Play lowest cost first

          if (currentPlayable.length === 0) break

          const card = currentPlayable[0]
          dispatch({type: 'PLAY_CARD', payload: {cardId: card.id, playerKey: 'player2'}})
          remainingMana -= card.mana
          const index = handCopy.findIndex(c => c.id === card.id)
          handCopy.splice(index, 1)
          await delay(800)
          if (cancelled) return
        }

        // Don't attack during tutorial to prevent interference with tutorial commands
        // Just end turn to let player proceed with tutorial
        dispatch({type: 'END_TURN'})
        return
      }

      // Early Game AI: For turns 1-3, prioritize only cost 1 and 2 cards
      if (state.turnCount <= 3) {
        let remainingMana = mana
        const handCopy = [...state.player2.hand]
        while (remainingMana > 0) {
          const currentPlayable = handCopy.filter(c => {
            let cost = c.mana
            if (aiPlayer.passiveSkills?.some(id => id.includes('cheaper_minions'))) cost -= 1
            cost = Math.max(1, cost)
            // Only consider cards with effective cost of 1 or 2
            return cost <= remainingMana
          }).sort((a, b) => {
            // Sort by mana cost ascending to prioritize low cost (mana curve)
            let aCost = a.mana
            let bCost = b.mana
            if (aiPlayer.passiveSkills?.some(id => id.includes('cheaper_minions'))) {
              aCost = Math.max(1, aCost - 1)
              bCost = Math.max(1, bCost - 1)
            }
            if (aCost === bCost) {
              // If tied, prioritize highest stat value (attack + defense)
              let aStats = (a.attack || 0) + (a.defense || 0)
              let bStats = (b.attack || 0) + (b.defense || 0)
              if (aiPlayer.passiveSkills?.some(id => id.includes('hp_boost'))) {
                aStats += 1
                bStats += 1
              }
              if (aiPlayer.passiveSkills?.some(id => id.includes('atk_boost'))) {
                aStats += 1
                bStats += 1
              }
              if (a.type.lane === 'ranged' && aiPlayer.passiveSkills?.some(id => id.includes('ranged_damage'))) {
                aStats += 3
                bStats += 3
              }
              return bStats - aStats
            }
            return aCost - bCost
          })
          if (currentPlayable.length === 0) break
          const card = currentPlayable[0]
          let cost = card.mana
          if (aiPlayer.passiveSkills?.some(id => id.includes('cheaper_minions'))) cost -= 1
          cost = Math.max(1, cost)
          dispatch({type: 'PLAY_CARD', payload: {cardId: card.id, playerKey: 'player2'}})
          remainingMana -= cost
          const index = handCopy.findIndex(c => c.id === card.id)
          handCopy.splice(index, 1)
          await delay(800)
          if (cancelled) return
        }
      } else {
        // Post-curve: Joga múltiplas cartas até ficar sem mana (Greedy Strategy)
        let remainingMana = mana
        const handCopy = [...state.player2.hand]

        while (remainingMana > 0) {
          
          // 1. Filtra todas as cartas jogáveis com o Mana restante
          const playable = handCopy.filter(c => {
            let cost = c.mana
            if (aiPlayer.passiveSkills?.some(id => id.includes('cheaper_minions'))) cost -= 1
            cost = Math.max(1, cost)
            return cost <= remainingMana
          }).map(card => {
            // 2. Calcula o Score (mesma fórmula anterior)
            let attack = card.attack || 0
            let defense = card.defense || 0
            if (aiPlayer.passiveSkills?.some(id => id.includes('hp_boost'))) defense += 1
            if (aiPlayer.passiveSkills?.some(id => id.includes('atk_boost'))) attack += 1
            if (card.type.lane === 'ranged' && aiPlayer.passiveSkills?.some(id => id.includes('ranged_damage'))) attack += 1

            let cost = card.mana
            if (aiPlayer.passiveSkills?.some(id => id.includes('cheaper_minions'))) cost -= 1
            cost = Math.max(1, cost)

            let score = 0
            score = ((attack + defense) / cost) + ((card.effects?.length || 0) * 3) + (card.type.name === 'Clérigo' ? 2 : 0)
            const tempoFactor = (remainingMana / cost) * 0.5
            score = score + tempoFactor
            return {...card, aiScore: score, effectiveCost: cost}
          }).sort((a,b) => b.aiScore - a.aiScore) // 3. Ordena pelo maior score

          // 4. Se não houver mais cartas jogáveis, encerra o loop
          if (playable.length === 0) break

          // 5. Joga a carta de melhor score
          const card = playable[0]
          
          dispatch({type: 'PLAY_CARD', payload: {cardId: card.id, playerKey: 'player2'}})
          remainingMana -= card.effectiveCost

          // Remove a carta da mão para a próxima iteração
          const index = handCopy.findIndex(c => c.id === card.id)
          handCopy.splice(index, 1)

          await delay(800)
          if (cancelled) return
        }
      } // FIM DA SEÇÃO ELSE (Mid/Late Game)

      // Use hero power if beneficial
      const currentState = stateRef.current
      const heroPowers = currentState.player2.heroPowers || []
      let bestPower = null
      let bestPowerScore = -1
      heroPowers.forEach(power => {
        if (currentState.player2.mana >= power.cost && !currentState.player2.hasUsedHeroPower) {
          let score = 0
          score += (4 - power.cost) // Mana efficiency factor
          const opponent = currentState.player1
          const aiField = currentState.player2
          const hasEnemyMinions = [...opponent.field.melee, ...opponent.field.ranged].length > 0
          const hasAiMinions = [...aiField.field.melee, ...aiField.field.ranged].length > 0
          const oppHp = opponent.hp
          const aiHp = currentState.player2.hp
          const turnCount = currentState.turnCount

          switch (power.effect) {
            case 'damage':
              if (hasEnemyMinions) {
                // Target minions first if they exist
                score += 3
              } else if (oppHp <= power.amount) {
                score += 10 // Finishing blow
              } else {
                score += Math.max(0, 8 - oppHp / 10) // Less useful against high HP heroes
              }
              break
            case 'heal_target':
              if (aiHp < 15) score += 8
              else if (aiHp < 25) score += 6
              else if (hasAiMinions) score += 4 // Heal units instead
              else score += 2
              break
            case 'armor':
              if (aiHp < 20 && hasEnemyMinions) score += 7
              else if (aiHp < 15) score += 5
              else score += 2
              break
            case 'draw':
              if (currentState.player2.deck.length >= 3) score += 5
              else if (turnCount > 6) score += 3
              else score += 1
              break
            case 'charge_melee':
              if (hasEnemyMinions && turnCount > 2) score += 6
              else if (hasAiMinions) score += 4
              else score += 1
              break
            case 'buff_all':
              if (hasAiMinions) score += 5
              else score += 2
              break
            case 'damage_all_enemies':
              if (hasEnemyMinions) {
                const enemyMinionCount = [...opponent.field.melee, ...opponent.field.ranged].length
                score += Math.min(8, enemyMinionCount * 2) // More valuable against many minions
              }
              break
            case 'heal':
              if (aiHp < 20) score += 6
              else if (aiHp < 30) score += 4
              else score += 2
              break
            case 'mana_boost':
              if (turnCount > 7) score += power.amount * 2 // More valuable late game
              else score += power.amount
              break
            default:
              score += 1
          }

          if (score > bestPowerScore) {
            bestPowerScore = score
            bestPower = power
          }
        }
      })

      if (bestPower && bestPowerScore > 0) {
        dispatch({type: 'HERO_POWER_CLICK', payload: {player: 'player2', powerId: bestPower.id}})
        // For targeting powers, pick best target
        if (bestPower.requiresTarget) {
          await delay(200)
          const postPowerState = stateRef.current
          let targetId = null
          let targetIsHero = false

          if (bestPower.effect === 'damage') {
            // Target weakest minion or hero if low HP
            const minions = [...postPowerState.player1.field.melee, ...postPowerState.player1.field.ranged].sort((a,b) => a.defense - b.defense)
            if (minions.length > 0) targetId = minions[0].id
            else targetIsHero = true
          } else if (bestPower.effect === 'heal_target') {
            // Prefer to heal units over hero
            const units = [...postPowerState.player2.field.melee, ...postPowerState.player2.field.ranged].sort((a,b) => a.defense - b.defense)
            if (units.length > 0) {
              targetId = units[0].id
            } else {
              targetIsHero = true
            }
          }

          if (targetId || targetIsHero) {
            dispatch({type: 'APPLY_HERO_POWER_WITH_TARGET', payload: {playerKey: 'player2', power: bestPower, targetCardId: targetId, targetIsHero}})
          }
        }
        await delay(800)
        if (cancelled) return
      }

      // AI Combat Phase - Smart targeting
      const attackerUnits = [...stateRef.current.player2.field.melee, ...stateRef.current.player2.field.ranged].filter(c => c.canAttack)
      const opponent = stateRef.current.player1
      const aiField = stateRef.current.player2.field

      for (const attacker of attackerUnits) {
        if (cancelled) return

        const isCleric = attacker.type.name === 'Clérigo'
        let possibleTargets = []
        let damage = attacker.attack

        if (isCleric) {
          // For clerics, targets are own minions to heal, sorted by lowest HP first
          possibleTargets = [...aiField.melee, ...aiField.ranged].sort((a, b) => a.defense - b.defense)
        } else {
          // For attackers, targets are enemies
          const allEnemyMinions = [...opponent.field.melee, ...opponent.field.ranged]

          // Check for taunts first
          const taunts = allEnemyMinions.filter(m => m.effects?.some(e => e.effect === 'TAUNT'))
          if (taunts.length > 0) {
            possibleTargets = taunts
          } else {
            if (attacker.type.lane === 'ranged') {
              possibleTargets = allEnemyMinions
            } else if (attacker.type.lane === 'melee') {
              if (opponent.field.melee.length > 0) {
                possibleTargets = opponent.field.melee
              } else {
                possibleTargets = allEnemyMinions
              }
            }
          }

          // Sort by priority: lethal, low defense
          possibleTargets.sort((a, b) => {
            const lethalA = attacker.attack >= a.defense ? 1 : 0
            const lethalB = attacker.attack >= b.defense ? 1 : 0
            if (lethalA !== lethalB) return lethalB - lethalA
            return a.defense - b.defense
          })
        }

        let targetId = null
        let targetIsHero = false

        if (possibleTargets.length > 0) {
          targetId = possibleTargets[0].id
        } else {
          // No minions, attack/heal hero
          targetIsHero = true
        }

        dispatch({
          type: 'APPLY_ATTACK_DAMAGE',
          payload: { attackerId: attacker.id, targetId, targetIsHero, damage, playerKey: 'player2' }
        })

        await delay(500)
      }

      if (cancelled) return
      dispatch({type: 'END_TURN'})
    }

    runAI()

    return () => {
      cancelled = true
    }
  }, [state.turn, state.gamePhase, state.gameOver])

  // Reset AI processing when AI turn ends and turn changes
  useEffect(() => {
    if (state.turn === 1 && state.isAITurnProcessing) {
      dispatch({type: 'SET_AI_PROCESSING', payload: false})
    }
  }, [state.turn, state.isAITurnProcessing])

  // Handle tutorial advancement
  useEffect(() => {
    if (state.tutorialMode && state.turn === 2 && state.tutorialStep === 3) {
      setTimeout(() => {
        dispatch({ type: 'ADVANCE_TUTORIAL' })
      }, 500)
    }
  }, [state.tutorialMode, state.turn, state.tutorialStep])

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}
