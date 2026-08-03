# API Contract — `ruvaya-admin-api`

This document specifies the HTTP contract this storefront expects from `NEXT_PUBLIC_API_BASE_URL`. Every shape
below is enforced at runtime by the Zod schemas in `src/lib/validation/` (the storefront never trusts an
unvalidated response — a malformed body surfaces as a typed `ValidationApiError` instead of corrupting UI state).

## Conventions

- **Success envelope**: every endpoint returns `{ "success": true, "data": <shape below> }`.
- **Error envelope**: `{ "success": false, "error": { "code": string, "message": string, "details"?: unknown } }`.
- **Error codes** the storefront understands and maps to typed errors (`src/lib/api/errors.ts`):
  `VALIDATION_ERROR` (422), `AUTH_EXPIRED` (401), `NOT_FOUND` (404), `PRODUCT_UNAVAILABLE` (409),
  `PRICE_CHANGED` (409), `PAYMENT_PENDING` (202), `PAYMENT_FAILED` (402). Anything else is treated as a generic
  server error.
- **Currency**: all monetary amounts are `{ amount: number, currency: "INR" }`, amount in whole rupees (not paise).
- The backend is the **source of truth** for price, availability, discounts, coupons, shipping and payment/order
  status. The storefront only displays what it fetches — every checkout is revalidated server-side before payment.

---

## `GET /storefront/config`

Site-wide chrome content — announcement bar, contact info, footer, social links, legal text, maintenance flag.

**Response** → `StorefrontConfig` (`src/lib/validation/storefrontConfig.ts`):
```ts
{
  announcementMessages: string[];
  whatsappNumber: string;
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
  addressLine: string;
  socialLinks: { platform: string; href: string }[];
  footerColumns: { heading: string; links: { label: string; href: string }[] }[];
  legalText: string;
  maintenanceMode: boolean;
}
```
When `maintenanceMode` is `true`, the entire storefront renders a maintenance page instead of any route content.

## `GET /storefront/homepage`

All content for `/`. See `HomepageResponse` in `src/lib/validation/homepage.ts` — hero, shop-by-collection,
best sellers, seasonal campaign banner (nullable), trust items, featured reviews, style inspiration gallery,
newsletter/WhatsApp copy. Any array may be empty; the storefront hides that section gracefully rather than
rendering a broken block.

## `GET /navigation`

```ts
{ primary: { id: string; label: string; href: string; isSale: boolean }[] }
```
Drives the header nav and mobile menu. Add a `Sale` entry here (with `isSale: true`) to surface it in red in the
header when a campaign goes live — no code change needed.

## `GET /products`

Query params: `collection` (slug), `sort` (`newest|popularity|price_asc|price_desc`), `sizes`, `colors`, `fabrics`,
`occasions` (comma-separated), `priceMin`, `priceMax`, `page`, `pageSize`.

