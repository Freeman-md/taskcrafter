<div align="center">

# TaskCrafter
AI-assisted goal planning and execution dashboard built with Next.js 14, Clerk auth, and shadcn/ui.

</div>

## Overview

TaskCrafter helps teams break ambitious goals into structured action plans with AI assistance. The app combines a goal dashboard, activity tracking, and an interactive goal planner that will eventually call TaskCrafter’s AI backend.

## Tech Stack

- Next.js 14 (App Router, Turbopack) with TypeScript
- Clerk for authentication & session management
- Tailwind CSS + shadcn/ui component system
- Tabler Icons, container queries, and OKLCH theming

## Current Features

- **Authenticated dashboard shell** with responsive sidebar, header, and navigation powered by a shared `useNavigation` hook.
- **Dashboard widgets**: metric cards, Active Goals list with progress bars, and Recent Activity feed using reusable goal/activity types.
- **Goal Planner**: two-column layout with a rich goal form, mock AI plan preview, loading states, and empty-state messaging.
- **Custom auth experience**: branded sign-in/sign-up routes with Clerk catch-all routing, themed appearance, and tailored layout.
- **Global design system**: Project-wide color palette (primary `#2563eb`), typography, and component primitives for consistent styling.

## Getting Started

```bash
# install dependencies
npm install

# run the development server
npm run dev
```

Visit `http://localhost:3000` and Clerk’s dev instance for authentication flows.

### Project Structure

```
├── src/app
│   ├── (dashboard)        # Authenticated app shell (sidebar + header)
│   │   ├── page.tsx       # Main dashboard view
│   │   └── goal-planner   # Goal planner route
│   └── auth               # Sign-in / sign-up catch-all routes with Clerk
├── src/components
│   ├── goal-planner       # Goal planner specific components
│   ├── dashboard          # Dashboard widgets
│   ├── layout             # LayoutClient for the sidebar shell
│   └── providers          # Top-level providers (Clerk)
└── src/hooks/use-navigation.ts
```

## Remaining Work

Tracked in `TASKS.todo`. Highlights:

- Build backend plan generation API with OpenAI + Zod validation.
- Implement plan persistence with Prisma & Supabase, plus NextAuth session protection.
- Flesh out frontend plan management (save/regenerate/export), add additional dashboard charts/tables.
- Polish UI/UX, responsive behavior, and prepare deployment to Vercel with production env vars.

## License

TaskCrafter is released under the [MIT License](LICENSE).
