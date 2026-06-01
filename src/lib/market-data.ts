/* ═══════════════════════════════════════════════════════════════
   EDU Market Data Engine v2
   E16 Era-based deterministic price generation with daily updates.
   Each asset starts from its founding era; data pre-generated
   up to MAX_ERA and filtered to the current era for display.
   ═══════════════════════════════════════════════════════════════ */

// ─── E16 Era System ───

/** Reference: E529 = 2026-01-15 (from commit "E529以降 1日=1年 リアルタイム進行") */
export const E16_REF_ERA = 529
const E16_REF_DATE = new Date("2026-01-15")
/** Pre-generate prices up to this era for seamless daily updates */
const MAX_ERA = 1200

/** Returns the current E16 era based on today's date */
export function getCurrentEra(): number {
  const now = new Date()
  return E16_REF_ERA + Math.floor((now.getTime() - E16_REF_DATE.getTime()) / 86_400_000)
}

/** Convert an E16 era number to a YYYY-MM-DD date string */
export function eraToDateStr(era: number): string {
  const diff = era - E16_REF_ERA
  const d = new Date(E16_REF_DATE.getTime() + diff * 86_400_000)
  return dateStr(d)
}

/** Convert a YYYY-MM-DD date string to an E16 era number */
export function dateToEra(ds: string): number {
  const d = new Date(ds)
  return E16_REF_ERA + Math.floor((d.getTime() - E16_REF_DATE.getTime()) / 86_400_000)
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
  date: string // YYYY-MM-DD
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

export const NARRATIVE_EVENTS: NarrativeEvent[] = [
  {
    date: "2025-06-10",
    descriptionJa: "E318: ZAMLT崩壊の余波、ZEBRA社大幅下落",
    descriptionEn: "E318 Aftermath: ZAMLT collapse — ZEBRA plunges",
    affectedSymbols: ["ZEBRA"],
    impact: -18.5,
  },
  {
    date: "2025-04-15",
    descriptionJa: "E400: エヴァトロン弾圧、暗号市場への不信感",
    descriptionEn: "E400: Evatron suppression — crypto market panic",
    affectedSymbols: ["GOLDV", "TINGUE"],
    impact: -12,
  },
  {
    date: "2025-08-22",
    descriptionJa: "E515: V7結成、軍需株・ファールージャ社急騰",
    descriptionEn: "E515: V7 Formation — defense stocks & FARUJA soar",
    affectedSymbols: ["FARUJA", "THORON", "LORENTZ", "MGABR", "GHAUS"],
    impact: 15,
  },
  {
    date: "2025-09-18",
    descriptionJa: "E522: AURALIS Gen-2復活、文化的指標急上昇",
    descriptionEn: "E522: AURALIS Gen-2 Revival — cultural index surges",
    affectedSymbols: ["AURAL", "LSOL", "ACARL"],
    impact: 10,
  },
  {
    date: "2025-11-05",
    descriptionJa: "E528: リミナル・フォージ発射、技術株ブーム",
    descriptionEn: "E528: Liminal Forge launch — tech sector boom",
    affectedSymbols: ["FARUJA", "LORENTZ", "ALOE", "NCORI"],
    impact: 12.5,
  },
  {
    date: "2025-12-01",
    descriptionJa: "グランベルGDP上方修正、文明圏指標全体上昇",
    descriptionEn: "Grandel GDP upward revision — civilization indices rise",
    affectedSymbols: ["GRANDEL", "UECO", "ACARL"],
    impact: 8,
  },
  {
    date: "2025-07-14",
    descriptionJa: "ティエリア軍事演習、THORON受注増加",
    descriptionEn: "Tyeria military exercises — THORON orders surge",
    affectedSymbols: ["THORON", "GHAUS", "TYERIA"],
    impact: 7.5,
  },
  {
    date: "2025-10-20",
    descriptionJa: "ディオクレニス次元探査成功、NCORI急上昇",
    descriptionEn: "Dioclenis dimensional probe success — NCORI surges",
    affectedSymbols: ["NCORI", "DIOCLE", "LORENTZ"],
    impact: 11,
  },
  {
    date: "2025-05-30",
    descriptionJa: "ゴールデン・ヴェノム摘発、GOLDV暴落",
    descriptionEn: "Golden Venom crackdown — GOLDV crashes",
    affectedSymbols: ["GOLDV", "TINGUE"],
    impact: -22,
  },
  {
    date: "2026-01-08",
    descriptionJa: "ファルージャ評議会新体制、MAMON上昇",
    descriptionEn: "Fallujah Council reform — MAMON rises",
    affectedSymbols: ["MAMON", "MCERN", "FALLUJA"],
    impact: 6.5,
  },
]

// ─── Asset Definitions ───
// foundedEra assignments based on E16 universe lore:
//   E0:   First settlers arrive (AD3500)
//   E97:  n-token economy established, Corporatum Publica formed
//   E100: Third prosperity period
//   E120: Dimensional tech era (Dimension Horizon)
//   E150: Maastricht Revolution, free economy
//   E200: Post-Lombardia military expansion
//   E270: AURALIS Proto founded
//   E289: Fifth prosperity, Dimension Bridges
//   E290: AURALIS Collective organized
//   E301: ZAMLT founded
//   E318: Alpha Kane awakens, ZAMLT collapses
//   E325: Layla joins AURALIS
//   E380: Tyeria #3, Queen Liana era
//   E400: Slime Crisis ends, Tina/Gue underground control
//   E420: Evatron Sigma-Unit (Alpha Venom origin)
//   E475: Evatron collapses, Golden/Alpha Venom split
//   E480: Fiona / Blue Rose rises
//   E485: Ike Lopez / SS Range
//   E488: Iron Syndicate / Raid Kakizaki
//   E490: Mikael Gabrieli / V7 era
//   E493: Madris Cernel / Fallujah
//   E495: Arzen Carleeen / Nathan Corind (Cosmic Assembly)

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
    foundedEra: 290,
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
    foundedEra: 475,
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
// Generates deterministic prices from each asset's foundedEra to MAX_ERA.
// Uses seeded PRNG so historical data is identical on every page load.
// Only prices up to getCurrentEra() are exposed for display → daily updates.

function generatePrices(def: AssetDefinition): AssetPrice[] {
  const seed = hashString(def.symbol + "_E16_MARKET_v2")
  const rng = mulberry32(seed)

  // Date range: from foundedEra to MAX_ERA
  const startStr = eraToDateStr(def.foundedEra)
  const endStr = eraToDateStr(MAX_ERA)

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
      // Strong uptrend period
      dailyReturn += 0.008
    } else if (trendSeed < 0.15) {
      // Downtrend period
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

    // Ensure price is always positive
    close = Math.max(close, 1)

    // Generate realistic intraday high/low
    const dayVol = Math.abs(close - open) / open
    const rangeMultiplier = 1.5 + rng() * 2.5
    const high = Math.max(open, close) * (1 + dayVol * rangeMultiplier * 0.5)
    let low = Math.min(open, close) * (1 - dayVol * rangeMultiplier * 0.5)
    low = Math.max(low, 0.5)

    // Volume: base volume + randomness + spike on events
    let volume = (1_000_000 + rng() * 4_000_000) * (def.type === "crypto" ? 0.3 : 1)
    if (eventImpact !== undefined) {
      volume *= 2.5 + Math.abs(eventImpact) / 10
    }
    // Volume tends to be higher on big move days
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

function formatMarketCap(price: number, symbol: string): string {
  // Fake but realistic market caps based on price
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

/** Full price cache (foundedEra → MAX_ERA) for composite index computation */
const fullPriceCache = new Map<string, AssetPrice[]>()
/** Display-ready asset cache (filtered to current era) */
const assetCache = new Map<string, Asset>()

function buildAsset(def: AssetDefinition): Asset {
  const cached = assetCache.get(def.symbol)
  if (cached) {
    return cached
  }

  // Get or generate full prices
  let fullPrices = fullPriceCache.get(def.symbol)
  if (!fullPrices) {
    fullPrices = generatePrices(def)
    fullPriceCache.set(def.symbol, fullPrices)
  }

  // Filter to current era for display
  const currentEra = getCurrentEra()
  const prices = fullPrices.filter((p) => dateToEra(p.date) <= currentEra)

  if (prices.length < 2) {
    // Not enough data yet (asset too new)
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

  const lastPrice = prices[prices.length - 1]!.close
  const prevPrice = prices[prices.length - 2]!.close
  const change = lastPrice - prevPrice
  const changePercent = (change / prevPrice) * 100

  const asset: Asset = {
    symbol: def.symbol,
    name: def.name,
    nameEn: def.nameEn,
    type: def.type,
    sector: def.sector,
    affiliation: def.affiliation,
    prices,
    currentPrice: lastPrice,
    change24h: change,
    changePercent24h: changePercent,
    marketCap: def.type !== "crypto" ? formatMarketCap(lastPrice, def.symbol) : undefined,
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

  const allAssets = getAllAssets()
  const stocks = allAssets.filter((a) => a.type === "stock")
  const indices = allAssets.filter((a) => a.type === "index")
  const cryptos = allAssets.filter((a) => a.type === "crypto")

  // Weight per asset within its type group
  const stockWeight = stocks.length > 0 ? 0.35 / stocks.length : 0
  const indexWeight = indices.length > 0 ? 0.3 / indices.length : 0
  const cryptoWeight = cryptos.length > 0 ? 0.35 / cryptos.length : 0

  // Gather all full price arrays (needed for composite calculation)
  const allFullPrices = ASSET_DEFS.map((def) => {
    let fp = fullPriceCache.get(def.symbol)
    if (!fp) {
      fp = generatePrices(def)
      fullPriceCache.set(def.symbol, fp)
    }
    return { def, prices: fp }
  })

  // Find the era range
  const currentEra = getCurrentEra()
  const minEra = Math.min(...ASSET_DEFS.map((d) => d.foundedEra))

  // Build era → date mapping for the composite
  const compositeStartStr = eraToDateStr(minEra)
  const compositeEndStr = eraToDateStr(currentEra)
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
      // Get previous day's price
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

  const lastPrice = compositePrices[compositePrices.length - 1]?.close ?? baseValue
  const prevPrice = compositePrices[compositePrices.length - 2]?.close ?? baseValue
  const change = lastPrice - prevPrice
  const changePercent = (change / prevPrice) * 100

  const composite: Asset = {
    symbol: "E16MC",
    name: "E16 マーケット総合指数",
    nameEn: "E16 Market Composite",
    type: "index",
    sector: "Composite",
    prices: compositePrices,
    currentPrice: lastPrice,
    change24h: change,
    changePercent24h: changePercent,
    marketCap: undefined,
    foundedEra: minEra,
  }

  compositeCache = composite
  return composite
}
