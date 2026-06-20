import { z } from "zod";
import { SKILLS } from "@/lib/data/skills";

/** F07 — validation for the allocation form (and the /api/recommendations body). */
export const skillRequirementSchema = z.object({
  skill: z.enum(SKILLS),
  level: z.number().int().min(1).max(5),
});

export const workStyleSchema = z.object({
  ambiguity: z.number().min(0).max(1),
  communication: z.number().min(0).max(1),
  pace: z.number().min(0).max(1),
  collaboration: z.number().min(0).max(1),
});

export const allocationFormSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  requiredHours: z
    .number()
    .int("Use a whole number of hours")
    .positive("Required hours must be greater than 0"),
  urgency: z.enum(["low", "medium", "high"]),
  skills: z.array(skillRequirementSchema).min(1, "Add at least one required skill"),
  workStyle: workStyleSchema,
});

export type AllocationFormValues = z.infer<typeof allocationFormSchema>;
