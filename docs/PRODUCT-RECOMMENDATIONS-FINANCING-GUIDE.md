# Product Recommendations & Financing Guide

## Overview

The theme now includes intelligent product recommendation logic and automatic financing widget management. This means:

✅ **Smart Product Display**: Homepage shows your highest-value products automatically  
✅ **Smart Financing**: Financing banner only shows if you have products >= $1,500  
✅ **Automatic Widget Logic**: Financing widget appears on product pages only for qualifying items  

---

## How It Works

### 1. Featured Products Section (Homepage)

**What it does:**
- Shows your premium humidors on the homepage
- Automatically sorts by price (highest first)
- Displays your most valuable products prominently

**How it works:**
1. If you select a collection: Shows products from that collection, sorted high-to-low
2. If no collection selected: Shows ALL products, sorted high-to-low
3. Limit: Shows up to 12 products (configurable)

**In Shopify Admin:**
1. Go to **Sales channels** → **Online store** → **Customize theme**
2. Click on **Featured Products** section
3. Choose:
   - **Collection**: Pick a specific collection OR leave blank for all products
   - **Sort By**: Default is "Price: High to Low" (recommended)
   - **Number of Products**: 3-12 (we recommend 6)

### 2. Financing Banner (Homepage)

**What it does:**
- Automatically shows a financing promotion banner
- Only appears if you have products >= $1,500
- If no products qualify, banner is hidden (no broken sections!)

**How it works:**
- System checks all products in your store
- If any product costs $1,500+, banner displays
- Banner links to your financing details page

**In Shopify Admin:**
1. Go to **Customize theme**
2. Click on **Financing Banner** section
3. Settings:
   - **Section Label**: e.g., "Flexible Financing"
   - **Heading**: e.g., "Remove Barriers to Building Your Collection"
   - **Minimum Product Price**: Default $1,500 (can adjust)
   - **Show Payment Examples**: Toggle on/off
   - **Primary/Secondary CTA**: Links to financing page and shop

### 3. Product Financing Widget (Product Pages)

**What it does:**
- Shows "Shop Pay Installments" widget on product detail pages
- Only appears for products >= $1,500
- Displays 4-payment breakdown

**How it works:**
- Product page automatically detects price
- If >= $1,500: Widget appears
- If < $1,500: Widget hidden

**No configuration needed** - it's automatic!

Example widget shows:
- "This item qualifies for 0% APR financing"
- Monthly payment breakdown (divides price by 4)
- "Learn more" link to financing page

---

## Examples

### Example 1: Luxury Cabinet Humidor ($3,150)

**Product Page Shows:**
- ✅ Product title, image, description
- ✅ Price: $3,150
- ✅ "Shop Pay Installments" widget
  - 4 payments of $787.50 each
  - Interest-free
- ✅ "Add to Cart" button
- ✅ Related products

### Example 2: Cigar Cutter ($45)

**Product Page Shows:**
- ✅ Product title, image, description
- ✅ Price: $45
- ❌ Financing widget (hidden - too cheap)
- ✅ "Add to Cart" button
- ✅ Related products

### Example 3: Homepage

**If you have NO products >= $1,500:**
- ✅ Hero banner
- ✅ Featured products (sorted by price)
- ❌ Financing banner (hidden - no qualifying products)
- ✅ Testimonials
- ✅ Trust signals
- ✅ Newsletter

**If you DO have products >= $1,500:**
- ✅ Hero banner
- ✅ Featured products (sorted by price)
- ✅ Financing banner (displays!)
- ✅ Testimonials
- ✅ Trust signals
- ✅ Newsletter

---

## Setup Steps

### Step 1: Configure Featured Products

1. In Shopify Admin → **Customize theme**
2. Find **Featured Products Carousel** section
3. Choose:
   - **Collection**: Select one OR leave blank for all
   - **Sort By**: "Price: High to Low"
   - **Number of Products**: 6
4. Click **Save**

### Step 2: Verify Financing Banner

1. In Shopify Admin → **Customize theme**
2. Find **Financing Banner** section
3. Verify all content is correct:
   - Heading, description, button text
   - Minimum product price: $1,500
4. Click **Save**

### Step 3: Check Product Pages

