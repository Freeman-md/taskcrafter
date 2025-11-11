<div align="center">

# TaskCrafter
AI-assisted goal planning and execution dashboard built with Next.js and OpenAI streaming responses.

</div>

## Overview

TaskCrafter helps teams break ambitious goals into structured action plans with AI assistance. The dashboard combines a rich goal form, live AI streaming feedback, and (soon) persistent plan management. Users enter a goal, optional context, and deadlines; the OpenAI Responses API streams back a structured plan that is validated and rendered in real time.

---

## Architecture Snapshot

```
GoalPlannerProvider (context)
 ├─ useGoalPlanner (form state + streaming + validation)
 ├─ GoalForm (client inputs + disabled state)
 └─ PlanStatus
      ├─ Loading / Streaming / Error views
      └─ Completed plan → TaskCard list

API Route (/api/goal/create-plan)
 ├─ GoalInputSchema / PlanOutputSchema (Zod)
 └─ OpenAI Responses API (NDJSON streaming + structured JSON)
```

---

## Tech Stack

- Next.js 15 (App Router, RSC) with TypeScript
- OpenAI Responses API for streaming plan generation
- Clerk auth foundation
- Tailwind CSS + shadcn/ui components
- Tabler Icons, container queries, OKLCH theming
- Zod schemas for type-safe contracts

---

## Current Features

- **Authenticated dashboard shell** with responsive sidebar, header, and navigation (`useNavigation` hook).
- **Dashboard widgets**: metric cards, Active Goals list with progress bars, and Recent Activity feed.
- **Goal Planner layout**: two-column grid with GoalForm + PlanStatus placeholders and task previews.
- **GoalForm**: controlled inputs for title, deadline, and context, wired to the shared planner hook.
- **Streaming UX**: OpenAI NDJSON responses parsed via `ReadableStream`, surfaced in PlanStatus.
- **PlanStatus**: empty/loading/streaming/error/completed states, rendering tasks through reusable `TaskCard` components once a plan arrives.
- **Custom auth experience**: branded sign-in/sign-up routes with Clerk.
- **Global design system**: project-wide palette, typography, and primitives.

---

## Quick API Testing

Use the included smoke-test runner to exercise the create-plan route without leaving VS Code:

```bash
# terminal 1 – run the app
npm run dev

# terminal 2 – hit the API with multiple scenarios
npm run test:create-plan
```

The script (`scripts/test-create-plan.mjs`) sends five POST requests:

- `happy-path`: fully valid payload to confirm success responses.
- `edge-min-context`: validates the 20-character context boundary.
- `missing-title`: omits a required field and should return `400`.
- `bad-deadline`: uses an unparseable deadline string to trigger date validation errors.
- `short-context`: exercises the minimum-length guardrail.

Failed cases respond with `400` plus an `issues` array detailing the exact field and message, which the script prints to the terminal for quick debugging. Set `CREATE_PLAN_URL` before running the script to point at another environment (e.g., a deployed preview).

---

## API Error Handling

Wrap App Router handlers with `withApiErrorHandling` (from `src/lib/api`) for consistent JSON errors. Throw `new ApiError({...})` or `new ValidationApiError(issues)` inside your handler and the wrapper will serialize `{ error, message, details }`, log unexpected exceptions, and return a `500` fallback when something slips through.

---

## Project Structure

```
├── src/app
│   ├── (dashboard)        # Authenticated shell, goal planner route
│   └── auth               # Clerk catch-all routes
├── src/components
│   ├── goal-planner       # GoalForm, PlanStatus, TaskCard, provider
│   ├── dashboard          # Widgets & cards
│   ├── layout             # LayoutClient for the shell
│   └── providers          # Top-level providers (Clerk, planner)
├── src/hooks
│   ├── use-navigation.ts
│   └── useGoalPlanner.ts
└── scripts/test-create-plan.mjs
```

---

## Getting Started

```bash
# install dependencies
npm install

# run the development server
npm run dev
```

Visit `http://localhost:3000` (and Clerk’s dev instance) for the authenticated experience, or `http://localhost:3000/goal-planner` to focus on the planner UI.

---

## Roadmap

Tracked in `TASKS.todo`. Upcoming phases:

1. **Phase 4 – Database Integration** (Supabase + Prisma)
2. **Phase 5 – Frontend Enhancements** (auth gating, save/regenerate/export, dark mode)
3. **Phase 6 – Security & Rate Limiting**
4. **Phase 7 – Deployment to Vercel**
5. **Phase 8 – UI Polish + Public Demo**

---

## Remaining Work

- Build backend plan persistence with Prisma & Supabase, plus NextAuth session protection.
- Flesh out frontend plan management (save/regenerate/export) and additional dashboard charts/tables.
- Polish UI/UX, responsive behavior, and prepare deployment to Vercel with production env vars.

---

## License

TaskCrafter is released under the [MIT License](LICENSE).

---

## Future Direction

TaskCrafter is moving from structured streaming outputs toward OpenAI function calling and, ultimately, an agentic planning flow capable of reasoning, storing, and executing plans autonomously.
