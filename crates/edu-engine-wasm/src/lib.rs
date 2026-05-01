//! edu-engine-wasm: wasm-bindgen shell wrapping edu-engine-core.
//!
//! This crate is the ONLY crate that touches JavaScript/WASM APIs.
//! All game logic lives in `edu-engine-core` (no_std).

use wasm_bindgen::prelude::*;
use edu_engine_core::types::*;

/// WASM bridge: calculate damage for a player ability.
#[wasm_bindgen]
#[allow(clippy::too_many_arguments)]
pub fn calculate_damage_wasm(
    _id: &str,
    _name: &str,
    hp: i32,
    max_hp: i32,
    attack: i32,
    defense: i32,
    is_down: bool,
    _rarity: &str,
    _ultimate_name: &str,
    ultimate_damage: i32,
    _effect: &str,
    effect_type_byte: u8,
    ability_idx: u8,
) -> String {
    let character = FieldChar {
        id: 0,
        name_idx: 0,
        hp,
        max_hp,
        attack,
        defense,
        is_down,
        rarity: Rarity::SR,
        ultimate_damage,
        effect_type: EffectType::from_discriminant(effect_type_byte).unwrap_or(EffectType::Damage),
    };
    let ability = AbilityType::from_u8(ability_idx);
    let result = edu_engine_core::damage::calculate_damage(&character, &ability);
    serde_json::to_string(&result).unwrap_or_default()
}

/// WASM bridge: execute enemy turn.
#[wasm_bindgen]
#[allow(clippy::too_many_arguments)]
pub fn execute_enemy_turn_wasm(
    turn: u32,
    enemy_hp: i32,
    enemy_max_hp: i32,
    enemy_phase: u32,
    shield_buffer: i32,
    _field_json: &str,
    enemy_json: &str,
    poison_active: bool,
    enemy_attack_reduction: i32,
) -> String {
    let state = BattleState {
        turn,
        enemy_hp,
        enemy_max_hp,
        enemy_phase,
        shield_buffer,
        field: [FieldChar::default_placeholder(); 5],
        field_len: 0,
        phase: BattlePhase::PlayerTurn,
        poison_active,
        enemy_attack_reduction,
    };
    let enemy: edu_engine_core::types::Enemy = match serde_json::from_str(enemy_json) {
        Ok(e) => e,
        Err(e) => {
            web_sys::console::error_1(&JsValue::from_str(&format!("Enemy parse: {}", e)));
            return String::new();
        }
    };
    let phase_idx = enemy_phase.min((enemy.phase_count as u32).saturating_sub(1)) as usize;
    let mult = enemy.phases.get(phase_idx).map(|p| p.attack_multiplier).unwrap_or(100);
    let result = edu_engine_core::fsm::execute_enemy_turn(&state, enemy.attack, mult);
    serde_json::to_string(&result).unwrap_or_default()
}

/// WASM bridge: check enemy phase transition.
#[wasm_bindgen]
pub fn check_phase_transition_wasm(
    enemy_hp: i32,
    enemy_max_hp: i32,
    enemy_phase: u32,
    enemy_json: &str,
) -> String {
    let state = BattleState {
        turn: 0,
        enemy_hp,
        enemy_max_hp,
        enemy_phase,
        shield_buffer: 0,
        field: [FieldChar::default_placeholder(); 5],
        field_len: 0,
        phase: BattlePhase::PlayerTurn,
        poison_active: false,
        enemy_attack_reduction: 0,
    };
    let enemy: edu_engine_core::types::Enemy = match serde_json::from_str(enemy_json) {
        Ok(e) => e,
        Err(_) => return "null".to_string(),
    };
    match edu_engine_core::fsm::check_phase_transition(&state, &enemy) {
        Some(phase) => serde_json::to_string(&phase).unwrap_or_default(),
        None => "null".to_string(),
    }
}

/// WASM bridge: simulate entire battle for benchmarking.
#[wasm_bindgen]
pub fn simulate_battle_wasm(field_json: &str, enemy_json: &str) -> String {
    let field: Vec<FieldChar> = match serde_json::from_str(field_json) {
        Ok(f) => f,
        Err(_) => return String::new(),
    };
    let enemy: edu_engine_core::types::Enemy = match serde_json::from_str(enemy_json) {
        Ok(e) => e,
        Err(_) => return String::new(),
    };
    let result = edu_engine_core::fsm::simulate_battle(&field, &enemy);
    serde_json::to_string(&result).unwrap_or_default()
}
