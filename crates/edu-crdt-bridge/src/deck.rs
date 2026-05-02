//! Deck collection CRDT document types.
//!
//! Manages cross-device deck synchronization through Automerge documents.
//!
//! ## Canon (Lore-Tech)
//! The **Deck Collection** is a player's tactical configuration — the specific
//! arrangement of resonant characters brought into the Thought Layer.
//! The AURALIS protocol ensures this configuration remains coherent
//! across all devices where a player interfaces with the collective.

#[cfg(feature = "alloc")]
use alloc::{string::String, vec::Vec};

use crate::DocumentId;

/// Branded document ID for a deck collection CRDT document.
///
/// Canon: **Tactical Configuration Signature** — uniquely identifies
/// a player's deck arrangement within the collective memory.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct DeckDocument(pub DocumentId);

impl DeckDocument {
    /// Create a new deck document ID from a user identifier.
    #[must_use]
    pub fn new(user_id: &[u8]) -> Self {
        Self(DocumentId::new("deck-collection", user_id))
    }

    /// Access the inner document ID.
    #[must_use]
    pub const fn id(&self) -> &DocumentId {
        &self.0
    }
}

/// A single deck entry in the collection.
///
/// Contains exactly 5 character IDs arranged for battle.
///
/// Canon: Each deck is a **Resonance Configuration** — five characters whose
/// combined thought-patterns create a unique tactical resonance field.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct DeckEntry {
    /// Unique deck identifier.
    pub id: String,
    /// Human-readable deck name.
    pub name: String,
    /// Exactly 5 character IDs for the field.
    pub character_ids: [u32; 5],
    /// Timestamp of deck creation (epoch seconds).
    pub created_at: u64,
    /// Timestamp of last modification (epoch seconds).
    pub updated_at: u64,
    /// Monotonically increasing version number.
    pub version: u64,
}

impl DeckEntry {
    /// Create a new deck entry.
    #[must_use]
    pub fn new(id: String, name: String, character_ids: [u32; 5]) -> Self {
        Self {
            id,
            name,
            character_ids,
            created_at: 0,
            updated_at: 0,
            version: 1,
        }
    }

    /// Bump the version and update the modification timestamp.
    pub fn touch(&mut self, now: u64) {
        self.version += 1;
        self.updated_at = now;
    }
}

/// Operations on a deck collection CRDT document.
///
/// Canon: The **Deck Collection Manager** — the collective process that
/// maintains coherence of tactical configurations across devices.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct DeckCollection {
    /// Document ID for this collection.
    pub document_id: DocumentId,
    /// All decks in the collection.
    pub decks: Vec<DeckEntry>,
}

impl DeckCollection {
    /// Create a new empty deck collection.
    #[must_use]
    pub fn new(document_id: DocumentId) -> Self {
        Self {
            document_id,
            decks: Vec::new(),
        }
    }

    /// Add a deck to the collection. Returns `false` if a deck with the same ID exists.
    pub fn add_deck(&mut self, deck: DeckEntry) -> bool {
        if self.decks.iter().any(|d| d.id == deck.id) {
            return false;
        }
        self.decks.push(deck);
        true
    }

    /// Remove a deck by ID. Returns the removed deck if found.
    pub fn remove_deck(&mut self, deck_id: &str) -> Option<DeckEntry> {
        let idx = self.decks.iter().position(|d| d.id == deck_id)?;
        Some(self.decks.remove(idx))
    }

    /// Update an existing deck by ID. Returns `false` if not found.
    pub fn update_deck<F>(&mut self, deck_id: &str, f: F) -> bool
    where
        F: FnOnce(&mut DeckEntry),
    {
        if let Some(deck) = self.decks.iter_mut().find(|d| d.id == deck_id) {
            f(deck);
            true
        } else {
            false
        }
    }

    /// List all deck IDs.
    #[must_use]
    pub fn list_decks(&self) -> Vec<&str> {
        self.decks.iter().map(|d| d.id.as_str()).collect()
    }

