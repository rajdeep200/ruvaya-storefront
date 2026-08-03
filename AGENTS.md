<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ruvaya Storefront — orientation for coding agents

Read this before exploring the repo — it's written to save you the round trips it took to learn this the first
time. For anything not covered here, check `docs/` (linked from README) before grepping the whole tree.

## What this repo is

Customer-facing Next.js storefront for **Ruvaya**, a women's kurti brand. It is a pure API client — it has no
database, no Prisma, no Cashfree secrets, no admin code. Everything dynamic goes through
`NEXT_PUBLIC_API_BASE_URL` (the separate `ruvaya-admin-api` repo). Never add a DB driver, ORM, or any secret-side
credential here — see `docs/security-notes.md` before touching anything payment- or order-related.

**Mock mode is on by default** (`NEXT_PUBLIC_USE_MOCK_API=true` in `.env.example`). Every function in
`src/lib/api/*.ts` branches on `env.useMockApi`: mock data comes from `src/lib/mock/*`, real calls go through
`apiFetch()` in `src/lib/api/client.ts`. When you add or change a backend-driven feature, **update both branches**
in the same `lib/api/*.ts` file — the mock branch is not an afterthought, it's what makes the whole site runnable
with zero backend.

## Where things live (map, not prose — use this to jump straight to the right file)

| To change... | Edit... |
| --- | --- |
| A domain data shape (Product, Order, Review, etc.) | `src/lib/validation/*.ts` (Zod schema = source of truth). Then re-export the type from `src/types/index.ts` if components need it. |
| What a backend endpoint returns / how mock data answers it | `src/lib/api/<domain>.ts` (mock branch + real branch, same function) |
| Mock catalogue content (the 15 products, collections, homepage, reviews, orders) | `src/lib/mock/*.ts` |
| A design token (color, ever) | `src/app/globals.css` (`:root` block) — never hardcode a hex value in a component |
| The Ruvaya logo | `src/components/common/RuvayaLogo.tsx` (hand-built SVG, see `docs/design-tokens.md`) |
| Header/nav/footer/announcement bar | `src/components/layout/*` — content comes from `getStorefrontConfig()`/`getNavigation()`, fetched once in `src/app/layout.tsx` |
| A homepage section | `src/components/homepage/*` + `src/lib/mock/homepage.ts` (`mockHomepage`) |
| Cart/wishlist/checkout state | `src/store/*.ts` (Zustand + `persist`) — see "Client state" below before adding a new store |
| An analytics event | `src/lib/validation/analytics.ts` (add to the enum) + call `track()` from `src/lib/analytics/track.ts` at the trigger point. Update `docs/analytics-events.md`. |
| A new page/route | `src/app/<route>/page.tsx` + a matching `loading.tsx` skeleton. Check `docs/api-contract.md` if it needs new backend data. |
| Cashfree checkout behavior | `src/lib/cashfree/*` (script-tag loader, no npm dep) + `src/components/payment/*`. There is no real Cashfree account here — `MockCashfreeSimulator` stands in when `useMockApi` is true. |

## Non-obvious architectural decisions (don't "fix" these without reading why)

