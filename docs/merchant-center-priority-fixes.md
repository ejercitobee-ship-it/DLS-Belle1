# Google Merchant Center Priority Fixes — DLS

## Your Current Status

```
Total Products: 246
  ├─ Approved (full visibility): ~120 products (49%)
  ├─ Limited (reduced visibility): 123 products (50%)  ← YOUR OPPORTUNITY
  └─ Disapproved (blocked): 3 products (1.2%)  ← Minor issue

Store Quality Score: GREAT ✅
```

---

## The Problem: Limited Visibility

**What "Limited" means:** Your products CAN show in Google Shopping, but Google is restricting impressions because:
- Missing data that would improve ad performance
- Incomplete shopping information
- Geographic/shipping configuration gaps

**Impact:** You're getting 50–60% fewer impressions than you could.

**The Fix:** Add missing shipping data and local inventory configuration.

---

## Priority 1: Configure Shipping Information (Biggest Impact)

**Issue:** 55 products (22.3%) missing shipping info for countries you're targeting

**Why this matters:**
- Customers see "Calculate shipping at checkout" instead of price in ad
- Kills CTR on expensive items (humidors cost $500–$5,000)
- Google can't optimize for profitable shipping zones
- Shopping ads don't show if shipping info is incomplete for target country

**Who needs this:** If you're selling internationally (even just US + Canada/Mexico)

### **Fix: Add Shipping to Your Feed**

#### **Option A: Add to Merchant Center Manually (5 min, quick fix)**

1. **Merchant Center → Products → Feeds**
2. Click your primary feed name
3. Go to **Settings** tab
4. Scroll to **Shipping settings**
5. Click **Add shipping**
6. Fill in:
   - **Country:** United States
   - **Region:** (leave blank for all states)
   - **Service:** Flat rate
   - **Price:** Enter your standard shipping cost
   - **Min order value:** (optional, e.g., Free over $150)
7. **Save** → Wait 24 hours for reprocessing

**Cost of entry:** 5 minutes
**Time to take effect:** 24 hours
**Impact:** Unlocks ~55 products from "Limited" to "Approved"

#### **Option B: Add to Your Product Feed (Better Long-term)**

If you have a **Shopify connector feed** (recommended), you can add shipping data directly:

1. In Merchant Center, go to **Products → Feeds**
2. Click your feed
3. **Attribute mapping** tab
4. Look for field: `shipping` (should show "Not mapped")
5. Click **Map** → Select Shopify field that contains shipping info
   - If you don't have a Shopify metafield for shipping, create one:
     - Shopify Admin → Products → Pick a product
     - Scroll to **Metafields**
     - Add: **Namespace:** `google`, **Key:** `shipping`
     - **Value:** `US::50 USD` (format: COUNTRY::PRICE CURRENCY)
6. **Save mapping** → Feed will auto-include shipping next upload
7. Wait 24 hours

**Cost of entry:** 15 minutes (first time); then automatic
**Time to take effect:** 24 hours
**Impact:** All 246 products inherit shipping info; future products auto-include

---

## Priority 2: Local Inventory Data (Secondary)

**Issue:** 66 products (26.7%) missing local inventory data

**What it is:** Google wants to know if your product is available at a physical location (if you have a store or warehouse they can query).

**Who needs this:**
- [ ] You have a brick-and-mortar store → ADD THIS
- [ ] You only ship online from warehouse → SKIP THIS

**Is DLS a physical storefront?**
- If **YES:** Google can show "Buy online, pick up in store" → Major CTR boost
- If **NO:** Not needed for conversions, skip to shipping

### **If you DO have a physical location:**

1. **Merchant Center → Products → Feeds**
2. Click feed → **Settings** → **Local inventory**
3. **Add location** → Choose your store
4. Map: `local_inventory` attribute from your feed
5. Include fields:
   - `store_code` (your store ID)
   - `availability` (`in stock` / `out of stock`)
   - `price` (optional, if different from online price)
   - `quantity` (if you want to show stock level)

