# Analytics Events

The storefront ships a first-party analytics pipeline (`src/lib/analytics/`) that is independent of GA4/Meta —
every event below is always sent to `POST /analytics/events` so the admin dashboard has complete, first-party data
to build on. GA4 and Meta Pixel are an **optional, consent-gated mirror** of a subset of these events (see
[Consent](#consent) below).

## How it works

- **`track(name, payload)`** (`src/lib/analytics/track.ts`) is the single entry point every component uses.
- Events are validated against `analyticsEventSchema` (Zod) before being queued — a malformed call is dropped and
  logged to the console in development, never sent.
- **Queueing** (`src/lib/analytics/queue.ts`): events batch client-side (flush every 2s or at 20 events) and use
  `navigator.sendBeacon` on tab-hide/page-hide so the last batch survives the user closing the tab. Never blocks
  the calling code — `track()` returns immediately.
- **Identity**: `visitorId` (persisted in `localStorage`, anonymous) and `sessionId` (rolling 30-minute window in
  `sessionStorage`) are attached automatically. No account/login exists, so there is no authenticated customer ID
  today — `customerId` is reserved in the schema for when one exists.
- **Attribution**: UTM params and an affiliate `ref` param are captured from the URL on every navigation
  (last-touch model) and attached to every subsequent event until overwritten by a new set of params.

## What is never sent

Full postal address, full phone number, payment credentials/card details, Cashfree secrets, or any other sensitive
customer detail. Order-level events carry `orderId`/`orderValue`, not the customer's PII.

## Event Schema

Every event (`AnalyticsEvent` in `src/lib/validation/analytics.ts`) has:

```ts
{
  name: AnalyticsEventName;        // see table below
  timestamp: string;                // ISO 8601, set client-side at fire time
  sessionId: string;
  visitorId: string;
  customerId?: string;
  productId?: string;
  variantId?: string;               // color variant id
  collectionId?: string;
  quantity?: number;
  price?: number;
  discount?: number;
  cartValue?: number;
  orderValue?: number;
  currency?: "INR";
  orderId?: string;
  couponCode?: string;
  campaignId?: string;
  affiliateCode?: string;
  utmSource?: string; utmMedium?: string; utmCampaign?: string; utmContent?: string; utmTerm?: string;
  referrer?: string;
  pagePath: string;
  deviceCategory: "mobile" | "tablet" | "desktop";
  metadata?: Record<string, string | number | boolean>;  // event-specific extra fields
}
```

## Events and Trigger Points

| Event | Fired from | When |
| --- | --- | --- |
| `page_view` | `AnalyticsRouteListener` (root layout) | Every client-side navigation |
| `homepage_view` | `/` | Homepage mounts |
| `collection_view` | `/kurtis`, `/collections/[slug]`, `/sale/[slug]` | Listing page mounts |
| `product_view` | `/products/[slug]` | PDP mounts |
| `product_image_interaction` | `ProductGallery` | Thumbnail/slide change |
| `product_video_play` | `ProductGallery` | Product video starts playing |
| `search` | `SearchOverlay`, `/search` | Search submitted / results page landed on directly |
| `search_result_click` | `SearchOverlay` | A product suggestion is clicked |
| `zero_search_results` | `SearchOverlay` | Suggestions return empty for a non-empty query |
| `filter_applied` / `filter_removed` | `useProductFilters` | Size/colour/fabric/occasion/price toggled |
| `sort_changed` | `useProductFilters` | Sort dropdown changed |
| `wishlist_added` / `wishlist_removed` | `WishlistButton`, wishlist/cart pages | Heart toggled, or moved cart↔wishlist |
| `add_to_cart` | `ProductPurchasePanel`, `MoveToCartDialog` | Add to Cart / Buy Now / move-to-cart confirmed |
| `remove_from_cart` | `CartDrawer`, `CartLineRow` | Line removed |
| `cart_quantity_changed` | `CartLineRow` | +/- quantity stepper |
| `cart_view` | `/cart` | Cart page mounts (with `cartValue`) |
| `coupon_applied` / `coupon_failed` | `CartSummary` | Coupon submitted (failure surfaces via the cart-validate response) |
| `begin_checkout` | `CartSummary` | "Proceed to Checkout" clicked |
| `checkout_step_completed` | `CheckoutPageClient` | Address form validated, before order creation |
| `serviceability_checked` | `ServiceabilityCheck` (PDP) | Pincode check submitted |
| `address_submitted` | `CheckoutPageClient` | Checkout form submitted |
| `payment_initiated` | `CheckoutPageClient` | Immediately after order creation, before opening Cashfree |
| `order_created` | `CheckoutPageClient` | Order created (before payment resolves) |
| `payment_success` / `payment_failed` / `payment_cancelled` | `PaymentStatusClient` | Terminal status from `/payments/status` |
| `payment_pending` | *(reserved)* | Emit from the backend/webhook side for delayed-verification analytics |
| `payment_retry` | `PaymentStatusClient` | "Retry Payment" clicked |
| `purchase` | `PaymentStatusClient` | Payment status resolves to `success` (fires alongside `payment_success`) |
| `track_order` | `TrackOrderForm` | Order successfully looked up |
| `review_started` | `ReviewSubmissionForm` | First keystroke/rating on the review form |
| `review_submitted` | `ReviewSubmissionForm` | Review successfully submitted |
| `whatsapp_clicked` | `WhatsAppButton`, PDP size-help link, newsletter band | Any WhatsApp link clicked |
| `newsletter_subscribed` | `NewsletterForm` | Subscription succeeds |
| `policy_viewed` | `PolicyLayout` | Any of the 5 policy pages mounts (`metadata.policy` = page title) |

## Consent

`useConsentStore` (`src/store/consent.ts`) persists the visitor's choice from `CookieConsentBanner`. First-party
events above are **always** sent (they're operational, not third-party tracking). GA4 (`trackGa4Event`) and Meta
Pixel (`trackMetaPixelEvent`) only fire when **all** of the following are true:

1. The visitor has responded to the consent banner and chosen "Accept all".
2. `NEXT_PUBLIC_ENABLE_MARKETING_ANALYTICS=true`.
3. The corresponding ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_META_PIXEL_ID`) is configured.

Only a subset of events map to GA4/Meta (see `GA4_EVENT_MAP` / `META_PIXEL_EVENT_MAP` in `src/lib/analytics/track.ts`)
— the mapping intentionally mirrors GA4's recommended ecommerce event names and Meta's standard events.

**Meta Conversions API** (server-side) is a `ruvaya-admin-api` responsibility — the backend should fire it from its
own order/payment webhooks using the `orderId`/`orderValue` it already has, not from anything this storefront sends.
