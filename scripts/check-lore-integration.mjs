// scripts/check-lore-integration.mjs
// Non-blocking CI check that prevents accidental deletion of lore-tech
// integration markers. These are public contract per README §Lore-Tech.
//
// Run: node scripts/check-lore-integration.mjs
// Exit code 0 = all checks pass, 1 = one or more failed.

import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";

let failed = 0;

function check(name, filePath, needle) {
  const text = readFileSync(filePath, "utf8");
  if (!text.includes(needle)) {
    console.error(`✗ ${name}: ${filePath} missing "${needle}"`);
    failed++;
    return false;
  }
  return true;
}

// ── 1. Rust crate Canon Mapping ──
// Only core determinism crates that have Canon Mapping comments.
// edu-engine-wasm, edu-engine-native, edu-engine-embedded, edu-battle-engine
// are adapter crates — they inherit via re-exports, no direct canon needed.
// edu-crdt-bridge and edu-pqc are utility crates without canon headers.
const canonCrates = [
  "edu-engine-core",
  "edu-prover",
  "edu-verifier",
  "edu-quasi",
];

for (const crate of canonCrates) {
  const libPath = join("crates", crate, "src", "lib.rs");
  check("Rust crate Canon Mapping", libPath, "## Canon Mapping (Lore-Tech)");
}

// ── 2. Prover branded type Canon comments ──
const proverTypes = join("crates", "edu-prover", "src", "types.rs");
const canonMarkers = [
  "Canon: **True Name of the Witness**",
  "Canon: **Timeline Fingerprint**",
  "Canon: **Adversarial Seal**",
  "Canon: **Temporal Anchor**",
];
for (const marker of canonMarkers) {
  check("Prover branded type Canon comment", proverTypes, marker);
}

// ── 3. ADR Lore-Tech Mapping ──
// ADRs 0001–0003 have "Lore-Tech Mapping" sections.
const adrDir = "docs/adr";
const adrFiles = readdirSync(adrDir)
  .filter((f) => /^000[1-3]-/.test(f) && f.endsWith(".md"))
  .sort();

for (const adrFile of adrFiles) {
  check("ADR Lore-Tech Mapping", join(adrDir, adrFile), "Lore-Tech Mapping");
}

// ── 4. Lean → Rust load-bearing marker ──
const boundedHp = join("crates", "edu-engine-core", "src", "bounded_hp.rs");
check("Lean-Rust load-bearing marker", boundedHp, "HP_INVARIANT_PROVEN");

// ── 5. Chatbot barrel exports (browser-only contract) ──
const chatbotIndex = join("src", "features", "chatbot", "index.ts");
check(
  "Chatbot barrel exports runtime types",
  chatbotIndex,
  "ChatbotPanel",
);
check(
  "Chatbot barrel exports useChatbot",
  chatbotIndex,
  "useChatbot",
);

// ── Summary ──
if (failed > 0) {
  console.error(`\n${failed} lore-integration check(s) failed`);
  process.exit(1);
}
console.log("✓ All lore-integration checks passed");
