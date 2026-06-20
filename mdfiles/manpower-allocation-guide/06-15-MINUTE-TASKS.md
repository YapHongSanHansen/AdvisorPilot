# 15-Minute Task Board

Every checkbox is designed for one focused block of no more than 15 minutes. If a task runs longer, stop and split it again.

## A. Product alignment

- [ ] **A01** Copy the one-line pitch into the project README.
- [ ] **A02** Write the three manager pain points on the pitch slide.
- [ ] **A03** Write the six-step demo journey on a shared board.
- [ ] **A04** Assign one owner to UI, scoring, data, and pitch.
- [ ] **A05** Mark all out-of-scope features in the issue tracker.
- [ ] **A06** Choose the product name and a two-color palette.

## B. Project setup

- [ ] **B01** Create the Next.js TypeScript project.
- [ ] **B02** Install Tailwind/shadcn dependencies.
- [ ] **B03** Install form, validation, and chart packages.
- [ ] **B04** Create dashboard, allocate, recommendations, and audit routes.
- [ ] **B05** Add the shared page container and typography.
- [ ] **B06** Add the desktop sidebar navigation.
- [ ] **B07** Add a compact mobile navigation.
- [ ] **B08** Add `.env.example` with placeholder keys.

## C. Types and seed data

- [ ] **C01** Define the `WorkStyle` TypeScript type.
- [ ] **C02** Define the `Employee` TypeScript type.
- [ ] **C03** Define the `Project` TypeScript type.
- [ ] **C04** Define score breakdown and recommendation types.
- [ ] **C05** Define decision and audit-event types.
- [ ] **C06** Create four skill names and proficiency levels.
- [ ] **C07** Seed the first three employee records.
- [ ] **C08** Seed three more employee records with varied capacity.
- [ ] **C09** Seed one balanced project.
- [ ] **C10** Seed one urgent project with scarce skills.
- [ ] **C11** Add a single function that resets demo fixtures.

## D. Scoring engine

- [ ] **D01** Add a reusable `clamp(0, 1)` helper.
- [ ] **D02** Implement the available-hours gate.
- [ ] **D03** Implement the mandatory-skill gate.
- [ ] **D04** Return rejection reasons from failed gates.
- [ ] **D05** Implement one-skill ratio calculation.
- [ ] **D06** Combine skill ratios into `skillScore`.
- [ ] **D07** Implement projected utilization.
- [ ] **D08** Convert projected utilization into `capacityScore`.
- [ ] **D09** Implement one work-style dimension distance.
- [ ] **D10** Combine four dimensions into `workStyleScore`.
- [ ] **D11** Implement relative recent workload.
- [ ] **D12** Convert workload into bounded `distributionScore`.
- [ ] **D13** Add configurable default weights.
- [ ] **D14** Implement the final weighted score.
- [ ] **D15** Sort eligible candidates by score.
- [ ] **D16** Return the top three candidates.
- [ ] **D17** Add deterministic tie-breaking by available capacity.
- [ ] **D18** Generate three reason codes per candidate.

## E. Scoring tests

- [ ] **E01** Test that an unavailable employee is rejected.
- [ ] **E02** Test that a missing mandatory skill is rejected.
- [ ] **E03** Test that all component scores stay within 0–1.
- [ ] **E04** Test that the same input returns the same ranking.
- [ ] **E05** Test that overload lowers capacity score.
- [ ] **E06** Test that repeated assignments lower distribution score.
- [ ] **E07** Test that changing weights changes ranking.
- [ ] **E08** Test the no-eligible-candidate response.

## F. Allocation form

- [ ] **F01** Add project name and required-hours inputs.
- [ ] **F02** Add urgency selection.
- [ ] **F03** Add one mandatory-skill row.
- [ ] **F04** Add the “add skill” action.
- [ ] **F05** Add required proficiency controls.
- [ ] **F06** Add four work-style sliders.
- [ ] **F07** Add form validation messages.
- [ ] **F08** Add a summary panel beside the form.
- [ ] **F09** Connect submit to the scoring function/API.
- [ ] **F10** Add submit loading and failure states.

## G. Recommendation page

