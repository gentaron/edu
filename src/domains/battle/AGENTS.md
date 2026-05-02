# Battle Domain

## 役割

バトルエンジン — FSM遷移管理と純粋関数ルールに基づく戦闘ロジック。

## FSM遷移ルール

- battle.fsm.ts — 戦闘状態遷移マシン
- battle.store.ts — クライアント状態管理
- battle.engine.ts — 純粋関数バトルロジック（副作用なし）
- hsm/ — 階層状態機械（HSM）フレームワーク
- canvas/ — Canvas描画ロジック

## 純粋関数ルール

- battle.engine.tsの全関数は純粋関数（入力→出力のみ、副作用なし）
- Canvas描画ロジックは canvas/ に分離
- WASM連携は metal/workers/ 経由

## 品質ゲート

- FSM遷移は必ず型安全（TypeScript discriminated unions）
- ランダム性はseeded RNGのみ使用
