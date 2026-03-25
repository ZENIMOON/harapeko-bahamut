import React, { useState } from 'react';
import { AIDifficulty } from '../types/game';

interface TitleScreenProps {
  onStart: (difficulty: AIDifficulty) => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<AIDifficulty>(2);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a1a',
      color: 'white',
      fontFamily: '"Segoe UI", "Hiragino Sans", "Meiryo", sans-serif',
    }}>
      <div style={{
        textAlign: 'center',
        animation: 'fadeIn 1s ease-out',
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🐉</div>
        <h1 style={{
          fontSize: 48,
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #e94560, #f39c12)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 8,
        }}>
          はらぺこバハムート
        </h1>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 40 }}>
          2人用カードゲーム - PC対戦
        </p>

        <div style={{ marginBottom: 30 }}>
          <h3 style={{ color: '#e94560', marginBottom: 12 }}>AI難易度</h3>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {([1, 2, 3] as AIDifficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: difficulty === d ? '#e94560' : '#1a1a2e',
                  color: 'white',
                  border: `2px solid ${difficulty === d ? '#e94560' : '#333'}`,
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: 100,
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{'★'.repeat(d)}</div>
                <div>{d === 1 ? '初心者' : d === 2 ? '中級者' : '上級者'}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onStart(difficulty)}
          style={{
            padding: '16px 48px',
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 20,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
          }}
        >
          ゲームスタート
        </button>

        <div style={{
          marginTop: 40,
          padding: 20,
          backgroundColor: '#111122',
          borderRadius: 8,
          maxWidth: 500,
          textAlign: 'left',
          fontSize: 12,
          color: '#888',
          lineHeight: 1.6,
        }}>
          <h4 style={{ color: '#e94560', marginBottom: 8 }}>ルール概要</h4>
          <ul style={{ paddingLeft: 16 }}>
            <li>16枚の共有デッキで対戦</li>
            <li>相手のライフ(4)を先に0にしたら勝ち</li>
            <li>毎ターン最大2枚カードをプレイ</li>
            <li>うちけしの書で相手のカードを無効化可能</li>
            <li>はらぺこバハムートの4ダメージを決めろ！</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
