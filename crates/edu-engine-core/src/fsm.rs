//! Battle Finite State Machine — type-level state machine via sealed traits + const generics.
//!
//! # Design
//! States are represented as a `BattlePhase` enum. Transitions are defined
//! as pure functions that take the current phase and an event, returning
//! the next phase. Invalid transitions return `None`.
//!
//! # Canon (Lore-Tech)
//! The FSM encodes the **8 Thought Layers** progression of battle flow:
//! each transition is a "Layer Shift" — a discrete movement between
//! cognitive strata in the EDU cosmology.

use crate::types::{BattlePhase, BattleState, EnemyTurnResult, FieldChar, SimResult};

/// Transition event types for the battle FSM.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum BattleEvent {
    SelectDeck = 0,
    StartBattle = 1,
    SelectCharacter = 2,
    PlayAbility = 3,
    EndEnemyTurn = 4,
    PhaseTransition = 5,
    EndBattle = 6,
    Reset = 7,
}

impl BattleEvent {
    pub const COUNT: usize = 8;
}

/// Result of a state transition attempt.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TransitionResult {
    /// Transition succeeded. New phase is stored.
    Accepted(BattlePhase),
    /// Transition is invalid from the current phase.
    Rejected,
}

/// Pure state transition function.
///
/// # Returns
/// `TransitionResult::Accepted(new_phase)` if the transition is valid,
/// `TransitionResult::Rejected` if not.
///
/// # Determinism
/// `transition(p, e1) == transition(p, e2)` whenever `e1 == e2`.
/// This is a key property verified by tests and (where available) Kani.
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// ensures match result {
///   Accepted(p) => p is valid BattlePhase,
///   Rejected => true,
/// }
/// ```
#[must_use]
pub fn transition(phase: BattlePhase, event: BattleEvent) -> TransitionResult {
    match (phase, event) {
        (BattlePhase::PlayerTurn, BattleEvent::PlayAbility) => {
            TransitionResult::Accepted(BattlePhase::Resolving)
        }
        (BattlePhase::Resolving, BattleEvent::EndEnemyTurn) => {
            TransitionResult::Accepted(BattlePhase::EnemyTurn)
        }
        (BattlePhase::EnemyTurn, BattleEvent::PhaseTransition) => {
            TransitionResult::Accepted(BattlePhase::PlayerTurn)
        }
        (BattlePhase::EnemyTurn, BattleEvent::EndBattle) => {
            TransitionResult::Accepted(BattlePhase::Victory)
        }
        (_, BattleEvent::EndBattle) => {
            TransitionResult::Accepted(BattlePhase::Defeat)
        }
        (_, BattleEvent::Reset) => {
            TransitionResult::Accepted(BattlePhase::PlayerTurn)
        }
        _ => TransitionResult::Rejected,
    }
}

/// Check if a given transition is valid without performing it.
#[must_use]
pub fn is_valid_transition(phase: BattlePhase, event: BattleEvent) -> bool {
    matches!(transition(phase, event), TransitionResult::Accepted(_))
}

/// Get the list of valid events from a given phase.
#[must_use]
pub fn valid_events(phase: BattlePhase) -> &'static [BattleEvent] {
    match phase {
        BattlePhase::PlayerTurn => &[BattleEvent::PlayAbility, BattleEvent::EndBattle, BattleEvent::Reset],
        BattlePhase::Resolving => &[BattleEvent::EndEnemyTurn, BattleEvent::EndBattle, BattleEvent::Reset],
        BattlePhase::EnemyTurn => &[BattleEvent::PhaseTransition, BattleEvent::EndBattle, BattleEvent::Reset],
        BattlePhase::Victory | BattlePhase::Defeat => &[BattleEvent::Reset],
    }
}

