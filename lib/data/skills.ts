// C06 — Skill catalog and proficiency scale, shared by seed data and scoring.

export const SKILLS = ["frontend", "backend", "data", "design"] as const;
export type SkillName = (typeof SKILLS)[number];

/** Proficiency is a 1–5 scale; project requirements use the same scale. */
export const MAX_PROFICIENCY = 5;

export const PROFICIENCY_LEVELS: { level: number; label: string }[] = [
  { level: 1, label: "Novice" },
  { level: 2, label: "Advanced beginner" },
  { level: 3, label: "Competent" },
  { level: 4, label: "Proficient" },
  { level: 5, label: "Expert" },
];

export const SKILL_LABELS: Record<SkillName, string> = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Data / Analytics",
  design: "Product Design",
};
