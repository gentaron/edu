import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { saveReplay, loadReplay, listReplays } from "@/domains/battle/replay-storage";
import type { ReplayRecord } from "@/domains/battle/replay-storage";

// Mock storage module so R2 is unavailable
vi.mock("@/platform/storage", () => ({
  files: undefined,
  isStorageAvailable: false,
}));

const makeReplay = (overrides?: Partial<ReplayRecord>): ReplayRecord => ({
  id: "replay-1",
  matchId: "match-abc",
  turnCount: 5,
  winnerId: "player-1",
  playerIds: ["player-1", "player-2"],
  turns: [
    { turnNumber: 1, action: "attack", payload: [10], timestamp: 1000 },
    { turnNumber: 2, action: "defend", payload: [], timestamp: 2000 },
  ],
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("replay-storage (localStorage fallback)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  /* ── saveReplay localStorage fallback ── */
  describe("saveReplay", () => {
    it("saves replay to localStorage when R2 is unavailable", async () => {
      const replay = makeReplay();
      const result = await saveReplay(replay);

      expect(result.storage).toBe("local");
      expect(result.key).toBeUndefined();

      // Verify it was actually stored
      const raw = localStorage.getItem("edu-replay-archive");
      expect(raw).toBeTruthy();
      const stored = JSON.parse(raw ?? "[]") as ReplayRecord[];
      expect(stored).toHaveLength(1);
      expect(stored[0]?.id).toBe("replay-1");
    });

    it("accumulates multiple replays in localStorage", async () => {
      await saveReplay(makeReplay({ id: "replay-1", matchId: "match-1" }));
      await saveReplay(makeReplay({ id: "replay-2", matchId: "match-1" }));

      const raw = localStorage.getItem("edu-replay-archive");
      const stored = JSON.parse(raw ?? "[]") as ReplayRecord[];
      expect(stored).toHaveLength(2);
    });
  });

  /* ── loadReplay returns undefined for missing ── */
  describe("loadReplay", () => {
    it("returns undefined when no replays exist", async () => {
      const result = await loadReplay("match-abc", "replay-1");
      expect(result).toBeUndefined();
    });

    it("returns undefined for non-matching replayId", async () => {
      await saveReplay(makeReplay({ id: "replay-1", matchId: "match-abc" }));

      const result = await loadReplay("match-abc", "nonexistent");
      expect(result).toBeUndefined();
    });

    it("loads the correct replay by matchId and replayId", async () => {
      await saveReplay(makeReplay({ id: "replay-1", matchId: "match-abc" }));
      await saveReplay(makeReplay({ id: "replay-2", matchId: "match-xyz" }));

      const result = await loadReplay("match-xyz", "replay-2");
      expect(result).toBeDefined();
      expect(result?.id).toBe("replay-2");
      expect(result?.matchId).toBe("match-xyz");
    });
  });

  /* ── listReplays filters by matchId ── */
  describe("listReplays", () => {
    it("returns empty array for no replays", async () => {
      const result = await listReplays("match-abc");
      expect(result).toEqual([]);
    });

    it("filters replays by matchId", async () => {
      await saveReplay(makeReplay({ id: "r1", matchId: "match-abc" }));
      await saveReplay(makeReplay({ id: "r2", matchId: "match-abc" }));
      await saveReplay(makeReplay({ id: "r3", matchId: "match-xyz" }));

      const result = await listReplays("match-abc");
      expect(result).toHaveLength(2);
      for (const replay of result) {
        expect(replay.matchId).toBe("match-abc");
      }
    });

    it("returns all replays when all share the same matchId", async () => {
      await saveReplay(makeReplay({ id: "r1", matchId: "match-abc" }));
      await saveReplay(makeReplay({ id: "r2", matchId: "match-abc" }));

      const result = await listReplays("match-abc");
      expect(result).toHaveLength(2);
    });
  });
});