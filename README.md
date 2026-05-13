# Shirtz

A single-page apparel storefront built as a front-end project/demo. Not intended as a production e-commerce product — built to explore animation-heavy UI patterns in Next.js.

---

## What it is

A draggable product grid with rich GSAP animations. Click a product, watch it fly into a detail panel. Pan the grid with drag or scroll. Add items to an in-memory cart. That's it.

---

## Tech stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| UI | React 18 |
| Animation | GSAP 3 (Draggable, Flip, SplitText) |
| State | Zustand 5 |
| Image boot | Unique PNG preload + 2s cap (native `Image`/`decode`) |

---

## Project structure

```
shirtz/
├── app/
│   ├── layout.tsx          # Root layout, metadata, favicon
│   ├── page.tsx            # Single route — renders ProductGrid
│   └── globals.css         # Global styles, CSS custom properties
├── components/
│   └── ProductGrid.tsx     # Entire interactive UI (grid, detail panel, animations)
├── data/
│   └── products.ts         # Product catalog (types + 7 hardcoded products)
├── lib/
│   └── cart.ts             # Zustand cart store (in-memory only)
├── public/
│   ├── logos/              # black.svg, white.svg (favicon), text.svg (wordmark)
│   ├── cross.svg           # Close control asset
│   ├── TWK-Lausanne.woff2  # Custom font
│   └── *.png               # Product images (7 items)
├── next.config.js          # reactStrictMode: false
└── tsconfig.json           # strict mode, @/* path alias
```

---

## Features

- **Draggable product grid** — pan with click-drag or mousewheel, clamped to bounds, with inertia
- **Animated detail panel** — desktop: grid slides left, panel slides in from right; mobile: panel slides up from bottom
- **Flip animation** — clicked product tile "flies" into the detail panel thumbnail
- **SplitText reveals** — product title and description animate in line-by-line / character-by-character
- **Image preload gate** — intro waits for the seven unique product PNGs to decode (hard cap 2s), without a full-page loader overlay
- **IntersectionObserver** — tiles fade/scale in as they enter the viewport
- **Cursor-following close button** — desktop only
- **Add to cart** — updates Zustand store; no persistence, no checkout, no cart UI

---

## What is NOT implemented

- Cart UI (drawer, page, item count badge)
- Checkout / payments
- Backend / API routes
- Auth
- CMS or any database
- Product persistence (cart resets on refresh)
- Tests
- ESLint / Prettier config

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Stripe Checkout requires:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
STRIPE_IMAGE_BASE_URL=
```

For local Stripe image previews, `NEXT_PUBLIC_SITE_URL` can stay on localhost for redirects, but
`STRIPE_IMAGE_BASE_URL` must be a public tunnel URL because Stripe cannot fetch localhost assets:

```bash
npm run dev
npx localtunnel --port 3000
```

Then set the tunnel URL in `.env` and restart the dev server:

```bash
STRIPE_IMAGE_BASE_URL=https://your-tunnel-url.loca.lt
```

For production, set `NEXT_PUBLIC_SITE_URL` to the live site URL. On Vercel, the checkout route can
also fall back to `VERCEL_URL` for Stripe images if `NEXT_PUBLIC_SITE_URL` is not configured.

---

## Notes

- `reactStrictMode` is disabled in `next.config.js` to avoid GSAP effects running twice in dev
- GSAP plugins used (Draggable, Flip, SplitText) are Club GreenSock — check your GSAP license if you plan to use this commercially
- Product images and the TWK Lausanne font are included in `public/` and are not production-licensed assets
