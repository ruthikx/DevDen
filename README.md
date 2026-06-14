# DevPulse 🚀

**A social platform where developers showcase their projects and get real feedback from the community.**

DevPulse (repo: `DevDen`) lets developers publish their work, gather upvotes and downvotes, receive structured feedback, and build a following — all in one place.

---

## Features

- 🚀 **Project Showcase** — Upload projects with descriptions, screenshots, demo links, and GitHub repository URLs
- 👍👎 **Voting System** — Community upvotes and downvotes to surface the best work
- 💬 **Feedback & Comments** — Leave comments, feature requests, and bug reports on any project
- 👥 **Developer Profiles & Following** — Follow developers and stay up to date with their work
- 📈 **Leaderboards & Trending** — Discover the most popular and trending projects in the community

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Auth | [Clerk](https://clerk.com) |
| Database ORM | [Prisma 7](https://www.prisma.io) |
| Database | PostgreSQL (via `pg`) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Lucide React](https://lucide.dev) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Date Utilities | [date-fns](https://date-fns.org) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- A [Clerk](https://clerk.com) account for authentication

### 1. Clone the repository

```bash
git clone https://github.com/ruthikx/DevDen.git
cd DevDen
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devpulse"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
DevDen/
├── app/              # Next.js App Router pages and API routes
├── components/       # Reusable React components
├── lib/              # Utility functions and shared logic
├── prisma/           # Prisma schema and migrations
│   └── schema.prisma
├── public/           # Static assets
├── generator/        # Prisma generator config
├── next.config.ts    # Next.js configuration
├── prisma.config.ts  # Prisma configuration
└── components.json   # shadcn/ui component registry
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Deployment

The easiest way to deploy DevPulse is via [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add all environment variables in the Vercel dashboard
4. Deploy

Make sure your PostgreSQL database is accessible from your deployment environment (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)).

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is open source. See the repository for details.