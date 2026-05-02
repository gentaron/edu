# Platform Layer

## 役割

共有基盤 — 全ドメイン共通のUIコンポーネント、event-bus、schemas、validators、invariants。

## 通信ルール

- ドメイン間通信は必ず event-bus.ts 経由
- 直接importでのドメイン間依存は禁止
- UIコンポーネントは @/platform/ui/ に配置

## 構成

- event-bus.ts — ドメイン間イベント通信
- navigation.tsx — 共通ナビゲーション
- reveal-section.tsx — RevealSection / RevealGrid / SectionHeader
- page-header.tsx — PageHeader
- motion-provider.tsx — MotionProvider (framer-motion)
- json-ld.tsx — JSON-LD構造化データ
- schemas/ — 共有Zodスキーマ（index.ts barrel, card.schema, wiki.schema, civilization.schema, tech.schema, etc.）
- validators/ — 実行時データ検証関数
- invariants/ — クロスデータ整合性チェック
- ui/ — shadcn/uiベースの共有UIコンポーネント（toast, toaster, badge, accordion）

## 品質ゲート

- event-busのイベント型は必ずtyped（any禁止）
- UIコンポーネントは既存のshadcn/uiパターンに準拠
- Zodスキーマはschemas/index.ts barrelから一括export
