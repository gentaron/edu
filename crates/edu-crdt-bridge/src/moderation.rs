//! UGC moderation queue CRDT document types.
//!
//! Manages the user-generated content moderation pipeline through Automerge documents.
//!
//! ## Canon (Lore-Tech)
//! The **Moderation Queue** is the AURALIS collective's truth-filter — the process
//! by which the collective distinguishes resonant contributions from disruptive
//! noise. Every community submission passes through this filter, and the consensus
//! protocol ensures that moderation decisions are consistent and auditable.

#[cfg(feature = "alloc")]
use alloc::{string::String, vec::Vec};

#[cfg(all(feature = "alloc", test))]
use alloc::{string::ToString, vec};

use crate::DocumentId;

/// Branded document ID for a moderation queue CRDT document.
///
/// Canon: **Truth Filter Signature** — the unique identifier of the
/// collective's content vetting process.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ModerationQueue(pub DocumentId);

impl Default for ModerationQueue {
    fn default() -> Self {
        Self(DocumentId::new("moderation", b"global-queue"))
    }
}

impl ModerationQueue {
    /// Create a new moderation queue document ID.
    #[must_use]
    pub fn new() -> Self {
        Self::default()
    }

    /// Access the inner document ID.
    #[must_use]
    pub const fn id(&self) -> &DocumentId {
        &self.0
    }
}

/// Moderation status of a content item.
///
/// Canon: The **Verdict Seal** — marks the collective's judgment
/// on a piece of submitted content.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum ModerationStatus {
    /// Awaiting review.
    Pending,
    /// Currently being reviewed by a moderator.
    UnderReview,
    /// Content approved for the collective.
    Approved,
    /// Content rejected from the collective.
    Rejected,
}

/// A reviewer's action on a content item.
///
/// Canon: A **Judgment Echo** — a single moderator's assessment,
/// recorded immutably in the consensus stream.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ModerationAction {
    /// Reviewer's user ID.
    pub reviewer_id: String,
    /// The action taken.
    pub action: ModerationActionType,
    /// Reason for the action.
    pub reason: String,
    /// Timestamp of the action (epoch seconds).
    pub timestamp: u64,
}

/// Types of moderation actions.
///
/// Canon: Different **Judgment Resonances** — the collective recognizes
/// three fundamental moderation verdicts.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum ModerationActionType {
    /// Content is acceptable.
    Approve,
    /// Content is not acceptable.
    Reject,
    /// Content needs further attention (not outright rejection).
    Flag,
}

/// A single item in the moderation queue.
///
/// Canon: A **Submission Echo** — a piece of content awaiting
/// the collective's truth-filter judgment.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct ModerationItem {
    /// The card ID of the submitted content.
    pub card_id: String,
    /// User ID of the submitter.
    pub submitter_id: String,
    /// Timestamp of submission (epoch seconds).
    pub submitted_at: u64,
    /// Flags applied to this item (e.g., "copyright", "inappropriate").
    pub flags: Vec<String>,
    /// History of reviewer actions on this item.
    pub reviewer_actions: Vec<ModerationAction>,
    /// Current moderation status.
    pub status: ModerationStatus,
}

impl ModerationItem {
    /// Create a new moderation item.
    #[must_use]
    pub fn new(card_id: String, submitter_id: String, submitted_at: u64) -> Self {
        Self {
            card_id,
            submitter_id,
            submitted_at,
            flags: Vec::new(),
            reviewer_actions: Vec::new(),
            status: ModerationStatus::Pending,
        }
    }

    /// Add a flag to this item.
    pub fn add_flag(&mut self, flag: String) {
        if !self.flags.contains(&flag) {
            self.flags.push(flag);
        }
    }

    /// Check if this item has a specific flag.
    #[must_use]
    pub fn has_flag(&self, flag: &str) -> bool {
        self.flags.iter().any(|f| f == flag)
    }
}

/// Operations on the moderation queue CRDT document.
///
/// Canon: The **Truth Filter Operations** — the collective's
/// standardized procedures for content vetting.
pub struct ModerationOperations;

impl ModerationOperations {
    /// Submit a card for moderation review.
    pub fn submit_for_review(
        queue: &mut Vec<ModerationItem>,
        card_id: String,
        submitter_id: String,
        submitted_at: u64,
    ) -> bool {
        if queue.iter().any(|item| item.card_id == card_id && item.status == ModerationStatus::Pending) {
            return false;
        }
        queue.push(ModerationItem::new(card_id, submitter_id, submitted_at));
        true
    }

    /// Approve a pending item. Returns `false` if not in Pending/UnderReview status.
    pub fn approve(
        queue: &mut [ModerationItem],
        card_id: &str,
        reviewer_id: String,
        reason: String,
        timestamp: u64,
    ) -> bool {
        let item = match queue.iter_mut().find(|i| i.card_id == card_id) {
            Some(i) if i.status == ModerationStatus::Pending || i.status == ModerationStatus::UnderReview => i,
            _ => return false,
        };
        item.status = ModerationStatus::Approved;
        item.reviewer_actions.push(ModerationAction {
            reviewer_id,
            action: ModerationActionType::Approve,
            reason,
            timestamp,
        });
        true
    }

    /// Reject a pending item. Returns `false` if not in appropriate status.
    pub fn reject(
        queue: &mut [ModerationItem],
        card_id: &str,
        reviewer_id: String,
        reason: String,
        timestamp: u64,
    ) -> bool {
        let item = match queue.iter_mut().find(|i| i.card_id == card_id) {
            Some(i) if i.status == ModerationStatus::Pending || i.status == ModerationStatus::UnderReview => i,
            _ => return false,
        };
        item.status = ModerationStatus::Rejected;
        item.reviewer_actions.push(ModerationAction {
            reviewer_id,
            action: ModerationActionType::Reject,
            reason,
            timestamp,
        });
        true
    }

