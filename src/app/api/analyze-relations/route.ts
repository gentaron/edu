import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getEntityById, getRelationsForEntity, getRelationNodes } from "@/lib/relation-data"
import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
} from "@/lib/civilization-data"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `あなたは「Eternal Dominion Universe (EDU)」というSF宇宙の専門分析AIです。
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

## 今后の展望
（将来の展開予測）

※ 提供されたデータに基づき、推測が含まれる場合は「推測」と明記してください。
※ EDUの公式設定に基づいた分析を行ってください。`

export async function POST(request: Request) {
  try {
    const { entityIds, query } = await request.json()

    if (!entityIds || !Array.isArray(entityIds) || entityIds.length === 0) {
      return NextResponse.json(
        { error: "entityIds is required and must be a non-empty array" },
        { status: 400 }
      )
    }

    if (entityIds.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 entities can be analyzed at once" },
        { status: 400 }
      )
    }

    // 選択されたエンティティの情報を収集
    const entityInfos: string[] = []
    const relationInfos: string[] = []

    for (const id of entityIds) {
      const entity = getEntityById(id)
      if (!entity) continue

      let info = `### ${entity.name}${entity.nameEn ? ` (${entity.nameEn})` : ""}\n`
      info += `- カテゴリ: ${entity.category}\n`
      if (entity.tier) info += `- Tier: ${entity.tier}\n`
      if (entity.era) info += `- 時代: ${entity.era}\n`
      info += `- 概要: ${entity.description.substring(0, 300)}\n`

      // 関連エンティティ
      const relations = getRelationsForEntity(id)
      if (relations.length > 0) {
        info += `- 関連 (${relations.length}件):\n`
        for (const r of relations.slice(0, 8)) {
          info += `  - [${r.edge.type}] ${r.node.name}: ${r.edge.description}\n`
        }
      }

      entityInfos.push(info)

      // 関連エンティティも情報収集
      for (const r of relations.slice(0, 5)) {
        if (!entityIds.includes(r.node.id)) {
          const rel = getEntityById(r.node.id)
          if (rel) {
            relationInfos.push(`${rel.name}: ${rel.description.substring(0, 150)}`)
          }
        }
      }
    }

    // 文明データの補足情報
    const allCivs = [...TOP_CIVILIZATIONS, ...OTHER_CIVILIZATIONS, ...HISTORICAL_CIVILIZATIONS]
    for (const civ of allCivs) {
      if (entityIds.includes(civ.id)) {
        let civInfo = `### ${civ.name} (${civ.nameEn})\n`
        civInfo += `- 特化分野: ${civ.specialization}\n`
        civInfo += `- 現状: ${civ.currentStatus}\n`
        civInfo += `- 関係:\n`
        for (const rel of civ.relationships) {
          civInfo += `  - ${rel}\n`
        }
        entityInfos.push(civInfo)
      }
    }

    const userPrompt = `以下のEDUエンティティの関係を分析してください：

${entityInfos.join("\n\n")}

${relationInfos.length > 0 ? `\n## 関連する他エンティティ情報\n${relationInfos.join("\n")}` : ""}

${query ? `\n## ユーザーの質問\n${query}` : ""}

上記の情報に基づき、エンティティ間の関係構造・権力動態・歴史的背景を分析してください。`

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    })

    const result = await model.generateContent(userPrompt)
    const analysis = result.response.text()

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Gemini API error:", error)
    return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 500 })
  }
}
