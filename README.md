# DevPulse

Next.js app for developers to publish projects, collect community feedback, and rank builders by project engagement.

## Problem It Solves

Developers need a lightweight place to share launches, gather useful reactions, and see which projects are gaining traction. DevPulse combines a project showcase with voting, comments, stack tags, view counts, and developer leaderboards. The repository also includes a separate feedback/roadmap workflow for collecting feature ideas and letting an admin move them through statuses.

## Key Features

- Project discovery feed at `/projects` with tag filters, pagination, and sorting by newest, trending, votes, comments, or views.
- Authenticated project submission wizard at `/projects/new` for title, tagline, version, description, tags, languages, frameworks, screenshot URLs, repository URL, and demo URL.
- Project detail pages at `/projects/[slug]` with screenshots, links, stats, persisted upvotes, persisted comments, and comment type filters for discussion, feature requests, and bug reports.
- Pulse Score calculation based on upvotes, comments, views, and optional followers.
- Developer leaderboard at `/leaderboards` ranked from projects, upvotes, comments, views, and Pulse Score.
- Clerk authentication with sign-in/sign-up pages and a synced local `User` table.
- Feedback board at `/feedback` for feature/improvement/bug/design/other posts, with authenticated vote toggling.
- Roadmap page at `/roadmap` that groups feedback posts by `under_review`, `planned`, `in_progress`, and `completed`.
- Admin page at `/admin` for admin users to update feedback status.
- API routes for feedback posts, feedback votes, project lookup, and leaderboards.
- Dark themed UI built from local shadcn/Radix-style components, Tailwind CSS utilities, Lucide icons, Sonner toasts, and next-themes.

## Tech Stack

- Next.js 16.2.7 App Router
- React 19.2.4 and TypeScript 5
- Clerk for authentication (`@clerk/nextjs`, `@clerk/clerk-react`, Clerk UI/themes packages)
- Prisma 7.8.0 with generated client output in `generator/prisma`
- PostgreSQL via `pg` and `@prisma/adapter-pg`
- Tailwind CSS 4 with `@tailwindcss/postcss` and `tw-animate-css`
- shadcn/Radix-style component setup (`components.json`, `radix-ui`, `class-variance-authority`, `tailwind-merge`, `clsx`)
- Lucide React icons
- Sonner notifications
- date-fns for relative dates
- next-themes for theme switching
- ESLint 9 with `eslint-config-next`

## Folder Structure

```text
feedback-fusion/
|-- app/                    # Next.js pages, layouts, server actions, API routes, and shared route data
|   |-- (auth)/             # Clerk sign-in and sign-up routes
|   |-- (main)/             # Main project and leaderboard pages
|   |-- actions/            # Server actions for projects, comments, votes, tags, and leaderboards
|   |-- api/                # Route handlers for feedback, votes, projects, and leaderboards
|   |-- data/               # Feedback category and roadmap status metadata
|   |-- feedback/           # Feedback list and new feedback page
|   |-- admin/              # Admin feedback status management page
|   `-- roadmap/            # Feedback roadmap page
|-- components/             # Reusable app components and local UI primitives
|   `-- ui/                 # shadcn/Radix-style primitives such as buttons, cards, tables, selects
|-- lib/                    # Prisma client setup, Clerk user sync, slug helper, score helper, utilities
|-- prisma/                 # Prisma schema and PostgreSQL migrations
|-- generator/prisma/       # Checked-in Prisma generated client files
|-- public/                 # Static SVG assets and favicon
|-- proxy.ts                # Clerk middleware proxy configuration
|-- components.json         # shadcn component configuration
|-- next.config.ts          # Next.js configuration
`-- prisma.config.ts        # Prisma 7 configuration and DATABASE_URL wiring
```

## Setup & Installation

Prerequisites:

- Node.js and npm. This workspace was checked with Node `v20.19.4` and npm `10.8.2`; `npm install --dry-run` completed with a Prisma dependency engine warning for Node 20.
- PostgreSQL database.
- Clerk application with publishable and secret keys.

1. Clone the repository:

```bash
git clone <repo-url>
cd feedback-fusion
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
```

4. Apply the database migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful scripts:

| Command | Purpose | Current status checked |
| --- | --- | --- |
| `npm run dev` | Start local Next.js dev server | Expected app command |
| `npm run build` | Build production app | Succeeds in this workspace, but `/` and `/roadmap` each retried once after taking more than 60 seconds during static generation |
| `npm run start` | Start the built production app | Requires a successful build first |
| `npm run lint` | Run ESLint | Currently exits non-zero; see limitations |

## API Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/feedback` | No | Return feedback posts with authors and votes, newest first. |
| `POST` | `/api/feedback` | Clerk user required | Create a feedback post from `title`, `description`, and `category`. |
| `POST` | `/api/vote` | Clerk user required | Toggle the current user's vote on a feedback post using `postId`. |
| `PATCH` | `/api/feedback/[id]/status` | Admin user required | Update a feedback post status to `under_review`, `planned`, `in_progress`, or `completed`. |
| `GET` | `/api/projects/[id]` | No | Return a project by cuid-like id or slug, incrementing its view count. |
| `GET` | `/api/leaderboards?limit=25` | No | Return top developers ranked by computed Pulse Score. |

Example feedback request:

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"title":"Add saved filters","description":"Let users save common project filters.","category":"Feature"}'
```

Project creation, project upvotes, and project comments are implemented as Next.js server actions in `app/actions/projects.ts` and are called from the React UI rather than exposed as dedicated REST endpoints.

## Known Limitations

- `npm run lint` currently fails on two `react/no-unescaped-entities` errors in `components/ProjectWizard.tsx`; it also reports warnings for custom font links, `<img>`, and unused imports.
- There are no automated tests in the repository.
- Some UI copy is aspirational: AI auto-tagging, privacy controls, XP awards, code indexing, follows, and notifications have no complete implementation path in the current code.
- The `AiAnalysis`, `Follow`, and `Notification` Prisma models exist, but the app does not create or manage those records yet. Project detail pages only display AI analysis if rows already exist.
- Project comment upvotes in `ProjectDetailClient` are local client state and are not persisted.
- Leaderboard timeframe links (`weekly`, `monthly`, `all`) do not change the database query; rankings are currently all-time.
- The first user created through `syncCurrentUser` is assigned the `admin` role, but user records are only synced when code paths call that helper, such as submitting projects, feedback, or votes.
- Project slugs are generated from titles and same-title project creation is rejected instead of creating unique suffixes.
- No `LICENSE` file is present in the repository.
