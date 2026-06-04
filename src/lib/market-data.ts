/* ═══════════════════════════════════════════════════════════════
   EDU Market Data Engine v3
   E16 Era-based deterministic price generation.
   All assets start from their founding era; prices generated to E529.
   Daily price perturbation via date-seeded PRNG for live updates.
   ═══════════════════════════════════════════════════════════════ */

// ─── E16 Era System ───

/** Current story era — locked at E529 (where the E16 universe currently is) */
export const E16_STORY_ERA = 529
/** Internal epoch for date↔era conversion */
const E16_REF_DATE = new Date("2026-01-15")

/** Returns the current E16 era (fixed at story era) */
export function getCurrentEra(): number {
  return E16_STORY_ERA
}

/** Convert an E16 era number to a YYYY-MM-DD date string */
export function eraToDateStr(era: number): string {
  const diff = era - E16_STORY_ERA
  const d = new Date(E16_REF_DATE.getTime() + diff * 86_400_000)
  return dateStr(d)
}

/** Convert a YYYY-MM-DD date string to an E16 era number */
export function dateToEra(ds: string): number {
  const d = new Date(ds)
  return E16_STORY_ERA + Math.floor((d.getTime() - E16_REF_DATE.getTime()) / 86_400_000)
}

/** Get today's date string for daily seed */
function todayStr(): string {
  return dateStr(new Date())
}

// ─── Types ───