**Response** → `ProductListResponse`: `{ items: ProductListItem[]; filters: ProductFilterOptions; totalItems: number }`.
`filters` should reflect the **full unfiltered** catalogue (or the current collection's catalogue) so filter chips
don't disappear as the user narrows results.

## `GET /products/:slug`

**Response** → `ProductDetail` (`src/lib/validation/product.ts`) — includes `colorVariants` (each with its own
`images` and per-size `inStock`), `measurements`, `modelInfo`, fabric/fit/care text, `similarProductSlugs`.
`404 NOT_FOUND` if the slug doesn't exist.

## `GET /collections`

**Response** → `CollectionSummary[]` — used for "Shop by Collection" and nav.

## `GET /collections/:slug`

**Response** → `CollectionDetail` — `products` here should already reflect any collection-scoped business rules
(e.g. `best-sellers` = bestseller-badged products), but the storefront additionally calls
`GET /products?collection=:slug&...` for the actual filterable/sortable grid, so both endpoints must agree on
membership.

## `GET /search?mode=suggest&q=...`

**Response** → `SearchSuggestionsResponse`: `{ popularSearches: string[]; productSuggestions: ProductListItem[]; collectionSuggestions: CollectionSummary[] }`. Called on every debounced keystroke (300ms) from the search overlay — keep this fast.

## `GET /search?mode=results&q=...&page=...`

**Response** → `SearchResultsResponse`: `{ query, products: ProductListItem[], collections: CollectionSummary[], totalItems }`.

## `GET /serviceability?pincode=...`

**Response** → `ServiceabilityResponse`: `{ pincode, isServiceable, city?, state?, estimatedDeliveryDays?, codAvailable, message? }`.

## `POST /cart/validate`

**Request** → `CartValidationRequest`: `{ lines: {productId, productSlug, colorId, size, quantity}[], couponCode?, pincode? }`.

**Response** → `CartValidationResponse`: per-line availability/price-changed flags plus `subtotal`, `discount`,
`shippingFee`, `total`, `couponApplied`/`couponError`, and `isCheckoutBlocked` (true if any line is unavailable —
the storefront disables checkout when this is true). Called on the cart page and checkout page, debounced ~300-400ms
after any cart/coupon/pincode change.

## `POST /checkout`

**Request** → `CheckoutRequest`: `{ idempotencyKey, address, lines, couponCode?, affiliateCode?, utm? }`. The
`Idempotency-Key` header is also sent with the same value — **the backend must treat retried requests with the same
key as the same order**, not create a duplicate.

**Response** → `CheckoutResponse`: `{ orderId, orderNumber, paymentSessionId, paymentGatewayOrderId, amount, currency }`.
The backend must have already revalidated prices/availability/coupon/shipping server-side before returning this —
`amount` is what the storefront tells Cashfree to charge.

Errors: `PRICE_CHANGED` or `PRODUCT_UNAVAILABLE` if the cart changed between validate and checkout (the storefront
shows a specific "please review your cart" message for these, not a generic error).

## `GET /payments/status?orderId=...`

Security migration: the legacy wire-field name `orderId` is retained, but its value is now the opaque, random,
expiring payment capability returned by checkout. It is not a database ID or order number. Status and retry calls
must echo that capability unchanged.

**Response** → `PaymentStatusResponse`: `{ orderId, orderNumber, status, amountPaid, canRetry, moneyMayBeDeducted, message }`.
`status` is one of `created|pending|success|failed|cancelled|user_dropped|expired`. Polled every 3s (up to ~45s) by
`/payment/status` after returning from Cashfree. **This endpoint, together with the Cashfree webhook, is the only
source of truth for payment success** — the storefront never marks an order paid based on the redirect URL alone.

## `POST /payments/retry`

**Request**: `{ orderId }`. **Response** → `PaymentRetryResponse`: `{ paymentSessionId, paymentGatewayOrderId, amount, currency }` — a new Cashfree session for the **same** order (never creates a duplicate order).

## `POST /orders/track`

**Request** → `TrackOrderRequest`: `{ orderNumber, contact }` (contact = phone or email used at checkout).
**Response** → `{ secureToken }`. `404 NOT_FOUND` if no match.

## `GET /orders/:secureToken`

**Response** → `OrderDetail` — full order with `timeline` (ordered array of `{status, label, timestamp, completed}`),
items, amounts, shipping address. `secureToken` must be an opaque, non-guessable token — **never** a raw database ID
or the human-readable order number. Return `AUTH_EXPIRED` for an expired/rotated token (the storefront shows a
distinct "this link expired, track again" state) and `NOT_FOUND` for a token that never existed.

## `GET /reviews?productId=&sort=&withPhotos=&verifiedOnly=&page=`

**Response** → `ReviewListResponse`: `{ summary: RatingSummary, reviews: Review[], totalItems }`. `isVerifiedPurchase`
on each review is backend-determined — the storefront has no way to set it.

## `GET /reviews/:secureToken`

**Response** → `ReviewTokenContext`: `{ isValid, productName?, productImage?, orderNumber?, purchasedSize?, alreadySubmitted }`.

## `POST /reviews/:secureToken`

**Request**: `multipart/form-data` with fields `rating, title, text, fitFeedback?, purchasedSize?, heightCm?,
recommend?, displayConsent` plus up to 5 `images` file parts. **Response** → `{ submitted: boolean, message: string }`.
The backend alone decides `isVerifiedPurchase` for the resulting review — it is not, and must never become, a field
the client can set.

## `POST /analytics/events`

**Request**: `{ events: AnalyticsEvent[] }` (max 25 per batch, see [`docs/analytics-events.md`](analytics-events.md)
for the full schema). **Response**: `{ accepted: number }`. Never blocks the UI — the storefront queues and retries
on the client, and does not surface failures to the user.

## `POST /newsletter`

**Request**: `{ email, source: "homepage" | "footer" }`. **Response**: `{ subscribed: boolean, message: string }`.

## `POST /support`

**Request**: `{ name, email, orderNumber?, message }`. **Response**: `{ received: boolean, message: string }`.

## `GET /campaigns` / `GET /campaigns/:slug`

Not in the original brief's endpoint list but required to drive `/sale/[slug]` and the sitemap — a natural extension
of the "campaigns must be backend-driven" requirement. **Response** → `Campaign[]` / `Campaign`
(`src/lib/validation/campaign.ts`): `status` (`upcoming|active|expired`) must be computed **server-side** from
`startAt`/`endAt` — the storefront renders whichever state the backend reports, it does not compute eligibility
itself.

---

## On-demand revalidation

`POST /api/revalidate` (this repo, not the backend) — see [`docs/deployment.md`](deployment.md) for the contract
the admin API should call after content changes.
