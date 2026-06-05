import { describe, it, expect } from "vitest";
import {
  estimateDifficulty,
  SquillaRouter,
} from "@/platform/skill-router";
import type { TaskDifficulty, SkillTask, SkillResult } from "@/platform/skill-router";

describe("platform/skill-router", () => {
  describe("estimateDifficulty", () => {
    it("returns 'trivial' for simple lookup queries", () => {
      expect(estimateDifficulty("What is the capital of Japan?")).toBe("trivial");
      expect(estimateDifficulty("Who is Diana Lightshield?")).toBe("trivial");
      expect(estimateDifficulty("Show me the list of cards")).toBe("trivial");
    });

    it("returns 'complex' for analytical queries", () => {
      expect(estimateDifficulty("Analyze the battle strategy")).toBe("complex");
      expect(estimateDifficulty("Compare Granbell and Elyseon")).toBe("complex");
      expect(estimateDifficulty("Design a multi-step deck composition")).toBe("complex");
    });

    it("returns 'moderate' for neither trivial nor complex queries", () => {
      expect(estimateDifficulty("Tell me about the wiki system")).toBe("moderate");
      expect(estimateDifficulty("Explain the battle engine")).toBe("moderate");
    });
  });

  describe("SquillaRouter", () => {
    it("routes task to registered handler and includes latency", async () => {
      const router = new SquillaRouter();

      const trivialHandler = {
        difficulty: "trivial" as TaskDifficulty,
        handle: async (task: SkillTask): Promise<SkillResult> => ({
          output: { answer: `handled ${task.description}` },
          difficulty: "trivial",
          latencyMs: 0,
          tokenUsage: 10,
        }),
      };

      router.register("trivial", trivialHandler);

      const result = await router.route({
        id: "t1",
        description: "What is HP?",
        difficulty: "trivial",
        input: {},
      });

      expect(result.output).toEqual({ answer: "handled What is HP?" });
      expect(result.difficulty).toBe("trivial");
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
      expect(result.tokenUsage).toBe(10);
    });

    it("auto-estimates difficulty via routeAuto", async () => {
      const router = new SquillaRouter();

      const complexHandler = {
        difficulty: "complex" as TaskDifficulty,
        handle: async (_task: SkillTask): Promise<SkillResult> => ({
          output: { deep: true },
          difficulty: "complex",
          latencyMs: 0,
        }),
      };

      router.register("complex", complexHandler);

      // "Analyze" triggers complex estimation
      const result = await router.routeAuto({
        id: "t2",
        description: "Analyze the faction dynamics",
        input: {},
      });

      expect(result.difficulty).toBe("complex");
    });
  });
});
