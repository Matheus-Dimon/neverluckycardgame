import React, { useContext, useEffect } from 'react'
import { GameContext } from '../context/GameContext'
import DeckSetup from '../components/DeckSetup'
import HeroPowerSetup from '../components/HeroPowerSetup'
import PassiveSkillsSetup from '../components/PassiveSkillsSetup'
import ErrorBoundary from '../components/ErrorBoundary'
import GlobalErrorCatcher from '../components/GlobalErrorCatcher'
import BackgroundMusic from '../components/BackgroundMusic'
import StartMenu from './StartMenu'
import FriendsPage from './FriendsPage'
import Board from '../components/Board'

function InnerApp({ tutorialMode, onLogout }) {
  const context = useContext(GameContext)
  if (!context) {
    return <div>Loading...</div>
  }
  const { state, dispatch } = context

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

  if (state.gamePhase === 'FRIENDS') {
    return (
      <>
        <FriendsPage onBack={() => dispatch({ type: 'GO_TO_START_MENU' })} />
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
      <Board onLogout={onLogout} />
      <BackgroundMusic />
    </>
  )
}

export default function AppScreen({ tutorialMode, onLogout }) {
  return (
    <ErrorBoundary>
      <InnerApp tutorialMode={tutorialMode} onLogout={onLogout} />
      <GlobalErrorCatcher />
    </ErrorBoundary>
  )
}
