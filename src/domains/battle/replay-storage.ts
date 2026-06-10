/**
 * ZK Replay Archive — stores battle replay data in R2
 * Replay JSONs can be verified later using edu-verifier (Rust ZK proof system).
 * Graceful degradation: falls back to localStorage when R2 unavailable.
 */

import { files, isStorageAvailable } from "@/platform/storage";

export interface ReplayRecord {
  id: string;
  matchId: string;
  turnCount: number;
  winnerId: string;
  playerIds: string[];
  turns: ReadonlyArray<{
    turnNumber: number;
    action: string;
    payload: ReadonlyArray<unknown>;
    timestamp: number;
  }>;
  zkProof?: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = "edu-replay-archive";

/** Save a replay to R2 (or localStorage fallback) */
export async function saveReplay(
  replay: ReplayRecord,
): Promise<{ storage: "r2" | "local"; key?: string }> {
  if (isStorageAvailable && files) {
    try {
      const key = `replays/${replay.matchId}/${replay.id}.json`;
      await files.upload(key, JSON.stringify(replay), {
        contentType: "application/json",
      });
      return { storage: "r2", key };
    } catch {
      // R2 unavailable — degrade to localStorage
      return saveReplayLocal(replay);
    }
  }

  return saveReplayLocal(replay);
}

/** Load a replay from R2 (or localStorage fallback) */
export async function loadReplay(
  matchId: string,
  replayId: string,
): Promise<ReplayRecord | undefined> {
  if (isStorageAvailable && files) {
    try {
      const key = `replays/${matchId}/${replayId}.json`;
      const file = await files.download(key);
      const text = await file.text();
      return JSON.parse(text) as ReplayRecord;
    } catch {
      // R2 unavailable — degrade to localStorage
      return loadReplayLocal(matchId, replayId);
    }
  }

  return loadReplayLocal(matchId, replayId);
}

/** List all replays for a match */
export async function listReplays(matchId: string): Promise<ReplayRecord[]> {
  // TODO: Implement R2 listing when needed
  return getLocalReplays().filter((r) => r.matchId === matchId);
}

function saveReplayLocal(
  replay: ReplayRecord,
): { storage: "local"; key?: undefined } {
  const existing = getLocalReplays();
  existing.push(replay);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  }
  return { storage: "local" };
}

function loadReplayLocal(
  matchId: string,
  replayId: string,
): ReplayRecord | undefined {
  const existing = getLocalReplays();
  return existing.find((r) => r.matchId === matchId && r.id === replayId);
}

function getLocalReplays(): ReplayRecord[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as ReplayRecord[];
  } catch {
    return [];
  }
}