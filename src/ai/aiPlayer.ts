import {
  GameState, GameAction, PlayerId, AIDifficulty,
  CardInstance, IrekaeTarget,
} from '../types/game';
import { getCardDef, CARD_DEFS } from '../data/cards';
import { canPlayCard, opponent } from '../hooks/useGame';

// AI decision-making for all 3 difficulties

interface AIDecision {
  actions: GameAction[];
}

export function getAICounterDecision(
  state: GameState,
  cardBeingPlayed: CardInstance,
  difficulty: AIDifficulty
): boolean {
  const def = getCardDef(cardBeingPlayed.defId);
  const cpuLife = state.cpu.life;
  const cpuChips = state.cpu.counterChips;

  if (cpuChips <= 0) return false;

  switch (difficulty) {
    case 1:
      return Math.random() < 0.3;

    case 2: {
      // はらぺこバハムート関連を優先的にうちけし
      if (cardBeingPlayed.defId === 'ideyon' || cardBeingPlayed.defId === 'yomigaeeru') {
        // 手札/捨て札にはらぺこバハムートがあるか推測
        return true;
      }
      if (cardBeingPlayed.defId === 'irekaeeru') return true;
      if (cardBeingPlayed.defId === 'soratobu_knife' && cpuLife <= 2) return true;
      if (cardBeingPlayed.defId === 'akuma_fukiya') return Math.random() < 0.5;
      if (cardBeingPlayed.defId === 'owakaare' && state.cpu.field.length > 0) {
        const hasImportant = state.cpu.field.some(c =>
          c.defId === 'harapeko_bahamut' || c.defId === 'hanekaeshi_goblin'
        );
        if (hasImportant) return true;
      }
      return false;
    }

    case 3: {
      // 上級: 温存戦略
      // はらぺこバハムート召喚系は必ずうちけし
      if (cardBeingPlayed.defId === 'ideyon' || cardBeingPlayed.defId === 'yomigaeeru') {
        return true;
      }
      if (cardBeingPlayed.defId === 'irekaeeru') {
        // 自分の場にはらぺこバハムートがいて相手にこどもバハムートがいる場合
        const cpuHasBahamut = state.cpu.field.some(c => c.defId === 'harapeko_bahamut');
        if (cpuHasBahamut) return true;
        return cpuChips > 1;
      }
      // ライフ2以下でナイフ → 必ずうちけし
      if (cardBeingPlayed.defId === 'soratobu_knife' && cpuLife <= 2) return true;
      // オワカーレで重要まもの除去 → うちけし
      if (cardBeingPlayed.defId === 'owakaare') {
        const hasHarapeko = state.cpu.field.some(c => c.defId === 'harapeko_bahamut');
        if (hasHarapeko) return true;
      }
      // うちけしが3枚以上なら積極的に使う
      if (cpuChips >= 3) {
        if (['akuma_fukiya', 'majo_otodokemono'].includes(cardBeingPlayed.defId)) return true;
      }
      // それ以外は温存
      return false;
    }
  }
}

export function getAICounterCounterDecision(
  state: GameState,
  originalCard: CardInstance,
  difficulty: AIDifficulty
): boolean {
  const cpuChips = state.cpu.counterChips;
  if (cpuChips < 2) return false;

  switch (difficulty) {
    case 1: return Math.random() < 0.2;
    case 2: {
      // 重要カードなら打ち消し返す
      if (['ideyon', 'yomigaeeru', 'irekaeeru', 'soratobu_knife'].includes(originalCard.defId)) {
        return cpuChips >= 3;
      }
      return false;
    }
    case 3: {
      // 本当に重要なカードのみ
      if (['ideyon', 'yomigaeeru'].includes(originalCard.defId)) return true;
      if (originalCard.defId === 'soratobu_knife' && state.cpu.life <= 2) return true;
      return false;
    }
  }
}

