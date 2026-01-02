import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function InstructionsPanel() {
  const [isOpen, setIsOpen] = useState(true)
  const { t } = useLanguage()

  return (
    <div className={`instructions-panel ${isOpen ? 'open' : 'closed'}`}>
      <button className="instructions-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? t('instructions.toggleOpen') : t('instructions.toggleClosed')}
      </button>

      {isOpen && (
        <div className="instructions-content">
          <h3>{t('instructions.title')}</h3>

          <div className="instruction-section">
            <h4>{t('instructions.sections.combat.title')}</h4>
            <ul>
              <li><strong>Melee:</strong> {t('instructions.sections.combat.melee')}</li>
              <li><strong>Ranged:</strong> {t('instructions.sections.combat.ranged')}</li>
              <li>{t('instructions.sections.combat.meleeVsRanged')}</li>
            </ul>
          </div>

          <div className="instruction-section">
            <h4>{t('instructions.sections.cardEffects.title')}</h4>
            <ul>
              <li>{t('instructions.sections.cardEffects.charge')}</li>
              <li>{t('instructions.sections.cardEffects.taunt')}</li>
              <li>{t('instructions.sections.cardEffects.immuneFirstTurn')}</li>
              <li>{t('instructions.sections.cardEffects.lifesteal')}</li>
              <li>{t('instructions.sections.cardEffects.battlecry')}</li>
              <li>{t('instructions.sections.cardEffects.deathrattle')}</li>
            </ul>
          </div>

          <div className="instruction-section">
            <h4>{t('instructions.sections.resources.title')}</h4>
            <ul>
              <li>{t('instructions.sections.resources.manaGain')}</li>
              <li>{t('instructions.sections.resources.cardDraw')}</li>
              <li>{t('instructions.sections.resources.heroPower')}</li>
            </ul>
          </div>

          <div className="instruction-section">
            <h4>{t('instructions.sections.strategy.title')}</h4>
            <ul>
              <li>{t('instructions.sections.strategy.controlBoard')}</li>
              <li>{t('instructions.sections.strategy.rangedThreats')}</li>
              <li>{t('instructions.sections.strategy.clerics')}</li>
              <li>{t('instructions.sections.strategy.planAhead')}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