export interface AssetPrice {
  date: string // YYYY-MM-DD (internal; displayed as E16 era)
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface NarrativeEvent {
  date: string // YYYY-MM-DD (E16 era-mapped)
  descriptionJa: string
  descriptionEn: string
  affectedSymbols: string[]
  impact: number // percentage change applied
}

export interface AssetDefinition {
  symbol: string
  name: string
  nameEn: string
  type: "stock" | "index" | "crypto"
  sector?: string
  basePrice: number
  volatility: number // annualized sigma
  mu: number // annual drift mu
  meanRevertStrength?: number // for indices
  affiliation?: string
  foundedEra: number // E16 era when this asset was founded / became tradable
}

export interface Asset {
  symbol: string
  name: string
  nameEn: string
  type: "stock" | "index" | "crypto"
  sector?: string
  affiliation?: string
  prices: AssetPrice[]
  currentPrice: number
  change24h: number
  changePercent24h: number
  marketCap?: string
  foundedEra: number
}

// ─── Seeded Pseudo-Random Number Generator (Mulberry32) ───

function mulberry32(seed: number): () => number {
  // eslint-disable-next-line unicorn/prefer-math-trunc -- intentional 32-bit integer truncation for PRNG
  let state = seed | 0
  return () => {
    // eslint-disable-next-line unicorn/prefer-math-trunc -- intentional 32-bit integer truncation for PRNG
    state = (state + 1_831_565_045) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

/** Hash a string to a 32-bit integer seed */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    // eslint-disable-next-line unicorn/prefer-math-trunc -- intentional 32-bit integer truncation for hash
    hash = ((hash << 5) - hash + ch) | 0
  }
  return Math.abs(hash)
}

/** Box-Muller transform to generate standard normal from uniform [0,1) */
function boxMuller(rng: () => number): number {
  let u1 = rng()
  while (u1 === 0) {
    u1 = rng()
  } // avoid log(0)
  const u2 = rng()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

// ─── Date Utilities ───

function dateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

// ─── Narrative Events ───
// 68 events spanning the entire E16 timeline E0–E529.
// Faithfully derived from the master timeline (timeline-data.ts).
// Dates are era-mapped via eraToDateStr for correct chart placement.

export const NARRATIVE_EVENTS: NarrativeEvent[] = [
  // ── Pre-History & Early Colonization (E0–E14) ──
  {
    date: eraToDateStr(0),
    descriptionJa: "E0: 第一陣1,000名がシンフォニー・オブ・スターズに到着",
    descriptionEn: "E0: First 1,000 settlers arrive at Symphony of Stars",
    affectedSymbols: ["GRANDEL", "ELYSEON", "UECO"],
    impact: 5,
  },
  {
    date: eraToDateStr(1),
    descriptionJa: "E1: 定住開始。Clan組織。A-Registry（旅券）萌芽",
    descriptionEn: "E1: Settlement begins. Clan organization. A-Registry萌芽",
    affectedSymbols: ["GRANDEL", "UECO", "MAMON"],
    impact: 4,
  },
  {
    date: eraToDateStr(6),
    descriptionJa: "E6: 第一繁栄期。パラトン等の初期都市圏形成",
    descriptionEn: "E6: First prosperity. Early urban zones like Palaton",
    affectedSymbols: ["GRANDEL", "ELYSEON", "TYERIA", "DIOCLE", "FALLUJA"],
    impact: 8,
  },
  {
    date: eraToDateStr(14),
    descriptionJa: "E14: エルトナ戦争 — 前衛意識 vs 原始意識",
    descriptionEn: "E14: The Eltna War — Vanguard vs Primitive consciousness",
    affectedSymbols: ["THORON", "FARUJA", "TYERIA"],
    impact: 6,
  },
  // ── Birds Empire (E15–E61) ──
  {
    date: eraToDateStr(15),
    descriptionJa: "E15: バーズ帝国成立。軍閥ファランクスが星系統一",
    descriptionEn: "E15: Birds Empire founded. Warlord Phalanx unifies the star system",
    affectedSymbols: ["THORON", "TYERIA", "GRANDEL"],
    impact: 9,
  },
  {
    date: eraToDateStr(30),
    descriptionJa: "E30: バーズ帝国全盛期。軍事拡張で周辺文明圏に影響",
    descriptionEn: "E30: Birds Empire at its peak. Military expansion extends influence",
    affectedSymbols: ["THORON", "TYERIA", "FARUJA"],
    impact: 5,
  },
  {
    date: eraToDateStr(50),
    descriptionJa: "E50: 星間経済協同組合(UECO)基礎概念形成",
    descriptionEn: "E50: UECO economic framework takes shape",
    affectedSymbols: ["UECO", "GRANDEL", "MAMON"],
    impact: 6,
  },
  // ── After War & Terran Republic (E62–E77) ──
  {
    date: eraToDateStr(62),
    descriptionJa: "E62: アフター戦争・チョンクォン戦争勃発",
    descriptionEn: "E62: After War & Chonkwon War erupt",
    affectedSymbols: ["UECO", "GRANDEL", "THORON", "TYERIA"],
    impact: -7,
  },
  {
    date: eraToDateStr(77),
    descriptionJa: "E77: テラン朝共和制へ移行。戦後復興で景気回復",
    descriptionEn: "E77: Transition to Terran Republic. Post-war recovery",
    affectedSymbols: ["GRANDEL", "UECO", "ELYSEON", "FALLUJA"],
    impact: 8,
  },
  // ── Second Prosperity & Tech Enlightenment (E78–E97) ──
  {
    date: eraToDateStr(78),
    descriptionJa: "E78: 第二繁栄期。人口4,000万。A-Registry 155階層",
    descriptionEn: "E78: Second prosperity. Population 40M. A-Registry 155 tiers",
    affectedSymbols: ["UECO", "GRANDEL", "MAMON", "ELYSEON"],
    impact: 10,
  },
  {
    date: eraToDateStr(85),
    descriptionJa: "E85: セル・ウィーブ一般化。放射線耐性・長寿命化",
    descriptionEn: "E85: Cell Weave widespread. Radiation resistance & life extension",
    affectedSymbols: ["ALOE", "FARUJA", "GRANDEL", "ELYSEON"],
    impact: 7,
  },
  {
    date: eraToDateStr(88),
    descriptionJa: "E88: ロンバルディア戦争開戦。M104銀河規模の大戦",
    descriptionEn: "E88: Lombardia War begins. Galaxy-scale war",
    affectedSymbols: ["THORON", "TYERIA", "FARUJA", "LORENTZ"],
    impact: 12,
  },
  {
    date: eraToDateStr(93),
    descriptionJa: "E93: テンプル・オブ・ホライゾン建設。テクノ宗教運動",
    descriptionEn: "E93: Temple of Horizon built. Techno-religious movement rises",
    affectedSymbols: ["FARUJA", "AURAL", "GRANDEL"],
    impact: 5,
  },
  // ── Third Prosperity & Corporatum Publica (E97–E120) ──
  {
    date: eraToDateStr(97),
    descriptionJa: "E97: 第三繁栄期。人口1億2,000万。コーポラタムパブリカ・n-token経済",
    descriptionEn: "E97: Third prosperity. Pop 120M. Corporatum Publica & n-token economy",
    affectedSymbols: ["MAMON", "UECO", "ALOE", "GRANDEL"],
    impact: 14,
  },
  {
    date: eraToDateStr(100),
    descriptionJa: "E100: バイオエンジニアリング爆発的進化",
    descriptionEn: "E100: Bioengineering explosion. Tech and energy stocks surge",
    affectedSymbols: ["FARUJA", "ALOE", "LORENTZ", "GRANDEL"],
    impact: 11,
  },
  {
    date: eraToDateStr(108),
    descriptionJa: "E108: クワンナ革命開始。分権化・Clan復権の波",
    descriptionEn: "E108: Kwannara Revolution begins. Decentralization wave",
    affectedSymbols: ["UECO", "MAMON", "GRANDEL"],
    impact: -4,
  },
  {
    date: eraToDateStr(114),
    descriptionJa: "E114: クワンナ革命完了。A-Registry見直し",
    descriptionEn: "E114: Kwannara Revolution concludes. A-Registry reform",
    affectedSymbols: ["UECO", "MAMON"],
    impact: -5,
  },
  // ── Maastricht & Fourth Prosperity (E120–E208) ──
  {
    date: eraToDateStr(120),
    descriptionJa: "E120: 次元極地平(Dimension Horizon)開発。画期的ブレイクスルー",
    descriptionEn: "E120: Dimension Horizon developed. Breakthrough",
    affectedSymbols: ["FARUJA", "LORENTZ", "NCORI", "GRANDEL", "DIOCLE"],
    impact: 16,
  },
  {
    date: eraToDateStr(150),
    descriptionJa: "E150: マーストリヒト革命。完全自由経済確立",
    descriptionEn: "E150: Maastricht Revolution. Free economy established",
    affectedSymbols: [
      "FARUJA",
      "ZEBRA",
      "ALOE",
      "MAMON",
      "LORENTZ",
      "THORON",
      "GRANDEL",
      "UECO",
      "ELYSEON",
      "TYERIA",
      "DIOCLE",
      "FALLUJA",
    ],
    impact: 13,
  },
  {
    date: eraToDateStr(151),
    descriptionJa: "E151: 新ヘルシンキ宣言。惑星連邦構想提案",
    descriptionEn: "E151: New Helsinki Declaration. Planetary federation proposed",
    affectedSymbols: ["GRANDEL", "UECO", "FALLUJA", "DIOCLE"],
    impact: 5,
  },
  {
    date: eraToDateStr(153),
    descriptionJa: "E153: 第四繁栄期。人口3億。GDP14京nトークン",
    descriptionEn: "E153: Fourth prosperity. Pop 300M. GDP 14 quadrillion n-tokens",
    affectedSymbols: ["GRANDEL", "UECO", "FARUJA", "ALOE"],
    impact: 9,
  },
  {
    date: eraToDateStr(175),
    descriptionJa: "E175: 平均寿命150年に延長。医療技術がエレシオン株を押し上げ",
    descriptionEn: "E175: Lifespan 150 years. Medical tech lifts Elyseon",
    affectedSymbols: ["ELYSEON", "ALOE", "FARUJA", "GRANDEL"],
    impact: 6,
  },
  {
    date: eraToDateStr(190),
    descriptionJa: "E190: ティエリア軍事拡大開始。宇宙最強の軍事力で台頭",
    descriptionEn: "E190: Tyeria military expansion begins. Strongest military in cosmos",
    affectedSymbols: ["THORON", "TYERIA", "GHAUS"],
    impact: 8,
  },
  {
    date: eraToDateStr(208),
    descriptionJa: "E208: コーラの疫病。人口15%死亡。シャドウ・リベリオン結成",
    descriptionEn: "E208: The Cora Plague. 15% population dies. Shadow Rebellion forms",
    affectedSymbols: [
      "GRANDEL",
      "UECO",
      "ELYSEON",
      "TYERIA",
      "DIOCLE",
      "FALLUJA",
      "FARUJA",
      "ALOE",
      "MAMON",
      "THORON",
    ],
    impact: -18,
  },
  // ── Pax Lombardica (E205–E278) ──
  {
    date: eraToDateStr(220),
    descriptionJa: "E220: パクス・ロンバルディカ安定期。年間5京nトークン経済",
    descriptionEn: "E220: Pax Lombardica stable. 5 quadrillion n-token economy",
    affectedSymbols: ["UECO", "MAMON", "GRANDEL"],
    impact: 4,
  },
  {
    date: eraToDateStr(240),
    descriptionJa: "E240: 5大文明圏の胎動。アポロン・ドミニオン大戦で多極化加速",
    descriptionEn: "E240: 5 Civilizations emerging. Apollo-Dominion War accelerates multipolarity",
    affectedSymbols: ["GRANDEL", "ELYSEON", "TYERIA", "FALLUJA", "DIOCLE"],
    impact: 6,
  },
  {
    date: eraToDateStr(260),
    descriptionJa: "E260: Diana（初代Wonder Woman）台頭",
    descriptionEn: "E260: Rise of Diana (first Wonder Woman)",
    affectedSymbols: ["AURAL", "LSOL", "FIONA"],
    impact: 8,
  },
  {
    date: eraToDateStr(270),
    descriptionJa: "E270: AURALIS Proto創設。Diana時代の文化的恩恵",
    descriptionEn: "E270: AURALIS Proto founded under Diana's cultural legacy",
    affectedSymbols: ["AURAL"],
    impact: 7,
  },
  // ── Merdia War & Fifth Prosperity (E275–E318) ──
  {
    date: eraToDateStr(275),
    descriptionJa: "E275: メルディア戦争。ロンバルディア vs セクスタス連合",
    descriptionEn: "E275: Merdia War. Lombardia vs Sextus Alliance",
    affectedSymbols: ["THORON", "TYERIA", "FARUJA", "LORENTZ", "GRANDEL"],
    impact: -6,
  },
  {
    date: eraToDateStr(278),
    descriptionJa: "E278: パクス・ロンバルディカ末期。ZAMLT準備期の不安",
    descriptionEn: "E278: Late Pax Lombardica. ZAMLT transition uncertainty",
    affectedSymbols: ["UECO", "MAMON", "ZEBRA"],
    impact: -8,
  },
  {
    date: eraToDateStr(288),
    descriptionJa: "E288: メルディア戦争終結。次元兵器でロンバルディア勝利",
    descriptionEn: "E288: Merdia War ends. Lombardia victory with dimensional weapons",
    affectedSymbols: ["THORON", "FARUJA", "LORENTZ"],
    impact: 10,
  },
  {
    date: eraToDateStr(289),
    descriptionJa: "E289: 第五繁栄期。人口4億。メガタワー3km。次元ブリッジで貿易10倍",
    descriptionEn: "E289: Fifth prosperity. Pop 400M. Mega Towers 3km. Dimension Bridges 10x trade",
    affectedSymbols: ["LORENTZ", "FARUJA", "GRANDEL", "UECO"],
    impact: 15,
  },
  {
    date: eraToDateStr(290),
    descriptionJa: "E290: AURALIS Collective第一世代正式組織化",
    descriptionEn: "E290: AURALIS Collective 1st Gen formally organized",
    affectedSymbols: ["AURAL", "LSOL"],
    impact: 8,
  },
  {
    date: eraToDateStr(301),
    descriptionJa: "E301: ZAMLT誕生。5コーポラトクラシー統合。オムニバス・エンジン",
    descriptionEn: "E301: ZAMLT born. 5 corporatocracies merge. Omnibus Engine",
    affectedSymbols: ["ZEBRA", "MAMON", "UECO"],
    impact: 18,
  },
  {
    date: eraToDateStr(310),
    descriptionJa: "E310: ZAMLT拡大期。A-Registry Z1〜Z50再編。社会不安",
    descriptionEn: "E310: ZAMLT expansion. A-Registry Z1-Z50 reorganized. Social unrest",
    affectedSymbols: ["ZEBRA", "MAMON", "UECO", "GRANDEL"],
    impact: 7,
  },
  {
    date: eraToDateStr(318),
    descriptionJa: "E318: アルファ・ケイン覚醒。ZAMLTオムニバス・エンジンハッキング",
    descriptionEn: "E318: Alpha Kane awakens. Hacks ZAMLT Omnibus Engine",
    affectedSymbols: ["ZEBRA", "MAMON", "UECO"],
    impact: -22,
  },
  // ── Post-ZAMLT & Golden Age (E319–E400) ──
  {
    date: eraToDateStr(319),
    descriptionJa: "E319: Jen（Lv938+）がValoria宮殿を掌握",
    descriptionEn: "E319: Jen (Lv938+) seizes Valoria Palace",
    affectedSymbols: ["MAMON", "UECO"],
    impact: 5,
  },
  {
    date: eraToDateStr(325),
    descriptionJa: "E325: レイラ・ヴィレル・ノヴァ（Pink Voltage）がAURALISに参加",
    descriptionEn: "E325: Layla Villere Nova joins AURALIS",
    affectedSymbols: ["LAYLA", "AURAL"],
    impact: 8,
  },
  {
    date: eraToDateStr(335),
    descriptionJa: "E335: セリア黄金期の幕開け。ZAMLTを倒しSelinopolis改名",
    descriptionEn: "E335: Celia's Golden Age begins. Defeats ZAMLT",
    affectedSymbols: ["GRANDEL", "UECO", "MAMON", "AURAL"],
    impact: 14,
  },
  {
    date: eraToDateStr(340),
    descriptionJa: "E340: Slime Woman出現。ペルセポネ実験事故",
    descriptionEn: "E340: Slime Woman appears. Persephone experiment accident",
    affectedSymbols: ["LAYLA", "LSOL", "TINGUE"],
    impact: -9,
  },
  {
    date: eraToDateStr(350),
    descriptionJa: "E350: 第五繁栄フェスティバル。ネオンコロシアム視聴率95%",
    descriptionEn: "E350: Fifth prosperity festival. 95% viewership",
    affectedSymbols: ["AURAL", "LSOL", "LAYLA", "GRANDEL"],
    impact: 8,
  },
  {
    date: eraToDateStr(355),
    descriptionJa: "E355: AURALIS文化的頂点。フェルミ音楽とn-token経済融合",
    descriptionEn: "E355: AURALIS cultural zenith. Fermi music meets n-token economy",
    affectedSymbols: ["AURAL", "LSOL", "MAMON", "UECO"],
    impact: 6,
  },
  {
    date: eraToDateStr(365),
    descriptionJa: "E365: セリアがエヴァトロンと同盟。GDP81京ドル達成",
    descriptionEn: "E365: Celia-Evatron alliance. GDP 81 quadrillion dollars",
    affectedSymbols: ["GRANDEL", "UECO", "FARUJA", "ALOE"],
    impact: 10,
  },
  {
    date: eraToDateStr(370),
    descriptionJa: "E370: アポロン・ドミニオン大戦宣戦布告。全市場暴落",
    descriptionEn: "E370: Apollo-Dominion War declared. Broad market crash",
    affectedSymbols: [
      "FARUJA",
      "ZEBRA",
      "ALOE",
      "MAMON",
      "LORENTZ",
      "THORON",
      "GRANDEL",
      "UECO",
      "ELYSEON",
      "TYERIA",
      "DIOCLE",
      "FALLUJA",
      "AURAL",
    ],
    impact: -15,
  },
  {
    date: eraToDateStr(375),
    descriptionJa: "E375: アポロンがケンタウロスレーザー発射。2.6年の恐怖",
    descriptionEn: "E375: Apollo fires Centaurus Laser. 2.6 years of terror",
    affectedSymbols: ["THORON", "TYERIA", "GRANDEL"],
    impact: -8,
  },
  {
    date: eraToDateStr(378),
    descriptionJa: "E378: セリアがG4ファントムパルスで応戦",
    descriptionEn: "E378: Celia responds with G4 Phantom Pulse",
    affectedSymbols: ["THORON", "FARUJA", "LORENTZ", "TYERIA"],
    impact: 14,
  },
  {
    date: eraToDateStr(385),
    descriptionJa: "E385: ヴェノム艦隊がアポロン・セントラリス崩壊。戦争終結",
    descriptionEn: "E385: Venom Fleet destroys Apollo Centralis. War ends",
    affectedSymbols: ["GRANDEL", "UECO", "ELYSEON", "FARUJA", "ALOE", "MAMON"],
    impact: 20,
  },
  {
    date: eraToDateStr(388),
    descriptionJa: "E388: グランベル宇宙首位確定。GDP150兆ドル",
    descriptionEn: "E388: Grandel secures cosmic #1. GDP 150 trillion",
    affectedSymbols: ["GRANDEL", "UECO", "ACARL"],
    impact: 12,
  },
  {
    date: eraToDateStr(390),
    descriptionJa: "E390: ティエリア第3位。軍事技術輸出で経済基盤拡大",
    descriptionEn: "E390: Tyeria #3. Military tech exports expand economy",
    affectedSymbols: ["TYERIA", "THORON", "GHAUS"],
    impact: 9,
  },
  {
    date: eraToDateStr(395),
    descriptionJa: "E395: スライム危機ピーク。地下70%停止。人口20%避難",
    descriptionEn: "E395: Slime Crisis peak. 70% underground halted. 20% evacuated",
    affectedSymbols: ["FARUJA", "ZEBRA", "ALOE", "MAMON", "LORENTZ", "THORON", "UECO", "GRANDEL"],
    impact: -16,
  },
  {
    date: eraToDateStr(400),
    descriptionJa: "E400: スライム危機終息。AURALIS解体。エヴァトロンGigapolis支配",
    descriptionEn: "E400: Slime Crisis ends. AURALIS dissolved. Evatron seizes Gigapolis",
    affectedSymbols: ["GOLDV", "TINGUE", "IZUMI", "AURAL", "LAYLA"],
    impact: -12,
  },
  // ── Evatron Rule & Terian Rebellion (E400–E475) ──
  {
    date: eraToDateStr(410),
    descriptionJa: "E410: エヴァトロン支配安定化。AURALIS地下活動へ",
    descriptionEn: "E410: Evatron rule stabilizes. AURALIS goes underground",
    affectedSymbols: ["GOLDV", "MAMON", "UECO"],
    impact: -5,
  },
  {
    date: eraToDateStr(420),
    descriptionJa: "E420: Σ-Unit設立。精神操作技術。Alpha Venomの起源",
    descriptionEn: "E420: Σ-Unit formed. Mind control tech. Alpha Venom origin",
    affectedSymbols: ["GOLDV", "IZUMI", "RKAKI"],
    impact: -10,
  },
  {
    date: eraToDateStr(430),
    descriptionJa: "E430: テリアン反乱。エリオス・ウォルドがエヴァトロンに抵抗",
    descriptionEn: "E430: Terian Rebellion. Elios Wald resists Evatron",
    affectedSymbols: ["TINGUE", "RKAKI", "GOLDV"],
    impact: -6,
  },
  {
    date: eraToDateStr(450),
    descriptionJa: "E450: エヴァトロン暗黒期。Eros-7でスクイーズ・アビス建設",
    descriptionEn: "E450: Evatron dark period. Squeeze Abyss built on Eros-7",
    affectedSymbols: ["GOLDV", "TINGUE", "IZUMI"],
    impact: -8,
  },
  {
    date: eraToDateStr(470),
    descriptionJa: "E470: エリオス・ウォルド処刑。テクロサス東方支隊クレセント常駐",
    descriptionEn: "E470: Elios Wald executed. Tekrosas Eastern Detachment stations in Crescent",
    affectedSymbols: ["GOLDV", "TINGUE", "THORON"],
    impact: -7,
  },
  {
    date: eraToDateStr(475),
    descriptionJa: "E475: エヴァトロン崩壊。シルバー→アルファ/ゴールデン・ヴェノム分裂",
    descriptionEn: "E475: Evatron collapses. Silver→Alpha/Golden Venom split",
    affectedSymbols: ["GOLDV", "TINGUE", "IZUMI"],
    impact: -22,
  },
  // ── Techno-Cultural Renaissance & Modern Era (E475–E529) ──
  {
    date: eraToDateStr(480),
    descriptionJa: "E480: フィオナ台頭。ヴァーミリオン裏路地から諜報機関へ",
    descriptionEn: "E480: Fiona rises. From Vermillion back alleys to intelligence",
    affectedSymbols: ["FIONA"],
    impact: 15,
  },
  {
    date: eraToDateStr(485),
    descriptionJa: "E485: シルバー・ヴェノム浸透。アイク・ロペス/SSレンジ台頭",
    descriptionEn: "E485: Silver Venom infiltrates. Ike Lopez / SS Range rises",
    affectedSymbols: ["ILOPEZ", "MGABR", "RKAKI"],
    impact: 10,
  },
  {
    date: eraToDateStr(488),
    descriptionJa: "E488: アイアン・シンジケート/レイド・カキザキ台頭",
    descriptionEn: "E488: Iron Syndicate / Raid Kakizaki rises",
    affectedSymbols: ["RKAKI", "TINGUE"],
    impact: 12,
  },
  {
    date: eraToDateStr(490),
    descriptionJa: "E490: V7結成。ボグダス・ジャベリンがヴァーミリオンに駐在",
    descriptionEn: "E490: V7 formed. Bogdas Javelin stationed in Vermillion",
    affectedSymbols: ["MGABR", "FARUJA", "THORON", "LORENTZ", "GHAUS"],
    impact: 15,
  },
  {
    date: eraToDateStr(493),
    descriptionJa: "E493: マドリス・カーネル台頭。ファルージャ指導的役割確立",
    descriptionEn: "E493: Madris Cernel rises. Fallujah leadership solidified",
    affectedSymbols: ["MCERN", "FALLUJA"],
    impact: 7,
  },
  {
    date: eraToDateStr(495),
    descriptionJa: "E495: 第一回宇宙連合会合。銀河系コンソーシアム設立",
    descriptionEn: "E495: 1st United Cosmic Assembly. Galactic Consortium founded",
    affectedSymbols: ["ACARL", "NCORI", "GRANDEL", "UECO"],
    impact: 11,
  },
  {
    date: eraToDateStr(499),
    descriptionJa: "E499: ミナ・エウレカ・アーネスト誕生（ノスタルジア・コロニー）",
    descriptionEn: "E499: Mina Eureka Ernst born (Nostalgia Colony)",
    affectedSymbols: ["ACARL", "NCORI", "GRANDEL"],
    impact: 4,
  },
  {
    date: eraToDateStr(500),
    descriptionJa: "E500: テクノ文化ルネサンス確立。ネオンコロシアムが芸術祭に",
    descriptionEn: "E500: Techno-Cultural Renaissance established",
    affectedSymbols: ["AURAL", "LSOL", "ACARL", "LAYLA"],
    impact: 10,
  },
  {
    date: eraToDateStr(505),
    descriptionJa: "E505: Eros-7スクイーズ・アビス解体。マトリカル改革",
    descriptionEn: "E505: Eros-7 Squeeze Abyss dismantled. Matriarchal Reform",
    affectedSymbols: ["TINGUE", "RKAKI", "GRANDEL"],
    impact: 6,
  },
  {
    date: eraToDateStr(509),
    descriptionJa: "E509: アルファ・ヴェノムがノスタルジア・コロニー襲撃",
    descriptionEn: "E509: Alpha Venom attacks Nostalgia Colony",
    affectedSymbols: ["IZUMI", "MGABR", "THORON"],
    impact: -8,
  },
  {
    date: eraToDateStr(510),
    descriptionJa: "E510: 次元極地平技術民主化。技術株ブーム",
    descriptionEn: "E510: Dimension Horizon democratized. Tech sector boom",
    affectedSymbols: ["FARUJA", "LORENTZ", "NCORI", "DIOCLE"],
    impact: 12.5,
  },
  {
    date: eraToDateStr(514),
    descriptionJa: "E514: ミナがビブリオ大学に入学",
    descriptionEn: "E514: Mina enrolls at Biblio University",
    affectedSymbols: ["ACARL", "NCORI", "GRANDEL"],
    impact: 3,
  },
  {
    date: eraToDateStr(518),
    descriptionJa: "E518: トリニティ同盟形成。V7 vs トリニティ冷戦構造",
    descriptionEn: "E518: Trinity Alliance formed. V7 vs Trinity cold war",
    affectedSymbols: ["MGABR", "ILOPEZ", "FIONA", "GOLDV"],
    impact: -5,
  },
  {
    date: eraToDateStr(522),
    descriptionJa: "E522: AURALIS Gen-2復活。Kate・Lily・レイラ・ミナ・Ninney再結成",
    descriptionEn: "E522: AURALIS Gen-2 Revival. Kate, Lily, Layla, Mina, Ninney reunite",
    affectedSymbols: ["AURAL", "LSOL", "LAYLA", "ACARL"],
    impact: 10,
  },
  {
    date: eraToDateStr(525),
    descriptionJa: "E525: リミナル・フォージ発射。Eros-7マトリカル改革",
    descriptionEn: "E525: Liminal Forge launched. Eros-7 Matriarchal Reform",
    affectedSymbols: ["FARUJA", "LORENTZ", "ALOE", "NCORI"],
    impact: 12.5,
  },
  {
    date: eraToDateStr(528),
    descriptionJa: "E528: V7 vs トリニティ冷戦継続。緊張と安定が同居",
    descriptionEn: "E528: V7 vs Trinity cold war. Tension and stability coexist",
    affectedSymbols: ["GRANDEL", "UECO", "MGABR", "FIONA", "ILOPEZ"],
    impact: -3,
  },
  {
    date: eraToDateStr(529),
    descriptionJa: "E529: 現在。銀河系コンソーシアム体制安定",
    descriptionEn: "E529: Present day. Galactic Consortium stable",
    affectedSymbols: ["GRANDEL", "UECO", "FALLUJA", "ACARL"],
    impact: 3,
  },
]

// ─── Asset Definitions ───
// foundedEra assignments based on E16 universe lore:
//   E0:   First settlers arrive (AD3500)
//   E10:  Grandel civilization established
//   E12:  Dioclenis founded
//   E15:  Elyseon established
//   E18:  Tyeria military expansion
//   E22:  Fallujah cultural influence
//   E50:  UECO economic framework
//   E97:  n-token economy, MAMON founded
//   E100: Third prosperity, ALOE Oil
//   E120: Dimension Horizon tech, FARUJA founded
//   E200: Post-Lombardia military, THORON founded
//   E270: AURALIS Proto
//   E289: Fifth prosperity, LORENTZ founded
//   E301: ZAMLT founded (ZEBRA)
//   E325: Layla joins AURALIS
//   E380: Tyeria #3 (GHAUS)
//   E390: Queen Liana era (LSOL)
//   E400: Tina/Gue underground control (TINGUE)
//   E420: Alpha Venom origin (IZUMI)
//   E475: Venom split (GOLDV)
//   E480: Fiona (FIONA)
//   E485: Ike Lopez (ILOPEZ)
//   E488: Iron Syndicate (RKAKI)
//   E490: V7 era (MGABR)
//   E493: Madris Cernel (MCERN)
//   E495: Cosmic Assembly (ACARL, NCORI)

const ASSET_DEFS: AssetDefinition[] = [
  // ── Stocks ──
  {
    symbol: "FARUJA",
    name: "ファールージャ社",
    nameEn: "Faruja Corp",
    type: "stock",
    sector: "DimensionalTech",
    basePrice: 12_450,
    volatility: 0.35,
    mu: 0.12,
    foundedEra: 120,
  },
  {
    symbol: "ZEBRA",
    name: "Zebra Corp (ZAMLT)",
    nameEn: "Zebra Corp (ZAMLT)",
    type: "stock",
    sector: "Legacy",
    basePrice: 8200,
    volatility: 0.55,
    mu: -0.08,
    foundedEra: 301,
  },
  {
    symbol: "ALOE",
    name: "Aloe Oil Corp",
    nameEn: "Aloe Oil Corp",
    type: "stock",
    sector: "Energy",
    basePrice: 6800,
    volatility: 0.3,
    mu: 0.08,
    foundedEra: 100,
  },
  {
    symbol: "MAMON",
    name: "Mamon Corp",
    nameEn: "Mamon Corp",
    type: "stock",
    sector: "Finance",
    basePrice: 5400,
    volatility: 0.25,
    mu: 0.06,
    foundedEra: 97,
  },
  {
    symbol: "LORENTZ",
    name: "Lorentz Corp",
    nameEn: "Lorentz Corp",
    type: "stock",
    sector: "Construction",
    basePrice: 7100,
    volatility: 0.28,
    mu: 0.1,
    foundedEra: 289,
  },
  {
    symbol: "THORON",
    name: "Thoron Corp",
    nameEn: "Thoron Corp",
    type: "stock",
    sector: "Military",
    basePrice: 9300,
    volatility: 0.32,
    mu: 0.09,
    foundedEra: 200,
  },
  // ── Indices ──
  {
    symbol: "UECO",
    name: "UECO Index",
    nameEn: "UECO Index",
    type: "index",
    sector: "Economic",
    basePrice: 3500,
    volatility: 0.12,
    mu: 0.04,
    meanRevertStrength: 0.05,
    foundedEra: 50,
  },
  {
    symbol: "AURAL",
    name: "AURALIS Index",
    nameEn: "AURALIS Index",
    type: "index",
    sector: "Cultural",
    basePrice: 2800,
    volatility: 0.15,
    mu: 0.05,
    meanRevertStrength: 0.04,
    foundedEra: 270,
  },
  // ── Covert ──
  {
    symbol: "GOLDV",
    name: "Golden Venom",
    nameEn: "Golden Venom",
    type: "stock",
    sector: "Covert",
    basePrice: 1200,
    volatility: 0.7,
    mu: -0.05,
    foundedEra: 475,
  },
  // ── Civilization Indices ──
  {
    symbol: "GRANDEL",
    name: "グランベル",
    nameEn: "Grandel",
    type: "index",
    sector: "Civilization",
    basePrice: 15_000,
    volatility: 0.1,
    mu: 0.06,
    meanRevertStrength: 0.03,
    foundedEra: 10,
  },
  {
    symbol: "ELYSEON",
    name: "エレシオン",
    nameEn: "Elyseon",
    type: "index",
    sector: "Civilization",
    basePrice: 9500,
    volatility: 0.11,
    mu: 0.05,
    meanRevertStrength: 0.03,
    foundedEra: 15,
  },
  {
    symbol: "TYERIA",
    name: "ティエリア",
    nameEn: "Tyeria",
    type: "index",
    sector: "Civilization",
    basePrice: 11_200,
    volatility: 0.13,
    mu: 0.07,
    meanRevertStrength: 0.03,
    foundedEra: 18,
  },
  {
    symbol: "FALLUJA",
    name: "ファルージャ",
    nameEn: "Fallujah",
    type: "index",
    sector: "Civilization",
    basePrice: 7800,
    volatility: 0.14,
    mu: 0.04,
    meanRevertStrength: 0.04,
    foundedEra: 22,
  },
  {
    symbol: "DIOCLE",
    name: "ディオクレニス",
    nameEn: "Dioclenis",
    type: "index",
    sector: "Civilization",
    basePrice: 8400,
    volatility: 0.12,
    mu: 0.06,
    meanRevertStrength: 0.03,
    foundedEra: 12,
  },
  // ── N-Token Personal Crypto ──
  {
    symbol: "ACARL",
    name: "アルゼン・カーリーン",
    nameEn: "Arzen Carleen",
    type: "crypto",
    affiliation: "グランデル / 5大文明圏",
    basePrice: 1_500_000,
    volatility: 0.4,
    mu: 0.15,
    foundedEra: 495,
  },
  {
    symbol: "MGABR",
    name: "ミカエル・ガブリエリ",
    nameEn: "Mikael Gabrieli",
    type: "crypto",
    affiliation: "ファールージャ社 / V7",
    basePrice: 850_000,
    volatility: 0.45,
    mu: 0.12,
    foundedEra: 490,
  },
  {
    symbol: "ILOPEZ",
    name: "アイク・ロペス",
    nameEn: "Ike Lopez",
    type: "crypto",
    affiliation: "SSレンジ / V7",
    basePrice: 420_000,
    volatility: 0.38,
    mu: 0.1,
    foundedEra: 485,
  },
  {
    symbol: "GHAUS",
    name: "グレイモンド・ハウザー",
    nameEn: "Greymond Hauser",
    type: "crypto",
    affiliation: "ティエリア / 5大文明圏",
    basePrice: 380_000,
    volatility: 0.35,
    mu: 0.09,
    foundedEra: 380,
  },
  {
    symbol: "RKAKI",
    name: "レイド・カキザキ",
    nameEn: "Raid Kakizaki",
    type: "crypto",
    affiliation: "アイアン・シンジケート / V7",
    basePrice: 280_000,
    volatility: 0.42,
    mu: 0.08,
    foundedEra: 488,
  },
  {
    symbol: "NCORI",
    name: "ネイサン・コリンド",
    nameEn: "Nathan Corind",
    type: "crypto",
    affiliation: "ディオクレニス / 5大文明圏",
    basePrice: 250_000,
    volatility: 0.36,
    mu: 0.1,
    foundedEra: 495,
  },
  {
    symbol: "MCERN",
    name: "マドリス・カーネル",
    nameEn: "Madris Cernel",
    type: "crypto",
    affiliation: "ファルージャ / 5大文明圏",
    basePrice: 210_000,
    volatility: 0.3,
    mu: 0.06,
    foundedEra: 493,
  },
  {
    symbol: "LSOL",
    name: "リアナ・ソリス",
    nameEn: "Liana Solis",
    type: "crypto",
    affiliation: "エレシオン / 5大文明圏",
    basePrice: 180_000,
    volatility: 0.28,
    mu: 0.07,
    foundedEra: 390,
  },
  {
    symbol: "TINGUE",
    name: "ティナ/グエ",
    nameEn: "Tina/Gue",
    type: "crypto",
    affiliation: "地下街",
    basePrice: 195_000,
    volatility: 0.5,
    mu: 0.05,
    foundedEra: 400,
  },
  {
    symbol: "FIONA",
    name: "フィオナ",
    nameEn: "Fiona",
    type: "crypto",
    affiliation: "ブルーローズ / V7",
    basePrice: 140_000,
    volatility: 0.38,
    mu: 0.06,
    foundedEra: 480,
  },
  {
    symbol: "IZUMI",
    name: "イズミ（アルファ・ヴェノム）",
    nameEn: "Izumi (Alpha Venom)",
    type: "crypto",
    affiliation: "シャドウ・リベリオン",
    basePrice: 95_000,
    volatility: 0.55,
    mu: 0.03,
    foundedEra: 420,
  },
  {
    symbol: "LAYLA",
    name: "レイラ・ヴィレル・ノヴァ",
    nameEn: "Layla Virell Nova",
    type: "crypto",
    affiliation: "アイリス / ファルージャ",
    basePrice: 120_000,
    volatility: 0.33,
    mu: 0.08,
    foundedEra: 325,
  },
]

// ─── Price Generation ───
// Generates deterministic prices from foundedEra to E529.
// Uses seeded PRNG so historical data is identical on every page load.
// Daily update: perturbs the final price using today's date as seed.

function generatePrices(def: AssetDefinition): AssetPrice[] {
  const seed = hashString(def.symbol + "_E16_MARKET_v3")
  const rng = mulberry32(seed)

  // Date range: from foundedEra to story era
  const startStr = eraToDateStr(def.foundedEra)
  const endStr = eraToDateStr(E16_STORY_ERA)

  // Build date array
  const dates: string[] = []
  let cur = new Date(startStr + "T00:00:00")
  const end = new Date(endStr + "T00:00:00")
  while (cur <= end) {
    dates.push(dateStr(cur))
    cur = new Date(cur.getTime() + 86_400_000)
  }

  const days = dates.length
  const dt = 1 / 252 // trading day fraction
  const prices: AssetPrice[] = []

  // Build narrative event map for fast lookup
  const eventMap = new Map<string, number>()
  for (const ev of NARRATIVE_EVENTS) {
    if (ev.affectedSymbols.includes(def.symbol)) {
      const existing = eventMap.get(ev.date) ?? 0
      eventMap.set(ev.date, existing + ev.impact)
    }
  }

  // GARCH-like volatility state
  let garchVol = def.volatility
  const garchOmega = def.volatility * 0.15
  const garchAlpha = 0.2
  const garchBeta = 0.65

  let currentPrice = def.basePrice

  for (let i = 0; i < days; i++) {
    const date = dates[i]!

    // GARCH volatility update
    if (i > 0) {
      const prev = prices[i - 1]!
      const prevReturn = (prev.close - prev.open) / prev.open
      garchVol = garchOmega + garchAlpha * Math.abs(prevReturn) + garchBeta * garchVol
      garchVol = Math.max(def.volatility * 0.3, Math.min(garchVol, def.volatility * 3))
    }

    // GBM step
    const z = boxMuller(rng)
    const drift = def.mu - (garchVol * garchVol) / 2
    let dailyReturn = drift * dt + garchVol * Math.sqrt(dt) * z

    // Mean reversion for indices
    if (def.meanRevertStrength !== undefined) {
      const deviation = (currentPrice - def.basePrice) / def.basePrice
      dailyReturn -= def.meanRevertStrength * deviation * dt
    }

    // Trending periods (seeds create natural clusters)
    const trendSeed = rng()
    if (trendSeed > 0.85) {
      dailyReturn += 0.008
    } else if (trendSeed < 0.15) {
      dailyReturn -= 0.006
    }

    const open = currentPrice
    let close = open * (1 + dailyReturn)
    close = Math.max(close, open * 0.7) // floor at -30%

    // Narrative event impact
    const eventImpact = eventMap.get(date)
    if (eventImpact !== undefined) {
      close = close * (1 + eventImpact / 100)
    }

    close = Math.max(close, 1)

    // Generate realistic intraday high/low
    const dayVol = Math.abs(close - open) / open
    const rangeMultiplier = 1.5 + rng() * 2.5
    const high = Math.max(open, close) * (1 + dayVol * rangeMultiplier * 0.5)
    let low = Math.min(open, close) * (1 - dayVol * rangeMultiplier * 0.5)
    low = Math.max(low, 0.5)

    // Volume
    let volume = (1_000_000 + rng() * 4_000_000) * (def.type === "crypto" ? 0.3 : 1)
    if (eventImpact !== undefined) {
      volume *= 2.5 + Math.abs(eventImpact) / 10
    }
    volume *= 1 + dayVol * 20
    volume = Math.round(volume)

    prices.push({
      date,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    })

    currentPrice = close
  }

  return prices
}

// ─── Daily Price Perturbation ───
// Uses today's date as seed to generate a small, realistic price change
// based on the asset's historical volatility. This gives each day a
// different "current" price while keeping all historical data stable.

function applyDailyPerturbation(symbol: string, lastClose: number, volatility: number): number {
  const today = todayStr()
  const seed = hashString(symbol + "_DAILY_v3_" + today)
  const rng = mulberry32(seed)
  const z = boxMuller(rng)
  const dailyVol = volatility * Math.sqrt(1 / 252)
  // Clamp daily move to ±5% for realism
  const move = Math.max(-0.05, Math.min(0.05, dailyVol * z))
  return Math.max(lastClose * (1 + move), 1)
}

function formatMarketCap(price: number, symbol: string): string {
  const mult = symbol.startsWith("G") ? 50 : symbol.length <= 5 ? 100 : 30
  const cap = price * mult * 1_000_000
  if (cap >= 1_000_000_000_000) {
    return `${(cap / 1_000_000_000_000).toFixed(1)}Tn`
  }
  if (cap >= 1_000_000_000) {
    return `${(cap / 1_000_000_000).toFixed(1)}Bn`
  }
  return `${(cap / 1_000_000).toFixed(0)}Mn`
}

// ─── Cache & Export ───

/** Deterministic historical prices (same on every load) */
const priceCache = new Map<string, AssetPrice[]>()
/** Display-ready asset cache (includes daily perturbation) */
const assetCache = new Map<string, Asset>()

function buildAsset(def: AssetDefinition): Asset {
  const cached = assetCache.get(def.symbol)
  if (cached) {
    return cached
  }

  // Get or generate deterministic prices
  let prices = priceCache.get(def.symbol)
  if (!prices) {
    prices = generatePrices(def)
    priceCache.set(def.symbol, prices)
  }

  if (prices.length < 2) {
    const asset: Asset = {
      symbol: def.symbol,
      name: def.name,
      nameEn: def.nameEn,
      type: def.type,
      sector: def.sector,
      affiliation: def.affiliation,
      prices,
      currentPrice: def.basePrice,
      change24h: 0,
      changePercent24h: 0,
      marketCap: def.type !== "crypto" ? formatMarketCap(def.basePrice, def.symbol) : undefined,
      foundedEra: def.foundedEra,
    }
    assetCache.set(def.symbol, asset)
    return asset
  }

  // Apply daily perturbation to the last price point
  const lastHistorical = prices[prices.length - 1]!.close
  const prevHistorical = prices[prices.length - 2]!.close
  const todayPrice = applyDailyPerturbation(def.symbol, lastHistorical, def.volatility)

  // Override the last price in the display array with today's perturbed price
  const displayPrices = [...prices]
  displayPrices[displayPrices.length - 1] = {
    ...displayPrices[displayPrices.length - 1]!,
    close: Math.round(todayPrice * 100) / 100,
  }

  const change = todayPrice - prevHistorical
  const changePercent = (change / prevHistorical) * 100

  const asset: Asset = {
    symbol: def.symbol,
    name: def.name,
    nameEn: def.nameEn,
    type: def.type,
    sector: def.sector,
    affiliation: def.affiliation,
    prices: displayPrices,
    currentPrice: Math.round(todayPrice * 100) / 100,
    change24h: Math.round(change * 100) / 100,
    changePercent24h: Math.round(changePercent * 100) / 100,
    marketCap: def.type !== "crypto" ? formatMarketCap(todayPrice, def.symbol) : undefined,
    foundedEra: def.foundedEra,
  }

  assetCache.set(def.symbol, asset)
  return asset
}

export function getAllAssets(): Asset[] {
  return ASSET_DEFS.map(buildAsset)
}

export function getAsset(symbol: string): Asset | undefined {
  const def = ASSET_DEFS.find((d) => d.symbol === symbol)
  if (!def) {
    return undefined
  }
  return buildAsset(def)
}

export function getStocks(): Asset[] {
  return getAllAssets().filter((a) => a.type === "stock")
}

export function getIndices(): Asset[] {
  return getAllAssets().filter((a) => a.type === "index")
}

export function getCryptos(): Asset[] {
  return getAllAssets().filter((a) => a.type === "crypto")
}

// ─── E16 Market Composite Index ───
// Weighted average of all asset daily returns.
// Weights: stocks 35%, indices 30%, crypto 35% (equal within each type).

let compositeCache: Asset | null = null

export function getCompositeIndex(): Asset {
  if (compositeCache) {
    return compositeCache
  }

  // Build all assets first (populates priceCache)
  const allAssets = getAllAssets()
  const stocks = allAssets.filter((a) => a.type === "stock")
  const indices = allAssets.filter((a) => a.type === "index")
  const cryptos = allAssets.filter((a) => a.type === "crypto")

  const stockWeight = stocks.length > 0 ? 0.35 / stocks.length : 0
  const indexWeight = indices.length > 0 ? 0.3 / indices.length : 0
  const cryptoWeight = cryptos.length > 0 ? 0.35 / cryptos.length : 0

  // Gather all full price arrays
  const allFullPrices = ASSET_DEFS.map((def) => {
    let fp = priceCache.get(def.symbol)
    if (!fp) {
      fp = generatePrices(def)
      priceCache.set(def.symbol, fp)
    }
    return { def, prices: fp }
  })

  const minEra = Math.min(...ASSET_DEFS.map((d) => d.foundedEra))

  // Build composite date array
  const compositeStartStr = eraToDateStr(minEra)
  const compositeEndStr = eraToDateStr(E16_STORY_ERA)
  const compositeDates: string[] = []
  let cur = new Date(compositeStartStr + "T00:00:00")
  const end = new Date(compositeEndStr + "T00:00:00")
  while (cur <= end) {
    compositeDates.push(dateStr(cur))
    cur = new Date(cur.getTime() + 86_400_000)
  }

  // Build date → close price maps for each asset
  const priceMaps = new Map<string, Map<string, number>>()
  for (const { def, prices: fp } of allFullPrices) {
    const m = new Map<string, number>()
    for (const p of fp) {
      m.set(p.date, p.close)
    }
    priceMaps.set(def.symbol, m)
  }

  // Compute composite: weighted average daily returns
  const baseValue = 1000
  const compositePrices: AssetPrice[] = []
  let compositeClose = baseValue

  for (let i = 0; i < compositeDates.length; i++) {
    const date = compositeDates[i]!
    let weightedReturn = 0
    let totalWeight = 0

    for (const def of ASSET_DEFS) {
      const pm = priceMaps.get(def.symbol)
      if (!pm) {
        continue
      }

      const closeToday = pm.get(date)
      const prevDate = i > 0 ? compositeDates[i - 1]! : null
      const closePrev = prevDate ? pm.get(prevDate) : undefined

      if (closeToday !== undefined && closePrev !== undefined && closePrev > 0) {
        const dailyRet = (closeToday - closePrev) / closePrev
        let w = 0
        if (def.type === "stock") {
          w = stockWeight
        } else if (def.type === "index") {
          w = indexWeight
        } else if (def.type === "crypto") {
          w = cryptoWeight
        }
        weightedReturn += w * dailyRet
        totalWeight += w
      }
    }

    if (totalWeight > 0) {
      const avgReturn = weightedReturn / totalWeight
      compositeClose = compositeClose * (1 + avgReturn)
    }
    compositeClose = Math.max(compositeClose, 1)

    const open =
      compositePrices.length > 0 ? compositePrices[compositePrices.length - 1]!.close : baseValue

    compositePrices.push({
      date,
      open: Math.round(open * 100) / 100,
      high: Math.round(Math.max(open, compositeClose) * 1.002 * 100) / 100,
      low: Math.round(Math.min(open, compositeClose) * 0.998 * 100) / 100,
      close: Math.round(compositeClose * 100) / 100,
      volume: Math.round(5_000_000 + Math.random() * 10_000_000),
    })
  }

  // Apply daily perturbation to composite too
  const lastCompositeClose = compositePrices[compositePrices.length - 1]!.close
  const prevCompositeClose = compositePrices[compositePrices.length - 2]!.close
  const perturbedComposite = applyDailyPerturbation("E16MC", lastCompositeClose, 0.08)
  compositePrices[compositePrices.length - 1] = {
    ...compositePrices[compositePrices.length - 1]!,
    close: Math.round(perturbedComposite * 100) / 100,
  }

  const lastPrice = perturbedComposite
  const prevPrice = prevCompositeClose
  const change = lastPrice - prevPrice
  const changePercent = (change / prevPrice) * 100

  const composite: Asset = {
    symbol: "E16MC",
    name: "E16 マーケット総合指数",
    nameEn: "E16 Market Composite",
    type: "index",
    sector: "Composite",
    prices: compositePrices,
    currentPrice: Math.round(lastPrice * 100) / 100,
    change24h: Math.round(change * 100) / 100,
    changePercent24h: Math.round(changePercent * 100) / 100,
    marketCap: undefined,
    foundedEra: minEra,
  }

  compositeCache = composite
  return composite
}
