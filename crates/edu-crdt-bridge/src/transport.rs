//! Sync message format for CRDT document transport.
//!
//! Defines the wire format for exchanging Automerge changes between peers.
//!
//! ## Canon (Lore-Tech)
//! The **Sync Protocol** is the AURALIS collective's communication channel —
//! the standardized pattern by which observers exchange their perception
//! deltas, ensuring eventual convergence of all thought-streams.

#[cfg(feature = "alloc")]
use alloc::vec::Vec;

use crate::{DocumentId, presence::DeviceInfo};

/// Sync message types exchanged between peers.
///
/// Canon: Different **Resonance Transfer Patterns** — the collective
/// recognizes five fundamental sync message types.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum SyncMessageType {
    /// Request sync state from a peer.
    SyncRequest,
    /// Response to a sync request.
    SyncResponse,
    /// Broadcast a change to all peers.
    ChangeBroadcast,
    /// Presence heartbeat update.
    PresenceUpdate,
    /// Full document state transfer (for new peers).
    FullState,
}

/// A sync message exchanged between peers.
///
/// Canon: A **Resonance Packet** — the fundamental unit of inter-observer
/// communication in the AURALIS consensus protocol.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct SyncMessage {
    /// Type of sync message.
    pub msg_type: SyncMessageType,
    /// Document this message pertains to.
    pub document_id: DocumentId,
    /// Device that sent this message.
    pub sender_device: DeviceInfo,
    /// Binary payload.
    pub payload: Vec<u8>,
    /// Sequence number for ordering within a session.
    pub seq: u64,
}

impl SyncMessage {
    /// Create a new sync message.
    #[must_use]
    pub fn new(
        msg_type: SyncMessageType,
        document_id: DocumentId,
        sender_device: DeviceInfo,
        payload: Vec<u8>,
        seq: u64,
    ) -> Self {
        Self {
            msg_type,
            document_id,
            sender_device,
            payload,
            seq,
        }
    }

    /// Create a sync request message.
    #[must_use]
    pub fn sync_request(document_id: DocumentId, sender: DeviceInfo, seq: u64) -> Self {
        Self::new(SyncMessageType::SyncRequest, document_id, sender, Vec::new(), seq)
    }

    /// Create a change broadcast message.
    #[must_use]
    pub fn change_broadcast(document_id: DocumentId, sender: DeviceInfo, changes: Vec<u8>, seq: u64) -> Self {
        Self::new(SyncMessageType::ChangeBroadcast, document_id, sender, changes, seq)
    }
}

/// Wrapper for a set of binary changes.
///
/// Canon: A **Resonance Delta Bundle** — a compressed collection of
/// perception changes from a single observer.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ChangeSet {
    /// The individual binary changes.
    pub changes: Vec<Vec<u8>>,
}

impl ChangeSet {
    /// Create an empty change set.
    #[must_use]
    pub fn new() -> Self {
        Self {
            changes: Vec::new(),
        }
    }

    /// Add a change to the set.
    pub fn push(&mut self, change: Vec<u8>) {
        self.changes.push(change);
    }

    /// Total number of changes.
    #[must_use]
    pub fn len(&self) -> usize {
        self.changes.len()
    }

    /// Whether the change set is empty.
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.changes.is_empty()
    }

    /// Concatenate all changes into a single byte vector.
    #[must_use]
    pub fn concatenate(&self) -> Vec<u8> {
        let total: usize = self.changes.iter().map(|c| c.len()).sum();
        let mut out = Vec::with_capacity(total);
        for change in &self.changes {
            out.extend_from_slice(change);
        }
        out
    }
}

impl Default for ChangeSet {
    fn default() -> Self {
        Self::new()
    }
}

/// Encoded change binary for transport.
///
/// Canon: A **Sealed Resonance Packet** — binary change data encoded
/// for safe transmission across the collective's communication channels.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ChangeBinary {
    /// Raw binary change data.
    pub data: Vec<u8>,
}

impl ChangeBinary {
    /// Create from raw bytes.
    #[must_use]
    pub fn new(data: Vec<u8>) -> Self {
        Self { data }
    }

    /// Access the raw bytes.
    #[must_use]
    pub fn as_bytes(&self) -> &[u8] {
        &self.data
    }

    /// Size in bytes.
    #[must_use]
    pub fn len(&self) -> usize {
        self.data.len()
    }

    /// Whether empty.
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.data.is_empty()
    }
}

/// Encode a change set into a single binary blob.
///
/// Format: `[u32_le: num_changes][u32_le: len_1][bytes_1][u32_le: len_2][bytes_2]...`
///
/// Canon: **Resonance Encoding** — the standard compression format for
/// transmitting perception deltas across the collective.
#[must_use]
pub fn encode_changes(changes: &ChangeSet) -> Vec<u8> {
    let mut out = Vec::new();
    let count = changes.changes.len() as u32;
    out.extend_from_slice(&count.to_le_bytes());
    for change in &changes.changes {
        let len = change.len() as u32;
        out.extend_from_slice(&len.to_le_bytes());
        out.extend_from_slice(change);
    }
    out
}

