# DLS-Belle1 Shopify Liquid Theme (MVP)

A minimal but complete Shopify theme built for **Dunn's Luxury Selections** e-commerce storefront, enabling Shop Pay installments and premium cigar humidor sales.

## Overview

This theme provides a production-ready implementation of Shopify Liquid templates matching the design aesthetic of the original React/Vite headless storefront (`dunnluxuryselections.com`). It includes:

- **Dark theme** (charcoal #211e1c background)
- **Gold accents** (#e5a524 primary color)
- **Premium serif typography** (Playfair Display + Inter)
- **Responsive design** (mobile-first)
- **Shop Pay integration** (native Shopify checkout)
- **GA4 & Google Ads tracking** (configured in theme settings)

## Directory Structure

```
DLS-Belle1-Liquid/
├── layout/
│   └── theme.liquid          # Main page wrapper (header, footer, content)
├── templates/
│   ├── index.liquid          # Home page
│   ├── product.liquid        # Product detail page
│   ├── collection.liquid     # Collection browse page
│   └── cart.liquid           # Shopping cart
├── sections/
│   ├── header.liquid         # Navigation header
│   └── footer.liquid         # Footer with links & trust badges
├── snippets/                 # (For future reusable components)
├── assets/
│   ├── main.css              # Main stylesheet (design system)
│   └── main.js               # JavaScript for interactivity
├── config/
│   └── settings_schema.json   # Theme customization settings
└── README.md                 # This file
```

## Features

### 1. Home Page (`templates/index.liquid`)
- Hero section with CTA
- Featured products grid (3 products from featured collection)
- **Financing banner** with Shop Pay installments info
- Category grid (Electronic, Cabinet, Desktop, Travel humidors)
- Why Choose Us section (3-column trust builders)
- Newsletter signup form
- All sections styled with dark theme + gold accents

### 2. Product Page (`templates/product.liquid`)
- Product image gallery with thumbnail selector
- Title, price, description
- Variant selection dropdown
- Quantity selector (with +/- buttons)
- Add to Cart button
- **Shop Pay installments badge** (shown on products ≥ $1,500)
- Trust badges (money-back guarantee, free shipping, secure checkout)
- Product specifications (if stored in metafields)
- Related products section
- Breadcrumb navigation

### 3. Collection Page (`templates/collection.liquid`)
- Collection hero banner
- Sidebar filters (price range, availability)
- Sort dropdown (featured, best-selling, A-Z, price, newest)
- Product grid with responsive layout
- Product cards with image, title, price, description
- Pagination support
- Empty state messaging

### 4. Cart Page (`templates/cart.liquid`)
- Line item display with images, titles, prices
- Quantity adjusters (with +/- buttons)
- Remove item buttons
- Order summary sidebar (sticky on desktop)
- Subtotal, shipping, tax, total
- Checkout button (→ native Shopify checkout)
- Continue Shopping link
- **Shop Pay installments notice** (on carts ≥ $1,500)
- Empty cart state

### 5. Navigation & Footer
- **Header section** (`sections/header.liquid`)
  - Logo/brand name
  - Desktop navigation menu (collections, about)
  - Mobile hamburger menu
  - Cart icon with item count
  
- **Footer section** (`sections/footer.liquid`)
  - About text
  - 4-column link structure (Collections, Customer Service, Legal, About)
  - Trust badges (verified quality, free shipping, secure checkout)
  - Copyright & legal links

## Design System

### Colors
- **Primary (Dark)**: Charcoal #211e1c (`--charcoal-950`)
- **Secondary (Dark)**: Charcoal #3d3634 (`--charcoal-900`)
- **Accent (Gold)**: #e5a524 (`--gold-400`)
- **Text (Light)**: Cream #f8f0e0 (`--cream-100`)
- **Borders**: Charcoal with 40% opacity

### Typography
- **Headers**: Playfair Display, serif (700 weight)
- **Body**: Inter, sans-serif (400-600 weight)
- **Font imports**: Google Fonts (preconnect for performance)

### Spacing & Layout
- Max container width: 1280px
- Responsive grid system (1col mobile → 3col desktop)
- Consistent padding/margins (1rem, 1.5rem, 2rem, 3rem, 4rem units)
- Mobile-first responsive design

### Components
- Cards with hover effects (translate-y, border color change)
- Buttons (primary gold, secondary with border)
- Forms (charcoal backgrounds, gold focus state)
- Responsive images (100% width, aspect-ratio where applicable)

## Shop Pay Installments

**Setup Requirements:**
1. Enable Shop Pay in Shopify admin (Settings → Payment providers)
2. Set financing threshold in theme settings (`config/settings_schema.json`)
3. The theme automatically displays "Shop Pay Installments Available" badge on products ≥ threshold
4. Customers see financing option at checkout (native Shopify feature — no code needed)

**Messaging locations:**
- Product page (under Add to Cart): `templates/product.liquid` line ~170
- Cart page: `templates/cart.liquid` line ~330

## Google Analytics & Conversion Tracking

**Configuration:**
- GA4 ID: `G-BG9K5QSYQQ`
- Google Ads ID: `AW-17833894840`
- Google Tag Manager: `GT-55VCHDDF`

**Where it's configured:**
- `layout/theme.liquid` (gtag script in head)
- `config/settings_schema.json` (customizable via admin)
- `assets/main.js` (event tracking for add_to_cart, begin_checkout)

**Events tracked:**
- `view_item` (product page load)
- `add_to_cart` (Add to Cart button)
- `begin_checkout` (Checkout button)
- Conversions via Shopify Custom Pixel (admin → Settings → Customer events)

## Installation

### 1. Create Theme in Shopify Admin
```
Admin → Sales channels → Shop → Themes → Add theme → Upload theme code
```

### 2. Upload Files
- Zip the `DLS-Belle1-Liquid` folder
- Upload via Shopify admin theme upload interface
- Or use Shopify CLI:
  ```bash
  shopify theme push
  ```

### 3. Configure Theme Settings
- Admin → Sales channels → Shop → Themes → Customize
- Update:
  - Logo image
  - Navigation menus
  - Featured collection
  - Analytics IDs
  - Footer links
  - Colors (optional — already set to brand palette)

### 4. Set Up Products in Shopify
- Create products with:
  - Title, description, price
  - Featured image + additional images
  - Variants (size, color, etc.) if needed
  - Metafield for specs (optional): `custom.specifications`
- Organize into collections (electronic-humidors, cabinet-humidors, etc.)
- Assign 3-5 products to "Featured" collection for homepage

### 5. Enable Shop Pay
- Admin → Settings → Payment providers
- Shop Pay enabled (required for installments)
- Verify financing threshold in theme settings

## Customization Guide

### Changing Colors
1. Edit `assets/main.css` (lines 17-30 for color variables)
2. Or use theme customization in admin (Settings → Colors)

### Adding/Removing Sections
- Edit `layout/theme.liquid` to add/remove section includes
- Create new section files in `sections/` folder
- Follow the same Liquid + CSS pattern

### Modifying Copy
- Home page hero: `templates/index.liquid` lines 39-43
- Financing banner: `templates/index.liquid` lines 94-97
- Footer links: `sections/footer.liquid` lines 68-96

### Adding New Collections
- Create collection in Shopify admin
- Add link to `sections/header.liquid` navigation
- Products will auto-populate in `templates/collection.liquid`

## Known Limitations (MVP)

- **No product filtering**: Collection page has basic sort only. Full Shopify filtering requires custom development.
- **No search page**: Searchable product catalog excluded from MVP. Add via Shopify Search feature.
- **No blog/journal**: Article functionality not included (can be added as separate templates).
- **No bespoke builder**: Customization tool from headless version not included.
- **Basic pagination**: Uses Shopify's default paginate (12 products/page, no AJAX).
- **No wishlist**: Save-for-later functionality requires custom implementation.

## What's Different from Headless Version

### Removed (by design for MVP)
- Custom React components (Testimonials, Why Us, New Arrivals carousel)
- Financing calculator UI (payment amount estimates)
- Expert chat / Tawk integration
- Product customizer for bespoke humidors
- Journal/blog article system

### Simplified (for Shopify compatibility)
- Cart drawer → Shopify's native cart (can be customized back to drawer with AJAX)
- Checkout flow → Shopify's hosted checkout (instead of custom React checkout)
- Product images → Standard Shopify product images (no custom gallery JS)
- Analytics → Server-side custom pixels instead of gtag event API

### Added (for Shopify best practices)
- Native Shop Pay checkout (works out-of-box)
- Shopify's built-in search & filtering
- Theme settings for easy admin customization
- SEO-friendly meta tags & structured data
- Mobile-responsive menu (hamburger)

## Future Enhancements

To reach full feature parity with the headless version:

1. **Advanced Product Filtering**
   - Implement Shopify Filter API
   - Price range slider
   - Material/type multi-select
   - Financing eligibility toggle

2. **Financing Calculator**
   - Display monthly payment breakdowns on product pages
   - Calculate total interest (always 0% for Shop Pay)
   - Show payment schedule at checkout

3. **Blog/Journal**
   - Create article templates in `templates/article.liquid`
   - Add care guides, news, stories
   - Link from footer & navigation

4. **Customization/Bespoke Builder**
   - Custom product option selectors
   - Price updates based on selections
   - Order notes for special requests

5. **Enhanced Analytics**
   - Server-side conversion tracking via Shopify Pixels
   - Custom events for financing opt-in
   - Product spec tracking (material, capacity, etc.)

6. **Customer Reviews**
   - Integrate Shopify Product Reviews app
   - Display star ratings on product & collection pages

7. **Abandoned Cart Recovery**
   - Shopify Email or third-party integration (Klaviyo, Drip)
   - Automated follow-up sequence

## File Reference

| File | Purpose | Key Sections |
|------|---------|--------------|
| `layout/theme.liquid` | Main wrapper | GA4 setup, cart drawer placeholder |
| `templates/index.liquid` | Home page | Hero, featured products, financing banner |
| `templates/product.liquid` | Product detail | Image gallery, options, Shop Pay badge |
| `templates/collection.liquid` | Browse products | Filters, sort, pagination |
| `templates/cart.liquid` | Shopping cart | Line items, order summary, checkout |
| `sections/header.liquid` | Navigation | Logo, menu, mobile burger |
| `sections/footer.liquid` | Footer | Links, trust badges, copyright |
| `assets/main.css` | Styles | Color palette, responsive grid, components |
| `assets/main.js` | JavaScript | Cart interactions, form validation, GA4 events |
| `config/settings_schema.json` | Admin settings | Customizable options (colors, text, menus) |

## Testing Checklist

- [ ] **Mobile responsiveness**: Test on iPhone 12, iPad, desktop
- [ ] **Product page**: Image gallery, variant selection, Add to Cart
- [ ] **Collection page**: Sort, browse, pagination
- [ ] **Cart page**: Add items, adjust quantity, remove items, checkout
- [ ] **Shop Pay**: Verify financing badge appears on eligible products
- [ ] **GA4 tracking**: Check Google Analytics for page views & events
- [ ] **Conversion tracking**: Verify purchase events in Google Ads
- [ ] **Forms**: Newsletter signup, contact forms
- [ ] **Navigation**: All menu links work, mobile hamburger functions
- [ ] **Images**: All product images load correctly at various sizes
- [ ] **Checkout**: Test Shopify's native checkout flow

## Support & Troubleshooting

### Cart Not Working
- Check Shopify store setup: Admin → Products → Inventory
- Verify products are available (not out of stock across all variants)
- Clear browser cache

### Shop Pay Not Showing
- Verify Shop Pay is enabled: Admin → Settings → Payment providers
- Check product price is ≥ $1,500 (configurable in theme settings)
- Finalized order should show financing option at checkout

### GA4 Events Not Tracking
- Verify GA4 ID in theme settings matches your property
- Check Google Analytics for debug info
- Ensure gtag script loads in `layout/theme.liquid`
- Test with Google Analytics Real-Time report

### Styling Issues
- Check `assets/main.css` is loading (inspect Network tab)
- Verify Shopify CSS is applied (not overridden by browser cache)
- Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## License

This theme is custom-built for Dunn's Luxury Selections. All rights reserved.

---

**Version**: 1.0 (MVP)
**Last Updated**: July 2026
**Contact**: support@dunnluxuryselections.com
