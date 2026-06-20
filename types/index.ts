// Core domain types for Project Atlas.
// Source of truth: manpower-allocation-guide/03-SCORING-AND-DATA.md

/** C01 — Work-style: four job-related, employee-editable dimensions.
 *  Each value is 0..1 and describes a PREFERENCE, not personality quality
 *  or performance potential. */
export type WorkStyle = {
  ambiguity: number; // tolerance for ambiguity
  communication: number; // preferred communication detail
  pace: number; // delivery pace
  collaboration: number; // collaboration preference
};

export type Urgency = "low" | "medium" | "high";

/** C02 — Employee. `active` backs the eligibility gate ("employee is active"). */
export type Employee = {
  id: string;
  name: string;
  team: string;
  weeklyCapacity: number; // hours available per week
  allocatedHours: number; // hours already committed this week
  skills: Record<string, number>; // skill name -> proficiency level (1..5)
  workStyle: WorkStyle;
  assignmentsLast30Days: number;
  active: boolean;
};

/** C03 — Project requirements entered by a manager. */
export type Project = {
  id: string;
  name: string;
  requiredHours: number;
  mandatorySkills: Record<string, number>; // gates: minimum proficiency required
  preferredSkills: Record<string, number>; // contribute to score, not gates
  desiredWorkStyle: WorkStyle;
  urgency: Urgency;
};

/** C04 — Component scores (each 0..1) and the final 0..100 score. */
export type ScoreBreakdown = {
  skill: number; // S
  capacity: number; // C
  workStyle: number; // W
  distribution: number; // D
  finalScore: number; // 100 × (0.55S + 0.25C + 0.15W + 0.05D)
};

/** Configurable, UI-visible weights. Defaults prioritize job capability. */
export type ScoringWeights = {
  skill: number;
  capacity: number;
  workStyle: number;
  distribution: number;
};

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  skill: 0.55,
  capacity: 0.25,
  workStyle: 0.15,
  distribution: 0.05,
};

/** A single ranked candidate with evidence-cited reasons and risks. */
export type RankedCandidate = {
  employeeId: string;
  employeeName: string;
  eligible: boolean; // passed all hard gates
  scores: ScoreBreakdown;
  reasons: string[]; // plain-language, each tied to visible evidence
  risks: string[]; // e.g. "projected utilization 98%"
};

/** C04 — A recommendation snapshot for one project. */
export type Recommendation = {
  id: string;
  projectId: string;
  generatedAt: string; // ISO timestamp
  weights: ScoringWeights;
  candidates: RankedCandidate[]; // ranked desc by finalScore; top 3 surfaced in UI
};

/** C05 — Override reason codes. Ordinary overrides stay one click. */
export const OVERRIDE_REASON_CODES = [
  "domain-experience-not-captured",
  "client-continuity",
  "scheduling-information-changed",
  "employee-preference",
  "recommendation-data-incorrect",
  "other",
] as const;
export type OverrideReasonCode = (typeof OVERRIDE_REASON_CODES)[number];

export const OVERRIDE_REASON_LABELS: Record<OverrideReasonCode, string> = {
  "domain-experience-not-captured": "Domain experience not captured",
  "client-continuity": "Client continuity",
  "scheduling-information-changed": "Scheduling information changed",
  "employee-preference": "Employee preference",
  "recommendation-data-incorrect": "Recommendation data incorrect",
  other: "Other",
};

/** C05 — Decision snapshot. Stores inputs + scores + weights so audits stay
 *  truthful even if employee profiles change later. */
export type Decision = {
  id: string;
  projectId: string;
  recommendationId: string;
  projectSnapshot: Project;
  candidates: RankedCandidate[];
  weights: ScoringWeights;
  recommendedEmployeeId: string; // top-ranked candidate
  selectedEmployeeId: string; // who the manager chose
  isOverride: boolean; // selected !== recommended
  reasonCode?: OverrideReasonCode;
  actor: string; // manager id / name
  decidedAt: string; // ISO timestamp
};

/** C05 — Audit events feed leadership analytics. */
export type AuditEventType =
  | "recommendation_generated"
  | "decision_recorded"
  | "override_recorded"
  | "demo_reset";

export type AuditEvent = {
  id: string;
  type: AuditEventType;
  at: string; // ISO timestamp
  actor: string;
  projectId?: string;
  employeeId?: string;
  detail?: string;
};
