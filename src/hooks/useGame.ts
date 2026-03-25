import { useReducer, useCallback } from 'react';
import {
  GameState, GameAction, PlayerId, Phase, CardInstance,
  LogEntry, AIDifficulty, WaitingFor,
} from '../types/game';
import {
  createDeck, shuffleArray, getCardDef, resetUidCounter, createCardInstance,
} from '../data/cards';

function addLog(state: GameState, message: string, player?: PlayerId): GameState {
  const entry: LogEntry = { timestamp: Date.now(), message, player };
  return { ...state, log: [...state.log, entry] };
}

function opponent(p: PlayerId): PlayerId {
  return p === 'player' ? 'cpu' : 'player';
}

function drawCards(state: GameState, playerId: PlayerId, count: number): GameState {
  let s = { ...state };
  for (let i = 0; i < count; i++) {
    if (s.deck.length === 0) {
      if (s.graveyard.length === 0) break;
      s = { ...s, deck: shuffleArray(s.graveyard), graveyard: [] };
      s = addLog(s, '捨て札をシャッフルして新しい山札にしました。');
    }
    const card = s.deck[0];
    const newDeck = s.deck.slice(1);
    const playerState = { ...s[playerId] };
    playerState.hand = [...playerState.hand, card];
    s = { ...s, deck: newDeck, [playerId]: playerState };
  }
  return s;
}

function dealDamage(state: GameState, targetId: PlayerId, amount: number, fromBahamut: boolean = false): GameState {
  let s = { ...state };
  const target = { ...s[targetId] };
  const attackerId = opponent(targetId);

  // はねかえしゴブリンチェック
  const hasGoblin = target.field.some(c => c.defId === 'hanekaeshi_goblin');
  if (hasGoblin && !fromBahamut) {
    // ダメージを反射
    const attacker = { ...s[attackerId] };
    attacker.life = Math.max(0, attacker.life - amount);
    s = { ...s, [attackerId]: attacker };
    s = addLog(s, `はねかえしゴブリンが${amount}ダメージを反射！`, targetId);
    if (attacker.life <= 0) {
      s = { ...s, winner: targetId, phase: 'gameOver' as Phase };
      s = addLog(s, `${attackerId === 'player' ? 'プレイヤー' : 'CPU'}のライフが0になりました！`);
    }
    return s;
  }

  target.life = Math.max(0, target.life - amount);
  s = { ...s, [targetId]: target };
  s = addLog(s, `${targetId === 'player' ? 'プレイヤー' : 'CPU'}に${amount}ダメージ！`, attackerId);

  if (target.life <= 0) {
    s = { ...s, winner: opponent(targetId), phase: 'gameOver' as Phase };
    s = addLog(s, `${targetId === 'player' ? 'プレイヤー' : 'CPU'}のライフが0になりました！`);
  }
  return s;
}