/// Decode a binary blob back into a change set.
///
/// Canon: **Resonance Decoding** — the inverse of the encoding process,
/// recovering the perception deltas from the sealed packet.
#[must_use]
pub fn decode_changes(data: &[u8]) -> Option<ChangeSet> {
    if data.len() < 4 {
        return None;
    }
    let count = u32::from_le_bytes([data[0], data[1], data[2], data[3]]) as usize;
    let mut offset = 4usize;
    let mut changes = ChangeSet::new();

    for _ in 0..count {
        if offset + 4 > data.len() {
            return None;
        }
        let len = u32::from_le_bytes([data[offset], data[offset + 1], data[offset + 2], data[offset + 3]]) as usize;
        offset += 4;
        if offset + len > data.len() {
            return None;
        }
        changes.push(data[offset..offset + len].to_vec());
        offset += len;
    }

    Some(changes)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::presence::{DeviceInfo, DeviceType};

    fn test_device() -> DeviceInfo {
        DeviceInfo::new("dev-1".to_string(), DeviceType::Desktop, "1.0.0".to_string())
    }

    #[test]
    fn test_sync_message_creation() {
        let doc_id = DocumentId::new("test", b"doc-1");
        let msg = SyncMessage::sync_request(doc_id.clone(), test_device(), 1);
        assert_eq!(msg.msg_type, SyncMessageType::SyncRequest);
        assert_eq!(msg.seq, 1);
        assert!(msg.payload.is_empty());
    }

    #[test]
    fn test_change_broadcast() {
        let doc_id = DocumentId::new("test", b"doc-2");
        let changes = vec![1, 2, 3, 4, 5];
        let msg = SyncMessage::change_broadcast(doc_id, test_device(), changes.clone(), 2);
        assert_eq!(msg.msg_type, SyncMessageType::ChangeBroadcast);
        assert_eq!(msg.payload, changes);
        assert_eq!(msg.seq, 2);
    }

    #[test]
    fn test_change_set_operations() {
        let mut cs = ChangeSet::new();
        assert!(cs.is_empty());

        cs.push(vec![1, 2, 3]);
        cs.push(vec![4, 5]);
        assert_eq!(cs.len(), 2);

        let concatenated = cs.concatenate();
        assert_eq!(concatenated, vec![1, 2, 3, 4, 5]);
    }

    #[test]
    fn test_encode_decode_roundtrip() {
        let mut cs = ChangeSet::new();
        cs.push(vec![0xDE, 0xAD]);
        cs.push(vec![0xBE, 0xEF, 0xCA, 0xFE]);
        cs.push(Vec::new());

        let encoded = encode_changes(&cs);
        let decoded = decode_changes(&encoded).expect("valid encoding");

        assert_eq!(decoded.len(), 3);
        assert_eq!(decoded.changes[0], vec![0xDE, 0xAD]);
        assert_eq!(decoded.changes[1], vec![0xBE, 0xEF, 0xCA, 0xFE]);
        assert!(decoded.changes[2].is_empty());
    }

    #[test]
    fn test_decode_empty_input() {
        assert!(decode_changes(&[]).is_none());
        assert!(decode_changes(&[0, 0]).is_none());
    }

    #[test]
    fn test_decode_truncated() {
        let mut cs = ChangeSet::new();
        cs.push(vec![1, 2, 3]);
        let encoded = encode_changes(&cs);

        // Truncate the last byte
        let truncated = &encoded[..encoded.len() - 1];
        assert!(decode_changes(truncated).is_none());
    }

    #[test]
    fn test_change_binary() {
        let cb = ChangeBinary::new(vec![1, 2, 3, 4]);
        assert_eq!(cb.len(), 4);
        assert_eq!(cb.as_bytes(), &[1, 2, 3, 4]);
        assert!(!cb.is_empty());

        let empty = ChangeBinary::new(Vec::new());
        assert!(empty.is_empty());
    }

    #[test]
    fn test_encode_empty_changeset() {
        let cs = ChangeSet::new();
        let encoded = encode_changes(&cs);
        // 4 bytes for count (0)
        assert_eq!(encoded.len(), 4);

        let decoded = decode_changes(&encoded).expect("valid");
        assert!(decoded.is_empty());
    }

    #[test]
    fn test_sync_message_type_variants() {
        let types = [
            SyncMessageType::SyncRequest,
            SyncMessageType::SyncResponse,
            SyncMessageType::ChangeBroadcast,
            SyncMessageType::PresenceUpdate,
            SyncMessageType::FullState,
        ];
        // All variants are distinct
        for i in 0..types.len() {
            for j in (i + 1)..types.len() {
                assert_ne!(types[i], types[j]);
            }
        }
    }
}
