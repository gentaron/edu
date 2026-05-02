/* ═══════════════════════════════════════════════════════
   L6 PRESENTATION — Canvas Battle Renderer (barrel export)
   ═══════════════════════════════════════════════════════ */

// Core
export { FrameBudget } from "./battle-renderer"
export { TextureAtlas } from "./battle-renderer"
export { Tween, Easing } from "./battle-renderer"
export type { EasingFunction, TweenConfig } from "./battle-renderer"
export { AnimationTimeline } from "./battle-renderer"

// Sprite system
export { Sprite, SpriteBatch, CardSprite, EnemySprite } from "./battle-renderer"

// Particle system
export { Particle, ParticleEmitter } from "./battle-renderer"
export type { ParticleConfig } from "./battle-renderer"

// Main renderer
export { BattleRenderer } from "./battle-renderer"

// State types
export type { PlayerCardState, EnemyState } from "./battle-renderer"
