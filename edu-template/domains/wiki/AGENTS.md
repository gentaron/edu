# Wiki Domain

## 役割

百科事典専門家 — EDUプロジェクトの全知識体系を統合管理するドメイン。

## 思想統合ルール

- 各Wikiエントリのdescription末尾には対応する思想地層(D1-D5, L1-L3)のパラグラフが含まれる
- 追記フォーマット: `この[項目名]の根底には、[地層ID]の思想的地層が横たわっている。[2-3文]`
- 8思想地層: D1超未来第一主義, D2安全の監視者, D3国家=株式会社, D4倫理の解除, D5脱人間化, L1防衛的加速主義, L2多元性民主主義, L3第2のゲーム

## データ構造

- wiki.data.ts — 全Wikiエントリの統合barrel (ALL_ENTRIES含む)
- wiki.repository.ts — 検索・取得ロジック
- wiki-search.ts — BM25転置インデックス
- content.repository.ts — timeline, tech, character-detail等のコンテンツデータ

## 品質ゲート

- id/name/nameEnはSF固有名詞（一般名詞禁止）
- description末尾に必ず思想地層パラグラフ
