# Wiki ドメイン — 百科事典専門家

## 境界

- Wikiデータの読み取り・検証・変換・検索はこのディレクトリ内で完結
- 他ドメインは `wiki.repository.ts` の公開APIのみ使用
- UIコンポーネントは `app/wiki/` に配置

## データ形状

```ts
interface WikiEntry {
  id
  name
  nameEn?
  category
  subCategory?
  description
  era?
  affiliation?
  tier?
  image?
  sourceLinks?
  leaders?
}
```

## 編集ルール

- 新項目: idは既存と重複不可 (`validate-data.ts`が検証)
- 画像: `gentaron/image` にPNG追加 → imageフィールドにURL
- 説明文内リンク: `[[id]]` 記法
- Wiki項目名は一般的な名詞を避け、固有名詞としての存在感のある名前に

## テスト

```bash
bun test domains/wiki/
```

## 思想統合ルール (Epoch 9)

各項目のdescription末尾に思想地層パラグラフを追加可能。
闇の地層(D1-D5)と光の地層(L1-L3)の該当するものを関連付ける。
