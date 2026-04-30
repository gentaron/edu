/* ═══════════════════════════════════════════════════════
   L6 PRESENTATION — Canvas 2D Battle Renderer
   Framework-agnostic rendering layer for the card battle system.
   NO React dependencies.
   ═══════════════════════════════════════════════════════ */

// ─── Shared Types ───

/** Maps a normalized time t ∈ [0,1] to a potentially non-linear value. */
export type EasingFunction = (t: number) => number

export interface TweenConfig {
  from: number
  to: number
  duration: number
  easing?: EasingFunction
  onUpdate: (value: number) => void
  onComplete?: () => void
}

export interface ParticleConfig {
  x: number
  y: number
  count: number
  color?: string
  speed?: number
  life?: number
  size?: number
  gravity?: number
  spread?: number
  direction?: number
}

export interface PlayerCardState {
  cardIndex: number
  cardId: string
  name: string
  imageUrl: string
  attack: number
  defense: number
  rarity: string
  hp: number
  maxHp: number
  isDown: boolean
  hasShield: boolean
  shieldValue: number
  hasPoison: boolean
}

export interface EnemyState {
  id: string
  name: string
  imageUrl: string
  difficulty: string
  hp: number
  maxHp: number
  phase: number
}

// ─── Easing Functions ───

export const Easing = {
  linear: (t: number): number => t,

  easeIn: (t: number): number => t * t * t,

  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),

  easeInOut: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),

  bounce: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75
    if (t < 1 / d1) {return n1 * t * t}
    if (t < 2 / d1) {return n1 * (t -= 1.5 / d1) * t + 0.75}
    if (t < 2.5 / d1) {return n1 * (t -= 2.25 / d1) * t + 0.9375}
    return n1 * (t -= 2.625 / d1) * t + 0.984_375
  },

  elastic: (t: number): number => {
    if (t === 0 || t === 1) {return t}
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3))
  },
} as const satisfies Record<string, EasingFunction>

// ─── Constants ───

const TARGET_FRAME_MS = 16.67
const TWO_PI = Math.PI * 2

// ═══════════════════════════════════════════════════════
// CORE CLASSES
// ═══════════════════════════════════════════════════════

// ─── FrameBudget ───

export class FrameBudget {
  private history: number[] = []
  private readonly maxHistory: number = 120

  beginFrame(): number {
    return performance.now()
  }

  endFrame(startTime: number): void {
    const elapsed = performance.now() - startTime
    this.history.push(elapsed)
    if (this.history.length > this.maxHistory) {
      this.history.shift()
    }
    if (elapsed > TARGET_FRAME_MS) {
      console.warn(
        `[FrameBudget] Frame exceeded budget: ${elapsed.toFixed(2)}ms (target ${TARGET_FRAME_MS}ms)`
      )
    }
  }

  getAverageFps(): number {
    if (this.history.length === 0) {return 0}
    const avgMs = this.history.reduce((a, b) => a + b, 0) / this.history.length
    return avgMs > 0 ? 1000 / avgMs : 0
  }

  getAverageFrameTime(): number {
    if (this.history.length === 0) {return 0}
    return this.history.reduce((a, b) => a + b, 0) / this.history.length
  }

  getDroppedFrames(): number {
    return this.history.filter((t) => t > TARGET_FRAME_MS).length
  }

  reset(): void {
    this.history = []
  }
}

// ─── TextureAtlas ───

export class TextureAtlas {
  private textures: Map<string, HTMLImageElement> = new Map()
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null

  async loadImage(key: string, url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.addEventListener('load', () => {
        this.textures.set(key, img)
        resolve()
      })
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  }

  getTexture(key: string): HTMLImageElement | undefined {
    return this.textures.get(key)
  }

  drawImage(
    ctx: CanvasRenderingContext2D,
    key: string,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const img = this.textures.get(key)
    if (!img) {return}
    try {
      ctx.drawImage(img, x, y, w, h)
    } catch {
      // Image not yet loaded or broken — skip silently
    }
  }

  /** Build an offscreen canvas atlas from all loaded textures. */
  buildAtlas(): void {
    if (this.textures.size === 0) {return}
    const padding = 2
    let totalWidth = 0
    let maxHeight = 0
    for (const img of this.textures.values()) {
      totalWidth += img.naturalWidth + padding
      if (img.naturalHeight > maxHeight) {maxHeight = img.naturalHeight}
    }
    const offscreen = document.createElement("canvas")
    offscreen.width = totalWidth
    offscreen.height = maxHeight
    this.canvas = offscreen
    this.ctx = offscreen.getContext("2d")
  }
}

