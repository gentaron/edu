# Platform — 共有基盤

## 境界

- 全ドメインが利用する共通コード
- event-bus, shared schemas, UI primitives, navigation
- ドメイン固有のロジックは含めない

## ルール

- 新しいshared型はここに追加
- ドメイン間通信は必ずevent-bus経由
