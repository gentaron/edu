use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

/// Character card on the battle field.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FieldChar {
    pub id: String,
    pub name: String,
    pub hp: i32,
    pub max_hp: i32,
    pub attack: i32,
    pub defense: i32,
    pub is_down: bool,
    pub rarity: String,
    pub ultimate_name: String,
    pub ultimate_damage: i32,
    pub effect: String,
}

/// Enemy definition including phase thresholds.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Enemy {
    pub id: String,
    pub name: String,
    pub max_hp: i32,
    pub attack: i32,
    pub phases: Vec<PhaseThreshold>,
}

/// Enemy phase transition threshold.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhaseThreshold {
    pub hp_percent: i32,
    pub message: String,
    pub attack_multiplier: f64,
}

/// Ability type a player can choose.
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum AbilityType {
    Attack,
    Defense,
    Effect,
    Ultimate,
}

/// Result of a single damage/effect calculation.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BattleResult {
    pub damage: i32,
    pub heal: i32,
    pub shield: i32,
    pub attack_reduction: i32,
    pub log: String,
}

/// Full immutable battle state snapshot.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BattleState {
    pub turn: u32,
    pub enemy_hp: i32,
    pub enemy_max_hp: i32,
    pub enemy_phase: u32,
    pub shield_buffer: i32,
    pub field: Vec<FieldChar>,
    pub phase: BattlePhase,
    pub log: Vec<String>,
    pub poison_active: bool,
    pub enemy_attack_reduction: i32,
}

/// Current phase of battle flow.
#[wasm_bindgen]
#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq)]
pub enum BattlePhase {
    PlayerTurn,
    Resolving,
    EnemyTurn,
    Victory,
    Defeat,
}

/// Result of enemy turn execution.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct EnemyTurnResult {
    pub updated_field: Vec<FieldChar>,
    pub new_enemy_hp: i32,
    pub logs: Vec<String>,
}

/// Result of a simulated battle.
#[wasm_bindgen(getter_with_clone)]
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SimResult {
    pub victory: bool,
    pub turns: u32,
    pub final_enemy_hp: i32,
    pub survivors: usize,
}
