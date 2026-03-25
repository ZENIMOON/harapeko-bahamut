export type CardCategory = 'monster' | 'spell' | 'action';

export interface CardDef {
  id: string;
  name: string;
  category: CardCategory;
  description: string;
  isFreeAction?: boolean; // ほしふる砂時計用
}

export interface CardInstance {
  uid: string; // ユニークID（同名カードの区別用）
  defId: string;
}

export type PlayerId = 'player' | 'cpu';

export interface PlayerState {
  life: number;
  counterChips: number; // うちけしの書チップ
  hand: CardInstance[];
  field: CardInstance[]; // 場のまものカード
}

export type Phase =
  | 'setup'
  | 'turnStart'
  | 'draw'
  | 'play'
  | 'cleanup'
  | 'gameOver';

export type WaitingFor =
  | null
  | { type: 'counter'; playerId: PlayerId; card: CardInstance; onResolve: 'play' }
  | { type: 'counterCounter'; playerId: PlayerId; originalCard: CardInstance; onResolve: 'counterCounter' }
  | { type: 'selectDiscard'; count: number }
  | { type: 'selectDiscardFromHand'; count: number; drawnCards?: CardInstance[] }
  | { type: 'selectOpponentHandCard'; opponentHand: CardInstance[] }
  | { type: 'selectGraveyardCard' }
  | { type: 'selectDeckCard' }
  | { type: 'selectHiramekiCard'; revealed: CardInstance[] }
  | { type: 'selectHiramekiReturn'; remaining: CardInstance[]; selected: CardInstance }
  | { type: 'declareCardName' }
  | { type: 'selectMonsterFromHand' }
  | { type: 'selectGraveyardMonster' }
  | { type: 'selectIrekaeTarget' }
  | { type: 'selectOwakareTarget' }
  | { type: 'cpuThinking' };

export interface LogEntry {
  timestamp: number;
  message: string;
  player?: PlayerId;
}

export type AIDifficulty = 1 | 2 | 3;

export interface GameState {
  phase: Phase;
  currentPlayer: PlayerId;
  turnNumber: number;
  isFirstTurn: boolean; // 先攻の最初のターン
  player: PlayerState;
  cpu: PlayerState;
  deck: CardInstance[];
  graveyard: CardInstance[];
  playCount: number; // このターンのプレイ回数
  maxPlays: number; // このターンの最大プレイ回数
  hasDrawn: boolean;
  waitingFor: WaitingFor;
  log: LogEntry[];
  winner: PlayerId | null;
  difficulty: AIDifficulty;
  goblinReflectActive: { [key in PlayerId]?: boolean };
}

export type GameAction =
  | { type: 'START_GAME'; difficulty: AIDifficulty }
  | { type: 'NEXT_PHASE' }
  | { type: 'DRAW_CARD' }
  | { type: 'PLAY_CARD'; cardUid: string }
  | { type: 'RESOLVE_COUNTER'; useCounter: boolean }
  | { type: 'RESOLVE_COUNTER_COUNTER'; useCounterCounter: boolean }
  | { type: 'SELECT_DISCARD'; cardUids: string[] }
  | { type: 'SELECT_OPPONENT_HAND_CARD'; cardUid: string }
  | { type: 'SELECT_GRAVEYARD_CARD'; cardUid: string }
  | { type: 'SELECT_DECK_CARD'; cardUid: string }
  | { type: 'SELECT_HIRAMEKI_CARD'; cardUid: string }
  | { type: 'SELECT_HIRAMEKI_RETURN'; positions: ('top' | 'bottom')[] }
  | { type: 'DECLARE_CARD_NAME'; cardName: string }
  | { type: 'SELECT_MONSTER_FROM_HAND'; cardUid: string }
  | { type: 'SELECT_GRAVEYARD_MONSTER'; cardUid: string }
  | { type: 'SELECT_IREKAE_TARGET'; target: IrekaeTarget }
  | { type: 'SELECT_OWAKARE_TARGET'; cardUid: string }
  | { type: 'END_TURN' }
  | { type: 'ADD_LOG'; message: string; player?: PlayerId }
  | { type: 'CPU_ACTION' }
  | { type: 'SET_WAITING'; waitingFor: WaitingFor };

export interface IrekaeTarget {
  action: 'evolve' | 'weaken' | 'swap';
  // evolve: 自分の場のこどもバハムート→はらぺこバハムート
  // weaken: 相手の場のはらぺこバハムート→こどもバハムート
  // swap: 自分こどもバハムート ⇄ 相手はらぺこバハムート (or vice versa)
}
