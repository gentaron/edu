//! Lore wiki CRDT document types.
//!
//! Manages collaborative lore wiki pages through Automerge documents.
//!
//! ## Canon (Lore-Tech)
//! The **Lore Codex** is the AURALIS collective's shared knowledge repository —
//! a living document that evolves as the collective discovers new truths about
//! the EDU universe. Each page carries its own resonance signature, and
//! the consensus protocol ensures that competing edits converge to a single
//! coherent truth without silencing any contributor.

#[cfg(feature = "alloc")]
use alloc::{collections::BTreeMap, string::String, vec::Vec};

use crate::DocumentId;

/// Branded document ID for a wiki CRDT document.
///
/// Canon: **Codex Volume Identifier** — each namespace of the lore codex
/// has its own volume, and each volume maintains its own consensus stream.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct WikiDocument(pub DocumentId);

impl WikiDocument {
    /// Create a new wiki document ID for a namespace.
    #[must_use]
    pub fn new(namespace: &WikiNamespace) -> Self {
        Self(DocumentId::new(
            "wiki",
            namespace.as_str().as_bytes(),
        ))
    }

    /// Access the inner document ID.
    #[must_use]
    pub const fn id(&self) -> &DocumentId {
        &self.0
    }
}

/// Wiki namespace classification.
///
/// Canon: Different chambers of the **Lore Codex** — Canon entries are
/// verified truths, Community entries are collective observations,
/// and Draft entries are still forming in the thought-stream.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum WikiNamespace {
    /// Official, verified lore.
    Canon,
    /// Community-contributed observations.
    Community,
    /// Unpublished draft pages.
    Draft,
}

impl WikiNamespace {
    /// Get the string representation used for hashing.
    #[must_use]
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Canon => "canon",
            Self::Community => "community",
            Self::Draft => "draft",
        }
    }
}

/// Publication status of a wiki page.
///
/// Canon: The **Codex Seal** — marks whether a page's truth-value
/// has been stabilized in the collective memory.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub enum WikiPageStatus {
    /// Work in progress, not yet visible.
    Draft,
    /// Published and visible to the collective.
    Published,
    /// Historical record, superseded.
    Archived,
}

/// Metadata for a wiki page.
///
/// Canon: The **Page Signature** — identity and provenance information
/// for a single codex entry.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct WikiPageMeta {
    /// Page namespace.
    pub namespace: WikiNamespace,
    /// URL-safe slug (unique within namespace).
    pub slug: String,
    /// Display title.
    pub title: String,
    /// User ID of the last editor.
    pub last_editor: String,
    /// Timestamp of last edit (epoch seconds).
    pub edited_at: u64,
    /// Monotonically increasing page version.
    pub version: u64,
    /// Publication status.
    pub status: WikiPageStatus,
}

impl WikiPageMeta {
    /// Create new metadata for a wiki page.
    #[must_use]
    pub fn new(namespace: WikiNamespace, slug: String, title: String, editor: String) -> Self {
        Self {
            namespace,
            slug,
            title,
            last_editor: editor,
            edited_at: 0,
            version: 1,
            status: WikiPageStatus::Draft,
        }
    }

    /// Record an edit, bumping the version.
    pub fn touch(&mut self, editor: String, now: u64) {
        self.last_editor = editor;
        self.edited_at = now;
        self.version += 1;
    }
}

/// A full wiki page with content.
///
/// Canon: A **Codex Entry** — the complete resonance pattern of a single
/// piece of collective knowledge, including its structured metadata
/// and connections to other entries.
#[derive(Clone, Debug, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct WikiPage {
    /// Page metadata.
    pub meta: WikiPageMeta,
    /// Page body content (markdown or similar).
    pub body: String,
    /// Structured key-value metadata.
    pub structured_metadata: BTreeMap<String, String>,
    /// Slugs of pages this page links to.
    pub backlinks: Vec<String>,
}

impl WikiPage {
    /// Create a new wiki page.
    #[must_use]
    pub fn new(meta: WikiPageMeta, body: String) -> Self {
        Self {
            meta,
            body,
            structured_metadata: BTreeMap::new(),
            backlinks: Vec::new(),
        }
    }

