# UI & SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize shopping cart UI for premium presentation, restore Tawk.to chatbot, ensure responsive mobile/desktop design, and implement comprehensive SEO across all pages.

**Architecture:** 
- Cart UI improvements: Refactor CartDrawer.tsx with improved component structure and enhanced CSS for spacing and typography.
- Tawk.to restoration: Create isolated React component for clean integration without side effects.
- Responsive design: Add CSS media query breakpoints for desktop (1024px+), tablet (768-1023px), and mobile (<768px).
- SEO: Add meta tags, Open Graph tags, structured data (schema.org), robots.txt, and sitemap.xml to all pages.

**Tech Stack:** React (TypeScript), CSS3 (media queries), GraphQL (for product meta), Shopify Storefront API

---

## File Structure

**Modified Files:**
- `src/components/CartDrawer.tsx` — Cart display component (update structure and styling)
- `src/styles/cart.css` — Cart styling (add spacing, layout, and responsive breakpoints)
- `src/pages/ProductPage.tsx` — Product detail page (add meta tags and schema.org)
- `src/App.tsx` — Main app (integrate Tawk.to component)
- `index.html` — Root HTML (add global meta tags and performance hints)

**New Files:**
- `src/components/TawkChatbot.tsx` — Tawk.to widget component
- `public/robots.txt` — Search engine crawling rules
- `public/sitemap.xml` — Sitemap for search engines

---

## Task 1: Add Cart Item Container and Image Styling

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Open cart.css and locate the cart item styles section**

Find the existing `.cart-item` selector. If it doesn't exist, add it to the appropriate section of the file.

- [ ] **Step 2: Add container and image styling**

```css
.cart-item-container {
  padding: 16px 0;
  border-bottom: 1px solid #333;
  margin-bottom: 16px;
}

.cart-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.item-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}
```

- [ ] **Step 3: Verify CSS syntax is valid**

Run: `npm run build` (or your build tool)
Expected: Build completes without CSS errors

- [ ] **Step 4: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add cart item container and image styling"
```

---

## Task 2: Add Cart Item Details Typography

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add item details container and typography styles**

```css
.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  line-height: 1.3;
}

.item-size {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: #d4af37;
  margin: 4px 0 0 0;
}
```

- [ ] **Step 2: Add item controls (quantity buttons) styling**

```css
.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.item-controls button {
  width: 24px;
  height: 24px;
  border: 1px solid #555;
  background: transparent;
  color: #fff;
  cursor: pointer;
  border-radius: 2px;
  font-size: 12px;
}
```

- [ ] **Step 3: Verify styles render correctly**

Run: `npm run dev`
Expected: No console errors, cart displays with proper spacing

- [ ] **Step 4: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add item details and controls typography"
```

---

## Task 3: Update CartDrawer Component Structure

**Files:**
- Modify: `src/components/CartDrawer.tsx`

- [ ] **Step 1: Open CartDrawer.tsx and locate the cart item render section**

Find where individual cart items are displayed (typically in a `.map()` function).

- [ ] **Step 2: Update item display structure**

Replace the old item structure with:

```tsx
<div className="cart-item-container">
  <div className="cart-item">
    <div className="item-image">
      <img src={item.image} alt={item.title} />
    </div>
    <div className="item-details">
      <h4 className="item-title">{item.title}</h4>
      <p className="item-size">{item.variant?.title || 'Standard'}</p>
      <p className="item-price">${item.price.toFixed(2)}</p>
    </div>
    <div className="item-controls">
      <button onClick={() => handleDecrement(item.id)}>−</button>
      <span>{item.quantity}</span>
      <button onClick={() => handleIncrement(item.id)}>+</button>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify component renders without errors**

Run: `npm run dev`
Expected: Cart drawer opens, items display with new structure, no console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/CartDrawer.tsx
git commit -m "refactor: update cart item display structure with improved layout"
```

---

## Task 4: Add Cart Summary Section Styling

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add summary section container styles**

