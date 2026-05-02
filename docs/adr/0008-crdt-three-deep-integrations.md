# ADR-0008: CRDT as Substrate for Three Deep Multi-User Integrations

**Status**: Accepted
**Date**: 2026-05-03
**Phase**: θ (Epoch 13)
**Decision Makers**: gentaron

## Context

Phase θ introduces real-time multi-user collaboration to EDU via Automerge, a Conflict-free Replicated Data Type (CRDT) library. The CRDT substrate must support three deep integration surfaces:

1. **Deck cross-device sync** — Players build and modify decks on multiple devices (mobile, desktop) with automatic convergence.
2. **Replay annotations** — Spectators add time-stamped annotations to battle replays, merging concurrent contributions from multiple observers.
3. **Lore wiki collaborative editing** — Community members co-edit wiki pages (canon entries, character profiles, timeline events) with conflict-free merging.
4. **Moderation queue** — Contributions flow through a review pipeline before entering the AURALIS canon.

The system must work offline-first: edits made while disconnected must merge cleanly upon reconnection. This rules out traditional client-server approaches that require a persistent connection.

## Decision

### Primary: Automerge over Yjs

We adopt **Automerge** as the CRDT substrate, specifically via the `edu-crdt-bridge` Rust crate wrapping `automerge-wasm` for browser integration.

#### Evaluation Criteria

| Criterion                | Automerge                                      | Yjs                                              |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------ |
| **History preservation** | Full change history by default                 | History requires y-protocols plugins             |
| **Formal-methods coherence** | Operational transform → well-studied algebra | Yjs uses delete sets; less formally characterized |
| **Binary format**        | Compact, designed for transport                | Comparable                                       |
| **Rust support**         | `automerge` crate (native Rust)                | No first-party Rust binding                      |
| **Offline-first**        | Designed for offline-first from day one        | Requires additional adapter layer                |
| **Document size**        | Garbage collection built-in                    | GC via y-webroom or manual                       |
| **WASM support**         | `automerge-wasm` (official)                    | Community bindings                              |

#### Why Automerge Wins

1. **Formal-methods alignment**: Automerge's operational transformation model is well-studied in the distributed systems literature. Its algebraic properties (commutativity, associativity, idempotence) map cleanly to the project's existing formal verification infrastructure (Kani proofs, Lean 4 theorems).
2. **Native Rust crate**: `automerge` provides a first-party Rust crate, enabling the `edu-crdt-bridge` to integrate with the existing `crates/` workspace without FFI complexity.
3. **History preservation**: Full change history is a first-class concern — critical for replay annotations where temporal ordering matters.
4. **Load-bearing removal proof**: The `edu-crdt-bridge` crate can be demonstrated as load-bearing via 3-stage removal tests (CRDT types → deck sync → annotation layer).

#### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  edu-crdt-bridge (Rust crate)                                │
│  ├── lib.rs          Bridge trait + sync protocol            │
│  ├── document.rs     Automerge document wrapper              │
│  ├── sync.rs         Sync state machine                      │
│  ├── presence.rs     Observer presence tracking              │
│  └── transport.rs    WebRTC data channel abstraction         │
└────────────┬─────────────────────────────────────────────────┘
             │ automerge-wasm (browser)
