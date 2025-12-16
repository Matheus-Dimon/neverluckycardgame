import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function InteractiveTutorial({ isOpen, onClose, currentStep, onNextStep }) {
  const { t } = useLanguage()
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)

  const tutorialSteps = [
    {
      title: t('tutorial.welcome.title') || "Welcome to NeverLucky!",
      content: t('tutorial.welcome.content') || "This tutorial will teach you the basics of the game. Let's get started!",
      highlight: null
    },
    {
      title: t('tutorial.objective.title') || "Game Objective",
      content: t('tutorial.objective.content') || "The goal is to reduce your opponent's hero HP to 0. You win by attacking their hero or using special abilities.",
      highlight: "hero"
    },
    {
      title: t('tutorial.board.title') || "The Battlefield",
      content: t('tutorial.board.content') || "Units are placed in two lanes: Melee (close combat) and Ranged (distance attacks). Melee units can attack the enemy hero if no enemy melee units are present.",
      highlight: "battlefield"
    },
    {
      title: t('tutorial.units.title') || "Unit Types",
      content: t('tutorial.units.content') || "There are three unit types: Warriors (melee), Archers (ranged), and Clerics (healers). Each has unique abilities and playstyles.",
      highlight: "hand"
    },
    {
      title: t('tutorial.mana.title') || "Mana System",
      content: t('tutorial.mana.content') || "You gain 1 mana crystal each turn (maximum 10). Use mana to play cards and activate hero powers. Your mana refreshes each turn!",
      highlight: "mana"
    },
    {
      title: t('tutorial.heroPowers.title') || "Hero Powers",
      content: t('tutorial.heroPowers.content') || "Each hero has unique powers you can use once per turn. They cost mana and can deal damage, heal, or provide special effects.",
      highlight: "hero-power"
    },
    {
      title: t('tutorial.cardEffects.title') || "Card Effects",
      content: t('tutorial.cardEffects.content') || "Cards have special effects like Charge (attack immediately), Taunt (must be attacked first), or Battlecry (effect when played).",
      highlight: "card-effects"
    },
    {
      title: t('tutorial.turns.title') || "Turn Structure",
      content: t('tutorial.turns.content') || "Each turn: Draw a card, play cards, use hero power, attack with units, then end turn. Plan your moves strategically!",
      highlight: "controls"
    },
    {
      title: t('tutorial.strategy.title') || "Basic Strategy",
      content: t('tutorial.strategy.content') || "Control the board with melee units, use ranged for safe damage, heal with clerics, and time your hero powers wisely.",
      highlight: null
    }
  ]

  const nextStep = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(currentTutorialStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(currentTutorialStep - 1)
    }
  }

  const goToStep = (step) => {
    setCurrentTutorialStep(step)
  }

  useEffect(() => {
    if (currentStep !== undefined) {
      setCurrentTutorialStep(currentStep)
    }
  }, [currentStep])

  if (!isOpen) return null

  const step = tutorialSteps[currentTutorialStep]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      fontFamily: "'MedievalSharp', cursive"
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        border: '3px solid #f5c06b',
        boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
      }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentTutorialStep + 1) / tutorialSteps.length) * 100}%`,
              height: '100%',
              background: '#f5c06b',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', color: '#94a3b8', fontSize: '14px' }}>
            {currentTutorialStep + 1} / {tutorialSteps.length}
          </div>
        </div>

        {/* Step Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentTutorialStep ? '#f5c06b' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <h2 style={{
          color: '#f5c06b',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          {step.title}
        </h2>

        <p style={{
          color: '#e2e8f0',
          lineHeight: '1.6',
          marginBottom: '30px',
          fontSize: '16px',
          textAlign: 'center'
        }}>
          {step.content}
        </p>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={prevStep}
            disabled={currentTutorialStep === 0}
            style={{
              padding: '10px 20px',
              background: currentTutorialStep === 0 ? 'rgba(255,255,255,0.1)' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: currentTutorialStep === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {t('tutorial.previous') || 'Previous'}
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#94a3b8',
              border: '2px solid #94a3b8',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {t('tutorial.skip') || 'Skip Tutorial'}
          </button>

          <button
            onClick={nextStep}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {currentTutorialStep === tutorialSteps.length - 1
              ? (t('tutorial.finish') || 'Finish')
              : (t('tutorial.next') || 'Next')}
          </button>
        </div>
      </div>
    </div>
  )
}
