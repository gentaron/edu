/* ═══════════════════════════════════════════
   L4 TRANSPORT — State Exports
   Re-export state hooks. Components should import from here, not from zustand directly.
   ═══════════════════════════════════════════ */

export { useBattleStore, type BattlePhase, type BattleSnapshot } from "./battle.state"
export { useDeckStore, type DeckSnapshot } from "./deck.state"
