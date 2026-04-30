/* ═══════════════════════════════════════════
   L5 SESSION — Public API (deprecated)
   Re-exports from domains/battle FSM.
   ═══════════════════════════════════════════ */

export {
  battleFSMReducer,
  initialBattleFSMState,
  type BattleFSMState,
  type BattleFSMAction,
  type AbilityResult,
} from "@/domains/battle/battle.fsm"
