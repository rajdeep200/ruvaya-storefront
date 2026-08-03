# Deployment

## Vercel (recommended, free tier)

1. Import this repository into Vercel.
2. Framework preset: **Next.js** (auto-detected). Build command `next build`, output is handled automatically.
3. Set the environment variables below in **Project Settings → Environment Variables** for each environment
   (Production/Preview/Development as applicable).
4. Deploy. No database, no persistent storage and no long-running processes are required — every dynamic page is
   either statically generated, revalidated on a timer, or server-rendered on demand against the external
   `ruvaya-admin-api`.

The app is intentionally portable: no Vercel-specific APIs are used (no Vercel KV/Postgres/Blob), so it can be
redeployed to any Node.js hosting that supports the Next.js App Router (e.g. a self-hosted Node server, Netlify,
Render) with no code changes — only the build/output configuration differs.

## Environment Variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | Used for canonical URLs, OG tags, sitemap and robots. Must be the real production domain. |
| `NEXT_PUBLIC_API_BASE_URL` | Yes (once live) | Base URL of `ruvaya-admin-api`. Leave unset only while `NEXT_PUBLIC_USE_MOCK_API=true`. |
| `NEXT_PUBLIC_USE_MOCK_API` | Yes | `false` in production. `true` only for demos/previews without a backend. |
| `NEXT_PUBLIC_CASHFREE_MODE` | Yes | `sandbox` until go-live, then `production`. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes (once live) | Used to construct/validate Cloudinary image URLs — no secret involved. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Leave blank to disable GA4 entirely. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Optional | Leave blank to disable Meta Pixel entirely. |
| `NEXT_PUBLIC_ENABLE_MARKETING_ANALYTICS` | Yes | Master switch for GA4/Meta; first-party analytics are unaffected by this flag. |
| `REVALIDATION_SECRET` | Yes | Server-only. Generate a long random string; share it with `ruvaya-admin-api` out of band (never commit it). |

**Never set** `DATABASE_URL`, `CASHFREE_CLIENT_SECRET`, `CASHFREE_WEBHOOK_SECRET`, `CLOUDINARY_API_SECRET`, or any
admin authentication secret in this project — none of that belongs in the storefront.

## On-Demand Revalidation

`ruvaya-admin-api` should call this repo's `POST /api/revalidate` after any content change:

```bash
curl -X POST https://storefront.ruvaya.example.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "<REVALIDATION_SECRET>", "tag": "products"}'
```

Recognised `tag` values (matching the `next.tags` used in `src/lib/api/*`):

| Content change | Tag to revalidate |
| --- | --- |
| Any product created/updated | `products` |
| A specific product | `product:<slug>` |
| Any collection created/updated | `collections` |
| A specific collection | `collection:<slug>` |
| Homepage content edited | `homepage` |
| Site config (announcement, footer, contact) edited | `storefront-config` |
| Navigation menu edited | `navigation` |
| Any campaign created/updated | `campaigns` |
| A specific campaign | `campaign:<slug>` |
| Reviews published/edited | `reviews` or `reviews:<productId>` |

Alternatively pass `"path": "/some/route"` to revalidate by path instead of tag. Policy pages are statically
generated at build time with no revalidation tag — redeploy to update their content, or convert them to fetch from
a CMS-backed endpoint later if the business wants to edit them without a deploy.

## Performance Notes

- Server Components by default; `"use client"` is scoped to interactive islands only (cart drawer, filters, forms,
  search overlay, payment/checkout flows).
- Product/collection/homepage data is fetched with `next: { revalidate: <seconds> }` so repeat visits are served
  from cache between revalidations, with `POST /api/revalidate` available for immediate invalidation.
- Images go through `next/image` with AVIF/WebP negotiation; remote patterns are scoped to `res.cloudinary.com`
  only.
- Only two font families are loaded (Playfair Display, Inter), each with a small, deliberate weight subset.
