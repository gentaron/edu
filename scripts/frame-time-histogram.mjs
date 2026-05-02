#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════
   Frame-Time Histogram Benchmark
   Runs cpuParticleIntegration with 2000 particles for 60 frames,
   captures per-frame timing, and generates an ASCII histogram
   with p50/p95/p99 percentile output and JSON CI artifact.
   ═══════════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// cpuParticleIntegration  (inlined from src/metal/webgpu/particle-compute.ts)
// Pure CPU fallback – no GPU or external deps required.
// ---------------------------------------------------------------------------
function cpuParticleIntegration(particles, dt, canvasWidth, canvasHeight, gravity) {
  return particles
    .map((p) => {
      const newVy = p.vy + gravity * dt;
      const newPx = p.x + p.vx * dt * dt;
      const newPy = p.y + newVy * dt * dt;
      let fx = newPx;
      let fy = newPy;
      let fvx = p.vx;
      let fvy = newVy;
      if (fx < 0 || fx > canvasWidth) {
        fvx *= -0.5;
        fx = Math.max(0, Math.min(canvasWidth, fx));
      }
      if (fy < 0 || fy > canvasHeight) {
        fvy *= -0.5;
        fy = Math.max(0, Math.min(canvasHeight, fy));
      }
      const newLife = p.life - dt * 1000;
      return { x: fx, y: fy, vx: fvx, vy: fvy, life: newLife, size: p.size };
    })
    .filter((p) => p.life > 0);
}

// ---------------------------------------------------------------------------
// Particle generator  (mirrors compute.bench.ts)
// ---------------------------------------------------------------------------
function generateParticles(count, canvasW, canvasH) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasW,
    y: Math.random() * canvasH,
    vx: (Math.random() - 0.5) * 300,
    vy: (Math.random() - 0.5) * 300 - 100,
    life: 500 + Math.random() * 1500,
    size: 2 + Math.random() * 4,
  }));
}

// ---------------------------------------------------------------------------
// Histogram bins  (ms)
// ---------------------------------------------------------------------------
const BINS = [
  { label: "  0 –  2 ms", lo: 0,  hi: 2  },
  { label: "  2 –  4 ms", lo: 2,  hi: 4  },
  { label: "  4 –  6 ms", lo: 4,  hi: 6  },
  { label: "  6 –  8 ms", lo: 6,  hi: 8  },
  { label: "  8 – 10 ms", lo: 8,  hi: 10 },
  { label: " 10 – 12 ms", lo: 10, hi: 12 },
  { label: " 12 – 16 ms", lo: 12, hi: 16 },
  { label: " 16 – 20 ms", lo: 16, hi: 20 },
  { label: " 20 ms +   ", lo: 20, hi: Infinity },
];

const BAR_CHAR = "█";

// ---------------------------------------------------------------------------
// Percentile helper
// ---------------------------------------------------------------------------
function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

// ---------------------------------------------------------------------------
// Main benchmark runner
// ---------------------------------------------------------------------------
const PARTICLE_COUNT = 2000;
const FRAME_COUNT = 60;
const CANVAS_W = 800;
const CANVAS_H = 600;
const DT = 0.016_67; // ~60 fps timestep
const GRAVITY = 300;

function runBenchmark() {
  const frameTimes = [];
  let particles = generateParticles(PARTICLE_COUNT, CANVAS_W, CANVAS_H);

  // Warm-up iteration (not measured)
  particles = cpuParticleIntegration(particles, DT, CANVAS_W, CANVAS_H, GRAVITY);

  for (let frame = 0; frame < FRAME_COUNT; frame++) {
    const start = performance.now();
    particles = cpuParticleIntegration(particles, DT, CANVAS_W, CANVAS_H, GRAVITY);

    // Simulate particle emission every 5 frames (matching bench scenario)
    if (frame % 5 === 0) {
      const burst = generateParticles(50, CANVAS_W, CANVAS_H);
      particles = [...particles, ...burst];
    }

    const elapsed = performance.now() - start;
    frameTimes.push(elapsed);
  }

  return frameTimes;
}

