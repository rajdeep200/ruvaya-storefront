# Security Notes

## What this repository deliberately does not contain

- **No database access.** No Prisma, no PostgreSQL driver, no `DATABASE_URL`. Every dynamic read/write goes through
  `NEXT_PUBLIC_API_BASE_URL` (`ruvaya-admin-api`).
- **No Cashfree secrets.** The client secret and webhook secret live only in `ruvaya-admin-api`. This repo loads
  Cashfree's public hosted-checkout script (`src/lib/cashfree/loadSdk.ts`) and only ever handles a
  `paymentSessionId` the backend already created.
- **No Cloudinary API secret.** Only `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (public, used to build/validate image
  URLs) is present.
- **No admin code, supplier costs, Meesho URLs, or admin dependencies.**

## Trust boundaries

- **Price and availability**: the storefront may display prices/discounts from `/products` and `/collections`, but
  every checkout is revalidated server-side via `POST /cart/validate` immediately before `POST /checkout`. Nothing
  from `localStorage` (cart line "snapshot" prices) is ever sent to the backend as an authoritative price — see the
  comment on `CartLine.unitPriceSnapshot` in `src/store/cart.ts`.
- **Payment success**: never inferred from a redirect URL, query parameter, or any client-side state. Only
  `GET /payments/status` (backed by the Cashfree webhook on the backend) determines success — see
  `src/components/payment/PaymentStatusClient.tsx`.
- **Order URLs**: `/orders/[secureToken]` uses an opaque, backend-issued token — never a raw database ID or the
  human-readable order number. `/order-confirmation/[orderNumber]` (the immediate post-checkout thank-you page) is
  keyed by order number for a friendly URL, but **does not fetch order data from the backend by that number** —
  order numbers are human-readable and guessable. It only renders using data already held in this browser's local
  state from the checkout that just completed (`src/store/lastOrder.ts`); any other browser/session hitting the
  same URL sees a safe fallback directing them to Track Order instead.
- **Reviews**: `isVerifiedPurchase` is a backend-only field. The review submission form
  (`ReviewSubmissionValues` in `src/lib/validation/review.ts`) has no field that could set it — the client cannot
  claim a review is a verified purchase.
- **Idempotency**: checkout submissions carry a client-generated `idempotencyKey` (persisted across retries via
  `useCheckoutDraftStore`) so a network retry or double-click cannot create two orders, assuming the backend
  honours the `Idempotency-Key` header/body field as a dedupe key.

## Input handling

Payment status and retry use checkout's legacy-named `orderId` field as an opaque payment capability. The value is
random and expiring; it is never a backend database ID or human-readable order number.

- All form input is validated with Zod (`src/lib/validation/*`) both client-side (via `@hookform/resolvers/zod`)
  and expected server-side by the backend.
- All backend responses are Zod-validated before use (`src/lib/api/client.ts`) — a malformed response cannot
  silently corrupt UI state; it surfaces as a typed `ValidationApiError`.
- JSON-LD structured data (`src/components/common/JsonLd.tsx`) escapes `<` to `<` before injection, so no
  product/review content can prematurely close its own `<script>` tag.
- The `/api/revalidate` route requires an exact match against `REVALIDATION_SECRET` (server-only env var, never
  exposed via `NEXT_PUBLIC_*`) before performing any cache invalidation.

## Cookies, storage and consent

- No authentication cookies exist in this repo (guest-only checkout, no login).
- `localStorage`/`sessionStorage` hold only: cart lines, wishlist, recently-viewed products, checkout draft
  (address form + non-sensitive order references), consent choice, recent searches, and anonymous
  visitor/session IDs — never payment details.
- Marketing analytics (GA4/Meta) only load after explicit consent; first-party operational analytics never include
  full address, full phone number, or payment details (see [`docs/analytics-events.md`](analytics-events.md)).
