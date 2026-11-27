/**
 * EDU Triadic State Model, version 5 — "now only".
 *
 * No time evolution, no burn-in, no history, no time slider. The present state of every
 * contemporary is the self-consistent mean-field equilibrium of a three-axis spin system
 * evaluated in today's environment:
 *
 *   x = (x_h, x_w, x_a) ∈ (-1, 1)³,   health h = (1+x_h)/2, wealth index = (1+x_w)/2, authority a = (1+x_a)/2
 *   -E(x) = Σ_k b_k x_k + Σ_{k<l} J_kl x_k x_l + g x_h x_w x_a + γ Σ_k x_k m_k
 *   x_k = tanh(∂(-E)/∂x_k)      (mean-field self-consistency)
 *
 * The three-point (triadic) term g·x_h·x_w·x_a enters each axis as g × (product of the other two),
 * so its contribution is bounded by |g| and can never push a value to the boundary by itself.
 * Couplings satisfy ‖J‖₂ + |g| + γ < 1, so the map is a contraction near the interior and the
 * equilibrium is unique; the solver reports its residual.
 * Shared coefficients only. Names, gender identity and sexual orientation never enter.
 */
export const MODEL_VERSION = 5;
export const ANCHOR = Date.UTC(2026, 10, 27);
export const COUPLING = { hw: .22, ha: .16, wa: .26, g: .3, peer: .2, sigma: .6 };

const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const sigmoid = x => 1 / (1 + Math.exp(-x));

/** FNV-1a 32-bit hash of a string; seeds each person's stable individual draws. */
export function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h >>> 0;
}
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296 };
}
const normal = r => Math.sqrt(-2 * Math.log(Math.max(r(), 1e-12))) * Math.cos(2 * Math.PI * r());

/** Today's regional environment (canon 197-day planetary and 29-year binary phases at this instant only). */
export function environment(region, phase, feedback) {
  const underground = /underground/i.test(region), eros = /Eros-7/i.test(region), market = /Granbell/i.test(region);
  const tax = feedback.wealth, social = feedback.authority, fragility = Math.max(0, -feedback.health);
  return {
    pressure: clip(.22 + (underground ? .26 : 0) + (eros ? .26 : 0) + .04 * phase.planet + .015 * phase.binary + .08 * fragility - .04 * social, 0, .9),
    care: clip(.62 - (underground ? .2 : 0) + (market ? .1 : 0) + .06 * tax + .04 * social - .04 * fragility, .1, .95),
    opportunity: clip(.52 - (underground ? .22 : 0) + (market ? .15 : 0) + .07 * tax + .03 * social - .05 * fragility, .05, .98),
  };
}

/** Local fields ∂(-E)/∂x for one person. Exported so the triadic term can be inspected and tested. */
export function fields(x, e, expression, peer, xi) {
  const C = COUPLING;
  const bh = 1.1 * (e.care - e.pressure) + .8 * (expression - .5) - .05;
  const bw = 1.4 * (e.opportunity - .5) - .6 * e.pressure + .05;
  const ba = .1 - .5 * e.pressure;
  const triad = [C.g * x[1] * x[2], C.g * x[0] * x[2], C.g * x[0] * x[1]];
  return {
    field: [
      bh + C.hw * x[1] + C.ha * x[2] + triad[0] + C.peer * peer[0] + C.sigma * xi[0],
      bw + C.hw * x[0] + C.wa * x[2] + triad[1] + C.peer * peer[1] + C.sigma * xi[1],
      ba + C.ha * x[0] + C.wa * x[1] + triad[2] + C.peer * peer[2] + C.sigma * xi[2],
    ],
    triad,
  };
}

/** Phase of the canon cycles at a given instant (no simulation, just today's position on the cycle). */
export function phaseAt(date) {
  const t = (date.getTime() - ANCHOR) / 86_400_000;
  return { day: Math.floor(t), planet: Math.sin(2 * Math.PI * t / 197), binary: Math.sin(2 * Math.PI * t / (29 * 365.2425)) };
}