// ─── Tween ───

export class Tween {
  private readonly from: number
  private readonly to: number
  private readonly duration: number
  private elapsed = 0
  private readonly easing: EasingFunction
  private readonly onUpdate: (value: number) => void
  private readonly onComplete: (() => void) | null
  private _completed = false

  constructor(config: TweenConfig) {
    this.from = config.from
    this.to = config.to
    this.duration = config.duration
    this.easing = config.easing ?? Easing.linear
    this.onUpdate = config.onUpdate
    this.onComplete = config.onComplete ?? null
    // Fire initial value
    this.onUpdate(this.from)
  }

  get completed(): boolean {
    return this._completed
  }

  get progress(): number {
    return this.duration > 0 ? Math.min(this.elapsed / this.duration, 1) : 1
  }

  update(deltaMs: number): boolean {
    if (this._completed) {return true}
    this.elapsed += deltaMs
    const t = this.duration > 0 ? Math.min(this.elapsed / this.duration, 1) : 1
    const easedValue = this.from + (this.to - this.from) * this.easing(t)
    this.onUpdate(easedValue)
    if (t >= 1) {
      this._completed = true
      this.onComplete?.()
      return true
    }
    return false
  }
}

// ─── AnimationTimeline ───

export class AnimationTimeline {
  private tweens: Tween[] = []

  addTween(config: TweenConfig): Tween {
    const tween = new Tween(config)
    this.tweens.push(tween)
    return tween
  }

  update(deltaMs: number): void {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tween = this.tweens[i]
      if (tween === undefined) {continue}
      if (tween.update(deltaMs)) {
        this.tweens.splice(i, 1)
      }
    }
  }

  isPlaying(): boolean {
    return this.tweens.length > 0
  }

  clear(): void {
    this.tweens = []
  }
}

// ═══════════════════════════════════════════════════════
// SPRITE SYSTEM
// ═══════════════════════════════════════════════════════

// ─── Sprite ───

export abstract class Sprite {
  x = 0
  y = 0
  width = 0
  height = 0
  depth = 0
  visible = true
  alpha = 1

  abstract draw(ctx: CanvasRenderingContext2D): void
  abstract update(deltaMs: number): void

  containsPoint(px: number, py: number): boolean {
    return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height
  }
}

// ─── SpriteBatch ───

export class SpriteBatch {
  private sprites: Map<string, Sprite> = new Map()

  addSprite(id: string, sprite: Sprite): void {
    this.sprites.set(id, sprite)
  }

  removeSprite(id: string): void {
    this.sprites.delete(id)
  }

  getSprite(id: string): Sprite | undefined {
    return this.sprites.get(id)
  }

  drawAll(ctx: CanvasRenderingContext2D, deltaMs: number): void {
    // Sort by depth before drawing
    const sorted = [...this.sprites.values()].sort((a, b) => a.depth - b.depth)
    for (const sprite of sorted) {
      if (!sprite.visible) {continue}
      sprite.update(deltaMs)
      ctx.globalAlpha = sprite.alpha
      sprite.draw(ctx)
    }
    ctx.globalAlpha = 1
  }

  sortByDepth(): void {
    // Sprites are sorted during drawAll; this is a no-op for external use
  }
}

// ─── CardSprite ───

export class CardSprite extends Sprite {
  readonly id: string
  readonly name: string
  readonly imageUrl: string
  readonly attack: number
  readonly defense: number
  readonly rarity: string

  private hp = 0
  private maxHp = 0
  private displayHp = 0
  private _isDown = false
  private shieldValue = 0
  private hasShield = false
  private hasPoison = false
  private flashColor: string | null = null
  private flashTimer = 0
  private readonly hpAnimDuration: number = 400

  private image: HTMLImageElement | null = null
  private imageLoaded = false

