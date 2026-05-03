//! Replay annotation CRDT document types.
//!
//! Manages community annotations on battle replays through Automerge documents.
//!
//! ## Canon (Lore-Tech)
//! The **Annotation Layer** is the communal observation field — where multiple
//! observers of the same temporal event (replay) contribute their insights.
//! The AURALIS protocol merges these observations without conflict, preserving
//! each voice while maintaining structural coherence.

#[cfg(feature = "alloc")]
use alloc::{string::String, vec::Vec};

#[cfg(all(feature = "alloc", test))]
use alloc::{string::ToString, vec};

use crate::DocumentId;

/// Branded document ID for an annotation CRDT document.
///
/// Canon: **Observation Lens Identifier** — each replay can have multiple
/// observation lenses through which different collective members perceive
/// and annotate the temporal event.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct AnnotationDocument(pub DocumentId);

impl AnnotationDocument {
    /// Create a new annotation document ID for a specific replay.
    #[must_use]
    pub fn new(replay_id: &[u8]) -> Self {
        Self(DocumentId::new("annotation", replay_id))
    }

    /// Access the inner document ID.
    #[must_use]
    pub const fn id(&self) -> &DocumentId {
        &self.0
    }
}

/// A single annotation on a replay turn.
///
/// Canon: An **Observation Echo** — a single insight anchored to a specific
/// moment in the timeline, contributed by a member of the collective.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct AnnotationEntry {
    /// Unique annotation identifier.
    pub id: String,
    /// The replay this annotation belongs to.
    pub replay_id: String,
    /// The turn timestamp this annotation is anchored to.
    pub turn_timestamp: u64,
    /// Author's user ID.
    pub author_id: String,
    /// Annotation body text.
    pub body: String,
    /// Creation timestamp (epoch seconds).
    pub created_at: u64,
    /// Whether this annotation has been verified by the community.
    pub is_verified: bool,
}

impl AnnotationEntry {
    /// Create a new annotation entry.
    #[must_use]
    pub fn new(
        id: String,
        replay_id: String,
        turn_timestamp: u64,
        author_id: String,
        body: String,
    ) -> Self {
        Self {
            id,
            replay_id,
            turn_timestamp,
            author_id,
            body,
            created_at: 0,
            is_verified: false,
        }
    }
}

/// Operations on an annotation layer CRDT document.
///
/// Canon: The **Observation Layer Manager** — coordinates the merging
/// of multiple observation echoes across the temporal event, ensuring
/// no insight is lost in the collective consensus process.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct AnnotationLayer {
    /// Document ID for this annotation layer.
    pub document_id: DocumentId,
    /// All annotations in this layer.
    pub annotations: Vec<AnnotationEntry>,
}

impl AnnotationLayer {
    /// Create a new empty annotation layer.
    #[must_use]
    pub fn new(document_id: DocumentId) -> Self {
        Self {
            document_id,
            annotations: Vec::new(),
        }
    }

    /// Add an annotation. Returns `false` if an annotation with the same ID exists.
    pub fn add_annotation(&mut self, annotation: AnnotationEntry) -> bool {
        if self.annotations.iter().any(|a| a.id == annotation.id) {
            return false;
        }
        self.annotations.push(annotation);
        true
    }

    /// Remove an annotation by ID. Returns the removed annotation if found.
    pub fn remove_annotation(&mut self, annotation_id: &str) -> Option<AnnotationEntry> {
        let idx = self.annotations.iter().position(|a| a.id == annotation_id)?;
        Some(self.annotations.remove(idx))
    }

    /// Get all annotations for a specific replay.
    #[must_use]
    pub fn get_annotations_for_replay(&self, replay_id: &str) -> Vec<&AnnotationEntry> {
        self.annotations
            .iter()
            .filter(|a| a.replay_id == replay_id)
            .collect()
    }

    /// Get all annotations anchored to a specific turn timestamp.
    #[must_use]
    pub fn get_annotations_for_turn(&self, turn_timestamp: u64) -> Vec<&AnnotationEntry> {
        self.annotations
            .iter()
            .filter(|a| a.turn_timestamp == turn_timestamp)
            .collect()
    }

