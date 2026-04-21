import seedrandom from "seedrandom";

/** Deterministic Fisher–Yates shuffle */
export function shuffle<T>(array: T[], seed: string): T[] {
  const rng = seedrandom(seed);
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Generate a short random seed string */
export function makeSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
