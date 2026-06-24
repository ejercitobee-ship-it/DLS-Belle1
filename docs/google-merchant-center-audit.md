# Google Merchant Center Audit — Dunn's Luxury Selections

## Quick Assessment Checklist

Use this checklist to diagnose issues in your Merchant Center. Check each item, note any issues, and implement fixes in order of priority.

### 1. **Account & Store Setup**
- [ ] Account linked to Google Ads (AW-17833894840)
- [ ] Landing page URL: `https://dunnluxuryselections.com` (verify in Settings → Business info)
- [ ] Store country: United States
- [ ] Currency: USD
- [ ] Language: English

**How to check:** Merchant Center → Settings → Business info

---

### 2. **Product Feed Status**
- [ ] Primary feed is active and set as default
- [ ] Last upload date is recent (within 24 hours)
- [ ] Feed status: "Processing complete" or "Ready to serve" (NOT "Processing" or "Error")
- [ ] No disapproved products (check Products → Diagnostics → Issues)
- [ ] Disapproval rate < 5%

**How to check:** Merchant Center → Products → Feeds

---

### 3. **Critical Product Data Fields** (for EACH disapproved product)

Check these in order — if missing, add them to your feed:

#### a) **Product ID** (`id`)
- Must be unique per product
- Should match your Shopify product ID or handle
- **Common issue:** IDs change between uploads, causing dupes

#### b) **Title** (`title`)
- **Max 150 characters**
- Must include product name + key modifier (color, size, capacity)
- **Examples:**
  - ✅ `Manchester 250 Cabinet Cigar Humidor`
  - ✅ `Digital Hygrometer with Calibration — Gold`
  - ❌ `Humidor` (too generic)
  - ❌ `Electronic Humidor Raching RR980 3000-4000 Capacity Water Cooled with 6 Cedar Shelves and 4 Drawers...` (too long)

#### c) **Description** (`description`)
- **Max 5,000 characters** (recommended: 100–500)
- Include key features: capacity, dimensions, material, warranty
- Include benefits, not just specs
- **Example:**
  ```
  Luxury cabinet cigar humidor with capacity for 250 cigars. 
  Spanish cedar shelves, digital humidity control (±2%), 
  white-glove delivery. Ships in 5–10 business days.
  ```

#### d) **Product Category** (`google_product_category`)
- Use Google's category taxonomy (NOT Shopify categories)
- **For DLS products, likely:**
  - `191 → Home & Garden > Kitchen & Dining > Bar & Wine Accessories` (for humidors)
  - `188 → Smoking & Tobacco Supplies > Cigars & Cigar Accessories`
  - `190 → Smoking & Tobacco Supplies > Cigar Humidors`
