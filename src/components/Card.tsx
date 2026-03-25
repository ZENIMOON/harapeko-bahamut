import React from 'react';
import { CardInstance } from '../types/game';
import { getCardDef, getCardColor, getCardBorderColor } from '../data/cards';
import { CardSVG } from './CardIllustrations';

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
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* カード裏面のデザイン */}
        <svg viewBox="0 0 80 110" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <rect x="5" y="5" width="70" height="100" rx="4" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          <path d="M40 20 L50 40 L40 55 L30 40 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          <path d="M40 55 L50 70 L40 85 L30 70 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          <circle cx="40" cy="55" r="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        </svg>
        <span style={{ zIndex: 1, textShadow: '0 0 8px rgba(52,152,219,0.8)' }}>?</span>
      </div>
    );
  }

  const categoryLabel = def.category === 'monster' ? 'まもの' : def.category === 'spell' ? '呪文' : 'アクション';

  const SvgComponent = CardSVG[card.defId];

  const cardWidth = small ? 60 : 110;
  const cardHeight = small ? 85 : 160;
  const svgSize = small ? 40 : 68;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: cardWidth,
        height: cardHeight,
        backgroundColor: bgColor,
        borderRadius: 8,
        border: `3px solid ${selected ? '#e74c3c' : highlight ? '#f39c12' : borderColor}`,
        padding: small ? 2 : 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: disabled ? 'default' : onClick ? 'pointer' : 'default',
        boxShadow: selected
          ? '0 0 16px rgba(231,76,60,0.7), 0 4px 12px rgba(0,0,0,0.3)'
          : highlight
          ? '0 0 10px rgba(243,156,18,0.5), 0 2px 8px rgba(0,0,0,0.2)'
          : '0 2px 6px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        transform: selected ? 'translateY(-10px) scale(1.02)' : 'none',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* カテゴリラベル */}
      <div style={{
        fontSize: small ? 6 : 8,
        color: '#666',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        padding: small ? '0 0 1px' : '1px 0 2px',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '4px 4px 0 0',
      }}>
        {categoryLabel}
      </div>

      {/* SVGイラスト */}
      <div style={{
        flex: small ? undefined : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: small ? 1 : 2,
        minHeight: small ? 36 : undefined,
      }}>
        {SvgComponent ? (
          <SvgComponent size={svgSize} />
        ) : (
          <div style={{
            width: svgSize,
            height: svgSize,
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: small ? 16 : 24,
          }}>
            {def.category === 'monster' ? '🐉' : def.category === 'spell' ? '✨' : '⚔️'}
          </div>
        )}
      </div>

      {/* カード名 */}
      <div style={{
        fontSize: small ? 7 : 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50',
        lineHeight: 1.2,
        padding: small ? '1px 1px' : '2px 3px',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: small ? 2 : 3,
      }}>
        {def.name}
      </div>

      {/* 説明文（通常サイズのみ） */}
      {!small && (
        <div style={{
          fontSize: 7,
          color: '#555',
          textAlign: 'center',
          lineHeight: 1.15,
          padding: '2px 3px',
          maxHeight: 28,
          overflow: 'hidden',
          width: '100%',
        }}>
          {def.description}
        </div>
      )}
    </div>
  );
};

export default Card;
