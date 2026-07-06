# DLS-Belle1 Shopify Theme - Quick Start Guide

## What You Have

A **production-ready Shopify Liquid theme** with:
- ✅ 5 page templates (home, product, collection, cart, pages)
- ✅ 2 reusable sections (header, footer)
- ✅ 650+ lines of CSS (dark theme, gold accents, responsive grid)
- ✅ 380+ lines of JavaScript (cart interactions, GA4 tracking)
- ✅ Theme customization settings (admin UI)
- ✅ Full documentation

**Time to Deploy**: 15 minutes (after product setup)

---

## 5-Minute Setup

### Step 1: Prepare Your Files (2 minutes)
```bash
# Navigate to theme directory
cd C:\Users\ejerc\DLS-Belle1-Liquid

# You should see:
# - layout/
# - templates/
# - sections/
# - assets/
# - config/
# - README.md

# Zip the entire folder (or upload via Shopify CLI)
```

### Step 2: Upload to Shopify (5 minutes)

**Option A: Via Admin Dashboard**
1. Log in to Shopify Admin
2. Go to **Sales channels → Shop → Themes**
3. Click **Add theme → Upload theme**
4. Select `DLS-Belle1-Liquid.zip`
5. Wait 1-2 minutes for processing
6. Click **Customize** to begin editing

**Option B: Via Shopify CLI** (faster if you have it)
```bash
npm install -g @shopify/cli @shopify/theme

# Navigate to theme directory
cd C:\Users\ejerc\DLS-Belle1-Liquid

# Login to your store
shopify theme dev

# This opens a preview at http://localhost:9292
# Changes auto-sync to your store
```

---

## Immediate Next Steps

### ✅ Required (do before launch)

1. **Create Sample Products** (5 minutes)
   - Admin → Products → Create 5-10 test products
   - Add images (featured + thumbnails)
   - Set prices (some ≥ $1,500 for financing)
   - Add descriptions

2. **Create Collections** (3 minutes)
   - Admin → Collections → Create:
     - Electronic Humidors
     - Cabinet Humidors
     - Desktop Humidors
     - Travel Humidors
     - Accessories
   - Add 2-3 products to each

3. **Create Featured Collection** (2 minutes)
   - Admin → Collections → Create "Featured"
   - Add 3 products (these show on homepage)

4. **Upload Logo & Images** (5 minutes)
   - Admin → Customize → Theme settings
   - Upload logo image
   - Add hero section image (optional)

5. **Enable Shop Pay** (2 minutes)
   - Admin → Settings → Payment providers
   - Verify Shop Pay is enabled
   - This makes installments available at checkout

6. **Configure Navigation** (3 minutes)
   - Admin → Customize → Navigation
   - Set main menu links (Collections, About, etc.)
   - Set footer menus

---

### ⚠️ Important (do before tracking)

7. **Verify Google Analytics IDs** (2 minutes)
   - Admin → Customize → Analytics
   - Confirm GA4 ID: `G-BG9K5QSYQQ`
   - Confirm Google Ads ID: `AW-17833894840`
   - Confirm GTM ID: `GT-55VCHDDF`
   - (These are already set; update if different for your store)

8. **Test Checkout** (5 minutes)
   - Add product to cart
   - Click "Proceed to Checkout"
   - Verify Shop Pay appears as payment option
   - Verify financing message shows for ≥ $1,500

---

### Optional (enhancement)

9. **Create Static Pages** (5 minutes each)
   - Admin → Content → Pages → Create:
     - About Us
     - Financing
     - Privacy Policy
     - Terms of Service
     - Care Guides
     - Delivery Info
     - Returns & Warranty
   - Use `templates/page.liquid` (auto-applied)

10. **Set Up Emails** (optional)
    - Admin → Settings → Email notifications
    - Customize transactional emails (order confirmation, etc.)

---

## Testing Checklist

- [ ] Homepage loads with hero, featured products, financing banner
- [ ] Product page displays images, variant selector, Add to Cart
- [ ] Collections page shows product grid with sorting
- [ ] Cart adds/removes items and shows totals
- [ ] Shop Pay "Installments Available" badge appears on ≥ $1,500 products
- [ ] Checkout button redirects to Shopify's checkout
- [ ] Mobile menu (hamburger) works on phone
- [ ] Links in header/footer navigate correctly
- [ ] GA4 events fire (check Google Analytics Real-Time)

---

## Customization Examples

### Change Hero Title
**File**: `templates/index.liquid` (line 39)
```liquid
<h1>Your Custom Hero Title</h1>
```

### Change Gold Color
**File**: `assets/main.css` (line 13)
```css
--gold-400: #your-color-here;
```

