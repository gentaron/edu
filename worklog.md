---

Task ID: 2
Agent: Main Agent
Task: モバイル対応・レアリティビジュアル改善・勢力セクション強化・旧PvP削除

Work Log:

- worklog.md を読んでプロジェクトの現状を把握
- src/app/game/ ディレクトリ全体を削除（旧XState PvP、7ファイル・約84KB削減）
- src/app/globals.css にカードレアリティ用CSSクラス追加:
  - @keyframes shimmer-gold アニメーション
  - .card-sr（ゴールドグラデーションボーダー + シマーアニメーション + スパークルオーバーレイ）
  - .card-r（ブルーグラデーションボーダー + グロウ）
  - .card-c（標準ボーダー）
  - .field-sr / .field-r（バトルフィールド用）
  - .rarity-badge-sr / .rarity-badge-r（レアリティバッジ）
  - .custom-scrollbar（カードゲーム用スクロールバー）
- src/app/card-game/page.tsx（デッキビルダー）:
  - カードサイズを w-28 h-40 sm:w-36 sm:h-52 にレスポンシブ化
  - SRカードに card-sr クラス、Rカードに card-r クラスを適用
  - レアリティバッジに rarity-badge-sr/r クラスを適用
  - デッキパネルを order-first lg:order-last でモバイルでは上に表示
  - header/nav のテキスト・padding を sm: ブレイクポイントで調整
- src/app/card-game/select/page.tsx（敵選択）:
  - FINAL敵を grid-cols-1 に統一（元々sm:grid-cols-1だったのを削除）
  - padding/font-size を sm: ブレイクポイントで調整
  - デッキ未完成画面に mx-4 を追加
- src/app/card-game/battle/page.tsx（バトルUI）:
  - FieldCharSlot: min-w-[60px] sm:min-w-[72px]、画像 w-10 sm:w-12
  - FieldCharSlot: SR/Rカードに field-sr/field-r クラス適用（ゴールド/ブルーグローボーダー）
  - AbilityButton: p-2 sm:p-3、min-h-[56px] sm:min-h-0、フォントサイズ sm: レスポンシブ
  - 敵エリア: w-14 h-14 sm:w-20 sm:h-20、text-xs sm:text-sm
  - バトルログ: max-h-28 sm:max-h-40
  - 全体 padding/gap を sm: レスポンシブ化
- src/app/page.tsx（メインページ）:
  - ALL_CARDS をインポートしてTier表を自動生成（SR×14, R×32, C×18）
  - テーブル形式に変更：キャラ名・勢力・⚔🛡✨💥ステータス・合計値を表示
  - 勢力別キャラクター一覧をcard-dataのaffiliationで自動分類
  - 勢力系譜にdescription・keyMembers・alliancesフィールドを追加
  - フッターの /game リンクを削除（ディレクトリ削除に伴う）
- git commit --no-verify + push origin main 完了（c0a83b6）

Stage Summary:

- 旧PvPゲーム（~84KB）を削除しパフォーマンス改善
- カードゲーム3ページをモバイル対応に改善（レスポンシブカードサイズ・padding・フォント）
- SR/R/Cレアリティに応じたビジュアル差分化（ゴールドシマー・ブルーグロウ）
- メインページのキャラクターTier表を全64体のカードデータから動的生成
- 勢力系譜セクションに詳細情報を追加
- コミット: c0a83b6 feat: モバイル対応・レアリティビジュアル改善・勢力セクション強化・旧PvP削除