function resolveCardEffect(state: GameState, playerId: PlayerId, card: CardInstance): GameState {
  let s = { ...state };
  const def = getCardDef(card.defId);
  const opponentId = opponent(playerId);
  const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';

  switch (card.defId) {
    case 'kodomo_bahamut': {
      // 場に出す
      const pState = { ...s[playerId] };
      pState.field = [...pState.field, card];
      s = { ...s, [playerId]: pState };
      s = addLog(s, `${pName}がこどもバハムートを場に出した！`, playerId);
      return s;
    }

    case 'hanekaeshi_goblin': {
      const pState = { ...s[playerId] };
      pState.field = [...pState.field, card];
      s = { ...s, [playerId]: pState };
      s = addLog(s, `${pName}がはねかえしゴブリンを場に出した！`, playerId);
      return s;
    }

    case 'soratobu_knife': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      s = dealDamage(s, opponentId, 2);
      return s;
    }

    case 'ginneko_shippo': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      s = drawCards(s, playerId, 3);
      s = addLog(s, `${pName}が銀ネコのしっぽで3枚ドロー！`, playerId);
      // 2枚捨てる必要がある
      s = { ...s, waitingFor: { type: 'selectDiscardFromHand', count: 2 } };
      return s;
    }

    case 'kuroneko_shippo': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      s = drawCards(s, playerId, 2);
      s = addLog(s, `${pName}が黒ネコのしっぽで2枚ドロー！追加プレイ+1。`, playerId);
      s = { ...s, maxPlays: s.maxPlays + 1 };
      // 2枚捨てる必要がある
      s = { ...s, waitingFor: { type: 'selectDiscardFromHand', count: 2 } };
      return s;
    }

    case 'akuma_fukiya': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      const oppHand = s[opponentId].hand;
      if (oppHand.length === 0) {
        s = addLog(s, '相手の手札が0枚のため効果なし。', playerId);
        return s;
      }
      s = addLog(s, `${pName}があくまの吹き矢を使用！`, playerId);
      s = { ...s, waitingFor: { type: 'selectOpponentHandCard', opponentHand: [...oppHand] } };
      return s;
    }

    case 'majo_otodokemono': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      s = addLog(s, `${pName}が魔女のおとどけものを使用！`, playerId);
      s = { ...s, waitingFor: { type: 'declareCardName' } };
      return s;
    }

    case 'karasu_otsukai': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      if (s.graveyard.length === 0) {
        s = addLog(s, '捨て札が0枚のため効果なし。', playerId);
        return s;
      }
      s = addLog(s, `${pName}がカラスのおつかいを使用！`, playerId);
      s = { ...s, waitingFor: { type: 'selectGraveyardCard' } };
      return s;
    }

    case 'yousei_megane': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      if (s.deck.length === 0) {
        s = addLog(s, '山札が0枚のため効果なし。', playerId);
        return s;
      }
      s = addLog(s, `${pName}がようせいのメガネを使用！`, playerId);
      s = { ...s, waitingFor: { type: 'selectDeckCard' } };
      return s;
    }

    case 'hirameki_suisho': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      // 山札が0の場合の処理
      if (s.deck.length === 0 && s.graveyard.length > 0) {
        s = { ...s, deck: shuffleArray(s.graveyard), graveyard: [] };
      }
      const revealCount = Math.min(3, s.deck.length);
      if (revealCount === 0) {
        s = addLog(s, '山札が0枚のため効果なし。', playerId);
        return s;
      }
      const revealed = s.deck.slice(0, revealCount);
      const remainingDeck = s.deck.slice(revealCount);
      s = { ...s, deck: remainingDeck };
      s = addLog(s, `${pName}がひらめき水晶で${revealCount}枚公開！`, playerId);
      s = { ...s, waitingFor: { type: 'selectHiramekiCard', revealed } };
      return s;
    }

    case 'hoshifuru_sunadokei': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      const pState = { ...s[playerId] };
      pState.counterChips += 1;
      s = { ...s, [playerId]: pState };
      s = addLog(s, `${pName}がほしふる砂時計でうちけしの書を獲得！（現在${pState.counterChips}枚）`, playerId);
      return s;
    }

    case 'irekaeeru': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      // 場にバハムートが1体もいなければ使用不可（すでにチェック済みのはず）
      s = addLog(s, `${pName}がイレカエール！を使用！`, playerId);
      s = { ...s, waitingFor: { type: 'selectIrekaeTarget' } };
      return s;
    }

    case 'owakaare': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      const oppField = s[opponentId].field;
      if (oppField.length === 0) {
        s = addLog(s, '相手の場にまものがいないため効果なし。', playerId);
        return s;
      }
      if (oppField.length === 1) {
        // 自動選択
        const target = oppField[0];
        const opp = { ...s[opponentId] };
        opp.field = [];
        s = { ...s, [opponentId]: opp, graveyard: [...s.graveyard, target] };
        s = addLog(s, `${pName}がオワカーレ！で${getCardDef(target.defId).name}を除去！`, playerId);
        return s;
      }
      s = { ...s, waitingFor: { type: 'selectOwakareTarget' } };
      return s;
    }

    case 'ideyon': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      const monsters = s[playerId].hand.filter(c => getCardDef(c.defId).category === 'monster');
      if (monsters.length === 0) {
        s = addLog(s, '手札にまものカードがないため効果なし。', playerId);
        return s;
      }
      s = addLog(s, `${pName}がイデヨン！を使用！`, playerId);
      s = { ...s, waitingFor: { type: 'selectMonsterFromHand' } };
      return s;
    }

    case 'yomigaeeru': {
      s = { ...s, graveyard: [...s.graveyard, card] };
      const graveyardMonsters = s.graveyard.filter(c => getCardDef(c.defId).category === 'monster');
      if (graveyardMonsters.length === 0) {
        s = addLog(s, '捨て札にまものカードがないため効果なし。', playerId);
        return s;
      }
      s = addLog(s, `${pName}がヨミガエール！を使用！`, playerId);
      s = { ...s, waitingFor: { type: 'selectGraveyardMonster' } };
      return s;
    }

    default:
      s = addLog(s, `${def.name}の効果を処理。`, playerId);
      s = { ...s, graveyard: [...s.graveyard, card] };
      return s;
  }
}

