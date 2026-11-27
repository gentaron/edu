/** Descriptive and comparative statistics for the population analytics studio (pure functions). */

export const sum = (x: number[]) => x.reduce((a, b) => a + b, 0)
export const mean = (x: number[]) => (x.length ? sum(x) / x.length : 0)
export function variance(x: number[]) {
  if (x.length < 2) return 0
  const m = mean(x)
  return sum(x.map((v) => (v - m) ** 2)) / (x.length - 1)
}
export const sd = (x: number[]) => Math.sqrt(variance(x))
/** Type-7 (linear interpolation) quantile of a sorted array. */
export function quantileSorted(s: number[], p: number) {
  if (!s.length) return 0
  const h = (s.length - 1) * p, lo = Math.floor(h), hi = Math.ceil(h)
  return s[lo]! + (h - lo) * (s[hi]! - s[lo]!)
}
export const sorted = (x: number[]) => [...x].sort((a, b) => a - b)

export interface Describe { n: number; mean: number; sd: number; median: number; mad: number; q1: number; q3: number; iqr: number; p10: number; p90: number; min: number; max: number; skew: number; kurtosis: number; cv: number; se: number }
/** Moments use adjusted Fisher–Pearson skewness (G1) and excess kurtosis (G2). */
export function describe(x: number[]): Describe {
  const n = x.length, s = sorted(x), m = mean(x), v = variance(x), d = Math.sqrt(v)
  const m2 = sum(x.map((t) => (t - m) ** 2)) / n, m3 = sum(x.map((t) => (t - m) ** 3)) / n, m4 = sum(x.map((t) => (t - m) ** 4)) / n
  const g1 = m2 > 0 ? m3 / m2 ** 1.5 : 0, g2 = m2 > 0 ? m4 / m2 ** 2 - 3 : 0
  const skew = n > 2 ? (Math.sqrt(n * (n - 1)) / (n - 2)) * g1 : 0
  const kurtosis = n > 3 ? ((n - 1) / ((n - 2) * (n - 3))) * ((n + 1) * g2 + 6) : 0
  const median = quantileSorted(s, 0.5)
  const mad = quantileSorted(sorted(x.map((t) => Math.abs(t - median))), 0.5)
  const q1 = quantileSorted(s, 0.25), q3 = quantileSorted(s, 0.75)
  return { n, mean: m, sd: d, median, mad, q1, q3, iqr: q3 - q1, p10: quantileSorted(s, 0.1), p90: quantileSorted(s, 0.9), min: s[0] ?? 0, max: s[n - 1] ?? 0, skew, kurtosis, cv: m !== 0 ? d / Math.abs(m) : 0, se: n ? d / Math.sqrt(n) : 0 }
}

/** Freedman–Diaconis histogram (bins clamped to 8..60). */
export function histogram(x: number[], lo?: number, hi?: number) {
  const s = sorted(x), d = describe(x)
  const a = lo ?? d.min, b = hi ?? d.max
  const width = 2 * d.iqr * Math.cbrt(1 / Math.max(1, x.length))
  const k = Math.max(8, Math.min(60, width > 0 ? Math.ceil((b - a) / width) : 20))
  const step = (b - a) / k || 1
  const counts = Array<number>(k).fill(0)
  for (const v of s) counts[Math.min(k - 1, Math.max(0, Math.floor((v - a) / step)))]!++
  return { lo: a, hi: b, step, counts }
}
/** Gaussian KDE with Silverman's rule-of-thumb bandwidth; returns density on a grid. */
export function kde(x: number[], lo: number, hi: number, points = 120) {
  const d = describe(x)
  const bw = 0.9 * Math.min(d.sd, d.iqr / 1.34 || d.sd) * Math.pow(x.length, -0.2) || 1e-3
  const grid = Array.from({ length: points }, (_, i) => lo + ((hi - lo) * i) / (points - 1))
  const c = 1 / (x.length * bw * Math.sqrt(2 * Math.PI))
  return { bw, grid, density: grid.map((g) => c * sum(x.map((v) => Math.exp(-0.5 * ((g - v) / bw) ** 2)))) }
}

