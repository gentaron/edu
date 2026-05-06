//! Verification logic for battle commitments.
//!
//! This module contains the pure verification functions that can be called
//! from both WASM and native contexts.

use edu_engine_core::types::{Enemy, PhaseThreshold};
use edu_prover::commitment::{verify_commitment, BattleCommitment};
use edu_prover::replay::ReplayTrace;
use edu_prover::types::{BuildHash, ReplayHash};
use serde::{Deserialize, Serialize};

/// Result of a verification attempt.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct VerifyResult {
    pub valid: bool,
    pub proof_id: String,
    pub reason: String,
    /// Whether this proof uses the current build hash (V2) or legacy (V1).
    pub build_hash_status: BuildHashStatus,
}

/// Status of the build hash check.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BuildHashStatus {
    /// V2 proof with matching build hash.
    Current,
    /// V2 proof with mismatched build hash.
    Mismatched { expected: String, actual: String },
    /// V1 proof (no build hash field).
    Legacy,
    /// No current build hash provided (verifier not configured).
    Unconfigured,
}

/// Verify a commitment from JSON inputs with build hash verification.
///
/// If `current_build_hash_hex` is provided (64-char hex), V2 proofs will be
/// checked against it. If empty or missing, only V1 proofs pass (legacy mode).
#[must_use]
pub fn verify_from_json(
    commitment_json: &str,
    deck_hash_hex: &str,
    enemy_hash_hex: &str,
    current_build_hash_hex: Option<&str>,
) -> VerifyResult {
    // Parse commitment
    let commitment: BattleCommitment = match serde_json::from_str(commitment_json) {
        Ok(c) => c,
        Err(e) => {
            return VerifyResult {
                valid: false,
                proof_id: String::new(),
                reason: format!("Failed to parse commitment: {}", e),
                build_hash_status: BuildHashStatus::Unconfigured,
            };
        }
    };

    // Parse deck hash from hex
    let deck_hash = match hex_to_hash(deck_hash_hex) {
        Some(h) => h,
        None => {
            return VerifyResult {
                valid: false,
                proof_id: commitment.proof_id.to_hex(),
                reason: "Invalid deck hash hex format".to_string(),
                build_hash_status: BuildHashStatus::Unconfigured,
            };
        }
    };

    // Parse enemy hash from hex
    let enemy_hash = match hex_to_hash(enemy_hash_hex) {
        Some(h) => h,
        None => {
            return VerifyResult {
                valid: false,
                proof_id: commitment.proof_id.to_hex(),
                reason: "Invalid enemy hash hex format".to_string(),
                build_hash_status: BuildHashStatus::Unconfigured,
            };
        }
    };

    // Parse current build hash (optional)
    let current_build_hash = match current_build_hash_hex {
        Some(hex) if hex.len() == 64 => {
            BuildHash::from_hex(hex).unwrap_or(BuildHash::zero())
        }
        _ => BuildHash::zero(),
    };

    let proof_id = commitment.proof_id.to_hex();
    let valid = verify_commitment(&commitment, &deck_hash, &enemy_hash, &current_build_hash);

    // Determine build hash status
    let build_hash_status = if commitment.build_hash.is_zero() {
        BuildHashStatus::Legacy
    } else if commitment.build_hash == current_build_hash {
        BuildHashStatus::Current
    } else {
        BuildHashStatus::Mismatched {
            expected: current_build_hash.to_hex(),
            actual: commitment.build_hash.to_hex(),
        }
    };

    if valid {
        VerifyResult {
            valid: true,
            proof_id,
            reason: "Commitment verified".to_string(),
            build_hash_status,
        }
    } else {
        let reason = if !matches!(build_hash_status, BuildHashStatus::Current | BuildHashStatus::Legacy) {
            format!(
                "Build hash mismatch — proof was generated with build {}, current is {}",
                commitment.build_hash.to_hex(),
                current_build_hash.to_hex()
            )
        } else {
            "Public input mismatch — deck or enemy hash does not match commitment".to_string()
        };

        VerifyResult {
            valid: false,
            proof_id,
            reason,
            build_hash_status,
        }
    }
}

