#!/bin/bash
# new-entity.sh — 新エンティティ追加時に3リポジトリに必要な変更を出力
set -euo pipefail

TYPE="$1"    # "character" | "organization" | "technology" | "location" | "story"
NAME="$2"    # e.g. "タロウ・ヤマダ"
NAME_EN="$3" # e.g. "TarouYamada"

if [ -z "$TYPE" ] || [ -z "$NAME" ]; then
  echo "Usage: ./new-entity.sh <type> <name> [nameEn]"
  echo "  type: character | organization | technology | location | story"
  exit 1
fi

[ -z "$NAME_EN" ] && NAME_EN="(required)"

echo "═══ New Entity: $TYPE — $NAME ($NAME_EN) ═══"
echo ""

case "$TYPE" in
  character)
    echo "📝 TODO in gentaron/edu:"
    echo "  1. src/lib/wiki-data/characters.ts にWikiEntry追加"
    echo "     { id: \"$NAME_EN\", name: \"$NAME\", nameEn: \"$NAME_EN\", ... }"
    echo ""
    echo "  2. src/lib/card-data/cards.ts にGameCard追加（バトルに出す場合）"
    echo "     imageUrl: I(\"$NAME_EN.png\"),"
    echo ""
    echo "  3. src/lib/relation-data.ts にRelationEdge追加（関係がある場合）"
    echo ""
    echo "🖼️  TODO in gentaron/image:"
    echo "  - $NAME_EN.png を追加（推奨サイズ: 400x400px以上）"
    echo "  - git add $NAME_EN.png && git commit -m \"feat: add $NAME image\""
    echo ""
    echo "📄 TODO in gentaron/edutext (optional):"
    echo "  - $NAME_EN.txt （JP原稿）"
    echo "  - ${NAME_EN}_EN.txt （EN翻訳）"
    echo "  - src/lib/stories.ts にStoryMeta追加"
    ;;
  organization)
    echo "📝 TODO in gentaron/edu:"
    echo "  1. src/lib/wiki-data/terminology-organizations.ts にWikiEntry追加"
    echo "  2. src/lib/relation-data.ts にRelationEdge追加"
    ;;
  technology)
    echo "📝 TODO in gentaron/edu:"
    echo "  1. src/lib/wiki-data/terminology-technology.ts にWikiEntry追加"
    echo "  2. src/lib/tech-data.ts に技術データ追加（ある場合）"
    ;;
  location)
    echo "📝 TODO in gentaron/edu:"
    echo "  1. src/lib/wiki-data/terminology-geography.ts にWikiEntry追加"
    ;;
  story)
    echo "📄 TODO in gentaron/edutext:"
    echo "  - $NAME_EN.txt （JP原稿）"
    echo "  - ${NAME_EN}_EN.txt or ${NAME_EN}_JP.txt （翻訳）"
    echo ""
    echo "📝 TODO in gentaron/edu:"
    echo "  1. src/lib/stories.ts にStoryMeta追加:"
    echo "     { slug: \"$NAME_EN\", fileName: \"$NAME_EN.txt\", ... }"
    echo "  2. relatedEntriesに既存WikiエントリのIDを設定"
    ;;
  *)
    echo "Unknown type: $TYPE"
    echo "Use: character | organization | technology | location | story"
    exit 1
    ;;
esac

echo ""
echo "実行後: bash .zscripts/sync-check.sh で整合性を確認"
