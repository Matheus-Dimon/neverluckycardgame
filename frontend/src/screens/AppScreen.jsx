import React, { useContext, useEffect } from 'react'
import { GameContext } from '../context/GameContext'
import DeckSetup from '../components/DeckSetup'
import HeroPowerSetup from '../components/HeroPowerSetup'
import PassiveSkillsSetup from '../components/PassiveSkillsSetup'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalErrorCatcher from '../components/GlobalErrorCatcher'
import BackgroundMusic from '../components/BackgroundMusic'
import StartMenu from './StartMenu'
import Board from '../components/Board'

function InnerApp({ tutorialMode }) {
  const { state, dispatch } = useContext(GameContext)

  // Start tutorial when component mounts in tutorial mode
  useEffect(() => {
    if (tutorialMode && state.gamePhase === 'START_MENU') {
      dispatch({ type: 'START_TUTORIAL' })
    }
  }, [tutorialMode, state.gamePhase, dispatch])

  if (state.gamePhase === 'START_MENU') {
    return (
      <>
        <StartMenu />
        <BackgroundMusic />
      </>
    )
  }

  if (state.gamePhase === 'PASSIVE_SKILLS') {
    return (
      <>
        <PassiveSkillsSetup />
        <BackgroundMusic />
      </>
    )
  }

  if (state.gamePhase === 'SETUP') {
    return (
      <>
        <DeckSetup />
        <BackgroundMusic />
      </>
    )
  }

  if (state.gamePhase === 'HERO_POWER_OPTIONS') {
    return (
      <>
        <HeroPowerSetup />
        <BackgroundMusic />
      </>
    )
  }

  return (
    <>
      <Board />
      <BackgroundMusic />
    </>
  )
}

export default function AppScreen({ tutorialMode }) {
  return (
    <ErrorBoundary>
      <InnerApp tutorialMode={tutorialMode} />
      <GlobalErrorCatcher />
    </ErrorBoundary>
  )
}
