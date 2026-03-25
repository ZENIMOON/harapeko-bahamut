import React from 'react';
import { CardInstance } from '../types/game';
import { getCardDef, getCardColor, getCardBorderColor } from '../data/cards';

interface CardProps {
  card: CardInstance;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  small?: boolean;
  disabled?: boolean;
  highlight?: boolean;
}

const Card: React.FC<CardProps> = ({ card, faceDown, selected, onClick, small, disabled, highlight }) => {
  const def = getCardDef(card.defId);
  const bgColor = getCardColor(def.category);
  const borderColor = getCardBorderColor(def.category);

  if (faceDown) {
    return (
      <div style={{
        width: small ? 50 : 80,
        height: small ? 70 : 110,
        background: 'linear-gradient(135deg, #2c3e50, #3498db)',
        borderRadius: 8,
        border: '2px solid #1a252f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ecf0f1',
        fontSize: small ? 10 : 14,
        fontWeight: 'bold',
        cursor: 'default',
        flexShrink: 0,
      }}>
        ?
      </div>
    );
  }

  const categoryLabel = def.category === 'monster' ? 'まもの' : def.category === 'spell' ? '呪文' : 'アクション';
  const categoryEmoji = def.category === 'monster' ? '🐉' : def.category === 'spell' ? '✨' : '⚔️';

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: small ? 60 : 100,
        height: small ? 85 : 140,
        backgroundColor: bgColor,
        borderRadius: 8,
        border: `3px solid ${selected ? '#e74c3c' : highlight ? '#f39c12' : borderColor}`,
        padding: small ? 3 : 6,
        display: 'flex',
        flexDirection: 'column',
        cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
        boxShadow: selected ? '0 0 12px rgba(231,76,60,0.6)' : highlight ? '0 0 8px rgba(243,156,18,0.5)' : '0 2px 4px rgba(0,0,0,0.15)',
        transition: 'all 0.2s',
        transform: selected ? 'translateY(-8px)' : 'none',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{
        fontSize: small ? 7 : 10,
        color: '#666',
        textAlign: 'center',
        marginBottom: 2,
      }}>
        {categoryEmoji} {categoryLabel}
      </div>
      <div style={{
        fontSize: small ? 8 : 12,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1.2,
      }}>
        {def.name}
      </div>
      {!small && (
        <div style={{
          fontSize: 8,
          color: '#7f8c8d',
          textAlign: 'center',
          lineHeight: 1.1,
          maxHeight: 40,
          overflow: 'hidden',
        }}>
          {def.description}
        </div>
      )}
    </div>
  );
};

export default Card;