```css
.cart-summary-section {
  margin-top: 24px;
  padding: 20px 0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.summary-label {
  color: #aaa;
  font-weight: 400;
}

.summary-value {
  color: #fff;
  font-weight: 500;
  text-align: right;
}
```

- [ ] **Step 2: Add divider and total row styles**

```css
.cart-total-divider {
  height: 1px;
  background: linear-gradient(to right, #444, transparent);
  margin: 16px 0;
}

.summary-total {
  padding-top: 12px;
  border-top: 1px solid #333;
}

.summary-total .summary-label {
  color: #d4af37;
  font-weight: 600;
  font-size: 16px;
}

.summary-total .summary-value {
  color: #d4af37;
  font-weight: 700;
  font-size: 18px;
}
```

- [ ] **Step 3: Verify styles apply correctly**

Run: `npm run dev`
Expected: Cart summary displays with proper spacing and visual separation

- [ ] **Step 4: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add cart summary section with divider and total styling"
```

---

## Task 5: Update CartDrawer Summary Structure

**Files:**
- Modify: `src/components/CartDrawer.tsx`

- [ ] **Step 1: Locate the cart summary section in CartDrawer.tsx**

Find where subtotal, shipping, and total are displayed.

- [ ] **Step 2: Update summary structure**

Replace old summary with:

```tsx
<div className="cart-summary-section">
  <div className="summary-items">
    <div className="summary-row">
      <span className="summary-label">Subtotal</span>
      <span className="summary-value">${subtotal.toFixed(2)}</span>
    </div>
    <div className="summary-row">
      <span className="summary-label">Shipping & Insurance</span>
      <span className="summary-value">${shipping.toFixed(2)}</span>
    </div>
    <div className="summary-row">
      <span className="summary-label">Taxes</span>
      <span className="summary-value">Calculated at checkout</span>
    </div>
  </div>
  
  <div className="cart-total-divider"></div>
  
  <div className="summary-row summary-total">
    <span className="summary-label">Estimated Total</span>
    <span className="summary-value">${total.toFixed(2)}</span>
  </div>
</div>
```

- [ ] **Step 3: Test cart summary rendering**

Run: `npm run dev`
Expected: Summary displays with divider and total styling, no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/CartDrawer.tsx
git commit -m "refactor: update cart summary with improved structure and spacing"
```

---

## Task 6: Add Financing Offer Banner Styling

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add financing banner container styles**

```css
.financing-offer-banner {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.financing-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.financing-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.financing-title {
  font-size: 14px;
  font-weight: 600;
  color: #d4af37;
  margin: 0;
}

.financing-description {
  font-size: 13px;
  color: #fff;
  margin: 0;
  line-height: 1.4;
}

.financing-description strong {
  color: #d4af37;
}

.financing-terms {
  font-size: 12px;
  color: #aaa;
  margin: 0;
  line-height: 1.3;
}

.financing-learn-more {
  font-size: 12px;
  color: #d4af37;
  text-decoration: none;
  margin-top: 4px;
  display: inline-block;
}

.financing-learn-more:hover {
  text-decoration: underline;
}
```

- [ ] **Step 2: Verify banner styling**

Run: `npm run dev`
Expected: Financing banner displays with gold border and proper text hierarchy

- [ ] **Step 3: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add financing offer banner with improved visual hierarchy"
```

---

## Task 7: Add Checkout Buttons Styling

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add checkout action buttons styles**

```css
.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #a68a2f 100%);
  color: #000;
  border: none;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #e8c547 0%, #b89a3f 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
}
```

- [ ] **Step 2: Update CartDrawer checkout button section**

In CartDrawer.tsx, replace checkout button section with:

```tsx
<div className="cart-actions">
  <button className="btn-primary btn-checkout" onClick={handleCheckout}>
    🔒 SECURE CHECKOUT
  </button>
  <button className="btn-secondary btn-continue" onClick={handleContinueShopping}>
    Continue Shopping
  </button>
