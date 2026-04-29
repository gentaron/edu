import { getEntityById, getRelationsForEntity } from "@/lib/relation-data"

/* ── Gemini AI 解析: システムプロンプト ── */

export const SYSTEM_PROMPT = `あなたは「Eternal Dominion Universe (EDU)」というSF宇宙の専門分析AIです。
EDUは以下の特徴を持つ架空のSF世界です：

## 世界観概要
- E0年を起点とする独自の紀年法（東暦）を持つ
- E16連星系を中心に、シンフォニー・オブ・スターズ銀河に複数の文明圏が存在
- 現代はE520年代、銀河系コンソーシアムによる宇宙規模の統合ガバナンスが進行中

## 分析指示
選択されたエンティティ（キャラクター、組織、文明）間の関係を分析してください。
以下の点に焦点を当ててください：
1. **権力構造**: 組織内の指導体制と権力の流れ
2. **歴史的経緯**: 過去の出来事が現在の関係にどう影響しているか
3. **勢力力学**: 同盟・対立の構図とその原因
4. **個人的つながり**: キャラクター間の信頼・対抗関係
5. **未来への影響**: 現在の関係がEDUの未来にどう影響するか

## 出力形式
日本語で、以下の構造で出力してください：

## 分析概要
（全体の要約）

## 関係ネットワーク
（エンティティ間の関係を整理）

## 権力動態
（力関係と影響力の分析）

## 歴史的文脈
（歴史的背景と展開）

## 今後の展望
（将来の展開予測）

※ 提供されたデータに基づき、推測が含まれる場合は「推測」と明記してください。
※ EDUの公式設定に基づいた分析を行ってください。`

/* ── 分析プロンプト構築 ── */

export function buildAnalysisPrompt(entityIds: string[]): string {
  const entityInfos: string[] = []
  const relationInfos: string[] = []

  for (const id of entityIds) {
    const entity = getEntityById(id)
    if (!entity) continue

    let info = `### ${entity.name}${entity.nameEn ? ` (${entity.nameEn})` : ""}\n`
    info += `- カテゴリ: ${entity.category}\n`
    if (entity.tier) info += `- Tier: ${entity.tier}\n`
    if (entity.era) info += `- 時代: ${entity.era}\n`
    info += `- 概要: ${entity.description.substring(0, 400)}\n`

    const relations = getRelationsForEntity(id)
    if (relations.length > 0) {
      info += `- 関連 (${relations.length}件):\n`
      for (const r of relations.slice(0, 10)) {
        info += `  - [${r.edge.type}] ${r.node.name}: ${r.edge.description}\n`
      }
    }

    entityInfos.push(info)

    for (const r of relations.slice(0, 5)) {
      if (!entityIds.includes(r.node.id)) {
        const rel = getEntityById(r.node.id)
        if (rel) {
          relationInfos.push(`${rel.name}: ${rel.description.substring(0, 200)}`)
        }
      }
    }
  }

  let prompt = `以下のEDUエンティティの関係を分析してください：\n\n`
  prompt += entityInfos.join("\n\n")

  if (relationInfos.length > 0) {
    prompt += `\n\n## 関連する他エンティティ情報\n${relationInfos.join("\n")}`
  }

  prompt += `\n\n上記の情報に基づき、エンティティ間の関係構造・権力動態・歴史的背景を分析してください。`
  return prompt
}

/* ── Gemini API 直接呼び出し ── */

export async function callGeminiDirect(userPrompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) throw new Error("Gemini APIキーが設定されていません")

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(60000),
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error")
    throw new Error(`Gemini API エラー (${res.status}): ${errText.substring(0, 200)}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("Gemini APIから空のレスポンスが返されました")
  return text
}