- **How to find:** [Google Category Taxonomy](https://www.google.com/basepages/producttype/taxonomy-en-US.txt)

**Common issue:** Category number doesn't match Google's list → product disapproved

#### e) **Price** (`price`)
- **Format:** `PRICE CURRENCY` (e.g., `2500 USD`)
- Decimal OK: `2500.00 USD`
- Must match Shopify price

#### f) **Availability** (`availability`)
- Values: `in stock`, `out of stock`, `preorder`
- **Default:** `in stock` (best for conversions)
- If product is discontinued, set to `out of stock`

**Common issue:** All products marked `preorder` kills CTR

#### g) **Image URL** (`image_link`)
- **At least 1 image per product (REQUIRED)**
- URL must be publicly accessible (not Shopify CDN behind auth)
- Aspect ratio: **Square (1:1) preferred; minimum 100×100 px**
- Max file size: 16 MB
- Format: JPG, PNG, GIF, TIFF, WebP
- **Format:** `https://dunnluxuryselections.com/images/product-name.jpg`

**Common issues:**
- Broken/redirected image links (404)
- Images too small (<300×300 px) — looks blurry
- Shopify CDN URLs that expire or require auth
- Duplicate images across products (each product needs unique images)

#### h) **Additional Images** (`additional_image_link`)
- Up to 10 additional images per product
- Same requirements as main image
- Show product from multiple angles (great for high-ticket items)

#### i) **GTIN** (`gtin`) — *Conditional*
- UPC/EAN barcode (if product has one)
- If you leave blank, Google auto-matches to inventory
- **For luxury items:** Often not available → safe to omit

#### j) **MPN** (`mpn`) — *Conditional*
- Manufacturer Part Number
- **For DLS:** Include if available from manufacturer (Raching, etc.)

#### k) **Brand** (`brand`)
- Product manufacturer (e.g., "Raching", "Adorini", etc.)
- **NOT** "Dunn's Luxury Selections" (you're the retailer, not the brand)
- Do NOT leave blank for branded products

#### l) **Condition** (`condition`)
- Values: `new` (default), `refurbished`, `used`
- For DLS: Always `new`

#### m) **Material** (`material`)
- Wood, metal, acrylic, etc.
- Relevant for high-consideration humidors
- Optional but helps with product understanding

---

### 4. **Shipping & Delivery** (Critical for conversion)

#### a) **Shipping** (`shipping`)
- **Format:** `{country}:{postal_code_prefix}:{price} {currency}`
- **Example:** `US::0 USD` (free shipping, all US)
- If flat rate $50: `US::50 USD`
- **Issue:** Missing shipping kills conversion — customers see "Calculate at checkout"

#### b) **Delivery Date** (`delivery_date`)
- **Format:** ISO 8601 (`2026-07-05`)
- Ship date + lead time
- **For DLS:** `5–10 business days` = ~2 weeks
- **Calculate:** Today + 14 days
- **Example:** If today is 2026-06-24, set `2026-07-08` for "ships in 5–10 days"
- **Better:** Use a range with `max_delivery_time` + `min_delivery_time` (if supported by feed)

**Why this matters:** Google shows "Arrives by July 8" in Shopping → increases perceived urgency → higher CTR/conversion

---

### 5. **Merchant Promotion Code** (Optional, High Impact)
- If running a promotion (e.g., "Free shipping on $150+")
- Add to feed and reference in Merchant Center → Promotions
- Appears in Shopping ads: ⭐ "Free shipping offer"

---

### 6. **Product Quality Issues**

Run this diagnostic in Merchant Center:

**Path:** Merchant Center → Products → Diagnostics → Issues

Look for these common disapprovals:

| Issue | Cause | Fix |
|-------|-------|-----|
| **Image missing** | No image_link provided | Add `image_link` field to feed |
| **Image broken** | Image URL returns 404 | Re-upload images to public CDN; test URL in browser |
| **Invalid price format** | `$2500` instead of `2500 USD` | Use `PRICE CURRENCY` format |
| **Title too long** | >150 chars | Truncate to 150 chars; move details to description |
| **Category not in taxonomy** | Used `Humidors (custom)` instead of Google category ID | Use Google's official category ID (e.g., `190`) |
| **Link not working** | `link` field returns 404 or doesn't match product | Verify URL in browser; ensure product live on site |
| **Availability invalid** | `In Stock (Expected)` instead of `in stock` | Use exact values: `in stock`, `out of stock`, `preorder` |
| **GTIN conflict** | Two products have same barcode | Remove duplicate GTINs or use MPN instead |
| **Brand missing** | Left blank for branded products | Add manufacturer brand |

---

### 7. **Shopping Ads Eligibility**

After fixing disapprovals, verify:

**Path:** Merchant Center → Shop → Performance → Eligibility

Check that:
- [ ] Shopping campaigns are enabled
- [ ] Store policies linked (Return policy, etc.)
- [ ] Account status: "Active" (not "Disabled" or "Limited")
- [ ] Tax rates configured for US (if applicable)

---

### 8. **Performance Metrics** (Weekly Check)

**Path:** Merchant Center → Shop → Performance

Monitor:
- **Impressions:** How often products appear in Shopping ads
- **Clicks:** Traffic from Shopping ads → site
- **CTR:** Click-through rate (target: >2% for luxury items)
- **Conversion rate:** (should align with Google Ads data)

If CTR is low (<1%):
- **Issue #1:** Product images too small or poor quality
- **Issue #2:** Titles don't match search queries (customers searching "cabinet humidor 250" → you titled it "Humidor")
- **Issue #3:** Price too high compared to organic competitors
- **Issue #4:** Delivery date shows far in future (14+ days)

---

## Common High-Impact Fixes (In Priority Order)

### 🔴 **Priority 1 — Blocking Issues (Fix TODAY)**

1. **Image URLs broken (404 errors)**
   - Test every image URL in browser
   - If Shopify CDN, add to firewall whitelist
   - Use permanent, public URLs only
   - **Impact:** Products disapproved, zero visibility

2. **Invalid Google product categories**
   - Download [Google Category Taxonomy](https://www.google.com/basepages/producttype/taxonomy-en-US.txt)
   - Map your products to the correct category ID
   - Humidors are likely category **190** (Home & Garden > Housewares > Storage & Organization)
   - **Impact:** Disapproved products don't appear in Shopping

3. **Missing required fields** (per category):
   - All products need: `id`, `title`, `description`, `link`, `image_link`, `price`, `availability`
   - **Impact:** Zero visibility without these

### 🟡 **Priority 2 — High-Impact Improvements (Fix This Week)**

4. **Delivery date**
   - Add `delivery_date` or calculate from Shopify fulfillment
   - Format: `YYYY-MM-DD` (e.g., `2026-07-08`)
   - **Impact:** Increases conversion by 10–15% (customers see delivery date in ad)

5. **Shipping cost**
   - Add `shipping` field with rate
   - Free shipping if possible (or offer it on orders >$150)
   - **Impact:** Eliminates cart abandonment from surprise shipping costs

6. **Title optimization**
   - Ensure titles match search intent
   - Include key attributes: material, capacity, style
   - **Before:** "Cigar Humidor"
   - **After:** "Manchester 250 Cabinet Cigar Humidor — Spanish Cedar, Electronic"
   - **Impact:** +20–30% CTR improvement

7. **Additional images**
   - Add 3–5 angles per product (especially electronics)
   - Show humidors open, closed, interior shelving
   - Show size reference (person next to humidor for perspective)
   - **Impact:** Higher trust → higher conversion on $1,000+ items

### 🟢 **Priority 3 — Nice-to-Have (Fix Next Month)**

8. **Brand field**
   - Clarify manufacturer vs. retailer
   - Filter by brand in Google Shopping

9. **Material & condition specs**
   - Spanish cedar, stainless steel, etc.
   - Helps customers filter

10. **Promotions**
    - Link shipping promotions to feed
    - Appears as "Special offer" badge in Shopping ads

---

## Diagnosing Feed Issues

### **Scenario A: Products are disapproved**

1. Go to **Merchant Center → Products → Diagnostics**
2. Click **Issues** tab
3. Find the product
4. Click the issue code (e.g., "Missing Required Attribute")
5. Note the specific field that's missing or invalid
6. Fix in your feed or Shopify metafields
7. Re-upload feed
8. Wait 24–48 hours for reprocessing

### **Scenario B: Products are approved but have low visibility**

1. Check **Merchant Center → Shop → Performance → Impressions**
2. If impressions are low:
   - Product titles may not match search queries
   - Images may be low-quality or small
   - Prices may be uncompetitive
3. Check **Google Ads** for search term reports — what are customers searching for?
4. Update titles to match intent
5. Upgrade images (hire photographer for 5–10 hero shots)
6. Consider price matching or promotional offers

### **Scenario C: CTR is low (<0.5%)**

- **Image quality:** Invest in professional product photography ($500–1000 for 10 products)
- **Delivery urgency:** Highlight "Ships in 5 days" in title and description
- **Trust signals:** Add warranty length, brand name, social proof in description
- **Price competitiveness:** Review Amazon and direct competitor pricing

---

## Connecting to Google Ads

1. **Merchant Center → Settings → Business info**
2. Click **Google Ads linked accounts**
3. Verify **AW-17833894840** is linked
4. In Google Ads, go to **Tools → Shopping campaigns**
5. Create a campaign with this feed
6. Allocate budget (~$20–100/day for testing)
7. Wait 48 hours for impressions to accumulate
8. Monitor CTR and conversion rate

---

## Feed Upload Methods (Choose One)

### **Option A: Automatic Feed (Recommended)**
- **Merchant Center → Products → Feeds**
- Click **Create feed** → Select **Shopify** connector
- Authorize Shopify store
- Map fields (Shopify column → Google Merchant attribute)
- Set schedule (daily auto-sync)
- Let Shopify auto-upload daily

### **Option B: Manual XML Upload**
- Generate XML feed from Shopify or custom script
- **Merchant Center → Products → Feeds**
- Upload file
- Re-upload every 24 hours

### **Option C: API Feed (Advanced)**
- Use Google's Shopping API
- Real-time bidirectional sync
- Requires developer setup

---

## Tools & Resources

- **[Google Merchant Center Help](https://support.google.com/merchants)**
- **[Category Taxonomy](https://www.google.com/basepages/producttype/taxonomy-en-US.txt)** (required for every product)
- **[Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool)** (validate your feed before uploading)
- **[Merchant Center Diagnostics](https://merchantcenter.google.com/diagnostics)** (check for errors)

---

## Next Steps

1. **Open Merchant Center → Check account status**
2. **Products → Diagnostics → Document all disapprovals**
3. **Create a spreadsheet:** Product ID | Issue | Fix | Status
4. **Fix highest-priority items** (images, categories, required fields)
5. **Re-upload feed** and monitor for 24 hours
6. **Verify disapprovalscleared**
7. **Monitor Shopping impressions & CTR for 2 weeks**
8. **Optimize based on performance data**

---

## Questions?

Check Merchant Center's **Help** menu or run the **Diagnostics Report** (Merchant Center → Products → Diagnostics) — it identifies specific products and fields causing issues.