    /// Mark an annotation as verified.
    pub fn verify(&mut self, annotation_id: &str) -> bool {
        if let Some(annotation) = self.annotations.iter_mut().find(|a| a.id == annotation_id) {
            annotation.is_verified = true;
            true
        } else {
            false
        }
    }

    /// Total number of annotations.
    #[must_use]
    pub fn len(&self) -> usize {
        self.annotations.len()
    }

    /// Whether the layer is empty.
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.annotations.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_annotation_document_deterministic() {
        let a = AnnotationDocument::new(b"replay-abc");
        let b = AnnotationDocument::new(b"replay-abc");
        assert_eq!(a, b);
    }

    #[test]
    fn test_annotation_document_different_replays() {
        let a = AnnotationDocument::new(b"replay-abc");
        let b = AnnotationDocument::new(b"replay-xyz");
        assert_ne!(a, b);
    }

    #[test]
    fn test_add_and_remove_annotation() {
        let doc_id = DocumentId::new("test", b"ann-1");
        let mut layer = AnnotationLayer::new(doc_id);

        let entry = AnnotationEntry::new(
            "ann-1".to_string(),
            "replay-abc".to_string(),
            5,
            "user-1".to_string(),
            "Great dodge on turn 5!".to_string(),
        );

        assert!(layer.add_annotation(entry.clone()));
        assert_eq!(layer.len(), 1);

        // Prevent duplicate
        assert!(!layer.add_annotation(entry));

        // Remove
        let removed = layer.remove_annotation("ann-1");
        assert!(removed.is_some());
        assert!(layer.is_empty());
    }

    #[test]
    fn test_annotations_for_replay() {
        let doc_id = DocumentId::new("test", b"ann-2");
        let mut layer = AnnotationLayer::new(doc_id);

        layer.add_annotation(AnnotationEntry::new(
            "a1".to_string(), "replay-1".to_string(), 5,
            "u1".to_string(), "Good play".to_string(),
        ));
        layer.add_annotation(AnnotationEntry::new(
            "a2".to_string(), "replay-2".to_string(), 5,
            "u2".to_string(), "Nice move".to_string(),
        ));
        layer.add_annotation(AnnotationEntry::new(
            "a3".to_string(), "replay-1".to_string(), 10,
            "u3".to_string(), "Late game insight".to_string(),
        ));

        let for_replay1 = layer.get_annotations_for_replay("replay-1");
        assert_eq!(for_replay1.len(), 2);

        let for_replay2 = layer.get_annotations_for_replay("replay-2");
        assert_eq!(for_replay2.len(), 1);
    }

    #[test]
    fn test_annotations_for_turn() {
        let doc_id = DocumentId::new("test", b"ann-3");
        let mut layer = AnnotationLayer::new(doc_id);

        layer.add_annotation(AnnotationEntry::new(
            "a1".to_string(), "replay-1".to_string(), 5,
            "u1".to_string(), "Turn 5 note".to_string(),
        ));
        layer.add_annotation(AnnotationEntry::new(
            "a2".to_string(), "replay-1".to_string(), 10,
            "u2".to_string(), "Turn 10 note".to_string(),
        ));
        layer.add_annotation(AnnotationEntry::new(
            "a3".to_string(), "replay-1".to_string(), 5,
            "u3".to_string(), "Another turn 5 note".to_string(),
        ));

        let at_turn5 = layer.get_annotations_for_turn(5);
        assert_eq!(at_turn5.len(), 2);

        let at_turn10 = layer.get_annotations_for_turn(10);
        assert_eq!(at_turn10.len(), 1);

        let at_turn99 = layer.get_annotations_for_turn(99);
        assert!(at_turn99.is_empty());
    }

    #[test]
    fn test_verify_annotation() {
        let doc_id = DocumentId::new("test", b"ann-4");
        let mut layer = AnnotationLayer::new(doc_id);

        layer.add_annotation(AnnotationEntry::new(
            "a1".to_string(), "replay-1".to_string(), 5,
            "u1".to_string(), "Unverified note".to_string(),
        ));

        assert!(!layer.annotations[0].is_verified);
        assert!(layer.verify("a1"));
        assert!(layer.annotations[0].is_verified);

        // Verify non-existent
        assert!(!layer.verify("nonexistent"));
    }
}
