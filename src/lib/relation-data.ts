/* ═══════════════════════════════════════════════════════════════
   relation-data.ts — 組織・人物相関グラフ構築
   ═══════════════════════════════════════════════════════════════ */

import { ALL_ENTRIES } from "./wiki-data"
import {
  TOP_CIVILIZATIONS,
  OTHER_CIVILIZATIONS,
  HISTORICAL_CIVILIZATIONS,
} from "./civilization-data"
import type { Civilization, RelationNode, RelationEdge } from "@/types"

export type { RelationNode, RelationEdge } from "@/types"

/* ── ノード構築 ── */

function buildNodes(): RelationNode[] {
  const nodes: RelationNode[] = []

  // Wikiエントリからキャラクターと組織を追加
  for (const entry of ALL_ENTRIES) {
    if (entry.category === "キャラクター" || entry.category === "組織") {
      nodes.push({
        id: entry.id,
        name: entry.name,
        nameEn: entry.nameEn,
        category: entry.category as "キャラクター" | "組織",
        tier: entry.tier,
        image: entry.image,
        description: entry.description,
        era: entry.era,
        subCategory: entry.subCategory,
      })
    }
  }

  // 文明データからノードを追加
  const allCivs: Civilization[] = [
    ...TOP_CIVILIZATIONS,
    ...OTHER_CIVILIZATIONS,
    ...HISTORICAL_CIVILIZATIONS,
  ]
  for (const civ of allCivs) {
    nodes.push({
      id: civ.id,
      name: civ.name,
      nameEn: civ.nameEn,
      category: "文明",
      description: civ.description,
      subCategory: civ.isHistorical ? "歴史的文明" : "現行文明",
    })
  }

  return nodes
}

/* ── エッジ構築 ── */

function buildEdges(nodes: RelationNode[]): RelationEdge[] {
  const edges: RelationEdge[] = []
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const nodeByName = new Map<string, RelationNode>()
  for (const n of nodes) {
    nodeByName.set(n.name, n)
    if (n.nameEn) nodeByName.set(n.nameEn, n)
  }

  // ヘルパー: 名前の部分一致でノードを検索
  function findNodeByPartialName(query: string): RelationNode | undefined {
    if (nodeMap.has(query)) return nodeMap.get(query)
    if (nodeByName.has(query)) return nodeByName.get(query)
    // 部分一致
    for (const [name, node] of nodeByName) {
      if (query.includes(name) || name.includes(query)) return node
    }
    return undefined
  }

  // 1) キャラクターの所属 → 組織/文明
  for (const node of nodes) {
    if (node.category !== "キャラクター" || !node.description) continue

    // affiliation文字列から組織・文明を検索
    const affiliations = extractAffiliations(node.description, node.era)
    for (const aff of affiliations) {
      const target = findNodeByPartialName(aff.name)
      if (target && target.id !== node.id) {
        // 重複チェック
        if (
          !edges.some(
            (e) =>
              (e.source === node.id && e.target === target.id) ||
              (e.source === target.id && e.target === node.id)
          )
        ) {
          edges.push({
            source: node.id,
            target: target.id,
            type: "所属",
            description: `${node.name} は ${target.name} に所属`,
          })
        }
      }
    }
  }

  // 2) 組織のleaders[] → キャラクターへの「指導」エッジ
  for (const entry of ALL_ENTRIES) {
    if (!entry.leaders) continue
    const orgNode = nodeMap.get(entry.id)
    if (!orgNode) continue
    for (const leader of entry.leaders) {
      const leaderNode = nodeMap.get(leader.id)
      if (leaderNode) {
        edges.push({
          source: leaderNode.id,
          target: orgNode.id,
          type: "指導",
          description: `${leader.name} — ${leader.role}`,
        })
      }
    }
  }

  // 3) 文明のrelationships[] → エッジ
  const allCivs: Civilization[] = [
    ...TOP_CIVILIZATIONS,
    ...OTHER_CIVILIZATIONS,
    ...HISTORICAL_CIVILIZATIONS,
  ]
  for (const civ of allCivs) {
    for (const rel of civ.relationships) {
      const match = rel.match(/^(.+?)\s*[-—]\s*(.+)$/)
      if (!match) continue
      const targetName = match[1]!.trim()
      const desc = match[2]!.trim()
      const targetNode = findNodeByPartialName(targetName)
      if (targetNode && targetNode.id !== civ.id) {
        const edgeType = detectEdgeType(desc)
        // 重複チェック
        if (
          !edges.some(
            (e) =>
              (e.source === civ.id && e.target === targetNode.id) ||
              (e.source === targetNode.id && e.target === civ.id)
          )
        ) {
          edges.push({
            source: civ.id,
            target: targetNode.id,
            type: edgeType,
            description: `${civ.name} ${desc}`,
          })
        }
      }
    }
  }

  // 4) 記述テキストから他キャラクターへの言及を抽出
  for (const node of nodes) {
    if (node.category !== "キャラクター") continue
    const mentioned = extractMentions(node.description, node.id, nodes)
    for (const m of mentioned) {
      if (
        !edges.some(
          (e) =>
            (e.source === node.id && e.target === m.id) ||
            (e.source === m.id && e.target === node.id)
        )
      ) {
        edges.push({
          source: node.id,
          target: m.id,
          type: "関連",
          description: `${node.name} と ${m.name} の関連`,
        })
      }
    }
  }

  return edges
}

