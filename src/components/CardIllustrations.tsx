import React from 'react';

// Each SVG illustration is a simple line-art + flat-color style
// viewBox is 80x80, rendered inside the card

export const CardSVG: Record<string, React.FC<{ size?: number }>> = {
  // 1. はらぺこバハムート - 大きなドラゴン、口を開けて火を吐く
  harapeko_bahamut: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 火炎 */}
      <path d="M58 28 L72 20 L65 30 L75 25 L62 35" fill="#FF6B35" stroke="#E63900" strokeWidth="1.5"/>
      <path d="M60 32 L70 30 L63 36" fill="#FFD700" stroke="#E6A800" strokeWidth="1"/>
      {/* 体 */}
      <ellipse cx="35" cy="45" rx="18" ry="14" fill="#7B2D8E" stroke="#4A0E5C" strokeWidth="2"/>
      {/* 頭 */}
      <circle cx="52" cy="32" r="12" fill="#8E44AD" stroke="#4A0E5C" strokeWidth="2"/>
      {/* 角 */}
      <path d="M48 22 L44 10 L50 18" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5"/>
      <path d="M56 22 L60 10 L54 18" fill="#FFD700" stroke="#B8860B" strokeWidth="1.5"/>
      {/* 目（怒り） */}
      <path d="M47 29 L51 31 L47 33" fill="#FF0000" stroke="#8B0000" strokeWidth="1"/>
      <circle cx="49" cy="31" r="1.5" fill="#FF0000"/>
      {/* 口（大きく開いた） */}
      <path d="M55 35 Q60 32 62 35 Q60 40 55 38 Z" fill="#2C0033" stroke="#4A0E5C" strokeWidth="1.5"/>
      {/* 牙 */}
      <line x1="56" y1="35" x2="57" y2="38" stroke="white" strokeWidth="1.5"/>
      <line x1="60" y1="35" x2="59" y2="38" stroke="white" strokeWidth="1.5"/>
      {/* 翼 */}
      <path d="M28 35 Q15 20 20 38 Q10 28 22 42" fill="#9B59B6" stroke="#4A0E5C" strokeWidth="1.5"/>
      {/* 尾 */}
      <path d="M18 48 Q8 50 5 42 Q8 46 12 45" fill="#7B2D8E" stroke="#4A0E5C" strokeWidth="1.5"/>
      {/* 腹 */}
      <ellipse cx="38" cy="50" rx="10" ry="6" fill="#C39BD3" stroke="#4A0E5C" strokeWidth="1"/>
      {/* 足 */}
      <rect x="28" y="56" width="5" height="8" rx="2" fill="#7B2D8E" stroke="#4A0E5C" strokeWidth="1.5"/>
      <rect x="40" y="56" width="5" height="8" rx="2" fill="#7B2D8E" stroke="#4A0E5C" strokeWidth="1.5"/>
      {/* ダメージ表示 */}
      <text x="68" y="60" fontSize="14" fontWeight="bold" fill="#FF0000" stroke="#8B0000" strokeWidth="0.5">4</text>
    </svg>
  ),

  // 2. こどもバハムート - 小さくてかわいいドラゴン
  kodomo_bahamut: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 小さな火 */}
      <path d="M52 30 L58 26 L55 32" fill="#FFD700" stroke="#E6A800" strokeWidth="1"/>
      {/* 体 */}
      <ellipse cx="38" cy="48" rx="14" ry="10" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2"/>
      {/* 頭（大きめ=かわいい） */}
      <circle cx="46" cy="34" r="13" fill="#C4B5FD" stroke="#6D28D9" strokeWidth="2"/>
      {/* 小さい角 */}
      <path d="M42 23 L40 16 L44 20" fill="#FCD34D" stroke="#B8860B" strokeWidth="1"/>
      <path d="M50 23 L52 16 L48 20" fill="#FCD34D" stroke="#B8860B" strokeWidth="1"/>
      {/* 目（まんまる） */}
      <circle cx="42" cy="32" r="3.5" fill="white" stroke="#333" strokeWidth="1.5"/>
      <circle cx="42" cy="33" r="2" fill="#333"/>
      <circle cx="41" cy="31" r="1" fill="white"/>
      <circle cx="51" cy="32" r="3.5" fill="white" stroke="#333" strokeWidth="1.5"/>
      <circle cx="51" cy="33" r="2" fill="#333"/>
      <circle cx="50" cy="31" r="1" fill="white"/>
      {/* 口 */}
      <path d="M44 38 Q47 41 50 38" fill="none" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 小さい翼 */}
      <path d="M26 42 Q20 34 24 44 Q18 38 26 46" fill="#C4B5FD" stroke="#6D28D9" strokeWidth="1.5"/>
      {/* 尾 */}
      <path d="M24 50 Q16 52 14 48" fill="none" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
      {/* 足 */}
      <rect x="32" y="55" width="4" height="7" rx="2" fill="#A78BFA" stroke="#6D28D9" strokeWidth="1"/>
      <rect x="42" y="55" width="4" height="7" rx="2" fill="#A78BFA" stroke="#6D28D9" strokeWidth="1"/>
      {/* ダメージ表示 */}
      <text x="68" y="60" fontSize="14" fontWeight="bold" fill="#FF6B35" stroke="#E63900" strokeWidth="0.5">1</text>
    </svg>
  ),

  // 3. はねかえしゴブリン - 盾を持った小さなゴブリン
  hanekaeshi_goblin: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 反射エフェクト */}
      <path d="M22 20 L18 15 M20 25 L14 22 M24 18 L22 12" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 盾 */}
      <path d="M20 28 L20 52 Q20 60 30 62 Q40 60 40 52 L40 28 Z" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2"/>
      <path d="M25 34 L35 34 L35 48 Q35 54 30 56 Q25 54 25 48 Z" fill="#60A5FA" stroke="#1E40AF" strokeWidth="1"/>
      <text x="28" y="47" fontSize="10" fontWeight="bold" fill="white" textAnchor="middle">R</text>
      {/* 体 */}
      <ellipse cx="52" cy="48" rx="10" ry="8" fill="#22C55E" stroke="#15803D" strokeWidth="2"/>
      {/* 頭 */}
      <circle cx="55" cy="34" r="10" fill="#4ADE80" stroke="#15803D" strokeWidth="2"/>
      {/* 耳（とがった） */}
      <path d="M46 28 L38 22 L46 32" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5"/>
      <path d="M64 28 L72 22 L64 32" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5"/>
      {/* 目 */}
      <circle cx="51" cy="33" r="2.5" fill="white" stroke="#333" strokeWidth="1"/>
      <circle cx="51" cy="34" r="1.5" fill="#333"/>
      <circle cx="59" cy="33" r="2.5" fill="white" stroke="#333" strokeWidth="1"/>
      <circle cx="59" cy="34" r="1.5" fill="#333"/>
      {/* 口（にやり） */}
      <path d="M50 39 Q55 42 60 39" fill="none" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 足 */}
      <rect x="46" y="53" width="4" height="8" rx="2" fill="#22C55E" stroke="#15803D" strokeWidth="1"/>
      <rect x="55" y="53" width="4" height="8" rx="2" fill="#22C55E" stroke="#15803D" strokeWidth="1"/>
    </svg>
  ),

  // 4. そらとぶナイフ - 翼の生えたナイフ
  soratobu_knife: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 軌跡 */}
      <path d="M15 55 Q25 50 35 45" stroke="#87CEEB" strokeWidth="1" strokeDasharray="3,3" fill="none"/>
      <path d="M18 60 Q28 52 38 47" stroke="#87CEEB" strokeWidth="1" strokeDasharray="3,3" fill="none"/>
      {/* ナイフの刃 */}
      <path d="M35 45 L65 15 L60 22 Z" fill="#C0C0C0" stroke="#666" strokeWidth="2"/>
      <path d="M35 45 L65 15 L58 20" fill="#E8E8E8" stroke="none"/>
      {/* 柄 */}
      <rect x="30" y="44" width="12" height="5" rx="1" fill="#8B4513" stroke="#5C2D06" strokeWidth="1.5" transform="rotate(-45 36 47)"/>
      {/* 翼（左） */}
      <path d="M38 38 Q28 28 32 22 Q34 30 40 34" fill="white" stroke="#999" strokeWidth="1.5"/>
      <path d="M36 40 Q24 32 28 25 Q31 34 38 38" fill="#F0F0F0" stroke="#999" strokeWidth="1"/>
      {/* 翼（右） */}
      <path d="M46 46 Q56 36 60 40 Q54 40 48 44" fill="white" stroke="#999" strokeWidth="1.5"/>
      <path d="M44 48 Q54 40 58 44 Q52 42 46 46" fill="#F0F0F0" stroke="#999" strokeWidth="1"/>
      {/* きらめき */}
      <path d="M62 18 L65 14 L68 18 L65 22 Z" fill="#FFD700" stroke="none"/>
      {/* ダメージ表示 */}
      <text x="12" y="72" fontSize="14" fontWeight="bold" fill="#E74C3C">-2</text>
    </svg>
  ),

  // 5. 銀ネコのしっぽ - 銀色のネコのしっぽ
  ginneko_shippo: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* しっぽ（S字カーブ） */}
      <path d="M20 65 Q15 50 25 40 Q35 30 30 18 Q28 12 35 10"
        fill="none" stroke="#C0C0C0" strokeWidth="6" strokeLinecap="round"/>
      <path d="M20 65 Q15 50 25 40 Q35 30 30 18 Q28 12 35 10"
        fill="none" stroke="#E8E8E8" strokeWidth="3" strokeLinecap="round"/>
      {/* 先端のきらめき */}
      <circle cx="35" cy="10" r="4" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
      <path d="M35 4 L35 2 M29 10 L27 10 M41 10 L43 10 M35 16 L35 18 M30 5 L28 3 M40 5 L42 3"
        stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      {/* カード効果のアイコン: +3 -2 */}
      <text x="50" y="30" fontSize="11" fontWeight="bold" fill="#27AE60">+3</text>
      <text x="50" y="48" fontSize="11" fontWeight="bold" fill="#E74C3C">-2</text>
      {/* ネコの足跡 */}
      <circle cx="55" cy="60" r="3" fill="#DDD"/>
      <circle cx="51" cy="56" r="1.5" fill="#DDD"/>
      <circle cx="55" cy="54" r="1.5" fill="#DDD"/>
      <circle cx="59" cy="56" r="1.5" fill="#DDD"/>
      <circle cx="65" cy="68" r="2.5" fill="#DDD"/>
      <circle cx="62" cy="65" r="1.2" fill="#DDD"/>
      <circle cx="65" cy="63" r="1.2" fill="#DDD"/>
      <circle cx="68" cy="65" r="1.2" fill="#DDD"/>
    </svg>
  ),

  // 6. 黒ネコのしっぽ - 黒いネコのしっぽ
  kuroneko_shippo: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* しっぽ */}
      <path d="M20 65 Q15 50 25 40 Q35 30 30 18 Q28 12 35 10"
        fill="none" stroke="#2C2C2C" strokeWidth="6" strokeLinecap="round"/>
      <path d="M20 65 Q15 50 25 40 Q35 30 30 18 Q28 12 35 10"
        fill="none" stroke="#444" strokeWidth="3" strokeLinecap="round"/>
      {/* 先端 月と星 */}
      <circle cx="35" cy="10" r="4" fill="#9B59B6" stroke="#6D28D9" strokeWidth="1"/>
      <path d="M33 8 Q37 8 35 12 Q31 8 33 8" fill="#FFD700"/>
      {/* カード効果 */}
      <text x="50" y="30" fontSize="11" fontWeight="bold" fill="#27AE60">+2</text>
      <text x="50" y="48" fontSize="11" fontWeight="bold" fill="#E74C3C">-2</text>
      <text x="46" y="66" fontSize="9" fontWeight="bold" fill="#F39C12">+1枚</text>
      {/* 黒猫の足跡 */}
      <circle cx="58" cy="18" r="2.5" fill="#333"/>
      <circle cx="55" cy="15" r="1.2" fill="#333"/>
      <circle cx="58" cy="13" r="1.2" fill="#333"/>
      <circle cx="61" cy="15" r="1.2" fill="#333"/>
    </svg>
  ),

  // 7. あくまの吹き矢 - 悪魔的な吹き矢
  akuma_fukiya: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 吹き矢の筒 */}
      <rect x="10" y="36" width="45" height="8" rx="3" fill="#4A0E5C" stroke="#2C0033" strokeWidth="1.5"/>
      <rect x="10" y="38" width="45" height="3" rx="1" fill="#6D28D9" opacity="0.5"/>
      {/* 矢（飛んでいる） */}
      <line x1="58" y1="40" x2="72" y2="40" stroke="#E74C3C" strokeWidth="2"/>
      <path d="M72 40 L68 36 L68 44 Z" fill="#E74C3C" stroke="#8B0000" strokeWidth="1"/>
      {/* 矢の軌跡 */}
      <path d="M55 40 L58 40" stroke="#E74C3C" strokeWidth="1" strokeDasharray="2,2"/>
      {/* 悪魔の装飾 */}
      <path d="M8 32 L4 24 L12 30" fill="#8B0000" stroke="#4A0E5C" strokeWidth="1"/>
      <path d="M8 48 L4 56 L12 50" fill="#8B0000" stroke="#4A0E5C" strokeWidth="1"/>
      {/* 毒のしずく */}
      <path d="M70 48 Q72 52 70 54 Q68 52 70 48" fill="#22C55E"/>
      <path d="M65 50 Q67 54 65 56 Q63 54 65 50" fill="#22C55E" opacity="0.7"/>
      {/* 目のアイコン（手札を見る） */}
      <ellipse cx="40" cy="18" rx="12" ry="7" fill="none" stroke="#9B59B6" strokeWidth="1.5"/>
      <circle cx="40" cy="18" r="4" fill="#9B59B6" stroke="#6D28D9" strokeWidth="1"/>
      <circle cx="40" cy="18" r="2" fill="white"/>
      {/* スカルマーク */}
      <circle cx="40" cy="68" r="5" fill="#F5F5F5" stroke="#666" strokeWidth="1"/>
      <circle cx="38" cy="67" r="1" fill="#333"/>
      <circle cx="42" cy="67" r="1" fill="#333"/>
      <path d="M38 71 L42 71" stroke="#333" strokeWidth="1"/>
    </svg>
  ),

  // 8. 魔女のおとどけもの - 箒に乗った魔女のシルエットと小包
  majo_otodokemono: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 月 */}
      <circle cx="65" cy="15" r="10" fill="#FCD34D" stroke="#B8860B" strokeWidth="1"/>
      <circle cx="68" cy="13" r="8" fill="#0a0a1a"/>
      {/* 箒 */}
      <line x1="15" y1="55" x2="60" y2="30" stroke="#8B4513" strokeWidth="2.5"/>
      {/* 箒の先 */}
      <path d="M10 58 Q8 52 12 55 Q7 50 14 54 Q10 48 16 53 L15 55 Z" fill="#DAA520" stroke="#8B4513" strokeWidth="1"/>
      {/* 魔女のシルエット */}
      {/* 帽子 */}
      <path d="M42 22 L36 38 L52 38 Z" fill="#2C2C2C" stroke="#111" strokeWidth="1.5"/>
      <ellipse cx="44" cy="38" rx="12" ry="3" fill="#2C2C2C" stroke="#111" strokeWidth="1"/>
      <path d="M42 22 Q44 18 46 22" fill="#9B59B6" stroke="none"/>
      {/* 顔 */}
      <circle cx="44" cy="42" r="5" fill="#FDBCB4" stroke="#D4837A" strokeWidth="1"/>
      {/* 目 */}
      <circle cx="42" cy="41" r="1" fill="#333"/>
      <circle cx="46" cy="41" r="1" fill="#333"/>
      {/* 口（にやり） */}
      <path d="M42 44 Q44 46 46 44" fill="none" stroke="#333" strokeWidth="0.8"/>
      {/* 体（マント） */}
      <path d="M38 47 Q44 48 50 47 L52 38 L36 38 Z" fill="#2C2C2C"/>
      {/* 包み */}
      <rect x="55" y="34" width="8" height="7" rx="1" fill="#E74C3C" stroke="#8B0000" strokeWidth="1"/>
      <path d="M55 37.5 L63 37.5 M59 34 L59 41" stroke="#FFD700" strokeWidth="1.5"/>
      {/* 星 */}
      <circle cx="25" cy="15" r="1" fill="white"/>
      <circle cx="18" cy="22" r="0.8" fill="white"/>
      <circle cx="32" cy="10" r="1.2" fill="white"/>
    </svg>
  ),

  // 9. カラスのおつかい - カラスがカードを運んでいる
  karasu_otsukai: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 体 */}
      <ellipse cx="40" cy="35" rx="16" ry="12" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
      {/* 頭 */}
      <circle cx="55" cy="26" r="9" fill="#2C2C2C" stroke="#111" strokeWidth="2"/>
      {/* くちばし */}
      <path d="M62 25 L72 22 L62 28" fill="#F39C12" stroke="#D68910" strokeWidth="1.5"/>
      {/* 目 */}
      <circle cx="57" cy="24" r="2.5" fill="white" stroke="#333" strokeWidth="1"/>
      <circle cx="58" cy="24" r="1.5" fill="#333"/>
      {/* 翼（広げた） */}
      <path d="M32 30 Q18 15 10 18 Q20 22 25 30" fill="#1a1a2e" stroke="#111" strokeWidth="1.5"/>
      <path d="M30 32 Q14 20 8 24 Q18 26 24 33" fill="#2C2C2C" stroke="#111" strokeWidth="1"/>
      <path d="M48 30 Q62 15 70 18 Q60 22 52 30" fill="#1a1a2e" stroke="#111" strokeWidth="1.5"/>
      {/* 足 */}
      <path d="M35 45 L32 55 L28 58 M32 55 L32 59 M32 55 L36 58" stroke="#F39C12" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M45 45 L48 55 L44 58 M48 55 L48 59 M48 55 L52 58" stroke="#F39C12" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* 運んでいるカード */}
      <rect x="30" y="58" width="12" height="16" rx="2" fill="#E8E8E8" stroke="#999" strokeWidth="1.5" transform="rotate(-10 36 66)"/>
      <line x1="33" y1="63" x2="39" y2="62" stroke="#CCC" strokeWidth="1"/>
      <line x1="33" y1="66" x2="39" y2="65" stroke="#CCC" strokeWidth="1"/>
      {/* きらめき */}
      <path d="M15 12 L17 8 L19 12 L17 16 Z" fill="#FFD700" opacity="0.7"/>
    </svg>
  ),

  // 10. ようせいのメガネ - キラキラした魔法のメガネ
  yousei_megane: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* メガネフレーム */}
      <circle cx="28" cy="38" r="14" fill="rgba(147,112,219,0.2)" stroke="#9370DB" strokeWidth="2.5"/>
      <circle cx="56" cy="38" r="14" fill="rgba(147,112,219,0.2)" stroke="#9370DB" strokeWidth="2.5"/>
      {/* ブリッジ */}
      <path d="M42 38 Q44 34 46 38" fill="none" stroke="#9370DB" strokeWidth="2.5"/>
      {/* テンプル */}
      <line x1="14" y1="36" x2="6" y2="32" stroke="#9370DB" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="70" y1="36" x2="78" y2="32" stroke="#9370DB" strokeWidth="2.5" strokeLinecap="round"/>
      {/* レンズ内のキラキラ */}
      <path d="M25 35 L28 30 L31 35 L28 40 Z" fill="#FFD700" opacity="0.6"/>
      <path d="M53 35 L56 30 L59 35 L56 40 Z" fill="#FFD700" opacity="0.6"/>
      {/* 妖精の翼 */}
      <path d="M36 22 Q40 10 44 22" fill="rgba(255,215,0,0.3)" stroke="#FFD700" strokeWidth="1"/>
      <path d="M32 24 Q36 14 40 24" fill="rgba(255,215,0,0.3)" stroke="#FFD700" strokeWidth="1"/>
      <path d="M40 24 Q44 14 48 24" fill="rgba(255,215,0,0.3)" stroke="#FFD700" strokeWidth="1"/>
      {/* 星エフェクト */}
      <circle cx="20" cy="58" r="2" fill="#FFD700"/>
      <circle cx="60" cy="58" r="2" fill="#FFD700"/>
      <circle cx="40" cy="62" r="1.5" fill="#FFD700"/>
      <path d="M40 56 L41 53 L42 56 L45 57 L42 58 L41 61 L40 58 L37 57 Z" fill="#FFD700"/>
      {/* 虫眼鏡エフェクト */}
      <text x="25" y="72" fontSize="9" fill="#9370DB" textAnchor="middle">SEARCH</text>
    </svg>
  ),

  // 11. ひらめき水晶 - 光り輝く水晶球
  hirameki_suisho: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 光線 */}
      <line x1="40" y1="8" x2="40" y2="2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="55" y1="13" x2="60" y2="8" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="25" y1="13" x2="20" y2="8" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="62" y1="28" x2="68" y2="26" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="28" x2="12" y2="26" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round"/>
      {/* 水晶球 */}
      <circle cx="40" cy="35" r="20" fill="url(#crystalGrad)" stroke="#9370DB" strokeWidth="2.5"/>
      <defs>
        <radialGradient id="crystalGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#E8D5FF"/>
          <stop offset="50%" stopColor="#B88FE8"/>
          <stop offset="100%" stopColor="#7B2D8E"/>
        </radialGradient>
      </defs>
      {/* ハイライト */}
      <ellipse cx="32" cy="28" rx="6" ry="4" fill="rgba(255,255,255,0.4)" transform="rotate(-20 32 28)"/>
      {/* 水晶の中に見える3枚のカード */}
      <rect x="30" y="30" width="6" height="8" rx="1" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" transform="rotate(-10 33 34)"/>
      <rect x="37" y="29" width="6" height="8" rx="1" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5"/>
      <rect x="44" y="30" width="6" height="8" rx="1" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" transform="rotate(10 47 34)"/>
      {/* 台座 */}
      <path d="M28 55 Q30 52 40 52 Q50 52 52 55 L54 62 Q50 64 40 64 Q30 64 26 62 Z" fill="#6D28D9" stroke="#4A0E5C" strokeWidth="1.5"/>
      <ellipse cx="40" cy="55" rx="12" ry="3" fill="#7C3AED" stroke="#4A0E5C" strokeWidth="1"/>
      {/* 数字表示 */}
      <text x="40" y="74" fontSize="9" fontWeight="bold" fill="#9370DB" textAnchor="middle">3→1</text>
    </svg>
  ),

  // 12. ほしふる砂時計 - 星が降る砂時計
  hoshifuru_sunadokei: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 上部の三角 */}
      <path d="M25 12 L55 12 L40 38 Z" fill="rgba(59,130,246,0.2)" stroke="#3B82F6" strokeWidth="2"/>
      {/* 下部の三角 */}
      <path d="M25 64 L55 64 L40 38 Z" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" strokeWidth="2"/>
      {/* 上枠 */}
      <rect x="22" y="10" width="36" height="4" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
      {/* 下枠 */}
      <rect x="22" y="62" width="36" height="4" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
      {/* 砂（星） */}
      <circle cx="36" cy="22" r="1.5" fill="#FFD700"/>
      <circle cx="44" cy="20" r="1" fill="#FFD700"/>
      <circle cx="40" cy="25" r="1.2" fill="#FFD700"/>
      <circle cx="38" cy="18" r="0.8" fill="#FFD700"/>
      <circle cx="42" cy="24" r="0.8" fill="#FFD700"/>
      {/* 流れている星 */}
      <circle cx="40" cy="35" r="1" fill="#FFD700"/>
      <circle cx="40" cy="40" r="1" fill="#FFD700"/>
      {/* 溜まった星 */}
      <circle cx="37" cy="56" r="1.5" fill="#FFD700"/>
      <circle cx="43" cy="57" r="1.2" fill="#FFD700"/>
      <circle cx="40" cy="54" r="1" fill="#FFD700"/>
      <circle cx="40" cy="58" r="1.3" fill="#FFD700"/>
      {/* 周りの星 */}
      <path d="M15 20 L16 17 L17 20 L20 21 L17 22 L16 25 L15 22 L12 21 Z" fill="#FFD700" opacity="0.7"/>
      <path d="M63 20 L64 17 L65 20 L68 21 L65 22 L64 25 L63 22 L60 21 Z" fill="#FFD700" opacity="0.7"/>
      <path d="M10 45 L11 43 L12 45 L14 46 L12 47 L11 49 L10 47 L8 46 Z" fill="#FFD700" opacity="0.5"/>
      <path d="M68 45 L69 43 L70 45 L72 46 L70 47 L69 49 L68 47 L66 46 Z" fill="#FFD700" opacity="0.5"/>
      {/* FREE表示 */}
      <text x="40" y="76" fontSize="8" fontWeight="bold" fill="#3B82F6" textAnchor="middle">FREE</text>
    </svg>
  ),

  // 13. イレカエール！ - 入れ替えの矢印
  irekaeeru: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 左のバハムート（小） */}
      <circle cx="18" cy="35" r="10" fill="#C4B5FD" stroke="#6D28D9" strokeWidth="1.5"/>
      <circle cx="15" cy="33" r="1.5" fill="#333"/>
      <circle cx="21" cy="33" r="1.5" fill="#333"/>
      <path d="M15 22 L13 16 L17 20" fill="#FCD34D" stroke="#B8860B" strokeWidth="0.8"/>
      <path d="M21 22 L23 16 L19 20" fill="#FCD34D" stroke="#B8860B" strokeWidth="0.8"/>
      <text x="18" y="50" fontSize="7" fill="#6D28D9" textAnchor="middle">子</text>
      {/* 右のバハムート（大） */}
      <circle cx="62" cy="35" r="10" fill="#8E44AD" stroke="#4A0E5C" strokeWidth="1.5"/>
      <path d="M58 29 L56 23 L60 27" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
      <path d="M66 29 L68 23 L64 27" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
      <circle cx="59" cy="33" r="1.5" fill="#FF0000"/>
      <circle cx="65" cy="33" r="1.5" fill="#FF0000"/>
      <path d="M60 38 Q62 40 64 38" fill="none" stroke="#4A0E5C" strokeWidth="1"/>
      <text x="62" y="50" fontSize="7" fill="#4A0E5C" textAnchor="middle">親</text>
      {/* 入れ替え矢印（上） */}
      <path d="M30 28 L50 28" stroke="#E74C3C" strokeWidth="2.5" markerEnd="url(#arrowR)"/>
      {/* 入れ替え矢印（下） */}
      <path d="M50 42 L30 42" stroke="#3B82F6" strokeWidth="2.5" markerEnd="url(#arrowL)"/>
      <defs>
        <marker id="arrowR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6" fill="#E74C3C"/>
        </marker>
        <marker id="arrowL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
          <path d="M6 0 L0 3 L6 6" fill="#3B82F6"/>
        </marker>
      </defs>
      {/* エフェクト */}
      <path d="M38 18 L40 14 L42 18 L46 19 L42 20 L40 24 L38 20 L34 19 Z" fill="#FFD700" opacity="0.8"/>
      {/* テキスト */}
      <text x="40" y="68" fontSize="10" fontWeight="bold" fill="#E74C3C" textAnchor="middle">SWAP</text>
    </svg>
  ),

  // 14. オワカーレ！ - 別れの手を振るシルエット
  owakaare: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 背景の渦 */}
      <path d="M40 15 Q55 20 55 35 Q55 50 40 50 Q25 50 25 35 Q25 25 35 22"
        fill="none" stroke="#E74C3C" strokeWidth="1.5" opacity="0.4"/>
      <path d="M40 22 Q48 25 48 35 Q48 44 40 44 Q32 44 32 35 Q32 28 38 27"
        fill="none" stroke="#E74C3C" strokeWidth="1" opacity="0.3"/>
      {/* ドクロマーク */}
      <circle cx="40" cy="32" r="12" fill="#F5F5F5" stroke="#666" strokeWidth="2"/>
      <circle cx="36" cy="30" r="3" fill="#333"/>
      <circle cx="44" cy="30" r="3" fill="#333"/>
      <path d="M34 38 L36 36 L38 38 L40 36 L42 38 L44 36 L46 38" fill="none" stroke="#333" strokeWidth="1.5"/>
      {/* 骨 */}
      <path d="M24 46 L56 46" stroke="#F5F5F5" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="24" cy="44" r="2.5" fill="#F5F5F5" stroke="#666" strokeWidth="0.5"/>
      <circle cx="24" cy="48" r="2.5" fill="#F5F5F5" stroke="#666" strokeWidth="0.5"/>
      <circle cx="56" cy="44" r="2.5" fill="#F5F5F5" stroke="#666" strokeWidth="0.5"/>
      <circle cx="56" cy="48" r="2.5" fill="#F5F5F5" stroke="#666" strokeWidth="0.5"/>
      {/* 手を振る */}
      <path d="M60 15 Q65 10 68 15 Q65 12 64 16 Q67 12 69 17 Q66 14 65 18"
        fill="#FDBCB4" stroke="#D4837A" strokeWidth="1"/>
      {/* 涙エフェクト */}
      <path d="M16 22 Q17 26 16 28" stroke="#3B82F6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M12 25 Q13 29 12 31" stroke="#3B82F6" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* テキスト */}
      <text x="40" y="68" fontSize="9" fontWeight="bold" fill="#E74C3C" textAnchor="middle">REMOVE</text>
    </svg>
  ),

  // 15. イデヨン！ - 召喚陣から出てくるモンスター
  ideyon: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 魔法陣 */}
      <ellipse cx="40" cy="55" rx="24" ry="10" fill="none" stroke="#F39C12" strokeWidth="2"/>
      <ellipse cx="40" cy="55" rx="18" ry="7" fill="none" stroke="#F39C12" strokeWidth="1" opacity="0.7"/>
      <ellipse cx="40" cy="55" rx="28" ry="12" fill="none" stroke="#F39C12" strokeWidth="1" opacity="0.4"/>
      {/* 星マーク（陣の中） */}
      <path d="M40 46 L42 51 L48 51 L43 54 L45 59 L40 56 L35 59 L37 54 L32 51 L38 51 Z"
        fill="rgba(243,156,18,0.3)" stroke="#F39C12" strokeWidth="1"/>
      {/* 上昇する光 */}
      <path d="M35 50 L33 20" stroke="#FFD700" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
      <path d="M45 50 L47 20" stroke="#FFD700" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/>
      <path d="M40 48 L40 15" stroke="#FFD700" strokeWidth="2" opacity="0.8" strokeLinecap="round"/>
      {/* 出現するシルエット */}
      <circle cx="40" cy="26" r="8" fill="rgba(142,68,173,0.6)" stroke="#8E44AD" strokeWidth="1.5"/>
      <path d="M36 20 L34 14 L38 18" fill="rgba(255,215,0,0.7)" stroke="#B8860B" strokeWidth="0.8"/>
      <path d="M44 20 L46 14 L42 18" fill="rgba(255,215,0,0.7)" stroke="#B8860B" strokeWidth="0.8"/>
      <circle cx="37" cy="25" r="1.5" fill="#FF6B35"/>
      <circle cx="43" cy="25" r="1.5" fill="#FF6B35"/>
      {/* きらめき */}
      <path d="M20 30 L21 27 L22 30 L25 31 L22 32 L21 35 L20 32 L17 31 Z" fill="#FFD700" opacity="0.7"/>
      <path d="M58 30 L59 27 L60 30 L63 31 L60 32 L59 35 L58 32 L55 31 Z" fill="#FFD700" opacity="0.7"/>
      {/* テキスト */}
      <text x="40" y="75" fontSize="9" fontWeight="bold" fill="#F39C12" textAnchor="middle">SUMMON</text>
    </svg>
  ),

  // 16. ヨミガエール！ - 墓場から復活
  yomigaeeru: ({ size = 80 }) => (
    <svg viewBox="0 0 80 80" width={size} height={size}>
      {/* 地面 */}
      <path d="M5 55 Q20 52 40 55 Q60 58 75 55 L75 70 L5 70 Z" fill="#4A3520" stroke="#2C1810" strokeWidth="1"/>
      {/* 墓石 */}
      <path d="M15 55 L15 38 Q15 30 22 30 Q29 30 29 38 L29 55 Z" fill="#888" stroke="#555" strokeWidth="1.5"/>
      <text x="22" y="45" fontSize="8" fill="#CCC" textAnchor="middle">R.I.P</text>
      {/* 緑の光 */}
      <path d="M50 55 L48 25" stroke="#22C55E" strokeWidth="2" opacity="0.7" strokeLinecap="round"/>
      <path d="M55 55 L57 30" stroke="#22C55E" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      <path d="M45 55 L43 30" stroke="#22C55E" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      {/* 復活するまもの */}
      <circle cx="50" cy="22" r="9" fill="rgba(142,68,173,0.7)" stroke="#8E44AD" strokeWidth="1.5"/>
      <path d="M46 16 L44 10 L48 14" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
      <path d="M54 16 L56 10 L52 14" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8"/>
      <circle cx="47" cy="21" r="1.5" fill="#22C55E"/>
      <circle cx="53" cy="21" r="1.5" fill="#22C55E"/>
      <path d="M47 26 Q50 28 53 26" fill="none" stroke="#4A0E5C" strokeWidth="1"/>
      {/* 上昇エフェクト */}
      <path d="M50 14 L50 8" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M46 12 L44 7" stroke="#22C55E" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <path d="M54 12 L56 7" stroke="#22C55E" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      {/* 手が地面から出る */}
      <path d="M35 55 L35 48 Q33 46 35 45 Q37 46 35 48" fill="#FDBCB4" stroke="#D4837A" strokeWidth="1"/>
      {/* テキスト */}
      <text x="40" y="78" fontSize="9" fontWeight="bold" fill="#22C55E" textAnchor="middle">REVIVE</text>
    </svg>
  ),
};
