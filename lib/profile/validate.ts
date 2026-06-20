import type { WorkStyle } from "@/types";
import { workStyleDraftSchema, type WorkStyleDraft } from "./schema";

export type DraftResult =
  | { ok: true; draft: WorkStyleDraft }
  | { ok: false; error: string; fallback: WorkStyle };

/**
 * K05 — Validate a (mock or live) draft against the strict schema. On malformed
 * output, fall back to the employee-confirmed profile — NEVER silently replace it.
 */
export function validateDraft(raw: unknown, confirmedProfile: WorkStyle): DraftResult {
  const parsed = workStyleDraftSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Malformed draft — keeping the employee-confirmed profile.",
      fallback: confirmedProfile,
    };
  }
  return { ok: true, draft: parsed.data };
}

/** Reduce a validated draft to plain WorkStyle scores (for editing and approval). */
export function draftToWorkStyle(draft: WorkStyleDraft): WorkStyle {
  return {
    ambiguity: draft.ambiguity.score,
    communication: draft.communication.score,
    pace: draft.pace.score,
    collaboration: draft.collaboration.score,
  };
}
