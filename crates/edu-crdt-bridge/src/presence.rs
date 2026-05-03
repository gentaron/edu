//! Presence tracking types for multi-user CRDT documents.
//!
//! Tracks which users/devices are currently active on which documents.
//!
//! ## Canon (Lore-Tech)
//! **Presence** in the AURALIS collective is the awareness of other observers —
//! the subtle resonance that flows between minds when they share a thought-stream.
//! The presence system lets each observer know who else is perceiving the same
//! reality, creating the foundation for true collaborative cognition.

#[cfg(feature = "alloc")]
use alloc::string::String;

#[cfg(all(feature = "alloc", test))]
use alloc::string::ToString;

/// Information about a user's presence session.
///
/// Canon: An **Observer Beacon** — the signal broadcast by each active
/// member of the collective, announcing their continued attention to
/// the shared thought-stream.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct PresenceInfo {
    /// User identifier.
    pub user_id: String,
    /// Device identifier for this session.
    pub device_id: String,
    /// Display name for UI presentation.
    pub display_name: String,
    /// When this presence session started (epoch seconds).
    pub connected_at: u64,
    /// Last activity timestamp (epoch seconds).
    pub last_active: u64,
}

impl PresenceInfo {
    /// Create a new presence info.
    #[must_use]
    pub fn new(user_id: String, device_id: String, display_name: String, connected_at: u64) -> Self {
        Self {
            user_id,
            device_id,
            display_name,
            connected_at,
            last_active: connected_at,
        }
    }

    /// Update the last activity timestamp.
    pub fn heartbeat(&mut self, now: u64) {
        self.last_active = now;
    }

    /// Check if this presence session is stale (inactive beyond threshold).
    #[must_use]
    pub fn is_stale(&self, now: u64, threshold_secs: u64) -> bool {
        now.saturating_sub(self.last_active) > threshold_secs
    }
}

/// Cursor position within a document.
///
/// Canon: A **Focal Point** — the specific location in the thought-stream
/// where an observer's attention is currently focused. Other observers
/// can see these focal points as soft glimmers in their shared perception.
#[derive(Clone, Debug, PartialEq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct PresenceCursor {
    /// Document this cursor is in.
    pub document_id: String,
    /// (line, column) or (x, y) position in the document.
    pub position: (f32, f32),
    /// Optional text selection range (start byte offset, end byte offset).
    pub selection: Option<(usize, usize)>,
}

impl PresenceCursor {
    /// Create a new cursor at a position.
    #[must_use]
    pub fn new(document_id: String, position: (f32, f32)) -> Self {
        Self {
            document_id,
            position,
            selection: None,
        }
    }

    /// Create a cursor with a selection range.
    #[must_use]
    pub fn with_selection(document_id: String, position: (f32, f32), selection: (usize, usize)) -> Self {
        Self {
            document_id,
            position,
            selection: Some(selection),
        }
    }
}

impl Eq for PresenceCursor {}

/// Device information for presence tracking.
///
/// Canon: An **Interface Lens** — describes the specific apparatus
/// through which an observer interfaces with the collective.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct DeviceInfo {
    /// Unique device identifier.
    pub device_id: String,
    /// Type of device.
    pub device_type: DeviceType,
    /// Application version string.
    pub app_version: String,
}

impl DeviceInfo {
    /// Create a new device info.
    #[must_use]
    pub fn new(device_id: String, device_type: DeviceType, app_version: String) -> Self {
        Self {
            device_id,
            device_type,
            app_version,
        }
    }
}

/// Device type classification.
///
/// Canon: Different **Interface Modalities** — the collective recognizes
/// three primary ways observers connect to the shared thought-stream.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum DeviceType {
    /// Desktop computer.
    Desktop,
    /// Mobile phone.
    Mobile,
    /// Tablet device.
    Tablet,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_presence_info_creation() {
        let info = PresenceInfo::new(
            "user-1".to_string(),
            "dev-1".to_string(),
            "Alice".to_string(),
            1000,
        );
        assert_eq!(info.user_id, "user-1");
        assert_eq!(info.last_active, 1000);
        assert_eq!(info.connected_at, 1000);
    }

    #[test]
    fn test_presence_heartbeat() {
        let mut info = PresenceInfo::new(
            "user-1".to_string(),
            "dev-1".to_string(),
            "Alice".to_string(),
            1000,
        );
        info.heartbeat(2000);
        assert_eq!(info.last_active, 2000);
        assert_eq!(info.connected_at, 1000); // unchanged
    }

    #[test]
    fn test_presence_stale_detection() {
        let info = PresenceInfo::new(
            "user-1".to_string(),
            "dev-1".to_string(),
            "Alice".to_string(),
            1000,
        );
        // Not stale at 1000
        assert!(!info.is_stale(1000, 300));
        // Not stale at 1299
        assert!(!info.is_stale(1299, 300));
        // Stale at 1300
        assert!(info.is_stale(1301, 300));
    }

    #[test]
    fn test_presence_cursor_basic() {
        let cursor = PresenceCursor::new("doc-1".to_string(), (10.5, 20.0));
        assert_eq!(cursor.position, (10.5, 20.0));
        assert!(cursor.selection.is_none());
    }

    #[test]
    fn test_presence_cursor_with_selection() {
        let cursor = PresenceCursor::with_selection(
            "doc-1".to_string(),
            (10.5, 20.0),
            (100, 150),
        );
        assert_eq!(cursor.selection, Some((100, 150)));
    }

    #[test]
    fn test_device_info_creation() {
        let info = DeviceInfo::new(
            "dev-1".to_string(),
            DeviceType::Desktop,
            "1.0.0".to_string(),
        );
        assert_eq!(info.device_type, DeviceType::Desktop);
    }

    #[test]
    fn test_device_type_equality() {
        assert_eq!(DeviceType::Desktop, DeviceType::Desktop);
        assert_eq!(DeviceType::Mobile, DeviceType::Mobile);
        assert_eq!(DeviceType::Tablet, DeviceType::Tablet);
        assert_ne!(DeviceType::Desktop, DeviceType::Mobile);
    }
}