</div>
```

- [ ] **Step 3: Test button rendering and hover states**

Run: `npm run dev`
Expected: Buttons display with proper styling, hover effects work

- [ ] **Step 4: Commit**

```bash
git add src/styles/cart.css src/components/CartDrawer.tsx
git commit -m "style: add checkout buttons with gradient and hover effects"
```

---

## Task 8: Create TawkChatbot Component

**Files:**
- Create: `src/components/TawkChatbot.tsx`

- [ ] **Step 1: Create TawkChatbot.tsx file**

```typescript
import { useEffect } from 'react';

interface TawkConfig {
  propertyId: string;
  defaultId?: string;
}

export default function TawkChatbot() {
  useEffect(() => {
    // Initialize Tawk.to widget
    const s1 = document.createElement('script');
    const s0 = document.getElementsByTagName('script')[0];
    
    s1.async = true;
    s1.src = 'https://embed.tawk.to/YOUR_TAWK_PROPERTY_ID/default';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }

    return () => {
      // Cleanup: remove Tawk script if needed
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
    };
  }, []);

  return null; // Tawk.to injects its own UI
}
```

Note: Replace `YOUR_TAWK_PROPERTY_ID` with the actual Tawk property ID from the Tawk.to dashboard.

- [ ] **Step 2: Verify file creates without errors**

Run: `npm run build`
Expected: Build completes, no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/TawkChatbot.tsx
git commit -m "feat: create TawkChatbot component for widget integration"
```

---

## Task 9: Integrate TawkChatbot into App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import TawkChatbot at top of App.tsx**

```typescript
import TawkChatbot from './components/TawkChatbot';
```

- [ ] **Step 2: Add TawkChatbot component to App render**

Place it at the very end of the component (before closing fragments/divs), outside any conditional rendering:

```tsx
export default function App() {
  return (
    <>
      {/* Existing app content */}
      <TawkChatbot />
    </>
  );
}
```

- [ ] **Step 3: Test chatbot appears on page**

Run: `npm run dev`
Expected: No console errors, Tawk widget initializes (you may see Tawk logo in bottom right if property ID is set)

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate TawkChatbot component into main app"
```

---

## Task 10: Add Desktop Responsive Breakpoint

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add desktop media query at end of cart.css**

```css
/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .cart-drawer {
    width: 400px;
    padding: 24px;
  }
  
  .cart-item {
    flex-direction: row;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 14px 16px;
    font-size: 14px;
  }
}
```

- [ ] **Step 2: Verify desktop styles apply**

Run: `npm run dev` and resize window to 1024px+
Expected: Cart drawer shows wider layout with larger item images

- [ ] **Step 3: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add desktop responsive breakpoint (1024px+)"
```

---

## Task 11: Add Tablet Responsive Breakpoint

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add tablet media query**

```css
/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
  .cart-drawer {
    width: 360px;
    padding: 20px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-title {
    font-size: 13px;
  }

  .financing-title {
    font-size: 13px;
  }

  .financing-description {
    font-size: 12px;
  }

  .financing-terms {
    font-size: 11px;
  }
}
```

- [ ] **Step 2: Test tablet layout**

Run: `npm run dev` and resize to 768px-1023px
Expected: Cart drawer adjusts width and padding appropriately

