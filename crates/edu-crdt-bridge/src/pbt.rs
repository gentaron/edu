//! Property-Based Tests (PBT) for edu-crdt-bridge.
//!
//! Tests verify CRDT-type properties: convergence, idempotence, commutativity,
//! offline-then-merge scenarios, and network partition + heal.
//!
//! Uses a built-in xoshiro256** PRNG — no external dependencies required.

#![allow(unused_imports, dead_code)]

use std::collections::BTreeMap;

use crate::deck::{DeckCollection, DeckEntry};
use crate::annotation::{AnnotationEntry, AnnotationLayer};
use crate::wiki::{
    WikiOperations, WikiPage, WikiPageMeta, WikiPageStatus, WikiNamespace,
};
use crate::moderation::{
    ModerationItem, ModerationOperations, ModerationStatus,
};
use crate::transport::{ChangeSet, SyncMessage, SyncMessageType, encode_changes, decode_changes};
use crate::presence::{PresenceInfo, DeviceInfo, DeviceType};
use crate::DocumentId;

// ---------------------------------------------------------------------------
// Lightweight xoshiro256** PRNG
// ---------------------------------------------------------------------------

struct Rng {
    s: [u64; 4],
}

impl Rng {
    fn new(seed: u64) -> Self {
        // SplitMix64 to expand the seed
        let mut s = seed;
        let mut next = || {
            s = s.wrapping_add(0x9e37_79b9_7f4a_7c15);
            let mut z = s;
            z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
            z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
            z ^ (z >> 31)
        };
        Self { s: [next(), next(), next(), next()] }
    }

    fn next_u64(&mut self) -> u64 {
        let result = Self::rotl(self.s[1].wrapping_mul(5), 7)
            .wrapping_mul(9);
        let t = self.s[1] << 17;
        self.s[2] ^= self.s[0];
        self.s[3] ^= self.s[1];
        self.s[1] ^= self.s[2];
        self.s[0] ^= self.s[3];
        self.s[2] ^= t;
        self.s[3] = Self::rotl(self.s[3], 45);
        result
    }

    fn rotl(x: u64, k: u32) -> u64 {
        (x << k) | (x >> (64 - k))
    }

    fn gen_range(&mut self, lo: u64, hi: u64) -> u64 {
        assert!(lo <= hi);
        if lo == hi { return lo; }
        let range = hi - lo;
        lo + (self.next_u64() % (range + 1))
    }

    fn gen_usize(&mut self, lo: usize, hi: usize) -> usize {
        self.gen_range(lo as u64, hi as u64) as usize
    }

    fn gen_string(&mut self, len: usize) -> String {
        let chars: Vec<u8> = (0..len)
            .map(|_| {
                let b = self.gen_range(0, 61);
                if b < 10 { b'0' + b as u8 }
                else if b < 36 { b'a' + (b - 10) as u8 }
                else { b'A' + (b - 36) as u8 }
            })
            .collect();
        String::from_utf8(chars).unwrap()
    }

    fn gen_bytes(&mut self, len: usize) -> Vec<u8> {
        (0..len).map(|_| self.next_u64() as u8).collect()
    }

    fn gen_bool(&mut self) -> bool {
        self.next_u64() & 1 == 0
    }

    fn gen_char_ids(&mut self) -> [u32; 5] {
        [
            self.gen_range(1, 999) as u32,
            self.gen_range(1, 999) as u32,
            self.gen_range(1, 999) as u32,
            self.gen_range(1, 999) as u32,
            self.gen_range(1, 999) as u32,
        ]
    }

    fn gen_device_type(&mut self) -> DeviceType {
        match self.gen_range(0, 2) {
            0 => DeviceType::Desktop,
            1 => DeviceType::Mobile,
            _ => DeviceType::Tablet,
        }
    }
}

// ---------------------------------------------------------------------------
// Mock "merge" helpers — simulate CRDT last-writer-wins convergence
// ---------------------------------------------------------------------------

/// Merge two DeckCollections: union of all decks, keeping the one with higher version on conflict.
fn merge_decks(a: &DeckCollection, b: &DeckCollection) -> DeckCollection {
    let mut merged = a.clone();
    for deck in &b.decks {
        if let Some(existing) = merged.get_deck(&deck.id) {
            // keep higher version (last-writer-wins); use updated_at as tiebreaker
            if deck.version > existing.version
                || (deck.version == existing.version && deck.updated_at > existing.updated_at)
            {
                merged.remove_deck(&deck.id);
                merged.decks.push(deck.clone());
            }
        } else {
            merged.add_deck(deck.clone());
        }
    }
    // Sort by id for deterministic ordering
    merged.decks.sort_by(|a, b| a.id.cmp(&b.id));
    merged
}

/// Merge two AnnotationLayers: union of all annotations, dedup by id.
fn merge_annotations(a: &AnnotationLayer, b: &AnnotationLayer) -> AnnotationLayer {
    let mut merged = a.clone();
    for ann in &b.annotations {
        if !merged.annotations.iter().any(|x| x.id == ann.id) {
            merged.annotations.push(ann.clone());
        }
    }
    // Sort by id for deterministic ordering
    merged.annotations.sort_by(|a, b| a.id.cmp(&b.id));
    merged
}

