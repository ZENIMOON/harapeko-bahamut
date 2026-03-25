import { CardDef, CardInstance } from '../types/game';

export const CARD_DEFS: CardDef[] = [
  // まものカード（黄色背景・3枚）
  {
    id: 'harapeko_bahamut',
    name: 'はらぺこバハムート',
    category: 'monster',
    description: 'ターン開始時、相手に4ダメージ。イデヨン/ヨミガエール/イレカエールでのみ場に出せる。',
  },
  {
    id: 'kodomo_bahamut',
    name: 'こどもバハムート',
    category: 'monster',
    description: 'ターン開始時、相手に1ダメージ。手札から直接場に出せる。',
  },
  {
    id: 'hanekaeshi_goblin',
    name: 'はねかえしゴブリン',
    category: 'monster',
    description: '場にいる間、相手からのダメージを反射（はらぺこバハムート除く）。',
  },

  // 呪文カード（水色背景・4枚）
  {
    id: 'soratobu_knife',
    name: 'そらとぶナイフ',
    category: 'spell',
    description: '相手に2ダメージ。',
  },
  {
    id: 'ginneko_shippo',
    name: '銀ネコのしっぽ',
    category: 'spell',
    description: '山札から3枚引き、手札から2枚捨てる。',
  },
  {
    id: 'kuroneko_shippo',
    name: '黒ネコのしっぽ',
    category: 'spell',
    description: '山札から2枚引き、手札から2枚捨てる。追加で1枚プレイ可能。',
  },
  {
    id: 'akuma_fukiya',
    name: 'あくまの吹き矢',
    category: 'spell',
    description: '相手の手札を確認し、1枚捨てさせる。',
  },

  // アクションカード（灰色背景・9枚）
  {
    id: 'majo_otodokemono',
    name: '魔女のおとどけもの',
    category: 'action',
    description: 'カード名を宣言し、相手の手札にあれば奪う。',
  },
  {
    id: 'karasu_otsukai',
    name: 'カラスのおつかい',
    category: 'action',
    description: '捨て札からカードを1枚手札に加える。',
  },
  {
    id: 'yousei_megane',
    name: 'ようせいのメガネ',
    category: 'action',
    description: '山札から好きなカードを1枚手札に加える。',
  },
  {
    id: 'hirameki_suisho',
    name: 'ひらめき水晶',
    category: 'action',
    description: '山札の上3枚から1枚手札に、残り2枚を山札に戻す。',
  },
  {
    id: 'hoshifuru_sunadokei',
    name: 'ほしふる砂時計',
    category: 'action',
    description: 'うちけしの書チップを1枚得る。フリーアクション。',
    isFreeAction: true,
  },
  {
    id: 'irekaeeru',
    name: 'イレカエール！',
    category: 'action',
    description: 'こどもバハムートとはらぺこバハムートを入れ替える。',
  },
  {
    id: 'owakaare',
    name: 'オワカーレ！',
    category: 'action',
    description: '相手の場のまものカードを1枚捨て札にする。',
  },
  {
    id: 'ideyon',
    name: 'イデヨン！',
    category: 'action',
    description: '手札からまものカードを1枚場に出す。',
  },
  {
    id: 'yomigaeeru',
    name: 'ヨミガエール！',
    category: 'action',
    description: '捨て札からまものカードを1枚場に出す。',
  },
];

export function getCardDef(defId: string): CardDef {
  const def = CARD_DEFS.find(d => d.id === defId);
  if (!def) throw new Error(`Unknown card: ${defId}`);
  return def;
}

export function getCardDefByName(name: string): CardDef | undefined {
  return CARD_DEFS.find(d => d.name === name);
}

let uidCounter = 0;
export function createCardInstance(defId: string): CardInstance {
  return { uid: `card_${uidCounter++}_${defId}`, defId };
}

export function resetUidCounter() {
  uidCounter = 0;
}

export function createDeck(): CardInstance[] {
  return CARD_DEFS.map(def => createCardInstance(def.id));
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getCardColor(category: string): string {
  switch (category) {
    case 'monster': return '#FFF3CD'; // 黄色
    case 'spell': return '#D1ECF1';   // 水色
    case 'action': return '#E2E3E5';  // 灰色
    default: return '#FFFFFF';
  }
}

export function getCardBorderColor(category: string): string {
  switch (category) {
    case 'monster': return '#FFD700';
    case 'spell': return '#17A2B8';
    case 'action': return '#6C757D';
    default: return '#CCC';
  }
}
