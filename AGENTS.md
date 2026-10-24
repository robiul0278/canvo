<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (via `@tailwindcss/turbopack`)
- **Drizzle ORM** + **Neon Postgres** (serverless)
- **Better Auth** (email/password + GitHub/Google OAuth)

## Key Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build + typecheck
npm run lint         # ESLint (flat config)
npm run db:generate  # Generate Drizzle migrations
npm run db:push      # Push schema to Neon (dev)
npm run db:migrate   # Run migrations (prod)
npm run db:studio    # Drizzle Studio UI
```

## Architecture

| Path | Purpose |
|------|---------|
| `src/db/schema.ts` | Auth tables (users, sessions, accounts, verifications) |
| `src/db/index.ts` | Drizzle + Neon HTTP client |
| `src/lib/auth/index.ts` | Better Auth server config (Drizzle adapter) |
| `src/lib/auth-client.ts` | Client hooks (`useSession`, `signIn`, etc.) |
| `src/app/api/auth/[...all]/route.ts` | Better Auth API handler |
| `src/middleware.ts` | Auth protection for `/dashboard/*` |

## Environment

Copy `.env.example` → `.env.local` and fill:
- `DATABASE_URL` (Neon connection string)
- `BETTER_AUTH_SECRET` (32+ chars)
- `BETTER_AUTH_URL` (e.g., `http://localhost:3000`)
- OAuth credentials (optional)

## Gotchas

- **Middleware deprecation**: Current `middleware.ts` uses legacy convention. Next.js warns to migrate to `proxy` — run `npx @next/codemod@canary middleware-to-proxy .` when ready.
- **Schema sync**: Better Auth expects specific table names (`user`, `session`, `account`, `verification`). Drizzle schema uses plural (`users`, `sessions`, `accounts`, `verifications`). Run `npm run db:generate` after auth config changes.
- **Client provider**: `AuthProvider` in `layout.tsx` wraps children but doesn't use `SessionProvider` from `next-auth` (not compatible with Better Auth).
- **TypeScript**: Build runs `tsc` — fix type errors before committing.

## Verification Order

```bash
npm run lint && npm run build
```