// ---------------------------------------------------------------------------
// Histogram rendering
// ---------------------------------------------------------------------------
function buildHistogram(frameTimes) {
  const counts = new Array(BINS.length).fill(0);

  for (const t of frameTimes) {
    const binIdx = BINS.findIndex((b) => t >= b.lo && t < b.hi);
    if (binIdx !== -1) {
      counts[binIdx]++;
    } else {
      // Fallback: goes into the last bin (20ms+)
      counts[counts.length - 1]++;
    }
  }

  const maxCount = Math.max(...counts, 1);
  const scale = 40 / maxCount; // max bar width of 40 chars

  const rows = BINS.map((bin, i) => {
    const count = counts[i];
    const bar = BAR_CHAR.repeat(Math.round(count * scale));
    return `${bin.label} │${bar.padEnd(40)}│ ${count}`;
  });

  return { rows, counts };
}

// ---------------------------------------------------------------------------
// JSON artifact
// ---------------------------------------------------------------------------
function buildArtifact(frameTimes, hist) {
  const sorted = [...frameTimes].sort((a, b) => a - b);

  const bins = BINS.map((bin, i) => ({
    label: bin.label.trim(),
    lo: bin.lo,
    hi: bin.hi === Infinity ? null : bin.hi,
    count: hist.counts[i],
  }));

  return {
    benchmark: "cpu-particle-integration",
    particleCount: PARTICLE_COUNT,
    frameCount: FRAME_COUNT,
    canvasWidth: CANVAS_W,
    canvasHeight: CANVAS_H,
    dt: DT,
    gravity: GRAVITY,
    timestamp: new Date().toISOString(),
    frameTimes: frameTimes.map((t) => Math.round(t * 1000) / 1000), // ms, 3 decimal
    summary: {
      mean: Math.round((frameTimes.reduce((s, t) => s + t, 0) / frameTimes.length) * 1000) / 1000,
      min: Math.round(sorted[0] * 1000) / 1000,
      max: Math.round(sorted[sorted.length - 1] * 1000) / 1000,
      p50: Math.round(percentile(sorted, 50) * 1000) / 1000,
      p95: Math.round(percentile(sorted, 95) * 1000) / 1000,
      p99: Math.round(percentile(sorted, 99) * 1000) / 1000,
      stdDev: Math.round(
        Math.sqrt(
          frameTimes.reduce((s, t) => s + (t - frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length) ** 2, 0) /
            frameTimes.length
        ) * 1000
      ) / 1000,
    },
    histogram: bins,
  };
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        Frame-Time Histogram — Particle Compute Benchmark    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log(`  Particles : ${PARTICLE_COUNT}`);
  console.log(`  Frames    : ${FRAME_COUNT}`);
  console.log(`  Canvas    : ${CANVAS_W}×${CANVAS_H}`);
  console.log(`  dt        : ${DT} ms`);
  console.log(`  Gravity   : ${GRAVITY}`);
  console.log();

  const frameTimes = runBenchmark();
  const sorted = [...frameTimes].sort((a, b) => a - b);
  const hist = buildHistogram(frameTimes);
  const mean = frameTimes.reduce((s, t) => s + t, 0) / frameTimes.length;

  // Print histogram
  console.log("  Frame-Time Distribution");
  console.log("  ──────────────────────────────────────────────────────────────");
  for (const row of hist.rows) {
    console.log(`  ${row}`);
  }
  console.log("  ──────────────────────────────────────────────────────────────");
  console.log();

  // Print percentiles
  console.log("  Latency Percentiles");
  console.log("  ──────────────────────────────────────────────────────────────");
  console.log(`  Min    : ${sorted[0].toFixed(3)} ms`);
  console.log(`  Mean   : ${mean.toFixed(3)} ms`);
  console.log(`  Max    : ${sorted[sorted.length - 1].toFixed(3)} ms`);
  console.log(`  P50    : ${percentile(sorted, 50).toFixed(3)} ms`);
  console.log(`  P95    : ${percentile(sorted, 95).toFixed(3)} ms`);
  console.log(`  P99    : ${percentile(sorted, 99).toFixed(3)} ms`);
  console.log("  ──────────────────────────────────────────────────────────────");
  console.log();

  // Write JSON artifact
  const artifact = buildArtifact(frameTimes, hist);
  const outPath = join(dirname(fileURLToPath(import.meta.url)), "..", "test-results", "frame-time-histogram.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(artifact, null, 2) + "\n");
  console.log(`  JSON artifact → ${outPath}`);
  console.log();

  // CI-friendly summary line
  console.log(`  ::frame-time-histogram:: p50=${artifact.summary.p50}ms  p95=${artifact.summary.p95}ms  p99=${artifact.summary.p99}ms  mean=${artifact.summary.mean}ms  frames=${FRAME_COUNT}  particles=${PARTICLE_COUNT}`);
}

main();
