//! Merkle tree implementation for game-state snapshot commitments.
//!
//! Uses SHA-256 as the hash function. Supports proof generation and verification.
//! Zero-allocation leaf construction — the tree stores only hashes.
//!
//! ## Canon (Lore-Tech)
//! The Merkle tree is the **Temporal Cascade** — each leaf is a frozen
//! moment in the battle timeline, and the root hash is the **Dimensional
//! Seal** that proves the entire sequence of events is intact.

use sha2::{Digest, Sha256};
use crate::types::ReplayHash;
use crate::types::hex_encode;

#[cfg(not(feature = "std"))]
use alloc::string::String;

#[cfg(not(feature = "std"))]
use alloc::vec::Vec;

/// A Merkle tree node hash.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct NodeHash(pub [u8; 32]);

impl NodeHash {
    /// The zero hash (for padding incomplete trees).
    #[must_use]
    pub const fn zero() -> Self {
        Self([0u8; 32])
    }

    /// Compute hash of two child nodes.
    #[must_use]
    pub fn combine(left: &NodeHash, right: &NodeHash) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(left.0);
        hasher.update(right.0);
        let hash = hasher.finalize();
        Self(hash.into())
    }

    /// Hash arbitrary leaf data.
    #[must_use]
    pub fn leaf(data: &[u8]) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(b"leaf:");
        hasher.update(data);
        let hash = hasher.finalize();
        Self(hash.into())
    }

    /// Hex representation.
    #[must_use]
    pub fn to_hex(&self) -> String {
        self.0.iter().map(|b| crate::types::byte_to_hex(*b)).collect()
    }

    /// Access raw bytes.
    #[must_use]
    pub const fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }
}

impl Default for NodeHash {
    fn default() -> Self {
        Self::zero()
    }
}

/// A proof that a specific leaf belongs to the tree with the given root.
#[derive(Clone, Debug)]
#[cfg_attr(feature = "std", derive(serde::Serialize, serde::Deserialize))]
pub struct MerkleProof {
    /// The index of the leaf being proven.
    pub leaf_index: u32,
    /// Sibling hashes from leaf to root.
    /// Each entry is (hash, is_right) — the sibling hash and whether it's on the right side.
    pub siblings: Vec<(NodeHash, bool)>,
    /// The root hash this proof is against.
    pub root: NodeHash,
}

impl MerkleProof {
    /// Verify that a leaf hash is included in the tree.
    ///
    /// # Arguments
    /// * `leaf_hash` - The hash of the leaf data
    ///
    /// # Returns
    /// `true` if the proof is valid, `false` otherwise.
    #[must_use]
    pub fn verify(&self, leaf_hash: &NodeHash) -> bool {
        let mut current = *leaf_hash;
        for (sibling, is_right) in &self.siblings {
            current = if *is_right {
                // Current is on the right, sibling is on the left
                NodeHash::combine(sibling, &current)
            } else {
                // Current is on the left, sibling is on the right
                NodeHash::combine(&current, sibling)
            };
        }
        current == self.root
    }
}

/// Merkle tree for batch commitment of game-state snapshots.
///
/// Supports up to 2^32 leaves. Uses iterative construction for
/// stack-friendly memory usage.
pub struct MerkleTree {
    /// All leaf hashes, in insertion order.
    leaves: Vec<NodeHash>,
    /// Cached root hash. Invalidated on insert.
    root: Option<NodeHash>,
    /// The depth of the tree (number of layers above leaves).
    depth: u32,
}

impl MerkleTree {
    /// Create a new empty Merkle tree.
    #[must_use]
    pub fn new() -> Self {
        Self {
            leaves: Vec::new(),
            root: None,
            depth: 0,
        }
    }

