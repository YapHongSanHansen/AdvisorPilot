import type { ScoringWeights } from "@/types";

// D13 — Configurable default weights live in types/ (DEFAULT_SCORING_WEIGHTS:
// 0.55 / 0.25 / 0.15 / 0.05, prioritizing job capability). Re-exported here for
// convenience alongside the scoring engine.
export { DEFAULT_SCORING_WEIGHTS } from "@/types";

/** Sum of weights — used to normalize the final score for custom weights. */
export function weightTotal(weights: ScoringWeights): number {
  return weights.skill + weights.capacity + weights.workStyle + weights.distribution;
}