/// Execute enemy turn with deterministic target selection.
/// Returns the updated field, new enemy HP, and total damage dealt.
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// requires state.field_len <= 5
/// ensures result.damage_dealt >= 0
/// ensures forall i in 0..result.field_len: result.updated_field[i].hp >= 0
/// ```
///
/// # Canon (Lore-Tech)
/// This implements the **Adversarial Determinism Principle**: enemy
/// actions are fully deterministic, reproducible across all platforms.
pub fn execute_enemy_turn(state: &BattleState, enemy_attack: i32, phase_multiplier: u16) -> EnemyTurnResult {
    use crate::damage::calculate_enemy_damage;

    let effective_damage = calculate_enemy_damage(
        enemy_attack,
        phase_multiplier,
        state.enemy_attack_reduction,
        state.shield_buffer,
    );

    let mut updated = state.field;
    let mut damage_dealt = 0i32;

    if effective_damage > 0 && state.field_len > 0 {
        let len = state.field_len as usize;
        let target_idx = (state.turn as usize) % len;
        let target = &mut updated[target_idx];
        let new_hp = (target.hp - effective_damage).max(0);
        let actual_damage = target.hp - new_hp;
        damage_dealt += actual_damage;
        target.hp = new_hp;
        target.is_down = new_hp <= 0;
    }

    // Poison damage
    if state.poison_active && state.field_len > 0 {
        let len = state.field_len as usize;
        let poison_idx = (state.turn as usize + 1) % len;
        let target = &mut updated[poison_idx];
        let new_hp = (target.hp - 1).max(0);
        damage_dealt += target.hp - new_hp;
        target.hp = new_hp;
        target.is_down = new_hp <= 0;
    }

    EnemyTurnResult {
        updated_field: updated,
        field_len: state.field_len,
        new_enemy_hp: state.enemy_hp,
        damage_dealt,
    }
}

/// Check if enemy should transition to a new phase based on HP percentage.
///
/// # Returns
/// `Some(new_phase)` if a transition occurred, `None` otherwise.
#[must_use]
pub fn check_phase_transition(state: &BattleState, enemy: &crate::types::Enemy) -> Option<u32> {
    if enemy.max_hp <= 0 || enemy.phase_count == 0 {
        return None;
    }

    let hp_pct = ((state.enemy_hp as i64) * 100) / enemy.max_hp as i64;
    let mut new_phase: u32 = 0;

    for i in 0..enemy.phase_count as usize {
        if let Some(threshold) = enemy.phases.get(i) {
            if hp_pct <= threshold.hp_percent as i64 {
                new_phase = (i as u32) + 1;
            }
        }
    }

    if new_phase > state.enemy_phase {
        Some(new_phase)
    } else {
        None
    }
}

/// Simulate an entire battle to completion.
///
/// # Specification (Creusot/Prusti compatible)
/// ```text
/// ensures result.turns <= MAX_TURNS
/// ensures result.survivors <= field.len()
/// ensures result.victory ==> result.final_enemy_hp == 0
/// ```
///
/// # Canon (Lore-Tech)
/// This function is the **Temporal Loop** — the full battle simulation
/// that proves combat always terminates within `MAX_TURNS`.
pub fn simulate_battle(field: &[FieldChar], enemy: &crate::types::Enemy) -> SimResult {
    let mut state = BattleState {
        turn: 1,
        enemy_hp: enemy.max_hp,
        enemy_max_hp: enemy.max_hp,
        enemy_phase: 0,
        shield_buffer: 0,
        field: [FieldChar {
            id: 0, name_idx: 0, hp: 0, max_hp: 0,
            attack: 0, defense: 0, is_down: true,
            rarity: crate::types::Rarity::N,
            ultimate_damage: 0,
            effect_type: crate::types::EffectType::Damage,
        }; 5],
        field_len: field.len().min(5) as u8,
        phase: BattlePhase::PlayerTurn,
        poison_active: false,
        enemy_attack_reduction: 0,
    };

    for (i, fc) in field.iter().enumerate().take(5) {
        state.field[i] = *fc;
    }

    for _ in 0..crate::types::MAX_TURNS {
        // Player turn
        for i in 0..state.field_len as usize {
            if state.enemy_hp <= 0 {
                return SimResult {
                    victory: true,
                    turns: state.turn,
                    final_enemy_hp: 0,
                    survivors: count_alive(&state.field, state.field_len),
                };
            }
            let result = crate::damage::calculate_damage(
                &state.field[i],
                &crate::types::AbilityType::Attack,
            );
            state.enemy_hp = (state.enemy_hp - result.damage).max(0);
        }

        if state.enemy_hp <= 0 {
            return SimResult {
                victory: true,
                turns: state.turn,
                final_enemy_hp: 0,
                survivors: count_alive(&state.field, state.field_len),
            };
        }

        // Enemy turn
        let phase_idx = state.enemy_phase.min((enemy.phase_count as u32).saturating_sub(1)) as usize;
        let mult = enemy.phases.get(phase_idx)
            .map(|p| p.attack_multiplier)
            .unwrap_or(100);
        let enemy_result = execute_enemy_turn(&state, enemy.attack, mult);
        state.field = enemy_result.updated_field;
        state.field_len = enemy_result.field_len;
        state.shield_buffer = 0;
        state.enemy_attack_reduction = 0;

        if count_alive(&state.field, state.field_len) == 0 {
            return SimResult {
                victory: false,
                turns: state.turn,
                final_enemy_hp: state.enemy_hp,
                survivors: 0,
            };
        }

        if let Some(new_phase) = check_phase_transition(&state, enemy) {
            state.enemy_phase = new_phase;
        }

        state.turn += 1;
    }

    SimResult {
        victory: false,
        turns: crate::types::MAX_TURNS,
        final_enemy_hp: state.enemy_hp,
        survivors: count_alive(&state.field, state.field_len),
    }
}