    /// Create a Merkle tree with pre-allocated capacity.
    #[must_use]
    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            leaves: Vec::with_capacity(capacity),
            root: None,
            depth: 0,
        }
    }

    /// Number of leaves in the tree.
    #[must_use]
    pub fn len(&self) -> usize {
        self.leaves.len()
    }

    /// Whether the tree is empty.
    #[must_use]
    pub fn is_empty(&self) -> bool {
        self.leaves.is_empty()
    }

    /// Append a leaf hash to the tree.
    pub fn push(&mut self, hash: NodeHash) {
        self.leaves.push(hash);
        self.root = None; // Invalidate cache
        let n = self.leaves.len();
        if n > 1 {
            let bits = usize::BITS - n.leading_zeros();
            if bits > self.depth {
                self.depth = bits;
            }
        }
    }

    /// Compute the root hash of the tree.
    ///
    /// Uses iterative bottom-up computation. Pads incomplete levels
    /// with zero hashes.
    #[must_use]
    pub fn root(&mut self) -> NodeHash {
        if let Some(root) = self.root {
            return root;
        }

        if self.leaves.is_empty() {
            return NodeHash::zero();
        }

        if self.leaves.len() == 1 {
            self.root = Some(self.leaves[0]);
            return self.leaves[0];
        }

        // Build tree layer by layer
        let mut current_level = self.leaves.clone();
        while current_level.len() > 1 {
            let mut next_level = Vec::with_capacity((current_level.len() + 1) / 2);
            let mut i = 0;
            while i < current_level.len() {
                let left = &current_level[i];
                let right = if i + 1 < current_level.len() {
                    &current_level[i + 1]
                } else {
                    &NodeHash::zero()
                };
                next_level.push(NodeHash::combine(left, right));
                i += 2;
            }
            current_level = next_level;
        }

        let root = current_level[0];
        self.root = Some(root);
        root
    }

    /// Generate a Merkle proof for the leaf at the given index.
    ///
    /// # Panics
    /// Panics if the index is out of bounds.
    #[must_use]
    pub fn proof(&mut self, leaf_index: usize) -> MerkleProof {
        assert!(leaf_index < self.leaves.len(), "Leaf index out of bounds");

        let root = self.root();
        let mut siblings = Vec::new();
        let mut current_level = self.leaves.clone();
        let mut idx = leaf_index;

        while current_level.len() > 1 {
            let sibling_idx = if idx % 2 == 0 { idx + 1 } else { idx - 1 };
            let is_right = idx % 2 == 1;
            let sibling = if sibling_idx < current_level.len() {
                current_level[sibling_idx]
            } else {
                NodeHash::zero()
            };
            siblings.push((sibling, is_right));

            // Build next level
            let mut next_level = Vec::with_capacity((current_level.len() + 1) / 2);
            let mut i = 0;
            while i < current_level.len() {
                let left = &current_level[i];
                let right = if i + 1 < current_level.len() {
                    &current_level[i + 1]
                } else {
                    &NodeHash::zero()
                };
                next_level.push(NodeHash::combine(left, right));
                i += 2;
            }
            idx /= 2;
            current_level = next_level;
        }

        MerkleProof {
            leaf_index: leaf_index as u32,
            siblings,
            root,
        }
    }

    /// Convert the root hash to a ReplayHash.
    #[must_use]
    pub fn root_as_replay_hash(&mut self) -> ReplayHash {
        ReplayHash::from_bytes(self.root().0)
    }
}

impl Default for MerkleTree {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_tree_root_is_zero() {
        let mut tree = MerkleTree::new();
        assert_eq!(tree.root(), NodeHash::zero());
    }

    #[test]
    fn test_single_leaf_root_equals_leaf() {
        let mut tree = MerkleTree::new();
        let leaf = NodeHash::leaf(b"only-leaf");
        tree.push(leaf);
        assert_eq!(tree.root(), leaf);
    }

    #[test]
    fn test_two_leaves_root() {
        let mut tree = MerkleTree::new();
        let a = NodeHash::leaf(b"leaf-a");
        let b = NodeHash::leaf(b"leaf-b");
        tree.push(a);
        tree.push(b);
        let expected = NodeHash::combine(&a, &b);
        assert_eq!(tree.root(), expected);
    }

