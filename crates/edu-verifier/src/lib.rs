//! # edu-verifier
//!
//! Browser-side replay verifier — WASM bridge for verifying battle commitments.
//!
//! This crate exposes a minimal WASM API for the browser to verify that
//! a battle replay's cryptographic commitment is valid, without revealing
//! the private action sequence.
//!
//! ## Canon Mapping (Lore-Tech)
//! The verifier is the **Horizon Observer** — an entity positioned at the
//! Dimension Horizon that can confirm the validity of a Dimensional Seal
//! (commitment) without peering into the sealed timeline (private inputs).

pub mod verify;

use wasm_bindgen::prelude::*;

/// Verify a battle commitment from the browser.
///
/// # Arguments
/// * `commitment_json` - JSON-serialized BattleCommitment
/// * `deck_hash_hex` - Expected deck commitment hash (hex)
/// * `enemy_hash_hex` - Expected enemy seed hash (hex)
///
/// # Returns
/// JSON object: `{ "valid": boolean, "proof_id": string, "reason": string }`
#[wasm_bindgen]
pub fn verify_replay_wasm(
    commitment_json: &str,
    deck_hash_hex: &str,
    enemy_hash_hex: &str,
) -> JsValue {
    let result = verify::verify_from_json(commitment_json, deck_hash_hex, enemy_hash_hex);
    serde_wasm_bindgen::to_value(&result).unwrap_or(JsValue::UNDEFINED)
}

/// Generate a deck commitment hash from character IDs.
///
/// # Arguments
/// * `char_ids_json` - JSON array of 5 u32 values
///
/// # Returns
/// Hex string of the deck commitment hash
#[wasm_bindgen]
pub fn compute_deck_hash_wasm(char_ids_json: &str) -> JsValue {
    match verify::compute_deck_hash(char_ids_json) {
        Ok(hex) => JsValue::from_str(&hex),
        Err(e) => {
            web_sys::console::error_1(&JsValue::from_str(&format!(
                "compute_deck_hash error: {}", e
            )));
            JsValue::from_str("")
        }
    }
}

/// Generate an enemy seed hash from enemy definition.
///
/// # Arguments
/// * `enemy_json` - JSON object with { id, max_hp, attack, phases }
///
/// # Returns
/// Hex string of the enemy seed hash
#[wasm_bindgen]
pub fn compute_enemy_hash_wasm(enemy_json: &str) -> JsValue {
    match verify::compute_enemy_hash(enemy_json) {
        Ok(hex) => JsValue::from_str(&hex),
        Err(e) => {
            web_sys::console::error_1(&JsValue::from_str(&format!(
                "compute_enemy_hash error: {}", e
            )));
            JsValue::from_str("")
        }
    }
}

/// Verify the integrity of a serialized replay trace.
///
/// # Arguments
/// * `trace_json` - JSON-serialized ReplayTrace
///
/// # Returns
/// JSON object: `{ "valid": boolean, "proof_id": string }`
#[wasm_bindgen]
pub fn verify_trace_integrity_wasm(trace_json: &str) -> JsValue {
    let result = verify::verify_trace_integrity(trace_json);
    serde_wasm_bindgen::to_value(&result).unwrap_or(JsValue::UNDEFINED)
}
