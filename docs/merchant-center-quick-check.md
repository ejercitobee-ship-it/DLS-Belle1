# Google Merchant Center — Quick Check (5 Minutes)

Use this checklist while you're in Merchant Center to spot the top issues. Do this RIGHT NOW.

## Step 1: Check Account Health (30 seconds)

1. Open [Google Merchant Center](https://merchantcenter.google.com)
2. Go to **Products → Diagnostics → Issues**
3. **Question:** Do you see a list of disapproved products?
   - [ ] YES — Go to Step 2
   - [ ] NO — Go to Step 3

---

## Step 2: Disapprovals Found? (Do This First)

**How many products are disapproved?**
- [ ] 0–5 products: Fix manually (see below)
- [ ] 5–20 products: Bulk fix needed
- [ ] 20+ products: Feed-level issue (all products affected)

### **For each disapproved product, click it and look for:**

| Field | What to Check | Fix If... |
|-------|---------------|-----------|
| **Image** | Is the image URL showing? Does it load in a new browser tab? | URL broken (404) or image too small (<300×300) → Re-upload to public CDN |
| **Title** | Length (should be <150 chars) and includes product name | Too long (>150) → Truncate. Too generic ("Humidor") → Add specifics ("250-Capacity Cabinet") |
| **Category** | Does it have a number (e.g., `190`) or text (e.g., "Humidors")? | Text only → Must use Google category ID. [Find it here](https://www.google.com/basepages/producttype/taxonomy-en-US.txt) |
| **Price** | Format is `NUMBER CURRENCY` (e.g., `2500 USD`)? | Wrong format (e.g., `$2500` or `2,500.00`) → Fix to `2500.00 USD` |
| **Availability** | Is it exactly one of: `in stock`, `out of stock`, `preorder`? | Other values → Change to one of these three |
| **Link** | Does the product URL work when you click it? | 404 or wrong page → Fix URL to point to correct product page |

### **What's the #1 most common issue you see?**
- [ ] **Images broken** → Fix: Test every image URL, move to permanent public server
- [ ] **Categories wrong** → Fix: Use numeric Google category ID from taxonomy
- [ ] **Title too long** → Fix: Truncate to 150 chars, move details to description
- [ ] **Price format wrong** → Fix: Change to `PRICE CURRENCY` format (e.g., `2500.00 USD`)

**After fixing, go to:** **Products → Feeds → (Your feed) → Upload/Refresh** → Wait 24–48 hours

---

## Step 3: No Disapprovals, But Low Traffic? (Do This If No Issues Found)

Go to **Shop → Performance**

1. **Check Impressions (in last 7 days):**
   - [ ] 100+ impressions: Good → Go to Step 4
   - [ ] 10–100 impressions: Low visibility → Problem #1 below
   - [ ] <10 impressions: Feed not active → Problem #2 below

### **Problem #1: Low Impressions (customers not seeing your products)**

**Likely causes:**
- [ ] Product titles don't match search queries
- [ ] Images are missing or low-quality
- [ ] Delivery date shows far in future (>14 days)
- [ ] Shipping cost too high

**Quick fix:**
1. Go to **Google Ads → Search terms report**
2. What keywords are customers searching for?
3. Update your product **titles** to match those keywords
4. Add **delivery_date** field (format: `YYYY-MM-DD`, e.g., `2026-07-05`)
5. Check **shipping cost** — is it too high? (Most common reason for low CTR)

### **Problem #2: Feed Not Active (zero impressions even with good data)**

1. Go to **Products → Feeds**
2. Is your primary feed showing as "Active"?
   - [ ] YES → Feed is active
   - [ ] NO or "Processing Error" → Feed has issues
   - [ ] Multiple feeds → Only one should be primary

**If feed is inactive:**
1. Click feed name
2. Check **Upload status** (should say "Completed" not "Failed" or "In progress")
3. If "Failed": Click to see error details
4. Common fixes:
   - File was corrupted → Re-upload
   - FTP credentials wrong → Check settings
   - Shopify connector not authorized → Re-authorize
5. Re-upload → Wait 24 hours

---

## Step 4: Visibility Good, But Low Conversions? (CTR > 2% but conversion rate low)

Go to **Shop → Performance → Conversion rate**

**If CTR >2% but conversion <1%:**

This means ads are getting clicks, but visitors aren't buying. Check:

1. **Product page experience:**
   - [ ] Is product page mobile-friendly?
   - [ ] Does it load fast (<3 seconds)?
   - [ ] Is price immediately visible?
   - [ ] Are there customer reviews/ratings?

2. **Pricing:**
   - [ ] Is Merchant Center price the same as site price?
   - [ ] Are you visible/competitive vs. Amazon?
   - [ ] Is white-glove delivery messaging clear?

3. **Delivery messaging:**
   - [ ] Does product page clearly state "Ships in 5–10 business days"?
   - [ ] Is white-glove delivery highlighted?
   - [ ] Are shipping costs clear upfront?

4. **Trustworthiness:**
   - [ ] Do you have customer reviews (Google, Trustpilot)?
   - [ ] Is warranty clearly stated?
   - [ ] Are you listed on Better Business Bureau?

**Action items:**
- Add delivery expectation to product title/description
- Consider creating 2–3 new product images (product angles, lifestyle shot)
- Add customer review count to product page
- Consider promotional offer ("Free shipping over $150")

---

## Step 5: Quick Status Check (1 minute)

Answer these questions to prioritize your work:

- [ ] **Account linked to Google Ads (AW-17833894840)?**
  - Go to **Settings → Business info → Google Ads linked accounts**
  - Should show AW-17833894840

- [ ] **Feed active and uploading daily?**
  - **Products → Feeds** → Feed should show "Active" status
  - **Last upload:** Should be recent (within 24 hours)

- [ ] **Disapproved products < 10?**
  - If YES → Manually fix via Diagnostics
  - If NO → Feed-level issue → Fix field mappings

- [ ] **Impressions > 100/week?**
  - If YES → Move to CTR/conversion optimization
  - If NO → Add delivery_date & optimize titles

---

## 🚨 RED FLAGS (Fix Today If Any Apply)

- [ ] Feed shows "Error" status in **Products → Feeds**
- [ ] Image URLs all return 404 when you test them
- [ ] All products have the same category (should be varied)
- [ ] No delivery_date specified (customers don't see "Arrives by...")
- [ ] More than 30% of products disapproved
- [ ] No products appearing in Google Shopping search results

---

## Next: Detailed Assessment

Once you complete this quick check, document:

1. **Total products in feed:** ____
2. **Disapproved products:** ____
3. **Top disapproval reason:** _______________
4. **Impressions (last 7 days):** ____
5. **Clicks:** ____
6. **CTR:** _____%
7. **Conversions (from Shopping):** ____

Then come back and share these numbers. I'll provide targeted fixes.

---

## Can't Find It?

**If you can't find a page mentioned above:**

1. Go to [Google Merchant Center](https://merchantcenter.google.com)
2. Make sure you're in the **Dunn's Luxury Selections** account (top-left dropdown)
3. Use the left sidebar navigation to find each section

**Still stuck?** Share:
- Screenshot of Merchant Center home page
- What shows under **Products → Diagnostics → Issues** (if anything)
- If there's a warning banner at the top of Merchant Center

---

## One More Thing

After you fix issues, **it takes 24–48 hours for Google to reprocess the feed.** Don't assume fixes are broken if you don't see changes immediately. Check again in 48 hours.
