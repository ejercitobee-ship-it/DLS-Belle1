# DLS-Belle1 Shopify Liquid Theme - File Inventory

**Project Root**: `C:\Users\ejerc\DLS-Belle1-Liquid\`

## Complete File Structure

```
DLS-Belle1-Liquid/
│
├── layout/
│   └── theme.liquid              # Main page wrapper (all pages inherit this)
│
├── templates/
│   ├── index.liquid              # Home page (hero, featured products, financing, collections)
│   ├── product.liquid            # Product detail page (images, options, reviews, related)
│   ├── collection.liquid         # Collection browse page (grid, filters, sort, pagination)
│   ├── cart.liquid               # Shopping cart (line items, order summary, checkout)
│   └── page.liquid               # Static pages (about, financing, policies, etc.)
│
├── sections/
│   ├── header.liquid             # Navigation header (logo, menu, cart icon)
│   └── footer.liquid             # Footer (links, trust badges, copyright)
│
├── snippets/                     # (Directory for future reusable components)
│   └── (empty — ready for expansion)
│
├── assets/
│   ├── main.css                  # Main stylesheet (design system, responsive grid, components)
│   └── main.js                   # JavaScript (cart interactions, GA4 events, form handling)
│
├── config/
│   └── settings_schema.json      # Shopify admin customization settings
│
├── README.md                     # Complete setup & customization guide
└── THEME_INVENTORY.md            # This file
```

---

## File Details

### Layout Files

#### `layout/theme.liquid` (130 lines)
**Purpose**: Main page wrapper — all templates inherit this structure.

**Includes**:
- HTML5 DOCTYPE with meta tags
- Open Graph & Twitter card meta
- Google Fonts imports (Playfair Display, Inter)
- GA4 & Google Ads gtag setup
- Shopify's `content_for_header` (critical for admin features)
- Header navigation section
- Main content area
- Footer section
- Cart drawer placeholder
- Main CSS & JavaScript includes

**Key Config**:
- GA4 ID: `GT-55VCHDDF`
- Google Ads ID: `AW-17833894840`

---

### Template Files

#### `templates/index.liquid` (350 lines)
**Purpose**: Home page with hero, featured products, financing banner, collections.

**Sections**:
1. **Hero** (lines 39-43)
   - Full-width gradient background
   - Title, subtitle, CTA button
   - Customizable text via Liquid

2. **Featured Products** (lines 45-87)
   - 3-product grid from "featured" collection
   - Product card component: image, title, price, description, CTA

3. **Financing Banner** (lines 89-125)
   - Shop Pay installments messaging
   - 3-column highlights (4 payments, 0% APR, secure)
   - Learn More link to `/pages/financing`

4. **Collections** (lines 127-165)
   - 2×2 grid of category collections
   - Electronic, Cabinet, Desktop, Travel humidors
   - Image overlays with collection names

5. **Why Choose Us** (lines 167-203)
   - 3-column trust builders
   - Icons + copy for quality, support, satisfaction

6. **Newsletter** (lines 205-230)
   - Email signup form
   - Privacy notice
   - Integrated with Shopify contact forms

---

#### `templates/product.liquid` (430 lines)
**Purpose**: Product detail page with full product information, variants, and related products.

**Sections**:
1. **Breadcrumb** (lines 49-55)
   - Home > Collections > Product Title

2. **Product Images** (lines 57-82)
   - Main image display
   - Thumbnail gallery (up to 5 images)
   - Click-to-swap gallery interaction

3. **Product Info** (lines 84-195)
   - Title, price (single or range), stock status
   - Full description
   - Variant dropdown (if multiple variants)
   - Quantity selector (+/- buttons)
   - Add to Cart button
   - **Shop Pay badge** (if price ≥ $1,500)
   - Trust badges (money-back, shipping, secure)

4. **Specifications** (lines 197-220)
   - 2-column spec grid (if metafield data exists)
   - Pulls from `product.metafields.custom.specifications`

5. **Related Products** (lines 222-243)
   - 3-product grid
   - Similar products recommendation

---

#### `templates/collection.liquid` (380 lines)
**Purpose**: Browse products by collection with filtering and sorting.

**Sections**:
1. **Hero Banner** (lines 66-72)
   - Collection title, optional description

2. **Filters Sidebar** (lines 76-120)
   - Sort dropdown (featured, best-selling, A-Z, price, newest)
   - Price range filter (4 tiers)
   - Availability checkbox

3. **Product Grid** (lines 122-189)
   - Dynamic product list from collection
   - Product cards with image, title, price, description
   - Stock status indicator
   - Pagination support (12 products/page default)

4. **Empty State** (lines 191-210)
   - Friendly message if no products
   - Link back to all collections

---

#### `templates/cart.liquid` (390 lines)
**Purpose**: Shopping cart with line items and order summary.

**Sections**:
1. **Cart Header** (lines 69-73)
   - "Your Cart" title
   - Continue Shopping link

2. **Line Items** (lines 75-142)
   - For each cart item:
     - Product image (100×100)
     - Title, variant, price
     - Quantity selector (+/- buttons)
     - Remove button
     - Subtotal for line

3. **Order Summary** (lines 144-227)
   - Sticky sidebar (stays visible on desktop scroll)
   - Subtotal, shipping calc, tax, total
   - Checkout button → Shopify's hosted checkout
   - Continue Shopping button
   - **Shop Pay financing notice** (if cart ≥ $1,500)
   - Trust badges section

4. **Empty Cart State** (lines 50-68)
   - Friendly message + "Continue Shopping" link

---

#### `templates/page.liquid` (350 lines)
**Purpose**: Template for static pages (about, financing, policies, care guides, etc.).

**Sections**:
1. **Page Hero**
   - Page title in banner

2. **Back Navigation**
   - "← Back to Home" link

3. **Main Content**
   - Renders `page.content` (Liquid-safe HTML)
   - Styled prose typography (headings, paragraphs, links, lists, blockquotes)

4. **Financing-Specific CTA** (if `page.handle == 'financing'`)
   - Additional "Shop Now" button for financing page

5. **About Page Testimonials** (if `page.handle == 'about'`)
   - 3-column testimonial cards
   - 5-star ratings, customer quotes, names

---

### Section Files

#### `sections/header.liquid` (220 lines)
**Purpose**: Navigation header — appears on all pages.

**Components**:
- **Logo/Brand** (clickable link to home)
- **Desktop Menu** (6 links: Electronic, Cabinet, Desktop, Travel, Accessories, About)
- **Mobile Menu** (hamburger toggle, vertical stack)
- **Cart Icon** (with item count badge)

**Interactions**:
- Cart icon opens cart drawer
- Mobile menu toggle on small screens
- Active link styling

**Styling**:
- Sticky header (stays at top on scroll)
- Dark background with charcoal border
- Gold hover states

---

#### `sections/footer.liquid` (270 lines)
**Purpose**: Footer with links, trust signals, copyright.

**Components**:
1. **About Column**
   - Store description
   - Tagline

2. **Collections Links** (4 main categories)
   - Electronic, Cabinet, Desktop, Travel humidors

3. **Customer Service Links**
   - Shipping, Returns, Care Guides, Financing, Contact

4. **Legal Links**
   - Privacy, Terms, Cookies, About

5. **Trust Badges** (3 icons + text)
   - Premium quality, Free shipping, Secure checkout

6. **Footer Bottom**
   - Copyright year (dynamic)
   - Privacy, Terms, Cookies links (horizontal)

---

### Asset Files

#### `assets/main.css` (650 lines)
**Purpose**: Global stylesheet with design system, components, responsive utilities.

**Contents**:

1. **Color Variables** (lines 9-27)
   - Charcoal palette (950-600)
   - Gold accents (50-600)
   - Cream text colors
   - Semantic colors (border, shadow)

2. **Reset & Base Styles** (lines 33-71)
   - CSS reset (* box-sizing)
   - HTML smooth scroll
   - Body base styles
   - Typography base

3. **Typography** (lines 73-103)
   - Heading sizes (h1-h6)
   - Paragraph margin
   - Link styles

4. **Button Styles** (lines 118-156)
   - Primary button (.btn-primary)
   - Secondary button (.btn-secondary)
   - Ghost button (.btn-ghost)
   - Hover & active states

5. **Form Styles** (lines 158-198)
   - Input, textarea, select styling
   - Focus states with gold border
   - Placeholder colors

6. **Card Component** (lines 200-211)
   - Dark background with border
   - Hover effects (transform, shadow)

7. **Layout Utilities** (lines 213-253)
   - Container max-widths
   - Responsive grid system (.grid, .grid-2, .grid-3, .grid-4)
   - Flexbox utilities

8. **Spacing Utilities** (lines 289-311)
   - Margin top/bottom (mt-4 through mt-16)
   - Padding utilities (px-4, py-8, etc.)

9. **Animations** (lines 334-363)
   - @keyframes fadeUp, fadeIn, shimmer
   - Animation classes

10. **Responsive Breakpoints** (lines 411-428)
    - Mobile-first adjustments
    - Media query for 768px and below

---

#### `assets/main.js` (380 lines)
**Purpose**: Client-side interactivity, form handling, GA4 event tracking.

**Modules**:

1. **initCartDrawer()** (lines 18-48)
   - Opens/closes cart drawer on button click
   - Closes on outside click or Escape key
   - Prevents body scroll when open

2. **initMobileMenu()** (lines 50-70)
   - Hamburger menu toggle
   - Closes on link click

3. **initProductGallery()** (lines 72-92)
   - Thumbnail click swaps main image
   - Updates active thumbnail border

4. **initQuantitySelector()** (lines 94-104)
   - Ensures quantity input is numeric ≥ 1

5. **initVariantSelector()** (lines 106-117)
   - Logs variant selection (can hook to price updates)

6. **initCartForm()** (lines 119-131)
   - Prevents multiple form submissions
   - Disables submit button during submission

7. **initNewsletterForm()** (lines 133-154)
   - Email validation
   - Success message on submit

8. **initSmoothScroll()** (lines 156-168)
   - Smooth scroll to anchor links

9. **initLazyImages()** (lines 170-186)
   - Intersection Observer for lazy loading

10. **trackAddToCart()** (lines 188-214)
    - GA4 event: `add_to_cart`
    - Sends product name, price, quantity

11. **trackBeginCheckout()** (lines 216-228)
    - GA4 event: `begin_checkout`
    - Fires when checkout button clicked

---

### Configuration Files

#### `config/settings_schema.json` (270 lines)
**Purpose**: Shopify Admin customization — allows non-technical edits via Admin UI.

**Settings Groups**:

1. **Theme** (2 settings)
   - Store name
   - Store description

2. **Colors** (5 settings)
   - Primary (gold), Secondary (charcoal), Accent (cream)
   - Text color, Border color
   - Color picker UI in admin

3. **Typography** (2 settings)
   - Font picker for headings (Playfair Display)
   - Font picker for body text (Inter)

4. **Header** (4 settings)
   - Logo image upload
   - Logo width slider (100-300px)
   - Search bar toggle
   - Main menu link list

5. **Home Page** (8 settings)
   - Hero image, title, subtitle
   - Hero CTA button text & URL
   - Featured collection picker
   - Number of featured products (3-12)

6. **Footer** (6 settings)
   - About text
   - 3 footer menu link lists
   - Newsletter signup toggle
   - Social icons toggle

7. **Checkout** (3 settings)
   - Enable Shop Pay messaging toggle
   - Minimum purchase for financing
   - Shop Pay promo text

8. **Analytics** (4 settings)
   - GA4 ID (text input, default provided)
   - Google Ads ID (text input, default provided)
   - Google Tag Manager ID (text input)
   - Conversion label (text input, updateable)

---

## Summary Statistics

| Category | Count | Details |
|----------|-------|---------|
| **Templates** | 5 | index, product, collection, cart, page |
| **Sections** | 2 | header, footer |
| **Assets** | 2 | main.css, main.js |
| **Config** | 1 | settings_schema.json |
| **Docs** | 2 | README.md, THEME_INVENTORY.md |
| **Total Files** | 12+ | (excluding snippets directory) |
| **Total Lines of Code** | ~4,500 | Liquid + CSS + JS + JSON |

---

## Design System Summary

### Color Palette
- **Dark Theme**: Charcoal #211e1c (primary background)
- **Gold Accents**: #e5a524 (CTAs, highlights)
- **Cream Text**: #f8f0e0 (body text on dark)
- **Borders**: Charcoal with 40% opacity

### Typography
- **Headers**: Playfair Display (serif, 700)
- **Body**: Inter (sans-serif, 400-600)
- **Font sizes**: h1=2.5rem, h2=2rem, h3=1.5rem, body=1rem

### Responsive Breakpoints
- **Mobile**: < 768px (1 column, hamburger menu)
- **Tablet/Desktop**: ≥ 768px (2-4 columns, full menu)
- **Max container**: 1280px

### Key Components
- **Buttons**: Gold primary, bordered secondary, ghost variants
- **Cards**: Dark with subtle borders, hover lift effect
- **Forms**: Dark inputs, gold focus state
- **Images**: Responsive, lazy-loaded
- **Grid**: CSS grid with auto-fit, flexible columns

---

## Upload Instructions

1. **Zip this folder**: `DLS-Belle1-Liquid/`
2. **Go to Shopify Admin** → Sales channels → Shop → Themes
3. **Click "Add theme"** → "Upload theme"
4. **Select the ZIP file** → Upload
5. **Wait for processing** (1-2 minutes)
6. **Customize** via Admin → Customize theme
   - Add logo image
   - Set colors (optional — defaults match brand)
   - Configure menus
   - Add featured collection
   - Update footer links
   - Add analytics IDs

---

## Next Steps for Full Feature Parity

### High Priority
1. Create sample pages in Shopify (About, Financing, Privacy, etc.)
2. Populate products & collections with images
3. Test on mobile devices
4. Verify GA4 tracking in Google Analytics

### Medium Priority
1. Add product reviews (Shopify Product Reviews app)
2. Implement advanced product filtering
3. Add financing calculator JavaScript
4. Create blog/journal article template

### Low Priority
1. Implement live chat integration
2. Add customer testimonial carousel
3. Create bespoke customization builder
4. Add multi-language support

---

**Created**: July 2026
**Version**: 1.0 (MVP)
**Compatibility**: Shopify 2024+
**License**: Custom (Dunn's Luxury Selections)
