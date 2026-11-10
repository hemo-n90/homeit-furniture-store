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
Use Node.js and pnpm compatible with the workspace lockfile.
```bash
pnpm install --frozen-lockfile
```
Supply environment variables in the process environment. A root `.env` file is not automatically loaded by all workspace commands.

## Environment and local development
See `.env.example`. Set `DATABASE_URL` to a local database and generate a strong `SESSION_SECRET`.
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
```
Runtime and build success have not been verified by this documentation update.

## API
Route modules cover authentication, categories, products, orders, contact, homepage, wishlist and uploads. Administrative routes require authorization. Order creation reads product prices from the database.

## Contribution
The history includes Replit-assisted development. Repository ownership alone does not establish authorship of every feature; describe personally implemented changes with commit evidence.

## Screenshots and demo
<!-- Add sanitized desktop catalog, mobile checkout and admin order screenshots. -->
No public deployment URL has been verified.

## Future work
Add integration tests for authorization, order totals and transaction rollback; complete a sanitized demo deployment.
