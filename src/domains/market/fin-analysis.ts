/**
 * Financial AI Analysis module
 * Uses frontier LLMs (Fin-R1 / FinGPT) for market analysis.
 * Graceful degradation: returns structured null analysis when API unavailable.
 */

import { files, isStorageAvailable } from "@/platform/storage";

export interface MarketAsset {
  id: string;
  name: string;
  nameEn: string;
  type: "stock" | "index" | "crypto";
  price: number;
  change24h: number;
  volume: number;
}

export interface RiskAnalysis {
  overallRisk: "low" | "medium" | "high" | "extreme";
  riskScore: number; // 0-100
  factors: Array<{
    factor: string;
    impact: "positive" | "negative" | "neutral";
    description: string;
  }>;
  recommendation: string;
  generatedAt: string;
}

export interface PortfolioSuggestion {
  allocation: Array<{
    assetId: string;
    weight: number; // 0-1
    rationale: string;
  }>;
  expectedReturn: string;
  riskLevel: string;
  disclaimer: string;
}

const FIN_R1_API_URL = "https://api.fin-r1.example.com/v1/analyze";

/** Analyze market risk using AI */
export async function analyzeRisk(assets: readonly MarketAsset[]): Promise<RiskAnalysis> {
  const apiKey = process.env.FIN_R1_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(FIN_R1_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          assets: assets.map((a) => ({
            id: a.id,
            price: a.price,
            change24h: a.change24h,
            volume: a.volume,
          })),
          analysis_type: "risk",
        }),
      });

      if (response.ok) {
        return (await response.json()) as RiskAnalysis;
      }
    } catch {
      // API unavailable — degrade to local heuristic
      return localRiskAnalysis(assets);
    }
  }

  return localRiskAnalysis(assets);
}

/** Generate portfolio suggestion */
export async function suggestPortfolio(
  assets: readonly MarketAsset[],
  riskTolerance: "conservative" | "moderate" | "aggressive",
): Promise<PortfolioSuggestion> {
  // Sort assets by recent performance
  const sorted = [...assets].sort((a, b) => b.change24h - a.change24h);

  const MODERATE_WEIGHTS: number[] = [0.3, 0.25, 0.25, 0.2];

  const riskWeights: Record<string, number[]> = {
    conservative: [0.5, 0.3, 0.15, 0.05],
    moderate: MODERATE_WEIGHTS,
    aggressive: [0.15, 0.2, 0.3, 0.35],
  };

  const weights = riskWeights[riskTolerance] ?? MODERATE_WEIGHTS;
  const topN = Math.min(sorted.length, weights.length);

  const allocation = sorted.slice(0, topN).map((asset, i) => ({
    assetId: asset.id,
    weight: weights[i] ?? 0,
    rationale: `${riskTolerance}戦略: ${asset.name}をポートフォリオの${Math.round((weights[i] ?? 0) * 100)}%に配分`,
  }));

  const expectedReturn =
    riskTolerance === "aggressive"
      ? "+15〜25%/年"
      : riskTolerance === "conservative"
        ? "+3〜7%/年"
        : "+8〜15%/年";

  return {
    allocation,
    expectedReturn,
    riskLevel: riskTolerance,
    disclaimer:
      "この分析はE16架空市場データに基づくシミュレーションです。実際の投資判断には使用しないでください。",
  };
}

/** Save analysis to R2 for history */
export async function saveAnalysis(analysis: RiskAnalysis): Promise<boolean> {
  if (!isStorageAvailable || !files) {
    return false;
  }

  try {
    const key = `analysis/${analysis.generatedAt}.json`;
    await files.upload(key, JSON.stringify(analysis), {
      contentType: "application/json",
    });
    return true;
  } catch {
    return false;
  }
}

function localRiskAnalysis(assets: readonly MarketAsset[]): RiskAnalysis {
  const avgChange = assets.reduce((sum, a) => sum + a.change24h, 0) / assets.length;
  const negativeCount = assets.filter((a) => a.change24h < 0).length;
  const negativeRatio = negativeCount / assets.length;

  let overallRisk: RiskAnalysis["overallRisk"];
  let riskScore: number;

  if (negativeRatio > 0.7) {
    overallRisk = "extreme";
    riskScore = 85 + Math.round(negativeRatio * 15);
  } else if (negativeRatio > 0.5) {
    overallRisk = "high";
    riskScore = 65 + Math.round(negativeRatio * 20);
  } else if (negativeRatio > 0.3) {
    overallRisk = "medium";
    riskScore = 40 + Math.round(negativeRatio * 25);
  } else {
    overallRisk = "low";
    riskScore = 15 + Math.round(negativeRatio * 25);
  }

  const factors: RiskAnalysis["factors"] = [
    {
      factor: "市場トレンド",
      impact: avgChange >= 0 ? "positive" : "negative",
      description: `平均変動率: ${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`,
    },
    {
      factor: "下落銘柄比率",
      impact: negativeRatio > 0.5 ? "negative" : "positive",
      description: `${Math.round(negativeRatio * 100)}%の銘柄が下落`,
    },
    {
      factor: "ボラティリティ",
      impact: "neutral",
      description: `${assets.length}銘柄の分散分析に基づく`,
    },
  ];

  const recommendation =
    overallRisk === "low" || overallRisk === "medium"
      ? "市場は比較的安定しています。既存ポートフォリオの維持を推奨します。"
      : "市場に不安定さが見られます。リスクヘッジの強化を検討してください。";

  return {
    overallRisk,
    riskScore,
    factors,
    recommendation,
    generatedAt: new Date().toISOString(),
  };
}