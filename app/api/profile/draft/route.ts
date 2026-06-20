import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/data";
import { buildExtractionPrompt } from "@/lib/profile/prompt";
import { sampleWorkArtifact } from "@/lib/profile/sample-artifact";
import { mockDraftResponse } from "@/lib/profile/mock-response";
import { validateDraft } from "@/lib/profile/validate";

/**
 * POST /api/profile/draft — draft a work-style profile from the approved artifact.
 * Production would send buildExtractionPrompt(...) to an LLM with JSON-schema output;
 * the MVP uses a mock response (architecture: "can be mocked"). The draft is validated
 * and is NOT applied to scoring until the employee explicitly approves it (K09).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { employeeId?: string };
  const { employees } = getFixtures();
  const employee = employees.find((e) => e.id === body.employeeId) ?? employees[0];

  // Built for real use; unused in mock mode (kept to document the intended call).
  void buildExtractionPrompt(sampleWorkArtifact);

  const result = validateDraft(mockDraftResponse, employee.workStyle);
  if (!result.ok) {
    return NextResponse.json({ error: result.error, fallback: result.fallback }, { status: 422 });
  }

  return NextResponse.json({
    employeeId: employee.id,
    artifactSource: sampleWorkArtifact.source,
    draft: result.draft,
  });
}
