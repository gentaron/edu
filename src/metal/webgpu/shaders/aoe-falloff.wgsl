/* ═══════════════════════════════════════════════════════════════
   WebGPU Compute Shader — AoE Damage Falloff Field
   Epoch-12 Delta — Dimensional Horizon Force Projection
   ═══════════════════════════════════════════════════════════════

   Computes a 2D damage falloff field for AoE abilities.
   Input:  origin (fx, fy), radius, max_damage, field dimensions
   Output: damage values per grid cell

   Grid is param.grid_w x param.grid_h cells.
   Each cell stores one f32 damage value.

   Workgroup size: 16x16 = 256
   ═══════════════════════════════════════════════════════════════ */

struct AoEUniforms {
  origin_x  : f32,
  origin_y  : f32,
  radius    : f32,
  max_damage: f32,
  grid_w    : u32,
  grid_h    : u32,
  cell_size : f32,
  falloff   : f32,  // 0.0 = linear, 1.0 = smoothstep, 2.0 = exponential
};

@group(0) @binding(0) var<storage, read_write> damage_field : array<f32>;
@group(0) @binding(1) var<uniform> params : AoEUniforms;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) gid : vec3u) {
  let cell_x = gid.x;
  let cell_y = gid.y;

  if (cell_x >= params.grid_w || cell_y >= params.grid_h) {
    return;
  }

  // Cell center position in world space
  let wx = f32(cell_x) * params.cell_size + params.cell_size * 0.5;
  let wy = f32(cell_y) * params.cell_size + params.cell_size * 0.5;

  // Distance from AoE origin
  let dx = wx - params.origin_x;
  let dy = wy - params.origin_y;
  let dist = sqrt(dx * dx + dy * dy);

  // Compute damage based on distance and falloff type
  var damage = 0.0;

  if (dist <= params.radius) {
    let t = dist / params.radius; // normalized distance [0, 1]

    if (params.falloff < 0.5) {
      // Linear falloff
      damage = params.max_damage * (1.0 - t);
    } else if (params.falloff < 1.5) {
      // Smoothstep falloff (hermite interpolation)
      let s = t * t * (3.0 - 2.0 * t);
      damage = params.max_damage * (1.0 - s);
    } else {
      // Exponential falloff
      damage = params.max_damage * exp(-3.0 * t * t);
    }
  }

  // Write damage to grid
  let idx = cell_y * params.grid_w + cell_x;
  damage_field[idx] = damage;
}
