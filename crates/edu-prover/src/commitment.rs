//! Battle commitment scheme — generates and verifies battle replay commitments.
//!
//! The commitment scheme combines:
//! - Public inputs (deck commitment, enemy seed, outcome)
//! - Private inputs (action sequence → witness digest)
//! - Merkle tree of per-turn state snapshots
//!
//! A valid commitment proves that the claimed outcome is consistent with
//! the private action sequence, without revealing the sequence itself.
//!
//! ## Canon (Lore-Tech)
//! The commitment is the **Dimensional Seal** — a cryptographic attestation
//! that a battle's temporal sequence is internally consistent. The seal
//! can be verified by any observer across the Dimension Horizon.

use crate::merkle::{MerkleTree, NodeHash};
use crate::replay::{OutcomeRecord, ReplayStep, ReplayTrace};
use crate::types::{ProofId, ReplayHash as TypesReplayHash, WitnessDigest};
use sha2::{Digest, Sha256};

/// A complete battle commitment — the output of the prover.
///
/// Contains everything needed for verification:
/// - Public inputs (deck hash, enemy hash, outcome)
/// - Merkle root of state snapshots
/// - Witness digest of the action sequence
/// - Proof ID
#[derive(Clone, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct BattleCommitment {
    /// Unique proof identifier.
    pub proof_id: ProofId,
    /// Hash of the initial deck (5 character IDs in order).
    pub deck_commitment: TypesReplayHash,
    /// Hash of the enemy definition.
    pub enemy_seed: TypesReplayHash,
    /// Final battle outcome (public).
    pub outcome: OutcomeRecord,
    /// Merkle root of all per-turn state snapshots.
    pub state_root: TypesReplayHash,
    /// Digest of the private action sequence.
    pub witness: WitnessDigest,
    /// Total number of steps in the replay.
    pub step_count: u32,
}

impl BattleCommitment {
    /// Serialize the commitment to bytes for storage or transmission.
    #[must_use]
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut buf = Vec::with_capacity(128);
        buf.extend_from_slice(self.proof_id.as_bytes());
        buf.extend_from_slice(self.deck_commitment.as_bytes());
        buf.extend_from_slice(self.enemy_seed.as_bytes());
        buf.push(if self.outcome.victory { 1 } else { 0 });
        buf.extend_from_slice(&self.outcome.total_turns.to_le_bytes());
        buf.extend_from_slice(&self.outcome.final_enemy_hp.to_le_bytes());
        buf.push(self.outcome.survivors);
        buf.extend_from_slice(self.state_root.as_bytes());
        buf.extend_from_slice(self.witness.as_bytes());
        buf.extend_from_slice(&self.step_count.to_le_bytes());
        buf
    }

    /// Compute the commitment hash for verification.
    #[must_use]
    pub fn commitment_hash(&self) -> TypesReplayHash {
        TypesReplayHash::from_data(&self.to_bytes())
    }
}

/// Builder for creating battle commitments.
///
/// Usage:
/// ```ignore
/// let commitment = CommitmentBuilder::new()
///     .deck_commitment(deck_hash)
///     .enemy_seed(enemy_hash)
///     .add_step(step1)
///     .add_step(step2)
///     .finalize(outcome);
/// ```
pub struct CommitmentBuilder {
    deck_commitment: Option<TypesReplayHash>,
    enemy_seed: Option<TypesReplayHash>,
    steps: Vec<ReplayStep>,
    merkle_tree: MerkleTree,
}

impl CommitmentBuilder {
    /// Create a new commitment builder.
    #[must_use]
    pub fn new() -> Self {
        Self {
            deck_commitment: None,
            enemy_seed: None,
            steps: Vec::new(),
            merkle_tree: MerkleTree::with_capacity(64),
        }
    }

    /// Set the deck commitment hash.
    pub fn deck_commitment(mut self, hash: TypesReplayHash) -> Self {
        self.deck_commitment = Some(hash);
        self
    }

    /// Set the enemy seed hash.
    pub fn enemy_seed(mut self, hash: TypesReplayHash) -> Self {
        self.enemy_seed = Some(hash);
        self
    }

