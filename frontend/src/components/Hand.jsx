import React, { useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import { GameContext } from '../context/GameContext.jsx'

export default function Hand({ cards = [], onPlayCard, playerMana }) {
  const { state } = useContext(GameContext)
  const { tutorialMode, tutorialStep } = state

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: {
      x: 200,
      y: 50,
      scale: 0.8,
      opacity: 0,
      rotateY: 45,
      transformOrigin: 'center'
    },
    visible: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.8
      }
    },
    exit: {
      x: -300,
      y: -100,
      scale: 0.9,
      opacity: 0,
      rotate: -20,
      rotateY: -30,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  }

  // Check if card is enabled during tutorial
  const isCardEnabled = (index) => {
    if (!tutorialMode) return true

    // During card selection step (step 1), only allow the first card
    if (tutorialStep === 1) {
      return index === 0
    }

    // During other steps, disable all cards unless specifically allowed
    return false
  }

  const handleCardClick = (card, index) => {
    if (!isCardEnabled(index)) return
    onPlayCard && onPlayCard(card)
  }

  return (
    <motion.div className="hand" variants={containerVariants} initial="hidden" animate="visible">
      <AnimatePresence>
        {cards.map((c, index) => (
          <motion.div
            key={c.id}
            data-card-id={`tutorial-card-${index}`}
            variants={cardVariants}
            layout
            layoutId={c.id}
            exit="exit"
            initial="hidden"
            animate="visible"
            whileHover={isCardEnabled(index) ? { y: -10 } : {}}
            style={{
              opacity: isCardEnabled(index) ? 1 : 0.3,
              pointerEvents: isCardEnabled(index) ? 'auto' : 'none',
              filter: isCardEnabled(index) ? 'none' : 'grayscale(100%)'
            }}
          >
            <Card
              card={c}
              onClick={() => handleCardClick(c, index)}
              playable={playerMana >= c.mana && isCardEnabled(index)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
