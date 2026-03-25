import React from 'react';
import { PlayerState, PlayerId, CardInstance } from '../types/game';
import Card from './Card';

interface PlayerAreaProps {
  player: PlayerState;
  playerId: PlayerId;
  isCurrentPlayer: boolean;
  selectedCardUid: string | null;
  onCardClick?: (uid: string) => void;
  canPlay?: (card: CardInstance) => boolean;
  compact?: boolean;
}

const PlayerArea: React.FC<PlayerAreaProps> = ({
  player, playerId, isCurrentPlayer, selectedCardUid, onCardClick, canPlay, compact,
}) => {
  const isPlayer = playerId === 'player';
  const name = isPlayer ? 'プレイヤー' : 'CPU';

  return (
    <div style={{
      padding: compact ? '4px 12px' : '6px 12px',
      backgroundColor: isCurrentPlayer ? 'rgba(255,255,255,0.05)' : 'transparent',
    }}>
      {/* 情報行 + 場 を横並び */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
      }}>
        <span style={{
          fontWeight: 'bold',
          fontSize: 14,
          color: isPlayer ? '#4fc3f7' : '#ff8a65',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </span>
        <span style={{ color: '#e74c3c', fontSize: 16, whiteSpace: 'nowrap' }}>
          {'♥'.repeat(player.life)}{'♡'.repeat(Math.max(0, 4 - player.life))}
        </span>
        <span style={{ color: '#9b59b6', fontSize: 12, whiteSpace: 'nowrap' }}>
          🔮×{player.counterChips}
        </span>
        {isCurrentPlayer && (
          <span style={{
            background: '#e74c3c',
            color: 'white',
            padding: '1px 6px',
            borderRadius: 4,
            fontSize: 10,
          }}>
            ▶ ターン中
          </span>
        )}
        <span style={{ fontSize: 10, color: '#666', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          場:
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {player.field.length === 0 ? (
            <span style={{ fontSize: 10, color: '#444' }}>なし</span>
          ) : (
            player.field.map(card => (
              <Card key={card.uid} card={card} small />
            ))
          )}
        </div>
      </div>

      {/* 手札 */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', overflowX: 'auto' }}>
        <span style={{ fontSize: 10, color: '#666', whiteSpace: 'nowrap', lineHeight: '60px' }}>
          手札{player.hand.length}:
        </span>
        {isPlayer ? (
          player.hand.map(card => (
            <Card
              key={card.uid}
              card={card}
              selected={selectedCardUid === card.uid}
              onClick={() => onCardClick?.(card.uid)}
              disabled={canPlay ? !canPlay(card) : false}
              highlight={canPlay ? canPlay(card) : false}
              small={compact}
            />
          ))
        ) : (
          player.hand.map(card => (
            <Card key={card.uid} card={card} faceDown small />
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerArea;
