import { NextResponse } from "next/server";
import { allocationFormSchema } from "@/lib/validation/project";
import { getFixtures } from "@/lib/data";
import { rankCandidates } from "@/lib/scoring";
import type { Project } from "@/types";

/**
 * POST /api/recommendations — validate a project requirement, run the deterministic
 * scoring engine against the seeded employees, and return the ranked candidates.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = allocationFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const v = parsed.data;
  const project: Project = {
    id: `proj-${Date.now()}`,
    name: v.name,
    requiredHours: v.requiredHours,
    mandatorySkills: Object.fromEntries(v.skills.map((s) => [s.skill, s.level])),
    preferredSkills: {},
    desiredWorkStyle: v.workStyle,
    urgency: v.urgency,
  };

  const { employees } = getFixtures();
  const result = rankCandidates(project, employees);

  return NextResponse.json({ project, result });
}