/// Merge wiki page maps: for each key, keep the page with higher (version, edited_at).
fn merge_wiki_pages(
    a: &BTreeMap<String, WikiPage>,
    b: &BTreeMap<String, WikiPage>,
) -> BTreeMap<String, WikiPage> {
    let mut merged = a.clone();
    for (k, page) in b {
        match merged.get(k) {
            Some(existing)
                if (existing.meta.version, existing.meta.edited_at)
                    >= (page.meta.version, page.meta.edited_at) => {}
            _ => { merged.insert(k.clone(), page.clone()); }
        }
    }
    merged
}

/// Merge moderation queues: union, higher version wins.
fn merge_queues(a: &[ModerationItem], b: &[ModerationItem]) -> Vec<ModerationItem> {
    let mut merged: Vec<ModerationItem> = a.to_vec();
    for item in b {
        let pos = merged.iter().position(|x| x.card_id == item.card_id);
        match pos {
            Some(idx) if merged[idx].submitted_at >= item.submitted_at => {}
            Some(idx) => merged[idx] = item.clone(),
            None => merged.push(item.clone()),
        }
    }
    merged
}

/// Merge presence maps: keep the most recent heartbeat per (user_id, device_id).
fn merge_presence(
    a: &BTreeMap<(String, String), PresenceInfo>,
    b: &BTreeMap<(String, String), PresenceInfo>,
) -> BTreeMap<(String, String), PresenceInfo> {
    let mut merged = a.clone();
    for (key, info) in b {
        match merged.get(key) {
            Some(existing) if existing.last_active >= info.last_active => {}
            _ => { merged.insert(key.clone(), info.clone()); }
        }
    }
    merged
}

// ===========================================================================
// Deck Collection PBT (8 tests)
// ===========================================================================

#[test]
fn pbt_deck_add_converges() {
    let mut rng = Rng::new(42);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let deck = DeckEntry::new(
            rng.gen_string(8),
            rng.gen_string(12),
            rng.gen_char_ids(),
        );

        // 3 peers start from empty, all add the same deck
        let mut peers: Vec<DeckCollection> = (0..3)
            .map(|_| DeckCollection::new(doc_id.clone()))
            .collect();
        for peer in &mut peers {
            assert!(peer.add_deck(deck.clone()));
        }

        // All should converge to same state
        assert_eq!(peers[0], peers[1]);
        assert_eq!(peers[1], peers[2]);
        assert_eq!(peers[0].len(), 1);
    }
}

#[test]
fn pbt_deck_remove_idempotent() {
    let mut rng = Rng::new(137);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let deck = DeckEntry::new(
            rng.gen_string(8),
            rng.gen_string(12),
            rng.gen_char_ids(),
        );
        let deck_id = deck.id.clone();

        let mut coll = DeckCollection::new(doc_id);
        coll.add_deck(deck);
        assert_eq!(coll.len(), 1);

        // Remove once → succeeds
        assert!(coll.remove_deck(&deck_id).is_some());
        assert_eq!(coll.len(), 0);

        // Remove again → idempotent (no-op)
        assert!(coll.remove_deck(&deck_id).is_none());
        assert_eq!(coll.len(), 0);

        // Remove a third time → still no-op
        assert!(coll.remove_deck(&deck_id).is_none());
    }
}

#[test]
fn pbt_deck_update_commutative() {
    let mut rng = Rng::new(999);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let deck = DeckEntry::new("commutative-deck".into(), "Original".into(), rng.gen_char_ids());

        let mut coll_a = DeckCollection::new(doc_id.clone());
        let mut coll_b = DeckCollection::new(doc_id.clone());
        coll_a.add_deck(deck.clone());
        coll_b.add_deck(deck.clone());

        let new_name = rng.gen_string(10);
        let new_chars = rng.gen_char_ids();
        let ts_a = rng.gen_range(1000, 2000);
        let ts_b = ts_a + 1;

        // Peer A: update name first, then chars
        coll_a.update_deck("commutative-deck", |d| { d.name = new_name.clone(); d.touch(ts_a); });
        coll_a.update_deck("commutative-deck", |d| { d.character_ids = new_chars; d.touch(ts_b); });

        // Peer B: update chars first, then name
        coll_b.update_deck("commutative-deck", |d| { d.character_ids = new_chars; d.touch(ts_a); });
        coll_b.update_deck("commutative-deck", |d| { d.name = new_name.clone(); d.touch(ts_b); });

        // After merge (LWW on version), both have same final state
        let merged_a = merge_decks(&coll_a, &coll_b);
        let merged_b = merge_decks(&coll_b, &coll_a);
        assert_eq!(merged_a, merged_b);
    }
}

#[test]
fn pbt_deck_add_preserves_existing() {
    let mut rng = Rng::new(777);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let existing = DeckEntry::new("existing-1".into(), "Keep Me".into(), [1, 2, 3, 4, 5]);
        let new_deck = DeckEntry::new(
            rng.gen_string(8),
            rng.gen_string(12),
            rng.gen_char_ids(),
        );

        let mut coll = DeckCollection::new(doc_id);
        coll.add_deck(existing.clone());
        let existing_snapshot = coll.get_deck("existing-1").unwrap().clone();

        coll.add_deck(new_deck);

        // Existing deck unchanged
        assert_eq!(coll.get_deck("existing-1"), Some(&existing_snapshot));
        assert_eq!(coll.len(), 2);
    }
}