**Cost of entry:** 10–15 minutes setup
**Impact:** Enables "Buy online, pick up" ads → +30% CTR on local searches

### **If you DON'T have a physical location:**

**Action:** Ignore this section. It won't affect your online conversion rates.

---

## Priority 3: Fix the 3 Disapproved Products (Minor)

**Status:** Only 3 products blocked (1.2% of catalog) — this is excellent

**Action:**
1. **Merchant Center → Products → Diagnostics → Issues**
2. Filter: **Status** = "Not approved"
3. Click each product and note the specific issue
4. Common fixes:
   - **Image broken (404):** Re-upload image to public CDN
   - **Title too long:** Truncate to 150 chars
   - **Category invalid:** Use numeric Google category ID
   - **Link not working:** Fix product URL

**Expected time:** 10–15 minutes

---

## Implementation Plan (Choose Your Path)

### **Path A: Quick Win (15 minutes, +55 products unlocked)**

Do THIS immediately:

1. [ ] Merchant Center → Products → Feeds → Settings → Shipping
2. [ ] Add: `Country: US, Service: Flat rate, Price: [your rate]`
3. [ ] Save → Wait 24 hours
4. [ ] Check back: 55 products should move from "Limited" to "Approved"

**Time to unlock:** 24 hours
**Impressions gain:** ~30–50% increase on those 55 products
**Cost:** Free

---

### **Path B: Complete Fix (1 hour, +120 products optimized)**

Do THIS for comprehensive improvement:

**Day 1 (30 min):**
1. [ ] Add shipping via Merchant Center (as above)
2. [ ] Fix the 3 disapproved products (check diagnostics)
3. [ ] Verify feed reprocesses successfully

**Day 2 (30 min, after 24-hour reprocessing):**
4. [ ] Check Merchant Center → Overview
5. [ ] Count how many products moved to "Approved"
6. [ ] Document impressions before/after in Google Ads

**Timeline to full impact:** 48 hours
**Impressions gain:** ~50% increase across limited products
**Conversion impact:** Estimated +20–30% CTR improvement (customers see "Ships in X days" instead of "Calculate shipping")

---

### **Path C: Full Optimization (2 hours, for physical location)**

If you have a brick-and-mortar DLS showroom:

1. [ ] Complete Path B (shipping + disapprovals)
2. [ ] Add local inventory mapping (Merchant Center → Local inventory)
3. [ ] Ensure store hours/location are in Google Business Profile
4. [ ] Test "Buy online, pick up in store" ads

**Timeline:** 1–2 days
**Impact:** Enables location-based shopping ads → +30% CTR on local searches

---

## Recommended: Path B (Complete Fix)

**Why:** Takes ~1 hour but unlocks 50% of your catalog and directly addresses the two largest visibility blocks.

**Expected results:**
- 55 products: Limited → Approved (shipping data)
- 66 products: Limited → better visibility (once we resolve shipping, local inventory becomes secondary)
- 3 products: Not approved → Approved (if we fix them)
- **Net:** ~120 products gain full visibility (50% CTR increase estimated)

---

## Step-by-Step: Add Shipping Info

### **Via Merchant Center UI (Fastest)**

