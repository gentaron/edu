/* ═══════════════════════════════════════════════════════════════
   L5 SESSION — Generic Hierarchical State Machine (HSM)
   SCXML-subset state machine with hierarchical states, guards,
   actions, history, DOT export, and static validation.
   Completely domain-independent.
   ═══════════════════════════════════════════════════════════════ */

// ─── Core Types ───────────────────────────────────────────────

/** A single state in the machine. May be a leaf or a compound (parent). */
export interface HsmState {
  id: string
  /** Parent state id – set for compound child states */
  parent?: string
  /** Called when the state is entered */
  onEntry?: (context: HsmContext, event: HsmEvent) => void
  /** Called when the state is exited */
  onExit?: (context: HsmContext, event: HsmEvent) => void
  /** Event type → transition (or array of guarded transitions) */
  transitions: Record<string, HsmTransition | HsmTransition[]>
}

/** A transition edge from one state to another. */
export interface HsmTransition {
  target: string
  guard?: (context: HsmContext, event: HsmEvent) => boolean
  action?: (context: HsmContext, event: HsmEvent) => void
}

/** Event sent to the state machine. */
export interface HsmEvent {
  type: string
  payload?: Record<string, unknown>
}

/** Mutable key-value bag shared across all states. */
export interface HsmContext {
  [key: string]: unknown
}

/** Configuration passed to the HSM constructor. */
export interface HsmConfig {
  initialState: string
  states: Record<string, HsmState>
  context?: HsmContext
  /** Optional: mark compound states that should remember history. */
  historyStates?: Record<string, "shallow" | "deep">
}

/** Immutable snapshot of the machine's current runtime state. */
export interface HsmSnapshot {
  /** Active state stack (rootmost → leaf) */
  currentStates: string[]
  context: Readonly<HsmContext>
  history: Array<{
    from: string
    to: string
    event: string
    timestamp: number
  }>
  eventCount: number
}

// ─── Main HSM Class ──────────────────────────────────────────

export class Hsm {
  private config: HsmConfig
  private activeStates: string[] = []
  private context: HsmContext
  private transitionHistory: HsmSnapshot["history"] = []
  private eventCount = 0
  private historyMemory: Map<string, string> = new Map()

  constructor(config: HsmConfig) {
    this.config = config
    this.context = config.context ? { ...config.context } : {}
  }

  // ── Lifecycle ──────────────────────────────────────────────

  /** Enter the initial state (and all ancestors), run onEntry callbacks. */
  init(): void {
    this.activeStates = []
    this.transitionHistory = []
    this.eventCount = 0
    this.historyMemory.clear()

    if (!this.config.states[this.config.initialState]) {
      throw new Error(`Initial state "${this.config.initialState}" not found in states`)
    }

    const chain = this.buildAncestorChain(this.config.initialState)
    this.activeStates = chain

    const initEvent: HsmEvent = { type: "hsm.init" }
    for (const stateId of chain) {
      this.config.states[stateId]?.onEntry?.(this.context, initEvent)
    }
  }

  /**
   * Process an event against the current active states.
   * Walks from leaf → root; first state that handles the event wins.
   * Returns `true` if a transition fired, `false` otherwise.
   */
  send(event: HsmEvent): boolean {
    this.eventCount++

    // Walk from leaf (end of activeStates) to root (start)
    for (let i = this.activeStates.length - 1; i >= 0; i--) {
      const stateId = this.activeStates[i]
      if (stateId === undefined) {continue}
      const state = this.config.states[stateId]
      if (!state) {continue}

      const raw = state.transitions[event.type]
      if (raw === undefined) {continue} // event not handled by this state

      // This state defines a handler for the event type.
      // We do NOT propagate to parents – all guards here must fail first.
      const list: readonly HsmTransition[] = Array.isArray(raw) ? raw : [raw]

      for (const transition of list) {
        if (transition.guard && !transition.guard(this.context, event)) {
          continue // guard failed, try next variant
        }
        this.executeTransition(stateId, transition, event)
        return true
      }

      // All guards failed in this state → no-op, do not propagate.
      return false
    }

    // No active state handles this event type.
    return false
  }

