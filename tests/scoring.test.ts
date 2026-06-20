import { describe, it, expect } from "vitest";
import {
  rankCandidates,
  evaluateGates,
  capacityScore,
  distributionScore,
  finalScore,
  DEFAULT_SCORING_WEIGHTS,
} from "@/lib/scoring";
import { seedEmployees, balancedProject, urgentProject } from "@/lib/data";
import type { Employee, Project, ScoringWeights } from "@/types";

// --- builders for precise, isolated cases -----------------------------------
function emp(overrides: Partial<Employee> = {}): Employee {
  return {
    id: "emp-x",
    name: "Test Employee",
    team: "Product",
    weeklyCapacity: 40,
    allocatedHours: 10,
    skills: { frontend: 4, backend: 4, data: 4, design: 4 },
    workStyle: { ambiguity: 0.5, communication: 0.5, pace: 0.5, collaboration: 0.5 },
    assignmentsLast30Days: 2,
    active: true,
    ...overrides,
  };
}

function proj(overrides: Partial<Project> = {}): Project {
  return {
    id: "proj-x",
    name: "Test Project",
    requiredHours: 10,
    mandatorySkills: {},
    preferredSkills: {},
    desiredWorkStyle: { ambiguity: 0.5, communication: 0.5, pace: 0.5, collaboration: 0.5 },
    urgency: "medium",
    ...overrides,
  };
}

const SCORE_KEYS = ["skill", "capacity", "workStyle", "distribution"] as const;

// ---------------------------------------------------------------------------

describe("E01 — unavailable employee is rejected", () => {
  it("rejects an employee without enough free hours", () => {
    const busy = emp({ id: "busy", weeklyCapacity: 40, allocatedHours: 39 }); // 1h free
    const p = proj({ requiredHours: 20 });

    const gate = evaluateGates(busy, p);
    expect(gate.eligible).toBe(false);
    expect(gate.rejections.join(" ")).toMatch(/free/i);

    const result = rankCandidates(p, [busy]);
    expect(result.top).toHaveLength(0);
    expect(result.ineligible.map((c) => c.employeeId)).toContain("busy");
  });
});

describe("E02 — missing mandatory skill is rejected", () => {
  it("rejects an employee below the mandatory skill level", () => {
    const low = emp({ id: "low", skills: { data: 3 } });
    const p = proj({ mandatorySkills: { data: 5 } });

    const gate = evaluateGates(low, p);
    expect(gate.eligible).toBe(false);
    expect(gate.rejections.join(" ")).toMatch(/data/);
    expect(rankCandidates(p, [low]).eligible).toHaveLength(0);
  });
});

describe("E03 — all component scores stay within 0–1", () => {
  it("keeps every component score in [0,1] (final in [0,100]) across seed data", () => {
    for (const project of [balancedProject, urgentProject]) {
      const { eligible, ineligible } = rankCandidates(project, seedEmployees);
      for (const c of [...eligible, ...ineligible]) {
        for (const key of SCORE_KEYS) {
          expect(c.scores[key]).toBeGreaterThanOrEqual(0);
          expect(c.scores[key]).toBeLessThanOrEqual(1);
        }
        expect(c.scores.finalScore).toBeGreaterThanOrEqual(0);
        expect(c.scores.finalScore).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("E04 — same input returns the same ranking", () => {
  it("is deterministic", () => {
    const a = rankCandidates(balancedProject, seedEmployees);
    const b = rankCandidates(balancedProject, seedEmployees);
    expect(a.eligible.map((c) => c.employeeId)).toEqual(b.eligible.map((c) => c.employeeId));
    expect(a.top.map((c) => c.scores.finalScore)).toEqual(b.top.map((c) => c.scores.finalScore));
  });
});

describe("E05 — overload lowers the capacity score", () => {
  it("a more-loaded employee scores lower on capacity", () => {
    const p = proj({ requiredHours: 10 });
    const light = emp({ allocatedHours: 5 });
    const heavy = emp({ allocatedHours: 30 });
    expect(capacityScore(heavy, p)).toBeLessThan(capacityScore(light, p));
  });
});

describe("E06 — repeated assignments lower the distribution score", () => {
  it("more recent assignments yield a lower distribution score", () => {
    const teamAverage = 3;
    const rare = emp({ assignmentsLast30Days: 1 });
    const frequent = emp({ assignmentsLast30Days: 9 });
    expect(distributionScore(frequent, teamAverage)).toBeLessThan(
      distributionScore(rare, teamAverage),
    );
  });
});

describe("E07 — changing weights changes the ranking", () => {
  it("flips the top candidate when weights shift skill -> distribution", () => {
    // Skill-strong but heavily loaded vs. weaker-skill but fresh. Both eligible.
    const skillStar = emp({ id: "skill-star", skills: { core: 5 }, assignmentsLast30Days: 10 });
    const fresh = emp({ id: "fresh", skills: { core: 3 }, assignmentsLast30Days: 0 });
    const p = proj({ preferredSkills: { core: 5 } });
    const employees = [skillStar, fresh];

    const skillHeavy: ScoringWeights = { skill: 0.9, capacity: 0.03, workStyle: 0.02, distribution: 0.05 };
    const distHeavy: ScoringWeights = { skill: 0.1, capacity: 0.05, workStyle: 0.05, distribution: 0.8 };

    expect(rankCandidates(p, employees, skillHeavy).top[0].employeeId).toBe("skill-star");
    expect(rankCandidates(p, employees, distHeavy).top[0].employeeId).toBe("fresh");
  });
});

describe("E08 — no-eligible-candidate response", () => {
  it("returns empty eligible/top when nobody passes the gates", () => {
    const p = proj({ requiredHours: 999 }); // nobody has 999h free
    const result = rankCandidates(p, seedEmployees);
    expect(result.eligible).toHaveLength(0);
    expect(result.top).toHaveLength(0);
    expect(result.ineligible).toHaveLength(seedEmployees.length);
  });
});

// --- spec cross-checks -------------------------------------------------------

describe("worked example (spec 03-SCORING-AND-DATA)", () => {
  it("reproduces the documented final scores", () => {
    expect(
      finalScore({ skill: 0.95, capacity: 0.8, workStyle: 0.85, distribution: 0.9 }, DEFAULT_SCORING_WEIGHTS),
    ).toBeCloseTo(89.5, 1);
    expect(
      finalScore({ skill: 0.9, capacity: 0.6, workStyle: 0.9, distribution: 0.65 }, DEFAULT_SCORING_WEIGHTS),
    ).toBeCloseTo(81.25, 2);
    expect(
      finalScore({ skill: 0.82, capacity: 0.9, workStyle: 0.7, distribution: 1.0 }, DEFAULT_SCORING_WEIGHTS),
    ).toBeCloseTo(83.1, 1);
  });
});

describe("end-to-end: urgent project gating", () => {
  it("filters to the single available scarce-skill holder (Chen)", () => {
    const { top, eligible } = rankCandidates(urgentProject, seedEmployees);
    expect(eligible.map((c) => c.employeeId)).toEqual(["emp-chen"]);
    expect(top[0].employeeName).toBe("Chen Wei");
  });
});
