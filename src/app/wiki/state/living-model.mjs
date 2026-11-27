/**
 * EDU relational equilibrium v6. The cubic vertex is g Tr(Φ³)/(6D), with a
 * sparse symmetric person-to-person field Φ and zero diagonal. The three
 * displayed state coordinates evolve under its gradient at the present
 * environment, without a time integration or an assumed uniqueness theorem.
 */
export const MODEL_VERSION = 6;
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

/** Undirected model relations: sampled peers, plus ties closing consecutive peer pairs. */
export function buildRelationalGraph(neighbors, zones) {
  const adjacency = neighbors.map(() => new Map());
  const edges = [];
  const local = [.5, .3, .2], distant = [.2, .35, .45];
  const connect = (i, j) => {
    if (i === j || adjacency[i].has(j)) return;
    const edge = edges.length;
    edges.push({ i, j, weights: zones[i] === zones[j] ? local : distant });
    adjacency[i].set(j, edge);
    adjacency[j].set(i, edge);
  };
  neighbors.forEach((peers, i) => {
    const unique = [...new Set(peers)].filter(j => j !== i);
    unique.forEach((j, k) => {
      connect(i, j);
      if (k > 0) connect(unique[k - 1], j);
    });
  });

  const triangles = [], counts = neighbors.map(() => 0);
  for (let i = 0; i < adjacency.length; i++) {
    for (const [j, ij] of adjacency[i]) {
      if (j <= i) continue;
      for (const [k, jk] of adjacency[j]) {
        if (k <= j) continue;
        const ki = adjacency[i].get(k);
        if (ki === undefined) continue;
        triangles.push({ nodes: [i, j, k], links: [ij, jk, ki] });
        counts[i]++; counts[j]++; counts[k]++;
      }
    }
  }
  const normalization = counts.reduce((max, count) => Math.max(max, count), 1);
  return { edges, triangles, counts, normalization };
}

/**
 * Compute the trace exactly on sparse support: each unordered triangle accounts
 * for six ordered closed walks. The diagonal contributions sum to the potential.
 */
export function cubicVertex(x, graph, inspect = false) {
  const scale = COUPLING.g / graph.normalization;
  const values = graph.edges.map(({ i, j, weights }) =>
    weights.reduce((value, w, d) => value + w * (x[i][d] + x[j][d]) / 2, 0));
  const gradient = x.map(() => [0, 0, 0]);
  const diagonal = inspect ? x.map(() => 0) : [];
  const strongest = inspect ? x.map(() => null) : [];
  let sum = 0;
  const addGradient = (edge, otherLinks) => {
    const { i, j, weights } = graph.edges[edge];
    const force = scale * otherLinks / 2;
    for (let d = 0; d < 3; d++) {
      const part = weights[d] * force;
      gradient[i][d] += part;
      gradient[j][d] += part;
    }
  };
  for (const { nodes, links: [ij, jk, ki] } of graph.triangles) {
    const a = values[ij], b = values[jk], c = values[ki];
    const product = a * b * c;
    sum += product;
    addGradient(ij, b * c);
    addGradient(jk, c * a);
    addGradient(ki, a * b);
    if (inspect) {
      for (const i of nodes) {
        diagonal[i] += scale * product / 3;
        if (!strongest[i] || Math.abs(product) > Math.abs(strongest[i].product)) {
          strongest[i] = { nodes, links: [a, b, c], product };
        }
      }
    }
  }
  return { trace: 6 * sum, potential: scale * sum, gradient, diagonal, strongest };
}