  /** Return to the initial state (clears all runtime state). */
  reset(): void {
    this.init()
  }

  // ── Query ──────────────────────────────────────────────────

  /** True if `stateId` is currently active (at any depth). */
  isIn(stateId: string): boolean {
    return this.activeStates.includes(stateId)
  }

  /** The current leaf (innermost) state. */
  getCurrentState(): string {
    const last = this.activeStates[this.activeStates.length - 1]
    return last ?? ""
  }

  /** Full active state stack (rootmost → leaf). */
  getActiveStates(): string[] {
    return [...this.activeStates]
  }

  /** Immutable snapshot of the machine's runtime state. */
  getSnapshot(): HsmSnapshot {
    return {
      currentStates: [...this.activeStates],
      context: { ...this.context } as Readonly<HsmContext>,
      history: [...this.transitionHistory],
      eventCount: this.eventCount,
    }
  }

  /** Read-only view of the context. */
  getContext(): Readonly<HsmContext> {
    return { ...this.context } as Readonly<HsmContext>
  }

  /** Merge an update into the mutable context. */
  setContext(update: Partial<HsmContext>): void {
    Object.assign(this.context, update)
  }

  // ── Graphviz DOT export ────────────────────────────────────

  /** Generate a Graphviz DOT string representing this state machine. */
  toDot(): string {
    return hsmToDotString(this.config)
  }

  // ── Validation ─────────────────────────────────────────────

  /**
   * Validate the machine definition.
   * Returns an array of diagnostics (empty = valid).
   */
  validate(): Array<{ type: string; message: string; state?: string }> {
    const errors: Array<{ type: string; message: string; state?: string }> = []

    // 1. Missing initial state
    if (!this.config.states[this.config.initialState]) {
      errors.push({
        type: "missing_initial",
        message: `Initial state "${this.config.initialState}" does not exist in states`,
      })
    }

    // 2. Invalid / circular parent references
    for (const [id, state] of Object.entries(this.config.states)) {
      if (state.parent && !this.config.states[state.parent]) {
        errors.push({
          type: "invalid_parent",
          message: `State "${id}" references non-existent parent "${state.parent}"`,
          state: id,
        })
      }
      // Circular check
      if (state.parent) {
        const visited = new Set<string>()
        let cur: string | undefined = id
        while (cur !== undefined) {
          if (visited.has(cur)) {
            errors.push({
              type: "circular_parent",
              message: `Circular parent reference starting from "${id}"`,
              state: id,
            })
            break
          }
          visited.add(cur)
          cur = this.config.states[cur]?.parent
        }
      }
    }

    // 3. Invalid transition targets
    for (const [id, state] of Object.entries(this.config.states)) {
      for (const [evt, trans] of Object.entries(state.transitions)) {
        const list: readonly HsmTransition[] = Array.isArray(trans) ? trans : [trans]
        for (const t of list) {
          if (!this.config.states[t.target]) {
            errors.push({
              type: "invalid_target",
              message: `Transition "${evt}" from "${id}" targets non-existent state "${t.target}"`,
              state: id,
            })
          }
        }
      }
    }

    // 4. Unreachable states
    if (this.config.states[this.config.initialState]) {
      const reachable = this.getReachableStates()
      for (const stateId of Object.keys(this.config.states)) {
        if (!reachable.has(stateId)) {
          errors.push({
            type: "unreachable",
            message: `State "${stateId}" is unreachable from initial state "${this.config.initialState}"`,
            state: stateId,
          })
        }
      }
    }

    // 5. Dead-end states (no outgoing transitions)
    for (const stateId of this.getDeadEndStates()) {
      errors.push({
        type: "dead_end",
        message: `State "${stateId}" has no outgoing transitions`,
        state: stateId,
      })
    }

    return errors
  }

  // ── Static analysis ────────────────────────────────────────