/* ── テキスト解析ヘルパー ── */

function extractAffiliations(description: string, _era?: string): { name: string }[] {
  const results: { name: string }[] = []

  // 既知の組織名パターン
  const orgPatterns = [
    "AURALIS",
    "AURALIS Collective",
    "ZAMLT",
    "シャドウ・リベリオン",
    "テリアン反乱軍",
    "ボグダス・ジャベリン",
    "トリニティ・アライアンス",
    "V7",
    "ヴァーミリオン",
    "シルバー・ヴェノム",
    "アルファ・ヴェノム",
    "ブルーローズ",
    "ミエルテンガ",
    "クロセヴィア",
    "SSレンジ",
    "アイアン・シンジケート",
    "ファールージャ社",
    "グランベル",
    "エレシオン",
    "ティエリア",
    "ファルージャ",
    "ディオクレニス",
    "エレシュ",
    "プロキオ",
    "ロースター",
    "エヴァトロン",
    "Dominion",
    "アポロン文明圏",
    "Selinopolis",
    "Gigapolis",
    "Eros-7",
    "UECO",
    "銀河系コンソーシアム",
    "ヒーローエージェンシー",
    "ネオクラン同盟",
    "シャドウ・ユニオン",
    "コーポラタムパブリカ",
    "テクロサス",
    "テンプル・オブ・ホライゾン",
    "Genesis Vault",
    "リミナル・フォージ",
    "マトリカル・リフォーム運動",
    "ノスタルジア・コロニー",
    "セリアンズ",
  ]

  for (const org of orgPatterns) {
    if (description.includes(org)) {
      results.push({ name: org })
    }
  }

  return results
}

function detectEdgeType(desc: string): "所属" | "指導" | "同盟" | "対立" | "関連" | "歴史的" {
  const lower = desc.toLowerCase()
  if (
    lower.includes("対立") ||
    lower.includes("敵対") ||
    lower.includes("戦争") ||
    lower.includes("反対") ||
    lower.includes("脅威") ||
    lower.includes("阻止")
  )
    return "対立"
  if (
    lower.includes("同盟") ||
    lower.includes("連携") ||
    lower.includes("協力") ||
    lower.includes("提携") ||
    lower.includes("協定") ||
    lower.includes("連携")
  )
    return "同盟"
  if (
    lower.includes("指導") ||
    lower.includes("リーダー") ||
    lower.includes("統治") ||
    lower.includes("率いる")
  )
    return "指導"
  if (
    lower.includes("歴史") ||
    lower.includes("かつて") ||
    lower.includes("崩壊") ||
    lower.includes("戦後")
  )
    return "歴史的"
  return "関連"
}

function extractMentions(
  description: string,
  selfId: string,
  allNodes: RelationNode[]
): RelationNode[] {
  const mentioned: RelationNode[] = []

  // 記述から他のキャラクター名が含まれるかチェック
  for (const node of allNodes) {
    if (node.id === selfId) continue
    if (node.category !== "キャラクター") continue
    if (node.name.length < 3) continue
    if (description.includes(node.name) || (node.nameEn && description.includes(node.nameEn))) {
      mentioned.push(node)
    }
  }

  // 上位5件に制限（主要な言及のみ）
  return mentioned.slice(0, 5)
}

/* ── キャッシュ＆エクスポート ── */

let _nodes: RelationNode[] | null = null
let _edges: RelationEdge[] | null = null

function ensureBuilt() {
  if (!_nodes || !_edges) {
    _nodes = buildNodes()
    _edges = buildEdges(_nodes)
  }
}

export function getRelationNodes(): RelationNode[] {
  ensureBuilt()
  return _nodes!
}

export function getRelationEdges(): RelationEdge[] {
  ensureBuilt()
  return _edges!
}

export function getEntityById(id: string): RelationNode | undefined {
  return getRelationNodes().find((n) => n.id === id)
}

export function getRelationsForEntity(id: string): { node: RelationNode; edge: RelationEdge }[] {
  const edges = getRelationEdges()
  const nodes = getRelationNodes()
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))
  const results: { node: RelationNode; edge: RelationEdge }[] = []

  for (const edge of edges) {
    if (edge.source === id) {
      const target = nodeMap.get(edge.target)
      if (target) results.push({ node: target, edge })
    } else if (edge.target === id) {
      const source = nodeMap.get(edge.source)
      if (source)
        results.push({
          node: source,
          edge: { ...edge, source: edge.target, target: edge.source },
        })
    }
  }

  return results
}
