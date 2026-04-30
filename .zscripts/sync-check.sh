#!/bin/bash
# sync-check.sh — edu と edutext/image の整合性チェック
set -euo pipefail

EDU_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EDUTEXT_DIR="$EDU_DIR/../edutext"
IMAGE_DIR="$EDU_DIR/../image"

echo "═══ EDU Repository Sync Check ═══"
echo ""

# ── 1. Wiki entries with images → image repo ──
echo "📋 Checking image references..."
MISSING_IMAGES=0
while IFS= read -r img; do
  if [ -n "$img" ]; then
    if [ ! -f "$IMAGE_DIR/$img" ]; then
      echo "  ❌ MISSING in image/: $img"
      MISSING_IMAGES=$((MISSING_IMAGES + 1))
    fi
  fi
done < <(grep -oP 'image: "https://raw.githubusercontent.com/gentaron/image/main/\K[^"]+' \
  "$EDU_DIR/src/lib/wiki-data/"*.ts 2>/dev/null || true)

while IFS= read -r img; do
  if [ -n "$img" ]; then
    if [ ! -f "$IMAGE_DIR/$img" ]; then
      echo "  ❌ MISSING in image/: $img"
      MISSING_IMAGES=$((MISSING_IMAGES + 1))
    fi
  fi
done < <(grep -oP 'imageUrl: I\("\K[^"]+' \
  "$EDU_DIR/src/lib/card-data/cards.ts" 2>/dev/null || true)

if [ "$MISSING_IMAGES" -eq 0 ]; then
  echo "  ✅ All image references exist in image/ repo"
else
  echo "  ⚠️  $MISSING_IMAGES missing image(s)"
fi

# ── 2. Story file references → edutext repo ──
echo ""
echo "📋 Checking story file references..."
MISSING_STORIES=0
while IFS= read -r fname; do
  if [ -n "$fname" ]; then
    if [ ! -f "$EDUTEXT_DIR/$fname" ]; then
      echo "  ❌ MISSING in edutext/: $fname"
      MISSING_STORIES=$((MISSING_STORIES + 1))
    fi
  fi
done < <(grep -oP 'fileName: "\K[^"]+' "$EDU_DIR/src/lib/stories.ts" 2>/dev/null || true)

while IFS= read -r fname; do
  if [ -n "$fname" ]; then
    if [ ! -f "$EDUTEXT_DIR/$fname" ]; then
      echo "  ❌ MISSING in edutext/: $fname"
      MISSING_STORIES=$((MISSING_STORIES + 1))
    fi
  fi
done < <(grep -oP 'fileNameAlt: "\K[^"]+' "$EDU_DIR/src/lib/stories.ts" 2>/dev/null || true)

if [ "$MISSING_STORIES" -eq 0 ]; then
  echo "  ✅ All story files exist in edutext/ repo"
else
  echo "  ⚠️  $MISSING_STORIES missing story file(s)"
fi

# ── 3. Orphan files in edutext/ (not referenced from edu) ──
echo ""
echo "📋 Checking for orphan files in edutext/..."
if [ -d "$EDUTEXT_DIR" ]; then
  for f in "$EDUTEXT_DIR"/*.txt; do
    fname=$(basename "$f")
    if ! grep -q "$fname" "$EDU_DIR/src/lib/stories.ts" 2>/dev/null; then
      echo "  ⚠️  ORPHAN in edutext/: $fname (not referenced from stories.ts)"
    fi
  done
else
  echo "  ⚠️  edutext/ directory not found at $EDUTEXT_DIR"
fi

# ── 4. Orphan images (not referenced from edu) ──
echo ""
echo "📋 Checking for orphan images in image/..."
if [ -d "$IMAGE_DIR" ]; then
  for f in "$IMAGE_DIR"/*.png; do
    fname=$(basename "$f")
    if ! grep -rq "$fname" "$EDU_DIR/src/" 2>/dev/null; then
      echo "  ⚠️  ORPHAN in image/: $fname (not referenced from edu src)"
    fi
  done
else
  echo "  ⚠️  image/ directory not found at $IMAGE_DIR"
fi

echo ""
echo "═══ Sync check complete ═══"
