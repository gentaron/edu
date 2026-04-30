/* ═══════════════════════════════════════════
   L4 TRANSPORT — Typed Event Bus
   Pub/sub system for cross-component communication.
   Uses discriminated union for type-safe events.
   ═══════════════════════════════════════════ */

/** All application events as a discriminated union */
export type AppEvent =
  | { type: "battle:start"; enemyId: string; deckSize: number }
  | { type: "battle:ability"; ability: string; characterId: string }
  | { type: "battle:turn"; turn: number }
  | { type: "battle:phase-change"; from: string; to: string }
  | { type: "battle:victory"; enemyId: string; turnsUsed: number }
  | { type: "battle:defeat"; enemyId: string; turnsUsed: number }
  | { type: "battle:reset" }
  | { type: "deck:card-added"; cardId: string; deckSize: number }
  | { type: "deck:card-removed"; cardId: string; deckSize: number }
  | { type: "deck:cleared" }
  | { type: "deck:reordered"; deckSize: number }
  | { type: "wiki:entry-viewed"; entryId: string }
  | { type: "story:opened"; slug: string }
  | { type: "story:lang-changed"; lang: "ja" | "en" }
  | { type: "navigation:route-changed"; path: string }
  | { type: "ui:theme-toggled" }

/** Type-safe event handler */
export type EventHandler<T extends AppEvent["type"]> =
  Extract<AppEvent, { type: T }> extends never
    ? () => void
    : (event: Extract<AppEvent, { type: T }>) => void

type Subscriber = (event: AppEvent) => void

class EventBus {
  private subscribers = new Map<string, Set<Subscriber>>()

  subscribe<T extends AppEvent["type"]>(eventType: T, handler: EventHandler<T>): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set())
    }
    const typedHandler = handler as Subscriber
    this.subscribers.get(eventType)!.add(typedHandler)

    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(typedHandler)
    }
  }

  publish(event: AppEvent): void {
    const handlers = this.subscribers.get(event.type)
    if (handlers) {
      for (const handler of handlers) {
        handler(event)
      }
    }
    // Also notify wildcard subscribers
    const wildcardHandlers = this.subscribers.get("*")
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        handler(event)
      }
    }
  }

  /** Subscribe to all events */
  subscribeAll(handler: (event: AppEvent) => void): () => void {
    if (!this.subscribers.has("*")) {
      this.subscribers.set("*", new Set())
    }
    this.subscribers.get("*")!.add(handler)
    return () => {
      this.subscribers.get("*")?.delete(handler)
    }
  }

  /** Clear all subscribers (useful for cleanup in tests) */
  clear(): void {
    this.subscribers.clear()
  }
}

/** Singleton event bus instance */
export const eventBus = new EventBus()
