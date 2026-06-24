# DLS Google Setup Summary — Merchant Center → Ads → Conversions

This document ties together the three pieces: **Merchant Center**, **Google Ads**, and **Conversion Tracking**.

---

## The Flow (End-to-End)

```
1. Product Data in Shopify
           ↓
2. Feed to Google Merchant Center
           ↓
3. Products show in Google Shopping search results
           ↓
4. Customer clicks ad → lands on product page
           ↓
5. Customer adds to cart → goes to Shopify checkout
           ↓
6. Shopify redirects to hosted checkout (myshopify.com)
           ↓
7. Shopify Custom Pixel fires 🔥
           ↓
8. Conversion event sent to Google Ads (AW-17833894840)
           ↓
9. Google Ads shows conversion in dashboard (within 3 hours)
           ↓
10. ROAS improves, you optimize based on data
```

---

## Part 1: Product Feed (Merchant Center)

**Status:** ⏳ Needs Assessment

**What you need to do:**
1. Go to [Google Merchant Center](https://merchantcenter.google.com)
2. Open **Products → Diagnostics → Issues**
3. Document:
   - How many products are disapproved?
   - What are the top issues? (images, categories, price format, etc.)
4. Use the **[Quick Check Guide](merchant-center-quick-check.md)** to prioritize fixes
5. Implement fixes in order:
   - 🔴 Priority 1 (today): Image URLs, categories, required fields
   - 🟡 Priority 2 (this week): Delivery date, shipping, titles
   - 🟢 Priority 3 (next month): Additional images, brand, materials

**Success metric:** 0–5 disapproved products; 100+ impressions/week

**Timeline:** 1–2 weeks to fully optimize

**Detailed guide:** [Google Merchant Center Audit](google-merchant-center-audit.md)

---

## Part 2: Google Ads Setup

**Status:** ✅ Complete

**What we've done:**
- ✅ Google Ads account linked to Merchant Center (AW-17833894840)
- ✅ Google Tag Manager configured (GT-55VCHDDF)
- ✅ Conversion tracking pixel deployed on Shopify (fires on checkout_completed)
- ✅ GA4 integration (G-BG9K5QSYQQ)
- ✅ Enhanced conversions enabled (email-based attribution)

**What you should do:**
1. Create a **Shopping Campaign** in Google Ads:
   - Campaign type: "Shopping"
   - Campaign subtype: "Shopping ads"
   - Feed: DLS Merchant Center feed
   - Budget: $20–100/day (test budget)
   - Bid strategy: "Maximize clicks" or "Target ROAS"

2. Monitor campaign after 48 hours:
   - Impressions: How many times your products appear in search?
   - Clicks: Traffic to your site
   - CTR: Conversion rate (aim for >2% for luxury items)
   - Cost per click (CPC)

**Guide:** [Google Ads Conversion Tracking Setup](google-ads-conversion-tracking.md)

---

## Part 3: Conversion Tracking (Shopify Custom Pixel)

**Status:** ✅ Complete & Tested

**What we've deployed:**
- ✅ Shopify Custom Pixel installed in your store
- ✅ Pixel fires on `checkout_completed` event
- ✅ Conversion event sent to Google Ads (AW-17833894840) with:
  - Order ID
  - Order total (value)
  - Currency (USD)
  - Customer email (for enhanced conversions)
  - GA4 purchase event with line items
- ✅ Pixel console logs for debugging (🔥 and ✅ emojis)

**What you should verify:**
1. Make a test purchase on your site
2. Go to Shopify's Thank You page
3. Open DevTools (F12) → Console
4. Look for:
   - `🔥 DLS pixel: checkout_completed received`
   - `✅ DLS pixel: Google Ads conversion sent AW-17833894840/LxbdCPIH-7QcELjH7rdC`
   - `✅ DLS pixel: GA4 purchase sent`

**If you don't see these logs:**
- Check **Shopify Admin → Settings → Customer events** → Verify pixel is "Connected"
- Check browser console for errors (check pixel context, not main page)

**Testing guide:** [Google Ads Custom Pixel Setup](google-ads-conversion-tracking.md#how-to-test)

---

## Part 4: Putting It All Together

### **Timeline:**

**Week 1 (NOW):**
- [ ] Run Merchant Center quick check
- [ ] Identify top 3 issues
- [ ] Fix disapproved products
- [ ] Verify pixel is firing in Shopify

**Week 2:**
- [ ] Create Shopping campaign in Google Ads
- [ ] Allocate test budget ($20–50/day)
- [ ] Monitor impressions/clicks accumulate
- [ ] Fix any feed issues that appear

**Week 3–4:**
- [ ] Review Google Ads performance data
- [ ] Optimize based on CTR/conversion rate
- [ ] Implement feed improvements (better titles, images)
- [ ] Scale budget if ROAS is positive

**Week 5+:**
- [ ] Ongoing optimization
- [ ] A/B test different product images
- [ ] Monitor conversion quality in Google Ads

### **Success Metrics:**

| Metric | Target | Timeline |
|--------|--------|----------|
| Feed disapprovals | <5 products | Week 2 |
| Impressions | 100+/week | Week 2 |
| Clicks | 10+/week | Week 3 |
| CTR | >1.5% | Week 3 |
| Conversions | 1–2/week | Week 4 |
| ROAS | 2.0+ | Week 6 |

---

## Part 5: Troubleshooting

### **"I don't see products in Google Shopping search results"**
- Check: Is feed active in Merchant Center?
- Check: Are products disapproved? (Diagnostics → Issues)
- Check: Is Google Ads campaign created and active?
- Check: Did you set budget? (Some campaigns need $5+ spend to get impressions)
- Fix: Re-upload feed, wait 24 hours

### **"CTR is low (<0.5%)"**
- **Issue:** Customers aren't clicking your products
- **Causes:**
  - Titles don't match search intent
  - Images are low-quality or missing
  - Prices are higher than competitors
  - Delivery dates show far in future
- **Fix:** Update titles, upgrade images, highlight free shipping or fast delivery

### **"Conversions aren't showing in Google Ads"**
- Check: Are conversions happening? (Check Shopify orders)
- Check: Is pixel firing? (DevTools console, look for 🔥 emoji)
- Check: Is pixel "Connected" in Shopify admin?
- Fix: Re-check pixel setup, wait 24 hours for data to flow, check Google Ads conversion action status

### **"Conversion rate is very low (0.1%)"**
- Issue: Visitors click your ad but don't buy
- Likely causes:
  - Shipping cost surprise at checkout
  - Delivery date too far in future (>14 days)
  - Price mismatch between Merchant Center and site
  - Product page doesn't have reviews/ratings
- Fix: Highlight shipping in product title, get professional product photos, add customer reviews

---

## Reference Links

- **Google Merchant Center:** https://merchantcenter.google.com
- **Google Ads:** https://ads.google.com
- **Shopify Admin (Custom Pixels):** https://admin.shopify.com/store/luxury-dunn-selections/settings/customer_events
- **Google Category Taxonomy:** https://www.google.com/basepages/producttype/taxonomy-en-US.txt
- **Enhanced Conversions Setup:** https://support.google.com/google-ads/answer/9888656

---

## Your Conversion IDs (Keep Safe)

- **Google Ads Account:** AW-17833894840
- **Conversion Action (Purchase):** Conversion ID AW-17833894840, Label: **LxbdCPIH-7QcELjH7rdC**
- **Google Tag Manager:** GT-55VCHDDF
- **GA4:** G-BG9K5QSYQQ
- **Shopify Store:** luxury-dunn-selections.myshopify.com

---

## Next Action

**RIGHT NOW:**
1. Open the [Quick Check Guide](merchant-center-quick-check.md)
2. Spend 5 minutes in Merchant Center
3. Document what you find
4. Reply with:
   - Number of disapproved products
   - Top issue type (images, categories, pricing, etc.)
   - Current impressions/week (if available)
5. I'll prioritize fixes based on your findings

---

## Questions?

Refer to:
- **Merchant Center issues:** [Audit Guide](google-merchant-center-audit.md)
- **Conversion tracking issues:** [Pixel Setup](google-ads-conversion-tracking.md)
- **Ads performance:** [Google Ads Help Center](https://support.google.com/google-ads)