┌────────────▼─────────────────────────────────────────────────┐
│  Integration Surfaces                                        │
│  ├── Decks           Cross-device deck sync                  │
│  ├── Replay           Time-stamped annotation merge           │
│  ├── Lore Wiki        Collaborative page editing              │
│  └── Admin            Moderation queue CRDT                   │
└──────────────────────────────────────────────────────────────┘
```

## Deleted Showcase Surfaces

Three candidate surfaces were considered and deliberately **removed** from Phase θ scope:

### 1. `/tournament/[id]/chat` — Live Tournament Chat

**Removed because:**
- Chat is a transient communication channel with no persistent canon value
- CRDTs add overhead (document growth, sync latency) for a use-case better served by ephemeral messaging (WebSocket + in-memory)
- Moderation requirements for real-time chat conflict with the AURALIS canon model
- Would require persistent relay infrastructure (PeerJS TURN servers) with no offline-first benefit

**Alternative**: Chat remains a future consideration for a lightweight WebSocket-based ephemeral channel outside the CRDT substrate.

### 2. `/forge/editor?session=[id]` — Co-Apolon Forge Session

**Removed because:**
- Collaborative Apolon DSL editing requires structural merge (AST-aware), not text-level CRDT merge
- Automerge's text CRDT would produce syntactically invalid `.apo` code when two users edit the same block simultaneously
- The correct solution is operational transformation on the SSA IR level, which is a research-grade problem
- Would undermine the Apolon compiler's compile-time guarantees

**Alternative**: Fork-based collaboration (edit independently → merge via diff/PR) remains the canonical workflow. AST-aware collaborative editing is deferred to a future phase.

### 3. Co-Spectator Reaction Layer

**Removed because:**
- Reactions (emojis, applause) during replay viewing are high-frequency, low-stakes events
- CRDT document growth from reaction accumulation would bloat replay documents unnecessarily
- The use-case doesn't require offline-first — if you're disconnected, you can't see reactions anyway
- Better served by ephemeral PubSub (WebRTC data channel without CRDT overhead)

**Alternative**: Reactions can be implemented as lightweight WebRTC broadcasts with a short TTL, outside the CRDT document model.

## Integration Surfaces

### 1. Decks — Cross-Device Sync

- Each deck is an Automerge document containing card selections, metadata, and timestamps
- Offline edits on mobile merge with desktop state upon reconnection
- Deck version history enables undo and conflict visualization

### 2. Replay Annotations

- Annotations are time-stamped entries in a CRDT list within the replay document
- Multiple spectators can annotate simultaneously without conflicts
- Annotations carry observer identity for attribution

### 3. Lore Wiki — Collaborative Editing

- Wiki pages are CRDT documents with structured fields (title, content, categories, links)
- Fork/PR model: contributors fork a page → edit → submit merge request
- Moderation queue gates canon entry

### 4. Moderation Queue

- Contributions awaiting review are stored in a CRDT set
- Guardian Council (moderators) vote on acceptance/rejection
- CRDT counters track vote tallies with guaranteed convergence

## Consequences

### Positive

- **Offline-first by design**: All three integration surfaces work without network connectivity
- **No single point of failure**: Peer-to-peer sync via WebRTC eliminates server dependency
- **Formal verification alignment**: CRDT algebraic properties (CML) integrate with existing Kani/Lean infrastructure
- **History preservation**: Full change history enables audit trails and undo
- **Load-bearing architecture**: 3-stage removal tests prove CRDT is essential, not ornamental

### Negative

- **COOP-COEP constraints**: SharedArrayBuffer (required for some WASM optimizations) needs `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers — already set in `netlify.toml` from Phase δ
- **Document size management**: CRDT documents grow monotonically without compaction; requires periodic garbage collection
- **PeerJS relay dependency**: WebRTC signaling depends on PeerJS relay servers for NAT traversal

### Risks

| Risk                          | Mitigation                                                          |
| ----------------------------- | ------------------------------------------------------------------- |
| **PeerJS relay stability**    | PeerJS cloud relay is free-tier; production requires self-hosted TURN |
| **Document growth**           | Automerge GC compacts tombstones; benchmark target ≤ 2MB at 1K ops   |
| **SharedArrayBuffer**         | Already configured via COOP-COEP headers (Phase δ)                  |
| **Sync latency**              | Target ≤ 200ms end-to-end; WebRTC data channel typically < 50ms      |
| **Browser compatibility**     | Automerge-wasm targets modern browsers; fallback for older browsers  |

## Metrics

| Metric                       | Target  |
| ---------------------------- | ------- |
| Merge throughput             | ≥ 10K ops/sec |
| Partition recovery           | ≤ 500ms |
| Wiki page sync latency       | ≤ 200ms |
| Annotation merge latency     | ≤ 100ms |
| Document size (1K annotations) | ≤ 2MB  |
| Offline buffer capacity      | 10K changes |
| 3-peer convergence guarantee | Eventual (≤ 5 rounds) |
