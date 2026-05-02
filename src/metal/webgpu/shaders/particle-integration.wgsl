/* ═══════════════════════════════════════════════════════════════
   WebGPU Compute Shader — Particle Integration (Verlet)
   Epoch-12 Delta — Liminal Forge Rendering Substrate
   ═══════════════════════════════════════════════════════════════

   Integrates up to 4096 particles using Verlet integration.
   Each particle has position (x, y), previous position (px, py),
   velocity (vx, vy), life, gravity, and size.

   Layout:
   ─ Per particle (8 x f32 = 32 bytes):
     [x, y, px, py, vx, vy, life, size]

   Uniforms:
     dt          — delta time in seconds
     gravity     — gravitational acceleration
     canvas_w    — canvas width for boundary clamping
     canvas_h    — canvas height for boundary clamping
     particle_n  — active particle count
     time_s      — elapsed time seed for deterministic noise

   Workgroup size: 64
   Max particles: 4096 (64 dispatches)
   ═══════════════════════════════════════════════════════════════ */

struct ParticleUniforms {
  dt        : f32,
  gravity   : f32,
  canvas_w  : f32,
  canvas_h  : f32,
  particle_n: u32,
  time_s    : f32,
  _pad0     : f32,
  _pad1     : f32,
};

@group(0) @binding(0) var<storage, read_write> particles : array<f32>;
@group(0) @binding(1) var<uniform> params : ParticleUniforms;

const STRIDE : u32 = 8u; // floats per particle
const WG_SIZE : u32 = 64u;
const MAX_PARTICLES : u32 = 4096u;

/* Simple pseudo-random hash for deterministic noise */
fn hash(n: u32) -> f32 {
  var x = n;
  x = ((x >> 16u) ^ x) * 0x45d9f3bu;
  x = ((x >> 16u) ^ x) * 0x45d9f3bu;
  x = (x >> 16u) ^ x;
  return f32(x) / 4294967295.0;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid : vec3u) {
  let idx = gid.x;
  if (idx >= params.particle_n || idx >= MAX_PARTICLES) {
    return;
  }

  let base = idx * STRIDE;

  // Read current state
  var px = particles[base + 0u]; // position x
  var py = particles[base + 1u]; // position y
  let old_px = particles[base + 2u]; // previous position x
  let old_py = particles[base + 3u]; // previous position y
  var vx = particles[base + 4u]; // velocity x
  var vy = particles[base + 5u]; // velocity y
  var life = particles[base + 6u]; // remaining life (ms)
  let size = particles[base + 7u]; // particle size

  let dt = params.dt;

  // ── Verlet Integration ──
  // Apply gravity to velocity
  vy += params.gravity * dt;

  // Verlet-style position update:
  // new_pos = pos + (pos - old_pos) + velocity * dt * dt
  let new_px = px + (px - old_px) * 0.98 + vx * dt * dt;
  let new_py = py + (py - old_py) * 0.98 + vy * dt * dt;

  // ── Boundary clamping ──
  // Soft bounce: reflect and dampen when hitting canvas edges
  var final_px = new_px;
  var final_py = new_py;
  var final_vx = vx;
  var final_vy = vy;

  if (final_px < 0.0 || final_px > params.canvas_w) {
    final_vx *= -0.5;
    final_px = clamp(final_px, 0.0, params.canvas_w);
  }
  if (final_py < 0.0 || final_py > params.canvas_h) {
    final_vy *= -0.5;
    final_py = clamp(final_py, 0.0, params.canvas_h);
  }

  // ── Life decay ──
  life -= dt * 1000.0; // dt in seconds, life in ms

  // ── Write back ──
  particles[base + 0u] = final_px;     // position x
  particles[base + 1u] = final_py;     // position y
  particles[base + 2u] = px;           // previous position x (now current)
  particles[base + 3u] = py;           // previous position y (now current)
  particles[base + 4u] = final_vx;     // velocity x
  particles[base + 5u] = final_vy;     // velocity y
  particles[base + 6u] = life;         // remaining life
  // size is immutable — not written back
}
