# Homeit Furniture — Bilingual Commerce Application

A furniture storefront and administration application with Arabic and English content.

## Features
- Product catalog, categories, product details, cart and checkout.
- Wishlist, contact messages and configurable homepage content.
- Admin pages for products, categories, orders, messages and homepage management.
- Express endpoints backed by PostgreSQL.

## Tech stack
React, TypeScript, Vite, Tailwind CSS, TanStack Query, Express 5, Drizzle ORM, PostgreSQL, bcrypt and JWT.

## Architecture
- `artifacts/majalis-alraqi/`: storefront and admin frontend.
- `artifacts/api-server/`: API and uploads.
- `lib/db/`: relational schema and database connection.
- `lib/api-spec/`: API contract and code generation.
- `lib/api-client-react/`, `lib/api-zod/`: shared API packages.

Orders and order items store product snapshots; products, categories, users, wishlist entries and contact messages have separate models.

## Installation
Use Node.js 22 and pnpm 10 (the lockfile format is 9.0; pnpm 11 and later refuse the workspace's build-script settings).
```bash
npx pnpm@10 install --frozen-lockfile
```
Supply environment variables in the process environment. A root `.env` file is not automatically loaded by all workspace commands.

## Environment and local development
See `.env.example`. Set `DATABASE_URL` to a local database and generate a strong `SESSION_SECRET` (at least 32 characters; the API refuses to start with a missing or placeholder secret). `CORS_ORIGINS` lists allowed cross-origin frontends; when it is empty only same-origin requests are allowed. Behind a reverse proxy, set `TRUST_PROXY` to the number of proxy hops so the login limit counts real client addresses.

Demo data (development only; refuses to run with `NODE_ENV=production`):
```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='a-unique-12+-character-password' pnpm --filter @workspace/scripts run seed
```
In a POSIX shell, with database and secret variables already exported:
```bash
pnpm --filter @workspace/db run push
PORT=3001 pnpm --filter @workspace/api-server run dev
```
In a second terminal:
```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/majalis-alraqi run dev
```
The current Vite configuration does not supply an API proxy. Configure a local reverse proxy for `/api`, or a deliberate API base URL, before testing full frontend/API flows.

## Validation and build
```bash
pnpm run typecheck
PORT=5173 BASE_PATH=/ pnpm run build
npm run test:security
```
Checked on 24 November 2026 (Node.js 22, pnpm 10, PostgreSQL 16, demo data only): a frozen-lockfile install, typecheck, build and 13 unit tests; and against the running API with a real database: order totals calculated from stored prices in integer hundredths (client-sent prices ignored), rejection of invalid, unknown and out-of-stock items, full rollback when inserting order items fails, the login limit (429 after 10 attempts), rejection of non-image uploads disguised as images, and refusal to start with a weak `SESSION_SECRET`. This was not a browser end-to-end or production test.

Known limits: the login limit is per process (not shared across replicas); logout removes the token on the client but does not revoke issued JWTs; upload checks identify the image container but do not fully decode images; upload URLs are relative (`/api/uploads/...`), so a frontend on a different domain needs a proxy or API base URL.

## API
Route modules cover authentication, categories, products, orders, contact, homepage, wishlist and uploads. Administrative routes require authorization. Order creation accepts only product IDs and integer quantities (1–100, up to 100 lines), reads prices from the database and saves the order and its items in one transaction.

## Contribution
The history includes Replit-assisted development. Repository ownership alone does not establish authorship of every feature; describe personally implemented changes with commit evidence.

## Screenshots and demo
<!-- Add sanitized desktop catalog, mobile checkout and admin order screenshots. -->
No public deployment URL has been verified.

## Future work
Automate the API integration checks above in CI, add browser end-to-end tests and complete a sanitized demo deployment.