  constructor(config: {
    id: string
    name: string
    imageUrl: string
    attack: number
    defense: number
    rarity: string
  }) {
    super()
    this.id = config.id
    this.name = config.name
    this.imageUrl = config.imageUrl
    this.attack = config.attack
    this.defense = config.defense
    this.rarity = config.rarity

    // Load image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.addEventListener('load', () => {
      this.image = img
      this.imageLoaded = true
    })
    img.src = config.imageUrl
  }

  /** Whether this card is down (defeated). */
  get isDown(): boolean {
    return this._isDown
  }

  setHp(current: number, max: number, animated = true): void {
    this.hp = current
    this.maxHp = max
    if (!animated) {
      this.displayHp = current
    }
    // If animated, displayHp lerps toward hp in update()
  }

  setDown(down: boolean): void {
    this._isDown = down
  }

  showShield(value: number): void {
    this.hasShield = true
    this.shieldValue = value
  }

  showPoison(): void {
    this.hasPoison = true
  }

  flashDamage(): void {
    this.flashColor = "#ff4444"
    this.flashTimer = 300
  }

  flashHeal(): void {
    this.flashColor = "#44ff44"
    this.flashTimer = 300
  }

  update(deltaMs: number): void {
    // Animate display HP toward target
    if (Math.abs(this.displayHp - this.hp) > 0.1) {
      const diff = this.hp - this.displayHp
      const step = (diff / this.hpAnimDuration) * deltaMs
      this.displayHp += step
      if (Math.abs(this.displayHp - this.hp) < 0.1) {
        this.displayHp = this.hp
      }
    }

    // Flash timer
    if (this.flashTimer > 0) {
      this.flashTimer -= deltaMs
      if (this.flashTimer <= 0) {
        this.flashColor = null
        this.flashTimer = 0
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this

    ctx.save()

    // Down state — grayed out
    if (this._isDown) {
      ctx.globalAlpha = 0.4
    }

    // Flash overlay
    if (this.flashColor && this.flashTimer > 0) {
      ctx.globalAlpha = 0.6
    }

    // Card background (rounded rectangle with gradient)
    const radius = 8
    this.drawRoundedRect(ctx, x, y, width, height, radius)
    const gradient = ctx.createLinearGradient(x, y, x, y + height)
    if (this.rarity === "SR") {
      gradient.addColorStop(0, "#2d1b4e")
      gradient.addColorStop(1, "#1a0f2e")
    } else if (this.rarity === "R") {
      gradient.addColorStop(0, "#1b2d4e")
      gradient.addColorStop(1, "#0f1a2e")
    } else {
      gradient.addColorStop(0, "#1e1e2e")
      gradient.addColorStop(1, "#12121e")
    }
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = this.rarity === "SR" ? "#a855f7" : (this.rarity === "R" ? "#3b82f6" : "#6b7280")
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Character image
    if (this.imageLoaded && this.image) {
      const imgPadding = 8
      const imgY = y + imgPadding
      const imgH = height * 0.55
      try {
        ctx.drawImage(this.image, x + imgPadding, imgY, width - imgPadding * 2, imgH)
      } catch {
        // Image draw failed — skip
      }
    }

    // Name label
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${Math.max(10, width * 0.12)}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(this.name, x + width / 2, y + height * 0.6, width - 8)

    // HP bar
    const barY = y + height * 0.75
    const barW = width - 16
    const barH = 6
    const barX = x + 8
    this.drawHpBar(ctx, barX, barY, barW, barH)

    // Status effects
    const statusY = y + height * 0.85
    let statusX = x + 8
    if (this.hasShield) {
      ctx.fillStyle = "#60a5fa"
      ctx.font = `${Math.max(9, width * 0.1)}px sans-serif`
      ctx.textAlign = "left"
      ctx.fillText(`🛡️${this.shieldValue}`, statusX, statusY)
      statusX += 40
    }
    if (this.hasPoison) {
      ctx.fillStyle = "#a78bfa"
      ctx.font = `${Math.max(9, width * 0.1)}px sans-serif`
      ctx.textAlign = "left"
      ctx.fillText("☠️", statusX, statusY)
    }

    // Down state — X overlay
    if (this._isDown) {
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x + 4, y + 4)
      ctx.lineTo(x + width - 4, y + height - 4)
      ctx.moveTo(x + width - 4, y + 4)
      ctx.lineTo(x + 4, y + height - 4)
      ctx.stroke()
    }

    // Flash overlay color
    if (this.flashColor && this.flashTimer > 0) {
      this.drawRoundedRect(ctx, x, y, width, height, radius)
      ctx.fillStyle = this.flashColor
      ctx.globalAlpha = 0.3 * (this.flashTimer / 300)
      ctx.fill()
    }

    ctx.restore()
  }

  private drawHpBar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const hpPercent = this.maxHp > 0 ? this.displayHp / this.maxHp : 0

    // Background
    ctx.fillStyle = "#1f1f1f"
    ctx.fillRect(x, y, w, h)

    // HP fill
    const hpGrad = ctx.createLinearGradient(x, y, x + w * hpPercent, y)
    if (hpPercent > 0.5) {
      hpGrad.addColorStop(0, "#22c55e")
      hpGrad.addColorStop(1, "#16a34a")
    } else if (hpPercent > 0.25) {
      hpGrad.addColorStop(0, "#eab308")
      hpGrad.addColorStop(1, "#ca8a04")
    } else {
      hpGrad.addColorStop(0, "#ef4444")
      hpGrad.addColorStop(1, "#dc2626")
    }
    ctx.fillStyle = hpGrad
    ctx.fillRect(x, y, w * Math.max(0, hpPercent), h)

    // Border
    ctx.strokeStyle = "#4a4a4a"
    ctx.lineWidth = 0.5
    ctx.strokeRect(x, y, w, h)
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  }
}

