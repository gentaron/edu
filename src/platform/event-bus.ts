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

/** Type-safe event handler for a specific event type */
export type EventHandler<T extends AppEvent["type"]> =
  Extract<AppEvent, { type: T }> extends never
    ? () => void
    : (event: Extract<AppEvent, { type: T }>) => void

type Subscriber = (event: AppEvent) => void

/**
 * Type-safe event bus for cross-component communication.
 * Supports subscribing to specific event types, subscribing to all events (wildcard),
 * and publishing events to all matching subscribers.
 *
 * @example
 * const unsub = eventBus.subscribe('battle:victory', (e) => {
 *   console.log(`Victory against ${e.enemyId} in ${e.turnsUsed} turns!`)
 * })
 * // Later: unsub() to stop listening
 */
class EventBus {
  private subscribers = new Map<string, Set<Subscriber>>()

  /**
   * Subscribe to a specific event type with a type-safe handler.
   * The handler receives the full event payload matching the specified type.
   *
   * @param eventType - The event type to subscribe to (discriminated union key).
   * @param handler - Type-safe callback invoked when the event is published.
   * @returns An unsubscribe function that removes this handler from the event type.
   * @example
   * const unsub = eventBus.subscribe('deck:card-added', (e) => {
   *   console.log(`Card ${e.cardId} added, deck size: ${e.deckSize}`)
   * })
   * unsub() // stop listening
   */
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

  /**
   * Publish an event to all subscribers of that event type and all wildcard subscribers.
   * Handlers are invoked synchronously in the order they were subscribed.
   *
   * @param event - The full event object (must include a `type` field matching an {@link AppEvent}).
   * @example
   * eventBus.publish({ type: 'battle:start', enemyId: 'void-king', deckSize: 5 })
   */
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

  /**
   * Subscribe to all events regardless of type (wildcard listener).
   * Useful for logging, analytics, or debugging.
   *
   * @param handler - Callback invoked for every published event.
   * @returns An unsubscribe function that removes this wildcard handler.
   */
  subscribeAll(handler: (event: AppEvent) => void): () => void {
    if (!this.subscribers.has("*")) {
      this.subscribers.set("*", new Set())
    }
    this.subscribers.get("*")!.add(handler)
    return () => {
      this.subscribers.get("*")?.delete(handler)
    }
  }

  /**
   * Remove all subscribers for all event types.
   * Primarily useful for cleanup in test teardown or hot module replacement.
   */
  clear(): void {
    this.subscribers.clear()
  }
}

/** Singleton event bus instance */
export const eventBus = new EventBus()