  /** BFS from initialState, following parent links and transition targets. */
  getReachableStates(): Set<string> {
    if (!this.config.states[this.config.initialState]) {
      return new Set()
    }

    const reachable = new Set<string>()
    const queue = [this.config.initialState]

    while (queue.length > 0) {
      const stateId = queue.shift()!
      if (reachable.has(stateId)) {continue}
      reachable.add(stateId)

      const state = this.config.states[stateId]
      if (!state) {continue}

      // Parent is reachable by hierarchy
      if (state.parent && !reachable.has(state.parent)) {
        queue.push(state.parent)
      }

      // All transition targets are reachable
      for (const raw of Object.values(state.transitions)) {
        const list: readonly HsmTransition[] = Array.isArray(raw) ? raw : [raw]
        for (const t of list) {
          if (!reachable.has(t.target)) {
            queue.push(t.target)
          }
        }
      }
    }

    return reachable
  }

  /** States that have zero outgoing transitions. */
  getDeadEndStates(): string[] {
    return Object.entries(this.config.states)
      .filter(([, state]) => Object.keys(state.transitions).length === 0)
      .map(([id]) => id)
  }

  /** Number of ancestor levels above `stateId` (0 = top-level). */
  getStateDepth(stateId: string): number {
    let depth = 0
    let cur = this.config.states[stateId]?.parent
    while (cur) {
      depth++
      cur = this.config.states[cur]?.parent
    }
    return depth
  }

  // ── Private helpers ────────────────────────────────────────

  /**
   * Build the ancestor chain: [rootmost, …, parent, stateId].
   * E.g. playerTurn with parent battle → ["battle", "playerTurn"]
   */
  private buildAncestorChain(stateId: string): string[] {
    const chain: string[] = [stateId]
    let cur = this.config.states[stateId]?.parent
    while (cur) {
      chain.unshift(cur)
      cur = this.config.states[cur]?.parent
    }
    return chain
  }

  /**
   * Find the lowest common ancestor of two ancestor chains.
   * Both chains must be in rootmost→leaf order.
   * Returns `null` when there is no common ancestor.
   */
  private findLCA(chainA: string[], chainB: string[]): string | null {
    let lca: string | null = null
    const len = Math.min(chainA.length, chainB.length)
    for (let i = 0; i < len; i++) {
      if (chainA[i] === chainB[i]) {
        lca = chainA[i]!
      } else {
        break
      }
    }
    return lca
  }

  /** Execute a single transition: exit → action → enter → rebuild stack. */
  private executeTransition(sourceState: string, transition: HsmTransition, event: HsmEvent): void {
    const targetId = transition.target
    if (!this.config.states[targetId]) {
      throw new Error(`Target state "${targetId}" not found`)
    }

    const sourceAncestors = this.buildAncestorChain(sourceState)
    const targetAncestors = this.buildAncestorChain(targetId)
    const lca = this.findLCA(sourceAncestors, targetAncestors)

    // ── EXIT PHASE ──
    // Exit from the current leaf up to (but not including) the LCA.
    for (let i = this.activeStates.length - 1; i >= 0; i--) {
      const sid = this.activeStates[i]
      if (sid === undefined || sid === lca) {break}
      this.saveHistory(sid)
      this.config.states[sid]?.onExit?.(this.context, event)
    }

    // ── TRANSITION ACTION ──
    transition.action?.(this.context, event)

    // ── ENTRY PHASE ──
    // States to enter: from just below the LCA down to the target.
    const entryStates: string[] =
      lca === null ? [...targetAncestors] : targetAncestors.slice(targetAncestors.indexOf(lca) + 1)

    // Resolve any history states in the entry chain.
    const resolvedEntry = this.resolveHistory(entryStates)

    for (const sid of resolvedEntry) {
      this.config.states[sid]?.onEntry?.(this.context, event)
    }

    // ── REBUILD ACTIVE STATES ──
    if (lca === null) {
      this.activeStates = [...resolvedEntry]
    } else {
      const lcaIdx = this.activeStates.indexOf(lca)
      this.activeStates =
        lcaIdx >= 0
          ? [...this.activeStates.slice(0, lcaIdx + 1), ...resolvedEntry]
          : [...resolvedEntry]
    }

    // ── RECORD HISTORY ──
    this.transitionHistory.push({
      from: sourceState,
      to: resolvedEntry[resolvedEntry.length - 1] ?? targetId,
      event: event.type,
      timestamp: Date.now(),
    })
  }

