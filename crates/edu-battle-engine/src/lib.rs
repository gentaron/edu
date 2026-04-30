pub mod types;
pub mod combat;

use wasm_bindgen::prelude::*;
use types::*;

/// WASM bridge: calculate damage for a player ability.
#[wasm_bindgen]
pub fn calculate_damage_wasm(
    id: &str,
    name: &str,
    hp: i32,
    max_hp: i32,
    attack: i32,
    defense: i32,
    is_down: bool,
    rarity: &str,
    ultimate_name: &str,
    ultimate_damage: i32,
    effect: &str,
    ability_idx: u8,
) -> JsValue {
    let character = FieldChar {
        id: id.to_string(),
        name: name.to_string(),
        hp,
        max_hp,
        attack,
        defense,
        is_down,
        rarity: rarity.to_string(),
        ultimate_name: ultimate_name.to_string(),
        ultimate_damage,
        effect: effect.to_string(),
    };
    let ability = match ability_idx {
        0 => AbilityType::Attack,
        1 => AbilityType::Defense,
        2 => AbilityType::Effect,
        3 => AbilityType::Ultimate,
        _ => AbilityType::Attack,
    };
    let result = combat::calculate_damage(&character, &ability);
    serde_wasm_bindgen::to_value(&result).unwrap_or(JsValue::UNDEFINED)
}

/// WASM bridge: execute enemy turn.
#[wasm_bindgen]
pub fn execute_enemy_turn_wasm(
    turn: u32,
    enemy_hp: i32,
    enemy_max_hp: i32,
    enemy_phase: u32,
    shield_buffer: i32,
    field_json: &str,
    enemy_json: &str,
    poison_active: bool,
    enemy_attack_reduction: i32,
) -> JsValue {
    let field: Vec<FieldChar> = match serde_json::from_str(field_json) {
        Ok(f) => f,
        Err(e) => {
            web_sys::console::error_1(&JsValue::from_str(&format!(
                "Failed to parse field: {}", e
            )));
            return JsValue::UNDEFINED;
        }
    };
    let enemy: Enemy = match serde_json::from_str(enemy_json) {
        Ok(e) => e,
        Err(e) => {
            web_sys::console::error_1(&JsValue::from_str(&format!(
                "Failed to parse enemy: {}", e
            )));
            return JsValue::UNDEFINED;
        }
    };

    let state = BattleState {
        turn,
        enemy_hp,
        enemy_max_hp,
        enemy_phase,
        shield_buffer,
        field,
        phase: BattlePhase::PlayerTurn,
        log: Vec::new(),
        poison_active,
        enemy_attack_reduction,
    };

    let result = combat::execute_enemy_turn(&state, &enemy);
    serde_wasm_bindgen::to_value(&result).unwrap_or(JsValue::UNDEFINED)
}

/// WASM bridge: check enemy phase transition.
#[wasm_bindgen]
pub fn check_phase_transition_wasm(
    enemy_hp: i32,
    enemy_max_hp: i32,
    enemy_phase: u32,
    enemy_json: &str,
) -> JsValue {
    let enemy: Enemy = match serde_json::from_str(enemy_json) {
        Ok(e) => e,
        Err(_) => return JsValue::UNDEFINED,
    };
    let state = BattleState {
        turn: 0,
        enemy_hp,
        enemy_max_hp,
        enemy_phase,
        shield_buffer: 0,
        field: Vec::new(),
        phase: BattlePhase::PlayerTurn,
        log: Vec::new(),
        poison_active: false,
        enemy_attack_reduction: 0,
    };
    let result = combat::check_phase_transition(&state, &enemy);
    serde_wasm_bindgen::to_value(&result).unwrap_or(JsValue::UNDEFINED)
}

/// WASM bridge: simulate entire battle for benchmarking.
#[wasm_bindgen]
pub fn simulate_battle_wasm(field_json: &str, enemy_json: &str) -> JsValue {
    let field: Vec<FieldChar> = match serde_json::from_str(field_json) {
        Ok(f) => f,
        Err(_) => return JsValue::UNDEFINED,
    };
    let enemy: Enemy = match serde_json::from_str(enemy_json) {
        Ok(e) => e,
        Err(_) => return JsValue::UNDEFINED,
    };
    let result = combat::simulate_battle(field, &enemy);
    serde_wasm_bindgen::to_value(&result).unwrap_or(JsValue::UNDEFINED)
}
