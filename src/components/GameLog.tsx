import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types/game';

interface GameLogProps {
  log: LogEntry[];
}

const GameLog: React.FC<GameLogProps> = ({ log }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  return (
    <div style={{
      width: 260,
      height: '100%',
      backgroundColor: '#1a1a2e',
      borderLeft: '2px solid #16213e',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#16213e',
        color: '#e94560',
        fontWeight: 'bold',
        fontSize: 14,
        borderBottom: '1px solid #0f3460',
      }}>
        📜 ゲームログ
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 8,
      }}>
        {log.map((entry, i) => (
          <div key={i} style={{
            fontSize: 11,
            color: entry.message.startsWith('---') ? '#e94560' : entry.player === 'player' ? '#4fc3f7' : entry.player === 'cpu' ? '#ff8a65' : '#a0a0a0',
            marginBottom: 3,
            lineHeight: 1.3,
            borderBottom: entry.message.startsWith('---') ? '1px solid #333' : 'none',
            paddingBottom: entry.message.startsWith('---') ? 4 : 0,
          }}>
            {entry.message}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default GameLog;