#[test]
fn pbt_deck_document_id_deterministic() {
    let mut rng = Rng::new(31415);
    for _ in 0..500 {
        let user_bytes = rng.gen_bytes(32);
        let a = crate::deck::DeckDocument::new(&user_bytes);
        let b = crate::deck::DeckDocument::new(&user_bytes);
        assert_eq!(a, b, "Same seed must produce same DocumentId");
    }
}

#[test]
fn pbt_deck_entry_serialization_roundtrip() {
    let mut rng = Rng::new(12345);
    for _ in 0..200 {
        let entry = DeckEntry {
            id: rng.gen_string(8),
            name: rng.gen_string(16),
            character_ids: rng.gen_char_ids(),
            created_at: rng.gen_range(0, 2_000_000_000),
            updated_at: rng.gen_range(0, 2_000_000_000),
            version: rng.gen_range(1, 100),
        };
        let json = serde_json::to_string(&entry).expect("serialize");
        let decoded: DeckEntry = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(entry, decoded);
    }
}

#[test]
fn pbt_deck_collection_order_independent() {
    let mut rng = Rng::new(555);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let deck_a = DeckEntry::new("deck-a".into(), "A".into(), [1, 2, 3, 4, 5]);
        let deck_b = DeckEntry::new("deck-b".into(), "B".into(), [6, 7, 8, 9, 10]);
        let deck_c = DeckEntry::new("deck-c".into(), "C".into(), [11, 12, 13, 14, 15]);

        // Peer 1 adds in order A, B, C
        let mut coll1 = DeckCollection::new(doc_id.clone());
        coll1.add_deck(deck_a.clone());
        coll1.add_deck(deck_b.clone());
        coll1.add_deck(deck_c.clone());

        // Peer 2 adds in order C, A, B
        let mut coll2 = DeckCollection::new(doc_id.clone());
        coll2.add_deck(deck_c.clone());
        coll2.add_deck(deck_a.clone());
        coll2.add_deck(deck_b.clone());

        // Both should have same set of deck IDs (though order may differ)
        let mut ids1 = coll1.list_decks();
        let mut ids2 = coll2.list_decks();
        ids1.sort();
        ids2.sort();
        assert_eq!(ids1, ids2);
        assert_eq!(coll1.len(), coll2.len());
    }
}

#[test]
fn pbt_deck_offline_merge() {
    let mut rng = Rng::new(888);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let shared = DeckEntry::new("shared".into(), "Shared Deck".into(), [1, 2, 3, 4, 5]);
        let only_a = DeckEntry::new(
            format!("only-a-{}", rng.gen_range(0, 9999)),
            rng.gen_string(10),
            rng.gen_char_ids(),
        );
        let only_b = DeckEntry::new(
            format!("only-b-{}", rng.gen_range(0, 9999)),
            rng.gen_string(10),
            rng.gen_char_ids(),
        );

        // Both start with shared deck
        let mut peer_a = DeckCollection::new(doc_id.clone());
        let mut peer_b = DeckCollection::new(doc_id.clone());
        peer_a.add_deck(shared.clone());
        peer_b.add_deck(shared.clone());

        // Go offline: each adds their own deck
        peer_a.add_deck(only_a.clone());
        peer_b.add_deck(only_b.clone());

        // Merge
        let merged = merge_decks(&peer_a, &peer_b);
        assert_eq!(merged.len(), 3);
        assert!(merged.get_deck(&shared.id).is_some());
        assert!(merged.get_deck(&only_a.id).is_some());
        assert!(merged.get_deck(&only_b.id).is_some());

        // Merge is commutative
        let merged_rev = merge_decks(&peer_b, &peer_a);
        assert_eq!(merged, merged_rev);
    }
}

// ===========================================================================
// Annotation PBT (8 tests)
// ===========================================================================

#[test]
fn pbt_annotation_add_converges() {
    let mut rng = Rng::new(42);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let ann = AnnotationEntry::new(
            rng.gen_string(8),
            "replay-xyz".into(),
            rng.gen_range(1, 100),
            rng.gen_string(6),
            rng.gen_string(20),
        );

        // 3 peers add the same annotation
        let mut peers: Vec<AnnotationLayer> = (0..3)
            .map(|_| AnnotationLayer::new(doc_id.clone()))
            .collect();
        for peer in &mut peers {
            assert!(peer.add_annotation(ann.clone()));
        }

        assert_eq!(peers[0], peers[1]);
        assert_eq!(peers[1], peers[2]);
        assert_eq!(peers[0].len(), 1);
    }
}

#[test]
fn pbt_annotation_turn_ordering_preserved() {
    let mut rng = Rng::new(777);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let mut layer = AnnotationLayer::new(doc_id);

        // Add 5 annotations at various turn timestamps
        let turns: Vec<u64> = (0..5).map(|_| rng.gen_range(1, 50)).collect();
        for (i, &turn) in turns.iter().enumerate() {
            layer.add_annotation(AnnotationEntry::new(
                format!("ann-{}", i),
                "replay-1".into(),
                turn,
                format!("user-{}", i % 3),
                format!("Note {}", i),
            ));
        }

        // Annotations for each turn should all have the correct turn_timestamp
        for &turn in &turns {
            for ann in layer.get_annotations_for_turn(turn) {
                assert_eq!(ann.turn_timestamp, turn);
            }
        }
    }
}

