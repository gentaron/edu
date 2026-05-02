//! # edu-prover
//!
//! ZK-verifiable battle replay prover.
//!
//! Generates cryptographic commitments for battle replays using Merkle trees
//! and hash-based integrity proofs. Designed to be upgradeable to full ZK
//! (RISC Zero / Halo2) via the `ZkGuest` trait abstraction.
//!
//! ## Canon Mapping (Lore-Tech)
//! This crate is the **Dimensional Witness Forge** — it produces provable
//! causality attestations across the Dimension Horizon. Each commitment is
//! a frozen moment in the timeline that cannot be forged or reordered.

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(clippy::format_collect, clippy::needless_borrows_for_generic_args)]

#[cfg(feature = "alloc")]
extern crate alloc;

#[cfg(feature = "std")]
extern crate std;

pub mod commitment;
pub mod merkle;
pub mod replay;
pub mod types;

pub use commitment::{BattleCommitment, CommitmentBuilder};
pub use merkle::{MerkleTree, MerkleProof};
pub use replay::{ReplayTrace, ReplayStep};
pub use types::{BuildHash, ProofId, ProofVersion, ReplayHash, WitnessDigest};
