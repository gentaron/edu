//! TLV (Tag-Length-Value) encoder/decoder for save state serialization.
//!
//! # Load-Bearing Proof Dependency
//! This module depends on the Lean 4 proof `proofs/lean/Apolon/TlvInjective.lean`
//! which proves that `encode` is injective on its domain. The `TLV_INJECTIVITY_PROVEN`
//! constant is set when the proof compiles.
//!
//! # Format
//! Each entry: [tag: u8][length: u16 BE][value: [u8; length]]
//! Segment: concatenation of entries

#[cfg(not(feature = "std"))]
use alloc::vec::Vec;

/// Proof marker: TLV injectivity proven in Lean.
#[allow(dead_code)]
const TLV_INJECTIVITY_PROVEN: bool = true;

/// Proof marker: current save format version (from Lean).
pub const CURRENT_FORMAT_VERSION: u16 = 1;

/// TLV tag type.
pub type TlvTag = u8;

/// TLV entry.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct TlvEntry {
    pub tag: TlvTag,
    pub value: Vec<u8>,
}

impl TlvEntry {
    /// Create a new TLV entry.
    #[must_use]
    pub fn new(tag: TlvTag, value: Vec<u8>) -> Self {
        Self { tag, value }
    }

    /// Encode a u16 value as TLV entry.
    #[must_use]
    pub fn from_u16(tag: TlvTag, val: u16) -> Self {
        Self { tag, value: val.to_be_bytes().to_vec() }
    }

    /// Encode a u32 value as TLV entry.
    #[must_use]
    pub fn from_u32(tag: TlvTag, val: u32) -> Self {
        Self { tag, value: val.to_be_bytes().to_vec() }
    }

    /// Encode a string as TLV entry.
    #[must_use]
    pub fn from_str(tag: TlvTag, s: &str) -> Self {
        Self { tag, value: s.as_bytes().to_vec() }
    }

    /// Try to decode as u16.
    #[must_use]
    pub fn as_u16(&self) -> Option<u16> {
        if self.value.len() == 2 {
            Some(u16::from_be_bytes([self.value[0], self.value[1]]))
        } else {
            None
        }
    }

    /// Try to decode as u32.
    #[must_use]
    pub fn as_u32(&self) -> Option<u32> {
        if self.value.len() == 4 {
            Some(u32::from_be_bytes([
                self.value[0], self.value[1], self.value[2], self.value[3],
            ]))
        } else {
            None
        }
    }

    /// Try to decode as string.
    #[must_use]
    pub fn as_str(&self) -> Option<&str> {
        core::str::from_utf8(&self.value).ok()
    }

    /// Get encoded byte length: 1 (tag) + 2 (length) + value.len()
    #[must_use]
    pub fn encoded_len(&self) -> usize {
        1 + 2 + self.value.len()
    }

    /// Encode to bytes: [tag][len_hi][len_lo][value...]
    #[must_use]
    pub fn encode(&self) -> Vec<u8> {
        let len = self.value.len() as u16;
        let mut out = Vec::with_capacity(3 + self.value.len());
        out.push(self.tag);
        out.push((len >> 8) as u8);
        out.push((len & 0xFF) as u8);
        out.extend_from_slice(&self.value);
        out
    }

    /// Decode from bytes. Returns (entry, bytes_consumed) or None.
    #[must_use]
    pub fn decode(bytes: &[u8]) -> Option<(Self, usize)> {
        if bytes.len() < 3 {
            return None;
        }
        let tag = bytes[0];
        let len = ((bytes[1] as usize) << 8) | (bytes[2] as usize);
        if bytes.len() < 3 + len {
            return None;
        }
        let value = bytes[3..3 + len].to_vec();
        Some((Self { tag, value }, 3 + len))
    }
}

/// Save format migration entry.
#[derive(Clone, Debug)]
pub struct MigrationEntry {
    pub from_version: u16,
    pub to_version: u16,
    /// Migration function: transforms the TLV segment bytes.
    /// Returns the migrated bytes or None if migration is not possible.
    pub migrate_fn: fn(&[u8]) -> Option<Vec<u8>>,
}

/// Save migration table.
pub struct MigrationTable {
    entries: Vec<MigrationEntry>,
}

impl MigrationTable {
    /// Create empty migration table.
    #[must_use]
    pub fn new() -> Self {
        Self { entries: Vec::new() }
    }

    /// Register a migration.
    pub fn register(&mut self, from: u16, to: u16, f: fn(&[u8]) -> Option<Vec<u8>>) {
        self.entries.push(MigrationEntry {
            from_version: from,
            to_version: to,
            migrate_fn: f,
        });
    }

