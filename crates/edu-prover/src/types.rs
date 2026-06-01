//! Branded types for the prover domain.
//!
//! All IDs and hashes use nominal typing to prevent primitive obsession.
//! Raw `String` / `u8` usage for these concepts is forbidden by project convention.
//!
//! ## Build Hash Integration (Phase η)
//!
//! `BuildHash` threads through every proof commitment as a public input. When hermeticity
//! is lost (non-reproducible build), the build hash changes and ε's ZK proofs become
//! unverifiable — making hermeticity a **load-bearing prerequisite** for the competitive
//! integrity layer.

use core::fmt;
use sha2::{Digest, Sha256};

#[cfg(not(feature = "std"))]
use alloc::string::String;

#[cfg(not(feature = "std"))]
use alloc::vec::Vec;

/// Convert a byte to a 2-char lowercase hex string. Works in no_std.
#[inline]
pub(crate) fn byte_to_hex(b: u8) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let mut s = String::with_capacity(2);
    s.push(HEX[(b >> 4) as usize] as char);
    s.push(HEX[(b & 0x0f) as usize] as char);
    s
}

/// Encode a byte slice as lowercase hex. Works in no_std.
pub(crate) fn hex_encode(bytes: &[u8]) -> String {
    let mut s = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        s.push_str(&byte_to_hex(*b));
    }
    s
}

/// A proof identifier — opaque, globally unique.
///
/// Canon: **True Name of the Witness** — unforgeable identity assigned
/// to every dimensional attestation at the moment of its creation.
#[derive(Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ProofId(pub(crate) [u8; 32]);

impl ProofId {
    /// Generate a new random-looking ProofId from seed data.
    #[must_use]
    pub fn from_seed(data: &[u8]) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(b"proof-id:");
        hasher.update(data);
        let hash = hasher.finalize();
        Self(hash.into())
    }

    /// Create from raw 32-byte array.
    #[must_use]
    pub const fn from_bytes(bytes: [u8; 32]) -> Self {
        Self(bytes)
    }

    /// Access the raw bytes.
    #[must_use]
    pub const fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Hex-encoded representation for display.
    #[must_use]
    pub fn to_hex(&self) -> String {
        hex_encode(&self.0)
    }
}

impl fmt::Debug for ProofId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ProofId({})", self.to_hex())
    }
}

impl fmt::Display for ProofId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_hex())
    }
}

/// A replay hash — SHA-256 digest of the full action sequence.
///
/// Canon: **Timeline Fingerprint** — a compressed representation of an
/// entire temporal sequence that serves as its unique identifier.
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ReplayHash(pub [u8; 32]);

impl ReplayHash {
    /// Compute hash of arbitrary data.
    #[must_use]
    pub fn from_data(data: &[u8]) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(data);
        let hash = hasher.finalize();
        Self(hash.into())
    }

    /// Create from raw bytes.
    #[must_use]
    pub const fn from_bytes(bytes: [u8; 32]) -> Self {
        Self(bytes)
    }

    /// Access raw bytes.
    #[must_use]
    pub const fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Hex representation.
    #[must_use]
    pub fn to_hex(&self) -> String {
        hex_encode(&self.0)
    }

    /// The zero hash (all zeros) — used as a sentinel.
    #[must_use]
    pub const fn zero() -> Self {
        Self([0u8; 32])
    }

    /// Check if this is the zero hash.
    #[must_use]
    pub fn is_zero(&self) -> bool {
        self.0.iter().all(|&b| b == 0)
    }
}

impl fmt::Debug for ReplayHash {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "ReplayHash({})", self.to_hex())
    }
}

impl fmt::Display for ReplayHash {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_hex())
    }
}

impl Default for ReplayHash {
    fn default() -> Self {
        Self::zero()
    }
}

/// A witness digest — hash of all private inputs (action sequence).
///
/// Canon: **Adversarial Seal** — the cryptographic seal placed on the
/// hidden layer of battle actions, ensuring they cannot be tampered with
/// after the fact.
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct WitnessDigest(pub [u8; 32]);