    #[test]
    fn test_three_leaves_deterministic() {
        let mut tree1 = MerkleTree::new();
        let mut tree2 = MerkleTree::new();
        for data in [b"a", b"b", b"c"] {
            let h = NodeHash::leaf(data);
            tree1.push(h);
            tree2.push(h);
        }
        assert_eq!(tree1.root(), tree2.root());
    }

    #[test]
    fn test_proof_verification_single_leaf() {
        let mut tree = MerkleTree::new();
        let leaf = NodeHash::leaf(b"only");
        tree.push(leaf);
        let proof = tree.proof(0);
        assert!(proof.verify(&leaf));
    }

    #[test]
    fn test_proof_verification_two_leaves() {
        let mut tree = MerkleTree::new();
        let a = NodeHash::leaf(b"first");
        let b = NodeHash::leaf(b"second");
        tree.push(a);
        tree.push(b);

        let proof_a = tree.proof(0);
        assert!(proof_a.verify(&a));
        assert!(!proof_a.verify(&b)); // Wrong leaf

        let proof_b = tree.proof(1);
        assert!(proof_b.verify(&b));
    }

    #[test]
    fn test_proof_verification_many_leaves() {
        let mut tree = MerkleTree::new();
        let leaves: Vec<NodeHash> = (0..8u32)
            .map(|i| NodeHash::leaf(&i.to_le_bytes()))
            .collect();

        for &leaf in &leaves {
            tree.push(leaf);
        }

        for (i, leaf) in leaves.iter().enumerate() {
            let proof = tree.proof(i);
            assert!(proof.verify(leaf), "Proof for leaf {} failed", i);
        }
    }

    #[test]
    fn test_proof_fails_on_wrong_root() {
        let mut tree = MerkleTree::new();
        let leaf = NodeHash::leaf(b"real");
        tree.push(leaf);
        let mut proof = tree.proof(0);
        proof.root = NodeHash::leaf(b"fake-root");
        assert!(!proof.verify(&leaf));
    }

    #[test]
    fn test_proof_fails_on_tampered_leaf() {
        let mut tree = MerkleTree::new();
        let real = NodeHash::leaf(b"real-leaf");
        let fake = NodeHash::leaf(b"fake-leaf");
        tree.push(real);
        let proof = tree.proof(0);
        assert!(!proof.verify(&fake));
    }

    #[test]
    fn test_root_cached_after_computation() {
        let mut tree = MerkleTree::new();
        tree.push(NodeHash::leaf(b"a"));
        tree.push(NodeHash::leaf(b"b"));
        let r1 = tree.root();
        let r2 = tree.root();
        assert_eq!(r1, r2);
    }

    #[test]
    fn test_root_invalidated_on_push() {
        let mut tree = MerkleTree::new();
        tree.push(NodeHash::leaf(b"a"));
        let r1 = tree.root();
        tree.push(NodeHash::leaf(b"b"));
        let r2 = tree.root();
        assert_ne!(r1, r2);
    }

    #[test]
    fn test_with_capacity() {
        let tree = MerkleTree::with_capacity(100);
        assert_eq!(tree.len(), 0);
    }

    #[test]
    fn test_root_as_replay_hash() {
        let mut tree = MerkleTree::new();
        tree.push(NodeHash::leaf(b"snapshot-1"));
        tree.push(NodeHash::leaf(b"snapshot-2"));
        let hash = tree.root_as_replay_hash();
        assert!(!hash.is_zero());
    }

    #[test]
    fn test_large_tree_proof() {
        let mut tree = MerkleTree::with_capacity(128);
        let leaves: Vec<NodeHash> = (0..64u32)
            .map(|i| NodeHash::leaf(&i.to_le_bytes()))
            .collect();
        for &leaf in &leaves {
            tree.push(leaf);
        }
        // Verify all proofs
        for (i, leaf) in leaves.iter().enumerate() {
            let proof = tree.proof(i);
            assert!(proof.verify(leaf), "Failed for leaf {}", i);
        }
    }
}
