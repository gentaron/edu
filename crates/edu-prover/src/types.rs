//! Branded types for the prover domain.
//!
//! All IDs and hashes use nominal typing to prevent primitive obsession.
//! Raw `String` / `u8` usage for these concepts is forbidden by project convention.

use core::fmt;
use sha2::{Digest, Sha256};

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
        self.0.iter().map(|b| format!("{:02x}", b)).collect()
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
        self.0.iter().map(|b| format!("{:02x}", b)).collect()
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
        self.0.iter().map(|b| format!("{:02x}", b)).collect()
    }
}

impl fmt::Debug for WitnessDigest {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "WitnessDigest({})", self.to_hex())
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
}
