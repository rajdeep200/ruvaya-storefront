# Ruvaya Storefront

The customer-facing storefront for **Ruvaya**, a pan-India women's kurti brand. This repository contains **only**
the storefront — the admin dashboard, product/order/refund management, database and Cashfree secret-side
implementation live in the separate `ruvaya-admin-api` repository.

```
Ruvaya Storefront (this repo)
    ↓ HTTPS API calls (NEXT_PUBLIC_API_BASE_URL)
Ruvaya Admin/API application (ruvaya-admin-api)
    ↓ Prisma
PostgreSQL
```

This storefront **never** connects to PostgreSQL, never imports Prisma, and never holds a Cashfree client secret,
webhook secret, or Cloudinary API secret. See [`docs/security-notes.md`](docs/security-notes.md).

## Tech Stack

- **Next.js 16** (App Router, React Server Components by default)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS-first `@theme` design tokens)
- **Radix UI primitives** for accessible dialogs, sheets and accordions
- **React Hook Form + Zod** for all forms and runtime validation
- **Zustand** (+ `persist`) for cart, wishlist, checkout draft and consent state
- **Cashfree Hosted Checkout** (loaded via the official script-tag build, no npm dependency)

No unit-testing framework is installed by design — see [`docs/manual-qa-checklist.md`](docs/manual-qa-checklist.md)
for the manual QA process, and `npm run verify` for the automated gate (typecheck + lint + build).

## Getting Started

```bash
npm install
cp .env.example .env.local   # defaults already run the full site in mock mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). With the default `.env.example` values, the entire site —
homepage, 15-product catalogue, cart, checkout, a simulated Cashfree payment flow, orders and reviews — works with
**no backend running at all**.

### Switching to the real backend

Set these two variables once `ruvaya-admin-api` is deployed and reachable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.ruvaya.example.com
NEXT_PUBLIC_USE_MOCK_API=false
```

No component code changes are required — every function in `src/lib/api/*` branches on `NEXT_PUBLIC_USE_MOCK_API`
internally.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (flat config, `eslint-config-next` + React Compiler rules) |
| `npm run format` / `format:check` | Prettier (with `prettier-plugin-tailwindcss`) |
| `npm run verify` | typecheck → lint → build, the CI gate |

## Project Structure

```
src/
├── app/                  # Routes (App Router) — see docs/api-contract.md for the full route list
├── components/
│   ├── common/            # Cross-cutting: EmptyState, JsonLd, Toaster, SearchOverlay, MarketingScripts...
│   ├── layout/             # Header, Footer, AnnouncementBar, nav, mobile sheet
│   ├── homepage/           # Sections matching the approved homepage design
│   ├── product/            # Gallery, purchase panel, size guide, wishlist button, cards
│   ├── collection/         # Listing controls, filter panel, product grid
│   ├── cart/               # Cart drawer, line rows, summary
│   ├── checkout/           # Address form, checkout orchestrator
│   ├── payment/            # Payment status client, mock Cashfree simulator
│   ├── order/              # Order timeline, track-order form, confirmation
│   ├── reviews/            # Star rating, review card/summary, submission form, image upload
│   └── support/            # FAQ accordion, contact form
├── lib/
│   ├── api/                # THE typed API client layer — see below
│   ├── analytics/          # First-party analytics client (queue, attribution, GA4/Meta boundary)
│   ├── cashfree/           # Cashfree script loader + checkout() wrapper
│   ├── validation/         # Zod schemas — single source of truth for every data shape
│   ├── formatting/         # Currency/date formatting
│   ├── storage/            # Safe localStorage/sessionStorage, visitor/session identity
│   ├── mock/               # 15-product mock catalogue + all other mock-mode data
│   └── seo/                # JSON-LD structured data builders
├── store/                  # Zustand stores: cart, wishlist, checkoutDraft, lastOrder, consent, toast, ui
├── types/                   # Ergonomic re-exports of validation types
├── hooks/                   # useToast, useProductFilters
└── config/                  # env.ts — the only place `process.env.NEXT_PUBLIC_*` is read
```

## Design System

Design tokens (extracted from the approved homepage reference) live in `src/app/globals.css` as CSS custom
properties, mapped into Tailwind v4's `@theme inline` block. Every component consumes token-based utility classes
(`bg-primary`, `text-text-secondary`, `border-border`, …) — no raw hex colours are hardcoded in components. See
[`docs/design-tokens.md`](docs/design-tokens.md) for the full palette and rationale, including how to swap in exact
brand hex values later.

The Ruvaya logo is currently a hand-built circular SVG badge (`src/components/common/RuvayaLogo.tsx`), recreated
from the header shown in the approved homepage screenshot — no isolated logo source file was provided. Swap the
markup in that one file if the brand supplies the original logo asset.

## Mock Mode

`NEXT_PUBLIC_USE_MOCK_API=true` (the default) routes every function in `src/lib/api/*` to `src/lib/mock/*` instead
of a real network call. The mock catalogue has exactly 15 products spanning everyday, office-wear, cotton, festive
and kurti-set categories — see `src/lib/mock/products.ts`. Mock product photography is generated on the fly by
`src/app/mock-image/route.tsx` and is watermarked "MOCK PRODUCT IMAGE" so it's never mistaken for real Cloudinary
photography.

## Documentation Index

- [`docs/api-contract.md`](docs/api-contract.md) — every backend endpoint this storefront expects, request/response shapes
- [`docs/analytics-events.md`](docs/analytics-events.md) — the full analytics event schema and when each fires
- [`docs/cashfree-sandbox-checklist.md`](docs/cashfree-sandbox-checklist.md) — steps to test the real Cashfree integration
- [`docs/manual-qa-checklist.md`](docs/manual-qa-checklist.md) — the full manual QA pass (no automated tests in this repo)
- [`docs/deployment.md`](docs/deployment.md) — Vercel deployment + environment variable reference
- [`docs/design-tokens.md`](docs/design-tokens.md) — colour/typography tokens and their source
- [`docs/security-notes.md`](docs/security-notes.md) — what this repo deliberately does not contain, and why