function scoreCard(state: GameState, card: CardInstance, difficulty: AIDifficulty): number {
  const def = getCardDef(card.defId);
  const cpuLife = state.cpu.life;
  const playerLife = state.player.life;
  let score = 0;

  switch (card.defId) {
    case 'soratobu_knife':
      score = 30 + (playerLife <= 2 ? 50 : 0);
      break;
    case 'hoshifuru_sunadokei':
      score = 25;
      break;
    case 'kodomo_bahamut': {
      const allFields = [...state.player.field, ...state.cpu.field];
      if (allFields.some(c => c.defId === 'kodomo_bahamut')) return -1;
      score = 35;
      break;
    }
    case 'hanekaeshi_goblin': {
      const allFields = [...state.player.field, ...state.cpu.field];
      if (allFields.some(c => c.defId === 'hanekaeshi_goblin')) return -1;
      score = cpuLife <= 2 ? 45 : 20;
      break;
    }
    case 'ideyon': {
      const monsters = state.cpu.hand.filter(c =>
        c.uid !== card.uid && getCardDef(c.defId).category === 'monster'
      );
      const hasHarapeko = monsters.some(c => c.defId === 'harapeko_bahamut');
      if (hasHarapeko) {
        const allFields = [...state.player.field, ...state.cpu.field];
        if (!allFields.some(f => f.defId === 'harapeko_bahamut')) {
          score = 90;
          break;
        }
      }
      score = monsters.length > 0 ? 30 : -1;
      break;
    }
    case 'yomigaeeru': {
      const graveyardMonsters = state.graveyard.filter(c => getCardDef(c.defId).category === 'monster');
      const hasHarapeko = graveyardMonsters.some(c => c.defId === 'harapeko_bahamut');
      if (hasHarapeko) score = 85;
      else if (graveyardMonsters.length > 0) score = 30;
      else score = -1;
      break;
    }
    case 'irekaeeru': {
      const cpuKodomo = state.cpu.field.some(c => c.defId === 'kodomo_bahamut');
      const playerHarapeko = state.player.field.some(c => c.defId === 'harapeko_bahamut');
      if (cpuKodomo) score = 80; // 進化
      if (playerHarapeko) score = Math.max(score, 70); // 弱体化
      if (score === 0) score = -1;
      break;
    }
    case 'owakaare': {
      const playerField = state.player.field;
      if (playerField.some(c => c.defId === 'harapeko_bahamut')) score = 85;
      else if (playerField.some(c => c.defId === 'hanekaeshi_goblin')) score = 40;
      else if (playerField.length > 0) score = 25;
      else score = -1;
      break;
    }
    case 'ginneko_shippo':
      score = 20;
      break;
    case 'kuroneko_shippo':
      score = 22;
      break;
    case 'akuma_fukiya':
      score = 15;
      break;
    case 'majo_otodokemono':
      score = difficulty >= 2 ? 18 : 10;
      break;
    case 'karasu_otsukai':
      score = state.graveyard.length > 0 ? 20 : -1;
      break;
    case 'yousei_megane':
      score = 25;
      break;
    case 'hirameki_suisho':
      score = 22;
      break;
    default:
      score = 10;
  }

  // Difficulty 3 adjustments
  if (difficulty === 3) {
    // うちけし誘導: 先に弱いカードを出してうちけしを消費させる
    if (state.player.counterChips > 0) {
      if (['ginneko_shippo', 'kuroneko_shippo', 'hoshifuru_sunadokei'].includes(card.defId)) {
        score += 15; // 先に出す
      }
      if (['ideyon', 'yomigaeeru'].includes(card.defId)) {
        score -= 10; // 後に出す
      }
    }
    // 勝ち筋判断
    if (playerLife <= 2 && card.defId === 'soratobu_knife') score += 30;
    if (playerLife <= 1) {
      // こどもバハムートが場にあれば次ターンで勝てる
      if (state.cpu.field.some(c => c.defId === 'kodomo_bahamut')) score -= 5;
    }
  }

  return score;
}

export function getAIPlayActions(state: GameState): GameAction[] {
  const actions: GameAction[] = [];
  const difficulty = state.difficulty;

  // Simulate plays
  let simulatedState = { ...state };
  let playsRemaining = simulatedState.maxPlays - simulatedState.playCount;

  // Sort cards by score
  const playableCards = state.cpu.hand
    .filter(c => canPlayCard(simulatedState, 'cpu', c))
    .map(c => ({ card: c, score: scoreCard(simulatedState, c, difficulty) }))
    .filter(c => c.score >= 0)
    .sort((a, b) => b.score - a.score);

  // ほしふる砂時計を先にプレイ (フリーアクション)
  const sandTimers = playableCards.filter(c => c.card.defId === 'hoshifuru_sunadokei');
  for (const st of sandTimers) {
    actions.push({ type: 'PLAY_CARD', cardUid: st.card.uid });
  }

  // 通常カード
  const normalCards = playableCards.filter(c => c.card.defId !== 'hoshifuru_sunadokei');
  let played = 0;
  for (const c of normalCards) {
    if (played >= playsRemaining) break;
    actions.push({ type: 'PLAY_CARD', cardUid: c.card.uid });
    played++;
  }

  return actions;
}

export function getAIDeclareCardName(state: GameState): string {
  const difficulty = state.difficulty;
  const playerHandCount = state.player.hand.length;

  if (difficulty === 1) {
    // ランダムにカード名を選ぶ
    const idx = Math.floor(Math.random() * CARD_DEFS.length);
    return CARD_DEFS[idx].name;
  }

  // 難易度2-3: 捨て札と場にないカードを推測
  const knownCards = new Set<string>();
  // 場のカード
  [...state.player.field, ...state.cpu.field].forEach(c => knownCards.add(c.defId));
  // 捨て札
  state.graveyard.forEach(c => knownCards.add(c.defId));
  // CPUの手札
  state.cpu.hand.forEach(c => knownCards.add(c.defId));

  // 相手が持っている可能性が高いカード（まだ見えてないもの）
  const candidates = CARD_DEFS.filter(d => !knownCards.has(d.id));

  if (difficulty === 3) {
    // 強いカード優先
    const priority = ['harapeko_bahamut', 'ideyon', 'yomigaeeru', 'irekaeeru', 'soratobu_knife'];
    for (const id of priority) {
      if (candidates.some(c => c.id === id)) {
        return getCardDef(id).name;
      }
    }
  }

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)].name;
  }
  return CARD_DEFS[Math.floor(Math.random() * CARD_DEFS.length)].name;
}