impl WitnessDigest {
    /// Compute digest from action sequence bytes.
    #[must_use]
    pub fn from_actions(data: &[u8]) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(b"witness:");
        hasher.update(data);
        let hash = hasher.finalize();
        Self(hash.into())
    }

    /// Create from raw bytes.
    #[must_use]
    pub const fn from_bytes(bytes: [u8; 32]) -> Self {
        Self(bytes)
    }

    /// Access raw bytes.
    #[must_use]
    pub const fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Hex representation.
    #[must_use]
    pub fn to_hex(&self) -> String {
        hex_encode(&self.0)
    }
}

impl fmt::Debug for WitnessDigest {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "WitnessDigest({})", self.to_hex())
    }
}

/// A build hash — Nix-derived SHA-256 digest of the hermetic build artifacts.
///
/// Canon: **Temporal Anchor** — the hash that pins every proof to a specific
/// universe-state of the engine binary. If the anchor drifts (non-reproducible
/// build), all proofs generated under the old anchor become unverifiable.
///
/// ## Thread-Through Points (Phase η)
/// - ε prover: public input to ZK proof
/// - Save envelope (β PQC): triggers ζ migration on mismatch
/// - NFT metadata: `provenance` field links to SLSA attestation
/// - Replay viewer: UI warning on mismatch
/// - Leaderboard: season partition by build hash
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct BuildHash(pub [u8; 32]);

impl BuildHash {
    /// Compute build hash from artifact content (e.g., `nix-hash ./dist`).
    #[must_use]
    pub fn from_artifacts(data: &[u8]) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(b"build:");
        hasher.update(data);
        let hash = hasher.finalize();
        Self(hash.into())
    }

    /// Compute build hash from a pre-existing hex string (64 chars).
    ///
    /// Returns `None` if the hex is malformed.
    #[must_use]
    pub fn from_hex(hex: &str) -> Option<Self> {
        if hex.len() != 64 {
            return None;
        }
        let mut bytes = [0u8; 32];
        for i in 0..32 {
            bytes[i] = u8::from_str_radix(&hex[i * 2..i * 2 + 2], 16).ok()?;
        }
        Some(Self(bytes))
    }

    /// Create from raw bytes.
    #[must_use]
    pub const fn from_bytes(bytes: [u8; 32]) -> Self {
        Self(bytes)
    }

    /// Access raw bytes.
    #[must_use]
    pub const fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Hex representation.
    #[must_use]
    pub fn to_hex(&self) -> String {
        hex_encode(&self.0)
    }

    /// The zero hash — used as sentinel for "no build hash" (v1 compatibility).
    #[must_use]
    pub const fn zero() -> Self {
        Self([0u8; 32])
    }

    /// Check if this is the zero hash.
    #[must_use]
    pub fn is_zero(&self) -> bool {
        self.0.iter().all(|&b| b == 0)
    }
}

impl fmt::Debug for BuildHash {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "BuildHash({})", self.to_hex())
    }
}

impl fmt::Display for BuildHash {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_hex())
    }
}

impl Default for BuildHash {
    fn default() -> Self {
        Self::zero()
    }
}

/// Proof version tag — distinguishes pre-η (v1) from post-η (v2) proofs.
///
/// v1 proofs lack `build_hash`; v2 proofs embed it as a public input.
/// The verifier accepts both for backward compatibility but rejects v2
/// proofs with mismatched build_hash.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum ProofVersion {
    /// Pre-η proof — no build hash field.
    V1,
    /// Post-η proof — build hash is a public input.
    V2,
}

