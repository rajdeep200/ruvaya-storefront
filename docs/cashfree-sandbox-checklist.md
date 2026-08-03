# Cashfree Sandbox Testing Checklist

## Why this document exists

This repository has **no Cashfree credentials** (by design — they belong to `ruvaya-admin-api`), so the payment
flow has been developed and verified end-to-end against a **mock Cashfree simulator**
(`src/components/payment/MockCashfreeSimulator.tsx`) rather than the real sandbox. Every screen downstream of "open
Cashfree" — `/payment/status` polling, retry, order confirmation — runs on the exact same code path it would in
production; only the "hand off to Cashfree's hosted page" step is swapped for a same-page dialog that lets you pick
an outcome.

**Before go-live, someone with access to a real Cashfree sandbox account must run through this checklist against
the real integration**, because this repo cannot verify:

- The exact current Cashfree Web SDK script URL/version and `checkout()` options (`src/lib/cashfree/loadSdk.ts` and
  `client.ts` implement the integration as documented at the time of writing — re-verify against
  [Cashfree's current docs](https://docs.cashfree.com/) before launch, since payment SDKs change).
- That `ruvaya-admin-api`'s `return_url` (configured when it creates the Cashfree order) actually points back to
  `/payment/status?order=<orderId>` on this storefront's deployed domain.
- Real webhook timing and how it interacts with the ~45s client-side polling window in `PaymentStatusClient`.

## How to switch this repo into real-Cashfree mode

```bash
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=<your ruvaya-admin-api sandbox URL>
NEXT_PUBLIC_CASHFREE_MODE=sandbox
```

With `NEXT_PUBLIC_USE_MOCK_API=false`, `CheckoutPageClient` calls `openCashfreeCheckout()` (real SDK) instead of
showing `MockCashfreeSimulator`, and all `lib/api/*` calls go to the real backend.

## Checklist

### Checkout → Order Creation
- [ ] Submitting the checkout form with a valid address creates a real order in `ruvaya-admin-api` and returns a
      real `paymentSessionId`.
- [ ] Submitting twice in quick succession (double-click the Pay button) does **not** create two orders — verify
      via the `Idempotency-Key` header the backend receives.
- [ ] A price/availability change between `/cart/validate` and `/checkout` surfaces the "please review your cart"
      message, not a generic error.

### Cashfree Hosted Checkout
- [ ] The Cashfree hosted page loads with the correct amount and order reference.
- [ ] **Success**: completing a test card/UPI payment redirects back to `/payment/status?order=...` (or whatever
      query param the backend's `return_url` uses — update `PaymentStatusClient`'s param names if different) and
      the page shows "Payment successful" within the polling window.
- [ ] **Failure**: a declined test card redirects back and shows the failed state with "Retry Payment".
- [ ] **Cancelled**: clicking Cashfree's own back/cancel control redirects back and shows the cancelled state.
- [ ] **User dropped**: closing the Cashfree tab/window entirely (not clicking cancel) — reopening
      `/payment/status?order=...` manually should still resolve to a sensible status once the backend/webhook
      catches up.
- [ ] **Pending / delayed webhook**: for a payment method with delayed confirmation (e.g. certain netbanking/UPI
      flows), confirm the "Verifying your payment" state holds correctly and does not falsely show success or
      failure before the backend actually knows.

### Retry
- [ ] After a failed/cancelled/expired/user-dropped payment, "Retry Payment" generates a **new** Cashfree session
      for the **same** order (`POST /payments/retry`) — verify no duplicate order appears in the admin dashboard.
- [ ] Retrying twice in a row doesn't stack duplicate payment attempts against the same order.

### Refresh / Back Button
- [ ] Refreshing `/payment/status` mid-verification re-polls from scratch and reaches the correct terminal state.
- [ ] Using the browser back button from `/payment/status` and then forward again does not re-trigger a duplicate
      payment session.
- [ ] Refreshing `/checkout` after submitting (but before payment resolves) does not allow submitting the same
      order twice — the address form should still show the saved values.

### Order Confirmation
- [ ] `/order-confirmation/[orderNumber]` shows full order details immediately after a successful payment **in the
      same browser**.
- [ ] Opening the same `/order-confirmation/[orderNumber]` URL in a different browser/incognito window shows the
      safe fallback (no order details), not the real address/items — this is intentional, see
      `src/store/lastOrder.ts`.
- [ ] `/orders/[secureToken]` (from Track Order) shows the same order correctly from any device, since it's backed
      by a real secure-token lookup rather than local state.

### Amounts
- [ ] The amount charged by Cashfree exactly matches the backend's revalidated total (subtotal − discount +
      shipping), not any client-computed number.
- [ ] Coupon-discounted totals charge the discounted amount, not the original.

### Cleanup
- [ ] Cart is only cleared after a **verified** `success` status — cancelling or failing a payment leaves the cart
      intact so the customer can retry without re-adding items.