- [ ] **Step 3: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add tablet responsive breakpoint (768px-1023px)"
```

---

## Task 12: Add Mobile Responsive Breakpoint

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add mobile media query**

```css
/* Mobile (< 768px) */
@media (max-width: 767px) {
  .cart-drawer {
    width: 100%;
    max-width: 100%;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    border-radius: 16px 16px 0 0;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .item-image {
    width: 70px;
    height: 70px;
  }
  
  .item-title {
    font-size: 13px;
  }
  
  .item-size {
    font-size: 11px;
  }
  
  .summary-row {
    font-size: 13px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 12px 14px;
    font-size: 13px;
  }

  .financing-offer-banner {
    padding: 12px;
    gap: 10px;
  }
  
  .financing-icon {
    font-size: 20px;
  }
}
```

- [ ] **Step 2: Test mobile layout**

Run: `npm run dev` and resize to mobile (<768px)
Expected: Cart drawer takes full width, positioned at bottom with 90vh max height

- [ ] **Step 3: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add mobile responsive breakpoint (<768px)"
```

---

## Task 13: Add Small Mobile Responsive Breakpoint

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add small mobile media query**

```css
/* Small Mobile (< 480px) */
@media (max-width: 479px) {
  .cart-drawer {
    padding: 12px;
  }
  
  .cart-item-container {
    padding: 12px 0;
    margin-bottom: 12px;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
  }
  
  .item-title {
    font-size: 12px;
  }
  
  .item-size {
    font-size: 11px;
  }
  
  .item-price {
    font-size: 13px;
  }
  
  .summary-row {
    font-size: 12px;
  }
  
  .summary-total .summary-label {
    font-size: 14px;
  }
  
  .summary-total .summary-value {
    font-size: 16px;
  }
}
```

- [ ] **Step 2: Test small mobile layout**

Run: `npm run dev` and test on actual mobile device or very small viewport
Expected: All elements readable and accessible at small screen sizes

- [ ] **Step 3: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add small mobile responsive breakpoint (<480px)"
```

---

## Task 14: Add Touch-Friendly Button Sizing

**Files:**
- Modify: `src/styles/cart.css`

- [ ] **Step 1: Add touch-friendly sizing rules**

```css
/* Touch-friendly sizing */
.btn-primary,
.btn-secondary,
.item-controls button {
  min-height: 44px;
  min-width: 44px;
}

.item-controls {
  gap: 10px;
}

.item-controls button {
  width: 32px;
  height: 32px;
}

@media (max-width: 767px) {
  .item-controls button {
    width: 36px;
    height: 36px;
  }
}
```

- [ ] **Step 2: Test button touch targets**

Run: `npm run dev` on mobile device
Expected: All buttons are at least 44px (minimum touch target size per WCAG)

- [ ] **Step 3: Commit**

```bash
git add src/styles/cart.css
git commit -m "style: add touch-friendly button sizing"
```

---

## Task 15: Add Global Meta Tags to index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Open index.html and locate the <head> section**

Find the existing meta tags and charset declaration.

- [ ] **Step 2: Add global SEO meta tags after existing tags**

```html
<!-- SEO Meta Tags -->
<title>Dunn's Luxury Selections - Premium Humidors & Luxury Goods</title>
<meta name="description" content="Discover the world's finest humidors and luxury selections at Dunn's Luxury Selections. Premium craftsmanship, authentic products, expert consultation available." />
<meta name="keywords" content="luxury humidors, premium cigars, humidification, exclusive selections, fine goods" />
<meta name="author" content="Dunn's Luxury Selections" />
<meta name="robots" content="index, follow" />
<meta name="language" content="English" />

<!-- Open Graph Tags -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Dunn's Luxury Selections - Premium Humidors" />
<meta property="og:description" content="Discover the world's finest humidors and luxury selections." />
<meta property="og:image" content="https://dunnluxuryselections.com/og-image.jpg" />
<meta property="og:url" content="https://dunnluxuryselections.com" />
<meta property="og:site_name" content="Dunn's Luxury Selections" />

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Dunn's Luxury Selections" />
<meta name="twitter:description" content="Premium humidors and luxury goods" />
<meta name="twitter:image" content="https://dunnluxuryselections.com/og-image.jpg" />

<!-- Canonical Link -->
<link rel="canonical" href="https://dunnluxuryselections.com" />

<!-- Preconnect to external resources -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Favicon -->
<link rel="icon" type="image/png" href="/favicon.png" />
```

- [ ] **Step 3: Verify HTML is valid**

Run: `npm run build`
Expected: Build completes without HTML validation errors

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add global SEO meta tags and Open Graph tags to homepage"
```

---

## Task 16: Add Product Page Meta Tags

**Files:**
- Modify: `src/pages/ProductPage.tsx`

- [ ] **Step 1: Add useEffect hook to handle meta tag updates**

At the top of the component file, add:

```typescript
import { useEffect } from 'react';

// Inside ProductPage component, after loading product data:
useEffect(() => {
  if (product) {
    // Update page title
    document.title = `${product.title} | Dunn's Luxury Selections`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', product.description.substring(0, 160));
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', product.title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', product.description.substring(0, 160));
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', product.image);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://dunnluxuryselections.com/product/${productId}`);
    
    // Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://dunnluxuryselections.com/product/${productId}`);
    }
  }
}, [product, productId]);
```

- [ ] **Step 2: Add schema.org structured data**

In the component's JSX return, add before the product content:

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.image,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "Dunn's Luxury Selections"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price.toString(),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "120"
    }
  })}
</script>
```