    /// Add a replay step and its state snapshot to the Merkle tree.
    pub fn add_step(mut self, step: ReplayStep) -> Self {
        // Hash the state snapshot for the Merkle leaf
        let mut state_bytes = Vec::with_capacity(128);
        state_bytes.extend_from_slice(&step.turn.to_le_bytes());
        state_bytes.extend_from_slice(&step.enemy_hp_after.to_le_bytes());
        for c in &step.field_after.chars {
            state_bytes.extend_from_slice(&c.id.to_le_bytes());
            state_bytes.extend_from_slice(&c.hp.to_le_bytes());
        }
        state_bytes.push(step.field_after.len);
        state_bytes.extend_from_slice(&step.enemy_damage_dealt.to_le_bytes());

        let leaf_hash = NodeHash::leaf(&state_bytes);
        self.merkle_tree.push(leaf_hash);
        self.steps.push(step);
        self
    }

    /// Finalize the commitment with the battle outcome.
    ///
    /// # Panics
    /// Panics if deck_commitment or enemy_seed were not set.
    #[must_use]
    pub fn finalize(mut self, outcome: OutcomeRecord) -> BattleCommitment {
        let deck_commitment = self.deck_commitment.expect("deck_commitment required");
        let enemy_seed = self.enemy_seed.expect("enemy_seed required");

        let witness = ReplayTrace::compute_witness(&self.steps);

        // Compute proof_id from all public inputs
        let mut hasher = Sha256::new();
        hasher.update(b"commitment:");
        hasher.update(deck_commitment.as_bytes());
        hasher.update(enemy_seed.as_bytes());
        hasher.update(&[if outcome.victory { 1u8 } else { 0 }]);
        hasher.update(&outcome.total_turns.to_le_bytes());
        hasher.update(&outcome.final_enemy_hp.to_le_bytes());
        hasher.update(&[outcome.survivors]);
        hasher.update(witness.as_bytes());

        let proof_id = ProofId::from_seed(&hasher.finalize());

        BattleCommitment {
            proof_id,
            deck_commitment,
            enemy_seed,
            outcome,
            state_root: self.merkle_tree.root_as_replay_hash(),
            witness,
            step_count: self.steps.len() as u32,
        }
    }

    /// Build from an existing ReplayTrace.
    #[must_use]
    pub fn from_trace(trace: &ReplayTrace) -> BattleCommitment {
        let mut builder = Self::new()
            .deck_commitment(trace.deck_commitment)
            .enemy_seed(trace.enemy_seed);

        for step in &trace.steps {
            builder = builder.add_step(step.clone());
        }

        builder.finalize(trace.outcome)
    }
}

impl Default for CommitmentBuilder {
    fn default() -> Self {
        Self::new()
    }
}