/// Legacy verification (pre-η compat) — no build hash checking.
#[must_use]
pub fn verify_from_json_legacy(
    commitment_json: &str,
    deck_hash_hex: &str,
    enemy_hash_hex: &str,
) -> VerifyResult {
    verify_from_json(commitment_json, deck_hash_hex, enemy_hash_hex, None)
}

/// Verify the integrity of a replay trace from JSON.
#[must_use]
pub fn verify_trace_integrity(trace_json: &str) -> VerifyResult {
    let trace: ReplayTrace = match serde_json::from_str(trace_json) {
        Ok(t) => t,
        Err(e) => {
            return VerifyResult {
                valid: false,
                proof_id: String::new(),
                reason: format!("Failed to parse trace: {}", e),
                build_hash_status: BuildHashStatus::Unconfigured,
            };
        }
    };

    let proof_id = trace.proof_id.to_hex();
    let valid = trace.verify_integrity();

    if valid {
        VerifyResult {
            valid: true,
            proof_id,
            reason: "Trace integrity verified".to_string(),
            build_hash_status: BuildHashStatus::Unconfigured,
        }
    } else {
        VerifyResult {
            valid: false,
            proof_id,
            reason: "Witness digest mismatch — action sequence has been tampered with".to_string(),
            build_hash_status: BuildHashStatus::Unconfigured,
        }
    }
}

/// Compute deck commitment hash from JSON array of character IDs.
pub fn compute_deck_hash(char_ids_json: &str) -> Result<String, String> {
    let ids: [u32; 5] = serde_json::from_str(char_ids_json)
        .map_err(|e| format!("Invalid char IDs format: {}", e))?;
    Ok(ReplayTrace::compute_deck_commitment(&ids).to_hex())
}

/// Compute enemy seed hash from JSON enemy definition.
pub fn compute_enemy_hash(enemy_json: &str) -> Result<String, String> {
    #[derive(Deserialize)]
    struct EnemyInput {
        id: u32,
        max_hp: i32,
        attack: i32,
        phases: Vec<PhaseInput>,
    }
    #[derive(Deserialize)]
    struct PhaseInput {
        hp_percent: i32,
        attack_multiplier: u16,
    }

    let input: EnemyInput = serde_json::from_str(enemy_json)
        .map_err(|e| format!("Invalid enemy format: {}", e))?;

    let phase_count = input.phases.len().min(4) as u8;
    let mut phases = [
        PhaseThreshold::new(0, 100),
        PhaseThreshold::new(0, 100),
        PhaseThreshold::new(0, 100),
        PhaseThreshold::new(0, 100),
    ];
    for (i, p) in input.phases.iter().enumerate().take(4) {
        phases[i] = PhaseThreshold::new(p.hp_percent, p.attack_multiplier);
    }

    let enemy = Enemy {
        id: input.id,
        name_idx: 0,
        max_hp: input.max_hp,
        attack: input.attack,
        phases,
        phase_count,
    };

    Ok(ReplayTrace::compute_enemy_seed(&enemy).to_hex())
}

/// Convert a hex string to a ReplayHash.
fn hex_to_hash(hex: &str) -> Option<ReplayHash> {
    if hex.len() != 64 {
        return None;
    }
    let mut bytes = [0u8; 32];
    for i in 0..32 {
        bytes[i] = u8::from_str_radix(&hex[i * 2..i * 2 + 2], 16).ok()?;
    }
    Some(ReplayHash::from_bytes(bytes))
}

#[cfg(test)]
mod tests {
    use super::*;
    use edu_engine_core::types::{EffectType, FieldChar, Rarity};
    use edu_prover::commitment::CommitmentBuilder;

