# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Full-stack Arabic e-commerce site "Majalis Al-Raqi" (مجالس الراقي) — a luxury furniture store.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + TypeScript + Tailwind + Framer Motion
- **File uploads**: multer (images saved to `artifacts/api-server/uploads/`)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### `artifacts/majalis-alraqi` (web, port via PORT env)
Full Arabic RTL e-commerce storefront with:
- **Pages**: Home, Products, ProductDetail, Cart, Checkout, OrderSuccess, About, Contact, Wishlist, FAQ, Returns
- **Admin pages**: Login, Dashboard, Products (with image upload), Orders, Categories, Homepage (slider management), Messages
- **Components**: HeroSlider (5 slides auto-rotate, Framer Motion), Navbar (transparent on home, mobile drawer), ProductCard, Footer, WhatsAppButton

### `artifacts/api-server` (API, port 8080)
Express REST API with:
- **Routes**: /api/products, /api/orders, /api/categories, /api/homepage, /api/contact, /api/wishlist, /api/auth, /api/upload
- **File uploads**: POST /api/upload (multer, max 10MB, images only) → files saved to `uploads/` → served at `/api/uploads/`
- **Auth**: JWT in `Authorization: Bearer` header for admin routes
- **Static**: `/api/uploads/` served as static files

## Admin Access
- URL: `/admin` or `/admin/login`
- Default credentials: `admin@majalis-alraqi.com` / `admin123456`
- JWT stored in `localStorage` as `admin_token`
- All API calls automatically include the token via `setAuthTokenGetter`

## Hero Slider
- Default: 5 beautiful Unsplash luxury interior images
- Admin can customize via Admin > Homepage (stored as JSON array in `homepage_settings.hero_image`)
- If `heroImage` field is a JSON array → used as custom slides; otherwise defaults are shown

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