  /** Persist history for a state that supports it (called on exit). */
  private saveHistory(stateId: string): void {
    const mode = this.config.historyStates?.[stateId]
    if (mode === undefined) {return}

    if (mode === "deep") {
      const leaf = this.activeStates[this.activeStates.length - 1]
      if (leaf !== undefined) {this.historyMemory.set(stateId, leaf)}
    } else {
      // Shallow: remember the direct child
      const idx = this.activeStates.indexOf(stateId)
      const child = this.activeStates[idx + 1]
      if (child !== undefined) {this.historyMemory.set(stateId, child)}
    }
  }

  /**
   * If an entering state has saved history, splice the remembered
   * descendant chain into the entry list (and stop descending).
   */
  private resolveHistory(entryStates: string[]): string[] {
    const result: string[] = []
    for (const sid of entryStates) {
      result.push(sid)
      const mode = this.config.historyStates?.[sid]
      if (mode !== undefined && this.historyMemory.has(sid)) {
        const rememberedLeaf = this.historyMemory.get(sid)!
        const rememberedChain = this.buildAncestorChain(rememberedLeaf)
        const startIdx = rememberedChain.indexOf(sid)
        if (startIdx >= 0) {
          for (let i = startIdx + 1; i < rememberedChain.length; i++) {
            result.push(rememberedChain[i]!)
          }
        }
        break // history resolved → stop automatic descent
      }
    }
    return result
  }
}

// ─── DOT generation (module-private, shared by toDot + graphviz.ts) ─

export function hsmToDotString(config: HsmConfig): string {
  const lines: string[] = []
  lines.push("digraph HSM {")
  lines.push("  rankdir=LR;")
  lines.push('  node [shape=roundedrect, style=filled, fillcolor="#E3F2FD", fontname="Helvetica"];')
  lines.push('  edge [fontname="Helvetica", fontsize=10];')
  lines.push("")

  // Identify compound states (parents of at least one other state)
  const compoundSet = new Set<string>()
  for (const state of Object.values(config.states)) {
    if (state.parent) {compoundSet.add(state.parent)}
  }

  // Cluster subgraphs for compound states
  for (const parentId of compoundSet) {
    const children = Object.keys(config.states).filter(
      (id) => config.states[id]?.parent === parentId
    )
    lines.push(`  subgraph cluster_${sanitizeId(parentId)} {`)
    lines.push(`    label="${parentId}";`)
    lines.push("    style=rounded,dashed;")
    lines.push('    color="#64B5F6";')
    lines.push('    bgcolor="#FAFAFA";')
    for (const childId of children) {
      lines.push(`    ${sanitizeId(childId)} [label="${childId}"];`)
    }
    lines.push("  }")
    lines.push("")
  }

  // Top-level (non-compound, no-parent) state nodes
  for (const [id, state] of Object.entries(config.states)) {
    if (!state.parent && !compoundSet.has(id)) {
      lines.push(`  ${sanitizeId(id)} [label="${id}"];`)
    }
  }
  lines.push("")

  // Initial state marker
  lines.push("  __start [shape=point, width=0.25];")
  lines.push(`  __start -> ${sanitizeId(config.initialState)};`)
  lines.push("")

  // Transition edges
  const emitted = new Set<string>()
  for (const [stateId, state] of Object.entries(config.states)) {
    for (const [eventType, raw] of Object.entries(state.transitions)) {
      const list: readonly HsmTransition[] = Array.isArray(raw) ? raw : [raw]
      for (const t of list) {
        const key = `${stateId}->${t.target}:${eventType}`
        if (emitted.has(key)) {continue}
        emitted.add(key)
        const label = t.guard ? `${eventType} [guarded]` : eventType
        lines.push(`  ${sanitizeId(stateId)} -> ${sanitizeId(t.target)} [label="${label}"];`)
      }
    }
  }

  lines.push("}")
  return lines.join("\n")
}

function sanitizeId(id: string): string {
  return "s_" + id.replace(/\W/g, "_")
}