    /// Get a deck by ID.
    #[must_use]
    pub fn get_deck(&self, deck_id: &str) -> Option<&DeckEntry> {
        self.decks.iter().find(|d| d.id == deck_id)
    }

    /// Number of decks in the collection.
    #[must_use]
    pub fn len(&self) -> usize {
        self.decks.len()
    }

    /// Whether the collection is empty.
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.decks.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_deck_document_deterministic() {
        let a = DeckDocument::new(b"user-42");
        let b = DeckDocument::new(b"user-42");
        assert_eq!(a, b);
    }

    #[test]
    fn test_deck_document_different_users() {
        let a = DeckDocument::new(b"user-42");
        let b = DeckDocument::new(b"user-99");
        assert_ne!(a, b);
    }

    #[test]
    fn test_deck_entry_creation() {
        let entry = DeckEntry::new(
            "deck-1".to_string(),
            "Fire Team".to_string(),
            [1, 2, 3, 4, 5],
        );
        assert_eq!(entry.id, "deck-1");
        assert_eq!(entry.version, 1);
        assert_eq!(entry.character_ids, [1, 2, 3, 4, 5]);
    }

    #[test]
    fn test_deck_entry_touch() {
        let mut entry = DeckEntry::new(
            "deck-1".to_string(),
            "Fire Team".to_string(),
            [1, 2, 3, 4, 5],
        );
        entry.touch(1700000000);
        assert_eq!(entry.version, 2);
        assert_eq!(entry.updated_at, 1700000000);
    }

    #[test]
    fn test_deck_collection_add_and_list() {
        let doc_id = DocumentId::new("test", b"coll-1");
        let mut coll = DeckCollection::new(doc_id);
        assert!(coll.is_empty());

        coll.add_deck(DeckEntry::new("d1".to_string(), "Alpha".to_string(), [1, 2, 3, 4, 5]));
        coll.add_deck(DeckEntry::new("d2".to_string(), "Beta".to_string(), [6, 7, 8, 9, 10]));

        assert_eq!(coll.len(), 2);
        assert_eq!(coll.list_decks(), vec!["d1", "d2"]);
    }

    #[test]
    fn test_deck_collection_prevent_duplicate() {
        let doc_id = DocumentId::new("test", b"coll-2");
        let mut coll = DeckCollection::new(doc_id);

        assert!(coll.add_deck(DeckEntry::new("d1".to_string(), "Alpha".to_string(), [1, 2, 3, 4, 5])));
        assert!(!coll.add_deck(DeckEntry::new("d1".to_string(), "Alpha v2".to_string(), [6, 7, 8, 9, 10])));
        assert_eq!(coll.len(), 1);
    }

    #[test]
    fn test_deck_collection_remove() {
        let doc_id = DocumentId::new("test", b"coll-3");
        let mut coll = DeckCollection::new(doc_id);
        coll.add_deck(DeckEntry::new("d1".to_string(), "Alpha".to_string(), [1, 2, 3, 4, 5]));

        let removed = coll.remove_deck("d1");
        assert!(removed.is_some());
        assert_eq!(removed.unwrap().name, "Alpha");
        assert!(coll.is_empty());
    }

    #[test]
    fn test_deck_collection_update() {
        let doc_id = DocumentId::new("test", b"coll-4");
        let mut coll = DeckCollection::new(doc_id);
        coll.add_deck(DeckEntry::new("d1".to_string(), "Alpha".to_string(), [1, 2, 3, 4, 5]));

        let updated = coll.update_deck("d1", |deck| {
            deck.name = "Alpha v2".to_string();
            deck.touch(999);
        });
        assert!(updated);
        assert_eq!(coll.get_deck("d1").unwrap().name, "Alpha v2");
        assert_eq!(coll.get_deck("d1").unwrap().version, 2);
    }

    #[test]
    fn test_deck_collection_update_nonexistent() {
        let doc_id = DocumentId::new("test", b"coll-5");
        let mut coll = DeckCollection::new(doc_id);
        let updated = coll.update_deck("nonexistent", |_deck| {});
        assert!(!updated);
    }
}
