import { z } from "zod";
import { OVERRIDE_REASON_CODES } from "@/types";

/** Validation for POST /api/decisions. project/candidates are trusted snapshots
 *  passed back from the recommendation step, so they ride along as unknown. */
export const decisionRequestSchema = z.object({
  selectedEmployeeId: z.string().min(1),
  recommendedEmployeeId: z.string().min(1),
  isOverride: z.boolean(),
  reasonCode: z.enum(OVERRIDE_REASON_CODES).optional(),
  actor: z.string().min(1).default("Demo Manager"),
  project: z.unknown(),
  candidates: z.array(z.unknown()).default([]),
});

export type DecisionRequest = z.infer<typeof decisionRequestSchema>;
