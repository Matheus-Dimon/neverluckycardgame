import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function ImmersiveTutorial({ isOpen, onClose, onAdvanceTutorial, tutorialStep, tutorialHighlights, tutorialMessage }) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [showArrow, setShowArrow] = useState(true)

  const tutorialSteps = [
    {
      id: 'welcome',
      title: t('tutorial.immersive_tutorial.welcome.title') || "Welcome to NeverLucky!",
      message: t('tutorial.immersive_tutorial.welcome.message') || "This is a card game where you'll build your army and battle against your opponent. Your goal is to reduce their hero's HP to zero. Let's learn how to play!",
      highlight: null,
      position: 'center',
      arrow: null,
      duration: 5000
    },
    {
      id: 'interface_overview',
      title: t('tutorial.immersive_tutorial.interface.title') || "Let's explore the interface",
      message: t('tutorial.immersive_tutorial.interface.message') || "See the key areas of the game board. An arrow will point to each important element.",
      highlight: 'hand',
      position: 'top-right',
      arrow: { target: 'hand', direction: 'down' },
      duration: 4000
    },
    {
      id: 'hand_explanation',
      title: t('tutorial.immersive_tutorial.hand.title') || "Your Hand",
      message: t('tutorial.immersive_tutorial.hand.message') || "These are the cards in your hand. Each card shows its cost, attack, and defense. Click on a card to play it!",
      highlight: 'hand',
      position: 'top-right',
      arrow: { target: 'hand', direction: 'down' },
      duration: 5000
    },
    {
      id: 'mana_explanation',
      title: t('tutorial.immersive_tutorial.mana.title') || "Mana Crystals",
      message: t('tutorial.immersive_tutorial.mana.message') || "These glowing crystals show your mana. You need mana to play cards. You get 1 more each turn, up to 10!",
      highlight: 'mana',
      position: 'top-left',
      arrow: { target: 'mana', direction: 'down' },
      duration: 5000
    },
    {
      id: 'board_explanation',
      title: t('tutorial.immersive_tutorial.board.title') || "The Battlefield",
      message: t('tutorial.immersive_tutorial.board.message') || "Units are placed in two lanes: Melee (close combat) and Ranged (long distance). Melee units can attack the enemy hero if no enemy melee units block them.",
      highlight: 'battlefield',
      position: 'center',
      arrow: { target: 'battlefield', direction: 'up' },
      duration: 6000
    },
    {
      id: 'hero_explanation',
      title: t('tutorial.immersive_tutorial.hero.title') || "Your Hero",
      message: t('tutorial.immersive_tutorial.hero.message') || "This is your hero! If their HP reaches zero, you lose the game. Protect them with your units!",
      highlight: 'hero',
      position: 'bottom-left',
      arrow: { target: 'hero', direction: 'up' },
      duration: 5000
    },
    {
      id: 'first_action_draw',
      title: t('tutorial.immersive_tutorial.first_action.title') || "Your First Action: Drawing Cards",
      message: t('tutorial.immersive_tutorial.first_action.message') || "At the start of each turn, you'll draw a card from your deck. This gives you more options to play!",
      highlight: 'deck',
      position: 'top-right',
      arrow: { target: 'deck', direction: 'left' },
      duration: 4000
    },
    {
      id: 'play_card_guide',
      title: t('tutorial.immersive_tutorial.play_card.title') || "Playing Your First Card",
      message: t('tutorial.immersive_tutorial.play_card.message') || "Click on a card in your hand that costs less than or equal to your current mana. Watch it appear on the battlefield!",
      highlight: 'hand',
      position: 'top-right',
      arrow: { target: 'hand', direction: 'down' },
      duration: 5000
    },
    {
      id: 'card_costs_effects',
      title: t('tutorial.immersive_tutorial.card_costs.title') || "Understanding Card Costs and Effects",
      message: t('tutorial.immersive_tutorial.card_costs.message') || "Each card costs mana to play. Some cards have special effects when played, like dealing damage or healing allies.",
      highlight: 'card-tooltip',
      position: 'top-center',
      arrow: { target: 'card-tooltip', direction: 'up' },
      duration: 5000
    },
    {
      id: 'combat_interaction',
      title: t('tutorial.immersive_tutorial.combat.title') || "Basic Combat",
      message: t('tutorial.immersive_tutorial.combat.message') || "Click on one of your units to select it, then click on an enemy unit or hero to attack. Your unit deals damage and might take damage back!",
      highlight: 'unit',
      position: 'center',
      arrow: { target: 'unit', direction: 'up' },
      duration: 6000
    },
    {
      id: 'turn_flow',
      title: t('tutorial.immersive_tutorial.turn_flow.title') || "Turn Flow",
      message: t('tutorial.immersive_tutorial.turn_flow.message') || "Each turn: Draw a card, gain mana, play cards, use hero powers, attack with units, then click 'End Turn'. The game flows back and forth!",
      highlight: 'end-turn',
      position: 'bottom-center',
      arrow: { target: 'end-turn', direction: 'up' },
      duration: 6000
    },
    {
      id: 'positive_feedback',
      title: t('tutorial.immersive_tutorial.feedback.title') || "Great Job!",
      message: t('tutorial.immersive_tutorial.feedback.message') || "You're doing fantastic! You've learned the basics of NeverLucky. Keep practicing and you'll master the game in no time!",
      highlight: null,
      position: 'center',
      arrow: null,
      duration: 5000
    },
    {
      id: 'next_steps',
      title: t('tutorial.immersive_tutorial.next_steps.title') || "Ready for More?",
      message: t('tutorial.immersive_tutorial.next_steps.message') || "Now you know how to play! Try a full game against the AI, or challenge a friend. Remember: strategy, timing, and unit placement are key to victory!",
      highlight: null,
      position: 'center',
      arrow: null,
      duration: 5000
    }
  ]

  useEffect(() => {
    if (tutorialStep !== undefined) {
      setCurrentStep(tutorialStep)
    }
  }, [tutorialStep])

  useEffect(() => {
    if (!isOpen) return

    const step = tutorialSteps[currentStep]
    if (step && step.duration) {
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

  if (!isOpen || currentStep >= tutorialSteps.length) return null

  const step = tutorialSteps[currentStep]

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

    // Position arrows based on target
    switch (arrow.target) {
      case 'hand':
        return { ...baseStyle, bottom: '30%', left: '50%', transform: 'translateX(-50%)' }
      case 'mana':
        return { ...baseStyle, top: '15%', right: '15%' }
      case 'battlefield':
        return { ...baseStyle, top: '45%', left: '50%', transform: 'translateX(-50%)' }
      case 'hero':
        return { ...baseStyle, bottom: '30%', left: '15%' }
      case 'deck':
        return { ...baseStyle, top: '20%', right: '10%' }
      case 'card-tooltip':
        return { ...baseStyle, top: '25%', left: '50%', transform: 'translateX(-50%)' }
      case 'unit':
        return { ...baseStyle, top: '40%', left: '50%', transform: 'translateX(-50%)' }
      case 'end-turn':
        return { ...baseStyle, bottom: '20%', left: '50%', transform: 'translateX(-50%)' }
      default:
        return baseStyle
    }
  }

  const getHighlightStyle = (highlight) => {
    if (!highlight || !tutorialHighlights.includes(highlight)) return {}

    // Add glowing outline to highlighted elements
    return {
      boxShadow: '0 0 20px #f5c06b, 0 0 40px #f5c06b',
      border: '2px solid #f5c06b',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    }
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
      case 'center':
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }
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
        background: 'rgba(0,0,0,0.6)',
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

      {/* Skip Button */}
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

        /* Highlight styles for game elements */
        .tutorial-highlight-hand {
          box-shadow: 0 0 20px #f5c06b !important;
          border: 2px solid #f5c06b !important;
        }

        .tutorial-highlight-mana {
          box-shadow: 0 0 20px #f5c06b !important;
          border: 2px solid #f5c06b !important;
        }

        .tutorial-highlight-battlefield {
          box-shadow: 0 0 20px #f5c06b !important;
          border: 2px solid #f5c06b !important;
        }

        .tutorial-highlight-hero {
          box-shadow: 0 0 20px #f5c06b !important;
          border: 2px solid #f5c06b !important;
        }

        .tutorial-highlight-deck {
          box-shadow: 0 0 20px #f5c06b !important;
          border: 2px solid #f5c06b !important;
        }

        .tutorial-highlight-unit {
          box-shadow: 0 0 20px #f5c06b !important;
          border: 2px solid #f5c06b !important;
        }
      `}</style>
    </>
  )
}