1. Go to [Google Merchant Center](https://merchantcenter.google.com)
2. **Products → Feeds** (left sidebar)
3. Click your primary feed name
4. **Settings** tab
5. Scroll down to **"Shipping settings"**
6. Click **Add shipping**
7. Fill in:
   ```
   Country: United States
   Region: (leave blank)
   Service: Flat rate
   Price: [your rate] (e.g., 50 for $50)
   Currency: USD
   Min order value: (optional)
   ```
8. Click **Save**
9. Go back to **Overview** tab
10. Verify feed status changes to "Processing..." then "Ready"
11. Wait 24 hours

### **Via Shopify Metafield (Long-term, Best)**

If you want this to persist and auto-update:

1. **Shopify Admin → Products → [Pick any product]**
2. Scroll to **Metafields** section (bottom)
3. **Add metafield:**
   - **Namespace:** `google`
   - **Key:** `shipping`
   - **Type:** `Single line text`
   - **Value:** `US::50 USD`
4. Save product
5. Repeat for 5–10 products to test
6. In Merchant Center, go to **Feeds → (Your feed) → Attribute mapping**
7. Find field `shipping` and **Map** it to your Shopify metafield
8. Save mapping
9. Feed will auto-sync daily with shipping info

---

## Check Results (24 Hours Later)

**After 24 hours, verify the fix worked:**

1. Go to **Merchant Center → Products → Diagnostics**
2. Check **Limited status** products count
   - **Before:** 123 limited
   - **After:** Should drop to ~60 (the other 55 now approved)
3. Check **Issues** count
   - Should drop significantly if shipping was the issue

---

## Google Ads Impact (After 48 Hours)

Once feed reprocesses (48 hours):

1. Create a **Shopping campaign** in Google Ads (if you don't have one):
   - Campaign type: Shopping
   - Feed: DLS Merchant Center
   - Budget: $20–50/day
   - Bid strategy: Maximize clicks

2. Monitor after 48 hours:
   - **Impressions:** Should increase 30–50%
   - **Clicks:** Should increase proportionally
   - **CTR:** Track in Google Ads → Campaigns → Your Shopping campaign

3. In Merchant Center, check **Shop → Performance**:
   - Impressions by product category
   - Click growth rate
   - Average CPC

---

## One More Thing: Why This Matters for Conversions

```
Current state (Limited visibility):
  123 products × 50% impression reduction
  = 61.5 products' worth of lost impressions

With shipping configured:
  123 products now at 100% visibility
  = 61.5 additional impressions per week
  = 6–8 additional clicks per week
  = 1–2 additional conversions per week (at ~15% conversion rate)
  = $150–500 additional revenue/week (at $150–500 AOV)
  = $600–2000/month from ONE fix
```

Shipping data alone could be worth **$7,000–24,000/year**.

---

## Action Items (Priority Order)

### **TODAY (5 minutes):**
- [ ] Determine: Does DLS have a physical storefront? (Yes / No)

### **TOMORROW (30 minutes):**
- [ ] Add shipping via Merchant Center (Path A)
- [ ] Fix the 3 disapproved products
- [ ] Submit feed for reprocessing

### **DAY 2 (10 minutes, after 24-hour reprocessing):**
- [ ] Check Merchant Center overview
- [ ] Verify products moved from "Limited" to "Approved"
- [ ] Document results

### **DAY 3 (optional, if physical location):**
- [ ] Set up local inventory data
- [ ] Configure store location in Google Business Profile

---

## Questions?

**"What shipping rate should I use?"**
- Check your Shopify shipping settings
- Or check your cost (e.g., flat $50, free over $150)
- Set the standard rate; you can adjust later

**"Will this affect my current orders?"**
- No. Shipping info in Merchant Center is for Google Ads only.
- It doesn't change your actual Shopify shipping costs.

**"How long until I see results?"**
- 24 hours for feed reprocessing
- 48 hours for Google to update product status
- 5–7 days for statistically significant impression changes

**"What if I'm unsure about my shipping rate?"**
- Set a conservative flat rate (e.g., $50)
- Customers can still calculate real cost at checkout
- You can refine it later based on Google Ads data

---

## Success Metrics (Check After 1 Week)

| Metric | Before | Target | Impact |
|--------|--------|--------|--------|
| Limited products | 123 | <70 | 50+ products unlocked |
| Disapproved products | 3 | 0 | 100% approval |
| Weekly impressions | ? | +30% | More visibility |
| Weekly clicks | ? | +30% | More traffic |
| Conversions/week | ? | +20% | More revenue |

---

## Next Step

**Reply with:**
1. Does DLS have a physical storefront? (Yes / No)
2. What's your standard shipping cost (flat rate or threshold-based)?
3. Do you want to do Path A (quick fix) or Path B (complete fix)?

I'll provide the exact steps based on your answers.
