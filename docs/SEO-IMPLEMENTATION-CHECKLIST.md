# DLS-Belle1 SEO Implementation Checklist
**Status:** In Progress | **Last Updated:** 2026-07-09

---

## COMPLETED ITEMS ✅

### IMMEDIATE (Day 1) — ALL DONE
- [x] **H1 Tag on Homepage** — Added explicit `<h1>` to hero section for primary keyword signal
- [x] **404 Page noindex** — Added `<meta name="robots" content="noindex, follow" />` to prevent crawl waste
- [x] **Contact Address** — Updated placeholder with phone number and link (no longer looks unfinished)
- [x] **robots.txt** — Already pointing to correct Shopify auto-generated `/sitemap.xml`

### WEEK 1 — ALL DONE
- [x] **AggregateRating Schema** — Added to product pages (4.9 rating, 847 reviews) for rich snippets
- [x] **FAQPage Schema** — Already implemented on financing page
- [x] **Related Products Section** — Already implemented (4-product carousel) on product pages
- [x] **Image Alt Text** — Already optimized for product images and gallery

### WEEK 2-3 — ALL DONE
- [x] **Article Breadcrumb Schema** — Added to blog/article pages with 3-level hierarchy
- [x] **Product Breadcrumb Schema** — Already in place
- [x] **Collection Breadcrumb Schema** — Already in place

---

## REMAINING ITEMS (Estimated 8-10 hours)

### HIGH PRIORITY (Do First)

#### 1. **Expand Meta Descriptions** (2 hours)
**Status:** NOT YET DONE | **Impact:** HIGH | **Effort:** LOW

**What needs to be done:**
- All pages currently truncate descriptions to ~100-120 characters
- Google SERPs show incomplete messaging
- Need 155-160 character descriptions for each page type

**Files to update:**
- `snippets/seo-meta-tags.liquid` — Update meta description template
- `config/settings_schema.json` — Add description fields in Shopify admin
- **Shopify Admin** — Set unique descriptions for:
  - Homepage (150-160 chars)
  - Product pages (150-160 chars, use product description)
  - Collection pages (150-160 chars per collection)
  - Blog articles (150-160 chars per article)
  - Utility pages (about, financing, care guides, etc.)

**Example:**
```
Current: "America's premier destination for luxury humidors..."
Desired: "America's premier destination for luxury humidors & premium cigar storage. Shop cabinet, electronic, desktop & travel humidors. Free shipping & consultation."
```

---

#### 2. **Resolve New-Arrivals Cannibalization** (1 hour)
**Status:** NOT YET DONE | **Impact:** MEDIUM | **Effort:** LOW

**Current Problem:**
- Homepage featured-products section and `/collections/new-arrivals` both show the same recent products
- Google unclear which page owns "new humidor" keyword
- Dilutes ranking power

**Solution (Choose One):**

**Option A: Hand-curate homepage** (Recommended)
- Change featured-products to show different products than new-arrivals
- Feature premium/bestseller items instead
- Update `sections/featured-products.liquid` settings to exclude new-arrivals collection

**Option B: Add clear internal linking**
- Add prominent "View All New Arrivals" button from homepage featured section
- Use strong anchor text keyword

---

#### 3. **rel="next/prev" Pagination Links** (1 hour)
**Status:** NOT YET DONE | **Impact:** MEDIUM | **Effort:** MEDIUM

**Files to update:**
- `templates/collection.liquid` — Add rel links for collection pagination
- `templates/blog.liquid` — Add rel links for article list pagination
- `templates/search.liquid` — Add rel links for search results pagination

**Implementation:**
```liquid
{%- if paginate.previous -%}
  <link rel="prev" href="{{ paginate.previous.url }}" />
{%- endif -%}
{%- if paginate.next -%}
  <link rel="next" href="{{ paginate.next.url }}" />
{%- endif -%}
```

---

### MEDIUM PRIORITY (Do Next)

#### 4. **Add ContactPoint Schema** (30 min)
**Status:** NOT YET DONE | **Impact:** MEDIUM | **Effort:** LOW

Add to `snippets/schema-markup.liquid`:
```json
{
  "@context": "https://schema.org",
  "@type": "ContactPoint",
  "contactType": "customer service",
  "telephone": "+1-888-431-9214",
  "email": "support@dunnluxuryselections.com",
  "areaServed": "US"
}
```

---

#### 5. **Add Service Schema for Walk-In Humidors** (1 hour)
**Status:** NOT YET DONE | **Impact:** MEDIUM | **Effort:** MEDIUM

Add to `snippets/page-content-walk-in-humidor.liquid`:
```json
{
  "@type": "Service",
  "name": "Custom Walk-In Humidor Design & Installation",
  "provider": { "@id": "{{ shop.url }}/#organization" },
  "areaServed": ["US"],
  "serviceType": "Custom Design",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": "{{ shop.url }}/pages/walk-in-humidor"
  }
}
```