// ─── EnemySprite ───

export class EnemySprite extends Sprite {
  readonly id: string
  readonly name: string
  readonly imageUrl: string
  readonly difficulty: string

  private hp = 0
  private maxHp = 0
  private displayHp = 0
  private phase = 0
  private flashTimer = 0
  private phaseTransitionTimer = 0
  private glowPhase = 0

  private image: HTMLImageElement | null = null
  private imageLoaded = false

  constructor(config: { id: string; name: string; imageUrl: string; difficulty: string }) {
    super()
    this.id = config.id
    this.name = config.name
    this.imageUrl = config.imageUrl
    this.difficulty = config.difficulty

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.addEventListener('load', () => {
      this.image = img
      this.imageLoaded = true
    })
    img.src = config.imageUrl
  }

  setHp(current: number, max: number, animated = true): void {
    this.hp = current
    this.maxHp = max
    if (!animated) {this.displayHp = current}
  }

  setPhase(phase: number): void {
    this.phase = phase
  }

  flashHit(): void {
    this.flashTimer = 200
  }

  showPhaseTransition(): void {
    this.phaseTransitionTimer = 1500
  }

  update(deltaMs: number): void {
    // HP animation
    if (Math.abs(this.displayHp - this.hp) > 0.1) {
      const diff = this.hp - this.displayHp
      const step = (diff / 400) * deltaMs
      this.displayHp += step
      if (Math.abs(this.displayHp - this.hp) < 0.1) {
        this.displayHp = this.hp
      }
    }

    // Flash timer
    if (this.flashTimer > 0) {
      this.flashTimer -= deltaMs
    }

    // Phase transition timer
    if (this.phaseTransitionTimer > 0) {
      this.phaseTransitionTimer -= deltaMs
    }

    // Glow animation phase (for FINAL bosses)
    this.glowPhase += deltaMs * 0.003
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this

    ctx.save()

    // Boss glow effect for FINAL difficulty
    if (this.difficulty === "FINAL") {
      const glowAlpha = 0.3 + Math.sin(this.glowPhase) * 0.15
      const glowGrad = ctx.createRadialGradient(
        x + width / 2,
        y + height / 2,
        0,
        x + width / 2,
        y + height / 2,
        width * 0.8
      )
      glowGrad.addColorStop(0, `rgba(147, 51, 234, ${glowAlpha})`)
      glowGrad.addColorStop(1, "rgba(147, 51, 234, 0)")
      ctx.fillStyle = glowGrad
      ctx.fillRect(x - 20, y - 20, width + 40, height + 40)
    }

    // Phase transition overlay
    if (this.phaseTransitionTimer > 0) {
      const tAlpha = Math.min(1, this.phaseTransitionTimer / 500)
      ctx.fillStyle = `rgba(255, 255, 255, ${tAlpha * 0.3})`
      ctx.fillRect(x, y, width, height)
    }

    // Enemy image
    if (this.imageLoaded && this.image) {
      try {
        ctx.drawImage(this.image, x, y, width, height * 0.65)
      } catch {
        // Image draw failed — skip
      }
    }

    // Hit flash
    if (this.flashTimer > 0) {
      ctx.fillStyle = `rgba(255, 68, 68, ${(this.flashTimer / 200) * 0.5})`
      ctx.fillRect(x, y, width, height * 0.65)
    }

    // Name
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${Math.max(12, width * 0.07)}px sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText(this.name, x + width / 2, y + height * 0.67, width - 12)

    // HP bar (with phase colors)
    const barY = y + height * 0.78
    const barW = width - 24
    const barH = 10
    const barX = x + 12
    this.drawEnemyHpBar(ctx, barX, barY, barW, barH)

    // Phase indicator
    if (this.phase > 0) {
      ctx.fillStyle = "#f59e0b"
      ctx.font = `bold ${Math.max(10, width * 0.04)}px sans-serif`
      ctx.textAlign = "center"
      ctx.fillText(`Phase ${this.phase}`, x + width / 2, y + height * 0.88)
    }

    ctx.restore()
  }

  private drawEnemyHpBar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    const hpPercent = this.maxHp > 0 ? this.displayHp / this.maxHp : 0

