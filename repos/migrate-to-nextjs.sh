#!/bin/bash
# Migrate a Vite+React repo to Next.js 16 with Edu's timeline + wiki
# Usage: ./migrate-to-nextjs.sh <repo-name> <display-name> <description>

set -e

REPO_DIR="/home/z/my-project/repos/$1"
DISPLAY_NAME="$2"
DESCRIPTION="$3"
SCAFFOLD="/home/z/my-project/edu-scaffold"

if [ -z "$1" ]; then
    echo "Usage: $0 <repo-name> <display-name> <description>"
    exit 1
fi

if [ ! -d "$REPO_DIR" ]; then
    echo "Repo not found: $REPO_DIR"
    exit 1
fi

echo "=== Migrating $1 to Next.js 16 ==="

cd "$REPO_DIR"

# Save original src content for reference
if [ -d src ]; then
    mkdir -p .orig-src
    cp -r src/* .orig-src/ 2>/dev/null || true
fi

# Create Next.js project structure
mkdir -p src/app src/app/timeline src/app/wiki/[id] src/lib src/types src/platform/schemas src/components/ui public

# Copy scaffold files
cp -r "$SCAFFOLD/src/domains" src/domains
cp "$SCAFFOLD/src/lib/timeline-data.ts" src/lib/
cp "$SCAFFOLD/src/lib/lang.ts" src/lib/
cp "$SCAFFOLD/src/lib/use-lang.ts" src/lib/
cp "$SCAFFOLD/src/types/wiki.ts" src/types/
cp "$SCAFFOLD/src/types/card.ts" src/types/
cp "$SCAFFOLD/src/types/civilization.ts" src/types/
cp "$SCAFFOLD/src/platform/lang-toggle.tsx" src/platform/
cp "$SCAFFOLD/src/platform/page-header.tsx" src/platform/
cp "$SCAFFOLD/src/platform/schemas/branded.ts" src/platform/schemas/

# Copy timeline and wiki pages (adapted imports)
cp "$SCAFFOLD/src/app/timeline/page.tsx" src/app/timeline/page.tsx
cp "$SCAFFOLD/src/app/wiki/page.tsx" src/app/wiki/page.tsx
mkdir -p src/app/wiki/[id]/_components
cp "$SCAFFOLD/src/app/wiki/[id]/page.tsx" src/app/wiki/[id]/page.tsx
cp "$SCAFFOLD/src/app/wiki/[id]/_components/wiki-description.tsx" src/app/wiki/[id]/_components/ 2>/dev/null || true

# Copy globals.css
cp "$SCAFFOLD/../edu/src/app/globals.css" src/app/ 2>/dev/null || true

echo "=== Files copied for $1 ==="
find src -name "*.ts" -o -name "*.tsx" -o -name "*.css" | wc -l