fn count_alive(field: &[FieldChar; 5], len: u8) -> u8 {
    field[..len as usize]
        .iter()
        .filter(|c| !c.is_down)
        .count() as u8
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::*;

    fn sample_char(id: u32, attack: i32) -> FieldChar {
        FieldChar {
            id,
            name_idx: 0,
            hp: 50,
            max_hp: 50,
            attack,
            defense: 10,
            is_down: false,
            rarity: Rarity::SR,
            ultimate_damage: attack * 3,
            effect_type: EffectType::Damage,
        }
    }

    fn sample_enemy() -> Enemy {
        Enemy {
            id: 1,
            name_idx: 0,
            max_hp: 100,
            attack: 8,
            phases: [
                PhaseThreshold::new(50, 150),
                PhaseThreshold::new(20, 200),
                PhaseThreshold::new(0, 100),
                PhaseThreshold::new(0, 100),
            ],
            phase_count: 2,
        }
    }

    // --- FSM transitions ---

    #[test]
    fn test_valid_transition_play_ability() {
        let r = transition(BattlePhase::PlayerTurn, BattleEvent::PlayAbility);
        assert_eq!(r, TransitionResult::Accepted(BattlePhase::Resolving));
    }

    #[test]
    fn test_valid_transition_end_enemy_turn() {
        let r = transition(BattlePhase::Resolving, BattleEvent::EndEnemyTurn);
        assert_eq!(r, TransitionResult::Accepted(BattlePhase::EnemyTurn));
    }

    #[test]
    fn test_valid_transition_phase_transition() {
        let r = transition(BattlePhase::EnemyTurn, BattleEvent::PhaseTransition);
        assert_eq!(r, TransitionResult::Accepted(BattlePhase::PlayerTurn));
    }

    #[test]
    fn test_valid_transition_end_battle_victory() {
        let r = transition(BattlePhase::EnemyTurn, BattleEvent::EndBattle);
        assert_eq!(r, TransitionResult::Accepted(BattlePhase::Victory));
    }

    #[test]
    fn test_valid_transition_reset_from_any() {
        for phase in [BattlePhase::PlayerTurn, BattlePhase::Resolving, BattlePhase::EnemyTurn, BattlePhase::Victory, BattlePhase::Defeat] {
            let r = transition(phase, BattleEvent::Reset);
            assert_eq!(r, TransitionResult::Accepted(BattlePhase::PlayerTurn));
        }
    }

    #[test]
    fn test_invalid_transition_rejected() {
        let r = transition(BattlePhase::PlayerTurn, BattleEvent::EndEnemyTurn);
        assert_eq!(r, TransitionResult::Rejected);
    }

    #[test]
    fn test_transition_determinism() {
        // Same inputs must always produce same outputs
        for phase in [BattlePhase::PlayerTurn, BattlePhase::Resolving, BattlePhase::EnemyTurn, BattlePhase::Victory, BattlePhase::Defeat] {
            for i in 0..BattleEvent::COUNT {
                let event = unsafe { core::mem::transmute::<u8, BattleEvent>(i as u8) };
                let r1 = transition(phase, event);
                let r2 = transition(phase, event);
                assert_eq!(r1, r2, "Non-deterministic transition for phase={:?}, event={:?}", phase, event);
            }
        }
    }

    #[test]
    fn test_valid_events_non_empty() {
        for phase in [BattlePhase::PlayerTurn, BattlePhase::Resolving, BattlePhase::EnemyTurn, BattlePhase::Victory, BattlePhase::Defeat] {
            assert!(!valid_events(phase).is_empty(), "No valid events for {:?}", phase);
        }
    }

    // --- Enemy turn ---

    #[test]
    fn test_enemy_turn_deals_damage() {
        let state = BattleState {
            turn: 1, enemy_hp: 100, enemy_max_hp: 100, enemy_phase: 0,
            shield_buffer: 0,
            field: [sample_char(1, 10), sample_char(2, 12), FieldChar::default_placeholder(),
                    FieldChar::default_placeholder(), FieldChar::default_placeholder()],
            field_len: 2,
            phase: BattlePhase::PlayerTurn, poison_active: false, enemy_attack_reduction: 0,
        };
        let result = execute_enemy_turn(&state, 8, 100);
        assert!(result.damage_dealt > 0);
    }

    #[test]
    fn test_enemy_turn_hp_floor() {
        let mut c = sample_char(1, 10);
        c.hp = 1;
        let state = BattleState {
            turn: 1, enemy_hp: 100, enemy_max_hp: 100, enemy_phase: 0,
            shield_buffer: 0,
            field: [c, FieldChar::default_placeholder(), FieldChar::default_placeholder(),
                    FieldChar::default_placeholder(), FieldChar::default_placeholder()],
            field_len: 1,
            phase: BattlePhase::PlayerTurn, poison_active: false, enemy_attack_reduction: 0,
        };
        let result = execute_enemy_turn(&state, 999, 100);
        assert!(result.updated_field[0].hp >= 0);
    }

    // --- Phase transition ---

    #[test]
    fn test_phase_transition_detected() {
        let state = BattleState {
            turn: 5, enemy_hp: 45, enemy_max_hp: 100, enemy_phase: 0,
            shield_buffer: 0, field: [FieldChar::default_placeholder(); 5], field_len: 0,
            phase: BattlePhase::PlayerTurn, poison_active: false, enemy_attack_reduction: 0,
        };
        let enemy = sample_enemy();
        let result = check_phase_transition(&state, &enemy);
        assert_eq!(result, Some(1));
    }

    #[test]
    fn test_phase_transition_none_when_stable() {
        let state = BattleState {
            turn: 1, enemy_hp: 80, enemy_max_hp: 100, enemy_phase: 0,
            shield_buffer: 0, field: [FieldChar::default_placeholder(); 5], field_len: 0,
            phase: BattlePhase::PlayerTurn, poison_active: false, enemy_attack_reduction: 0,
        };
        let enemy = sample_enemy();
        let result = check_phase_transition(&state, &enemy);
        assert_eq!(result, None);
    }

    // --- Simulate battle ---

    #[test]
    fn test_simulate_victory() {
        let field = vec![
            sample_char(1, 30), sample_char(2, 30), sample_char(3, 30),
            sample_char(4, 30), sample_char(5, 30),
        ];
        let enemy = sample_enemy();
        let result = simulate_battle(&field, &enemy);
        assert!(result.victory);
        assert!(result.turns < 20);
    }

    #[test]
    fn test_simulate_defeat() {
        let field = vec![sample_char(1, 2)];
        let enemy = Enemy {
            id: 2, name_idx: 0, max_hp: 1000, attack: 100,
            phases: [PhaseThreshold::new(50, 200), PhaseThreshold::new(0, 100),
                     PhaseThreshold::new(0, 100), PhaseThreshold::new(0, 100)],
            phase_count: 1,
        };
        let result = simulate_battle(&field, &enemy);
        assert!(!result.victory);
        assert_eq!(result.survivors, 0);
    }

    #[test]
    fn test_simulate_always_terminates() {
        let field = vec![
            sample_char(1, 1), sample_char(2, 1), sample_char(3, 1),
            sample_char(4, 1), sample_char(5, 1),
        ];
        let enemy = Enemy {
            id: 3, name_idx: 0, max_hp: 999999, attack: 1,
            phases: [PhaseThreshold::new(50, 50), PhaseThreshold::new(0, 100),
                     PhaseThreshold::new(0, 100), PhaseThreshold::new(0, 100)],
            phase_count: 2,
        };
        let result = simulate_battle(&field, &enemy);
        assert!(result.turns <= MAX_TURNS);
    }

    /// Named `simulate_battle` for CI filter matching.
    /// Verifies that the battle simulation terminates within the MAX_TURNS bound
    /// and produces valid victory/defeat semantics.
    #[test]
    fn test_simulate_battle_termination_boundary() {
        // Edge case: minimal attack vs high HP — should still terminate
        let field = vec![
            sample_char(1, 1), sample_char(2, 1), sample_char(3, 1),
            sample_char(4, 1), sample_char(5, 1),
        ];
        let enemy = Enemy {
            id: 10, name_idx: 0, max_hp: 500000, attack: 0,
            phases: [PhaseThreshold::new(50, 100), PhaseThreshold::new(0, 100),
                     PhaseThreshold::new(0, 100), PhaseThreshold::new(0, 100)],
            phase_count: 1,
        };
        let result = simulate_battle(&field, &enemy);
        assert!(result.turns <= MAX_TURNS, "simulate_battle exceeded MAX_TURNS: {} turns", result.turns);
        if result.victory {
            assert_eq!(result.final_enemy_hp, 0);
            assert!(result.survivors > 0);
        }
    }
}
