# Google Shopping Ads — Go-Live Checklist

Everything you need to launch Google Shopping ads and start tracking conversions.

---

## ✅ Status: Ready to Launch

| Component | Status | Notes |
|-----------|--------|-------|
| **Merchant Center** | ✅ Ready | Shipping configured, 246 products approved |
| **Product Feed** | ✅ Ready | 99% approval rate, great quality score |
| **Conversion Pixel** | ✅ Deployed | Shopify custom pixel firing, tested |
| **Google Ads Account** | ✅ Linked | AW-17833894840 connected to Merchant Center |
| **GA4** | ✅ Configured | G-BG9K5QSYQQ tracking events |
| **Shopping Campaign** | ⏳ Not created yet | 10-min setup (next step) |

---

## Phase 1: Create Shopping Campaign (Today — 10 min)

### **Do This Right Now:**

Follow: [Create Shopping Campaign Guide](create-shopping-campaign.md)

1. [ ] Open Google Ads (https://ads.google.com)
2. [ ] Verify account: **AW-17833894840**
3. [ ] Click **+ New campaign**
4. [ ] Select goal: **"Sales"** → Continue
5. [ ] Campaign type: **"Shopping"** → Continue
6. [ ] Fill campaign settings:
   - Campaign name: `DLS - Shopping - Test`
   - Merchant Center: `Dunn's Luxury Selections`
   - Country: `United States`
   - Daily budget: `30.00` USD
   - Bid strategy: `Maximize clicks`
7. [ ] Click **Create campaign**

**Time:** 10 minutes  
**Cost:** $30/day (~$900/month)  
**Result:** Campaign goes live in 2–4 hours

### **What Happens Next:**
- Campaign status: "Eligible" (live)
- First impressions within 2–4 hours
- First clicks within 6–8 hours
- First conversions within 24–48 hours

---

## Phase 2: Monitor First 48 Hours (Daily, 5 min)

### **Tomorrow (Day 2) — Check for Impressions**

Follow: [Validate Conversions Guide](validate-conversions-flowing.md) — Step 1

1. [ ] Go to Google Ads → Campaigns
2. [ ] Click your **"DLS - Shopping - Test"** campaign
3. [ ] Check stats:
   - Impressions: Should be **>10**
   - Clicks: Should be **>1**
   - CTR: Should be **>0.5%**

**If you see these:**
→ Campaign is working ✅ Proceed to Step 2

**If you see 0 impressions:**
→ Wait another 24 hours (takes 2–4 hours to start serving)
→ Check budget is actually spending (click **Daily limit** to verify)

---

### **Day 3 (48 hours) — Check for Conversions**

Follow: [Validate Conversions Guide](validate-conversions-flowing.md) — Step 2

1. [ ] Go to Google Ads → **Conversions** (left sidebar)
2. [ ] Click **"Purchase"** conversion action
3. [ ] Look for **Recent conversions** table
4. [ ] Should see at least **1 conversion** from real orders (or from your test purchase)

**If you see conversions:**
→ Pixel is 100% working ✅ Proceed to Phase 3

**If you see 0 conversions (but have clicks/impressions):**
→ Make a test purchase to verify pixel fires (see validation guide)
→ Check Shopify Admin → Settings → Customer events → Pixel status (must be "Connected")

---

## Phase 3: Validate Conversions (Day 3–7)

### **Make a Test Purchase (Verify End-to-End)**

Follow: [Validate Conversions Guide](validate-conversions-flowing.md) — Step 1

1. [ ] Go to dunnluxuryselections.com
2. [ ] Add a product to cart
3. [ ] Checkout with test card: `4111 1111 1111 1111`
4. [ ] On Shopify Thank You page:
   - [ ] Open DevTools (F12)
   - [ ] Go to Console
   - [ ] Look for these 4 logs:
     ```
     ✅ DLS pixel: gtag.js loaded in sandbox
     🔥 DLS pixel: checkout_completed received
     ✅ DLS pixel: Google Ads conversion sent AW-17833894840/LxbdCPIH-7QcELjH7rdC
     ✅ DLS pixel: GA4 purchase sent
     ```

**If you see all 4 logs ✅:**
→ Pixel is firing perfectly ✅
→ Check Google Ads in 24 hours for the conversion to appear

**If you DON'T see the Google Ads log ❌:**
→ Pixel may not be connected
→ Go to Shopify Admin → Settings → Customer events
→ Verify pixel shows "Connected" status
→ Check pixel code (copy from [Shopify Pixel Setup](google-ads-conversion-tracking.md))

---

## Phase 4: Weekly Monitoring (Week 1+)

### **Every Monday (Or daily if you prefer)**

Fill in this table to track progress:

| Week | Impressions | Clicks | Conversions | Revenue | CTR | CPC | ROAS |
|------|-------------|--------|-------------|---------|-----|-----|------|
| 1 | _____ | _____ | _____ | $_____ | ___% | $____ | ___ |
| 2 | _____ | _____ | _____ | $_____ | ___% | $____ | ___ |
| 3 | _____ | _____ | _____ | $_____ | ___% | $____ | ___ |
| 4 | _____ | _____ | _____ | $_____ | ___% | $____ | ___ |

**How to get these numbers:**
- Go to Google Ads → Campaigns → (Your Shopping campaign)
- Click **Date range** → Select **Last 7 days**
- Numbers appear in summary row

**Week 1 targets:**
- Impressions: 100+
- Clicks: 5+
- Conversions: 1+
- CTR: >0.5%

---

## Phase 5: Optimize (Week 2+)

### **Once You Have Data (After 1 Week)**

1. [ ] **Review product performance:**
   - Go to Campaigns → Your Shopping campaign
   - Click **Product groups** tab
   - Sort by **Conversions** (highest first)
   - Note: Which products are converting? (scale these)
   - Note: Which products have impressions but no clicks? (pause/improve these)

2. [ ] **Decide on budget:**
   - If ROAS > 2.0x → Increase budget 50% (e.g., $30/day → $45/day)
   - If ROAS > 1.5x → Increase budget 25% (e.g., $30/day → $37/day)
   - If ROAS < 1.0x → Hold budget or decrease 25%
   - If ROAS < 0.5x → Pause campaign, audit product data

3. [ ] **Pause underperformers:**
   - In Product groups tab
   - Sort by **CTR** (lowest first)
   - Any product with 0 conversions and <0.5% CTR → Click to edit → Exclude or pause

---

## Phase 6: Scale (Week 3+)

### **If Performance is Strong (ROAS > 1.5x)**

1. [ ] Double-check conversions are tracked correctly
   - Shopify orders match Google Ads conversions (within 5%)
   - Pixel is connected (Shopify → Settings → Customer events)

2. [ ] Increase budget
   - Current: $30/day
   - New: $50/day (or based on targets)
   - Set new daily limit

3. [ ] Monitor for 1 more week
   - Higher budget should bring higher conversions
   - ROAS should remain similar (ideally improve slightly)

4. [ ] Scale further if ROAS remains strong
   - Target: Grow conversions 20–30% per week

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| **0 impressions after 48h** | Check: Budget spent? Feed "Ready"? Increase bid strategy to "Maximize impressions" temporarily |
| **0 conversions after 1 week (but have clicks)** | Make test purchase, check pixel logs in DevTools console |
| **Conversions don't match Shopify orders** | Wait 48h for data lag, verify conversion action is active, check pixel in Shopify admin |
| **CTR is very low (<0.3%)** | Improve product titles/images, increase budget to get more impressions, check if prices are competitive |
| **Campaign keeps pausing** | Check daily budget (may be too low), verify Merchant Center feed is active, check Google Ads account status |

---

## Document Reference

| Document | When to Read | Why |
|----------|--------------|-----|
| **[Create Shopping Campaign](create-shopping-campaign.md)** | Phase 1 (today) | Step-by-step campaign creation |
| **[Validate Conversions](validate-conversions-flowing.md)** | Phase 2–3 (first week) | Verify pixel firing, conversions in Google Ads |
| **[Merchant Center Setup](google-merchant-center-audit.md)** | If products are disapproved | Troubleshoot product feed issues |
| **[Pixel Setup](google-ads-conversion-tracking.md)** | If conversions aren't showing | Re-verify pixel code in Shopify |
| **[Priority Fixes](merchant-center-priority-fixes.md)** | If low visibility | Unlock limited products with shipping config |

---

## Daily Checklist (Week 1)

### **Day 1 (Today)**
- [ ] Campaign created ✅
- [ ] Status: "Eligible" ✅
- [ ] Daily budget: $30 ✅

### **Day 2**
- [ ] Impressions: >10 ✅
- [ ] Clicks: >1 ✅
- [ ] CTR showing ✅

### **Day 3**
- [ ] Make test purchase ✅
- [ ] Check pixel logs in DevTools ✅
- [ ] Verify all 4 logs appear ✅

### **Day 4**
- [ ] Check Google Ads conversions ✅
- [ ] Test conversion should appear ✅

### **Day 7**
- [ ] Total week impressions: _____ ✅
- [ ] Total week conversions: _____ ✅
- [ ] ROAS: ________ ✅
- [ ] Decision: Scale / Hold / Pause ✅

---

## Success Metrics (30 Days)

| Metric | Target | Reality |
|--------|--------|---------|
| Days to first conversion | <7 days | ____ days |
| Conversions per week | 3–5 | ____ conversions |
| Average order value | $150–500 | $____ |
| ROAS | >1.5x | ____x |
| Monthly revenue from Shopping | $1500–2500 | $____ |

---

## Emergency Contacts

If something goes wrong:

- **Google Ads support:** https://support.google.com/google-ads
- **Shopify pixel issue:** Shopify Support (check Shopify Admin)
- **Merchant Center:** https://support.google.com/merchants
- **Conversion tracking:** Check pixel logs in DevTools (F12 → Console)

---

## Next Step: Phase 1

**Go to [Create Shopping Campaign Guide](create-shopping-campaign.md) and follow the 10-minute setup.**

Once done, report back with:
- Campaign created? (Yes/No)
- Campaign status? (Eligible/Processing/Error)
- Daily budget set to? ($__/day)

Then I'll guide you through Phase 2 monitoring. 🚀