    /// Create a new page with default metadata.
    #[must_use]
    pub fn new_simple(
        namespace: WikiNamespace,
        slug: String,
        title: String,
        editor: String,
        body: String,
    ) -> Self {
        Self::new(WikiPageMeta::new(namespace, slug, title, editor), body)
    }
}

/// Operations on wiki CRDT documents.
///
/// Canon: The **Codex Curator** — the collective process that manages
/// the lifecycle of lore pages from draft through publication to archive.
pub struct WikiOperations;

impl WikiOperations {
    /// Create a new page and add it to the page map. Returns `false` if slug exists.
    pub fn create_page(
        pages: &mut BTreeMap<String, WikiPage>,
        page: WikiPage,
    ) -> bool {
        let key = Self::page_key(&page.meta.namespace, &page.meta.slug);
        if pages.contains_key(&key) {
            return false;
        }
        pages.insert(key, page);
        true
    }

    /// Edit an existing page's body. Returns `false` if not found.
    pub fn edit_page(
        pages: &mut BTreeMap<String, WikiPage>,
        namespace: &WikiNamespace,
        slug: &str,
        new_body: String,
        editor: String,
        now: u64,
    ) -> bool {
        let key = Self::page_key(namespace, slug);
        if let Some(page) = pages.get_mut(&key) {
            page.body = new_body;
            page.meta.touch(editor, now);
            true
        } else {
            false
        }
    }

    /// Publish a page (Draft → Published). Returns `false` if not found.
    pub fn publish_page(
        pages: &mut BTreeMap<String, WikiPage>,
        namespace: &WikiNamespace,
        slug: &str,
        editor: String,
        now: u64,
    ) -> bool {
        let key = Self::page_key(namespace, slug);
        if let Some(page) = pages.get_mut(&key) {
            page.meta.status = WikiPageStatus::Published;
            page.meta.touch(editor, now);
            true
        } else {
            false
        }
    }

    /// Fork a page into a new namespace (creates a copy under Draft).
    /// Returns `false` if source doesn't exist or target slug exists.
    pub fn fork_page(
        pages: &mut BTreeMap<String, WikiPage>,
        source_namespace: &WikiNamespace,
        source_slug: &str,
        target_namespace: &WikiNamespace,
        target_slug: &str,
        editor: String,
        now: u64,
    ) -> bool {
        let source_key = Self::page_key(source_namespace, source_slug);
        let source = match pages.get(&source_key) {
            Some(p) => p,
            None => return false,
        };
        let target_key = Self::page_key(target_namespace, target_slug);
        if pages.contains_key(&target_key) {
            return false;
        }

        let mut forked = source.clone();
        forked.meta = WikiPageMeta::new(
            target_namespace.clone(),
            target_slug.to_string(),
            source.meta.title.clone(),
            editor,
        );
        forked.meta.edited_at = now;
        // Fork starts as Draft
        forked.meta.status = WikiPageStatus::Draft;
        // Clear backlinks (they may not apply in new namespace)
        forked.backlinks.clear();

        pages.insert(target_key, forked);
        true
    }

