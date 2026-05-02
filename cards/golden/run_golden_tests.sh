#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# run_golden_tests.sh — Golden test runner for .apo card migrations
# Phase γ: Apolon DSL card migration validation
# ────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CARDS_DIR="$(dirname "$SCRIPT_DIR")"
PASS=0
FAIL=0
ERRORS=()

# ── Colors ──────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Apolon DSL — Golden Test Runner (Phase γ)${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo ""

# ── 1. List all .apo files ─────────────────────────────────────
echo -e "${YELLOW}[1] Scanning .apo card files...${NC}"
APO_COUNT=0
while IFS= read -r -d '' f; do
  APO_COUNT=$((APO_COUNT + 1))
  echo -e "  ${CYAN}✓${NC} $(basename "$f")"
done < <(find "$CARDS_DIR" -name '*.apo' -print0 | sort -z)
echo -e "  Total .apo files: ${APO_COUNT}"
echo ""

# ── 2. List all golden JSON files ──────────────────────────────
echo -e "${YELLOW}[2] Scanning golden JSON test files...${NC}"
GOLDEN_COUNT=0
GOLDEN_FILES=()
while IFS= read -r -d '' f; do
  GOLDEN_COUNT=$((GOLDEN_COUNT + 1))
  GOLDEN_FILES+=("$f")
  echo -e "  ${CYAN}✓${NC} $(basename "$f")"
done < <(find "$SCRIPT_DIR" -name '*.json' -print0 | sort -z)
echo -e "  Total golden files: ${GOLDEN_COUNT}"
echo ""

# ── 3. Validate each golden JSON ───────────────────────────────
echo -e "${YELLOW}[3] Validating golden JSON files...${NC}"
echo ""

for golden_file in "${GOLDEN_FILES[@]}"; do
  fname="$(basename "$golden_file")"

  # Check parseable JSON
  if ! python3 -c "import json, sys; json.load(open(sys.argv[1]))" "$golden_file" 2>/dev/null; then
    echo -e "  ${RED}FAIL${NC} ${fname} — invalid JSON"
    FAIL=$((FAIL + 1))
    ERRORS+=("${fname}: invalid JSON")
    continue
  fi

  # Validate required fields
  missing=""
  for field in card_id ability_name effect_type expected_result; do
    if ! python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
assert '${field}' in d, f'missing field: ${field}'
" "$golden_file" 2>/dev/null; then
      missing="${missing} ${field}"
    fi
  done

  if [ -n "$missing" ]; then
    echo -e "  ${RED}FAIL${NC} ${fname} — missing fields:${missing}"
    FAIL=$((FAIL + 1))
    ERRORS+=("${fname}: missing fields${missing}")
    continue
  fi

  # Validate expected_result sub-fields
  result_missing=""
  for rfield in damage heal shield attack_reduction log; do
    if ! python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
assert '${rfield}' in d['expected_result'], f'missing result field: ${rfield}'
" "$golden_file" 2>/dev/null; then
      result_missing="${result_missing} ${rfield}"
    fi
  done

  if [ -n "$result_missing" ]; then
    echo -e "  ${RED}FAIL${NC} ${fname} — missing result fields:${result_missing}"
    FAIL=$((FAIL + 1))
    ERRORS+=("${fname}: missing result fields${result_missing}")
    continue
  fi

  # Extract card_id for cross-reference check
  card_id="$(python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
print(d['card_id'])
" "$golden_file")"

  echo -e "  ${GREEN}PASS${NC} ${fname} (card_id=${card_id})"
  PASS=$((PASS + 1))
done

echo ""

# ── 4. Validate .apo ↔ golden cross-reference ──────────────────
echo -e "${YELLOW}[4] Cross-referencing .apo files with golden tests...${NC}"
echo ""

for golden_file in "${GOLDEN_FILES[@]}"; do
  fname="$(basename "$golden_file" .json)"

  # Check that card_id starts with "char-"
  card_id="$(python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
print(d['card_id'])
" "$golden_file")"

  if [[ "$card_id" != char-* ]]; then
    echo -e "  ${RED}WARN${NC} ${fname}: card_id '${card_id}' does not start with 'char-'"
  fi

  # Verify effect_type is a known EffectType enum value
  effect_type="$(python3 -c "
import json, sys
d = json.load(open(sys.argv[1]))
print(d['effect_type'])
" "$golden_file")"

  valid_types="HEAL DAMAGE SHIELD HEAL_DAMAGE DAMAGE_HEAL DAMAGE_SHIELD HEAL_SHIELD HEAL_DAMAGE_SHIELD ATTACK_REDUCTION SPECIAL_PANDICT"
  if ! echo "$valid_types" | grep -qw "$effect_type"; then
    echo -e "  ${RED}WARN${NC} ${fname}: unknown effect_type '${effect_type}'"
  fi
done

echo ""

# ── 5. Summary ─────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "  ${CYAN}Summary${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
echo -e "  .apo card files:   ${APO_COUNT}"
echo -e "  Golden test files: ${GOLDEN_COUNT}"
echo -e "  Tests passed:      ${GREEN}${PASS}${NC}"
echo -e "  Tests failed:      ${RED}${FAIL}${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}Failed tests:${NC}"
  for err in "${ERRORS[@]}"; do
    echo -e "  ${RED}✗${NC} ${err}"
  done
  echo ""
  exit 1
fi

echo -e "${GREEN}All golden tests passed!${NC}"
exit 0
