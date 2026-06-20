import { z } from "zod";

/**
 * K01 — Strict JSON contract for an AI-drafted work-style profile.
 * Each of the four job-related dimensions gets a score (0–1), a confidence (0–1),
 * and the evidence phrases that justify it. Malformed output is rejected (K05).
 */
export const dimensionDraftSchema = z.object({
  score: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()),
});

export const workStyleDraftSchema = z.object({
  ambiguity: dimensionDraftSchema,
  communication: dimensionDraftSchema,
  pace: dimensionDraftSchema,
  collaboration: dimensionDraftSchema,
});

export type DimensionDraft = z.infer<typeof dimensionDraftSchema>;
export type WorkStyleDraft = z.infer<typeof workStyleDraftSchema>;

export const DRAFT_DIMENSIONS = [
  { key: "ambiguity", label: "Ambiguity tolerance" },
  { key: "communication", label: "Communication detail" },
  { key: "pace", label: "Delivery pace" },
  { key: "collaboration", label: "Collaboration preference" },
] as const;
