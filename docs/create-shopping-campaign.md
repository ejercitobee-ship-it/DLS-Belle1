# Create Your First Google Shopping Campaign — DLS

## 10-Minute Setup

Your Merchant Center is ready (shipping configured ✅). Now create the campaign that shows your products in Google Shopping search results.

---

## Step 1: Open Google Ads (2 min)

1. Go to [Google Ads](https://ads.google.com)
2. Make sure you're in account **AW-17833894840** (top-left dropdown)
3. Click **Campaigns** (left sidebar)

---

## Step 2: Create Campaign (5 min)

1. Click **+ New campaign** (blue button)
2. **Select a goal:**
   - Scroll down and find **"Sales"**
   - Click **"Sales"** → Next
3. **Campaign type:**
   - Select **"Shopping"**
   - Subtype: **"Shopping ads"** (top option)
   - Click **Continue**

---

## Step 3: Campaign Settings (3 min)

Fill in these fields (leave others default):

| Field | Value | Why |
|-------|-------|-----|
| **Campaign name** | `DLS - Shopping - Test` | Identifies this campaign |
| **Merchant Center** | Select "Dunn's Luxury Selections" | Links to your product feed |
| **Primary country** | United States | Where you ship |
| **Inventory filter** | (leave blank) | Shows all approved products |
| **Budget** | `30.00` | Daily budget ($30/day = $900/month) |
| **Bid strategy** | "Maximize clicks" | Good for new campaigns |
| **Language** | English | Default |

**Detailed steps:**

### **Campaign name**
- Click field → Type: `DLS - Shopping - Test`
- This identifies the campaign in your dashboard

### **Merchant Center**
- Click dropdown → Select **"Dunn's Luxury Selections"**
- This connects to your product feed (246 products)

### **Primary country**
- Click dropdown → Select **"United States"**
- Google will show ads to US customers only

### **Inventory filter**
- Leave BLANK (you want all approved products shown)
- If you wanted to exclude certain products, you'd add filters here

### **Budget**
- Click field → Type: `30.00`
- This is your daily budget: $30/day = ~$900/month
- You can change later

### **Bid strategy**
- Click dropdown → Select **"Maximize clicks"**
- This tells Google: "Get me as many clicks as possible for my budget"
- Great for new campaigns (safer than "Target ROAS")

---

## Step 4: Ad Group Settings (Optional - Skip for Now)

You'll see an "Ad groups" section:
- [ ] Leave as default (Skip detailed setup)
- Google will auto-create based on your feed

---

## Step 5: Review and Create (1 min)

1. Scroll to bottom
2. Review:
   - Campaign name: `DLS - Shopping - Test` ✅
   - Merchant Center: "Dunn's Luxury Selections" ✅
   - Budget: `30.00` USD/day ✅
   - Bid strategy: "Maximize clicks" ✅
3. Click **Create campaign**

**Done!** ✅

---

## What Happens Next

### **Immediately (0–2 hours):**
- Campaign status: "Eligible" (ready to serve)
- Ads start showing in Google Shopping search results
- You may see first impressions within 2–4 hours

### **First 24 hours:**
- Monitor: Impressions, Clicks, CTR
- Expected: 10–50 impressions (depends on your product keywords)

### **First week:**
- Monitor: Conversions flowing through pixel
- Expected: 5–15 conversions (at typical 10–15% conversion rate)
- Check: Conversion data in Google Ads matches Shopify orders

### **Week 2+:**
- Optimize: Pause low-performing products
- Scale: Increase budget if ROAS is positive
- Refine: Adjust bids based on performance

---

## Monitor Your Campaign (Right After Creation)

### **Immediately after clicking "Create campaign":**

1. You'll see dashboard with campaign stats
2. Look for:
   - **Status:** Should show "Eligible" (green checkmark)
   - **Impressions:** Will show 0 initially, updates within 2–4 hours
   - **Clicks:** Will show 0 initially

3. Wait 2–4 hours, then refresh
4. You should see impressions starting to accumulate

---

## Budget Tiers (Choose One)

| Budget | Daily | Monthly | Best For | Expected Conversions/Month |
|--------|-------|---------|----------|---------------------------|
| **$10/day** | $10 | $300 | Minimal risk testing | 1–3 |
| **$20/day** | $20 | $600 | Conservative testing | 3–7 |
| **$30/day** | $30 | $900 | **Recommended (balance)** | **5–15** |
| **$50/day** | $50 | $1500 | Aggressive testing | 15–30 |
| **$100/day** | $100 | $3000 | Full-scale launch | 30–50+ |

**Recommendation: Start with $30/day**
- Enough budget to get meaningful data (5–15 conversions/month)
- Not so much that you waste money if performance is poor
- Can increase after Week 2 if ROAS is positive (>1.0)

---

## Budget Formula

```
Daily Budget = (Target Conversions/Month) × (CPC) / 30

For DLS:
Target conversions/month: 10
Estimated CPC: $3–5 (luxury items)
Daily budget needed: 10 × $4 / 30 = $1.33/day (minimum)

To be safe, 10x that: $13.30/day
Round up: $30/day

So $30/day will get you 10–15 conversions/month.
```

---

## First Week Checklist

After creating the campaign, do this daily:

### **Day 1 (Today):**
- [ ] Campaign created ✅
- [ ] Status shows "Eligible" ✅
- [ ] Document initial budget in spreadsheet

### **Day 2–3 (Wait for impressions):**
- [ ] Impressions appear in dashboard (>10 impressions)
- [ ] Clicks start accumulating (>1 click)
- [ ] CTR shows (should be 0.5–2% for luxury items)

### **Day 4–7 (Monitor conversions):**
- [ ] Check Google Ads → Campaigns → (Your Shopping campaign) → Conversions column
- [ ] Verify conversions are appearing
- [ ] Compare to Shopify orders (should match)
- [ ] Check pixel logs in console (if you want to debug)

### **End of Week 1:**
- [ ] Total impressions: Document (e.g., 500)
- [ ] Total clicks: Document (e.g., 15)
- [ ] Total conversions: Document (e.g., 2–3)
- [ ] Calculate CTR: Clicks / Impressions (e.g., 15/500 = 3%)
- [ ] Calculate conversion rate: Conversions / Clicks (e.g., 2/15 = 13%)

---

## Troubleshooting

### **"Campaign created but showing 0 impressions after 24 hours"**

**Likely causes:**
1. Budget too low (Google won't serve if budget can't cover minimum CPC)
2. Bid strategy too conservative
3. Products not matching search queries

**Fix:**
1. Go to campaign → Click **Edit**
2. Increase budget to $50/day temporarily
3. Change bid strategy to "Maximize impressions"
4. Save → Wait another 24 hours

### **"I see impressions but no clicks"**

**Likely causes:**
1. Product titles don't match search intent
2. Images are low-quality
3. Prices are higher than competitors

**Fix:**
1. Check your top products (Campaigns → Product groups)
2. Review which products are getting impressions
3. Compare titles to search terms in Google Ads
4. Consider running a Google Ads Search campaign alongside Shopping

### **"I see clicks but no conversions"**

**Likely causes:**
1. Pixel isn't firing (check DevTools console on Shopify Thank You page)
2. Conversion lag (Google reports conversions with 24–48h delay)
3. Low conversion rate (only 5% of visitors buy)

**Fix:**
1. Make a test purchase to verify pixel fires
2. Wait 48 hours for conversion data to populate
3. If still zero, check pixel in Shopify admin (must be "Connected")

---

## Success Metrics (Week 1 Targets)

| Metric | Target | Action If Below |
|--------|--------|-----------------|
| Impressions | 100+ | Increase budget or improve product titles |
| Clicks | 5+ | Increase budget or improve CTR |
| CTR | >0.5% | Improve product images/titles |
| Conversions | 1+ | Wait for data (24–48h lag) or check pixel |
| Conversion rate | >5% | Check product page speed, trust signals |

---

## After Week 1: Optimize

Once you have 1–2 weeks of data:

1. **Identify top performers:**
   - Which products got most clicks?
   - Which converted best?
   - Scale budget for those products

2. **Pause underperformers:**
   - Which products got impressions but zero clicks?
   - Negative CTR sign → Consider pausing

3. **Optimize bids:**
   - High ROAS products → Increase bid
   - Low ROAS products → Decrease bid

4. **Scale budget:**
   - If ROAS > 2.0x → Double budget
   - If ROAS > 1.5x → Increase 50%
   - If ROAS < 1.0x → Hold or decrease

---

## Key Takeaway

Once this campaign is live:
1. Your 246 approved products show in Google Shopping search results
2. Customers click → land on your site
3. Add to cart → Shopify checkout
4. Custom pixel fires → Google Ads receives conversion
5. You see ROAS and optimize

**Everything after the click is automated.** The pixel handles conversion tracking. You just monitor budget and bids.

---

## Next Steps

1. **Right now:** Follow steps 1–5 above (10 min)
2. **Tomorrow:** Check dashboard for impressions
3. **Day 3:** Monitor for first conversions
4. **End of Week 1:** Review performance, decide on scaling

**Questions?** Check [Troubleshooting](#troubleshooting) section above.
