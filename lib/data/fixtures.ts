import type { AuditEvent, Decision, Employee, Project } from "@/types";
import { seedEmployees } from "./employees";
import { seedProjects } from "./projects";

export type DemoFixtures = {
  employees: Employee[];
  projects: Project[];
  decisions: Decision[];
  auditEvents: AuditEvent[];
};

/** Build a fresh, deep-cloned set of demo fixtures from the seeds. */
export function createSeedFixtures(): DemoFixtures {
  return {
    employees: structuredClone(seedEmployees),
    projects: structuredClone(seedProjects),
    decisions: [],
    auditEvents: [],
  };
}

// In-memory demo state (scoped to the server instance). The data/API layer reads
// and mutates this; the spec's fallback is local JSON fixtures + browser storage.
let fixtures: DemoFixtures = createSeedFixtures();

export function getFixtures(): DemoFixtures {
  return fixtures;
}

/** C11 — Reset all demo data back to the seeded state. Returns the fresh fixtures. */
export function resetDemoFixtures(): DemoFixtures {
  fixtures = createSeedFixtures();
  return fixtures;
}
