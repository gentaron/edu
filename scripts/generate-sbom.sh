#!/usr/bin/env bash
# generate-sbom.sh — Software Bill of Materials generator
# Phase η — Research-grade supply chain transparency
#
# Generates:
#   - CycloneDX JSON for Rust crates (via cargo-cyclonedx or manual)
#   - SPDX JSON for the entire project
#
# Usage:
#   ./scripts/generate-sbom.sh              # Generate to sbom/
#   ./scripts/generate-sbom.sh --check      # Verify SBOMs exist and are recent

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/sbom"
CRATES_DIR="$PROJECT_ROOT/crates"

mkdir -p "$OUTPUT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[sbom]${NC} $*"; }
warn()  { echo -e "${YELLOW}[sbom]${NC} $*"; }
error() { echo -e "${RED}[sbom]${NC} $*"; }

# ── CycloneDX for Rust ─────────────────────────────────────────
generate_cyclonedx() {
    info "Generating CycloneDX SBOM for Rust workspace..."

    if command -v cargo-cyclonedx &>/dev/null; then
        # Use cargo-cyclonedx if available
        (cd "$CRATES_DIR" && cargo cyclonedx json \
            --output-file "$OUTPUT_DIR/rust-cyclonedx.json" \
            --all-features \
            --workspace 2>/dev/null)
        info "  Generated via cargo-cyclonedx → sbom/rust-cyclonedx.json"
    else
        warn "  cargo-cyclonedx not found; generating manual CycloneDX JSON..."
        generate_manual_cyclonedx
    fi
}

generate_manual_cyclonedx() {
    local TIMESTAMP
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local PROJECT_VERSION
    PROJECT_VERSION=$(cd "$CRATES_DIR" && grep -m1 '^version' edu-engine-core/Cargo.toml 2>/dev/null | awk -F'"' '{print $2}' || echo "0.1.0")

    cat > "$OUTPUT_DIR/rust-cyclonedx.json" << CYCLONEDX_EOF
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.6",
  "serialNumber": "urn:uuid:$(uuidgen 2>/dev/null || echo 'pending')",
  "version": 1,
  "metadata": {
    "timestamp": "${TIMESTAMP}",
    "tools": [
      {
        "name": "generate-sbom.sh",
        "version": "1.0.0"
      }
    ],
    "component": {
      "type": "application",
      "name": "edu-engine",
      "version": "${PROJECT_VERSION}",
      "description": "Research-grade Apolon card engine with Lean 4 proofs, PQC, and WASM verifier",
      "purl": "pkg:cargo/edu-engine@${PROJECT_VERSION}"
    }
  },
  "components": [
    {
      "type": "library",
      "name": "edu-engine-core",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-engine-core@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-engine-wasm",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-engine-wasm@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-engine-native",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-engine-native@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-engine-embedded",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-engine-embedded@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-battle-engine",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-battle-engine@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "apolon-compiler",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/apolon-compiler@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-quasi",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-quasi@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-pqc",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-pqc@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-prover",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-prover@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    },
    {
      "type": "library",
      "name": "edu-verifier",
      "version": "${PROJECT_VERSION}",
      "purl": "pkg:cargo/edu-verifier@${PROJECT_VERSION}",
      "properties": [
        {"name": "cdx:language", "value": "rust"}
      ]
    }
  ]
}
CYCLONEDX_EOF
    info "  Generated manual CycloneDX → sbom/rust-cyclonedx.json"
}