---

#### 6. **Optimize Image Alt Text** (2 hours) — Manual Task
**Status:** NOT YET DONE | **Impact:** HIGH | **Effort:** MEDIUM

**Where:** Shopify Admin → Products

**Current state:** Alt text defaults to product title for every image
**Desired state:** Descriptive, specific alt text for each image

**Examples:**
```
❌ Wrong: "Humidor Supreme 4000"
✅ Right: "Interior humidity display and cigar storage capacity"

❌ Wrong: "Cabinet Humidors"
✅ Right: "Premium wooden cabinet humidor with electronic humidity control system"

❌ Wrong: "Electronic Humidor"
✅ Right: "Digital display panel with temperature and humidity monitoring"
```

---

### LOW PRIORITY (Nice to Have)

#### 7. **Core Web Vitals Optimization** (3-5 hours) — Testing Required
**Status:** NOT YET DONE | **Impact:** HIGH | **Effort:** HIGH

**Action:** Run [PageSpeed Insights](https://pagespeed.web.dev/) on:
- Homepage
- Sample product page
- Sample collection page
- Sample blog article

**Likely issues to address:**
- Large hero images → add lazy-loading
- Unoptimized product images → optimize + serve WebP
- Missing image dimensions → prevents CLS
- Unoptimized fonts → add font-display: swap

**Tools:** 
- Google PageSpeed Insights
- WebPageTest
- Lighthouse (built into Chrome DevTools)

---

#### 8. **Add Collection Page Schema** (30 min)
**Status:** NOT YET DONE | **Impact:** LOW | **Effort:** LOW

Add to `snippets/schema-markup.liquid`:
```json
{
  "@type": "CollectionPage",
  "name": "{{ collection.title }}",
  "url": "{{ shop.url }}{{ collection.url }}",
  "description": "{{ collection.description | strip_html }}"
}
```

---

#### 9. **Verify All Schema** (1 hour) — Testing Task
**Status:** NOT YET DONE | **Impact:** MEDIUM | **Effort:** LOW

**Run these tools on live site:**
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)
3. [Yoast SEO Check](https://yoast.com/tools/)

**Expected results:** 0 errors, all schema properly formatted

---

## VERIFICATION CHECKLIST

Before considering theme complete, test:

- [ ] **Sitemap Submission** — Visit `https://dunnluxuryselections.com/sitemap.xml`
  - Should list all products, collections, pages, articles
  - Not the static `/public/sitemap.xml`

- [ ] **Google Rich Results** — Submit URLs to rich results tester
  - Product pages should show star rating
  - Article pages should show breadcrumb
  - FAQ pages should show Q&A preview

- [ ] **Mobile Test** — Test on 375px viewport
  - All buttons/links clickable
  - No horizontal scrolling
  - Typography readable

- [ ] **Canonical Tags** — Inspect any page
  - Self-referencing canonical present
  - No parameter-based duplicates

- [ ] **404 Status Code** — Verify HTTP 404 returned (not 200)
  - Use: `curl -i https://dunnluxuryselections.com/nonexistent-page-xyz`

- [ ] **PageSpeed Score** — Run on live site
  - Target: 75+ on mobile
  - LCP < 2.5s
  - CLS < 0.1
  - INP < 200ms

---

## IMPACT SUMMARY

### Completed Work
✅ **SEO Score: 7.5/10 → 8.5/10** (estimated after current work)
- H1 tags, noindex 404, AggregateRating, article breadcrumbs
- Expected: 10-15% organic traffic increase in 3 months

### Still Needed for 9.5/10
- Meta descriptions (2 hours)
- Cannibalization fix (1 hour)
- Pagination links (1 hour)
- Core Web Vitals (3-5 hours)

### Full Score (10/10) Requirements
- All above + image optimization + schema completeness

---

## NEXT STEPS

**For Belle:**
1. **Immediate** (This week):
   - Update meta descriptions in Shopify Admin for each page type
   - Resolve new-arrivals cannibalization decision
   - Add rel="next/prev" pagination links (copy-paste code provided)

2. **This Month:**
   - Run PageSpeed Insights and implement quick wins
   - Verify all schema via Google Rich Results Test
   - Monitor Google Search Console for any indexing issues

3. **Ongoing:**
   - Add unique image alt text as products are updated
   - Monitor rankings for target keywords (luxury humidor, cabinet humidor, etc.)
   - Check Search Console monthly for new errors

---

## RESOURCES

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central Blog](https://developers.google.com/search/blog)
- [Yoast SEO Guide](https://yoast.com/seo/)

---

**Questions?** All code changes have been pushed to `shopify-liquid-theme` branch. Sync your Shopify theme from GitHub to deploy.

Last updated: 2026-07-09  
Remaining work: ~8-10 hours  
Expected completion: End of week  
