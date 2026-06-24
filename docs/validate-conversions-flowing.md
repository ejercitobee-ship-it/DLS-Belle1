# Validate: Conversions Flowing from Pixel → Google Ads

Once your Shopping campaign is live, verify that conversions are actually being recorded in Google Ads.

---

## The Flow (What Should Happen)

```
Customer searches on Google
    ↓
Sees your Shopping ad
    ↓
Clicks ad → Lands on your site
    ↓
Browses products, adds to cart
    ↓
Clicks checkout → Redirected to Shopify
    ↓
Completes payment on Shopify
    ↓
Shopify fires: checkout_completed event
    ↓
🔥 Custom Pixel detects event
    ↓
✅ Pixel sends conversion to Google Ads (AW-17833894840)
    ↓
Google Ads shows conversion in dashboard (within 3 hours)
    ↓
You see ROI data and optimize
```

---

## Step 1: Make a Test Purchase (Verify Pixel Fires)

**Goal:** Confirm the pixel is working end-to-end

### **From Your Site (Real Purchase Flow)**

1. Go to [dunnluxuryselections.com](https://dunnluxuryselections.com)
2. Add any product to cart (e.g., a $50 accessory)
3. Click "Checkout"
4. Complete Shopify checkout (use test card: `4111 1111 1111 1111`)
5. On **Shopify Thank You page**, open DevTools (**F12**)
6. Go to **Console** tab
7. Look for these logs:
   ```
   ✅ DLS pixel: gtag.js loaded in sandbox
   🔥 DLS pixel: checkout_completed received {orderId: "...", value: 50, currency: "USD"}
   ✅ DLS pixel: Google Ads conversion sent AW-17833894840/LxbdCPIH-7QcELjH7rdC
   ✅ DLS pixel: GA4 purchase sent
   ```

**What each log means:**
- `✅ gtag.js loaded` = Pixel script is installed
- `🔥 checkout_completed received` = Pixel detected the purchase
- `✅ Google Ads conversion sent` = **Conversion pinged to Google (CRITICAL)**
- `✅ GA4 purchase sent` = GA4 also recorded the event

### **If You See All 4 Logs ✅**
→ Pixel is 100% working. Conversions will flow to Google Ads within 3 hours.

### **If You See Only First 3 Logs (Missing the Google Ads log)**
→ Pixel loaded but didn't send to Google. Likely issue: gtag.js network error.
- Refresh page and try again
- Check if gtag.js is blocked by ad blocker
- Check browser Network tab for failures on `googletagmanager.com`

### **If You Don't See Any Logs**
→ Pixel may not be connected. 
- Go to Shopify Admin → Settings → Customer events
- Verify pixel shows "Connected" status
- Re-connect if needed

---

## Step 2: Check Google Ads Dashboard (24–48 hours later)

**Goal:** Verify Google Ads received the conversion

### **In Google Ads:**

1. Go to [Google Ads](https://ads.google.com)
2. **Conversions** (left sidebar, under Tools)
3. Click **"Purchase"** conversion action
4. Look at **Conversion action details**
5. Scroll down to **Recent conversions** table
6. You should see your test conversion:
   ```
   Date: [Today]
   Time: [Your purchase time]
   Value: $50 (or whatever you spent)
   Device: Mobile/Desktop
   ```

### **If You See Your Conversion ✅**
→ Conversion pipeline is working perfectly. All real purchases will be tracked.

### **If You Don't See It (After 48 hours)**
→ Conversion didn't reach Google. Check:
1. Conversion action is "Active" (not paused)
2. Pixel is "Connected" in Shopify admin
3. Make another test purchase and check logs again
4. If still missing, the issue is the pixel or network, not Google Ads setup

---

## Step 3: Compare Pixel Data to Google Ads Data

Once you have real customer orders coming through, verify the numbers match.

### **Daily Check (Week 1):**

**In Shopify:**
- Admin → Orders
- Filter by: Orders from [yesterday]
- Count: How many orders? (e.g., 5 orders)
- Total value: Sum of all orders (e.g., $1250)

**In Google Ads:**
- Conversions → Purchase action
- Date range: [yesterday]
- Count: How many conversions? (e.g., 5 conversions)
- Total value: Sum of conversion values (e.g., $1250)

**Comparison:**
```
Shopify Orders: 5 orders, $1250 total
Google Ads Conversions: 5 conversions, $1250 total
→ ✅ MATCH! Pixel is 100% accurate
```

### **Expected Discrepancies (Normal):**

| Scenario | Reason | Action |
|----------|--------|--------|
| Google has MORE conversions | Customers navigated back and forth before buying | Check if duplicates (same transaction_id) |
| Google has FEWER conversions | Pixel failed for some orders | Check pixel logs for errors |
| Values don't match | Different currency or rounding | Check if you use multiple currencies |
| Google shows 1 hour lag | Google batches conversions | Wait, check again in 1 hour |

---

## Step 4: Weekly Validation

Every Sunday, run this 5-minute check:

### **Checklist:**

- [ ] **Shopify orders count:** _____ (from Admin → Orders)
- [ ] **Shopify total revenue:** $_____ (sum of paid orders)
- [ ] **Google Ads conversions count:** _____ (from Conversions tab)
- [ ] **Google Ads total value:** $_____ (sum of conversion values)
- [ ] **Match status:** ✅ YES / ❌ MISMATCH

### **If Match ✅**
→ No action needed. Pixel is working perfectly.

### **If Mismatch ❌**
→ Investigate:
1. Check Shopify Admin → Settings → Customer events → Pixel status
2. Verify pixel is "Connected" (green checkmark)
3. Check if any orders have errors (Shopify Admin → Orders, look for notes)
4. If >10% mismatch, pause campaign and contact support

---

## Red Flags (If You See These, Debug Immediately)

| Red Flag | Meaning | Action |
|----------|---------|--------|
| **Zero conversions after 7 days** | Pixel not firing or campaign not getting clicks | Check Shopping campaign status (should be "Eligible"); verify pixel in Shopify |
| **Conversions don't match orders** | >20% discrepancy between Shopify and Google Ads | Check pixel logs; verify conversion action is recording correctly |
| **Pixel logs show ❌ errors** | Pixel loaded but failed to send to Google | Check gtag.js network requests; try incognito window (no ad blocker) |
| **Campaign shows 0 impressions after 48 hours** | Campaign not serving | Check budget; verify Merchant Center feed is "Ready to serve" |
| **Conversions showing but conversion_id doesn't match** | Different conversion action is recording | Verify "Purchase" action is active; check for duplicate actions |

---

## Google Ads Conversion Report (View Detailed Data)

Once you have conversions, drill into the data:

### **Go to:**
1. Google Ads → **Campaigns**
2. Click your **Shopping campaign** name
3. Click **Conversions** column header → Sort by conversions

### **You'll see:**
- **Product groups** (categories of products)
- **Clicks** per product
- **Conversions** per product
- **Cost per conversion**
- **ROAS** (Revenue / Spend)

### **Example:**
```
Product Group: Cabinet Humidors
  Clicks: 12
  Conversions: 2
  Cost per conversion: $180
  Total revenue from group: $500
  ROAS: 2.78x ← Profitable! Scale this.

Product Group: Accessories
  Clicks: 50
  Conversions: 2
  Cost per conversion: $450
  Total revenue: $300
  ROAS: 0.67x ← Unprofitable. Pause or optimize.
```

---

## Success Criteria

| Milestone | Timeline | Target |
|-----------|----------|--------|
| Pixel fires on test purchase | Day 1 (today) | ✅ All 4 logs appear |
| Conversion shows in Google Ads | Day 2–3 (24–48h) | ✅ Conversion appears in dashboard |
| Real conversions match Shopify | Day 7+ (after >5 orders) | ✅ Numbers within 5% |
| Consistent daily tracking | Day 14+ | ✅ Daily variation <10% |

---

## Troubleshooting Conversion Issues

### **Problem: "Pixel logs show ✅ sent, but no conversion in Google Ads"**

**Likely causes:**
1. Conversion action is paused
2. Network latency (takes up to 3 hours)
3. Wrong conversion ID in pixel code

**Fix:**
1. Google Ads → Conversions → "Purchase" → Check status (should be "Active")
2. Wait 3 hours, check again
3. Compare pixel log: `AW-17833894840/LxbdCPIH-7QcELjH7rdC` to conversion action details

### **Problem: "Orders exist in Shopify but not in Google Ads"**

**Likely causes:**
1. Pixel not connected in Shopify
2. Pixel code has error (check console)
3. Customer used ad blocker (pixel blocked)

**Fix:**
1. Shopify Admin → Settings → Customer events → Pixel → Should show "Connected"
2. Check Shopify order notes (sometimes shows "Conversion tracking disabled")
3. For blocked orders: Can't recover; ensure pixel loads correctly for future orders

### **Problem: "Google Ads shows MORE conversions than Shopify orders"**

**Likely causes:**
1. Customers placed multiple orders on same day
2. Duplicate transaction_id (shouldn't happen with our pixel)
3. Test purchases mixed in

**Fix:**
1. Check Shopify order dates — do they match Google Ads conversion dates?
2. Verify each Shopify order appears once in Google Ads
3. Filter out test purchases (use order ID pattern matching)

---

## Summary

| Check | When | Expected Result |
|-------|------|-----------------|
| Make test purchase | Day 1 (today) | See ✅ logs in DevTools console |
| Check Google Ads dashboard | Day 2–3 | Conversion appears in Purchase action |
| Compare to Shopify orders | Day 7+ (after 5+ orders) | Numbers match within 5% |
| Weekly validation | Every Sunday | Pixel status still "Connected"; numbers match |

**If all checks pass ✅ → Pixel is working perfectly. Monitor weekly, optimize based on ROAS.**

---

## Questions?

- **Pixel not showing logs?** → Check Shopify Admin → Settings → Customer events → Pixel status
- **Conversion not appearing?** → Wait 24–48 hours, check conversion action status
- **Numbers don't match?** → Compare Shopify order dates with Google Ads conversion dates
- **Need help debugging?** → Open DevTools on Shopify Thank You page, look for ❌ error logs