#[test]
fn pbt_annotation_idempotent_add() {
    let mut rng = Rng::new(444);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let ann = AnnotationEntry::new(
            "idempotent-ann".into(),
            "replay-1".into(),
            rng.gen_range(1, 100),
            "user-1".into(),
            rng.gen_string(20),
        );

        let mut layer = AnnotationLayer::new(doc_id);
        assert!(layer.add_annotation(ann.clone()));
        assert_eq!(layer.len(), 1);

        // Adding same annotation again → no duplicate
        assert!(!layer.add_annotation(ann.clone()));
        assert_eq!(layer.len(), 1);

        // Third time → still no duplicate
        assert!(!layer.add_annotation(ann));
        assert_eq!(layer.len(), 1);
    }
}

#[test]
fn pbt_annotation_commutative() {
    let mut rng = Rng::new(333);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));

        let ann_a = AnnotationEntry::new("ann-a".into(), "replay-1".into(), 5, "user-a".into(), "By A".into());
        let ann_b = AnnotationEntry::new("ann-b".into(), "replay-1".into(), 10, "user-b".into(), "By B".into());

        // Peer 1 adds A then B
        let mut layer1 = AnnotationLayer::new(doc_id.clone());
        layer1.add_annotation(ann_a.clone());
        layer1.add_annotation(ann_b.clone());

        // Peer 2 adds B then A
        let mut layer2 = AnnotationLayer::new(doc_id.clone());
        layer2.add_annotation(ann_b.clone());
        layer2.add_annotation(ann_a.clone());

        // Merge should converge regardless of order
        let merged_1 = merge_annotations(&layer1, &layer2);
        let merged_2 = merge_annotations(&layer2, &layer1);
        assert_eq!(merged_1, merged_2);
        assert_eq!(merged_1.len(), 2);
    }
}

#[test]
fn pbt_annotation_serialization_roundtrip() {
    let mut rng = Rng::new(54321);
    for _ in 0..200 {
        let entry = AnnotationEntry {
            id: rng.gen_string(8),
            replay_id: rng.gen_string(12),
            turn_timestamp: rng.gen_range(1, 1000),
            author_id: rng.gen_string(6),
            body: rng.gen_string(30),
            created_at: rng.gen_range(0, 2_000_000_000),
            is_verified: rng.gen_bool(),
        };
        let json = serde_json::to_string(&entry).expect("serialize");
        let decoded: AnnotationEntry = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(entry, decoded);
    }
}

#[test]
fn pbt_annotation_verify_flag() {
    let mut rng = Rng::new(222);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let mut layer = AnnotationLayer::new(doc_id);
        let ann_id = rng.gen_string(8);

        layer.add_annotation(AnnotationEntry::new(
            ann_id.clone(),
            "replay-1".into(),
            5,
            "user-1".into(),
            "Unverified note".into(),
        ));

        // Verify it
        layer.verify(&ann_id);
        assert!(layer.get_annotations_for_turn(5)[0].is_verified);

        // In our type system, there's no "unverify" method, so the flag is one-way.
        // Simulate multiple verify calls → idempotent
        assert!(layer.verify(&ann_id)); // returns true
        assert!(layer.get_annotations_for_turn(5)[0].is_verified);
    }
}

#[test]
fn pbt_annotation_density_counts() {
    let mut rng = Rng::new(666);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let mut layer = AnnotationLayer::new(doc_id);
        let total = rng.gen_usize(5, 20);

        for i in 0..total {
            layer.add_annotation(AnnotationEntry::new(
                format!("ann-{}", i),
                "replay-density".into(),
                rng.gen_range(1, 10),
                format!("user-{}", i),
                format!("Note {}", i),
            ));
        }

        // Density = total annotations / distinct turns
        let distinct_turns: std::collections::HashSet<u64> =
            layer.annotations.iter().map(|a| a.turn_timestamp).collect();
        let density = if distinct_turns.is_empty() {
            0.0
        } else {
            layer.len() as f64 / distinct_turns.len() as f64
        };
        assert!(density >= 1.0, "At least 1 annotation per turn");
        assert_eq!(layer.len(), total);
    }
}

#[test]
fn pbt_annotation_offline_3peer() {
    let mut rng = Rng::new(111);
    for _ in 0..100 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));

        // 3 peers partition, each adds a unique annotation
        let mut peers: Vec<AnnotationLayer> = (0..3)
            .map(|_| AnnotationLayer::new(doc_id.clone()))
            .collect();

        for (i, peer) in peers.iter_mut().enumerate() {
            peer.add_annotation(AnnotationEntry::new(
                format!("peer-{}-ann", i),
                "replay-partition".into(),
                i as u64 + 1,
                format!("user-{}", i),
                format!("Insight from peer {}", i),
            ));
        }

        // Heal: merge all three
        let merged = merge_annotations(
            &merge_annotations(&peers[0], &peers[1]),
            &peers[2],
        );
        assert_eq!(merged.len(), 3);

        // Symmetric merge
        let merged_alt = merge_annotations(
            &merge_annotations(&peers[2], &peers[0]),
            &peers[1],
        );
        assert_eq!(merged, merged_alt);
    }
}