/** Average ranks (ties share the mean rank), 1-based. */
export function ranks(x: number[]) {
  const idx = x.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0])
  const r = Array<number>(x.length)
  for (let i = 0; i < idx.length;) {
    let j = i
    while (j + 1 < idx.length && idx[j + 1]![0] === idx[i]![0]) j++
    for (let k = i; k <= j; k++) r[idx[k]![1]] = (i + j) / 2 + 1
    i = j + 1
  }
  return r
}
export function pearson(x: number[], y: number[]) {
  const mx = mean(x), my = mean(y)
  let sxy = 0, sxx = 0, syy = 0
  for (let i = 0; i < x.length; i++) { const a = x[i]! - mx, b = y[i]! - my; sxy += a * b; sxx += a * a; syy += b * b }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0
}
export const spearman = (x: number[], y: number[]) => pearson(ranks(x), ranks(y))
/** Ordinary least squares y = a + b x. */
export function ols(x: number[], y: number[]) {
  const mx = mean(x), my = mean(y)
  let sxy = 0, sxx = 0
  for (let i = 0; i < x.length; i++) { sxy += (x[i]! - mx) * (y[i]! - my); sxx += (x[i]! - mx) ** 2 }
  const b = sxx > 0 ? sxy / sxx : 0
  return { a: my - b * mx, b, r2: pearson(x, y) ** 2 }
}
/** Fisher z 95% interval for a correlation. */
export function corrCI(r: number, n: number) {
  if (n < 4) return [-1, 1] as const
  const z = Math.atanh(Math.max(-0.999999, Math.min(0.999999, r))), se = 1 / Math.sqrt(n - 3)
  return [Math.tanh(z - 1.96 * se), Math.tanh(z + 1.96 * se)] as const
}

/** Cohen's d of a group against the rest (pooled SD). */
export function cohenD(group: number[], rest: number[]) {
  const n1 = group.length, n2 = rest.length
  if (n1 < 2 || n2 < 2) return 0
  const sp = Math.sqrt(((n1 - 1) * variance(group) + (n2 - 1) * variance(rest)) / (n1 + n2 - 2))
  return sp > 0 ? (mean(group) - mean(rest)) / sp : 0
}
/** One-way ANOVA effect size η² = SS_between / SS_total. */
export function etaSquared(groups: number[][]) {
  const all = groups.flat(), m = mean(all)
  const total = sum(all.map((v) => (v - m) ** 2))
  const between = sum(groups.map((g) => g.length * (mean(g) - m) ** 2))
  return total > 0 ? between / total : 0
}

/** Gini of nonnegative values. */
export function gini(x: number[]) {
  const s = sorted(x.map((v) => Math.max(0, v))), n = s.length, t = sum(s)
  if (!n || !t) return 0
  let acc = 0
  for (let i = 0; i < n; i++) acc += (2 * (i + 1) - n - 1) * s[i]!
  return acc / (n * t)
}
/** Theil T index of positive values. */
export function theil(x: number[]) {
  const p = x.filter((v) => v > 0), m = mean(p)
  return p.length && m > 0 ? mean(p.map((v) => (v / m) * Math.log(v / m))) : 0
}
/** Lorenz curve points (population share, cumulative value share) of nonnegative values. */
export function lorenz(x: number[], points = 100) {
  const s = sorted(x.map((v) => Math.max(0, v))), t = sum(s), n = s.length
  const out: [number, number][] = [[0, 0]]
  let acc = 0, next = 1
  for (let i = 0; i < n; i++) {
    acc += s[i]!
    while (next <= points && (i + 1) / n >= next / points) { out.push([next / points, t ? acc / t : 0]); next++ }
  }
  return out
}
/** Share of the total held by the top fraction p. */
export function topShare(x: number[], p: number) {
  const s = sorted(x.map((v) => Math.max(0, v))), t = sum(s), k = Math.max(1, Math.ceil(s.length * p))
  return t ? sum(s.slice(-k)) / t : 0
}
/** Palma ratio: top 10% share / bottom 40% share. */
export function palma(x: number[]) {
  const s = sorted(x.map((v) => Math.max(0, v))), t = sum(s), n = s.length
  const bottom = sum(s.slice(0, Math.floor(n * 0.4)))
  return t && bottom ? topShare(x, 0.1) / (bottom / t) : Infinity
}
/** Robust z-score using the median and MAD (scaled by 1.4826). */
export const robustZ = (v: number, d: Describe) => (d.mad > 0 ? (v - d.median) / (1.4826 * d.mad) : 0)
/** Signed log transform for heavy-tailed signed quantities. */
export const slog = (v: number) => Math.sign(v) * Math.log10(1 + Math.abs(v))
