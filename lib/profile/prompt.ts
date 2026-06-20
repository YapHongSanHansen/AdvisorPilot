import type { WorkArtifact } from "./sample-artifact";

/**
 * K03 — Extraction prompt. Uses ONLY job evidence from an approved artifact and
 * explicitly forbids inferring protected or personal characteristics. In production
 * this is sent to an LLM configured for strict JSON-schema output; in the hackathon
 * MVP a mock response (K04) is used instead.
 */
export function buildExtractionPrompt(artifact: WorkArtifact): string {
  return `You draft a work-style profile from an APPROVED, job-related work artifact only.

Rules:
- Use ONLY the artifact text below as evidence. Quote exact phrases as evidence.
- Score four job-related dimensions, each from 0 to 1:
  ambiguity tolerance, communication detail, delivery pace, collaboration preference.
- These are working PREFERENCES, not measures of quality, seniority, or performance.
- Do NOT infer or score age, gender, race, religion, disability, health, nationality,
  or any other protected or personal characteristic. If asked implicitly, refuse.
- Give a confidence from 0 to 1 per dimension based on how strong the evidence is.
- If the evidence is insufficient for a dimension, use a neutral score of 0.5 and a low confidence.
- Output STRICT JSON only (no prose), shaped as:
  { "ambiguity": { "score": <0..1>, "confidence": <0..1>, "evidence": [<string>] }, ... }
  with the same shape for "communication", "pace", and "collaboration".

Artifact — ${artifact.source}:
"""
${artifact.text}
"""`;
}