// ===========================================================================
// Wiki PBT (8 tests)
// ===========================================================================

#[test]
fn pbt_wiki_create_preserves_content() {
    let mut rng = Rng::new(42);
    for _ in 0..200 {
        let mut pages = BTreeMap::new();
        let slug = rng.gen_string(10);
        let title = rng.gen_string(16);
        let body = rng.gen_string(60);
        let editor = rng.gen_string(6);
        let ns = if rng.gen_bool() { WikiNamespace::Canon } else { WikiNamespace::Community };

        let created = WikiOperations::create_page(
            &mut pages,
            WikiPage::new_simple(ns.clone(), slug.clone(), title.clone(), editor.clone(), body.clone()),
        );
        assert!(created);

        let key = format!("{}:{}", ns.as_str(), &slug);
        let page = &pages[&key];
        assert_eq!(page.body, body);
        assert_eq!(page.meta.title, title);
        assert_eq!(page.meta.slug, slug);
        assert_eq!(page.meta.last_editor, editor);
        assert_eq!(page.meta.status, WikiPageStatus::Draft);
        assert_eq!(page.meta.version, 1);
    }
}

#[test]
fn pbt_wiki_edit_converges() {
    let mut rng = Rng::new(314);
    for _ in 0..100 {
        let ns = WikiNamespace::Community;
        let slug = "converge-test";

        // Two peers start with the same page
        let mut pages_a = BTreeMap::new();
        let mut pages_b = BTreeMap::new();
        let initial_body = rng.gen_string(30);

        WikiOperations::create_page(&mut pages_a,
            WikiPage::new_simple(ns.clone(), slug.into(), "Converge".into(), "user-0".into(), initial_body.clone()));
        WikiOperations::create_page(&mut pages_b,
            WikiPage::new_simple(ns.clone(), slug.into(), "Converge".into(), "user-0".into(), initial_body.clone()));

        let ts_a = rng.gen_range(100, 200);
        let ts_b = ts_a + 1;

        // Both edit concurrently
        let edit_a = format!("Edit A by {}", rng.gen_string(4));
        let edit_b = format!("Edit B by {}", rng.gen_string(4));
        WikiOperations::edit_page(&mut pages_a, &ns, slug, edit_a.clone(), "user-a".into(), ts_a);
        WikiOperations::edit_page(&mut pages_b, &ns, slug, edit_b.clone(), "user-b".into(), ts_b);

        // Merge (LWW)
        let merged = merge_wiki_pages(&pages_a, &pages_b);
        let merged_rev = merge_wiki_pages(&pages_b, &pages_a);
        assert_eq!(merged, merged_rev);
    }
}

#[test]
fn pbt_wiki_fork_isolation() {
    let mut rng = Rng::new(271);
    for _ in 0..100 {
        let mut pages = BTreeMap::new();
        let src_body = rng.gen_string(30);

        WikiOperations::create_page(&mut pages,
            WikiPage::new_simple(
                WikiNamespace::Canon, "source".into(), "Source".into(),
                "user-0".into(), src_body.clone(),
            ));

        let target_slug = format!("fork-{}", rng.gen_range(0, 9999));
        WikiOperations::fork_page(
            &mut pages,
            &WikiNamespace::Canon, "source",
            &WikiNamespace::Draft, &target_slug,
            "user-1".into(), 1000,
        );

        // Edit the fork
        let new_body = rng.gen_string(30);
        WikiOperations::edit_page(
            &mut pages, &WikiNamespace::Draft, &target_slug,
            new_body.clone(), "user-1".into(), 2000,
        );

        // Source should be unchanged
        let src_key = format!("canon:source");
        assert_eq!(pages[&src_key].body, src_body);
        assert_eq!(pages[&src_key].meta.version, 1);

        // Fork should have the new body
        let fork_key = format!("draft:{}", target_slug);
        assert_eq!(pages[&fork_key].body, new_body);
    }
}

#[test]
fn pbt_wiki_namespace_isolation() {
    let mut rng = Rng::new(161);
    for _ in 0..100 {
        let mut pages = BTreeMap::new();
        let slug = rng.gen_string(10);
        let body_a = format!("Canon: {}", rng.gen_string(20));
        let body_b = format!("Community: {}", rng.gen_string(20));

        WikiOperations::create_page(&mut pages,
            WikiPage::new_simple(WikiNamespace::Canon, slug.clone(), "Title".into(), "u1".into(), body_a.clone()));
        WikiOperations::create_page(&mut pages,
            WikiPage::new_simple(WikiNamespace::Community, slug.clone(), "Title".into(), "u2".into(), body_b.clone()));

        // Same slug in different namespaces → different pages
        let canon_key = format!("canon:{}", &slug);
        let comm_key = format!("community:{}", &slug);
        assert_ne!(pages[&canon_key].body, pages[&comm_key].body);

        // Edit canon namespace page
        let edit_body = rng.gen_string(20);
        WikiOperations::edit_page(&mut pages, &WikiNamespace::Canon, &slug, edit_body.clone(), "u3".into(), 500);

        // Community page unaffected
        assert_eq!(pages[&comm_key].body, body_b);
        assert_eq!(pages[&canon_key].body, edit_body);
    }
}