    // Background
    ctx.fillStyle = "#1f1f1f"
    ctx.fillRect(x, y, w, h)

    // Phase-based color
    let barColor: string
    if (this.phase >= 3) {
      barColor = "#9333ea"
    } else if (this.phase >= 2) {
      barColor = "#dc2626"
    } else if (this.phase >= 1) {
      barColor = "#ea580c"
    } else {
      barColor = "#22c55e"
    }

    const hpGrad = ctx.createLinearGradient(x, y, x + w * Math.max(0, hpPercent), y)
    hpGrad.addColorStop(0, barColor)
    hpGrad.addColorStop(1, barColor + "cc")
    ctx.fillStyle = hpGrad
    ctx.fillRect(x, y, w * Math.max(0, hpPercent), h)

    // Border
    ctx.strokeStyle = "#4a4a4a"
    ctx.lineWidth = 0.5
    ctx.strokeRect(x, y, w, h)
  }
}

// ═══════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════

// ─── Particle ───

export class Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  alpha: number
  gravity: number

  constructor(init: {
    x: number
    y: number
    vx: number
    vy: number
    life: number
    size: number
    color: string
    gravity?: number
  }) {
    this.x = init.x
    this.y = init.y
    this.vx = init.vx
    this.vy = init.vy
    this.life = init.life
    this.maxLife = init.life
    this.size = init.size
    this.color = init.color
    this.alpha = 1
    this.gravity = init.gravity ?? 0
  }

  update(deltaMs: number): boolean {
    const dt = deltaMs / 1000
    this.vy += this.gravity * dt
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.life -= deltaMs
    this.alpha = Math.max(0, this.life / this.maxLife)
    return this.life > 0
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.alpha <= 0) {return}
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, TWO_PI)
    ctx.fill()
    ctx.restore()
  }
}

// ─── ParticleEmitter ───

export class ParticleEmitter {
  private particles: Particle[] = []

  emit(config: ParticleConfig): void {
    const count = config.count
    const color = config.color ?? "#ffffff"
    const speed = config.speed ?? 100
    const life = config.life ?? 800
    const size = config.size ?? 3
    const gravity = config.gravity ?? 0
    const spread = config.spread ?? TWO_PI
    const direction = config.direction ?? 0

    for (let i = 0; i < count; i++) {
      const angle = direction + (Math.random() - 0.5) * spread
      const spd = speed * (0.5 + Math.random() * 0.5)
      this.particles.push(
        new Particle({
          x: config.x,
          y: config.y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: life * (0.7 + Math.random() * 0.3),
          size: size * (0.5 + Math.random() * 0.5),
          color,
          gravity,
        })
      )
    }
  }

  update(deltaMs: number): void {
    this.particles = this.particles.filter((p) => p.update(deltaMs))
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      p.draw(ctx)
    }
  }

  clear(): void {
    this.particles = []
  }

  get particleCount(): number {
    return this.particles.length
  }

  /** Transfer all particles to another emitter. */
  transferTo(target: ParticleEmitter): void {
    for (const p of this.particles) {
      target.addParticle(p)
    }
    this.particles = []
  }

  /** Add a single particle (used for inter-emitter transfer). */
  addParticle(particle: Particle): void {
    this.particles.push(particle)
  }

  // ─── Preset emitters ───

  static damageBurst(x: number, y: number, color: string): ParticleEmitter {
    const emitter = new ParticleEmitter()
    emitter.emit({
      x,
      y,
      count: 20,
      color,
      speed: 200,
      life: 500,
      size: 4,
      gravity: 300,
      spread: TWO_PI,
    })
    return emitter
  }

  static healWave(x: number, y: number): ParticleEmitter {
    const emitter = new ParticleEmitter()
    for (let i = 0; i < 15; i++) {
      const angle = (TWO_PI / 15) * i
      emitter.emit({
        x,
        y,
        count: 3,
        color: "#4ade80",
        speed: 80,
        life: 600,
        size: 3,
        gravity: -100,
        spread: 0.5,
        direction: angle - Math.PI / 2,
      })
    }
    return emitter
  }

  static shieldDome(x: number, y: number, radius: number): ParticleEmitter {
    const emitter = new ParticleEmitter()
    const count = 30
    for (let i = 0; i < count; i++) {
      const angle = (TWO_PI / count) * i
      const px = x + Math.cos(angle) * radius
      const py = y + Math.sin(angle) * radius
      emitter.particles.push(
        new Particle({
          x: px,
          y: py,
          vx: Math.cos(angle) * 20,
          vy: Math.sin(angle) * 20,
          life: 800,
          size: 2.5,
          color: "#60a5fa",
          gravity: 0,
        })
      )
    }
    return emitter
  }

  static slashEffect(x: number, y: number, angle: number): ParticleEmitter {
    const emitter = new ParticleEmitter()
    emitter.emit({
      x,
      y,
      count: 25,
      color: "#fbbf24",
      speed: 250,
      life: 300,
      size: 2,
      gravity: 0,
      spread: Math.PI * 0.4,
      direction: angle,
    })
    return emitter
  }

  static poisonCloud(x: number, y: number): ParticleEmitter {
    const emitter = new ParticleEmitter()
    emitter.emit({
      x,
      y,
      count: 12,
      color: "#a78bfa",
      speed: 30,
      life: 1200,
      size: 5,
      gravity: -20,
      spread: TWO_PI,
    })
    return emitter
  }
}

