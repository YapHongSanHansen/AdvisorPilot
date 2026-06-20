import type { Project } from "@/types";

// C09 — a balanced project: common skills, medium urgency, fits several people.
export const balancedProject: Project = {
  id: "proj-portal",
  name: "Customer Portal Refresh",
  requiredHours: 16,
  mandatorySkills: { frontend: 3 },
  preferredSkills: { design: 3, backend: 2 },
  desiredWorkStyle: { ambiguity: 0.6, communication: 0.7, pace: 0.6, collaboration: 0.7 },
  urgency: "medium",
};

// C10 — an urgent project that needs a scarce skill (data:5). Only Chen and Farid
// clear the mandatory gate; Farid is then filtered by the availability gate
// (1h free < 20h required), demonstrating gates + anti-overload.
export const urgentProject: Project = {
  id: "proj-analytics",
  name: "Realtime Analytics Hotfix",
  requiredHours: 20,
  mandatorySkills: { data: 5, backend: 4 },
  preferredSkills: { frontend: 2 },
  desiredWorkStyle: { ambiguity: 0.7, communication: 0.5, pace: 0.9, collaboration: 0.5 },
  urgency: "high",
};

/** Two seeded projects: one balanced, one urgent with scarce skills. */
export const seedProjects: Project[] = [balancedProject, urgentProject];