    /// Flag an item for further attention (does not change status).
    /// Returns `false` if item not found.
    pub fn flag(
        queue: &mut [ModerationItem],
        card_id: &str,
        reviewer_id: String,
        flag_reason: String,
        flag_label: String,
        timestamp: u64,
    ) -> bool {
        let item = match queue.iter_mut().find(|i| i.card_id == card_id) {
            Some(i) => i,
            None => return false,
        };
        item.add_flag(flag_label);
        item.reviewer_actions.push(ModerationAction {
            reviewer_id,
            action: ModerationActionType::Flag,
            reason: flag_reason,
            timestamp,
        });
        true
    }

    /// Get all items with Pending status.
    #[must_use]
    pub fn get_pending(queue: &[ModerationItem]) -> Vec<&ModerationItem> {
        queue.iter().filter(|i| i.status == ModerationStatus::Pending).collect()
    }

    /// Get all items with a specific status.
    #[must_use]
    pub fn get_by_status<'a>(queue: &'a [ModerationItem], status: &ModerationStatus) -> Vec<&'a ModerationItem> {
        queue.iter().filter(|i| i.status == *status).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_moderation_queue_id() {
        let a = ModerationQueue::new();
        let b = ModerationQueue::new();
        assert_eq!(a, b);
    }

    #[test]
    fn test_submit_for_review() {
        let mut queue = Vec::new();

        assert!(ModerationOperations::submit_for_review(
            &mut queue, "card-1".to_string(), "user-1".to_string(), 100,
        ));
        assert_eq!(queue.len(), 1);
        assert_eq!(queue[0].status, ModerationStatus::Pending);

        // Duplicate pending submission rejected
        assert!(!ModerationOperations::submit_for_review(
            &mut queue, "card-1".to_string(), "user-1".to_string(), 101,
        ));
    }

    #[test]
    fn test_approve_item() {
        let mut queue = Vec::new();
        ModerationOperations::submit_for_review(&mut queue, "card-1".to_string(), "user-1".to_string(), 100);

        let approved = ModerationOperations::approve(
            &mut queue, "card-1", "mod-1".to_string(), "Looks good".to_string(), 200,
        );
        assert!(approved);
        assert_eq!(queue[0].status, ModerationStatus::Approved);
        assert_eq!(queue[0].reviewer_actions.len(), 1);
        assert_eq!(queue[0].reviewer_actions[0].action, ModerationActionType::Approve);
    }

    #[test]
    fn test_reject_item() {
        let mut queue = Vec::new();
        ModerationOperations::submit_for_review(&mut queue, "card-1".to_string(), "user-1".to_string(), 100);

        let rejected = ModerationOperations::reject(
            &mut queue, "card-1", "mod-1".to_string(), "Inappropriate content".to_string(), 200,
        );
        assert!(rejected);
        assert_eq!(queue[0].status, ModerationStatus::Rejected);

        // Cannot act on already rejected item
        let second = ModerationOperations::approve(&mut queue, "card-1", "mod-2".to_string(), "no".to_string(), 300);
        assert!(!second);
    }

    #[test]
    fn test_flag_item() {
        let mut queue = Vec::new();
        ModerationOperations::submit_for_review(&mut queue, "card-1".to_string(), "user-1".to_string(), 100);

        let flagged = ModerationOperations::flag(
            &mut queue, "card-1", "mod-1".to_string(),
            "Possible copyright issue".to_string(), "copyright".to_string(), 150,
        );
        assert!(flagged);
        assert!(queue[0].has_flag("copyright"));
        assert_eq!(queue[0].status, ModerationStatus::Pending); // Status unchanged by flag
        // Duplicate flag not added
        assert_eq!(queue[0].flags.len(), 1);
    }

    #[test]
    fn test_get_pending() {
        let mut queue = Vec::new();
        ModerationOperations::submit_for_review(&mut queue, "card-1".to_string(), "u1".to_string(), 100);
        ModerationOperations::submit_for_review(&mut queue, "card-2".to_string(), "u2".to_string(), 101);
        ModerationOperations::submit_for_review(&mut queue, "card-3".to_string(), "u3".to_string(), 102);

        ModerationOperations::approve(&mut queue, "card-2", "mod-1".to_string(), "ok".to_string(), 200);

        let pending = ModerationOperations::get_pending(&queue);
        assert_eq!(pending.len(), 2);
    }

    #[test]
    fn test_get_by_status() {
        let mut queue = Vec::new();
        ModerationOperations::submit_for_review(&mut queue, "card-1".to_string(), "u1".to_string(), 100);
        ModerationOperations::submit_for_review(&mut queue, "card-2".to_string(), "u2".to_string(), 101);

        ModerationOperations::approve(&mut queue, "card-1", "mod-1".to_string(), "ok".to_string(), 200);
        ModerationOperations::reject(&mut queue, "card-2", "mod-1".to_string(), "no".to_string(), 201);

        assert_eq!(ModerationOperations::get_by_status(&queue, &ModerationStatus::Approved).len(), 1);
        assert_eq!(ModerationOperations::get_by_status(&queue, &ModerationStatus::Rejected).len(), 1);
        assert_eq!(ModerationOperations::get_by_status(&queue, &ModerationStatus::Pending).len(), 0);
    }

    #[test]
    fn test_flag_nonexistent() {
        let mut queue = Vec::new();
        let flagged = ModerationOperations::flag(
            &mut queue, "nonexistent", "mod-1".to_string(),
            "reason".to_string(), "label".to_string(), 100,
        );
        assert!(!flagged);
    }
}