    fn sample_field() -> Vec<FieldChar> {
        (0..5u32)
            .map(|i| FieldChar {
                id: i + 1,
                name_idx: 0,
                hp: 50,
                max_hp: 50,
                attack: 20,
                defense: 10,
                is_down: false,
                rarity: Rarity::SR,
                ultimate_damage: 60,
                effect_type: EffectType::Damage,
            })
            .collect()
    }

    #[test]
    fn test_verify_valid_commitment_json() {
        let deck_hash = ReplayHash::from_data(b"test-deck");
        let enemy_hash = ReplayHash::from_data(b"test-enemy");
        let bh = BuildHash::from_artifacts(b"test-build");

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .build_hash(bh)
            .finalize(edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 5,
                final_enemy_hp: 0,
                survivors: 3,
            });

        let json = serde_json::to_string(&commitment).unwrap();
        let result = verify_from_json(&json, &deck_hash.to_hex(), &enemy_hash.to_hex(), Some(&bh.to_hex()));
        assert!(result.valid);
        assert!(matches!(result.build_hash_status, BuildHashStatus::Current));
    }

    #[test]
    fn test_verify_v2_mismatched_build_hash() {
        let deck_hash = ReplayHash::from_data(b"test-deck");
        let enemy_hash = ReplayHash::from_data(b"test-enemy");
        let bh = BuildHash::from_artifacts(b"correct-build");

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .build_hash(bh)
            .finalize(edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 5,
                final_enemy_hp: 0,
                survivors: 3,
            });

        let json = serde_json::to_string(&commitment).unwrap();
        let wrong_bh = BuildHash::from_artifacts(b"wrong-build").to_hex();
        let result = verify_from_json(&json, &deck_hash.to_hex(), &enemy_hash.to_hex(), Some(&wrong_bh));
        assert!(!result.valid);
        assert!(result.reason.contains("Build hash mismatch"));
        assert!(matches!(result.build_hash_status, BuildHashStatus::Mismatched { .. }));
    }

    #[test]
    fn test_verify_v1_legacy_passes() {
        let deck_hash = ReplayHash::from_data(b"test-deck");
        let enemy_hash = ReplayHash::from_data(b"test-enemy");

        // V1 commitment (no build hash)
        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .finalize(edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 5,
                final_enemy_hp: 0,
                survivors: 3,
            });

        let json = serde_json::to_string(&commitment).unwrap();
        let result = verify_from_json(&json, &deck_hash.to_hex(), &enemy_hash.to_hex(), None);
        assert!(result.valid);
        assert!(matches!(result.build_hash_status, BuildHashStatus::Legacy));
    }

    #[test]
    fn test_verify_invalid_deck_hash() {
        let deck_hash = ReplayHash::from_data(b"test-deck");
        let enemy_hash = ReplayHash::from_data(b"test-enemy");

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .finalize(edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 5,
                final_enemy_hp: 0,
                survivors: 3,
            });

        let json = serde_json::to_string(&commitment).unwrap();
        let wrong_deck = ReplayHash::from_data(b"wrong").to_hex();
        let result = verify_from_json(&json, &wrong_deck, &enemy_hash.to_hex(), None);
        assert!(!result.valid);
        assert!(result.reason.contains("mismatch"));
    }

    #[test]
    fn test_verify_malformed_json() {
        let result = verify_from_json("not json", "a".repeat(64).as_str(), "b".repeat(64).as_str(), None);
        assert!(!result.valid);
        assert!(result.reason.contains("parse"));
    }

    #[test]
    fn test_verify_invalid_hex() {
        let commitment = CommitmentBuilder::new()
            .deck_commitment(ReplayHash::from_data(b"d"))
            .enemy_seed(ReplayHash::from_data(b"e"))
            .finalize(edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 1,
                final_enemy_hp: 0,
                survivors: 5,
            });

        let json = serde_json::to_string(&commitment).unwrap();
        let result = verify_from_json(&json, "short", "also-short", None);
        assert!(!result.valid);
        assert!(result.reason.contains("hex"));
    }

    #[test]
    fn test_verify_from_json_legacy_compat() {
        let deck_hash = ReplayHash::from_data(b"test-deck");
        let enemy_hash = ReplayHash::from_data(b"test-enemy");

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .finalize(edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 3,
                final_enemy_hp: 0,
                survivors: 4,
            });

        let json = serde_json::to_string(&commitment).unwrap();
        let result = verify_from_json_legacy(&json, &deck_hash.to_hex(), &enemy_hash.to_hex());
        assert!(result.valid);
        assert!(matches!(result.build_hash_status, BuildHashStatus::Legacy));
    }

    #[test]
    fn test_verify_trace_integrity_valid() {
        let field = sample_field();
        let enemy = edu_engine_core::types::Enemy {
            id: 1,
            name_idx: 0,
            max_hp: 100,
            attack: 10,
            phases: [
                PhaseThreshold::new(50, 150),
                PhaseThreshold::new(0, 100),
                PhaseThreshold::new(0, 100),
                PhaseThreshold::new(0, 100),
            ],
            phase_count: 1,
        };
        let trace = ReplayTrace::new(
            &field,
            &enemy,
            vec![],
            edu_prover::replay::OutcomeRecord {
                victory: false,
                total_turns: 0,
                final_enemy_hp: 100,
                survivors: 5,
            },
        );
        let json = serde_json::to_string(&trace).unwrap();
        let result = verify_trace_integrity(&json);
        assert!(result.valid);
    }

    #[test]
    fn test_verify_trace_integrity_tampered() {
        let field = sample_field();
        let enemy = edu_engine_core::types::Enemy {
            id: 1,
            name_idx: 0,
            max_hp: 100,
            attack: 10,
            phases: [
                PhaseThreshold::new(50, 150),
                PhaseThreshold::new(0, 100),
                PhaseThreshold::new(0, 100),
                PhaseThreshold::new(0, 100),
            ],
            phase_count: 1,
        };
        let mut trace = ReplayTrace::new(
            &field,
            &enemy,
            vec![],
            edu_prover::replay::OutcomeRecord {
                victory: true,
                total_turns: 5,
                final_enemy_hp: 0,
                survivors: 3,
            },
        );
        // Tamper with witness
        trace.witness = edu_prover::types::WitnessDigest::from_actions(b"tampered");
        let json = serde_json::to_string(&trace).unwrap();
        let result = verify_trace_integrity(&json);
        assert!(!result.valid);
        assert!(result.reason.contains("tampered"));
    }

    #[test]
    fn test_compute_deck_hash_valid() {
        let json = "[1, 2, 3, 4, 5]";
        let result = compute_deck_hash(json).unwrap();
        assert_eq!(result.len(), 64); // hex
        assert!(result.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn test_compute_deck_hash_invalid() {
        let json = "[1, 2, 3]";
        assert!(compute_deck_hash(json).is_err());
    }

    #[test]
    fn test_compute_enemy_hash_valid() {
        let json = r#"{"id":1,"max_hp":200,"attack":15,"phases":[{"hp_percent":50,"attack_multiplier":150}]}"#;
        let result = compute_enemy_hash(json).unwrap();
        assert_eq!(result.len(), 64);
    }

    #[test]
    fn test_hex_to_hash_valid() {
        let hash = ReplayHash::from_data(b"test");
        let hex = hash.to_hex();
        let restored = hex_to_hash(&hex).unwrap();
        assert_eq!(hash, restored);
    }

    #[test]
    fn test_hex_to_hash_invalid_length() {
        assert!(hex_to_hash("abc").is_none());
    }

    #[test]
    fn test_hex_to_hash_invalid_chars() {
        assert!(hex_to_hash(&"gg".repeat(32)).is_none());
    }
}
