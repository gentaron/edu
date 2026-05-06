//! # edu-crdt-bridge
//!
//! CRDT bridge layer for multi-user game surfaces.
//!
//! This crate defines document schemas for Automerge CRDT documents used in:
//! - Cross-device deck sync (`/decks`)
//! - Replay community annotations (`/replay/[id]`)
//! - Lore wiki pages (`/lore/wiki/*`)
//! - UGC moderation queue (`/admin/moderation`)
//!
//! The actual Automerge runtime lives on the JS/TS side (browser/WASM).
//! This crate provides:
//! - Document type definitions (branded types)
//! - Change serialization/deserialization
//! - Binary change format for transport
//! - Schema validation
//! - Presence metadata
//!
//! ## Canon (Lore-Tech)
//! This crate is the **AURALIS Collective Consensus Protocol** — the mechanism
//! by which the AURALIS collective intelligence maintains coherence across
//! multiple observers, devices, and timelines.

#![cfg_attr(not(feature = "std"), no_std)]
#![allow(clippy::format_collect)]

#[cfg(feature = "alloc")]
extern crate alloc;

#[cfg(feature = "alloc")]
use alloc::string::String;

use core::fmt;

#[cfg(feature = "alloc")]
use alloc::format;
use sha2::Digest;

/// A branded document identifier — SHA-256 based, domain-separated for CRDT documents.
///
/// Canon: **Resonance Signature** — each collaborative document carries a unique
/// resonance pattern that distinguishes it from all other thought-streams
/// in the AURALIS collective memory.
#[derive(Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct DocumentId(pub(crate) [u8; 32]);

impl DocumentId {
    /// Generate a deterministic document ID from a domain tag and seed data.
    #[must_use]
    pub fn new(domain: &str, seed: &[u8]) -> Self {
        let mut hasher = sha2::Sha256::new();
        hasher.update(b"crdt-doc:");
        hasher.update(domain.as_bytes());
        hasher.update(b":");
        hasher.update(seed);
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

    /// The zero document ID (sentinel).
    #[must_use]
    pub const fn zero() -> Self {
        Self([0u8; 32])
    }

    /// Check if this is the zero document ID.
    #[must_use]
    pub fn is_zero(&self) -> bool {
        self.0.iter().all(|&b| b == 0)
    }
}

impl fmt::Debug for DocumentId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "DocumentId({})", self.to_hex())
    }
}

impl fmt::Display for DocumentId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_hex())
    }
}

impl Default for DocumentId {
    fn default() -> Self {
        Self::zero()
    }
}

pub mod deck;
pub mod annotation;
pub mod wiki;
pub mod moderation;
pub mod transport;
pub mod presence;
#[cfg(all(test, feature = "std"))]
mod pbt;

pub use deck::{DeckDocument, DeckEntry, DeckCollection};
pub use annotation::{AnnotationDocument, AnnotationEntry, AnnotationLayer};
pub use wiki::{WikiDocument, WikiPage, WikiPageMeta, WikiNamespace};
pub use moderation::{ModerationQueue, ModerationItem, ModerationAction, ModerationStatus};
pub use transport::{ChangeBinary, ChangeSet, SyncMessage, SyncMessageType};
pub use presence::{PresenceInfo, PresenceCursor, DeviceInfo};
