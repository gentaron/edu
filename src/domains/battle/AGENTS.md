# Battle ドメイン — バトル専門家

## 境界

- バトルロジック・状態管理・FSM・レンダリングはこのディレクトリ内で完結
- カードデータは `@/domains/cards/cards.repository.ts` から取得
- UIコンポーネントは `app/card-game/` に配置

## FSM遷移

```
idle → deck-building → battle-init → turn-start → ability-select
→ turn-resolve → enemy-turn → phase-transition → battle-end
```

## ルール

- ダメージ計算は全て `battle.engine.ts` の純粋関数
- 副作用なし: (state, action) → newState
- 新敵追加: `battle.data.ts` + `battle.engine.ts` + テスト3つ以上