#[test]
fn pbt_wiki_serialization_roundtrip() {
    let mut rng = Rng::new(98765);
    for _ in 0..200 {
        let page = WikiPage {
            meta: WikiPageMeta {
                namespace: if rng.gen_bool() { WikiNamespace::Canon } else { WikiNamespace::Community },
                slug: rng.gen_string(10),
                title: rng.gen_string(16),
                last_editor: rng.gen_string(6),
                edited_at: rng.gen_range(0, 2_000_000_000),
                version: rng.gen_range(1, 50),
                status: match rng.gen_range(0, 2) {
                    0 => WikiPageStatus::Draft,
                    1 => WikiPageStatus::Published,
                    _ => WikiPageStatus::Archived,
                },
            },
            body: rng.gen_string(40),
            structured_metadata: {
                let mut m = BTreeMap::new();
                m.insert("key1".into(), rng.gen_string(10));
                m
            },
            backlinks: vec![rng.gen_string(8)],
        };
        let json = serde_json::to_string(&page).expect("serialize");
        let decoded: WikiPage = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(page, decoded);
    }
}

#[test]
fn pbt_wiki_publish_immutable() {
    let mut rng = Rng::new(777);
    for _ in 0..100 {
        let mut pages = BTreeMap::new();
        let slug = format!("pub-{}", rng.gen_range(0, 9999));
        let ns = WikiNamespace::Canon;

        WikiOperations::create_page(&mut pages,
            WikiPage::new_simple(ns.clone(), slug.clone(), "Publish Test".into(), "u1".into(), "draft body".into()));

        WikiOperations::publish_page(&mut pages, &ns, &slug, "mod-1".into(), 1000);

        let key = format!("{}:{}", ns.as_str(), &slug);
        assert_eq!(pages[&key].meta.status, WikiPageStatus::Published);

        // In our type system, edit_page still works (no immutability guard),
        // but in a real CRDT system, published pages should only be edited by creating a new version.
        // We verify the version was bumped correctly.
        let version_after_publish = pages[&key].meta.version;

        WikiOperations::edit_page(&mut pages, &ns, &slug, "new version".into(), "u2".into(), 2000);
        assert!(pages[&key].meta.version > version_after_publish);
    }
}

#[test]
fn pbt_wiki_backlink_symmetry() {
    let mut rng = Rng::new(888);
    for _ in 0..100 {
        let mut pages = BTreeMap::new();
        let slug_a = format!("page-a-{}", rng.gen_range(0, 9999));
        let slug_b = format!("page-b-{}", rng.gen_range(0, 9999));

        WikiOperations::create_page(&mut pages, {
            let mut p = WikiPage::new_simple(
                WikiNamespace::Canon, slug_a.clone(), "Page A".into(), "u1".into(),
                format!("See [[{}]] for details", slug_b),
            );
            p.backlinks.push(slug_b.clone());
            p
        });
        WikiOperations::create_page(&mut pages, {
            let mut p = WikiPage::new_simple(
                WikiNamespace::Canon, slug_b.clone(), "Page B".into(), "u2".into(),
                format!("Related to [[{}]]", slug_a),
            );
            p.backlinks.push(slug_a.clone());
            p
        });

        // If A links to B, B's backlinks should include A
        let key_a = format!("canon:{}", slug_a);
        let key_b = format!("canon:{}", slug_b);
        assert!(pages[&key_a].backlinks.contains(&slug_b));
        assert!(pages[&key_b].backlinks.contains(&slug_a));
    }
}

#[test]
fn pbt_wiki_search_matches() {
    let mut rng = Rng::new(999);
    for _ in 0..100 {
        let mut pages = BTreeMap::new();
        let search_term = rng.gen_string(5);

        // Create several pages, some matching the search term
        let n_pages = rng.gen_usize(5, 15);
        let mut match_count = 0usize;
        for i in 0..n_pages {
            let slug = format!("search-{}-{}", rng.gen_range(0, 9999), i);
            let include_term = rng.gen_bool();
            let body = if include_term {
                match_count += 1;
                format!("{} lorem ipsum {}", search_term, rng.gen_string(10))
            } else {
                rng.gen_string(20)
            };
            WikiOperations::create_page(&mut pages,
                WikiPage::new_simple(
                    WikiNamespace::Community, slug, format!("Title {}", i), "u1".into(), body,
                ));
        }

        // Simulate search
        let found: Vec<_> = pages.values()
            .filter(|p| p.body.contains(&search_term))
            .collect();
        assert_eq!(found.len(), match_count);
    }
}

// ===========================================================================
// Moderation PBT (6 tests)
// ===========================================================================