# ── SPDX for entire project ────────────────────────────────────
generate_spdx() {
    info "Generating SPDX SBOM for entire project..."

    local TIMESTAMP
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local GIT_SHA
    GIT_SHA=$(git -C "$PROJECT_ROOT" rev-parse HEAD 2>/dev/null || echo "unknown")

    # Collect dependency info from Cargo.lock
    local CRATE_DEPS=""
    if [ -f "$CRATES_DIR/Cargo.lock" ]; then
        # Parse Cargo.lock for direct workspace dependencies
        CRATE_DEPS=$(cd "$CRATES_DIR" && cargo tree --locked --depth 1 --prefix none 2>/dev/null \
            | grep -v '^edu-' | grep -v '^$' | sort -u | head -50)
    fi

    local DEPS_JSON="[]"
    if [ -n "$CRATE_DEPS" ]; then
        DEPS_JSON=$(echo "$CRATE_DEPS" | while read -r dep; do
            [ -z "$dep" ] && continue
            local name version
            name=$(echo "$dep" | awk '{print $1}')
            version=$(echo "$dep" | rg -o '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
            echo "{\"SPDXID\":\"SPDXRef-dep-${name}\",\"name\":\"${name}\",\"downloadLocation\":\"https://crates.io/crates/${name}\",\"versionInfo\":\"${version:-0.0.0}\"}"
        done | jq -s '.')
    fi

    # Count card files
    local CARD_COUNT
    CARD_COUNT=$(find "$PROJECT_ROOT/cards" -name '*.apo' 2>/dev/null | wc -l | tr -d ' ')

    # Count Lean proof files
    local LEAN_COUNT
    LEAN_COUNT=$(find "$PROJECT_ROOT/proofs" -name '*.lean' 2>/dev/null | wc -l | tr -d ' ')

    # Count Rust source files
    local RUST_COUNT
    RUST_COUNT=$(find "$CRATES_DIR" -name '*.rs' 2>/dev/null | wc -l | tr -d ' ')

    jq -n \
        --arg ts "$TIMESTAMP" \
        --arg sha "$GIT_SHA" \
        --argjson deps "$DEPS_JSON" \
        --arg cards "$CARD_COUNT" \
        --arg lean "$LEAN_COUNT" \
        --arg rust "$RUST_COUNT" \
    '{
        "spdxVersion": "SPDX-2.3",
        "dataLicense": "CC0-1.0",
        "SPDXID": "SPDXRef-DOCUMENT",
        "name": "edu-engine",
        "documentNamespace": "urn:uuid:" + ($sha | split("") | map(if test("^[0-9a-f]$") then . else "0" end) | join("") | . + "0000000000000000"),
        "creationInfo": {
            "created": $ts,
            "creators": ["Tool: generate-sbom.sh v1.0.0"],
            "licenseListVersion": "3.24"
        },
        "packages": [
            {
                "SPDXID": "SPDXRef-edu-engine",
                "name": "edu-engine",
                "downloadLocation": "git+https://github.com/gentaron/edu@" + $sha,
                "filesAnalyzed": false,
                "description": "Research-grade Apolon card engine — \($rust) Rust sources, \($lean) Lean 4 proofs, \($cards) .apo cards",
                "originator": "Organization:gentaron",
                "supplier": "Organization:gentaron"
            }
        ] + $deps,
        "relationships": [
            {"spdxElementId": "SPDXRef-DOCUMENT", "relationshipType": "DESCRIBES", "relatedSpdxElement": "SPDXRef-edu-engine"}
        ]
    }' > "$OUTPUT_DIR/project-spdx.json"

    info "  Generated SPDX → sbom/project-spdx.json"
    info "  Stats: $RUST_COUNT Rust files, $LEAN_COUNT Lean proofs, $CARD_COUNT .apo cards"
}

# ── Check mode ─────────────────────────────────────────────────
check_sbom() {
    info "Checking SBOM freshness..."

    local OK=true

    if [ ! -f "$OUTPUT_DIR/rust-cyclonedx.json" ]; then
        error "  sbom/rust-cyclonedx.json missing"
        OK=false
    else
        local AGE=$(( $(date +%s) - $(stat -c %Y "$OUTPUT_DIR/rust-cyclonedx.json" 2>/dev/null || echo 0) ))
        if [ "$AGE" -gt 86400 ]; then
            warn "  sbom/rust-cyclonedx.json is $(( AGE / 3600 ))h old (max 24h)"
            OK=false
        fi
    fi

    if [ ! -f "$OUTPUT_DIR/project-spdx.json" ]; then
        error "  sbom/project-spdx.json missing"
        OK=false
    fi

    if $OK; then
        info "  All SBOMs present and fresh ✓"
        exit 0
    else
        error "  SBOM check failed — run ./scripts/generate-sbom.sh to regenerate"
        exit 1
    fi
}

# ── Main ───────────────────────────────────────────────────────
main() {
    case "${1:-generate}" in
        --check|-c)
            check_sbom
            ;;
        generate|--generate|-g)
            generate_cyclonedx
            generate_spdx
            info "Done. SBOMs written to $OUTPUT_DIR/"
            ;;
        *)
            echo "Usage: $0 [--check|generate]"
            exit 1
            ;;
    esac
}

main "$@"