### Add New Section to Home Page
**File**: `templates/index.liquid` (add before closing `</div>`)
```liquid
<section class="my-new-section py-16">
  <h2>New Section Title</h2>
  <!-- Your content -->
</section>
```

### Change Shop Pay Minimum
**File**: `config/settings_schema.json` (line 245)
```json
"default": "1500"  // Change to your amount (in cents: 1500 = $15.00)
```

---

## Key Features Reference

### Shop Pay Installments
- **Shown on**: Product pages & cart (products/carts ≥ $1,500)
- **Where**: 
  - Product page: `templates/product.liquid` line ~170
  - Cart page: `templates/cart.liquid` line ~330
- **No code needed**: Shopify handles it natively

### Mobile Responsive
- **Breakpoint**: 768px (Tailwind standard)
- **Mobile**: 1 column, hamburger menu
- **Desktop**: 2-4 columns, full menu
- **Test on**: iPhone 12, iPad, desktop browsers

### Dark Theme
- **Background**: Charcoal #211e1c
- **Text**: Cream #f8f0e0
- **Accents**: Gold #e5a524
- **All defined in**: `assets/main.css` (lines 9-27)

### GA4 Tracking
- **Page views**: Auto-tracked by GA4
- **Events tracked**:
  - `add_to_cart` (product added)
  - `begin_checkout` (checkout clicked)
  - `purchase` (via Shopify Custom Pixel)
- **Setup**: `layout/theme.liquid` (lines 44-52)

---

## Troubleshooting

### "Cart drawer not showing"
- Cart drawer is a JavaScript feature
- Ensure `assets/main.js` is loaded
- Check browser console for JS errors

### "Shop Pay not appearing at checkout"
- Verify Shop Pay is enabled in payment providers
- Test with product price ≥ $1,500
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)

### "Images not loading"
- Verify product featured images are uploaded
- Check image URLs in product editor
- Ensure images aren't missing/deleted

### "GA4 events not firing"
- Verify GA4 ID matches your property
- Check Google Analytics Real-Time report
- Ensure gtag script loads: `layout/theme.liquid` line 44

---

## Admin Customization (No Code Required)

Everything customizable via **Admin → Customize → Theme settings**:

- ✏️ Store name & description
- 🎨 Colors (primary, secondary, text, borders)
- 🔤 Fonts (heading, body)
- 📷 Logo image & size
- 🔍 Search bar toggle
- 📋 Menus (main, footer)
- ⭐ Featured collection
- 📧 Newsletter toggle
- 💳 Shop Pay messaging & threshold
- 📊 Analytics IDs

---

## File Organization Quick Ref

| Need to change... | Edit file... |
|-------------------|--------------|
| Navigation menu | `sections/header.liquid` |
| Footer links | `sections/footer.liquid` |
| Home page sections | `templates/index.liquid` |
| Product page layout | `templates/product.liquid` |
| Collection filters | `templates/collection.liquid` |
| Cart display | `templates/cart.liquid` |
| Static page (About, etc.) | `templates/page.liquid` |
| Styling/colors | `assets/main.css` |
| Interactions/GA4 | `assets/main.js` |
| Theme settings UI | `config/settings_schema.json` |

---

## Common Questions

**Q: Can I edit the theme after upload?**
A: Yes! Admin → Customize → or edit files directly via Admin → Edit code

**Q: Does this include Shop Pay?**
A: The UI is there. Shop Pay itself is a native Shopify feature (enabled in payments).

**Q: What about the blog/journal?**
A: Not included in MVP. Can be added by creating `templates/article.liquid`.

**Q: Can I use my own domain?**
A: Yes! This is a standard Shopify theme. Works on any Shopify store.

**Q: Do I need to know Liquid/CSS?**
A: No! Most customization is via Admin dashboard. Code knowledge optional.

**Q: How do I add more products?**
A: Admin → Products → Create new. Theme auto-displays in collections.

---

## Next Level: Advanced Customization

Once you're comfortable, explore:

1. **Custom product fields**: Metafields for specs, financing details
2. **Advanced filtering**: Shopify's Filter API
3. **Financing calculator**: Custom JavaScript
4. **Product recommendations**: Shopify's built-in AI or Algopix
5. **Email customization**: Transactional email templates
6. **Analytics deep-dive**: Server-side conversion tracking

See **README.md** for comprehensive documentation.

---

**Happy selling! 🎉**

Need help? Check:
1. **README.md** — full feature docs
2. **THEME_INVENTORY.md** — file-by-file breakdown
3. Shopify docs: https://shopify.dev/themes