impl Default for ProofVersion {
    fn default() -> Self {
        Self::V2
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_proof_id_deterministic() {
        let a = ProofId::from_seed(b"hello");
        let b = ProofId::from_seed(b"hello");
        assert_eq!(a, b);
    }

    #[test]
    fn test_proof_id_different_seeds() {
        let a = ProofId::from_seed(b"hello");
        let b = ProofId::from_seed(b"world");
        assert_ne!(a, b);
    }

    #[test]
    fn test_proof_id_roundtrip_bytes() {
        let original = ProofId::from_seed(b"test-data");
        let bytes = *original.as_bytes();
        let restored = ProofId::from_bytes(bytes);
        assert_eq!(original, restored);
    }

    #[test]
    fn test_replay_hash_deterministic() {
        let a = ReplayHash::from_data(b"action-sequence");
        let b = ReplayHash::from_data(b"action-sequence");
        assert_eq!(a, b);
    }

    #[test]
    fn test_replay_hash_different_data() {
        let a = ReplayHash::from_data(b"seq-a");
        let b = ReplayHash::from_data(b"seq-b");
        assert_ne!(a, b);
    }

    #[test]
    fn test_replay_hash_zero() {
        let zero = ReplayHash::zero();
        assert!(zero.is_zero());
        let non_zero = ReplayHash::from_data(b"x");
        assert!(!non_zero.is_zero());
    }

    #[test]
    fn test_witness_digest_deterministic() {
        let a = WitnessDigest::from_actions(b"turn1,turn2,turn3");
        let b = WitnessDigest::from_actions(b"turn1,turn2,turn3");
        assert_eq!(a, b);
    }

    #[test]
    fn test_witness_digest_prefix_isolation() {
        // Same data with different domain separators
        let witness = WitnessDigest::from_actions(b"same-data");
        let replay = ReplayHash::from_data(b"same-data");
        assert_ne!(witness.0, replay.0);
    }

    #[test]
    fn test_display_format_hex() {
        let id = ProofId::from_seed(b"display-test");
        let hex = id.to_hex();
        assert_eq!(hex.len(), 64); // 32 bytes * 2 hex chars
        assert!(hex.chars().all(|c| c.is_ascii_hexdigit()));
    }

    #[test]
    fn test_build_hash_from_artifacts_deterministic() {
        let a = BuildHash::from_artifacts(b"nix-build-output");
        let b = BuildHash::from_artifacts(b"nix-build-output");
        assert_eq!(a, b);
    }

    #[test]
    fn test_build_hash_different_artifacts() {
        let a = BuildHash::from_artifacts(b"artifact-set-a");
        let b = BuildHash::from_artifacts(b"artifact-set-b");
        assert_ne!(a, b);
    }

    #[test]
    fn test_build_hash_zero() {
        let zero = BuildHash::zero();
        assert!(zero.is_zero());
        assert_eq!(zero.to_hex(), "0".repeat(64));
    }

    #[test]
    fn test_build_hash_from_hex_roundtrip() {
        let original = BuildHash::from_artifacts(b"test-artifacts");
        let hex = original.to_hex();
        let restored = BuildHash::from_hex(&hex).expect("valid hex");
        assert_eq!(original, restored);
    }

    #[test]
    fn test_build_hash_from_hex_invalid_length() {
        assert!(BuildHash::from_hex("abc").is_none());
        assert!(BuildHash::from_hex(&"ab".repeat(33)).is_none());
    }

    #[test]
    fn test_build_hash_from_hex_invalid_chars() {
        assert!(BuildHash::from_hex(&"gg".repeat(32)).is_none());
    }

    #[test]
    fn test_build_hash_roundtrip_bytes() {
        let original = BuildHash::from_artifacts(b"roundtrip-test");
        let bytes = *original.as_bytes();
        let restored = BuildHash::from_bytes(bytes);
        assert_eq!(original, restored);
    }

    #[test]
    fn test_build_hash_domain_isolation() {
        // Build hash domain must not collide with other hash types
        let build = BuildHash::from_artifacts(b"same-data");
        let replay = ReplayHash::from_data(b"same-data");
        let witness = WitnessDigest::from_actions(b"same-data");
        assert_ne!(build.0, replay.0);
        assert_ne!(build.0, witness.0);
    }

    #[test]
    fn test_proof_version_default_is_v2() {
        assert_eq!(ProofVersion::default(), ProofVersion::V2);
    }

    #[test]
    fn test_proof_version_equality() {
        assert_eq!(ProofVersion::V1, ProofVersion::V1);
        assert_eq!(ProofVersion::V2, ProofVersion::V2);
        assert_ne!(ProofVersion::V1, ProofVersion::V2);
    }
}
