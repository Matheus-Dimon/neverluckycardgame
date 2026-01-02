import React, { useState, useEffect, useContext } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { GameContext } from '../context/GameContext.jsx'

export default function ImmersiveTutorial({ isOpen, onClose, onAdvanceTutorial, tutorialStep, tutorialHighlights, tutorialMessage }) {
  const { t } = useLanguage()
  const { state, dispatch } = useContext(GameContext)
  const [currentStep, setCurrentStep] = useState(0)
  const [showArrow, setShowArrow] = useState(true)

  // Mandatory step-by-step tutorial in exact required order
  // Each step defines element targeting for arrows and highlights using data attributes and CSS selectors
  const tutorialSteps = [
    {
      // Step 0: Interface Overview - Highlights all major UI areas with continue button
      // Targets: .hand (CSS class), .lanes-vertical (CSS class), [data-hero="player1"] (data attribute), [data-hero="player1"] for mana
      id: 'interface_overview',
      title: "Understanding the Interface",
      message: "Welcome to NeverLucky! Let's explore the game interface. These are the key areas you'll use: your hand, the battlefield, your hero, and resource counters.",
      highlight: ['hand', 'battlefield', 'hero', 'mana'],
      position: 'center',
      arrow: null,
      requiresAction: true,
      canSkip: false,
      duration: 0,
      uiLock: { enabledElements: [], disabledElements: ['all'] }
    },
    {
      // Step 1: Playing a Card - Combined card selection and placement
      // Targets specific card in hand and battlefield lanes
      // Arrow points to first card in player's hand during tutorial
      id: 'play_card',
      title: "Playing a Card",
      message: "Select a card from your hand and place it on the battlefield. Click on the card to select it, then drag it to a valid placement zone on the battlefield.",
      highlight: ['tutorial-card-0', 'battlefield-placement'],
      position: 'center',
      arrow: { target: 'tutorial-card-0', direction: 'down' },
      requiresAction: true,
      canSkip: false,
      duration: 0,
      uiLock: { enabledElements: ['tutorial-card-0', 'battlefield-placement'], disabledElements: ['hero', 'end-turn', 'other-cards'] }
    },
    {
      // Step 3: Target Selection - Targets enemy units for attack targeting
      // Target: [data-card-id][data-player="player2"] (enemy cards with data attributes)
      // Arrow points to enemy units that appear on the battlefield
      id: 'target_selection',
      title: "Target Selection",
      message: "Click on the enemy unit that appears. A target is any enemy card or enemy player you want to affect.",
      highlight: ['enemy-target'],
      position: 'center',
      arrow: { target: 'enemy-target', direction: 'up' },
      requiresAction: true,
      canSkip: false,
      duration: 0,
      uiLock: { enabledElements: ['enemy-target'], disabledElements: ['hand', 'hero', 'end-turn', 'own-units'] }
    },
    {
      // Step 4: Turn Flow - Targets end turn button to complete tutorial
      // Target: [data-tutorial="end-turn"] (data attribute on end turn button)
      // Arrow points to end turn button to complete the turn sequence
      id: 'turn_flow',
      title: "Turn Flow",
      message: "Click 'End Turn' to complete your turn. Each turn follows this order: draw cards, gain mana, play cards, attack, then end turn.",
      highlight: ['end-turn'],
      position: 'center',
      arrow: { target: 'end-turn', direction: 'up' },
      requiresAction: true,
      canSkip: false,
      duration: 0,
      uiLock: { enabledElements: ['end-turn'], disabledElements: ['hand', 'battlefield', 'hero'] }
    },
    {
      // Step 5: Attacking - Targets player's own units for attack selection
      // Target: [data-card-id]:not([data-player="player2"]) (player's cards excluding enemy cards)
      // Arrow points to player's units that can be selected to attack
      id: 'reinforcement_attack',
      title: "Attacking",
      message: "Click on the card in the battlefield and select the target to attack.",
      highlight: ['own-unit-attack', 'enemy-target'],
      position: 'center',
      arrow: { target: 'own-unit-attack', direction: 'up' },
      requiresAction: true,
      canSkip: false,
      duration: 0,
      uiLock: { enabledElements: ['own-unit-attack', 'enemy-target'], disabledElements: ['hand', 'hero', 'end-turn'] }
    },
    {
      // Step 6: Tutorial Complete - Wait for opponent defeat
      // No targets - summary and conclusion of tutorial
      id: 'tutorial_complete',
      title: "Tutorial Complete",
      message: "Perfect! You've completed all the basic actions. Now defeat your opponent to finish the tutorial!",
      highlight: [],
      position: 'center',
      arrow: null,
      requiresAction: true,
      canSkip: false,
      duration: 0,
      uiLock: { enabledElements: [], disabledElements: ['all'] }
    }
  ]

  // Function to validate if required elements exist for current tutorial step
  const validateTutorialElements = (step) => {
    if (!step || !step.highlight || step.highlight.length === 0) return true

    // Check if at least one required element exists for each highlight target
    return step.highlight.every(highlight => {
      let selector = ''

      switch (highlight) {
        case 'hand':
          selector = '.hand'
          break
        case 'battlefield':
          selector = '.lanes-vertical'
          break
        case 'hero':
          selector = '[data-hero="player1"]'
          break
        case 'mana':
          selector = '[data-hero="player1"]'
          break
        case 'tutorial-card-0':
          selector = '[data-card-id="tutorial-card-0"]'
          break
        case 'battlefield-placement':
          selector = '.lanes-vertical'
          break
        case 'enemy-target':
          selector = '[data-card-id][data-player="player2"]'
          break
        case 'own-unit-attack':
          selector = '[data-card-id]:not([data-player="player2"])'
          break
        case 'end-turn':
          selector = '.controls .btn'
          break
        default:
          return true // Skip validation for unknown targets
      }

      const element = document.querySelector(selector)
      return element !== null
    })
  }

  // Function to apply highlight styles to elements based on tutorial step
  const applyHighlightStyles = () => {
    if (!tutorialHighlights || tutorialHighlights.length === 0) return

    // Remove previous highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
      el.classList.remove('tutorial-highlight')
    })

    tutorialHighlights.forEach(highlight => {
      let selector = ''

      switch (highlight) {
        case 'hand':
          selector = '.hand'
          break
        case 'battlefield':
          selector = '.lanes-vertical'
          break
        case 'hero':
          selector = '[data-hero="player1"]'
          break
        case 'mana':
          // Mana is part of hero, highlight the hero
          selector = '[data-hero="player1"]'
          break
        case 'tutorial-card-0':
          // Specific card in hand during tutorial
          selector = '[data-card-id="tutorial-card-0"]'
          break
        case 'battlefield-placement':
          // Battlefield lanes for placement
          selector = '.lanes-vertical'
          break
        case 'enemy-target':
          // Enemy units
          selector = '[data-card-id][data-player="player2"]'
          break
        case 'own-unit-attack':
          // Player's units
          selector = '[data-card-id]:not([data-player="player2"])'
          break
        case 'end-turn':
          // End turn button
          selector = '[data-tutorial="end-turn"]'
          break
        default:
          return
      }

      const element = document.querySelector(selector)
      if (element) {
        element.classList.add('tutorial-highlight')
      }
    })
  }

  const getMessagePosition = (position) => {
    switch (position) {
      case 'top-left':
        return { top: '10%', left: '10%' }
      case 'top-right':
        return { top: '10%', right: '10%' }
      case 'top-center':
        return { top: '10%', left: '50%', transform: 'translateX(-50%)' }
      case 'bottom-left':
        return { bottom: '10%', left: '10%' }
      case 'bottom-center':
        return { bottom: '10%', left: '50%', transform: 'translateX(-50%)' }
      case 'bottom-right':
        return { bottom: '10%', right: '10%' }
      case 'center':
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }
  }

  useEffect(() => {
    if (tutorialStep !== undefined) {
      const step = tutorialSteps[tutorialStep]

      // Validate elements exist before setting step
      if (step && validateTutorialElements(step)) {
        setCurrentStep(tutorialStep)
      } else {
        console.warn(`Tutorial step ${tutorialStep} skipped: required elements not found`)
        // Try to advance to next valid step
        if (tutorialStep < tutorialSteps.length - 1) {
          const nextStep = tutorialStep + 1
          const nextStepData = tutorialSteps[nextStep]
          if (nextStepData && validateTutorialElements(nextStepData)) {
            setCurrentStep(nextStep)
            onAdvanceTutorial && onAdvanceTutorial(nextStep)
          }
        }
      }
    }
  }, [tutorialStep, tutorialSteps, onAdvanceTutorial])

  useEffect(() => {
    if (!isOpen) return

    const step = tutorialSteps[currentStep]

    // Only auto-advance for certain steps that don't require player action
    const autoAdvanceSteps = ['welcome', 'interface_overview', 'hand_explanation', 'mana_explanation', 'board_explanation', 'hero_explanation', 'attack_execution', 'turn_flow', 'positive_feedback']

    if (step && step.duration && autoAdvanceSteps.includes(step.id)) {
      const timer = setTimeout(() => {
        if (currentStep < tutorialSteps.length - 1) {
          const nextStep = currentStep + 1
          setCurrentStep(nextStep)
          onAdvanceTutorial && onAdvanceTutorial(nextStep)
        } else {
          onClose && onClose()
        }
      }, step.duration)

      return () => clearTimeout(timer)
    }
  }, [currentStep, isOpen, tutorialSteps, onAdvanceTutorial, onClose])

  useEffect(() => {
    // Animate arrow appearance
    setShowArrow(false)
    const timer = setTimeout(() => setShowArrow(true), 500)
    return () => clearTimeout(timer)
  }, [currentStep])

  // Apply highlights when tutorial highlights change
  useEffect(() => {
    applyHighlightStyles()
  }, [tutorialHighlights, currentStep])

  if (!isOpen || currentStep >= tutorialSteps.length) return null

  const step = tutorialSteps[currentStep]

  // Special handling for tutorial_complete step - only show when opponent is defeated
  if (step.id === 'tutorial_complete' && state.player2.hp > 0) return null

  const getArrowStyle = (arrow) => {
    if (!arrow || !showArrow) return {}

    const baseStyle = {
      position: 'absolute',
      color: '#f5c06b',
      fontSize: '48px',
      zIndex: 10001,
      animation: 'bounce 1.5s infinite',
      pointerEvents: 'none'
    }

    // Dynamic positioning based on actual element positions with validation
    const getElementPosition = (selector) => {
      const element = document.querySelector(selector)
      if (element) {
        const rect = element.getBoundingClientRect()
        return {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          element: element // Keep reference for validation
        }
      }
      return null
    }

    let position = {}

    switch (arrow.target) {
      // Tutorial-specific targets with proper data attributes
      case 'tutorial-card-0': {
        // Target first card in hand during card selection tutorial step
        const cardPos = getElementPosition('[data-card-id="tutorial-card-0"]')
        if (cardPos) {
          position = {
            top: cardPos.top - 60,
            left: cardPos.centerX - 24,
            transform: 'translateX(0)'
          }
        } else {
          position = { bottom: '30%', left: '20%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'battlefield-placement': {
        // Target valid battlefield placement zones (melee and ranged lanes)
        const battlefieldPos = getElementPosition('.lanes-vertical')
        if (battlefieldPos) {
          position = {
            top: battlefieldPos.centerY - 24,
            left: battlefieldPos.centerX - 24
          }
        } else {
          position = { top: '45%', left: '50%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'enemy-target': {
        // Target enemy units that appear during tutorial
        const enemyUnitPos = getElementPosition('[data-card-id][data-player="player2"]')
        if (enemyUnitPos) {
          position = {
            top: enemyUnitPos.top - 60,
            left: enemyUnitPos.centerX - 24
          }
        } else {
          position = { top: '25%', left: '70%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'own-unit-attack': {
        // Target player's units for attacking tutorial
        const playerUnitPos = getElementPosition('[data-card-id]:not([data-player="player2"])')
        if (playerUnitPos) {
          position = {
            top: playerUnitPos.top - 60,
            left: playerUnitPos.centerX - 24
          }
        } else {
          position = { top: '55%', left: '30%', transform: 'translateX(-50%)' }
        }
        break
      }

      // General UI element targets
      case 'hand': {
        const handPos = getElementPosition('.hand')
        if (handPos) {
          position = {
            top: handPos.top - 60,
            left: handPos.centerX - 24,
            transform: 'translateX(0)'
          }
        } else {
          position = { bottom: '30%', left: '50%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'mana': {
        const heroPos = getElementPosition('[data-hero="player1"]')
        if (heroPos) {
          position = {
            top: heroPos.top - 10,
            left: heroPos.left + heroPos.width + 10
          }
        } else {
          position = { top: '15%', right: '15%' }
        }
        break
      }
      case 'battlefield': {
        const battlefieldPos = getElementPosition('.lanes-vertical')
        if (battlefieldPos) {
          position = {
            top: battlefieldPos.centerY - 24,
            left: battlefieldPos.centerX - 24
          }
        } else {
          position = { top: '45%', left: '50%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'hero': {
        const heroPos = getElementPosition('[data-hero="player1"]')
        if (heroPos) {
          position = {
            top: heroPos.top - 60,
            left: heroPos.centerX - 24
          }
        } else {
          position = { bottom: '30%', left: '15%' }
        }
        break
      }
      case 'deck': {
        const deckPos = getElementPosition('.deck-area') || getElementPosition('[data-deck]')
        if (deckPos) {
          position = {
            top: deckPos.top - 60,
            left: deckPos.centerX - 24
          }
        } else {
          position = { top: '20%', right: '10%' }
        }
        break
      }
      case 'card-tooltip': {
        position = { top: '25%', left: '50%', transform: 'translateX(-50%)' }
        break
      }
      case 'unit': {
        // Find first unit on player's field
        const unitPos = getElementPosition('[data-card-id]:not([data-player="player2"])')
        if (unitPos) {
          position = {
            top: unitPos.top - 60,
            left: unitPos.centerX - 24
          }
        } else {
          position = { top: '40%', left: '50%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'enemy-unit': {
        // Find first enemy unit
        const unitPos = getElementPosition('[data-card-id][data-player="player2"]')
        if (unitPos) {
          position = {
            top: unitPos.top - 60,
            left: unitPos.centerX - 24
          }
        } else {
          position = { top: '40%', left: '50%', transform: 'translateX(-50%)' }
        }
        break
      }
      case 'end-turn': {
        const buttonPos = getElementPosition('.controls .btn')
        if (buttonPos) {
          position = {
            top: buttonPos.top - 60,
            left: buttonPos.centerX - 24
          }
        } else {
          position = { bottom: '20%', left: '50%', transform: 'translateX(-50%)' }
        }
        break
      }
      default:
        position = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }

    return { ...baseStyle, ...position }
  }



  return (
    <>
      {/* Tutorial Message Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          borderRadius: '20px',
          padding: '25px',
          maxWidth: '500px',
          width: '90%',
          border: '3px solid #f5c06b',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
          ...getMessagePosition(step.position),
          position: 'absolute'
        }}>
          <h2 style={{
            color: '#f5c06b',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '22px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            {step.title}
          </h2>

          <p style={{
            color: '#e2e8f0',
            lineHeight: '1.6',
            margin: 0,
            fontSize: '16px',
            textAlign: 'center'
          }}>
            {step.message}
          </p>

          {/* Continue Button - Only show for interface overview step */}
          {step.id === 'interface_overview' && (
            <button
              onClick={() => {
                if (currentStep < tutorialSteps.length - 1) {
                  const nextStep = currentStep + 1
                  setCurrentStep(nextStep)
                  onAdvanceTutorial && onAdvanceTutorial(nextStep)
                }
              }}
              style={{
                marginTop: '20px',
                background: '#f5c06b',
                color: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              Continuar
            </button>
          )}

          {/* Finish Tutorial Button - Only show when opponent is defeated */}
          {step.id === 'tutorial_complete' && state.player2.hp <= 0 && (
            <button
              onClick={() => {
                // Dispatch action to go to login page
                dispatch({ type: 'GO_TO_LOGIN' })
                onClose && onClose()
              }}
              style={{
                marginTop: '20px',
                background: '#f5c06b',
                color: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              Voltar para Menu
            </button>
          )}

          {/* Progress indicator */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px'
          }}>
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentStep ? '#f5c06b' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Animated Arrow */}
        {step.arrow && (
          <div style={getArrowStyle(step.arrow)}>
            ⬇️
          </div>
        )}
      </div>

      {/* Skip Button - Only show for steps that allow skipping */}
      {step.canSkip && (
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.8)',
            color: '#94a3b8',
            border: '2px solid #94a3b8',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 10001,
            pointerEvents: 'auto'
          }}
        >
          {t('tutorial.skip') || 'Skip Tutorial'}
        </button>
      )}

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        /* Dynamic highlight styles for tutorial elements */
        .tutorial-highlight {
          box-shadow: 0 0 20px #f5c06b, 0 0 40px #f5c06b !important;
          border: 2px solid #f5c06b !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
          position: relative !important;
          z-index: 9999 !important;
        }

        /* Special handling for cards to ensure proper highlighting */
        [data-card-id].tutorial-highlight {
          box-shadow: 0 0 20px #f5c06b, 0 0 40px #f5c06b, inset 0 0 10px rgba(245, 192, 107, 0.3) !important;
        }

        /* Special handling for hero highlighting */
        [data-hero].tutorial-highlight {
          box-shadow: 0 0 25px #f5c06b, 0 0 50px #f5c06b !important;
        }

        /* Special handling for battlefield lanes */
        .lanes-vertical.tutorial-highlight {
          box-shadow: inset 0 0 30px rgba(245, 192, 107, 0.4), 0 0 20px #f5c06b !important;
        }

        /* Special handling for hand */
        .hand.tutorial-highlight {
          box-shadow: 0 0 25px #f5c06b !important;
        }
      `}</style>
    </>
  )
}
