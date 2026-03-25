import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameAction, PlayerId, AIDifficulty, CardInstance, WaitingFor } from '../types/game';
import { getCardDef, CARD_DEFS } from '../data/cards';
import { canPlayCard, opponent } from '../hooks/useGame';
import {
  getAICounterDecision, getAICounterCounterDecision,
  getAIPlayActions, getAIDeclareCardName, getAIDiscardChoice,
  getAIOpponentHandCardChoice, getAIGraveyardChoice, getAIDeckCardChoice,
  getAIHiramekiChoice, getAIHiramekiReturnPositions, getAIIrekaeTarget,
  getAIOwakareTarget, getAIMonsterFromHandChoice, getAIGraveyardMonsterChoice,
} from '../ai/aiPlayer';
import Card from './Card';
import PlayerArea from './PlayerArea';
import GameLog from './GameLog';

interface GameBoardProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameBoard: React.FC<GameBoardProps> = ({ state, dispatch }) => {
  const [selectedCardUid, setSelectedCardUid] = useState<string | null>(null);
  const [selectedDiscards, setSelectedDiscards] = useState<string[]>([]);
  const [aiActionQueue, setAiActionQueue] = useState<GameAction[]>([]);
  const aiTimerRef = useRef<number | null>(null);

  // AI turn handler
  useEffect(() => {
    if (state.winner) return;
    if (state.currentPlayer !== 'cpu') return;
    if (state.waitingFor?.type === 'cpuThinking') {
      const timer = setTimeout(() => {
        const actions = getAIPlayActions(state);
        if (actions.length > 0) {
          setAiActionQueue(actions);
        } else {
          dispatch({ type: 'END_TURN' });
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.waitingFor, state.currentPlayer, state.winner]);

  // Process AI action queue
  useEffect(() => {
    if (aiActionQueue.length === 0) return;
    if (state.winner) return;

    const timer = setTimeout(() => {
      const [nextAction, ...rest] = aiActionQueue;
      setAiActionQueue(rest);
      dispatch(nextAction);
    }, 600);

    return () => clearTimeout(timer);
  }, [aiActionQueue, state.winner]);

  // When AI finishes all actions, end turn
  useEffect(() => {
    if (state.currentPlayer !== 'cpu') return;
    if (state.winner) return;
    if (state.waitingFor) return;
    if (aiActionQueue.length > 0) return;

    // Check if CPU just finished playing and queue is empty
    if (state.phase === 'play' && state.waitingFor === null) {
      const timer = setTimeout(() => {
        if (state.currentPlayer === 'cpu' && !state.waitingFor && aiActionQueue.length === 0) {
          dispatch({ type: 'END_TURN' });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentPlayer, state.waitingFor, aiActionQueue.length, state.winner]);

  // AI counter decisions
  useEffect(() => {
    if (!state.waitingFor) return;

    if (state.waitingFor.type === 'counter' && state.waitingFor.playerId === 'cpu') {
      const timer = setTimeout(() => {
        const useCounter = getAICounterDecision(state, state.waitingFor!.type === 'counter' ? (state.waitingFor as any).card : null, state.difficulty);
        dispatch({ type: 'RESOLVE_COUNTER', useCounter });
      }, 800);
      return () => clearTimeout(timer);
    }

    if (state.waitingFor.type === 'counterCounter' && state.waitingFor.playerId === 'cpu') {
      const timer = setTimeout(() => {
        const useCC = getAICounterCounterDecision(state, (state.waitingFor as any).originalCard, state.difficulty);
        dispatch({ type: 'RESOLVE_COUNTER_COUNTER', useCounterCounter: useCC });
      }, 800);
      return () => clearTimeout(timer);
    }

    // AI waiting-for handling
    if (state.currentPlayer === 'cpu') {
      const w = state.waitingFor;
      const timer = setTimeout(() => {
        switch (w.type) {
          case 'selectDiscardFromHand':
          case 'selectDiscard': {
            const count = w.count;
            const uids = getAIDiscardChoice(state, count);
            if (w.type === 'selectDiscard') {
              dispatch({ type: 'SELECT_DISCARD', cardUids: uids });
            } else {
              dispatch({ type: 'SELECT_DISCARD', cardUids: uids });
            }
            break;
          }
          case 'selectOpponentHandCard': {
            const uid = getAIOpponentHandCardChoice(state, (w as any).opponentHand);
            dispatch({ type: 'SELECT_OPPONENT_HAND_CARD', cardUid: uid });
            break;
          }
          case 'declareCardName': {
            const name = getAIDeclareCardName(state);
            dispatch({ type: 'DECLARE_CARD_NAME', cardName: name });
            break;
          }
          case 'selectGraveyardCard': {
            const uid = getAIGraveyardChoice(state);
            dispatch({ type: 'SELECT_GRAVEYARD_CARD', cardUid: uid });
            break;
          }
          case 'selectDeckCard': {
            const uid = getAIDeckCardChoice(state);
            dispatch({ type: 'SELECT_DECK_CARD', cardUid: uid });
            break;
          }
          case 'selectHiramekiCard': {
            const uid = getAIHiramekiChoice(state, (w as any).revealed);
            dispatch({ type: 'SELECT_HIRAMEKI_CARD', cardUid: uid });
            break;
          }
          case 'selectHiramekiReturn': {
            const positions = getAIHiramekiReturnPositions((w as any).remaining);
            dispatch({ type: 'SELECT_HIRAMEKI_RETURN', positions });
            break;
          }
          case 'selectMonsterFromHand': {
            const uid = getAIMonsterFromHandChoice(state);
            dispatch({ type: 'SELECT_MONSTER_FROM_HAND', cardUid: uid });
            break;
          }
          case 'selectGraveyardMonster': {
            const uid = getAIGraveyardMonsterChoice(state);
            dispatch({ type: 'SELECT_GRAVEYARD_MONSTER', cardUid: uid });
            break;
          }
          case 'selectIrekaeTarget': {
            const target = getAIIrekaeTarget(state);
            dispatch({ type: 'SELECT_IREKAE_TARGET', target });
            break;
          }
          case 'selectOwakareTarget': {
            const uid = getAIOwakareTarget(state);
            dispatch({ type: 'SELECT_OWAKARE_TARGET', cardUid: uid });
            break;
          }
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.waitingFor, state.currentPlayer]);

  const handlePlayCard = () => {
    if (!selectedCardUid) return;
    dispatch({ type: 'PLAY_CARD', cardUid: selectedCardUid });
    setSelectedCardUid(null);
  };

  const handleEndTurn = () => {
    // Check cleanup first
    if (state.player.hand.length > 5) {
      dispatch({ type: 'SET_WAITING', waitingFor: { type: 'selectDiscard', count: state.player.hand.length - 5 } });
      return;
    }
    dispatch({ type: 'END_TURN' });
  };

  const isPlayerTurn = state.currentPlayer === 'player' && !state.waitingFor;
  const playerCanPlay = (card: CardInstance) => {
    if (!isPlayerTurn) return false;
    if (state.phase !== 'play') return false;
    return canPlayCard(state, 'player', card);
  };

  // Render dialogs based on waitingFor
  const renderDialog = () => {
    const w = state.waitingFor;
    if (!w) return null;
    // Only show dialog for player decisions
    if (state.currentPlayer === 'cpu' && w.type !== 'counter' && w.type !== 'counterCounter') {
      if (w.type === 'cpuThinking') {
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <p style={{ fontSize: 16, color: '#ff8a65' }}>🤔 CPUが考え中...</p>
            </div>
          </div>
        );
      }
      return (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <p style={{ fontSize: 14, color: '#aaa' }}>CPUが行動中...</p>
          </div>
        </div>
      );
    }

    switch (w.type) {
      case 'counter': {
        if (w.playerId !== 'player') return null;
        const card = w.card;
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#e74c3c', marginBottom: 8 }}>🔮 うちけしの書</h3>
              <p>CPUが <strong>{getCardDef(card.defId).name}</strong> をプレイしました！</p>
              <p>うちけしの書を使って無効化しますか？（残り{state.player.counterChips}枚）</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  style={btnStyle('#e74c3c')}
                  onClick={() => dispatch({ type: 'RESOLVE_COUNTER', useCounter: true })}
                  disabled={state.player.counterChips <= 0}
                >
                  うちけし！
                </button>
                <button
                  style={btnStyle('#95a5a6')}
                  onClick={() => dispatch({ type: 'RESOLVE_COUNTER', useCounter: false })}
                >
                  見送る
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'counterCounter': {
        if (w.playerId !== 'player') return null;
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#9b59b6', marginBottom: 8 }}>⚡ うちけし返し</h3>
              <p>あなたの <strong>{getCardDef(w.originalCard.defId).name}</strong> がうちけしされました！</p>
              <p>うちけしの書2枚で打ち消し返しますか？（残り{state.player.counterChips}枚）</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button
                  style={btnStyle('#9b59b6')}
                  onClick={() => dispatch({ type: 'RESOLVE_COUNTER_COUNTER', useCounterCounter: true })}
                  disabled={state.player.counterChips < 2}
                >
                  うちけし返し！（2枚消費）
                </button>
                <button
                  style={btnStyle('#95a5a6')}
                  onClick={() => dispatch({ type: 'RESOLVE_COUNTER_COUNTER', useCounterCounter: false })}
                >
                  諦める
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'selectDiscard':
      case 'selectDiscardFromHand': {
        if (state.currentPlayer !== 'player') return null;
        const count = w.count;
        return (
          <div style={overlayStyle}>
            <div style={{ ...dialogStyle, maxWidth: 600 }}>
              <h3 style={{ color: '#f39c12' }}>手札を{count}枚捨ててください</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0' }}>
                {state.player.hand.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    selected={selectedDiscards.includes(card.uid)}
                    onClick={() => {
                      setSelectedDiscards(prev =>
                        prev.includes(card.uid)
                          ? prev.filter(u => u !== card.uid)
                          : prev.length < count ? [...prev, card.uid] : prev
                      );
                    }}
                  />
                ))}
              </div>
              <button
                style={btnStyle('#e74c3c')}
                disabled={selectedDiscards.length !== count}
                onClick={() => {
                  dispatch({ type: 'SELECT_DISCARD', cardUids: selectedDiscards });
                  setSelectedDiscards([]);
                }}
              >
                捨てる（{selectedDiscards.length}/{count}）
              </button>
            </div>
          </div>
        );
      }

      case 'selectOpponentHandCard': {
        if (state.currentPlayer !== 'player') return null;
        return (
          <div style={overlayStyle}>
            <div style={{ ...dialogStyle, maxWidth: 600 }}>
              <h3 style={{ color: '#e74c3c' }}>🗡️ あくまの吹き矢 - 相手の手札から1枚選んで捨てさせる</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0' }}>
                {w.opponentHand.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_OPPONENT_HAND_CARD', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'declareCardName': {
        if (state.currentPlayer !== 'player') return null;
        return (
          <div style={overlayStyle}>
            <div style={{ ...dialogStyle, maxWidth: 500 }}>
              <h3 style={{ color: '#2ecc71' }}>🧹 魔女のおとどけもの - カード名を宣言</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 6,
                margin: '12px 0',
                maxHeight: 300,
                overflowY: 'auto',
              }}>
                {CARD_DEFS.map(def => (
                  <button
                    key={def.id}
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      backgroundColor: '#2c3e50',
                      color: 'white',
                      border: '1px solid #34495e',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                    onClick={() => dispatch({ type: 'DECLARE_CARD_NAME', cardName: def.name })}
                  >
                    {def.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectGraveyardCard': {
        if (state.currentPlayer !== 'player') return null;
        return (
          <div style={overlayStyle}>
            <div style={{ ...dialogStyle, maxWidth: 600 }}>
              <h3 style={{ color: '#2ecc71' }}>🐦 カラスのおつかい - 捨て札から1枚回収</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0' }}>
                {state.graveyard.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_GRAVEYARD_CARD', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectDeckCard': {
        if (state.currentPlayer !== 'player') return null;
        return (
          <div style={overlayStyle}>
            <div style={{ ...dialogStyle, maxWidth: 700 }}>
              <h3 style={{ color: '#3498db' }}>🔍 ようせいのメガネ - 山札から1枚選ぶ</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '12px 0', maxHeight: 300, overflowY: 'auto' }}>
                {state.deck.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_DECK_CARD', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectHiramekiCard': {
        if (state.currentPlayer !== 'player') return null;
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#9b59b6' }}>🔮 ひらめき水晶 - 1枚選んで手札に加える</h3>
              <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                {w.revealed.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_HIRAMEKI_CARD', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectHiramekiReturn': {
        if (state.currentPlayer !== 'player') return null;
        const [positions, setPositions] = useState<('top' | 'bottom')[]>(
          w.remaining.map(() => 'top')
        );
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#9b59b6' }}>残りのカードを戻す位置を選択</h3>
              {w.remaining.map((card, i) => (
                <div key={card.uid} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0' }}>
                  <Card card={card} small />
                  <select
                    value={positions[i]}
                    onChange={e => {
                      const newPos = [...positions];
                      newPos[i] = e.target.value as 'top' | 'bottom';
                      setPositions(newPos);
                    }}
                    style={{ padding: 4, borderRadius: 4, fontSize: 12 }}
                  >
                    <option value="top">山札の上</option>
                    <option value="bottom">山札の下</option>
                  </select>
                </div>
              ))}
              <button
                style={btnStyle('#9b59b6')}
                onClick={() => dispatch({ type: 'SELECT_HIRAMEKI_RETURN', positions })}
              >
                確定
              </button>
            </div>
          </div>
        );
      }

      case 'selectMonsterFromHand': {
        if (state.currentPlayer !== 'player') return null;
        const monsters = state.player.hand.filter(c => {
          const def = getCardDef(c.defId);
          if (def.category !== 'monster') return false;
          const allFields = [...state.player.field, ...state.cpu.field];
          if (c.defId === 'harapeko_bahamut' && allFields.some(f => f.defId === 'harapeko_bahamut')) return false;
          if (c.defId === 'kodomo_bahamut' && allFields.some(f => f.defId === 'kodomo_bahamut')) return false;
          if (c.defId === 'hanekaeshi_goblin' && allFields.some(f => f.defId === 'hanekaeshi_goblin')) return false;
          return true;
        });
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#f39c12' }}>⚡ イデヨン！ - まものを場に出す</h3>
              <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                {monsters.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_MONSTER_FROM_HAND', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectGraveyardMonster': {
        if (state.currentPlayer !== 'player') return null;
        const monsters = state.graveyard.filter(c => {
          const def = getCardDef(c.defId);
          if (def.category !== 'monster') return false;
          const allFields = [...state.player.field, ...state.cpu.field];
          if (c.defId === 'harapeko_bahamut' && allFields.some(f => f.defId === 'harapeko_bahamut')) return false;
          if (c.defId === 'kodomo_bahamut' && allFields.some(f => f.defId === 'kodomo_bahamut')) return false;
          if (c.defId === 'hanekaeshi_goblin' && allFields.some(f => f.defId === 'hanekaeshi_goblin')) return false;
          return true;
        });
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#2ecc71' }}>✨ ヨミガエール！ - まものを蘇生</h3>
              <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                {monsters.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_GRAVEYARD_MONSTER', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectIrekaeTarget': {
        if (state.currentPlayer !== 'player') return null;
        const cpuField = state.cpu.field;
        const playerField = state.player.field;
        const playerKodomo = playerField.some(c => c.defId === 'kodomo_bahamut');
        const cpuHarapeko = cpuField.some(c => c.defId === 'harapeko_bahamut');
        const cpuKodomo = cpuField.some(c => c.defId === 'kodomo_bahamut');
        const playerHarapeko = playerField.some(c => c.defId === 'harapeko_bahamut');
        const allHarapeko = [...playerField, ...cpuField].some(c => c.defId === 'harapeko_bahamut');

        const options: { label: string; target: any }[] = [];
        if (playerKodomo && !allHarapeko) {
          options.push({ label: '自分のこどもバハムートを進化させる', target: { action: 'evolve' } });
        }
        if (cpuHarapeko) {
          options.push({ label: '相手のはらぺこバハムートを弱体化', target: { action: 'weaken' } });
        }
        if (playerKodomo && cpuHarapeko) {
          options.push({ label: '入れ替え（自分こども⇄相手はらぺこ）', target: { action: 'swap' } });
        }
        // 逆パターン
        if (cpuKodomo && !allHarapeko) {
          options.push({ label: '相手のこどもバハムートを進化させる（相手の場）', target: { action: 'evolve' } });
        }

        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#e74c3c' }}>🔄 イレカエール！ - 入れ替え先を選択</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0' }}>
                {options.map((opt, i) => (
                  <button
                    key={i}
                    style={btnStyle('#e74c3c')}
                    onClick={() => dispatch({ type: 'SELECT_IREKAE_TARGET', target: opt.target })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'selectOwakareTarget': {
        if (state.currentPlayer !== 'player') return null;
        const opponentId = opponent(state.currentPlayer);
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <h3 style={{ color: '#e74c3c' }}>💀 オワカーレ！ - 除去するまものを選択</h3>
              <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                {state[opponentId].field.map(card => (
                  <Card
                    key={card.uid}
                    card={card}
                    onClick={() => dispatch({ type: 'SELECT_OWAKARE_TARGET', cardUid: card.uid })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'cpuThinking':
        return (
          <div style={overlayStyle}>
            <div style={dialogStyle}>
              <p style={{ fontSize: 16, color: '#ff8a65' }}>🤔 CPUが考え中...</p>
            </div>
          </div>
        );
    }

    return null;
  };

  // Game over screen
  if (state.winner) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#0a0a1a',
        color: 'white',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}>
          <div style={{
            fontSize: 60,
            animation: 'pulse 1s ease-in-out infinite',
          }}>
            {state.winner === 'player' ? '🏆' : '💀'}
          </div>
          <h1 style={{
            fontSize: 36,
            color: state.winner === 'player' ? '#f1c40f' : '#e74c3c',
          }}>
            {state.winner === 'player' ? '勝利！' : '敗北...'}
          </h1>
          <p style={{ fontSize: 16, color: '#aaa' }}>
            プレイヤー: ♥{state.player.life} / CPU: ♥{state.cpu.life}
          </p>
          <button
            style={{
              ...btnStyle('#3498db'),
              fontSize: 18,
              padding: '12px 32px',
            }}
            onClick={() => dispatch({ type: 'START_GAME', difficulty: state.difficulty })}
          >
            もう一度プレイ
          </button>
        </div>
        <GameLog log={state.log} />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0a0a1a',
      color: 'white',
      fontFamily: '"Segoe UI", "Hiragino Sans", "Meiryo", sans-serif',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* CPU Area */}
        <div style={{ borderBottom: '1px solid #333' }}>
          <PlayerArea
            player={state.cpu}
            playerId="cpu"
            isCurrentPlayer={state.currentPlayer === 'cpu'}
            selectedCardUid={null}
            compact
          />
        </div>

        {/* Shared Area */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: '6px 16px',
          backgroundColor: '#111122',
          borderTop: '1px solid #222',
          borderBottom: '1px solid #222',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 44,
              height: 62,
              background: state.deck.length > 0
                ? 'linear-gradient(135deg, #2c3e50, #3498db)'
                : '#333',
              borderRadius: 6,
              border: '2px solid #1a252f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
              {state.deck.length}
            </div>
            <span style={{ fontSize: 10, color: '#888' }}>山札</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {state.graveyard.length > 0 ? (
              <Card card={state.graveyard[state.graveyard.length - 1]} small />
            ) : (
              <div style={{
                width: 44,
                height: 62,
                backgroundColor: '#222',
                borderRadius: 6,
                border: '2px dashed #444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
                fontSize: 9,
              }}>
                なし
              </div>
            )}
            <span style={{ fontSize: 10, color: '#888' }}>捨{state.graveyard.length}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#e94560' }}>T{state.turnNumber}</div>
            <div style={{ fontSize: 9, color: '#888' }}>
              {state.playCount}/{state.maxPlays}
            </div>
          </div>
        </div>

        {/* Player Area */}
        <div style={{ borderTop: '1px solid #333', flex: 1, overflow: 'auto' }}>
          <PlayerArea
            player={state.player}
            playerId="player"
            isCurrentPlayer={state.currentPlayer === 'player'}
            selectedCardUid={selectedCardUid}
            onCardClick={(uid) => setSelectedCardUid(uid === selectedCardUid ? null : uid)}
            canPlay={playerCanPlay}
          />
        </div>

        {/* Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 16px',
          backgroundColor: '#111',
          borderTop: '2px solid #333',
        }}>
          <button
            style={btnStyle(isPlayerTurn && selectedCardUid ? '#27ae60' : '#444')}
            disabled={!isPlayerTurn || !selectedCardUid}
            onClick={handlePlayCard}
          >
            ▶ プレイ
          </button>
          <button
            style={btnStyle(isPlayerTurn ? '#2980b9' : '#444')}
            disabled={!isPlayerTurn}
            onClick={handleEndTurn}
          >
            ⏭ ターンエンド
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: '#666' }}>
            難易度: {'★'.repeat(state.difficulty)}{'☆'.repeat(3 - state.difficulty)}
          </span>
        </div>
      </div>

      {/* Game Log */}
      <GameLog log={state.log} />

      {/* Dialogs */}
      {renderDialog()}
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle: React.CSSProperties = {
  backgroundColor: '#1a1a2e',
  border: '2px solid #e94560',
  borderRadius: 12,
  padding: 24,
  maxWidth: 450,
  width: '90%',
  color: 'white',
  textAlign: 'center',
};

const btnStyle = (color: string): React.CSSProperties => ({
  padding: '8px 20px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 'bold',
  cursor: 'pointer',
});

export default GameBoard;
