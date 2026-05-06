#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Bundle Size Measurement Script
# Phase 2.5 — Scientific bundle analysis for edu project
# Usage: ./scripts/measure-bundle-size.sh [--json] [--compare]
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/.next"
PUBLIC_DIR="$PROJECT_ROOT/public"
REPORT_FILE="$PROJECT_ROOT/.bundle-report.json"
BASELINE_FILE="$PROJECT_ROOT/.bundle-baseline.json"

OUTPUT_JSON=false
COMPARE=false

for arg in "$@"; do
  case "$arg" in
    --json) OUTPUT_JSON=true ;;
    --compare) COMPARE=true ;;
  esac
done

# ── Build if needed ──────────────────────────────────────────
if [ ! -d "$BUILD_DIR/static/chunks" ]; then
  echo "🔨 Building project..."
  cd "$PROJECT_ROOT" && ANALYZE=false bun run build > /dev/null 2>&1
fi

# ── JS Chunks ────────────────────────────────────────────────
JS_CHUNKS_DIR="$BUILD_DIR/static/chunks"
TOTAL_JS_SIZE=0
LARGEST_CHUNK=""
LARGEST_CHUNK_SIZE=0
CHUNK_COUNT=0

if [ -d "$JS_CHUNKS_DIR" ]; then
  while IFS= read -r -d '' file; do
    size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
    TOTAL_JS_SIZE=$((TOTAL_JS_SIZE + size))
    CHUNK_COUNT=$((CHUNK_COUNT + 1))
    if [ "$size" -gt "$LARGEST_CHUNK_SIZE" ]; then
      LARGEST_CHUNK_SIZE=$size
      LARGEST_CHUNK=$(basename "$file")
    fi
  done < <(find "$JS_CHUNKS_DIR" -name "*.js" -print0 2>/dev/null)
fi

# ── WASM Binary ──────────────────────────────────────────────
WASM_FILE="$PUBLIC_DIR/wasm/edu_battle_engine_bg.wasm"
WASM_SIZE=0
WASM_GZIPPED=0

if [ -f "$WASM_FILE" ]; then
  WASM_SIZE=$(stat -c%s "$WASM_FILE" 2>/dev/null || stat -f%z "$WASM_FILE" 2>/dev/null)
  WASM_GZIPPED=$(gzip -c "$WASM_FILE" | wc -c)
fi

# ── WASM JS Glue ────────────────────────────────────────────
WASM_GLUE="$PUBLIC_DIR/wasm/edu_battle_engine.js"
WASM_GLUE_SIZE=0
if [ -f "$WASM_GLUE" ]; then
  WASM_GLUE_SIZE=$(stat -c%s "$WASM_GLUE" 2>/dev/null || stat -f%z "$WASM_GLUE" 2>/dev/null)
fi

# ── Total Build Size ────────────────────────────────────────
TOTAL_BUILD_SIZE=$(du -sb "$BUILD_DIR" 2>/dev/null | cut -f1)

# ── Top 10 Chunks ───────────────────────────────────────────
TOP_CHUNKS=""
if [ -d "$JS_CHUNKS_DIR" ]; then
  TOP_CHUNKS=$(find "$JS_CHUNKS_DIR" -name "*.js" -exec stat -c%s {} + 2>/dev/null \
    | sort -rn | head -10 | while read size; do
      echo "  $(numfmt --to=iec "$size" 2>/dev/null || echo "${size}B")"
    done)
fi

# ── Output ───────────────────────────────────────────────────
format_bytes() {
  local bytes=$1
  if command -v numfmt &>/dev/null; then
    numfmt --to=iec "$bytes"
  else
    if [ "$bytes" -ge 1048576 ]; then
      echo "$((bytes / 1048576))MB"
    elif [ "$bytes" -ge 1024 ]; then
      echo "$((bytes / 1024))KB"
    else
      echo "${bytes}B"
    fi
  fi
}

if [ "$OUTPUT_JSON" = true ]; then
  cat <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "js_chunks": {
    "count": $CHUNK_COUNT,
    "total_bytes": $TOTAL_JS_SIZE,
    "total_human": "$(format_bytes "$TOTAL_JS_SIZE")",
    "largest_chunk": "$LARGEST_CHUNK",
    "largest_chunk_bytes": $LARGEST_CHUNK_SIZE,
    "largest_chunk_human": "$(format_bytes "$LARGEST_CHUNK_SIZE")"
  },
  "wasm": {
    "binary_bytes": $WASM_SIZE,
    "binary_human": "$(format_bytes "$WASM_SIZE")",
    "binary_gzipped_bytes": $WASM_GZIPPED,
    "binary_gzipped_human": "$(format_bytes "$WASM_GZIPPED")",
    "glue_bytes": $WASM_GLUE_SIZE,
    "glue_human": "$(format_bytes "$WASM_GLUE_SIZE")"
  },
  "build_total_bytes": $TOTAL_BUILD_SIZE,
  "build_total_human": "$(format_bytes "$TOTAL_BUILD_SIZE")"
}
EOF
else
  echo "═══════════════════════════════════════════"
  echo "  📊 edu Bundle Size Report"
  echo "═══════════════════════════════════════════"
  echo ""
  echo "📦 JS Chunks:       $CHUNK_COUNT files, total $(format_bytes "$TOTAL_JS_SIZE")"
  echo "🔴 Largest Chunk:   $LARGEST_CHUNK ($(format_bytes "$LARGEST_CHUNK_SIZE"))"
  echo ""
  echo "🦀 WASM Binary:     $(format_bytes "$WASM_SIZE") (gzipped: $(format_bytes "$WASM_GZIPPED"))"
  echo "📎 WASM Glue (JS):  $(format_bytes "$WASM_GLUE_SIZE")"
  echo ""
  echo "🏗️  Total Build:     $(format_bytes "$TOTAL_BUILD_SIZE")"
  echo ""
  echo "── Top 10 Largest JS Chunks ──"
  echo "$TOP_CHUNKS"
  echo ""
  echo "═══════════════════════════════════════════"
fi

# ── Compare with baseline ────────────────────────────────────
if [ "$COMPARE" = true ] && [ -f "$BASELINE_FILE" ]; then
  echo ""
  echo "── Comparison vs Baseline ──"
  PREV_JS=$(python3 -c "import json; print(json.load(open('$BASELINE_FILE'))['js_chunks']['total_bytes'])" 2>/dev/null || echo "0")
  PREV_WASM=$(python3 -c "import json; print(json.load(open('$BASELINE_FILE'))['wasm']['binary_bytes'])" 2>/dev/null || echo "0")

  if [ "$PREV_JS" -gt 0 ]; then
    JS_DIFF=$((TOTAL_JS_SIZE - PREV_JS))
    JS_PCT=$((JS_DIFF * 100 / PREV_JS))
    echo "  JS Total: $((JS_DIFF > 0 ? "+" : ""))$(format_bytes "$JS_DIFF") ($((JS_PCT > 0 ? "+" : ""))${JS_PCT}%)"
  fi
  if [ "$PREV_WASM" -gt 0 ]; then
    WASM_DIFF=$((WASM_SIZE - PREV_WASM))
    WASM_PCT=$((WASM_DIFF * 100 / PREV_WASM))
    echo "  WASM:     $((WASM_DIFF > 0 ? "+" : ""))$(format_bytes "$WASM_DIFF") ($((WASM_PCT > 0 ? "+" : ""))${WASM_PCT}%)"
  fi
fi

# ── Save current report ─────────────────────────────────────
if [ "$OUTPUT_JSON" = true ]; then
  "$0" --json > "$REPORT_FILE"
fi