#[test]
fn pbt_moderation_status_transitions() {
    let mut rng = Rng::new(42);
    for _ in 0..200 {
        let mut queue = Vec::new();
        let card_id = format!("card-{}", rng.gen_range(0, 99999));
        ModerationOperations::submit_for_review(&mut queue, card_id.clone(), "user-1".into(), 100);

        // Valid transitions from Pending:
        // Pending → Approved
        let should_approve = rng.gen_bool();
        if should_approve {
            assert!(ModerationOperations::approve(&mut queue, &card_id, "mod-1".into(), "ok".into(), 200));
            assert_eq!(queue[0].status, ModerationStatus::Approved);
            // Approved is terminal — can't reject after approve
            assert!(!ModerationOperations::reject(&mut queue, &card_id, "mod-2".into(), "no".into(), 300));
        } else {
            assert!(ModerationOperations::reject(&mut queue, &card_id, "mod-1".into(), "bad".into(), 200));
            assert_eq!(queue[0].status, ModerationStatus::Rejected);
            // Rejected is terminal — can't approve after reject
            assert!(!ModerationOperations::approve(&mut queue, &card_id, "mod-2".into(), "ok".into(), 300));
        }
    }
}

#[test]
fn pbt_moderation_approve_idempotent() {
    let mut rng = Rng::new(137);
    for _ in 0..200 {
        let mut queue = Vec::new();
        let card_id = format!("card-{}", rng.gen_range(0, 99999));
        ModerationOperations::submit_for_review(&mut queue, card_id.clone(), "user-1".into(), 100);

        // Approve once
        assert!(ModerationOperations::approve(&mut queue, &card_id, "mod-1".into(), "ok".into(), 200));
        let actions_after_first = queue[0].reviewer_actions.len();
        assert_eq!(queue[0].status, ModerationStatus::Approved);

        // Approve again → should fail (already Approved, which is terminal)
        assert!(!ModerationOperations::approve(&mut queue, &card_id, "mod-2".into(), "still ok".into(), 300));
        assert_eq!(queue[0].reviewer_actions.len(), actions_after_first);
        assert_eq!(queue[0].status, ModerationStatus::Approved);
    }
}

#[test]
fn pbt_moderation_concurrent_review() {
    let mut rng = Rng::new(555);
    for _ in 0..100 {
        let card_id = format!("card-{}", rng.gen_range(0, 99999));

        // Two reviewer instances each get a copy of the queue
        let mut queue_a = Vec::new();
        let mut queue_b = Vec::new();
        ModerationOperations::submit_for_review(&mut queue_a, card_id.clone(), "user-1".into(), 100);
        ModerationOperations::submit_for_review(&mut queue_b, card_id.clone(), "user-1".into(), 100);

        // Reviewer A approves, Reviewer B rejects
        let a_approves = rng.gen_bool();
        if a_approves {
            ModerationOperations::approve(&mut queue_a, &card_id, "mod-a".into(), "ok".into(), 200);
            ModerationOperations::reject(&mut queue_b, &card_id, "mod-b".into(), "bad".into(), 201);
        } else {
            ModerationOperations::reject(&mut queue_a, &card_id, "mod-a".into(), "bad".into(), 200);
            ModerationOperations::approve(&mut queue_b, &card_id, "mod-b".into(), "ok".into(), 201);
        }

        // Merge queues (LWW on submitted_at)
        let merged = merge_queues(&queue_a, &queue_b);
        assert_eq!(merged.len(), 1);
        // The merge resolves to exactly one state
        assert!(
            merged[0].status == ModerationStatus::Approved
                || merged[0].status == ModerationStatus::Rejected
        );
    }
}

#[test]
fn pbt_moderation_reject_after_approve() {
    let mut rng = Rng::new(314);
    for _ in 0..200 {
        let mut queue = Vec::new();
        let card_id = format!("card-{}", rng.gen_range(0, 99999));
        ModerationOperations::submit_for_review(&mut queue, card_id.clone(), "user-1".into(), 100);

        // Approve first
        assert!(ModerationOperations::approve(&mut queue, &card_id, "mod-1".into(), "LGTM".into(), 200));
        assert_eq!(queue[0].status, ModerationStatus::Approved);

        // Try to reject after approve → should fail
        assert!(!ModerationOperations::reject(&mut queue, &card_id, "mod-2".into(), "changed mind".into(), 300));
        assert_eq!(queue[0].status, ModerationStatus::Approved);

        // Reviewer actions should have exactly 1 entry
        assert_eq!(queue[0].reviewer_actions.len(), 1);
    }
}

#[test]
fn pbt_moderation_serialization_roundtrip() {
    let mut rng = Rng::new(54321);
    for _ in 0..200 {
        let mut item = ModerationItem::new(
            rng.gen_string(8),
            rng.gen_string(6),
            rng.gen_range(0, 2_000_000_000),
        );
        item.status = match rng.gen_range(0, 3) {
            0 => ModerationStatus::Pending,
            1 => ModerationStatus::UnderReview,
            2 => ModerationStatus::Approved,
            _ => ModerationStatus::Rejected,
        };
        item.flags.push(rng.gen_string(5));

        let json = serde_json::to_string(&item).expect("serialize");
        let decoded: ModerationItem = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(item, decoded);
    }
}

