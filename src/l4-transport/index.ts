/* ═══════════════════════════════════════════
   L4 TRANSPORT — Public API
   Event bus, state management, and persistence.
   Layers above should access state through these exports.
   ═══════════════════════════════════════════ */

export { eventBus, type AppEvent, type EventHandler } from "./event-bus"
export {
  useBattleStore,
  useDeckStore,
  type BattlePhase,
  type BattleSnapshot,
  type DeckSnapshot,
} from "./state"
