# Project Atlas — CLAUDE.md

AI-assisted manpower allocation. **ImagineHack 2026, Track 3 (DoubleDot — Smarter Resource Management).** Resource = manpower; waste = idle talent, overload/burnout, manual planning time.

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Recharts · React Hook Form + Zod · Supabase Postgres · Vitest · Vercel. Optional Claude for work-style profile drafting (never decides).

## The loop
**create → rank → decide → audit.**

## Structure
- `app/{dashboard,allocate,recommendations,audit}/` — routes; `app/api/` — endpoints
- `components/{dashboard,allocation,shared}/` — UI
- `lib/{scoring,data,validation}/` — pure logic; the scoring engine is **deterministic** (no model state)
- `types/` — shared types; `tests/` — Vitest

## Scoring (deterministic — see manpower-allocation-guide/03)
`finalScore = 100 × (0.55·S + 0.25·C + 0.15·W + 0.05·D)` — weights configurable & shown in the UI.
Eligibility **gates run first** (available hours ≥ required, mandatory skills met, active, no conflict) before any weighted scoring.

## Conventions
- Brand: Slate `#334155` + Emerald `#10B981` (use Tailwind `slate-*` / `emerald-*`; tokens in `docs/DESIGN-TOKENS.md`).
- Every recommendation explanation must cite **visible evidence** — never "the AI thinks X is best".
- Out of scope: `docs/OUT-OF-SCOPE.md`.

## Commands
- `npm run dev` — local dev
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — eslint
