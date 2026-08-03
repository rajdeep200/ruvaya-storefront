# Manual QA Checklist

No automated test suite is installed in this repository by design (see the main brief). Quality is enforced by:

1. `npm run typecheck` — strict TypeScript
2. `npm run lint` — ESLint, including the React Compiler's hook-correctness rules
3. `npm run build` — production build must succeed
4. This manual QA pass, run before every release

Test in mock mode (`NEXT_PUBLIC_USE_MOCK_API=true`) for full coverage without a backend, then re-run the payment
section against a real backend per [`docs/cashfree-sandbox-checklist.md`](cashfree-sandbox-checklist.md).

## Homepage
- [ ] Announcement bar, hero, shop-by-collection, best sellers, seasonal banner, trust strip, reviews, style
      inspiration, newsletter/WhatsApp band and footer all render in the order specified.
- [ ] Hero CTA links to `/kurtis`. Each "Shop by Collection" card links to the correct `/collections/[slug]`.
- [ ] If any homepage section's data is empty, that section is hidden — no broken/empty box is shown.
- [ ] Layout holds at 375px, 768px, 1024px, 1440px+ with no horizontal scroll.

## Navigation
- [ ] Desktop nav shows the current page underlined/highlighted.
- [ ] Mobile hamburger opens a slide-in sheet with all nav items plus wishlist/track-order/size-guide/help; ESC and
      the close button both work; focus is trapped while open.
- [ ] Cart and wishlist icon badges update immediately when items are added/removed, from any page.

## Search
- [ ] Typing in the search overlay debounces (no request per keystroke) and shows product + collection suggestions.
- [ ] Recent searches persist across a refresh and can be cleared.
- [ ] Submitting a query navigates to `/search?q=...` with matching results.
- [ ] A query with no matches shows the zero-results state, not a blank page.
- [ ] Keyboard: Enter submits from the input; Escape closes the overlay.

## Product Filtering (`/kurtis`, `/collections/[slug]`)
- [ ] Each filter (size, colour, fabric, occasion, price bucket) updates the grid and the URL query string.
- [ ] Reloading a filtered URL directly reproduces the same filtered results (shareable links work).
- [ ] Active-filter chips appear for every applied filter and each is individually removable; "Clear All" resets
      everything.
- [ ] Sort (newest/popularity/price asc/price desc) reorders correctly.
- [ ] A filter combination with zero matches shows the empty state with a "shop all" recovery link.
- [ ] Mobile: Filters open in a full sheet; desktop: same panel, opened from the toolbar button.

## Product Gallery & Variant Selection
- [ ] Thumbnails (desktop) and swipeable slides (mobile, via native scroll-snap) both navigate the same image set.
- [ ] Product video (where present) plays on demand and fires `product_video_play` once.
- [ ] Hovering the main image on desktop shows the zoom effect.
- [ ] Selecting a colour updates the image set and resets the selected size (never auto-selects a size).
- [ ] Selecting an out-of-stock size is impossible (disabled, struck through) — no add-to-cart bypass.
- [ ] Add to Cart / Buy Now are blocked with a clear inline message until both colour and size are selected — never
      a silent no-op.
- [ ] "What size should I choose?" opens the size guide dialog with this product's actual measurements.
- [ ] Pincode serviceability check shows a clear serviceable/not-serviceable message with delivery estimate.

## Add to Cart / Wishlist
- [ ] Add to Cart opens the cart drawer with the new line visible.
- [ ] Buy Now adds the line and navigates straight to `/checkout`.
- [ ] Wishlist heart toggles instantly and persists across a refresh.
- [ ] Moving a wishlist item to cart requires choosing colour/size first (`MoveToCartDialog`), and removes it from
      the wishlist only after a successful add.

## Cart Persistence
- [ ] Cart survives: a full page refresh, closing and reopening the tab, navigating away and back, and a failed
      network request while validating.
- [ ] Cart survives an abandoned/failed Cashfree payment — items are not cleared until payment is verified
      `success`.

## Coupon Handling
- [ ] A valid mock coupon (`RUVAYA10`, `WELCOME150`) reduces the total and shows a confirmation message.
- [ ] An invalid coupon shows `couponError` inline without crashing the summary.
- [ ] Removing/changing the coupon re-validates the cart.

## Checkout Validation
- [ ] Indian phone number format is enforced (10 digits, starts 6-9).
- [ ] Pincode is enforced as 6 digits, first digit 1-9.
- [ ] All required fields show inline errors on blur/submit; the error summary is screen-reader accessible.
- [ ] Submitting with an unavailable cart line is blocked with a clear message instead of silently proceeding.
- [ ] Rapid double-clicking "Pay" does not submit twice (see idempotency section below).