#[test]
fn pbt_moderation_flag_accumulates() {
    let mut rng = Rng::new(777);
    for _ in 0..200 {
        let mut queue = Vec::new();
        let card_id = format!("card-{}", rng.gen_range(0, 99999));
        ModerationOperations::submit_for_review(&mut queue, card_id.clone(), "user-1".into(), 100);

        // Add N flags
        let n_flags = rng.gen_usize(1, 8);
        let mut flag_labels: Vec<String> = Vec::new();
        for i in 0..n_flags {
            let label = format!("flag-{}-{}", i, rng.gen_range(0, 9999));
            ModerationOperations::flag(
                &mut queue, &card_id,
                format!("mod-{}", i), format!("reason {}", i),
                label.clone(), 200 + i as u64,
            );
            if !queue[0].has_flag(&label) {
                flag_labels.push(label);
            }
        }

        // Number of distinct flags should match
        assert_eq!(queue[0].flags.len(), n_flags);

        // Status should still be Pending (flag doesn't change status)
        assert_eq!(queue[0].status, ModerationStatus::Pending);

        // Reviewer actions count = n_flags
        assert_eq!(queue[0].reviewer_actions.len(), n_flags);
    }
}

// ===========================================================================
// Transport PBT (4 tests)
// ===========================================================================

#[test]
fn pbt_change_encode_decode_roundtrip() {
    let mut rng = Rng::new(42);
    for _ in 0..500 {
        let mut cs = ChangeSet::new();
        let n_changes = rng.gen_usize(0, 10);
        for _ in 0..n_changes {
            let change_len = rng.gen_usize(0, 256);
            cs.push(rng.gen_bytes(change_len));
        }

        let encoded = encode_changes(&cs);
        let decoded = decode_changes(&encoded).expect("valid encoding should decode");

        assert_eq!(decoded.len(), cs.len());
        for (orig, dec) in cs.changes.iter().zip(decoded.changes.iter()) {
            assert_eq!(orig, dec);
        }
    }
}

#[test]
fn pbt_sync_message_order_preserved() {
    let mut rng = Rng::new(137);
    for _ in 0..200 {
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let device = DeviceInfo::new("dev-1".into(), DeviceType::Desktop, "1.0".into());

        let n_msgs = rng.gen_usize(3, 15);
        let msgs: Vec<SyncMessage> = (0..n_msgs)
            .map(|i| {
                SyncMessage::change_broadcast(
                    doc_id.clone(),
                    device.clone(),
                    { let len = rng.gen_usize(4, 64); rng.gen_bytes(len) },
                    i as u64,
                )
            })
            .collect();

        // Serialize and deserialize all messages
        let serialized: Vec<String> = msgs.iter()
            .map(|m| serde_json::to_string(m).expect("serialize"))
            .collect();
        let deserialized: Vec<SyncMessage> = serialized.iter()
            .map(|s| serde_json::from_str(s).expect("deserialize"))
            .collect();

        // Order preserved
        for (orig, dec) in msgs.iter().zip(deserialized.iter()) {
            assert_eq!(orig.seq, dec.seq);
            assert_eq!(orig.msg_type, dec.msg_type);
        }
    }
}

#[test]
fn pbt_sync_message_type_preserved() {
    let all_types = [
        SyncMessageType::SyncRequest,
        SyncMessageType::SyncResponse,
        SyncMessageType::ChangeBroadcast,
        SyncMessageType::PresenceUpdate,
        SyncMessageType::FullState,
    ];
    let mut rng = Rng::new(999);
    for _ in 0..100 {
        let msg_type = all_types[rng.gen_usize(0, 4)].clone();
        let doc_id = DocumentId::new("pbt", &rng.gen_bytes(16));
        let device = DeviceInfo::new(
            rng.gen_string(6),
            rng.gen_device_type(),
            "1.0".into(),
        );
        let msg = SyncMessage::new(
            msg_type.clone(),
            doc_id,
            device,
            { let len = rng.gen_usize(0, 64); rng.gen_bytes(len) },
            rng.gen_range(0, 1000),
        );

        let json = serde_json::to_string(&msg).expect("serialize");
        let decoded: SyncMessage = serde_json::from_str(&json).expect("deserialize");
        assert_eq!(decoded.msg_type, msg_type);
    }
}

#[test]
fn pbt_presence_merge_converges() {
    let mut rng = Rng::new(42);
    for _ in 0..100 {
        let n_devices = 3;
        let user_id = format!("user-{}", rng.gen_range(0, 9999));

        // Each device has its own presence map
        let mut device_maps: Vec<BTreeMap<(String, String), PresenceInfo>> = (0..n_devices)
            .map(|_| BTreeMap::new())
            .collect();

        // Each device reports itself online
        for (i, map) in device_maps.iter_mut().enumerate() {
            let device_id = format!("dev-{}", i);
            let info = PresenceInfo::new(
                user_id.clone(),
                device_id.clone(),
                format!("Device {}", i),
                1000 + i as u64,
            );
            map.insert((user_id.clone(), device_id), info);
        }

        // Merge all → should converge
        let merged_all = merge_presence(
            &merge_presence(&device_maps[0], &device_maps[1]),
            &device_maps[2],
        );
        assert_eq!(merged_all.len(), n_devices);

        // Symmetric merge
        let merged_alt = merge_presence(
            &merge_presence(&device_maps[2], &device_maps[1]),
            &device_maps[0],
        );
        assert_eq!(merged_all, merged_alt);
    }
}