function executeTurnStartEffects(state: GameState, playerId: PlayerId): GameState {
  let s = { ...state };
  const pState = s[playerId];
  const opponentId = opponent(playerId);
  const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';

  // reset goblin reflect
  s = { ...s, goblinReflectActive: {} };

  for (const card of pState.field) {
    if (s.winner) break;
    switch (card.defId) {
      case 'harapeko_bahamut':
        s = addLog(s, `${pName}のはらぺこバハムートが効果発動！`, playerId);
        s = dealDamage(s, opponentId, 4, true);
        break;
      case 'kodomo_bahamut':
        s = addLog(s, `${pName}のこどもバハムートが効果発動！`, playerId);
        s = dealDamage(s, opponentId, 1, false);
        break;
      case 'hanekaeshi_goblin':
        // はねかえしゴブリンはパッシブ効果（ターン開始時にアクティブにする）
        s = addLog(s, `${pName}のはねかえしゴブリンがダメージ反射準備！`, playerId);
        break;
    }
  }
  return s;
}

function canPlayCard(state: GameState, playerId: PlayerId, card: CardInstance): boolean {
  const def = getCardDef(card.defId);

  // はらぺこバハムートは直接出せない
  if (card.defId === 'harapeko_bahamut') return false;

  // プレイ回数チェック（フリーアクションは除外）
  if (!def.isFreeAction && state.playCount >= state.maxPlays) return false;

  // イレカエール: 場にバハムートが1体もいなければ使用不可
  if (card.defId === 'irekaeeru') {
    const allFields = [...state.player.field, ...state.cpu.field];
    const hasBahamut = allFields.some(c =>
      c.defId === 'kodomo_bahamut' || c.defId === 'harapeko_bahamut'
    );
    if (!hasBahamut) return false;
  }

  // オワカーレ: 相手の場にまものがいなければ使用不可
  if (card.defId === 'owakaare') {
    const opponentId = opponent(playerId);
    if (state[opponentId].field.length === 0) return false;
  }

  // こどもバハムート: 場にすでにいたら出せない
  if (card.defId === 'kodomo_bahamut') {
    const allFields = [...state.player.field, ...state.cpu.field];
    if (allFields.some(c => c.defId === 'kodomo_bahamut')) return false;
  }

  // はねかえしゴブリン: 同様
  if (card.defId === 'hanekaeshi_goblin') {
    const allFields = [...state.player.field, ...state.cpu.field];
    if (allFields.some(c => c.defId === 'hanekaeshi_goblin')) return false;
  }

  // イデヨン: 手札にまものがなければ使用不可
  if (card.defId === 'ideyon') {
    // 手札からイデヨン自身を除いたまもの
    const monsters = state[playerId].hand.filter(c =>
      c.uid !== card.uid && getCardDef(c.defId).category === 'monster'
    );
    // はらぺこバハムートは場にいなくて手札にあれば出せる
    const playableMonsters = monsters.filter(c => {
      if (c.defId === 'harapeko_bahamut') {
        const allFields = [...state.player.field, ...state.cpu.field];
        return !allFields.some(f => f.defId === 'harapeko_bahamut');
      }
      if (c.defId === 'kodomo_bahamut') {
        const allFields = [...state.player.field, ...state.cpu.field];
        return !allFields.some(f => f.defId === 'kodomo_bahamut');
      }
      if (c.defId === 'hanekaeshi_goblin') {
        const allFields = [...state.player.field, ...state.cpu.field];
        return !allFields.some(f => f.defId === 'hanekaeshi_goblin');
      }
      return true;
    });
    if (playableMonsters.length === 0) return false;
  }

  // ヨミガエール: 捨て札にまものがなければ使用不可
  if (card.defId === 'yomigaeeru') {
    const graveyardMonsters = state.graveyard.filter(c => getCardDef(c.defId).category === 'monster');
    // 場にすでにいるまものは除外
    const playable = graveyardMonsters.filter(c => {
      if (c.defId === 'harapeko_bahamut') {
        const allFields = [...state.player.field, ...state.cpu.field];
        return !allFields.some(f => f.defId === 'harapeko_bahamut');
      }
      if (c.defId === 'kodomo_bahamut') {
        const allFields = [...state.player.field, ...state.cpu.field];
        return !allFields.some(f => f.defId === 'kodomo_bahamut');
      }
      if (c.defId === 'hanekaeshi_goblin') {
        const allFields = [...state.player.field, ...state.cpu.field];
        return !allFields.some(f => f.defId === 'hanekaeshi_goblin');
      }
      return true;
    });
    if (playable.length === 0) return false;
  }

  // カラスのおつかい: 捨て札がなければ使用不可
  if (card.defId === 'karasu_otsukai') {
    if (state.graveyard.length === 0) return false;
  }

  return true;
}

