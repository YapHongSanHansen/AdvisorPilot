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

// Store on globalThis so there is ONE instance per server process. Next bundles each
// route separately, which would otherwise duplicate a module-level singleton and make
// decisions written by /api/decisions invisible to the /dashboard and /audit pages.
const store = globalThis as unknown as { __atlasFixtures?: DemoFixtures };

export function getFixtures(): DemoFixtures {
  if (!store.__atlasFixtures) {
    store.__atlasFixtures = createSeedFixtures();
  }
  return store.__atlasFixtures;
}

/** C11 — Reset all demo data back to the seeded state. Returns the fresh fixtures. */
export function resetDemoFixtures(): DemoFixtures {
  store.__atlasFixtures = createSeedFixtures();
  return store.__atlasFixtures;
}