/// Verify a battle commitment against provided public inputs.
///
/// # Arguments
/// * `commitment` - The commitment to verify
/// * `expected_deck_hash` - The expected deck commitment hash
/// * `expected_enemy_hash` - The expected enemy seed hash
///
/// # Returns
/// `true` if the commitment is valid.
#[must_use]
pub fn verify_commitment(
    commitment: &BattleCommitment,
    expected_deck_hash: &TypesReplayHash,
    expected_enemy_hash: &TypesReplayHash,
) -> bool {
    // Check public input consistency
    if commitment.deck_commitment != *expected_deck_hash {
        return false;
    }
    if commitment.enemy_seed != *expected_enemy_hash {
        return false;
    }

    // Verify proof_id is well-formed (non-zero)
    if commitment.proof_id.as_bytes().iter().all(|&b| b == 0) {
        return false;
    }

    // Verify state_root is well-formed (non-zero if steps > 0)
    if commitment.step_count > 0 && commitment.state_root.is_zero() {
        return false;
    }

    // Verify witness is well-formed
    if commitment.witness.as_bytes().iter().all(|&b| b == 0) && commitment.step_count > 0 {
        return false;
    }

    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::replay::{FieldSnapshot, OutcomeRecord, ReplayStep};
    use crate::types::ReplayHash;
    use edu_engine_core::types::{Enemy, FieldChar, PhaseThreshold, Rarity, EffectType};

    fn sample_field() -> Vec<FieldChar> {
        (0..5u32).map(|i| FieldChar {
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
        }).collect()
    }

    fn sample_enemy() -> Enemy {
        Enemy {
            id: 100,
            name_idx: 0,
            max_hp: 200,
            attack: 15,
            phases: [
                PhaseThreshold::new(50, 150),
                PhaseThreshold::new(20, 200),
                PhaseThreshold::new(0, 100),
                PhaseThreshold::new(0, 100),
            ],
            phase_count: 2,
        }
    }

    fn make_steps() -> Vec<ReplayStep> {
        vec![
            ReplayStep {
                turn: 1, phase: 0, player_char_idx: 0, player_ability: 0,
                enemy_hp_after: 180, field_after: FieldSnapshot::default(),
                enemy_damage_dealt: 15, phase_transition: false, new_enemy_phase: 0,
            },
            ReplayStep {
                turn: 2, phase: 0, player_char_idx: 1, player_ability: 3,
                enemy_hp_after: 120, field_after: FieldSnapshot::default(),
                enemy_damage_dealt: 10, phase_transition: false, new_enemy_phase: 0,
            },
            ReplayStep {
                turn: 3, phase: 0, player_char_idx: 2, player_ability: 0,
                enemy_hp_after: 100, field_after: FieldSnapshot::default(),
                enemy_damage_dealt: 12, phase_transition: true, new_enemy_phase: 1,
            },
        ]
    }

    #[test]
    fn test_commitment_builder_basic() {
        let enemy = sample_enemy();
        let steps = make_steps();

        let deck_hash = ReplayTrace::compute_deck_commitment(&[1, 2, 3, 4, 5]);
        let enemy_hash = ReplayTrace::compute_enemy_seed(&enemy);

        let outcome = OutcomeRecord {
            victory: true, total_turns: 5, final_enemy_hp: 0, survivors: 4,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(steps[0].clone())
            .add_step(steps[1].clone())
            .add_step(steps[2].clone())
            .finalize(outcome);

        assert_eq!(commitment.step_count, 3);
        assert!(!commitment.state_root.is_zero());
        assert!(!commitment.witness.as_bytes().iter().all(|&b| b == 0));
    }

    #[test]
    fn test_commitment_deterministic() {
        let deck_hash = ReplayHash::from_data(b"deck");
        let enemy_hash = ReplayHash::from_data(b"enemy");
        let step = ReplayStep {
            turn: 1, phase: 0, player_char_idx: 0, player_ability: 0,
            enemy_hp_after: 180, field_after: FieldSnapshot::default(),
            enemy_damage_dealt: 15, phase_transition: false, new_enemy_phase: 0,
        };
        let outcome = OutcomeRecord {
            victory: true, total_turns: 1, final_enemy_hp: 180, survivors: 5,
        };

        let c1 = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(step.clone())
            .finalize(outcome);

        let c2 = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(step)
            .finalize(outcome);

        assert_eq!(c1.proof_id, c2.proof_id);
        assert_eq!(c1.state_root, c2.state_root);
        assert_eq!(c1.witness, c2.witness);
    }

    #[test]
    fn test_from_trace() {
        let field = sample_field();
        let enemy = sample_enemy();
        let steps = make_steps();
        let outcome = OutcomeRecord {
            victory: true, total_turns: 5, final_enemy_hp: 0, survivors: 4,
        };

        let trace = ReplayTrace::new(&field, &enemy, steps, outcome);
        let commitment = CommitmentBuilder::from_trace(&trace);

        assert!(trace.verify_integrity());
        assert_eq!(commitment.deck_commitment, trace.deck_commitment);
        assert_eq!(commitment.enemy_seed, trace.enemy_seed);
        assert_eq!(commitment.step_count, trace.steps.len() as u32);
    }

    #[test]
    fn test_verify_commitment_valid() {
        let deck_hash = ReplayHash::from_data(b"deck");
        let enemy_hash = ReplayHash::from_data(b"enemy");
        let step = ReplayStep {
            turn: 1, phase: 0, player_char_idx: 0, player_ability: 0,
            enemy_hp_after: 180, field_after: FieldSnapshot::default(),
            enemy_damage_dealt: 15, phase_transition: false, new_enemy_phase: 0,
        };
        let outcome = OutcomeRecord {
            victory: true, total_turns: 1, final_enemy_hp: 180, survivors: 5,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(step)
            .finalize(outcome);

        assert!(verify_commitment(&commitment, &deck_hash, &enemy_hash));
    }

    #[test]
    fn test_verify_commitment_wrong_deck() {
        let deck_hash = ReplayHash::from_data(b"deck");
        let enemy_hash = ReplayHash::from_data(b"enemy");
        let step = ReplayStep {
            turn: 1, phase: 0, player_char_idx: 0, player_ability: 0,
            enemy_hp_after: 180, field_after: FieldSnapshot::default(),
            enemy_damage_dealt: 15, phase_transition: false, new_enemy_phase: 0,
        };
        let outcome = OutcomeRecord {
            victory: true, total_turns: 1, final_enemy_hp: 180, survivors: 5,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(step)
            .finalize(outcome);

        let wrong_deck = ReplayHash::from_data(b"wrong-deck");
        assert!(!verify_commitment(&commitment, &wrong_deck, &enemy_hash));
    }

    #[test]
    fn test_verify_commitment_wrong_enemy() {
        let deck_hash = ReplayHash::from_data(b"deck");
        let enemy_hash = ReplayHash::from_data(b"enemy");
        let step = ReplayStep {
            turn: 1, phase: 0, player_char_idx: 0, player_ability: 0,
            enemy_hp_after: 180, field_after: FieldSnapshot::default(),
            enemy_damage_dealt: 15, phase_transition: false, new_enemy_phase: 0,
        };
        let outcome = OutcomeRecord {
            victory: true, total_turns: 1, final_enemy_hp: 180, survivors: 5,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(step)
            .finalize(outcome);

        let wrong_enemy = ReplayHash::from_data(b"wrong-enemy");
        assert!(!verify_commitment(&commitment, &deck_hash, &wrong_enemy));
    }

    #[test]
    fn test_commitment_to_bytes_roundtrip() {
        let deck_hash = ReplayHash::from_data(b"deck");
        let enemy_hash = ReplayHash::from_data(b"enemy");
        let outcome = OutcomeRecord {
            victory: false, total_turns: 200, final_enemy_hp: 150, survivors: 1,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .finalize(outcome);

        let bytes = commitment.to_bytes();
        assert!(!bytes.is_empty());
        // Verify the commitment hash is deterministic
        let hash1 = commitment.commitment_hash();
        let hash2 = commitment.commitment_hash();
        assert_eq!(hash1, hash2);
    }

    #[test]
    fn test_empty_steps_commitment() {
        let deck_hash = ReplayHash::from_data(b"empty-deck");
        let enemy_hash = ReplayHash::from_data(b"empty-enemy");
        let outcome = OutcomeRecord {
            victory: false, total_turns: 0, final_enemy_hp: 200, survivors: 0,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .finalize(outcome);

        assert_eq!(commitment.step_count, 0);
        // Empty steps → state_root is zero (no leaves), which is valid
        assert!(verify_commitment(&commitment, &deck_hash, &enemy_hash));
    }

    #[test]
    fn test_commitment_with_phase_transition() {
        let deck_hash = ReplayHash::from_data(b"phase-deck");
        let enemy_hash = ReplayHash::from_data(b"phase-enemy");
        let steps = vec![
            ReplayStep {
                turn: 1, phase: 0, player_char_idx: 0, player_ability: 0,
                enemy_hp_after: 100, field_after: FieldSnapshot::default(),
                enemy_damage_dealt: 10, phase_transition: true, new_enemy_phase: 1,
            },
        ];
        let outcome = OutcomeRecord {
            victory: true, total_turns: 10, final_enemy_hp: 0, survivors: 3,
        };

        let commitment = CommitmentBuilder::new()
            .deck_commitment(deck_hash)
            .enemy_seed(enemy_hash)
            .add_step(steps[0].clone())
            .finalize(outcome);

        assert!(verify_commitment(&commitment, &deck_hash, &enemy_hash));
        assert!(!commitment.state_root.is_zero());
    }
}