    /// Build the compound key for namespace + slug.
    fn page_key(namespace: &WikiNamespace, slug: &str) -> String {
        format!("{}:{}", namespace.as_str(), slug)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wiki_document_deterministic() {
        let a = WikiDocument::new(&WikiNamespace::Canon);
        let b = WikiDocument::new(&WikiNamespace::Canon);
        assert_eq!(a, b);
    }

    #[test]
    fn test_wiki_document_different_namespaces() {
        let a = WikiDocument::new(&WikiNamespace::Canon);
        let b = WikiDocument::new(&WikiNamespace::Community);
        let c = WikiDocument::new(&WikiNamespace::Draft);
        assert_ne!(a, b);
        assert_ne!(b, c);
        assert_ne!(a, c);
    }

    #[test]
    fn test_create_and_list_pages() {
        let mut pages = BTreeMap::new();

        let page = WikiPage::new_simple(
            WikiNamespace::Canon,
            "auralis".to_string(),
            "AURALIS".to_string(),
            "user-1".to_string(),
            "The collective consciousness...".to_string(),
        );

        assert!(WikiOperations::create_page(&mut pages, page));
        assert_eq!(pages.len(), 1);

        // Duplicate slug rejected
        let dup = WikiPage::new_simple(
            WikiNamespace::Canon,
            "auralis".to_string(),
            "AURALIS v2".to_string(),
            "user-2".to_string(),
            "Duplicate...".to_string(),
        );
        assert!(!WikiOperations::create_page(&mut pages, dup));
    }

    #[test]
    fn test_edit_page() {
        let mut pages = BTreeMap::new();
        WikiOperations::create_page(&mut pages, WikiPage::new_simple(
            WikiNamespace::Canon, "test".to_string(), "Test".to_string(),
            "user-1".to_string(), "old body".to_string(),
        ));

        let edited = WikiOperations::edit_page(
            &mut pages, &WikiNamespace::Canon, "test",
            "new body".to_string(), "user-2".to_string(), 100,
        );
        assert!(edited);

        let key = WikiOperations::page_key(&WikiNamespace::Canon, "test");
        let page = &pages[&key];
        assert_eq!(page.body, "new body");
        assert_eq!(page.meta.version, 2);
        assert_eq!(page.meta.last_editor, "user-2");
    }

    #[test]
    fn test_publish_page() {
        let mut pages = BTreeMap::new();
        WikiOperations::create_page(&mut pages, WikiPage::new_simple(
            WikiNamespace::Canon, "test".to_string(), "Test".to_string(),
            "user-1".to_string(), "body".to_string(),
        ));

        assert_eq!(pages[&WikiOperations::page_key(&WikiNamespace::Canon, "test")].meta.status, WikiPageStatus::Draft);

        let published = WikiOperations::publish_page(
            &mut pages, &WikiNamespace::Canon, "test",
            "user-1".to_string(), 200,
        );
        assert!(published);

        let key = WikiOperations::page_key(&WikiNamespace::Canon, "test");
        assert_eq!(pages[&key].meta.status, WikiPageStatus::Published);
    }

    #[test]
    fn test_fork_page() {
        let mut pages = BTreeMap::new();
        WikiOperations::create_page(&mut pages, {
            let mut p = WikiPage::new_simple(
                WikiNamespace::Canon, "original".to_string(), "Original".to_string(),
                "user-1".to_string(), "Canon lore".to_string(),
            );
            p.backlinks.push("other-page".to_string());
            p
        });

        let forked = WikiOperations::fork_page(
            &mut pages, &WikiNamespace::Canon, "original",
            &WikiNamespace::Community, "community-copy",
            "user-2".to_string(), 300,
        );
        assert!(forked);

        let src_key = WikiOperations::page_key(&WikiNamespace::Canon, "original");
        let tgt_key = WikiOperations::page_key(&WikiNamespace::Community, "community-copy");

        // Source unchanged
        assert_eq!(pages[&src_key].body, "Canon lore");
        // Fork has same body but different meta
        assert_eq!(pages[&tgt_key].body, "Canon lore");
        assert_eq!(pages[&tgt_key].meta.status, WikiPageStatus::Draft);
        assert_eq!(pages[&tgt_key].meta.version, 1);
        // Backlinks cleared on fork
        assert!(pages[&tgt_key].backlinks.is_empty());
    }

    #[test]
    fn test_fork_nonexistent() {
        let mut pages = BTreeMap::new();
        let forked = WikiOperations::fork_page(
            &mut pages, &WikiNamespace::Canon, "nonexistent",
            &WikiNamespace::Community, "copy",
            "user-1".to_string(), 100,
        );
        assert!(!forked);
    }

    #[test]
    fn test_namespace_as_str() {
        assert_eq!(WikiNamespace::Canon.as_str(), "canon");
        assert_eq!(WikiNamespace::Community.as_str(), "community");
        assert_eq!(WikiNamespace::Draft.as_str(), "draft");
    }
}