- **`/order-confirmation/[orderNumber]` never fetches by order number.** Order numbers are human-readable and
  guessable, so that route only renders from `useLastOrderStore` (this browser's own just-completed checkout).
  Anyone else hitting that URL gets a safe fallback. Durable, fetch-by-token order details live at
  `/orders/[secureToken]` instead. Don't "simplify" this by adding a `getOrderByNumber` call.
- **Cart line prices (`unitPriceSnapshot`) are display-only.** They're never sent to the backend as authoritative —
  every checkout revalidates via `POST /cart/validate` first. See the comment on `CartLine` in `src/store/cart.ts`.
- **Payment success is never inferred client-side.** Only `GET /payments/status` (polled in
  `PaymentStatusClient`) can mark a payment successful. Don't add a "just trust the redirect" shortcut.
- **Reviews can't set `isVerifiedPurchase`.** It's not a field in `ReviewSubmissionValues`. Keep it that way.
- **The Cashfree SDK is loaded via a `<script>` tag** (`src/lib/cashfree/loadSdk.ts`), not an npm package — there
  was no way to verify a real package name/version against a live sandbox account from this repo.
- **Colors/logo are eye-estimated from a screenshot**, not exact brand hex values (see `docs/design-tokens.md`).
  If you're given exact brand colors later, they only need to change in `src/app/globals.css`.

## Next.js version gotchas (this project is on Next 16 — APIs differ from older training data)

Read the "NOT the Next.js you know" section above / `node_modules/next/dist/docs/` for anything not listed here,
but these are the specific traps already hit once in this repo — don't rediscover them:

- **`params` and `searchParams` are `Promise`s**, in both Server and Client Components. Client Components unwrap
  with `use()` (see `OrderConfirmationClient`'s caller); Server Components just `await` them.
- **`revalidateTag(tag)` now requires a second argument** — a profile string like `"max"` or a `CacheLifeConfig`.
  See `src/app/api/revalidate/route.ts`.
- **Local (same-origin) images with a query string need `images.localPatterns` in `next.config.ts`.** Without it,
  `next/image` throws for any `src` containing `?`. Already configured for `/mock-image`; extend the pattern list
  if you add another local dynamic-image route.
- **There is no `eslint` key in `next.config.ts` anymore** — linting is fully decoupled from the Next config now;
  use the `lint` npm script.
- **`notFound()` inside a route that streams (has a `loading.tsx`, or any Suspense boundary above it) returns
  HTTP 200 with a `<meta name="robots" content="noindex">` tag, not a real 404 status.** This is documented,
  intentional Next behavior (see the "Status Codes" section of the `loading.js` file-convention doc) — it's not a
  bug to fix. Routes with no `loading.tsx` above them (e.g. `/orders/[secureToken]`) do return a real 404.
- **ESLint here includes the React Compiler's stricter hook rules**, which trip up common patterns:
  - `react-hooks/set-state-in-effect` flags **any** `setState` call as the first synchronous statement in a
    `useEffect` body — even ones that "start" a fetch (`setIsLoading(true)` before `.then(...)`). Fix: move that
    `setState` inside the `setTimeout`/promise callback instead of before it (see the debounce pattern in
    `CartPage`, `CheckoutPageClient`, `SearchOverlay`). If state is fully derivable from props, use `useMemo`
    instead of `useEffect`+`setState` at all (see `ReviewImageUpload`'s preview URLs). For one-shot "have I fired
    this already" gates, use a `useRef`, not `useState` (see `ReviewSubmissionForm`).
  - `react-hooks/error-boundaries` flags constructing JSX inside a `try/catch`. Fetch data inside the `try`,
    assign it to a variable, then build all JSX *after* the `catch` block (see `SecureOrderPage`'s `loadOrder`
    helper, `ProductPage`'s `loadCampaign`-style pattern).
- **Google Fonts / npm registry**: this sandbox's default npm registry (`artifactory.eng.esentire.com`) doesn't
  resolve here; the project `.npmrc` pins `registry.npmjs.org` instead. Don't remove it.

## Client state (Zustand stores in `src/store/`)

Each store is single-purpose and persisted independently via `persist` + `localStorage`: `cart`, `wishlist`,
`checkoutDraft` (address + idempotency key + pending order, survives payment failures/refreshes),
`lastOrder` (post-payment confirmation snapshot, see above), `consent` (marketing analytics opt-in), `toast`
(non-critical UI messages), `ui` (search/mobile-nav open state, not persisted). Don't add cart/order data into a
new ad-hoc store — extend an existing one if the data is related.

## Verification

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # eslint (flat config)
npm run build        # production build
npm run verify        # all three, in order — run this before considering any change done
```

There is no unit test suite by design — see `docs/manual-qa-checklist.md` for the manual QA process instead.

## Docs index (read before re-deriving something already written down)

- `docs/api-contract.md` — every backend endpoint, request/response shape, error codes
- `docs/analytics-events.md` — full event schema + exact trigger point for each event
- `docs/cashfree-sandbox-checklist.md` — what's mocked vs. real in the payment flow, and what to re-verify with real credentials
- `docs/manual-qa-checklist.md` — the QA pass (no automated tests exist)
- `docs/deployment.md` — env vars, Vercel deploy, revalidation tag reference
- `docs/design-tokens.md` — color/type tokens and their (approximate) source
- `docs/security-notes.md` — trust boundaries or things that must never appear client-side