function createInitialState(): GameState {
  return {
    phase: 'setup',
    currentPlayer: 'player',
    turnNumber: 0,
    isFirstTurn: true,
    player: { life: 4, counterChips: 2, hand: [], field: [] },
    cpu: { life: 4, counterChips: 2, hand: [], field: [] },
    deck: [],
    graveyard: [],
    playCount: 0,
    maxPlays: 2,
    hasDrawn: false,
    waitingFor: null,
    log: [],
    winner: null,
    difficulty: 2,
    goblinReflectActive: {},
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      resetUidCounter();
      let deck = shuffleArray(createDeck());
      const playerHand = deck.slice(0, 5);
      deck = deck.slice(5);
      const cpuHand = deck.slice(0, 5);
      deck = deck.slice(5);

      // ランダムで先攻決定
      const firstPlayer: PlayerId = Math.random() < 0.5 ? 'player' : 'cpu';

      let s: GameState = {
        ...createInitialState(),
        phase: 'turnStart',
        currentPlayer: firstPlayer,
        turnNumber: 1,
        isFirstTurn: true,
        player: { life: 4, counterChips: 2, hand: playerHand, field: [] },
        cpu: { life: 4, counterChips: 2, hand: cpuHand, field: [] },
        deck,
        graveyard: [],
        playCount: 0,
        maxPlays: 1, // 先攻最初は1枚
        hasDrawn: false,
        waitingFor: null,
        log: [],
        winner: null,
        difficulty: action.difficulty,
        goblinReflectActive: {},
      };

      const firstName = firstPlayer === 'player' ? 'プレイヤー' : 'CPU';
      s = addLog(s, `ゲーム開始！${firstName}が先攻です。`);
      s = addLog(s, `難易度: ${action.difficulty}`);

      // ターン開始効果
      s = executeTurnStartEffects(s, firstPlayer);
      if (s.winner) return s;

      // 先攻最初はドローなし → プレイフェーズへ
      s = { ...s, phase: 'play', hasDrawn: true };
      s = addLog(s, `--- ターン${s.turnNumber}: ${firstName}のターン ---`, firstPlayer);
      s = addLog(s, '先攻1ターン目はドローなし。');

      if (firstPlayer === 'cpu') {
        s = { ...s, waitingFor: { type: 'cpuThinking' } };
      }

      return s;
    }

    case 'PLAY_CARD': {
      const playerId = state.currentPlayer;
      const playerState = state[playerId];
      const cardIndex = playerState.hand.findIndex(c => c.uid === action.cardUid);
      if (cardIndex === -1) return state;

      const card = playerState.hand[cardIndex];
      if (!canPlayCard(state, playerId, card)) return state;

      const def = getCardDef(card.defId);
      const newHand = [...playerState.hand];
      newHand.splice(cardIndex, 1);

      let s: GameState = {
        ...state,
        [playerId]: { ...playerState, hand: newHand },
        playCount: def.isFreeAction ? state.playCount : state.playCount + 1,
      };

      const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';
      s = addLog(s, `${pName}が${def.name}をプレイ！`, playerId);

      // うちけしチェック（相手がうちけしの書を持っているか）
      const opponentId = opponent(playerId);
      if (s[opponentId].counterChips > 0 && !def.isFreeAction) {
        // うちけし確認待ち
        s = {
          ...s, waitingFor: {
            type: 'counter',
            playerId: opponentId,
            card,
            onResolve: 'play',
          }
        };
        return s;
      }

      // うちけしなし → 効果発動
      s = resolveCardEffect(s, playerId, card);
      return s;
    }

    case 'RESOLVE_COUNTER': {
      if (!state.waitingFor || state.waitingFor.type !== 'counter') return state;
      const { playerId: counterer, card } = state.waitingFor;

      if (action.useCounter) {
        // うちけし使用
        const counterState = { ...state[counterer] };
        counterState.counterChips -= 1;
        let s: GameState = { ...state, [counterer]: counterState, waitingFor: null };
        const cName = counterer === 'player' ? 'プレイヤー' : 'CPU';
        s = addLog(s, `${cName}がうちけしの書を使用！${getCardDef(card.defId).name}を無効化！`, counterer);

        // うちけし返しチェック
        const originalPlayer = opponent(counterer);
        if (s[originalPlayer].counterChips >= 2) {
          s = {
            ...s, waitingFor: {
              type: 'counterCounter',
              playerId: originalPlayer,
              originalCard: card,
              onResolve: 'counterCounter',
            }
          };
          return s;
        }

        // 無効化確定
        s = { ...s, graveyard: [...s.graveyard, card] };
        s = addLog(s, `${getCardDef(card.defId).name}は無効化された。`);
        return s;
      } else {
        // うちけしを使わない → 効果発動
        let s: GameState = { ...state, waitingFor: null };
        const currentPlayer = state.currentPlayer;
        s = resolveCardEffect(s, currentPlayer, card);
        return s;
      }
    }

    case 'RESOLVE_COUNTER_COUNTER': {
      if (!state.waitingFor || state.waitingFor.type !== 'counterCounter') return state;
      const { playerId: originalPlayer, originalCard } = state.waitingFor;

      if (action.useCounterCounter) {
        const pState = { ...state[originalPlayer] };
        pState.counterChips -= 2;
        let s: GameState = { ...state, [originalPlayer]: pState, waitingFor: null };
        const pName = originalPlayer === 'player' ? 'プレイヤー' : 'CPU';
        s = addLog(s, `${pName}がうちけし返し！（うちけしの書2枚使用）`, originalPlayer);
        // 効果発動
        s = resolveCardEffect(s, originalPlayer, originalCard);
        return s;
      } else {
        // うちけし返しを使わない → 無効化確定
        let s: GameState = { ...state, waitingFor: null };
        s = { ...s, graveyard: [...s.graveyard, originalCard] };
        s = addLog(s, `${getCardDef(originalCard.defId).name}は無効化された。`);
        return s;
      }
    }

    case 'SELECT_DISCARD': {
      // クリンナップ時の手札捨て
      const playerId = state.currentPlayer;
      const pState = { ...state[playerId] };
      const discarded: CardInstance[] = [];
      const newHand = pState.hand.filter(c => {
        if (action.cardUids.includes(c.uid)) {
          discarded.push(c);
          return false;
        }
        return true;
      });
      pState.hand = newHand;
      let s: GameState = { ...state, [playerId]: pState, graveyard: [...state.graveyard, ...discarded], waitingFor: null };
      s = addLog(s, `${discarded.length}枚捨てました。`, playerId);
      return s;
    }

    case 'SELECT_OPPONENT_HAND_CARD': {
      // あくまの吹き矢
      const playerId = state.currentPlayer;
      const opponentId = opponent(playerId);
      const opp = { ...state[opponentId] };
      const idx = opp.hand.findIndex(c => c.uid === action.cardUid);
      if (idx === -1) return state;
      const discarded = opp.hand[idx];
      opp.hand = [...opp.hand];
      opp.hand.splice(idx, 1);
      let s: GameState = { ...state, [opponentId]: opp, graveyard: [...state.graveyard, discarded], waitingFor: null };
      s = addLog(s, `${getCardDef(discarded.defId).name}を捨てさせた！`, playerId);
      return s;
    }

    case 'SELECT_GRAVEYARD_CARD': {
      // カラスのおつかい
      const playerId = state.currentPlayer;
      const idx = state.graveyard.findIndex(c => c.uid === action.cardUid);
      if (idx === -1) return state;
      const card = state.graveyard[idx];
      const newGraveyard = [...state.graveyard];
      newGraveyard.splice(idx, 1);
      const pState = { ...state[playerId] };
      pState.hand = [...pState.hand, card];
      let s: GameState = { ...state, [playerId]: pState, graveyard: newGraveyard, waitingFor: null };
      s = addLog(s, `捨て札から${getCardDef(card.defId).name}を回収！`, playerId);
      return s;
    }

    case 'SELECT_DECK_CARD': {
      // ようせいのメガネ
      const playerId = state.currentPlayer;
      const idx = state.deck.findIndex(c => c.uid === action.cardUid);
      if (idx === -1) return state;
      const card = state.deck[idx];
      const newDeck = [...state.deck];
      newDeck.splice(idx, 1);
      const pState = { ...state[playerId] };
      pState.hand = [...pState.hand, card];
      let s: GameState = { ...state, [playerId]: pState, deck: shuffleArray(newDeck), waitingFor: null };
      s = addLog(s, `山札から${getCardDef(card.defId).name}を手札に加えた！`, playerId);
      return s;
    }

    case 'SELECT_HIRAMEKI_CARD': {
      // ひらめき水晶 - カード選択
      if (!state.waitingFor || state.waitingFor.type !== 'selectHiramekiCard') return state;
      const { revealed } = state.waitingFor;
      const selected = revealed.find(c => c.uid === action.cardUid);
      if (!selected) return state;
      const remaining = revealed.filter(c => c.uid !== action.cardUid);

      const playerId = state.currentPlayer;
      const pState = { ...state[playerId] };
      pState.hand = [...pState.hand, selected];

      let s: GameState = {
        ...state,
        [playerId]: pState,
        waitingFor: { type: 'selectHiramekiReturn', remaining, selected },
      };
      s = addLog(s, `${getCardDef(selected.defId).name}を手札に加えた！`, playerId);
      return s;
    }

    case 'SELECT_HIRAMEKI_RETURN': {
      // ひらめき水晶 - 残りカードを戻す
      if (!state.waitingFor || state.waitingFor.type !== 'selectHiramekiReturn') return state;
      const { remaining } = state.waitingFor;
      let newDeck = [...state.deck];

      action.positions.forEach((pos, i) => {
        if (remaining[i]) {
          if (pos === 'top') {
            newDeck = [remaining[i], ...newDeck];
          } else {
            newDeck = [...newDeck, remaining[i]];
          }
        }
      });

      let s: GameState = { ...state, deck: newDeck, waitingFor: null };
      s = addLog(s, '残りのカードを山札に戻した。', state.currentPlayer);
      return s;
    }

    case 'DECLARE_CARD_NAME': {
      // 魔女のおとどけもの
      const playerId = state.currentPlayer;
      const opponentId = opponent(playerId);
      const opp = { ...state[opponentId] };
      const pState = { ...state[playerId] };
      const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';

      const idx = opp.hand.findIndex(c => getCardDef(c.defId).name === action.cardName);
      let s: GameState;
      if (idx !== -1) {
        const stolen = opp.hand[idx];
        opp.hand = [...opp.hand];
        opp.hand.splice(idx, 1);
        pState.hand = [...pState.hand, stolen];
        s = { ...state, [playerId]: pState, [opponentId]: opp, waitingFor: null };
        s = addLog(s, `${pName}が「${action.cardName}」を宣言→ 命中！奪い取った！`, playerId);
      } else {
        s = { ...state, waitingFor: null };
        s = addLog(s, `${pName}が「${action.cardName}」を宣言→ ハズレ！`, playerId);
      }
      return s;
    }

    case 'SELECT_MONSTER_FROM_HAND': {
      // イデヨン
      const playerId = state.currentPlayer;
      const pState = { ...state[playerId] };
      const idx = pState.hand.findIndex(c => c.uid === action.cardUid);
      if (idx === -1) return state;
      const monster = pState.hand[idx];
      pState.hand = [...pState.hand];
      pState.hand.splice(idx, 1);
      pState.field = [...pState.field, monster];
      let s: GameState = { ...state, [playerId]: pState, waitingFor: null };
      const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';
      s = addLog(s, `${pName}がイデヨン！で${getCardDef(monster.defId).name}を場に出した！`, playerId);
      return s;
    }

    case 'SELECT_GRAVEYARD_MONSTER': {
      // ヨミガエール
      const playerId = state.currentPlayer;
      const idx = state.graveyard.findIndex(c => c.uid === action.cardUid);
      if (idx === -1) return state;
      const monster = state.graveyard[idx];
      const newGraveyard = [...state.graveyard];
      newGraveyard.splice(idx, 1);
      const pState = { ...state[playerId] };
      pState.field = [...pState.field, monster];
      let s: GameState = { ...state, [playerId]: pState, graveyard: newGraveyard, waitingFor: null };
      const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';
      s = addLog(s, `${pName}がヨミガエール！で${getCardDef(monster.defId).name}を蘇生！`, playerId);
      return s;
    }

    case 'SELECT_IREKAE_TARGET': {
      // イレカエール
      const playerId = state.currentPlayer;
      const opponentId = opponent(playerId);
      const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';

      let s = { ...state };
      const pField = [...s[playerId].field];
      const oField = [...s[opponentId].field];

      switch (action.target.action) {
        case 'evolve': {
          // 自分のこどもバハムート → はらぺこバハムート
          const idx = pField.findIndex(c => c.defId === 'kodomo_bahamut');
          if (idx !== -1) {
            const old = pField[idx];
            pField[idx] = createCardInstance('harapeko_bahamut');
            s = { ...s, graveyard: [...s.graveyard, old] };
            s = addLog(s, `${pName}のこどもバハムートがはらぺこバハムートに進化！`, playerId);
          }
          break;
        }
        case 'weaken': {
          // 相手のはらぺこバハムート → こどもバハムート
          const idx = oField.findIndex(c => c.defId === 'harapeko_bahamut');
          if (idx !== -1) {
            const old = oField[idx];
            oField[idx] = createCardInstance('kodomo_bahamut');
            s = { ...s, graveyard: [...s.graveyard, old] };
            s = addLog(s, `相手のはらぺこバハムートがこどもバハムートに弱体化！`, playerId);
          }
          break;
        }
        case 'swap': {
          // 入れ替え
          const pIdx = pField.findIndex(c => c.defId === 'kodomo_bahamut');
          const oIdx = oField.findIndex(c => c.defId === 'harapeko_bahamut');
          if (pIdx !== -1 && oIdx !== -1) {
            const pOld = pField[pIdx];
            const oOld = oField[oIdx];
            pField[pIdx] = createCardInstance('harapeko_bahamut');
            oField[oIdx] = createCardInstance('kodomo_bahamut');
            s = { ...s, graveyard: [...s.graveyard, pOld, oOld] };
            s = addLog(s, `バハムートを入れ替えた！`, playerId);
          }
          break;
        }
      }

      const pState = { ...s[playerId], field: pField };
      const oState = { ...s[opponentId], field: oField };
      s = { ...s, [playerId]: pState, [opponentId]: oState, waitingFor: null };
      return s;
    }

    case 'SELECT_OWAKARE_TARGET': {
      const playerId = state.currentPlayer;
      const opponentId = opponent(playerId);
      const opp = { ...state[opponentId] };
      const idx = opp.field.findIndex(c => c.uid === action.cardUid);
      if (idx === -1) return state;
      const removed = opp.field[idx];
      opp.field = [...opp.field];
      opp.field.splice(idx, 1);
      let s: GameState = { ...state, [opponentId]: opp, graveyard: [...state.graveyard, removed], waitingFor: null };
      const pName = playerId === 'player' ? 'プレイヤー' : 'CPU';
      s = addLog(s, `${pName}がオワカーレ！で${getCardDef(removed.defId).name}を除去！`, playerId);
      return s;
    }

    case 'END_TURN': {
      let s = { ...state };
      const playerId = state.currentPlayer;
      const pState = { ...s[playerId] };

      // クリンナップ：手札5枚超過チェック
      if (pState.hand.length > 5) {
        s = { ...s, waitingFor: { type: 'selectDiscard', count: pState.hand.length - 5 } };
        return s;
      }

      // ターン切り替え
      const nextPlayer = opponent(playerId);
      const nextTurn = nextPlayer === (s.turnNumber === 1 && s.isFirstTurn ? opponent(s.currentPlayer) : 'player')
        ? state.turnNumber + 1
        : state.turnNumber;

      const isNewFirstTurn = false;

      s = {
        ...s,
        currentPlayer: nextPlayer,
        turnNumber: s.turnNumber + (nextPlayer === 'player' ? 1 : 0),
        isFirstTurn: isNewFirstTurn,
        phase: 'turnStart',
        playCount: 0,
        maxPlays: 2,
        hasDrawn: false,
        waitingFor: null,
      };

      const nextName = nextPlayer === 'player' ? 'プレイヤー' : 'CPU';
      s = addLog(s, `--- ターン${s.turnNumber}: ${nextName}のターン ---`, nextPlayer);

      // ターン開始効果
      s = executeTurnStartEffects(s, nextPlayer);
      if (s.winner) return s;

      // ドロー
      s = drawCards(s, nextPlayer, 1);
      s = addLog(s, `${nextName}が1枚ドロー。`, nextPlayer);
      s = { ...s, phase: 'play', hasDrawn: true };

      if (nextPlayer === 'cpu') {
        s = { ...s, waitingFor: { type: 'cpuThinking' } };
      }

      return s;
    }

    case 'ADD_LOG': {
      return addLog(state, action.message, action.player);
    }

    case 'SET_WAITING': {
      return { ...state, waitingFor: action.waitingFor };
    }

    default:
      return state;
  }
}

export { gameReducer, createInitialState, canPlayCard, opponent, getCardDef };

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  return { state, dispatch };
}