- [ ] **G01** Create the candidate-card shell.
- [ ] **G02** Show employee name, team, and final score.
- [ ] **G03** Show available and projected capacity.
- [ ] **G04** Show the skill score bar.
- [ ] **G05** Show the capacity score bar.
- [ ] **G06** Show the work-style score bar.
- [ ] **G07** Show the distribution score bar.
- [ ] **G08** Render plain-language recommendation reasons.
- [ ] **G09** Highlight the recommended candidate.
- [ ] **G10** Add an expandable “Why this score?” section.
- [ ] **G11** Add the no-valid-candidate state.
- [ ] **G12** Add accept and choose-another buttons.

## H. Decisions and overrides

- [ ] **H01** Create an accept-confirmation dialog.
- [ ] **H02** Create an override dialog.
- [ ] **H03** Add optional override reason codes.
- [ ] **H04** Calculate selected employee's projected utilization.
- [ ] **H05** Show overload impact before confirmation.
- [ ] **H06** Save a recommendation snapshot.
- [ ] **H07** Save the final selected employee.
- [ ] **H08** Save actor, timestamp, and override flag.
- [ ] **H09** Show a success message and next action.

## I. Dashboard

- [ ] **I01** Add total people and open-project cards.
- [ ] **I02** Add total available-hours card.
- [ ] **I03** Add overloaded-employee card.
- [ ] **I04** Add team capacity bar chart.
- [ ] **I05** Add workload-distribution chart.
- [ ] **I06** Add employees-near-capacity list.
- [ ] **I07** Add recent allocation decisions list.
- [ ] **I08** Connect cards to shared fixture/database data.

## J. Leadership audit view

- [ ] **J01** Add override-rate card.
- [ ] **J02** Add override trend chart.
- [ ] **J03** Add override-reasons summary.
- [ ] **J04** Add workload concentration card.
- [ ] **J05** Add manager/team filter controls.
- [ ] **J06** Add review flag for high override rate.
- [ ] **J07** Add review flag for workload concentration.
- [ ] **J08** Add decision-history table.
- [ ] **J09** Label flags as prompts, not misconduct findings.

## K. Optional profile drafting

- [ ] **K01** Define the strict JSON response schema.
- [ ] **K02** Create one synthetic work-artifact sample.
- [ ] **K03** Write the extraction prompt using only job evidence.
- [ ] **K04** Add a mock JSON response fixture.
- [ ] **K05** Add JSON validation and fallback behavior.
- [ ] **K06** Add confidence beside each proposed value.
- [ ] **K07** Add employee-editable profile sliders.
- [ ] **K08** Add an explicit approve-profile action.
- [ ] **K09** Ensure unapproved drafts never enter scoring.

## L. Privacy and quality

- [ ] **L01** Add “decision support, not automatic assignment” text.
- [ ] **L02** Add a synthetic-data label.
- [ ] **L03** Add a short data-source disclosure.
- [ ] **L04** Verify no protected characteristics exist in fixtures.
- [ ] **L05** Verify no private-message source is mentioned as active.
- [ ] **L06** Add empty states to all four pages.
- [ ] **L07** Add error states to form and recommendation flow.
- [ ] **L08** Test keyboard navigation through the allocation form.
- [ ] **L09** Check text contrast and score labels.
- [ ] **L10** Test at laptop and mobile widths.

## M. Demo preparation

- [ ] **M01** Create a demo manager persona.
- [ ] **M02** Create a project requiring two scarce skills.
- [ ] **M03** Make the obvious senior candidate overloaded.
- [ ] **M04** Make another candidate the balanced recommendation.
- [ ] **M05** Prepare an override that creates a visible warning.
- [ ] **M06** Verify the override changes audit metrics.
- [ ] **M07** Add a one-click demo reset.
- [ ] **M08** Write the 30-second problem opening.
- [ ] **M09** Write the 90-second product walkthrough.
- [ ] **M10** Write the 30-second architecture explanation.
- [ ] **M11** Write the 30-second impact close.
- [ ] **M12** Run and time the complete pitch.
- [ ] **M13** Record a backup demo video.
- [ ] **M14** Export architecture and impact slides as PDF.

## Recommended critical path

Complete these first:

`A01–A05 → B01–B06 → C01–C11 → D01–D18 → E01–E06 → F01–F10 → G01–G12 → H01–H09 → I01–I08 → M01–M12`

Everything in sections J, K, and parts of L is secondary if time is tight.