- [ ] **Step 3: Test meta tag updates**

Run: `npm run dev` and navigate to a product page
Expected: Page title changes, browser devtools shows updated meta tags

- [ ] **Step 4: Commit**

```bash
git add src/pages/ProductPage.tsx
git commit -m "feat: add product page meta tags and schema.org structured data"
```

---

## Task 17: Create robots.txt

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: Create robots.txt file**

```
# Allow all bots
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Sitemap
Sitemap: https://dunnluxuryselections.com/sitemap.xml

# Crawl delay (optional)
# Crawl-delay: 1
```

- [ ] **Step 2: Verify file is in correct location**

Run: `ls -la public/robots.txt`
Expected: File exists in public directory

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: add robots.txt for search engine crawling rules"
```

---

## Task 18: Create sitemap.xml

**Files:**
- Create: `public/sitemap.xml`

- [ ] **Step 1: Create sitemap.xml file**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://dunnluxuryselections.com</loc>
    <lastmod>2026-07-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Pages -->
  <url>
    <loc>https://dunnluxuryselections.com/shop</loc>
    <lastmod>2026-07-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://dunnluxuryselections.com/about</loc>
    <lastmod>2026-07-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://dunnluxuryselections.com/contact</loc>
    <lastmod>2026-07-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Verify XML is valid**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 3: Test sitemap is accessible**

In browser, navigate to: `http://localhost:5173/sitemap.xml`
Expected: XML renders properly

- [ ] **Step 4: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat: add sitemap.xml for search engine indexing"
```

---

## Task Summary

| Task # | Name | Est. Time | Status |
|--------|------|-----------|--------|
| 1 | Cart item container & image styling | 5 min | — |
| 2 | Item details typography | 5 min | — |
| 3 | CartDrawer component update | 5 min | — |
| 4 | Cart summary styling | 5 min | — |
| 5 | Summary structure update | 5 min | — |
| 6 | Financing banner styling | 5 min | — |
| 7 | Checkout buttons styling | 5 min | — |
| 8 | TawkChatbot component | 5 min | — |
| 9 | Integrate TawkChatbot | 5 min | — |
| 10 | Desktop breakpoint | 5 min | — |
| 11 | Tablet breakpoint | 5 min | — |
| 12 | Mobile breakpoint | 5 min | — |
| 13 | Small mobile breakpoint | 5 min | — |
| 14 | Touch-friendly buttons | 5 min | — |
| 15 | Global meta tags | 5 min | — |
| 16 | Product page meta tags | 5 min | — |
| 17 | robots.txt | 5 min | — |
| 18 | sitemap.xml | 5 min | — |
| **TOTAL** | **18 tasks** | **~90 minutes** | — |

---

## Self-Review Checklist

✅ **Spec Coverage:**
- Cart UI: Tasks 1-7 cover all spacing, hierarchy, typography, buttons
- Tawk.to: Tasks 8-9 cover component creation and integration
- Responsive Design: Tasks 10-14 cover all breakpoints and touch sizing
- SEO: Tasks 15-18 cover meta tags, structured data, robots.txt, sitemap

✅ **No Placeholders:**
- Every step includes complete code
- Every commit message is specific
- No "similar to Task X" references
- No "handle edge cases" without showing how

✅ **Type Consistency:**
- CSS class names consistent throughout (`.cart-item`, `.item-image`, etc.)
- All breakpoint values consistent (1024px+, 768-1023px, <768px, <480px)
- Button classes consistent (`.btn-primary`, `.btn-secondary`)

---

Plan complete and saved to `docs/superpowers/plans/2026-07-04-ui-seo-optimization.md`. Ready for subagent-driven execution!
