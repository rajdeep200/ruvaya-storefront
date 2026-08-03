# Design Tokens

All tokens live in `src/app/globals.css` as CSS custom properties, then re-exposed to Tailwind v4 via `@theme
inline` so every token is usable as a utility class (`bg-primary`, `text-text-secondary`, `border-border`, etc.).
No component hardcodes a raw hex value — if the brand ever changes the palette, this file is the only place to
edit.

## Source

These values were extracted **by eye** from the single approved homepage reference screenshot supplied for this
project (cream/ivory backgrounds, cocoa-brown announcement bar and buttons, soft blush-pink hero/campaign/review
panels, warm serif headings). No brand style guide or exact hex specification was provided alongside the image.

**Before this goes to production**, ask the brand for their exact hex values (from their logo/brand guide, if one
exists) and update the token values below — everything downstream (buttons, badges, borders, focus rings) will
follow automatically since nothing else hardcodes colour.

## Tokens

| Token | Value | Used for |
| --- | --- | --- |
| `--background` | `#fbf6ef` | Page background, header background |
| `--surface` | `#ffffff` | Cards, dialogs, drawers |
| `--surface-muted` | `#f3e3d8` | Hero/campaign/review panels, collection-card arches |
| `--primary` | `#6b4530` | Cocoa-brown — buttons, active nav, announcement bar, footer legal bar |
| `--primary-hover` | `#55371f` | Hover state for primary buttons/links |
| `--secondary` | `#dcb6a5` | Newsletter/WhatsApp band background, secondary accents |
| `--accent` | `#b4664f` | Reserved for sale/terracotta highlights |
| `--border` | `#e4d6c4` | Hairline borders throughout |
| `--text-primary` | `#3e2c20` | Headings, primary body text |
| `--text-secondary` | `#6b5847` | Supporting body text |
| `--text-muted` | `#a0907e` | Placeholder/meta text |
| `--success` | `#3f7a54` | In-stock, verified, success states, WhatsApp green |
| `--warning` | `#b8863b` | Price-changed, delayed-verification states |
| `--error` | `#a6423a` | Validation errors, out-of-stock, failed states |

## Typography

Exactly two font families, both loaded via `next/font/google` with a small, deliberate weight subset
(`src/app/layout.tsx`):

- **Playfair Display** (`--font-playfair`, weights 500/600/700, italic available) — all headings, the logo
  wordmark, and review pull-quotes.
- **Inter** (`--font-inter`, weights 400/500/600) — body copy, navigation, forms, buttons.

The logo's "Ethnic wear" script-style subtext is rendered in italic Playfair Display rather than a third cursive
font family, to keep the font-loading budget to two families as required.

## Logo

`src/components/common/RuvayaLogo.tsx` is a hand-built circular SVG badge (background circle in `--surface-muted`,
a thin hanger glyph, "RUVAYA" in Playfair Display, "Ethnic wear" in italic Playfair Display) — reconstructed from
what's visible in the header of the approved homepage screenshot, since no isolated logo source file was provided.
It's used identically in the header, footer and order-confirmation screens, and a simplified version (icon glyph
only, no text) powers the generated favicon (`src/app/icon.tsx`). If the brand supplies the original logo asset,
replace the markup in that one file — every place the logo appears will update automatically.
