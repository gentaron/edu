/* ═══════════════════════════════════════════
   L4 TRANSPORT — Public API (deprecated)
   Re-exports from platform and domain stores.
   ═══════════════════════════════════════════ */

export { eventBus, type AppEvent, type EventHandler } from "@/platform/event-bus"
export { useBattleStore, useDeckStore, type BattlePhase } from "@/lib/stores"