/**
 * Present state of all contemporaries at `date`. Solved jointly because peers and regional
 * services depend on everyone's state (damped fixed-point iteration, tolerance 1e-10).
 */
export function computeNow(people, date = new Date()) {
  const N = people.length, phase = phaseAt(date);
  if (!N) return { version: MODEL_VERSION, day: phase.day, states: [], convergence: { iterations: 0, residual: 0 } };
  const zones = people.map(p => p.regionEn || "Unspecified");
  const zoneList = [...new Set(zones)], zoneIndex = zones.map(z => zoneList.indexOf(z));
  const members = zoneList.map((_, k) => people.map((p, i) => [p.id, i]).filter(([, i]) => zoneIndex[i] === k).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([, i]) => i));
  // Stable individual draws from the person ID only (independent of roster order).
  const person = people.map((p, i) => {
    const r = rng(hash(p.id));
    const xi = [normal(r), normal(r), normal(r)];
    const genome = Array.from({ length: 12 }, () => +(r() < .5));
    const local = members[zoneIndex[i]];
    const neighbors = Array.from({ length: 6 }, () => (r() < .8 ? local[Math.floor(r() * local.length)] : Math.floor(r() * N))).filter(j => j !== i);
    return { xi, genome, gene: genome.reduce((a, b) => a + b, 0) / 12, locus0: (genome[0] + genome[6]) / 2, neighbors, leverage: Math.exp(.7 * normal(r)) };
  });
  let x = people.map(() => [0, 0, 0]), residual = Infinity, iterations = 0, env = [], expr = [];
  for (; iterations < 2000 && residual > 1e-10; iterations++) {
    env = zoneList.map((z, k) => {
      const m = members[k], mean = [0, 0, 0];
      for (const i of m) for (let d = 0; d < 3; d++) mean[d] += x[i][d] / m.length;
      return environment(z, phase, { health: mean[0], wealth: mean[1], authority: mean[2] });
    });
    residual = 0;
    const next = x.map((xi, i) => {
      const e = env[zoneIndex[i]], p = person[i];
      const expression = sigmoid(2 * (p.locus0 - .5) * (2 * e.pressure - 1) + .4 * (p.gene - .5) + 1.5 * (e.care - e.pressure) + .35 * xi[0]);
      expr[i] = expression;
      const peer = [0, 0, 0];
      for (const j of p.neighbors) for (let d = 0; d < 3; d++) peer[d] += x[j][d] / Math.max(1, p.neighbors.length);
      const f = fields(xi, e, expression, peer, p.xi).field;
      return xi.map((v, d) => { const n = .5 * v + .5 * Math.tanh(f[d]); residual = Math.max(residual, Math.abs(n - v)); return n });
    });
    x = next;
  }
  const states = x.map((xi, i) => {
    const e = env[zoneIndex[i]], p = person[i];
    const wi = (1 + xi[1]) / 2;
    const w = 5 * Math.tan(Math.PI * (clip(wi, 1e-6, 1 - 1e-6) - .5)); // inverse of the display index; heavy (Cauchy-type) tails
    const debt = Math.max(0, -w) + .8 * p.leverage * (.3 + e.pressure);
    const tri = fields(xi, e, expr[i], [0, 0, 0], [0, 0, 0]).triad;
    return {
      h: (1 + xi[0]) / 2, w, a: (1 + xi[2]) / 2, assets: w + debt, debt, expression: expr[i],
      care: e.care, pressure: e.pressure, opportunity: e.opportunity,
      triad: COUPLING.g * xi[0] * xi[1] * xi[2], triadField: tri,
      alleles: p.genome.slice(0, 6).join("") + " / " + p.genome.slice(6).join(""),
    };
  });
  return { version: MODEL_VERSION, day: phase.day, states, convergence: { iterations, residual } };
}
