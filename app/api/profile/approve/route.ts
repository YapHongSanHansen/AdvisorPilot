import { NextResponse } from "next/server";
import { z } from "zod";
import { getFixtures } from "@/lib/data";
import { workStyleSchema } from "@/lib/validation/project";

const approveSchema = z.object({
  employeeId: z.string().min(1),
  workStyle: workStyleSchema,
});

/**
 * POST /api/profile/approve — the ONLY path that writes a work-style profile into the
 * data scoring reads (K08). Until this runs, a draft never affects recommendations (K09).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = approveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
  }

  const { employees } = getFixtures();
  const employee = employees.find((e) => e.id === parsed.data.employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Unknown employee" }, { status: 404 });
  }

  employee.workStyle = parsed.data.workStyle;
  return NextResponse.json({ ok: true, employee });
}