## Price Mismatch / Product Becoming Unavailable
- [ ] If a product's price changes between adding to cart and checkout, the cart/checkout summary reflects the new
      price and shows a "price updated" message on that line.
- [ ] If a product/size sells out while it's in the cart, the line shows "no longer available", checkout is
      blocked, and the customer's other lines/selections are preserved.

## Duplicate Submission / Idempotency
- [ ] Double-clicking "Place Order" only creates one order (submit lock + disabled state + `Idempotency-Key`).
- [ ] Refreshing `/checkout` immediately after a successful submit does not resubmit the form.

## Cashfree Payment States
See [`docs/cashfree-sandbox-checklist.md`](cashfree-sandbox-checklist.md) for the full payment-specific pass
(success, pending, failed, cancelled, user-dropped, delayed webhook, retry, refresh, back button).

## Order Confirmation & Tracking
- [ ] `/order-confirmation/[orderNumber]` shows full details right after a successful payment in the same browser.
- [ ] The same URL in a different browser/session shows the safe fallback, not real order data.
- [ ] `/track-order` with a correct order number + phone/email navigates to the secure order page.
- [ ] `/track-order` with incorrect details shows a clear "not found" message, not a crash.
- [ ] `/orders/[secureToken]` shows the full timeline, items, amounts and address; an invalid token shows the
      expired-link state, not a raw 404.

## Reviews
- [ ] `/review/[secureToken]` with a valid, unused token shows the submission form pre-filled with product/order
      context.
- [ ] An already-submitted token shows the "already reviewed" state.
- [ ] An expired/invalid token shows the expired-link state.
- [ ] Up to 5 images can be added, previewed and individually removed before submit.
- [ ] The consent checkbox is required; submitting without it shows an inline error.
- [ ] A successful submission shows a confirmation and cannot be submitted twice in the same session.
- [ ] `/reviews` filters (sort, with-photos, verified-only) update the list and the URL.

## Analytics
- [ ] Open the browser console in mock mode — every meaningful interaction logs a `[mock analytics]` event with
      the expected `name` and fields (see [`docs/analytics-events.md`](analytics-events.md) for the full list).
- [ ] No event ever contains a full address, full phone number or payment credential.
- [ ] With marketing consent declined, no GA4/Meta network requests fire; with consent accepted (and IDs/flag
      configured), they do.

## Mobile Navigation & Responsive Layouts
- [ ] Every interactive element meets a ~44px touch target.
- [ ] Sticky mobile purchase bar on the PDP does not overlap footer content or get clipped by the viewport.
- [ ] No horizontal overflow at 320px width on any route.

## Loading, Empty and Error States
- [ ] Every data-fetching route has a `loading.tsx` skeleton that approximates final layout (no layout shift on
      resolve).
- [ ] Empty states (empty cart, empty wishlist, zero search results, zero filtered results, zero reviews) all show
      a clear message and a recovery action — never a blank page.
- [ ] Killing the network mid-request (e.g. via devtools "Offline") surfaces a clear network-error message, not a
      silent hang or an unhandled crash.
- [ ] Throwing inside a route (temporarily, for testing) is caught by that route's `error.tsx` with a "Try Again"
      option, and the header/footer chrome remains visible.

## Accessibility
- [ ] Tab through the entire homepage and a full checkout — focus order is logical, focus is always visible.
- [ ] All dialogs/sheets (cart, search, filters, size guide, mobile nav) trap focus and close on Escape.
- [ ] All icon-only buttons have an `aria-label`.
- [ ] Color contrast of text against its background meets WCAG AA for body text and primary CTAs.
- [ ] `prefers-reduced-motion` disables the (already minimal) transitions.

## SEO
- [ ] View source on the homepage, a PDP and a collection page — title, meta description, canonical, Open Graph
      tags and JSON-LD (`Product`, `BreadcrumbList`) are all present and correct.
- [ ] `/checkout`, `/payment/status`, `/order-confirmation/[orderNumber]`, `/orders/[secureToken]` and
      `/review/[secureToken]` all carry `noindex`.
- [ ] `/sitemap.xml` lists the homepage, shop, collections, products, active/upcoming campaigns and static pages —
      and excludes cart/checkout/payment/order/review/search routes.
- [ ] `/robots.txt` disallows the same private routes and points to the sitemap.

## Production Deployment
- [ ] `npm run verify` passes cleanly with no errors.
- [ ] The production build starts and serves correctly with `npm run start`.
- [ ] All required environment variables are set per [`docs/deployment.md`](deployment.md); no secret keys are
      present in any `NEXT_PUBLIC_*` variable.
