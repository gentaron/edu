/**
 * Real market data feed via Tushare API
 * Fetches real-world market patterns to enhance E16 simulated data.
 * Graceful degradation: returns empty array when API unavailable.
 */

export interface TushareMarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketPattern {
  type: "bullish" | "bearish" | "volatile" | "stable";
  confidence: number;
  description: string;
}

const TUSHARE_API_URL = "https://api.tushare.pro";

/** Fetch real market data from Tushare */
export async function fetchTushareData(
  tsCode: string,
  startDate: string,
  endDate: string,
): Promise<TushareMarketData[]> {
  const apiKey = process.env.TUSHARE_API_KEY;
  if (!apiKey) {
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_name: "daily",
      token: apiKey,
      params: JSON.stringify({ ts_code: tsCode, start_date: startDate, end_date: endDate }),
      fields: JSON.stringify(["trade_date", "open", "high", "low", "close", "vol"]),
    });

    const response = await fetch(`${TUSHARE_API_URL}?${params.toString()}`);
    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      items: Array<{
        trade_date: string;
        open: number;
        high: number;
        low: number;
        close: number;
        vol: number;
      }>;
    };

    return (data.items ?? []).map((item) => ({
      date: item.trade_date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.vol,
    }));
  } catch {
    return [];
  }
}

/** Analyze market pattern from historical data */
export function analyzeMarketPattern(data: readonly TushareMarketData[]): MarketPattern {
  if (data.length < 5) {
    return { type: "stable", confidence: 0, description: "データ不足" };
  }

  const recent = data.slice(-10);
  const closes = recent.map((d) => d.close);

  if (closes.length < 2) {
    return { type: "stable", confidence: 0, description: "データ不足" };
  }

  const first = closes[0] ?? 0;
  const last = closes[closes.length - 1] ?? 0;
  const trend = last > first ? "bullish" : last < first ? "bearish" : "stable";

  // Calculate volatility (standard deviation of daily returns)
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const prev = closes[i - 1];
    const curr = closes[i];
    if (prev !== undefined && curr !== undefined && prev > 0) {
      returns.push((curr - prev) / prev);
    }
  }

  const avgReturn =
    returns.length > 0 ? returns.reduce((s, r) => s + r, 0) / returns.length : 0;
  const variance =
    returns.length > 0
      ? returns.reduce((s, r) => s + (r - avgReturn) ** 2, 0) / returns.length
      : 0;
  const volatility = Math.sqrt(variance);

  const isVolatile = volatility > 0.03;
  const confidence = Math.min(0.95, 0.5 + recent.length * 0.05);

  return {
    type: isVolatile ? "volatile" : trend,
    confidence,
    description: `直近${recent.length}日: トレンド=${trend}, ボラティリティ=${(volatility * 100).toFixed(2)}%`,
  };
}

/** Apply real-world pattern to E16 simulated data */
export function applyRealPatternToE16(
  e16Prices: readonly number[],
  pattern: MarketPattern,
): number[] {
  if (e16Prices.length === 0) {
    return [];
  }

  const factor = pattern.type === "bullish" ? 1.001 : pattern.type === "bearish" ? 0.999 : 1;
  const noiseScale = pattern.type === "volatile" ? 0.02 : 0.005;

  return e16Prices.map((price) => {
    const trend = price * factor;
    const noise = price * (Math.random() - 0.5) * 2 * noiseScale;
    return Math.max(0.01, trend + noise);
  });
}