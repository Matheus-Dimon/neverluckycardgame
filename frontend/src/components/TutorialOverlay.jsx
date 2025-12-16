import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function TutorialOverlay({ tutorialStep, tutorialHighlights, tutorialMessage }) {
  const { t } = useLanguage()

  const getTutorialContent = (step) => {
    const tutorialSteps = [
      {
        title: t('tutorial.game.welcome.title') || "Bem-vindo ao Tutorial!",
        message: t('tutorial.game.welcome.message') || "Vamos aprender jogando! Você começa com cartas na mão. Clique em uma carta para jogá-la no campo.",
        highlight: 'hand',
        position: { top: '70%', left: '50%', transform: 'translate(-50%, -50%)' }
      },
      {
        title: t('tutorial.game.mana.title') || "Mana",
        message: t('tutorial.game.mana.message') || "Cada carta custa mana. Você ganha 1 cristal de mana por turno (até 10). Verifique o custo antes de jogar!",
        highlight: 'mana',
        position: { top: '20%', right: '10%' }
      },
      {
        title: t('tutorial.game.board.title') || "Campo de Batalha",
        message: t('tutorial.game.board.message') || "As unidades são colocadas em duas pistas: Corpo a corpo (esquerda) e À distância (direita). Clique em uma unidade para atacá-la.",
        highlight: 'board',
        position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
      },
      {
        title: t('tutorial.game.heroPower.title') || "Poder do Herói",
        message: t('tutorial.game.heroPower.message') || "Cada herói tem poderes únicos! Clique no botão do poder do herói para usá-lo (uma vez por turno).",
        highlight: 'hero-power',
        position: { bottom: '20%', left: '10%' }
      },
      {
        title: t('tutorial.game.endTurn.title') || "Finalizar Turno",
        message: t('tutorial.game.endTurn.message') || "Quando terminar suas ações, clique em 'End Turn' para passar o turno. O oponente jogará automaticamente!",
        highlight: 'end-turn',
        position: { bottom: '10%', left: '50%', transform: 'translateX(-50%)' }
      }
    ]

    return tutorialSteps[step] || null
  }

  // If there's a dynamic tutorial message, show it instead
  if (tutorialMessage) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.7)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '3px solid #f5c06b',
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
          position: 'relative'
        }}>
          <h2 style={{
            color: '#f5c06b',
            marginBottom: '15px',
            fontSize: '24px',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            Tutorial
          </h2>

          <p style={{
            color: '#e2e8f0',
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '25px'
          }}>
            {tutorialMessage}
          </p>
        </div>
      </div>
    )
  }

  const tutorialContent = getTutorialContent(tutorialStep)

  if (!tutorialContent) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '3px solid #f5c06b',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
        position: 'relative'
      }}>
        <h2 style={{
          color: '#f5c06b',
          marginBottom: '15px',
          fontSize: '24px',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          {tutorialContent.title}
        </h2>

        <p style={{
          color: '#e2e8f0',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '25px'
        }}>
          {tutorialContent.message}
        </p>

        <button
          onClick={() => {
            // This will be handled by the parent component
            window.dispatchEvent(new CustomEvent('advanceTutorial'))
          }}
          style={{
            background: 'linear-gradient(135deg, #f5c06b, #d4a574)',
            color: '#1e293b',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(245,192,107,0.3)'
          }}
        >
          {t('tutorial.next') || 'Entendi!'}
        </button>

        {/* Arrow pointing to highlighted element */}
        {tutorialHighlights.includes(tutorialContent.highlight) && (
          <div style={{
            position: 'absolute',
            ...getArrowPosition(tutorialContent.highlight),
            color: '#f5c06b',
            fontSize: '40px',
            animation: 'bounce 1s infinite'
          }}>
            ⬇️
          </div>
        )}
      </div>

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
      `}</style>
    </div>
  )
}

function getArrowPosition(highlight) {
  switch (highlight) {
    case 'hand':
      return { bottom: '25%', left: '50%', transform: 'translateX(-50%)' }
    case 'mana':
      return { top: '15%', right: '15%' }
    case 'board':
      return { top: '40%', left: '50%', transform: 'translateX(-50%)' }
    case 'hero-power':
      return { bottom: '25%', left: '15%' }
    case 'end-turn':
      return { bottom: '15%', left: '50%', transform: 'translateX(-50%)' }
    default:
      return { bottom: '20%', left: '50%', transform: 'translateX(-50%)' }
  }
}
