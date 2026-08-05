# Contributing to EDU

EDU is a multi-language monorepo: a Next.js app, 13 Rust crates (several compiled to WASM),
Lean 4 proofs, and content data. **The contribution rules differ per surface**, so find your
surface below before you start.

Read [AGENTS.md](AGENTS.md) first if you are an AI assistant — it takes priority over this file.

---

## Setup

```bash
bun install          # postinstall runs `prisma generate`
cp .env.example .env # DATABASE_URL at minimum
bun run db:push
bun run dev          # http://localhost:3000
```

Node **>= 22** (see `.nvmrc` and the `engines` field). Rust toolchain is pinned by
`crates/rust-toolchain.toml` — do not override it locally; the WASM hash lock depends on it.

A `flake.nix` is provided if you prefer a reproducible shell (`nix develop`).

## The merge gate

One command decides whether a change is mergeable:

```bash
bun run build   # = validate-data (zod) + tsc + next build
bun run test    # vitest
bun run lint    # eslint (incl. the local rules in eslint-rules/)
```

`bun run build` mirrors the Netlify deploy, so a green `ci.yml` means a deployable `main`.
`.husky/pre-commit` runs `lint-staged` — do not bypass it with `--no-verify`.

The other workflows are **not** merge gates and are informational or scheduled:
`security.yml` (Trivy + Semgrep, report-only), `reproducibility.yml`,
`cross-platform-determinism.yml`, `wasm-hash-lock.yml`, `crdt-convergence.yml`,
`zk-prove-verify.yml`, `balance-gate.yml`, `slsa-provenance.yml`, `api-test.yml`,
`sync-external.yml`.

**If you change a crate, a card, or the CRDT/ZK layers, run the matching workflow locally
before opening a PR.** Those suites exist because the failures they catch are invisible in
the app build: a WASM binary that hashes differently, a battle that resolves differently on
ARM than on x86, replicas that converge to different states.

## Quality standards

These are enforced, not aspirational:

- TypeScript strict mode with `noUncheckedIndexedAccess`
- No `any`, no `eslint-disable` (the local rules in `eslint-rules/` exist to stop both)
- Zod schema validation at build time — data errors fail the build, not the page
- LCP < 1.5s, 60fps battle, < 100KB per-page bundle (`bun run size` to measure)

## Per-surface rules

| Surface         | Where                                                                                                                        | What to run                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Wiki**        | `src/domains/wiki/` (characters, organizations, geography, technology, terms, history)                                       | `bun run build` — zod validation catches malformed entries                                                 |
| **Stories**     | JP/EN `.txt` in [gentaron/edutext](https://github.com/gentaron/edutext), registered in `src/domains/stories/stories.meta.ts` | `bun run build`                                                                                            |
| **Artwork**     | PNG in [gentaron/image](https://github.com/gentaron/image), 400x400px+, PascalCase                                           | —                                                                                                          |
| **Cards**       | `.apo` files in `cards/c/`, `cards/r/`, `cards/sr/`                                                                          | golden tests + `balance-gate.yml`                                                                          |
| **Proofs**      | Lean 4 modules in `proofs/lean/Apolon/`                                                                                      | `zk-prove-verify.yml`                                                                                      |
| **Rust crates** | `crates/*`                                                                                                                   | `cargo test`, `cargo bench` (`bun run bench:rust`), and `wasm-hash-lock.yml` if the crate compiles to WASM |

### Rust and WASM

The 13 crates are the determinism-critical core. Two things break silently if you are careless:

1. **The WASM hash lock.** `wasm-hash-lock.yml` pins the hash of the built WASM binary.
   A toolchain bump, a dependency bump, or a codegen flag change moves the hash. That is
   allowed — but it must be a deliberate, reviewed commit that updates the lock, never a
   drive-by.
2. **Cross-platform determinism.** Floating point, hash iteration order, and
   `HashMap` iteration all differ across targets. The battle engine must resolve identically
   on x86, ARM, and WASM. If you introduce a `HashMap` iteration in engine code, replace it
   with an ordered structure.

Rust dependency updates come through Dependabot's `cargo` ecosystem entry; treat those PRs
as determinism-relevant and let the full workflow set run before merging.

## Commits

Conventional Commits. Allowed types (enforced by `AGENTS.md`):
`feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

```
feat: add E16 market ticker to the root layout
fix: wiki data — correct descriptionEn copy-paste errors
refactor: extract battle resolution into edu-engine-core
test: cover CRDT convergence for concurrent card edits
chore: force ws@7.5.11 to resolve CVE-2026-48779
```

## Pull requests

- Branch off `main`, keep the PR to one surface where possible.
- State which of the non-gate workflows you ran and why.
- If you touched a crate, say whether the WASM hash moved.
- Do not commit `.env`, `dev.log`, `server.log`, or generated `.next/` output.

Security issues: see [SECURITY.md](SECURITY.md) — do not open a public issue.
