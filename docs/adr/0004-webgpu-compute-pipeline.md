# ADR-0004: WebGPU Compute + Zero-Copy WASM Boundary

## Status

Accepted

## Context

The EDU battle renderer uses Canvas 2D for all visual output, including a particle system (ParticleEmitter) with up to 4096 particles and AoE damage visualization. As particle count grows, the CPU-based Verlet integration becomes a bottleneck, particularly on integrated graphics where the main thread is also responsible for game logic, UI, and network I/O.

Additionally, the JS↔WASM boundary involves structured-clone copies when passing battle state between the Rust/WASM engine and TypeScript rendering layer. Each `wasmExecuteEnemyTurn()` call serializes the entire field state to JSON, deserializes it on the WASM side, computes, then serializes back. This is wasteful for high-frequency battle updates.

## Decision

We introduce a WebGPU compute substrate under `src/metal/webgpu/` that offloads heavy math to the GPU while maintaining Canvas 2D rendering. A zero-copy ring buffer bridges WASM linear memory and JS-side rendering.

### Architecture

```
┌──────────────┐   compute   ┌──────────────┐   readback   ┌──────────────┐
│  WebGPU       │────────────>│  GPU Storage  │────────────>│  CPU Buffer  │
│  Compute      │             │  (particle   │             │  (Float32    │
│  Shaders      │             │   positions) │             │   Array)     │
└──────────────┘             └──────────────┘             └──────┬───────┘
                                                                   │
                              ┌──────────────┐    copy           │
                              │  SharedArray │<──────────────────┘
                              │  Ring Buffer  │    (zero-copy when
                              │  (1MB)        │     COOP/COEP set)
                              └──────┬───────┘
                                     │
                              ┌──────┴───────┐
                              │  Canvas 2D    │
                              │  Renderer     │
                              │  (read-only)  │
                              └──────────────┘
```

### Tiered Capability Detection

| Tier | Condition | Behavior |
|------|-----------|----------|
| FULL_COMPUTE (2) | WebGPU + SharedArrayBuffer | GPU compute + zero-copy ring buffer |
| COMPUTE_NO_SHARED (1) | WebGPU only | GPU compute + message-passing fallback |
| UNAVAILABLE (0) | No WebGPU | CPU particle integration (existing path) |

### Components

1. **`device.ts`** — GPU adapter/device lifecycle, feature detection, graceful degradation
2. **`particle-compute.ts`** — Verlet particle integration on GPU (WGSL, 64 workgroup size, 4096 max particles)
3. **`aoe-falloff.ts`** — AoE damage falloff field computation (linear/smoothstep/exponential)
4. **`ring-buffer.ts`** — Lock-free SPSC ring buffer (SharedArrayBuffer with Atomics, fallback to structured clone)
5. **`shaders/*.wgsl`** — WGSL source files for reference and future WebGPU pipeline evolution

### COOP/COEP Headers

Netlify configuration updated to set:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Without these headers, `SharedArrayBuffer` is unavailable and the ring buffer falls back to message-passing with structured clone copies.

## Consequences

### Positive
- Particle integration scales to 4096+ particles on GPU, leaving CPU free for game logic
- AoE damage fields computed in parallel (256 workgroups of 16x16 = 65,536 cells)
- Zero-copy WASM↔JS boundary when COOP/COEP is available
- Graceful degradation ensures correctness on all browsers
- 54 unit + PBT tests ensure CPU fallback parity with GPU path

### Negative
- Additional ~20KB TypeScript bundle for WebGPU infrastructure
- WebGPU availability is still limited in some mobile browsers
- COOP/COEP headers may require CORS adjustments for third-party resources
- GPU buffer readback introduces 1-2 frame latency (acceptable for visual effects)

### Risks
- WebGPU in CI (headless Chrome) may require `--enable-unsafe-webgpu` flag
- SharedArrayBuffer on Netlify free-tier needs verification (COOP/COEP headers supported)
- Particle readback latency may exceed 16ms frame budget on low-end GPUs

## Lore Mapping

| Tech artifact | Canon mapping |
|---|---|
| WebGPU compute shaders | Dimensional Horizon Force Projection — raw elemental computation at the boundary layer |
| Particle integration | 8 Thought Layers — kinetic thought propagation through the dimensional substrate |
| AoE damage falloff | Apolonium quantum probability decay — probability amplitude attenuates with distance |
| Zero-copy ring buffer | AURALIS Collective memory bridge — instantaneous shared consciousness between computation and manifestation |
| COOP/COEP headers | Dimensional isolation wards — protecting the boundary from cross-dimensional contamination |

## Metrics

- 54 new tests (9 device, 18 ring buffer, 11 particle compute, 10 AoE falloff, 6 canvas parity)
- 13 new PBT properties
- 12 benchmark cases (particle integration, AoE falloff, ring buffer throughput, frame-time simulation)
- CPU fallback preserves Canvas 2D correctness (symmetry, bounds, deterministic output)
