/**
 * SquillaRouter — Task difficulty routing for AI skills
 * Routes tasks to appropriate skill tier based on complexity.
 * Cost reduction: ~1/9 by avoiding heavy models for simple tasks.
 */

export type TaskDifficulty = "trivial" | "moderate" | "complex";

export interface SkillTask {
  id: string;
  description: string;
  difficulty: TaskDifficulty;
  input: Record<string, unknown>;
}

export interface SkillResult {
  output: unknown;
  difficulty: TaskDifficulty;
  latencyMs: number;
  tokenUsage?: number;
}

interface SkillHandler {
  difficulty: TaskDifficulty;
  handle: (task: SkillTask) => Promise<SkillResult>;
}

/** Estimate task difficulty from description heuristics */
export function estimateDifficulty(description: string): TaskDifficulty {
  const lower = description.toLowerCase();
  const trivialPatterns = [
    /^(what|who|when|where|how many|list|show|get|find)\b/,
    /\b(def|define|meaning of)\b/,
  ];
  const complexPatterns = [
    /\b(analyze|compare|evaluate|synthesize|design|architect|optimize)\b/,
    /\b(multi-step|comprehensive|detailed|in-depth)\b/,
  ];

  for (const pattern of trivialPatterns) {
    if (pattern.test(lower)) {
      return "trivial";
    }
  }
  for (const pattern of complexPatterns) {
    if (pattern.test(lower)) {
      return "complex";
    }
  }
  return "moderate";
}

export class SquillaRouter {
  private handlers: Map<TaskDifficulty, SkillHandler> = new Map();

  register(difficulty: TaskDifficulty, handler: SkillHandler): void {
    this.handlers.set(difficulty, handler);
  }

  async route(task: SkillTask): Promise<SkillResult> {
    const start = performance.now();
    const handler = this.handlers.get(task.difficulty);

    if (!handler) {
      throw new Error(`No handler registered for difficulty: ${task.difficulty}`);
    }

    const result = await handler.handle(task);
    return {
      ...result,
      latencyMs: performance.now() - start,
    };
  }

  async routeAuto(task: Omit<SkillTask, "difficulty">): Promise<SkillResult> {
    const difficulty = estimateDifficulty(task.description);
    return this.route({ ...task, difficulty });
  }
}
