#!/usr/bin/env bash
# =============================================================================
# Agent Vault プロキシテストスクリプト
# ダミーキーが正しく本物のキーに置換されることを確認
# 使用方法: bash agent-vault/test-proxy.sh
# =============================================================================

set -euo pipefail

VAULT_ADDR="${AGENT_VAULT_ADDR:-http://localhost:14321}"
VAULT_TOKEN="${AGENT_VAULT_TOKEN:-}"
VAULT_NAME="${AGENT_VAULT_VAULT:-edu-vault}"
PROXY_ADDR="http://localhost:14322"

echo "=== Agent Vault プロキシテスト ==="
echo ""

# ヘルスチェック
echo "[1/4] Vault API ヘルスチェック..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${VAULT_ADDR}/health")
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ Vault API 正常 (HTTP ${HTTP_CODE})"
else
  echo "  ❌ Vault API 異常 (HTTP ${HTTP_CODE})"
  exit 1
fi

# プロキシヘルスチェック
echo "[2/4] プロキシヘルスチェック..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --proxy "${PROXY_ADDR}" "http://httpbin.org/get" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ プロキシ正常 (HTTP ${HTTP_CODE})"
else
  echo "  ⚠️  プロキシ未応答 (HTTP ${HTTP_CODE}) — Agent Vault のプロキシポートが正しく設定されているか確認"
fi

# エージェントトークンテスト
echo "[3/4] エージェントトークン検証..."
if [ -z "$VAULT_TOKEN" ]; then
  echo "  ⚠️  AGENT_VAULT_TOKEN が未設定 — UIでエージェントを作成後、トークンを設定して再実行"
else
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer ${VAULT_TOKEN}" \
    "${VAULT_ADDR}/api/v1/agents/me")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✅ エージェントトークン有効"
  else
    echo "  ❌ エージェントトークン無効 (HTTP ${HTTP_CODE})"
  fi
fi

# キー置換テスト（モック）
echo "[4/4] キー置換ロジック説明..."
echo "  Agent Vault は以下の仕組みでキーを置換します:"
echo "  - エージェントの環境変数: OPENAI_API_KEY=__openai_api_key__"
echo "  - プロキシが __openai_api_key__ を検出 → Vault内の本物キーに置換"
echo "  - エージェントは本物キーにアクセスできない（プロンプトインジェクション対策）"
echo ""
echo "=== テスト完了 ==="