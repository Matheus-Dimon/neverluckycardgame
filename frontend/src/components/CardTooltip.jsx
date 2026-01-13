import React from 'react';
import '../styles/styles.css';

const CardTooltip = ({ card }) => {
  if (!card) return null;

  return (
    <div className="card-tooltip">
      <div className="card-tooltip-content">
        <h3>{card.name || 'Unknown'}</h3>
        <p>Type: {card.type && card.type.name ? card.type.name : 'Unknown'}</p>
        <p>Attack: {card.attack || 0}</p>
        <p>Health: {card.defense || 0}</p>
        {card.effects && card.effects.length > 0 && (
          <div>
            <strong>Ability:</strong>
            <ul>
              {card.effects.map((effect, index) => (
                <li key={index}>{effect.description || 'No description'}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTooltip;
