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
// 35 events spanning the entire E16 timeline E0–E529.
// Dates are era-mapped via eraToDateStr for correct chart placement.

export const NARRATIVE_EVENTS: NarrativeEvent[] = [
  // ── Pre-History & Early Colonization (E0–E100) ──
  {
    date: eraToDateStr(0),
    descriptionJa: "E0: 第一陣1,000名がシンフォニー・オブ・スターズに到着。A-Registry萌芽",
    descriptionEn: "E0: First 1,000 settlers arrive at Symphony of Stars. A-Registry萌芽",
    affectedSymbols: ["GRANDEL", "ELYSEON", "UECO"],
    impact: 5,
  },
  {
    date: eraToDateStr(6),
    descriptionJa: "E6: 第一繁栄期。パラトン等の初期都市圏形成。文明圏指数基準値確立",
    descriptionEn:
      "E6: First prosperity. Early urban zones like Palaton. Civilization index baseline",
    affectedSymbols: ["GRANDEL", "ELYSEON", "TYERIA", "DIOCLE", "FALLUJA"],
    impact: 8,
  },
  {
    date: eraToDateStr(14),
    descriptionJa: "E14: エルトナ戦争 — 前衛意識 vs 原始意識。軍事株需要急増",
    descriptionEn: "E14: The Eltna War. Defense stocks surge on military demand",
    affectedSymbols: ["THORON", "FARUJA", "TYERIA"],
    impact: 6,
  },
  {
    date: eraToDateStr(62),
    descriptionJa: "E62: チョンクォン戦争。一時的な市場混乱",
    descriptionEn: "E62: Chonkwon War. Temporary market disruption",
    affectedSymbols: ["UECO", "GRANDEL"],
    impact: -7,
  },
  {
    date: eraToDateStr(78),
    descriptionJa: "E78: 第二繁栄期。人口4,000万。A-Registry 155階層整備完了",
    descriptionEn: "E78: Second prosperity. Population 40M. A-Registry 155 tiers",
    affectedSymbols: ["UECO", "GRANDEL", "MAMON", "ELYSEON"],
    impact: 10,
  },
  {
    date: eraToDateStr(88),
    descriptionJa: "E88: ロンバルディア戦争開戦。軍需株急騰、一般株下落",
    descriptionEn: "E88: Lombardia War begins. Military stocks soar, general stocks fall",
    affectedSymbols: ["THORON", "TYERIA", "FARUJA"],
    impact: 12,
  },
  {
    date: eraToDateStr(97),
    descriptionJa: "E97: 第三繁栄期。n-token経済確立。ネオンコロシアム開設。金融株ブーム",
    descriptionEn: "E97: Third prosperity. n-token economy established. Neon Colosseum opens",
    affectedSymbols: ["MAMON", "UECO", "ALOE", "GRANDEL"],
    impact: 14,
  },
  {
    date: eraToDateStr(100),
    descriptionJa: "E100: バイオエンジニアリング爆発的進化。技術株・エネルギー株急騰",
    descriptionEn: "E100: Bioengineering explosion. Tech and energy stocks surge",
    affectedSymbols: ["FARUJA", "ALOE", "LORENTZ", "GRANDEL"],
    impact: 11,
  },
  // ── Empire & Revolution (E100–E200) ──
  {
    date: eraToDateStr(114),
    descriptionJa: "E114: クワンナ革命 — 分権化。A-Registry見直しで市場ボラティリティ増大",
    descriptionEn: "E114: Kwannara Revolution — Decentralization. Market volatility spikes",
    affectedSymbols: ["UECO", "MAMON"],
    impact: -5,
  },
  {
    date: eraToDateStr(120),
    descriptionJa: "E120: 次元極地平開発。Dimension Horizon技術が画期的ブレイクスルー",
    descriptionEn: "E120: Dimension Horizon developed. Breakthrough in dimensional tech",
    affectedSymbols: ["FARUJA", "LORENTZ", "NCORI", "GRANDEL"],
    impact: 16,
  },
  {
    date: eraToDateStr(150),
    descriptionJa: "E150: マーストリヒト革命。完全自由経済確立。全銘柄総上げ",
    descriptionEn: "E150: Maastricht Revolution. Free economy established. Broad market rally",
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
    date: eraToDateStr(153),
    descriptionJa: "E153: 第四繁栄期。人口3億。GDP14京nトークン。次元技術で星間通信革命",
    descriptionEn: "E153: Fourth prosperity. Population 300M. GDP 14 quadrillion n-tokens",
    affectedSymbols: ["GRANDEL", "UECO", "FARUJA", "ALOE"],
    impact: 9,
  },
  {
    date: eraToDateStr(208),
    descriptionJa: "E208: コーラの疫病。人口15%死亡。シャドウ・リベリオン結成。市場暴落",
    descriptionEn: "E208: The Cora Plague. 15% population dies. Market crashes",
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
  // ── ZAMLT Era (E200–E320) ──
  {
    date: eraToDateStr(270),
    descriptionJa: "E270: AURALIS Proto創設。文化的指標の基礎が形成される",
    descriptionEn: "E270: AURALIS Proto founded. Cultural index foundation forms",
    affectedSymbols: ["AURAL"],
    impact: 7,
  },
  {
    date: eraToDateStr(278),
    descriptionJa: "E278: パクス・ロンバルディカ末期。ZAMLT準備期の不確実性で市場下落",
    descriptionEn: "E278: Late Pax Lombardica. Market dips on ZAMLT uncertainty",
    affectedSymbols: ["UECO", "MAMON", "ZEBRA"],
    impact: -8,
  },
  {
    date: eraToDateStr(289),
    descriptionJa: "E289: 第五繁栄期。次元ブリッジ完成。建設株・技術株急騰",
    descriptionEn: "E289: Fifth prosperity. Dimension Bridges complete. Construction stocks soar",
    affectedSymbols: ["LORENTZ", "FARUJA", "GRANDEL", "UECO"],
    impact: 15,
  },
  {
    date: eraToDateStr(301),
    descriptionJa: "E301: ZAMLT誕生。5大コーポラトクラシー統合。ZEBRA株がIPO急騰",
    descriptionEn: "E301: ZAMLT born. 5 corporatocracies merge. ZEBRA IPO surges",
    affectedSymbols: ["ZEBRA", "MAMON", "UECO"],
    impact: 18,
  },
  {
    date: eraToDateStr(318),
    descriptionJa: "E318: アルファ・ケイン覚醒、ZAMLTオムニバス・エンジン乗っ取り。ZEBRA暴落",
    descriptionEn: "E318: Alpha Kane awakens, hacks ZAMLT Omnibus Engine. ZEBRA crashes",
    affectedSymbols: ["ZEBRA", "MAMON"],
    impact: -22,
  },
  // ── Golden Age & Crisis (E319–E400) ──
  {
    date: eraToDateStr(340),
    descriptionJa: "E340: Slime Woman出現。ペルセポネ実験事故。暗号市場パニック",
    descriptionEn: "E340: Slime Woman appears. Persephone experiment accident. Crypto panic",
    affectedSymbols: ["LAYLA", "LSOL", "TINGUE"],
    impact: -9,
  },
  {
    date: eraToDateStr(350),
    descriptionJa: "E350: 第五繁栄フェスティバル。ネオンコロシアム視聴率95%。文化的経済活性化",
    descriptionEn: "E350: Fifth prosperity festival. 95% viewership. Cultural economy boost",
    affectedSymbols: ["AURAL", "LSOL", "LAYLA", "GRANDEL"],
    impact: 8,
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
    date: eraToDateStr(378),
    descriptionJa: "E378: セリアG4ファントムパルスで反撃。軍需株急騰",
    descriptionEn: "E378: Celia counters with G4 Phantom Pulse. Military stocks surge",
    affectedSymbols: ["THORON", "FARUJA", "LORENTZ", "TYERIA"],
    impact: 14,
  },
  {
    date: eraToDateStr(385),
    descriptionJa: "E385: セリアのヴェノム艦隊がアポロン・セントラリスを崩壊、戦争終結。市場反発",
    descriptionEn: "E385: Celia's Venom Fleet destroys Apollo Centralis. War ends. Market rebounds",
    affectedSymbols: ["GRANDEL", "UECO", "ELYSEON", "FARUJA", "ALOE", "MAMON"],
    impact: 20,
  },
  {
    date: eraToDateStr(388),
    descriptionJa: "E388: グランベル宇宙首位確定。GDP150兆ドル達成",
    descriptionEn: "E388: Grandel secures cosmic #1. GDP reaches 150 trillion dollars",
    affectedSymbols: ["GRANDEL", "UECO", "ACARL"],
    impact: 12,
  },
  {
    date: eraToDateStr(395),
    descriptionJa: "E395: スライム危機ピーク。地下インフラ70%停止。全産業株下落",
    descriptionEn: "E395: Slime Crisis peak. 70% energy halted. All industrial stocks fall",
    affectedSymbols: ["FARUJA", "ZEBRA", "ALOE", "MAMON", "LORENTZ", "THORON", "UECO", "GRANDEL"],
    impact: -16,
  },
  {
    date: eraToDateStr(400),
    descriptionJa: "E400: スライム危機終息。エヴァトロンがGigapolisを支配。暗号市場への不信感",
    descriptionEn: "E400: Slime Crisis ends. Evatron takes control. Crypto market distrust",
    affectedSymbols: ["GOLDV", "TINGUE", "IZUMI"],
    impact: -12,
  },
  // ── Evatron Rule & Modern Era (E400–E529) ──
  {
    date: eraToDateStr(420),
    descriptionJa: "E420: エヴァトロン軍Σ-Unit設立。シルバー・ヴェノムの暗躍。Covert株乱高下",
    descriptionEn:
      "E420: Evatron military Σ-Unit formed. Silver Venom shadow ops. Covert stocks volatile",
    affectedSymbols: ["GOLDV", "IZUMI"],
    impact: -10,
  },
  {
    date: eraToDateStr(475),
    descriptionJa:
      "E475: エヴァトロン崩壊。ゴールデン・ヴェノムとアルファ・ヴェノムに分裂。GOLDV暴落",
    descriptionEn: "E475: Evatron collapses. Golden/Alpha Venom split. GOLDV crashes",
    affectedSymbols: ["GOLDV", "TINGUE"],
    impact: -22,
  },
  {
    date: eraToDateStr(480),
    descriptionJa: "E480: フィオナ台頭。ブルーローズ/V7勢力拡大",
    descriptionEn: "E480: Fiona rises. Blue Rose / V7 power expands",
    affectedSymbols: ["FIONA"],
    impact: 15,
  },
  {
    date: eraToDateStr(485),
    descriptionJa: "E485: アイク・ロペス/SSレンジ台頭。V7の軍事・情報網拡大",
    descriptionEn: "E485: Ike Lopez / SS Range rises. V7 military-intel network expands",
    affectedSymbols: ["ILOPEZ", "MGABR"],
    impact: 10,
  },
  {
    date: eraToDateStr(488),
    descriptionJa: "E488: アイアン・シンジケート/レイド・カキザキ台頭。地下経済活性化",
    descriptionEn: "E488: Iron Syndicate / Raid Kakizaki rises. Underground economy activates",
    affectedSymbols: ["RKAKI", "TINGUE"],
    impact: 12,
  },
  {
    date: eraToDateStr(490),
    descriptionJa: "E490: ミカエル・ガブリエリ/V7結成。軍需株・ファールージャ社急騰",
    descriptionEn: "E490: Mikael Gabrieli / V7 formed. Defense stocks & FARUJA soar",
    affectedSymbols: ["MGABR", "FARUJA", "THORON", "LORENTZ", "GHAUS"],
    impact: 15,
  },
  {
    date: eraToDateStr(493),
    descriptionJa: "E493: マドリス・カーネル。ファルージャ文明圏の指導的役割確立",
    descriptionEn: "E493: Madris Cernel. Fallujah civilization leadership solidified",
    affectedSymbols: ["MCERN", "FALLUJA"],
    impact: 7,
  },
  {
    date: eraToDateStr(495),
    descriptionJa:
      "E495: 第一回宇宙連合会合。アルゼン・カーリーン大統領就任。ネイサン・コリンド参加",
    descriptionEn: "E495: 1st United Cosmic Assembly. President Arzen Carleeen inaugurated",
    affectedSymbols: ["ACARL", "NCORI", "GRANDEL", "UECO"],
    impact: 11,
  },
  {
    date: eraToDateStr(500),
    descriptionJa: "E500: テクノ文化ルネサンス。ネオンコロシアムが芸術祭に進化。文化的指標急上昇",
    descriptionEn: "E500: Techno-Cultural Renaissance. Cultural index surges",
    affectedSymbols: ["AURAL", "LSOL", "ACARL", "LAYLA"],
    impact: 10,
  },
  {
    date: eraToDateStr(510),
    descriptionJa: "E510: 次元極地平技術の民主化。Dimension Horizon一般化。技術株ブーム",
    descriptionEn: "E510: Dimension Horizon democratized. Tech sector boom",
    affectedSymbols: ["FARUJA", "LORENTZ", "NCORI"],
    impact: 12.5,
  },
  {
    date: eraToDateStr(522),
    descriptionJa: "E522: AURALIS Gen-2復活。Kate Claudia・Lily Steinerが活動再開",
    descriptionEn: "E522: AURALIS Gen-2 Revival. Kate Claudia & Lily Steiner resume activities",
    affectedSymbols: ["AURAL", "LSOL", "ACARL"],
    impact: 10,
  },
  {
    date: eraToDateStr(528),
    descriptionJa: "E528: リミナル・フォージ発射。次元建造技術の画期的進展",
    descriptionEn: "E528: Liminal Forge launch. Breakthrough in dimensional construction tech",
    affectedSymbols: ["FARUJA", "LORENTZ", "ALOE", "NCORI"],
    impact: 12.5,
  },
  {
    date: eraToDateStr(529),
    descriptionJa: "E529: 現在。銀河系コンソーシアム体制安定。全資産が日々の変動を反映",
    descriptionEn:
      "E529: Present day. Galactic Consortium stable. All assets reflect daily changes",
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
