# Progress — Canvo Storefront

## Project Overview
Canvo is an e-commerce storefront built on Next.js 16 (App Router, Turbopack). Core flows: product catalog, cart, checkout, orders, user account, and protected admin-like routes. Auth is Better Auth (email/password only). Data layer is Drizzle ORM on Neon Postgres (serverless).

## Stack
- Next.js 16.4.3, App Router, Turbopack
- TypeScript (strict), Tailwind CSS v4
- Drizzle ORM + Neon Postgres (serverless)
- Better Auth (email/password, no OAuth)
- zod (runtime validation)

## Decisions Made
- **Guest orders removed**: login is mandatory to place an order (`orders.userId` is `NOT NULL`, `onDelete: "restrict"`).
- **Checkout protected**: `/account`, `/admin`, `/checkout` require a session via `src/proxy.ts`; unauthenticated users are redirected to `/login?redirect=<path>`.
- **Redirect param preserved**: login/register accept `?redirect=` and send users back after sign in/sign up. Redirects are sanitized (must start with `/`, no `//` or `\`, never `/login` or `/register`).
- **Orders API server-authoritative**: `POST /api/orders` returns `401` without a session; `userId` and `customerEmail` come from the Better Auth session, never from the request body.
- **Order page owner-only**: `/orders/[orderNumber]` shows 404 to non-owners; email-gate access removed.
- **Checkout prefilled**: server wrapper reads the session and passes `initialName`/`initialEmail` to the client form.
- **Transaction safety**: `src/db/index.ts` has `withTransaction()` using a scoped `Pool` + `drizzle-orm/neon-serverless` (neon-http driver does not support transactions); `neonConfig.webSocketConstructor = globalThis.WebSocket` set at import.
- **Migration strategy**: DB was created via `db:push` (empty `__drizzle_migrations`), so migration history was backfilled for `0000–0002` and `0003_smiling_oracle.sql` was applied through `drizzle-kit migrate`.

## What Is Done
- Better Auth: email/password only, `usePlural: true`, `generateId: "uuid"`, `baseURL` wired via `NEXT_PUBLIC_BETTER_AUTH_URL`.
- Auth pages: `/login` and `/register` with redirect support.
- Proxy (`src/proxy.ts`): replaces deleted `src/middleware.ts`; protects `/account`, `/admin`, `/checkout`.
- Schema: `order_status`, `payment_status`, `payment_method` enums; `orders.userId` NOT NULL restrict FK + index.
- Migration `0003_smiling_oracle.sql` applied to Neon.
- Order page owner-only; checkout prefilled from session; order success redirects without `?email=`.
- `npm run lint` and `npm run build` both pass cleanly (21 pages; `/account`, `/checkout`, `/orders/[orderNumber]` dynamic; `/login`, `/register` static).
- Committed: `841e2c2` "feat: require login to place orders; protect checkout via proxy" (18 files).

## What Is Next
- Verify end-to-end flows manually (login → checkout → order → order page; access control for other users).
- Consider adding rate limiting on order access / auth endpoints.
- Consider adding a "sign out" option on desktop header (currently only mobile).
- Consider fixing static "Order Confirmed" copy to reflect real `status`/`paymentStatus`.
- Consider pagination on `/account` order list.
- Keep PROGRESS.md updated after each completed feature.
