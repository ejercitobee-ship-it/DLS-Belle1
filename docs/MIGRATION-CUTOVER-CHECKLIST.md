# Headless → Shopify Liquid Theme: Migration Cutover Checklist

The plan: retire the Cloudflare Pages headless storefront (main branch) and serve
dunnluxuryselections.com directly from Shopify with this Liquid theme
(shopify-liquid-theme branch).

**Do these in order. The redirect import (step 3) must happen before DNS cutover (step 6)
or every Google-indexed URL and Google Ads landing page will 404.**

---

## 1. Upload & activate the theme (unpublished first)

```
shopify theme push --store luxury-dunn-selections.myshopify.com --unpublished --theme "DLS Liquid v1"
```

Preview it with the theme editor before publishing. Do NOT publish until steps 2–5 are done.

## 2. Create content in Shopify Admin

Collections — most already exist in the store (verified July 6, 2026). Handles must match
exactly; the header/footer nav and redirect CSV depend on them:
- [x] `cabinet-humidors`, `desktop-humidors`, `travel-humidors`, `new-arrivals` — exist with products
- [ ] **Rename handle** `electronic-hunidors` → `electronic-humidors` (typo in admin;
      Collections → Electronic Humidors → Edit website SEO → URL handle)
- [ ] **Rename handle** `accessories-1` → `accessories`
- [ ] `frontpage` collection is EMPTY — either add products to it or ignore it (the
      homepage featured-products section falls back to all products automatically)

Pages (Online Store → Pages; handles must match). Verified July 6, 2026:
- [x] `about-us`, `walk-in-humidor`, `contact`, `shipping-policy` — already exist
      (theme + redirect CSV use `about-us`, the store's real handle)
- [ ] Still to create (title only — leave the body EMPTY): `financing`, `care-guides`,
      `delivery-info`, `returns-warranty`, `privacy-policy`, `terms-of-service`,
      `cookie-policy`. The theme carries the full designed content for these handles
      (snippets/page-content-*.liquid, ported from the headless React pages) and
      ignores the admin body. Creating the page just makes the URL exist.
- `about-us` also renders theme-baked content (the founder story from the headless
  site) — the admin body for that page is ignored. To edit any of these pages in the
  admin instead, remove its handle from the baked list at the top of
  templates/page.liquid.

Blog:
- [x] Blog `news` exists with the journal articles (verified via Storefront API) —
      the redirect CSV's `/article/news/<slug>` → `/blogs/news/<slug>` mapping works.

Policies (Settings → Policies):
- [ ] Privacy policy, Terms of service (redirects point at /policies/...)

## 3. Import URL redirects (CRITICAL — before DNS cutover)

- [ ] Shopify Admin → Online Store → Navigation → **URL Redirects** → Import
- [ ] Upload `docs/shopify-url-redirects.csv` (148 redirects: `/product/*` → `/products/*`,
      category pages → `/collections/*`, content pages → `/pages/*`, journal → `/blogs/news/*`)
- [ ] Note: `/new-arrivals` currently maps to `/collections/all` — change it if you create a
      dedicated new-arrivals collection.

## 4. Tracking

- [ ] The theme's base Google tag is in `layout/theme.liquid` (GT-55VCHDDF + the critical
      `gtag('config', 'AW-17833894840')` call). Nothing to do — just don't remove it.
- [ ] Shopify Custom Pixel: verify the existing pixel (Settings → Customer events) still uses
      conversion label `LxbdCPIH-7QcELjH7rdC` (see docs/SHOPIFY-CUSTOM-PIXEL-SETUP.md).
      This pixel keeps working unchanged after migration — purchases already convert
      through it, not through the storefront.
- [ ] After cutover, note the first-party tag routing (`/c7p8/...`) that ran through
      Cloudflare NO LONGER EXISTS. Analytics will collect via standard Google domains.
      If Google Ads shows "tag inactive" warnings post-cutover, this is why — re-verify
      the tag in Google Ads UI.
- [ ] Google Merchant Center: no change needed (feed comes from Shopify already), but
      re-verify the website URL claim after DNS moves.

## 5. Apps & integrations

- [ ] **Klaviyo**: install the Klaviyo Shopify app so newsletter signups (customer form,
      tagged `newsletter`) and abandoned-cart flows sync. The headless site's
      `/api/send-email` Cloudflare Worker goes away with Pages.
- [ ] **Tawk.to chat**: already embedded in the theme (`layout/theme.liquid`,
      property 69fb527d491d631c393ede51). Verify the widget loads on the preview theme.
- [ ] **Contact / project-inquiry forms**: the Cloudflare Workers
      (`functions/api/contact.ts`, `project-inquiry.ts`) die with Pages. Use Shopify's
      native contact form (page template `contact`) or a form app.
- [ ] **Shop Pay**: native on Shopify checkout — the incomplete headless Shop Pay Wallet
      integration becomes irrelevant. Enable Shop Pay + Shop Pay Installments in
      Settings → Payments.

## 6. DNS cutover

- [ ] In Shopify: Settings → Domains → add `dunnluxuryselections.com` + `www`
- [ ] In Cloudflare DNS: point apex A record to Shopify (23.227.38.65) and `www` CNAME to
      `shops.myshopify.com`. **Set records to DNS-only (grey cloud), not proxied** —
      Shopify terminates SSL itself and proxying breaks cert issuance.
- [ ] Publish the theme.
- [ ] Delete/disable the Cloudflare Pages project only after verifying the site serves
      from Shopify (check response headers for `x-shopid` / `server: cloudflare` vs Shopify).

## 7. Post-cutover verification (same day)

- [ ] Homepage, one collection, one product, cart, and checkout all load
- [ ] Spot-check 5 redirects from the CSV (a /product/ URL, a category, /about, /journal,
      one /article/news/ URL) — all should 301 to the new paths
- [ ] Test purchase → conversion appears in Google Ads (Custom Pixel)
- [ ] GA4 real-time shows traffic
- [ ] Newsletter form submits and the customer appears tagged `newsletter`
- [ ] Tawk widget appears
- [ ] Google Search Console: submit the new sitemap (`/sitemap.xml` — Shopify auto-generates)

---

## Known parity gaps vs the headless site (accepted for launch, fix later)

| Headless feature | Status in theme |
|---|---|
| Buyer guide modal + lead popup (PDF lead capture) | Not built — needs a section + lead storage (Klaviyo form is the natural replacement) |
| Deals banner / New-arrivals carousel on homepage | Not built — featured-products section covers part of this |
| Curated product specs for 13 premium items (`src/lib/productSpecs.ts`) | Theme reads `product.metafields.custom.specifications` — migrate specs into metafields |
| Per-page FAQ schema from `src/data/siteFaqs.json` | Not ported — add FAQ content to pages via the faq-accordion section |
| Shipping calculator on product pages | Not built — Shopify checkout shows real rates |
| `/onepager` sales page | Redirected to homepage |