// ═══════════════════════════════════════════════════════
// MAIN RENDERER
// ═══════════════════════════════════════════════════════

export class BattleRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private spriteBatch: SpriteBatch
  private particleEmitter: ParticleEmitter
  private animationTimeline: AnimationTimeline
  private frameBudget: FrameBudget
  private running = false
  private rafId = 0
  private lastTime = 0
  private backgroundStars: Array<{ x: number; y: number; size: number; speed: number }> = []

  private playerCards: Map<number, CardSprite> = new Map()
  private enemySprite: EnemySprite | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) {throw new Error("Failed to get 2D rendering context from canvas")}
    this.ctx = ctx

    this.spriteBatch = new SpriteBatch()
    this.particleEmitter = new ParticleEmitter()
    this.animationTimeline = new AnimationTimeline()
    this.frameBudget = new FrameBudget()

    this.generateStars()
  }

  // ─── Lifecycle ───

  start(): void {
    if (this.running) {return}
    this.running = true
    this.lastTime = performance.now()
    this.loop(this.lastTime)
  }

  stop(): void {
    if (!this.running) {return}
    this.running = false
    if (this.rafId !== 0) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  resize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
    this.generateStars()
  }

  private loop = (timestamp: number): void => {
    if (!this.running) {return}

    const frameStart = this.frameBudget.beginFrame()
    const deltaMs = Math.min(timestamp - this.lastTime, 100) // clamp to prevent spiral
    this.lastTime = timestamp

    // Update
    this.animationTimeline.update(deltaMs)
    this.particleEmitter.update(deltaMs)

    // Draw
    const { width, height } = this.canvas
    this.ctx.clearRect(0, 0, width, height)
    this.drawBackground()
    this.spriteBatch.drawAll(this.ctx, deltaMs)
    this.particleEmitter.draw(this.ctx)

    this.frameBudget.endFrame(frameStart)
    this.rafId = requestAnimationFrame(this.loop)
  }

  // ─── Scene Setup ───

  setPlayerField(cards: PlayerCardState[]): void {
    // Clear existing
    this.playerCards.clear()
    for (const id of this.playerCards.keys()) {
      this.spriteBatch.removeSprite(`card-${id}`)
    }

    const { width, height } = this.canvas
    const cardW = Math.min(120, width / 6)
    const cardH = cardW * 1.5
    const totalW = cards.length * cardW + (cards.length - 1) * 8
    const startX = (width - totalW) / 2
    const startY = height - cardH - 20

    for (const state of cards) {
      const card = new CardSprite({
        id: state.cardId,
        name: state.name,
        imageUrl: state.imageUrl,
        attack: state.attack,
        defense: state.defense,
        rarity: state.rarity,
      })
      card.width = cardW
      card.height = cardH
      card.x = startX + state.cardIndex * (cardW + 8)
      card.y = startY
      card.depth = state.cardIndex
      card.setHp(state.hp, state.maxHp, false)
      if (state.isDown) {card.setDown(true)}
      if (state.hasShield) {card.showShield(state.shieldValue)}
      if (state.hasPoison) {card.showPoison()}

      this.playerCards.set(state.cardIndex, card)
      this.spriteBatch.addSprite(`card-${state.cardIndex}`, card)
    }
  }

  setEnemy(enemy: EnemyState): void {
    if (this.enemySprite) {
      this.spriteBatch.removeSprite("enemy")
    }

    const { width, height } = this.canvas
    const sprite = new EnemySprite({
      id: enemy.id,
      name: enemy.name,
      imageUrl: enemy.imageUrl,
      difficulty: enemy.difficulty,
    })
    sprite.width = Math.min(180, width * 0.3)
    sprite.height = sprite.width * 1.2
    sprite.x = (width - sprite.width) / 2
    sprite.y = 30
    sprite.depth = -1
    sprite.setHp(enemy.hp, enemy.maxHp, false)
    sprite.setPhase(enemy.phase)

    this.enemySprite = sprite
    this.spriteBatch.addSprite("enemy", sprite)
  }

  // ─── Animations (called by L5 FSM) ───

  animateAttack(charIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const card = this.playerCards.get(charIndex)
      if (!card) {
        resolve()
        return
      }

      const originalY = card.y
      const jumpHeight = -40
      const duration = 400

      this.animationTimeline.addTween({
        from: 0,
        to: 1,
        duration: duration / 2,
        easing: Easing.easeOut,
        onUpdate: (value) => {
          card.y = originalY + jumpHeight * value
        },
        onComplete: () => {
          // Slash effect at enemy
          if (this.enemySprite) {
            const ex = this.enemySprite.x + this.enemySprite.width / 2
            const ey = this.enemySprite.y + this.enemySprite.height / 3
            const burst = ParticleEmitter.damageBurst(ex, ey, "#fbbf24")
            this.mergeEmitter(burst)
          }

          // Return down
          this.animationTimeline.addTween({
            from: 0,
            to: 1,
            duration: duration / 2,
            easing: Easing.easeIn,
            onUpdate: (value) => {
              card.y = originalY + jumpHeight * (1 - value)
            },
            onComplete: resolve,
          })
        },
      })
    })
  }

  animateDefense(charIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const card = this.playerCards.get(charIndex)
      if (!card) {
        resolve()
        return
      }

      // Shield dome effect
      const cx = card.x + card.width / 2
      const cy = card.y + card.height / 2
      const dome = ParticleEmitter.shieldDome(cx, cy, card.width * 0.8)
      this.mergeEmitter(dome)

      // Slight pulse
      const originalWidth = card.width
      this.animationTimeline.addTween({
        from: 1,
        to: 1.1,
        duration: 200,
        easing: Easing.easeOut,
        onUpdate: (value) => {
          card.width = originalWidth * value
        },
        onComplete: () => {
          this.animationTimeline.addTween({
            from: 1.1,
            to: 1,
            duration: 200,
            easing: Easing.easeIn,
            onUpdate: (value) => {
              card.width = originalWidth * value
            },
            onComplete: resolve,
          })
        },
      })
    })
  }

  animateEffect(charIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const card = this.playerCards.get(charIndex)
      if (!card) {
        resolve()
        return
      }

      card.flashHeal()

      // Heal wave from character
      const cx = card.x + card.width / 2
      const cy = card.y + card.height / 2
      const wave = ParticleEmitter.healWave(cx, cy)
      this.mergeEmitter(wave)

      setTimeout(resolve, 500)
    })
  }

  animateUltimate(charIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const card = this.playerCards.get(charIndex)
      if (!card) {
        resolve()
        return
      }

      const originalY = card.y
      const originalAlpha = card.alpha
      const duration = 600

      // Charge up — card glows
      this.animationTimeline.addTween({
        from: 1,
        to: 1.2,
        duration: duration / 3,
        easing: Easing.elastic,
        onUpdate: (value) => {
          card.alpha = value
        },
        onComplete: () => {
          // Dash toward enemy
          this.animationTimeline.addTween({
            from: 0,
            to: 1,
            duration: duration / 3,
            easing: Easing.easeIn,
            onUpdate: (value) => {
              card.y = originalY - 80 * value
              card.alpha = 1.2 - 0.2 * value
            },
            onComplete: () => {
              // Big burst at enemy
              if (this.enemySprite) {
                const ex = this.enemySprite.x + this.enemySprite.width / 2
                const ey = this.enemySprite.y + this.enemySprite.height / 3
                const burst = ParticleEmitter.damageBurst(ex, ey, "#ef4444")
                this.mergeEmitter(burst)
                const burst2 = ParticleEmitter.damageBurst(ex, ey, "#fbbf24")
                this.mergeEmitter(burst2)
                this.enemySprite.flashHit()
              }

              // Return
              this.animationTimeline.addTween({
                from: 0,
                to: 1,
                duration: duration / 3,
                easing: Easing.easeOut,
                onUpdate: (value) => {
                  card.y = originalY - 80 + 80 * value
                  card.alpha = originalAlpha
                },
                onComplete: resolve,
              })
            },
          })
        },
      })
    })
  }

  animateEnemyAttack(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.enemySprite) {
        resolve()
        return
      }

      this.enemySprite.flashHit()

      // Damage burst on random alive character
      const aliveCards = [...this.playerCards.values()].filter((c) => !c.isDown)
      if (aliveCards.length > 0) {
        const target = aliveCards[Math.floor(Math.random() * aliveCards.length)]
        if (target) {
          const burst = ParticleEmitter.damageBurst(
            target.x + target.width / 2,
            target.y + target.height / 2,
            "#ef4444"
          )
          this.mergeEmitter(burst)
        }
      }

      setTimeout(resolve, 500)
    })
  }

  animateVictory(): Promise<void> {
    return new Promise((resolve) => {
      // Confetti-like particles
      const { width } = this.canvas
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * width
        const y = 50 + Math.random() * 100
        const colors = ["#fbbf24", "#4ade80", "#60a5fa", "#f472b6", "#a78bfa"]
        const color = colors[Math.floor(Math.random() * colors.length)] ?? "#fbbf24"
        this.particleEmitter.emit({
          x,
          y,
          count: 10,
          color,
          speed: 150,
          life: 2000,
          size: 4,
          gravity: 200,
          spread: TWO_PI,
        })
      }
      setTimeout(resolve, 2000)
    })
  }

  animateDefeat(): Promise<void> {
    return new Promise((resolve) => {
      // Fade all cards
      const cards = [...this.playerCards.values()]
      for (const card of cards) {
        this.animationTimeline.addTween({
          from: 1,
          to: 0.3,
          duration: 1000,
          easing: Easing.easeInOut,
          onUpdate: (value) => {
            card.alpha = value
          },
        })
      }
      // Dark particles
      const { width, height } = this.canvas
      this.particleEmitter.emit({
        x: width / 2,
        y: height / 2,
        count: 30,
        color: "#1f1f1f",
        speed: 50,
        life: 2000,
        size: 8,
        gravity: 0,
        spread: TWO_PI,
      })
      setTimeout(resolve, 2000)
    })
  }

  animatePhaseTransition(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.enemySprite) {
        this.enemySprite.showPhaseTransition()
      }

      // Flash overlay via particles
      const { width, height } = this.canvas
      this.particleEmitter.emit({
        x: width / 2,
        y: height / 3,
        count: 40,
        color: "#f59e0b",
        speed: 200,
        life: 1000,
        size: 3,
        gravity: 0,
        spread: TWO_PI,
      })

      // Log the message to console (in real usage this would render text overlay)
      console.log(`[PhaseTransition] ${message}`)

      setTimeout(resolve, 1500)
    })
  }

  animateCharacterDown(charIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const card = this.playerCards.get(charIndex)
      if (!card) {
        resolve()
        return
      }

      card.setDown(true)
      card.flashDamage()

      const burst = ParticleEmitter.damageBurst(
        card.x + card.width / 2,
        card.y + card.height / 2,
        "#ef4444"
      )
      this.mergeEmitter(burst)

      setTimeout(resolve, 600)
    })
  }

  // ─── Direct State Updates ───

  updateHp(charIndex: number, hp: number, maxHp: number): void {
    const card = this.playerCards.get(charIndex)
    if (card) {card.setHp(hp, maxHp)}
  }

  updateEnemyHp(hp: number, maxHp: number): void {
    if (this.enemySprite) {this.enemySprite.setHp(hp, maxHp)}
  }

  updateShieldBuffer(value: number): void {
    for (const card of this.playerCards.values()) {
      if (!card.isDown && value > 0) {
        card.showShield(value)
      }
    }
  }

  // ─── Performance ───

  getFrameBudget(): Readonly<FrameBudget> {
    return this.frameBudget
  }

  getFps(): number {
    return this.frameBudget.getAverageFps()
  }

  // ─── Background ───

  private generateStars(): void {
    this.backgroundStars = []
    const { width, height } = this.canvas
    if (width === 0 || height === 0) {return}
    for (let i = 0; i < 80; i++) {
      this.backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
      })
    }
  }

  drawBackground(): void {
    const { width, height } = this.canvas
    if (width === 0 || height === 0) {return}

    // Gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#0a0a1a")
    gradient.addColorStop(0.5, "#0f0f2e")
    gradient.addColorStop(1, "#1a0a2e")
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, width, height)

    // Star field
    for (const star of this.backgroundStars) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(performance.now() * star.speed * 0.001) * 0.3})`
      this.ctx.beginPath()
      this.ctx.arc(star.x, star.y, star.size, 0, TWO_PI)
      this.ctx.fill()
    }
  }

  // ─── Private Helpers ───

  /** Merge particles from another emitter into the main one. */
  private mergeEmitter(other: ParticleEmitter): void {
    other.transferTo(this.particleEmitter)
  }

  /** Get the texture atlas for external image loading. */
  getTextureAtlas(): TextureAtlas {
    return new TextureAtlas()
  }
}
