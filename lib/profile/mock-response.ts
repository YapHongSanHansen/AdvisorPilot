import type { WorkStyleDraft } from "./schema";

/**
 * K04 — Mock LLM response, matching the strict schema, derived from the sample
 * artifact (K02). Lets the full drafting flow run with no live API key.
 */
export const mockDraftResponse: WorkStyleDraft = {
  ambiguity: {
    score: 0.75,
    confidence: 0.6,
    evidence: [
      "Picked up the checkout refactor with only a rough brief",
      "proactively clarifying open questions",
    ],
  },
  communication: {
    score: 0.7,
    confidence: 0.7,
    evidence: ["Wrote a detailed design document and step-by-step migration notes"],
  },
  pace: {
    score: 0.8,
    confidence: 0.6,
    evidence: ["Shipped the work in small iterative pull requests"],
  },
  collaboration: {
    score: 0.85,
    confidence: 0.65,
    evidence: ["paired frequently with two other engineers to unblock them"],
  },
};