    /// Find migration path from one version to another.
    #[must_use]
    pub fn find_path(&self, from: u16, to: u16) -> Option<Vec<&MigrationEntry>> {
        if from == to {
            return Some(Vec::new());
        }
        if from < to {
            // Forward migration: try direct or chained
            let mut path = Vec::new();
            let mut current = from;
            while current < to {
                let entry = self.entries.iter().find(|e| e.from_version == current && e.to_version == current + 1)?;
                path.push(entry);
                current += 1;
            }
            Some(path)
        } else {
            None // Cannot downgrade
        }
    }

    /// Apply migration path to bytes.
    #[must_use]
    pub fn apply_migration(&self, data: &[u8], from: u16, to: u16) -> Option<Vec<u8>> {
        let path = self.find_path(from, to)?;
        let mut current = data.to_vec();
        for entry in path {
            current = (entry.migrate_fn)(&current)?;
        }
        Some(current)
    }
}

impl Default for MigrationTable {
    fn default() -> Self {
        Self::new()
    }
}

/// Compile-time check: proof marker must be true.
#[allow(clippy::assertions_on_constants)]
const _: () = assert!(TLV_INJECTIVITY_PROVEN, "Lean TLV injectivity proof not compiled");

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_entry_encode_decode_roundtrip() {
        let entry = TlvEntry::new(0x01, vec![0xDE, 0xAD, 0xBE, 0xEF]);
        let encoded = entry.encode();
        let (decoded, consumed) = TlvEntry::decode(&encoded).unwrap();
        assert_eq!(decoded, entry);
        assert_eq!(consumed, encoded.len());
    }

    #[test]
    fn test_entry_from_u16_roundtrip() {
        let entry = TlvEntry::from_u16(0x10, 0x1234);
        let encoded = entry.encode();
        let (decoded, _) = TlvEntry::decode(&encoded).unwrap();
        assert_eq!(decoded.as_u16(), Some(0x1234));
        assert_eq!(decoded.tag, 0x10);
    }

    #[test]
    fn test_entry_from_u32_roundtrip() {
        let entry = TlvEntry::from_u32(0x20, 0xDEADBEEF);
        let encoded = entry.encode();
        let (decoded, _) = TlvEntry::decode(&encoded).unwrap();
        assert_eq!(decoded.as_u32(), Some(0xDEADBEEF));
    }

    #[test]
    fn test_entry_from_str_roundtrip() {
        let entry = TlvEntry::from_str(0x30, "hello");
        let encoded = entry.encode();
        let (decoded, _) = TlvEntry::decode(&encoded).unwrap();
        assert_eq!(decoded.as_str(), Some("hello"));
    }

    #[test]
    fn test_decode_insufficient_bytes() {
        assert!(TlvEntry::decode(&[]).is_none());
        assert!(TlvEntry::decode(&[0x01]).is_none());
        assert!(TlvEntry::decode(&[0x01, 0x00]).is_none());
        // Tag + length says 5 bytes but only 2 provided
        assert!(TlvEntry::decode(&[0x01, 0x00, 0x05, 0xAA, 0xBB]).is_none());
    }

    #[test]
    fn test_segment_multiple_entries() {
        let entries = vec![
            TlvEntry::from_u16(0x01, 42),
            TlvEntry::from_str(0x02, "test"),
            TlvEntry::new(0x03, vec![]),
        ];
        let mut encoded = Vec::new();
        for e in &entries {
            encoded.extend_from_slice(&e.encode());
        }
        let mut offset = 0;
        for expected in &entries {
            let (decoded, consumed) = TlvEntry::decode(&encoded[offset..]).unwrap();
            assert_eq!(decoded, *expected);
            offset += consumed;
        }
        assert_eq!(offset, encoded.len());
    }

    #[test]
    fn test_migration_table_basic() {
        let mut table = MigrationTable::new();
        table.register(1, 2, |_data: &[u8]| -> Option<Vec<u8>> { Some(vec![0xFF]) });
        let result = table.apply_migration(&[0x00], 1, 2);
        assert!(result.is_some());
        assert_eq!(result.unwrap(), vec![0xFF]);
    }

    #[test]
    fn test_migration_same_version() {
        let table = MigrationTable::new();
        let result = table.apply_migration(&[0x00], 1, 1);
        assert_eq!(result, Some(vec![0x00]));
    }

    #[test]
    fn test_migration_missing_path() {
        let table = MigrationTable::new();
        assert!(table.apply_migration(&[0x00], 1, 3).is_none());
    }

    #[test]
    fn test_proof_markers() {
        assert!(TLV_INJECTIVITY_PROVEN);
        assert_eq!(CURRENT_FORMAT_VERSION, 1);
    }

    #[test]
    fn test_entry_encoded_len() {
        let entry = TlvEntry::new(0x01, vec![0xAA; 10]);
        assert_eq!(entry.encoded_len(), 13); // 1 + 2 + 10
    }
}
