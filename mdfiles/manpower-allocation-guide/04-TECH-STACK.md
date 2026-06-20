# Tech Stack

## Recommended hackathon stack

| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript | One language across UI, API, and scoring |
| Web framework | Next.js App Router | Fast full-stack development and easy deployment |
| UI | Tailwind CSS + shadcn/ui | Rapid, polished dashboard components |
| Charts | Recharts | Simple capacity and trend charts |
| Forms | React Hook Form + Zod | Quick validation and typed inputs |
| Database | Supabase Postgres | Hosted SQL, simple setup, optional authentication |
| Data access | Supabase client | Avoid unnecessary ORM setup during the hackathon |
| Testing | Vitest | Lightweight tests for deterministic scoring |
| Deployment | Vercel | Straightforward Next.js hosting |
| Optional AI | One LLM API with JSON schema output | Draft work-style data; never make the final decision |

## Architecture choice

Start as a single Next.js application. Do not split into microservices. Keep the scoring engine in a pure TypeScript module so it can later move to a service without changing its behavior.

## Suggested repository structure

```text
app/
  dashboard/page.tsx
  allocate/page.tsx
  recommendations/page.tsx
  audit/page.tsx
  api/
components/
  dashboard/
  allocation/
  shared/
lib/
  scoring/
  data/
  validation/
types/
tests/
```

## Fastest fallback stack

If database setup costs too much time:

- keep Next.js and TypeScript;
- use local JSON fixtures;
- store new decisions in browser local storage;
- prepare a reset button;
- clearly call it a prototype with simulated enterprise data.

## Optional integrations after the MVP

- Jira/Linear for project demands and assignments.
- GitHub/GitLab for employee-approved work artifacts.
- HRIS for employee directory and team metadata.
- Calendar or scheduling system for availability.

Do not build these integrations until the seeded end-to-end journey works.

## AI profile output contract

```json
{
  "ambiguity": { "score": 0.7, "confidence": 0.6, "evidence": [] },
  "communication": { "score": 0.5, "confidence": 0.7, "evidence": [] },
  "pace": { "score": 0.8, "confidence": 0.6, "evidence": [] },
  "collaboration": { "score": 0.6, "confidence": 0.5, "evidence": [] }
}
```

Reject malformed output and never silently replace an employee-confirmed profile.

