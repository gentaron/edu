# Changelog

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/).

This file was reconstructed from the git history, so entries before `0.2.0` are
coarser than they would have been if written at the time. The project's own
"Epoch" numbering is preserved in the entries because the commit history and
`README.md` both refer to it. Add new entries here going forward.

## [Unreleased]

### Added

- `LICENSE` (MIT). The README linked `[MIT](LICENSE)` and carried an MIT badge, but the
  file did not exist — the link was broken and GitHub could not detect the license.
  This matters more here than in a pure app repo because the Rust crates ship compiled
  WASM binaries, whose redistribution terms were previously undeclared.
- `CONTRIBUTING.md` — per-surface rules (app / crates / cards / wiki / stories / proofs),
  which workflows are merge gates and which are informational, and the two failure modes
  that are invisible in the app build (WASM hash drift, cross-platform non-determinism).
- `SECURITY.md` — private reporting via Security Advisories, plus an attack-surface map
  covering WASM, PQC, ZK soundness, CRDT convergence, and BuildHash provenance.
- `CHANGELOG.md` (this file).
- `.github/dependabot.yml` — weekly updates for **npm, cargo, and github-actions**.
  The 13 Rust crates were previously not covered by any automated dependency updates.
- `.github/workflows/codeql.yml` — CodeQL static analysis for JavaScript/TypeScript on
  push, PR, and weekly. This complements the existing report-only Trivy/Semgrep scan in
  `security.yml`, which is a dependency/secret scanner rather than a dataflow analyser.

## [0.2.0] — 2026-07-01

### Added

- AI Agent Stack integrated into the education environment (`agent-stack/`), with the
  accompanying configuration and scripts.

## [0.1.0] — 2026-06-21

The state of the project at the point CI was consolidated into a single merge gate.

### Added

- **E16 Market** — financial dashboard, price ticker, and daily price updates.
- **E16 timeline system** — 1 day = 1 year real-time progression from E529 onward,
  with 68 narrative events aligned to the canonical timeline.
- **Full EN/JP bilingual support** across all wiki entries (552 entries with
  `descriptionEn`), civilizations, stories, and UI, driven by `LangContext`.
- **22-tool integration** — 12 new tools and 10 upgrades, including RAG fallback,
  skill router, OKLCH anti-slop, PDF export, voice TTS, and Bruno MCP.
- **Apolon compiler** — formal grammar specification, then lexer, parser, AST, and
  error types (spec-first).
- **Quantum / PQC substrate** — `edu-quasi` and `edu-pqc` (ML-KEM / ML-DSA), Qiskit-backed.
- **`no_std` core extraction** — RISC-V bare-metal target, xoshiro256++ RNG, Kani harnesses,
  SIMD module, Creusot/Prusti contracts.
- Scientific performance benchmarks with CI and bundle-size monitoring.
- Cross-repo universe link network in the footer.
- GA4 via `gtag.js`.

### Changed

- CI consolidated into a single merge gate: `bun run build` mirrors the Netlify deploy,
  so green CI means a deployable `main`.
- Images migrated to GitHub-hosted URLs (with local fallbacks restored where
  `raw.githubusercontent` 404'd).
- Physics consistency patch — canonical supplement, corrections ①–⑩.
- Quality bar raised to TypeScript strict with `noUncheckedIndexedAccess`, ESLint
  sonarjs + unicorn, custom local rules, enforced JSDoc, and zod validation at build time
  (499 tests / 56 property-based tests at Epoch 10; 91.72% coverage at Epoch 11).

### Removed

- AI chatbot feature.
- Music generation (ACE-Step) integration.
- Nested `edu` repo and the broken submodule/gitlink references that were failing the
  Netlify deploy.

### Fixed

- `ws` forced to 7.5.11 to resolve CVE-2026-48779.
- Hydration errors — GA4 scripts, JsonLd, and the skip-link moved inside `<body>`.
- Mobile navigation could not scroll and clipped entries.
- Card Battle froze when the "効果" button was clicked.
- Wiki data — `descriptionEn` copy-paste errors, Chinese text mixed into English
  descriptions, A-Registry typos, and inconsistent era notation.
- Apolon compiler — infinite loop bugs, effect annotation ordering, doctests.