export function getAIDiscardChoice(state: GameState, count: number): string[] {
  const hand = [...state.cpu.hand];
  // 一番スコアの低いカードを捨てる
  const scored = hand.map(c => ({
    card: c,
    score: scoreCard(state, c, state.difficulty),
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, count).map(s => s.card.uid);
}

export function getAIOpponentHandCardChoice(state: GameState, opponentHand: CardInstance[]): string {
  const difficulty = state.difficulty;
  if (difficulty === 1) {
    return opponentHand[Math.floor(Math.random() * opponentHand.length)].uid;
  }

  // 強いカードを捨てさせる
  const priority = ['harapeko_bahamut', 'ideyon', 'yomigaeeru', 'irekaeeru', 'soratobu_knife', 'owakaare'];
  for (const id of priority) {
    const c = opponentHand.find(card => card.defId === id);
    if (c) return c.uid;
  }
  return opponentHand[0].uid;
}

export function getAIGraveyardChoice(state: GameState): string {
  const priority = ['harapeko_bahamut', 'soratobu_knife', 'ideyon', 'yomigaeeru', 'irekaeeru'];
  for (const id of priority) {
    const c = state.graveyard.find(card => card.defId === id);
    if (c) return c.uid;
  }
  return state.graveyard[state.graveyard.length - 1].uid;
}

export function getAIGraveyardMonsterChoice(state: GameState): string {
  const monsters = state.graveyard.filter(c => getCardDef(c.defId).category === 'monster');
  // はらぺこバハムート優先
  const harapeko = monsters.find(c => c.defId === 'harapeko_bahamut');
  if (harapeko) {
    const allFields = [...state.player.field, ...state.cpu.field];
    if (!allFields.some(f => f.defId === 'harapeko_bahamut')) return harapeko.uid;
  }
  return monsters[0].uid;
}

export function getAIMonsterFromHandChoice(state: GameState): string {
  const monsters = state.cpu.hand.filter(c => getCardDef(c.defId).category === 'monster');
  const harapeko = monsters.find(c => c.defId === 'harapeko_bahamut');
  if (harapeko) {
    const allFields = [...state.player.field, ...state.cpu.field];
    if (!allFields.some(f => f.defId === 'harapeko_bahamut')) return harapeko.uid;
  }
  // こどもバハムート次点
  const kodomo = monsters.find(c => c.defId === 'kodomo_bahamut');
  if (kodomo) return kodomo.uid;
  return monsters[0].uid;
}

export function getAIDeckCardChoice(state: GameState): string {
  // 強いカードを選ぶ
  const priority = ['harapeko_bahamut', 'ideyon', 'soratobu_knife', 'yomigaeeru', 'irekaeeru'];
  for (const id of priority) {
    const c = state.deck.find(card => card.defId === id);
    if (c) return c.uid;
  }
  return state.deck[0].uid;
}

export function getAIHiramekiChoice(state: GameState, revealed: CardInstance[]): string {
  const scored = revealed.map(c => ({
    card: c,
    score: scoreCard(state, c, state.difficulty),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].card.uid;
}

export function getAIHiramekiReturnPositions(remaining: CardInstance[]): ('top' | 'bottom')[] {
  // 弱いカードは下に
  return remaining.map(() => Math.random() < 0.5 ? 'top' : 'bottom');
}

export function getAIIrekaeTarget(state: GameState): IrekaeTarget {
  const cpuField = state.cpu.field;
  const playerField = state.player.field;

  // 自分のこどもバハムートを進化させる
  const cpuKodomo = cpuField.some(c => c.defId === 'kodomo_bahamut');
  const allHarapeko = [...cpuField, ...playerField].some(c => c.defId === 'harapeko_bahamut');

  if (cpuKodomo && !allHarapeko) {
    return { action: 'evolve' };
  }

  // 相手のはらぺこバハムートを弱体化
  const playerHarapeko = playerField.some(c => c.defId === 'harapeko_bahamut');
  if (playerHarapeko) {
    if (cpuKodomo) return { action: 'swap' };
    return { action: 'weaken' };
  }

  // デフォルト: 進化を試みる
  if (cpuKodomo) return { action: 'evolve' };

  return { action: 'evolve' }; // フォールバック
}

export function getAIOwakareTarget(state: GameState): string {
  const playerField = state.player.field;
  // はらぺこバハムート優先
  const harapeko = playerField.find(c => c.defId === 'harapeko_bahamut');
  if (harapeko) return harapeko.uid;
  const goblin = playerField.find(c => c.defId === 'hanekaeshi_goblin');
  if (goblin) return goblin.uid;
  return playerField[0].uid;
}