1. Go to your storefront
2. Click on an expensive product ($1,500+)
3. Verify you see the financing widget
4. Click on a cheap product (<$1,500)
5. Verify financing widget is hidden

### Step 4: Test Homepage

1. Go to homepage
2. If you have products >= $1,500:
   - ✅ Featured products display
   - ✅ Financing banner displays
3. If no products >= $1,500:
   - ✅ Featured products display
   - ✅ Financing banner hidden

---

## Customization Options

### Change Featured Products Collection

Want to show only "Premium Humidors"?

1. Create a collection in Shopify: "Premium Humidors"
2. Add your best products to it
3. In theme customization:
   - Featured Products → Collection: "Premium Humidors"
4. Now homepage shows only those products

### Change Financing Threshold

Want financing to show for items >= $1,000?

1. In Shopify Admin → **Customize theme**
2. Find **Financing Banner** section
3. Change "Minimum Product Price" to 1000
4. Click **Save**

### Hide Financing Banner Temporarily

Want to disable the financing promotion?

1. Find **Financing Banner** section
2. Click **Remove section** (or hide it)
3. Financing widget still shows on product pages
4. Banner just won't appear on homepage

---

## How Prices Work

The system checks prices in **cents**. Here's the conversion:

| Price | In Cents | Qualifies? |
|-------|----------|-----------|
| $99.99 | 9999 | ❌ No |
| $999.99 | 99999 | ❌ No |
| $1,500.00 | 150000 | ✅ Yes |
| $3,150.00 | 315000 | ✅ Yes |
| $5,000.00 | 500000 | ✅ Yes |

---

## Troubleshooting

### Featured Products Section is Blank

**Problem**: No products showing on homepage
**Causes**:
- No collection selected AND no products in store
- Collection selected but empty
- Products have no images

**Solution**:
1. Add products to Shopify
2. Make sure each product has at least one image
3. If collection selected: add products to that collection
4. Refresh homepage

### Financing Banner Won't Show

**Problem**: Banner isn't appearing even though you have expensive items
**Causes**:
- No products >= $1,500 in store
- Banner section was removed
- Minimum price threshold too high

**Solution**:
1. Check product prices (must be >= $1,500)
2. In theme customization: verify Financing Banner is there
3. Lower the "Minimum Product Price" setting
4. Refresh browser (hard refresh: Ctrl+Shift+R)

### Financing Widget on Product Page Disappears

**Problem**: Was showing, now it's not
**Causes**:
- Product price was dropped below $1,500
- Widget section was removed from product template

**Solution**:
1. Check product price (must be >= $1,500)
2. Hard refresh browser
3. Try different product
4. Check theme customization

---

## Pro Tips

### Maximize Featured Products Visibility
- Set number to 6-8 (not too many, not too few)
- Sort by "Price: High to Low" (shows premium items first)
- Use a "Featured" or "Premium" collection for curated selection

### Optimize Financing Marketing
- Use clear, benefit-focused heading: "Remove Barriers to Building Your Collection"
- Show payment examples: "4 payments of $787.50"
- Link to detailed financing page for more info
- Ensure CTA buttons are clear: "Learn About Financing" and "Shop Qualifying Products"

### Track Performance
- Monitor which products people click on
- Check if financing banner increases engagement
- See if financing widget increases conversion rates
- Adjust product order based on what sells

---

## What's Automated

✅ Sorts products by price automatically  
✅ Hides/shows financing based on product prices  
✅ Calculates 4-payment breakdown automatically  
✅ Responsive on mobile and desktop  
✅ Optimized for search engines  

---

## What You Control

🎛️ Which collection to feature  
🎛️ How many products to show  
🎛️ Financing banner text and CTAs  
🎛️ Minimum financing price threshold  
🎛️ Show/hide payment examples  

---

## Next Steps

1. ✅ Add collections (if not done)
2. ✅ Configure Featured Products section
3. ✅ Verify financing banner shows (if you have $1,500+ items)
4. ✅ Test product pages
5. ✅ Launch!

---

## Questions?

If something isn't working:
1. Check the **Troubleshooting** section above
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache
4. Try incognito/private mode
5. Let me know with screenshots and I'll fix it

You're all set! 🚀
