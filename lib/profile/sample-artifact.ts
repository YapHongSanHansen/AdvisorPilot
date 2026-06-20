/**
 * K02 — One synthetic, employee-approved work artifact. Job evidence ONLY:
 * no private messages, no personal/protected information. This is the only kind
 * of input the drafting step is allowed to read.
 */
export const sampleWorkArtifact = {
  employeeId: "emp-aisha",
  source: "Sprint retrospective notes (approved by the employee)",
  text: [
    "Picked up the checkout refactor with only a rough brief and turned it into a",
    "concrete plan, proactively clarifying open questions with the product owner.",
    "Wrote a detailed design document and step-by-step migration notes before coding.",
    "Shipped the work in small iterative pull requests rather than one large change,",
    "and paired frequently with two other engineers to unblock them.",
  ].join(" "),
};

export type WorkArtifact = typeof sampleWorkArtifact;