/** Local field with the relational vertex evaluated against the full population. */
function fields(x, e, expression, peer, xi, relationalField) {
  const C = COUPLING;
  const bh = 1.1 * (e.care - e.pressure) + .8 * (expression - .5) - .05;
  const bw = 1.4 * (e.opportunity - .5) - .6 * e.pressure + .05;
  const ba = .1 - .5 * e.pressure;
  return [
    bh + C.hw * x[1] + C.ha * x[2] + relationalField[0] + C.peer * peer[0] + C.sigma * xi[0],
    bw + C.hw * x[0] + C.wa * x[2] + relationalField[1] + C.peer * peer[1] + C.sigma * xi[1],
    ba + C.ha * x[0] + C.wa * x[1] + relationalField[2] + C.peer * peer[2] + C.sigma * xi[2],
  ];
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
  const tolerance = 1e-10, maxIterations = 2000;
  if (!N) return { version: MODEL_VERSION, day: phase.day, states: [], convergence: { iterations: 0, residual: 0, converged: true } };
  // Use canonical ID order for both sampling and floating-point accumulation.
  const order = people.map((p, i) => ({ p, i })).sort((a, b) => a.p.id < b.p.id ? -1 : a.p.id > b.p.id ? 1 : 0);
  const zones = order.map(({ p }) => p.regionEn || "Unspecified");
  const zoneList = [...new Set(zones)], zoneIndex = zones.map(z => zoneList.indexOf(z));
  const members = zoneList.map(() => []);
  zoneIndex.forEach((z, i) => members[z].push(i));
  const person = order.map(({ p }, i) => {
    const r = rng(hash(p.id));
    const xi = [normal(r), normal(r), normal(r)];
    const genome = Array.from({ length: 12 }, () => +(r() < .5));
    const local = members[zoneIndex[i]];
    const neighbors = Array.from({ length: 6 }, () => (r() < .8 ? local[Math.floor(r() * local.length)] : Math.floor(r() * N))).filter(j => j !== i);
    return { xi, genome, gene: genome.reduce((a, b) => a + b, 0) / 12, locus0: (genome[0] + genome[6]) / 2, neighbors, leverage: Math.exp(.7 * normal(r)) };
  });
  const graph = buildRelationalGraph(person.map(p => p.neighbors), zones);

  function evaluate(x) {
    const env = zoneList.map((z, k) => {
      const m = members[k], mean = [0, 0, 0];
      for (const i of m) for (let d = 0; d < 3; d++) mean[d] += x[i][d] / m.length;
      return environment(z, phase, { health: mean[0], wealth: mean[1], authority: mean[2] });
    });
    const vertex = cubicVertex(x, graph);
    const expr = [];
    let residual = 0;
    const next = x.map((xi, i) => {
      const e = env[zoneIndex[i]], p = person[i];
      const expression = sigmoid(2 * (p.locus0 - .5) * (2 * e.pressure - 1) + .4 * (p.gene - .5) + 1.5 * (e.care - e.pressure) + .35 * xi[0]);
      expr[i] = expression;
      const peer = [0, 0, 0];
      for (const j of p.neighbors) for (let d = 0; d < 3; d++) peer[d] += x[j][d] / p.neighbors.length;
      const f = fields(xi, e, expression, peer, p.xi, vertex.gradient[i]);
      return xi.map((value, d) => {
        const delta = Math.tanh(f[d]) - value;
        residual = Math.max(residual, Math.abs(delta));
        return value + .5 * delta;
      });
    });
    return { env, expr, next, residual };
  }

  let x = order.map(() => [0, 0, 0]), iterations = 0;
  let current = evaluate(x);
  while (iterations < maxIterations && current.residual > tolerance) {
    x = current.next;
    current = evaluate(x);
    iterations++;
  }
  const vertex = cubicVertex(x, graph, true);
  const states = Array(N);
  for (let i = 0; i < N; i++) {
    const xi = x[i], e = current.env[zoneIndex[i]], p = person[i];
    const wi = (1 + xi[1]) / 2;
    const w = 5 * Math.tan(Math.PI * (clip(wi, 1e-6, 1 - 1e-6) - .5));
    const debt = Math.max(0, -w) + .8 * p.leverage * (.3 + e.pressure);
    const strongest = vertex.strongest[i];
    const start = strongest ? strongest.nodes.indexOf(i) : 0;
    const cycle = strongest ? {
      ids: [0, 1, 2].map(j => order[strongest.nodes[(start + j) % 3]].p.id),
      links: [0, 1, 2].map(j => strongest.links[(start + j) % 3]),
      product: strongest.product,
    } : null;
    states[order[i].i] = {
      h: (1 + xi[0]) / 2, w, a: (1 + xi[2]) / 2, assets: w + debt, debt, expression: current.expr[i],
      care: e.care, pressure: e.pressure, opportunity: e.opportunity,
      triad: vertex.diagonal[i], triadField: vertex.gradient[i], triangleCount: graph.counts[i], cycle,
      alleles: p.genome.slice(0, 6).join("") + " / " + p.genome.slice(6).join(""),
    };
  }
  const { residual } = current;
  return { version: MODEL_VERSION, day: phase.day, states, convergence: { iterations, residual, converged: residual <= tolerance } };
}
