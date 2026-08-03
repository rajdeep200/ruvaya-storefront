# API Endpoints Required — Ruvaya Admin/Backend API

Handoff list for building `ruvaya-admin-api`. This storefront (`ruvaya-admin-api` base URL via
`NEXT_PUBLIC_API_BASE_URL`) is a pure API client with zero database — every endpoint below must be implemented
server-side. Full request/response shapes, error codes, and business rules are in `docs/api-contract.md` in this
repo (source of truth — Zod-validated against these exact shapes). This file is just the flat endpoint list.

## Conventions (apply to every endpoint)
- Success: `{ "success": true, "data": <shape> }`
- Error: `{ "success": false, "error": { "code": string, "message": string, "details"?: unknown } }`
- Error codes: `VALIDATION_ERROR` (422), `AUTH_EXPIRED` (401), `NOT_FOUND` (404), `PRODUCT_UNAVAILABLE` (409),
  `PRICE_CHANGED` (409), `PAYMENT_PENDING` (202), `PAYMENT_FAILED` (402)
- Money: `{ amount: number, currency: "INR" }`, amount in whole rupees
- Backend is source of truth for price/availability/discounts/coupons/shipping/payment/order status

## Storefront content
- `GET /storefront/config` — announcement bar, contact info, footer, socials, legal text, maintenance flag
- `GET /storefront/homepage` — hero, shop-by-collection, best sellers, seasonal banner, trust items, featured reviews, style gallery
- `GET /navigation` — header/mobile nav tree

## Catalogue
- `GET /products` — filterable/sortable list (query: collection, sort, sizes, colors, fabrics, occasions, priceMin, priceMax, page, pageSize)
- `GET /products/:slug` — full product detail (color variants, per-size stock, measurements, similar products)
- `GET /collections` — collection summaries
- `GET /collections/:slug` — collection detail + member products
- `GET /campaigns` / `GET /campaigns/:slug` — sale/campaign pages; `status` (upcoming|active|expired) computed server-side from startAt/endAt

## Search
- `GET /search?mode=suggest&q=...` — debounced autosuggest (needs to be fast)
- `GET /search?mode=results&q=...&page=...` — full search results

## Cart / checkout / payment
- `GET /serviceability?pincode=...` — pincode delivery check
- `POST /cart/validate` — revalidates lines, prices, coupon, shipping, returns `isCheckoutBlocked`
- `POST /checkout` — creates order + Cashfree payment session; idempotent via `Idempotency-Key` header
- `GET /payments/status?orderId=...` — polled every 3s post-payment; only source of truth for payment success besides the Cashfree webhook
- `POST /payments/retry` — new payment session for an existing unpaid order

## Orders
- `POST /orders/track` — `{orderNumber, contact}` → `{secureToken}`
- `GET /orders/:secureToken` — full order detail + status timeline (secureToken must be opaque/non-guessable, never a raw ID or the order number)

## Reviews
- `GET /reviews?productId=&sort=&withPhotos=&verifiedOnly=&page=`
- `GET /reviews/:secureToken` — review-submission context for a post-purchase review link
- `POST /reviews/:secureToken` — multipart submission (up to 5 images); backend alone sets `isVerifiedPurchase`

## Misc
- `POST /analytics/events` — batched event ingestion (max 25/batch), never blocks the UI
- `POST /newsletter` — `{email, source}`
- `POST /support` — contact form

## Not part of the backend
- `POST /api/revalidate` lives in **this** repo (Next.js), not the backend — but the admin backend should call it
  after content changes. Contract in `docs/deployment.md`.

---
For exact request/response TypeScript shapes and per-endpoint business rules, read `docs/api-contract.md` in full —
this file intentionally omits payload details to stay a quick reference.
