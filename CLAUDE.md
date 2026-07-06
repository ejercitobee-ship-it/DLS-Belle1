# DLS-Belle1 — dunnluxuryselections.com

Luxury humidor e-commerce storefront. React 18 + Vite + TypeScript + Tailwind, headless Shopify, deployed on **Cloudflare Pages** (auto-builds on git push). Ignore `netlify.toml` — it's vestigial; this site does not deploy to Netlify or Vercel.

## Commands
- `npm run dev` — Vite dev server at http://localhost:5173
- `npm run build` — typecheck → vite build → static prerender (`prerender-ssg.mjs`) → sitemap
- `npm run typecheck` — tsc, no emit
- `npm run lint` — eslint

## Architecture
- Shopify Storefront API, store `luxury-dunn-selections.myshopify.com` (~66 products). Credentials via `VITE_SHOPIFY_STORE_DOMAIN` / `VITE_SHOPIFY_STOREFRONT_TOKEN` in `.env.local` (dev) and `.env.production` (Cloudflare build). **The two files must hold identical tokens** — a one-character typo between them broke production checkout in July 2026.
- `prerender-ssg.mjs` bakes per-page static HTML including FAQPage/Service schema from `src/data/siteFaqs.json`. That JSON is the single source for both schema and the visible FAQ accordions — edit only the JSON, never duplicate.
- Cloudflare Pages Functions live in `functions/api/` (project-inquiry form via Resend; `shop-pay-session.ts` / `shop-pay-submit.ts` Workers).
- `OrderConfirmation.tsx` is lazy-loaded into its own Vite chunk. When verifying deployed code, grep the `OrderConfirmation-*.js` chunk, not the main bundle. The page redirects to `/` unless `?order_id=` or `?checkout=` params are present — test with `?order_id=TEST-1&total=100`.

## Tracking (fragile — read docs/GOOGLE-SETUP-SUMMARY.md before touching)
- GA4 `G-BG9K5QSYQQ`, Google Ads `AW-17833894840`, combined Google tag `GT-55VCHDDF`.
- `index.html` must call `gtag('config', 'AW-17833894840')` — without it, `send_to: AW-...` events are **silently dropped** (this caused the June 2026 conversion outage).
- Real purchases convert via a **Shopify Custom Pixel** (admin → Settings → Customer events) because Shopify's hosted checkout ignores the `return_url` param — customers finish on Shopify's thank-you page and never reach `/order-confirmation`. The OrderConfirmation gtag code is a dedupe-safe backup only.
- Google tag runs in first-party mode: analytics requests route through `dunnluxuryselections.com/c7p8/...`. If conversions undercount, check those requests first.
- If "conversion not detected" recurs, verify the conversion label in Google Ads first — it has been rotated before.

## Gotchas
- Homepage schema is `Organization` deliberately, NOT `OnlineStore` (OnlineStore is a LocalBusiness subtype and makes Google classify the site as a local business). Never add bare `{"@type":"Product"}` stubs to org-level schema.
- Financing threshold is $1,500; `/financing` page exists. The 13 premium items (≥ ~$1,400) have curated specs in `src/lib/productSpecs.ts`.
- Shop Pay as a payment method is **incomplete**: the session Workers reference `SHOPIFY_SHOP_PAY_CLIENT_ID` / `SHOPIFY_SHOP_PAY_SECRET` which may not be configured in Cloudflare yet. Legacy checkout redirect works.
- Domain: `www.dunnluxuryselections.com` is reliable; the apex (non-www) has had Cloudflare routing issues — check Cloudflare DNS before blaming code.

## Verification standard
After any deploy-affecting change: `curl` the live site, confirm the new build chunk hash is live, and re-test the affected flow (checkout, form, or tracking beacon) before reporting done.
