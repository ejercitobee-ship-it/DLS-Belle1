# Product Links SPA Navigation Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix non-clickable product images by converting regular `<a href="/product/...">` links to proper SPA navigation that uses the app's custom `history.pushState` routing.

**Architecture:** Create a custom hook `useNavigateToProduct()` that returns a click handler. Each ProductCard component wraps its `<a>` tag with this handler, which prevents default navigation and dispatches a custom event that the app's main routing system listens for. This integrates seamlessly with the existing popstate listener without breaking back/forward button support.

**Tech Stack:** React, TypeScript, custom SPA routing (popstate/pushState), existing App.tsx architecture

---

## Files Overview

| File | Role | Change Type |
|------|------|-------------|
| `src/hooks/useNavigateToProduct.ts` | NEW: Custom hook for product navigation | Create |
| `src/components/AllCollections.tsx` | ProductCard inline component | Modify (lines 88-91, 124-125) |
| `src/components/FeaturedProducts.tsx` | Product grid with inline cards | Modify (link elements) |
| `src/components/NewArrivals.tsx` | New arrivals grid | Modify (link elements) |
| `src/components/ElectronicHumidors.tsx` | Product showcase | Modify (link elements) |
| `src/components/CabinetHumidors.tsx` | Cabinet showcase | Modify (link elements) |
| `src/components/TravelHumidors.tsx` | Travel humidors showcase | Modify (link elements) |
| `src/components/Accessories.tsx` | Accessories grid | Modify (link elements) |
| `src/components/DesktopHumidors.tsx` | Desktop humidors showcase | Modify (link elements) |
| `src/App.tsx` | Main routing (add navigate-product event) | Modify (line ~490) |

---

## Task 1: Create useNavigateToProduct Hook

**Files:**
- Create: `src/hooks/useNavigateToProduct.ts`

- [ ] **Step 1: Create the hook file**

```typescript
// src/hooks/useNavigateToProduct.ts

import { useCallback } from 'react';

/**
 * Custom hook for navigating to product pages in the SPA.
 * Dispatches a custom event that the main App routing system listens for.
 * Prevents default link behavior and uses history.pushState for proper SPA navigation.
 */
export function useNavigateToProduct() {
  return useCallback((productHandle: string) => {
    // Dispatch custom event that App.tsx listens for
    window.dispatchEvent(
      new CustomEvent('navigate-product', {
        detail: { productHandle },
      })
    );
  }, []);
}
```

- [ ] **Step 2: Verify file is properly imported (check TypeScript)**

Run: `npm run typecheck`
Expected: No errors in `src/hooks/useNavigateToProduct.ts`

- [ ] **Step 3: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/hooks/useNavigateToProduct.ts
git commit -m "feat: add useNavigateToProduct hook for SPA product navigation"
```

---

## Task 2: Update App.tsx to Listen for navigate-product Event

**Files:**
- Modify: `src/App.tsx` (around line 490, in the event listener setup)

- [ ] **Step 1: Add navigate-product listener to App.tsx**

Locate the existing event listeners section (around line 492-494 where 'navigate' and 'navigate-article' are handled). Add this listener:

```typescript
    const onNavigateProduct = (e: Event) => {
      const detail = (e as CustomEvent).detail as { productHandle: string };
      const target = 'product';
      pendingPage.current = target;
      setTransitioning(true);
      setTimeout(() => {
        setPage(target);
        setDisplayPage(target);
        window.history.pushState({ page: target }, '', `/product/${detail.productHandle}`);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTransitioning(false);
      }, 220);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('navigate', onNavigate);
    window.addEventListener('navigate-article', onNavigateArticle);
    window.addEventListener('navigate-product', onNavigateProduct);
```

Full change location in App.tsx around line 482-494. Replace:

```typescript
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as Page;
      navigate(detail);
    };

    const onNavigateArticle = (e: Event) => {
      const detail = (e as CustomEvent).detail as { blogHandle: string; articleHandle: string };
      navigate('article', `${detail.blogHandle}/${detail.articleHandle}`);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('navigate', onNavigate);
    window.addEventListener('navigate-article', onNavigateArticle);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('navigate', onNavigate);
      window.removeEventListener('navigate-article', onNavigateArticle);
    };
```

With:

```typescript
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as Page;
      navigate(detail);
    };

    const onNavigateArticle = (e: Event) => {
      const detail = (e as CustomEvent).detail as { blogHandle: string; articleHandle: string };
      navigate('article', `${detail.blogHandle}/${detail.articleHandle}`);
    };

    const onNavigateProduct = (e: Event) => {
      const detail = (e as CustomEvent).detail as { productHandle: string };
      const target = 'product';
      pendingPage.current = target;
      setTransitioning(true);
      setTimeout(() => {
        setPage(target);
        setDisplayPage(target);
        window.history.pushState({ page: target }, '', `/product/${detail.productHandle}`);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTransitioning(false);
      }, 220);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('navigate', onNavigate);
    window.addEventListener('navigate-article', onNavigateArticle);
    window.addEventListener('navigate-product', onNavigateProduct);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('navigate', onNavigate);
      window.removeEventListener('navigate-article', onNavigateArticle);
      window.removeEventListener('navigate-product', onNavigateProduct);
    };
```

- [ ] **Step 2: Verify TypeScript**

Run: `npm run typecheck`
Expected: No errors related to App.tsx changes

- [ ] **Step 3: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/App.tsx
git commit -m "feat: add navigate-product event listener for SPA product links"
```

---

## Task 3: Update AllCollections ProductCard Component

**Files:**
- Modify: `src/components/AllCollections.tsx` (ProductCard component, lines 62-155)

- [ ] **Step 1: Add import for useNavigateToProduct**

At the top of AllCollections.tsx (around line 1-14), add:

```typescript
import { useNavigateToProduct } from '../hooks/useNavigateToProduct';
```

- [ ] **Step 2: Update ProductCard function to use hook and handle clicks**

Replace the ProductCard function (lines 62-155) with:

```typescript
function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const navigateToProduct = useNavigateToProduct();
  const imgUrl = product.featuredImage?.url ?? product.images[0]?.url ?? '';
  const imgAlt = product.featuredImage?.altText ?? product.title;
  const { price, compareAt } = getProductPrice(product);
  const isNew = isNewArrival(product);
  const productPageHref = `/product/${product.handle}`;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const variantId = getDefaultVariantId(product);
    addItem({
      id: product.id,
      shopifyVariantId: variantId,
      name: product.title,
      price,
      priceNum: parseFloat(product.priceRange.minVariantPrice.amount),
      image: imgUrl,
      category: product.productType,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleCardClick(e: React.MouseEvent) {
    // Don't navigate if clicking add-to-cart button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    e.preventDefault();
    navigateToProduct(product.handle);
  }

  return (
    <a
      href={productPageHref}
      onClick={handleCardClick}
      className="group relative flex flex-col bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/40 rounded-xl overflow-hidden transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-charcoal-900 flex-shrink-0">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={imgAlt}
            className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-cream-200/20 text-xs tracking-widest uppercase">No Image</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-gold-gradient text-charcoal-950 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded shadow-lg">
              New
            </span>
          )}
          {compareAt && (
            <span className="bg-charcoal-950/80 backdrop-blur-sm border border-red-500/40 text-red-400 text-[9px] font-semibold tracking-widest uppercase px-2 py-1 rounded">
              Sale
            </span>
          )}        </div>

        {/* Add to Cart — hover only */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-charcoal-950/90 backdrop-blur-sm border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/10 text-gold-400 hover:text-gold-300 text-[10px] font-semibold tracking-[0.2em] uppercase py-2.5 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        >
          <ShoppingBag size={12} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 md:p-5">
        <h3 className="font-serif text-white font-semibold text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-gold-200 transition-colors duration-200">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto pt-2">
          <span className="text-gold-400 font-semibold text-sm md:text-base">{price}</span>
          {compareAt && (
            <span className="text-cream-200/30 text-xs line-through">{compareAt}</span>
          )}
        </div>

        <span className="inline-flex items-center justify-center text-cream-200/50 group-hover:text-gold-400 text-[10px] font-medium tracking-[0.15em] uppercase transition-colors border-t border-charcoal-700/50 pt-3 -mx-1"
        >
          View Product
          <ChevronRight size={12} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/AllCollections.tsx
git commit -m "fix: update AllCollections ProductCard to use SPA navigation"
```

---

## Task 4: Update FeaturedProducts Component Product Links

**Files:**
- Modify: `src/components/FeaturedProducts.tsx`

- [ ] **Step 1: Add import**

```typescript
import { useNavigateToProduct } from '../hooks/useNavigateToProduct';
```

- [ ] **Step 2: Find all product card `<a>` tags and add onClick handler**

Locate the product cards section and add:

```typescript
const navigateToProduct = useNavigateToProduct();

// For each product card link:
<a
  href={`/product/${product.handle}`}
  onClick={(e) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    navigateToProduct(product.handle);
  }}
  className="..."
>
```

- [ ] **Step 3: Verify TypeScript**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/FeaturedProducts.tsx
git commit -m "fix: update FeaturedProducts product links to use SPA navigation"
```

---

## Task 5: Update NewArrivals Component Product Links

**Files:**
- Modify: `src/components/NewArrivals.tsx`

- [ ] **Step 1: Add import and hook usage (same pattern as Task 4)**

- [ ] **Step 2: Update all product card links with click handlers**

- [ ] **Step 3: Verify TypeScript**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/NewArrivals.tsx
git commit -m "fix: update NewArrivals product links to use SPA navigation"
```

---

## Task 6: Update ElectronicHumidors Component Product Links

**Files:**
- Modify: `src/components/ElectronicHumidors.tsx`

- [ ] **Step 1: Add import and hook**

- [ ] **Step 2: Update all product card `<a>` tags**

- [ ] **Step 3: Verify TypeScript**

Run: `npm run typecheck`

- [ ] **Step 4: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/ElectronicHumidors.tsx
git commit -m "fix: update ElectronicHumidors product links to use SPA navigation"
```

---

## Task 7: Update CabinetHumidors Component Product Links

**Files:**
- Modify: `src/components/CabinetHumidors.tsx`

- [ ] **Step 1-4: Same pattern as previous tasks**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/CabinetHumidors.tsx
git commit -m "fix: update CabinetHumidors product links to use SPA navigation"
```

---

## Task 8: Update TravelHumidors Component Product Links

**Files:**
- Modify: `src/components/TravelHumidors.tsx`

- [ ] **Step 1-4: Same pattern**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/TravelHumidors.tsx
git commit -m "fix: update TravelHumidors product links to use SPA navigation"
```

---

## Task 9: Update Accessories Component Product Links

**Files:**
- Modify: `src/components/Accessories.tsx`

- [ ] **Step 1-4: Same pattern**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/Accessories.tsx
git commit -m "fix: update Accessories product links to use SPA navigation"
```

---

## Task 10: Update DesktopHumidors Component Product Links

**Files:**
- Modify: `src/components/DesktopHumidors.tsx`

- [ ] **Step 1-4: Same pattern**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/DesktopHumidors.tsx
git commit -m "fix: update DesktopHumidors product links to use SPA navigation"
```

---

## Task 11: Manual Testing — Verify Product Navigation

**Files:**
- Test: All product listing pages

- [ ] **Step 1: Start dev server**

```bash
cd C:\Users\ejerc\DLS-Belle1
npm run dev
```

Wait for server to start (check terminal output for port, usually `http://localhost:5173`)

- [ ] **Step 2: Test AllCollections page**

1. Navigate to `/all-collections`
2. Click on any product image/card
3. Verify: Page changes to product detail page (URL is `/product/{handle}`)
4. Verify: No full page reload (smooth transition)
5. Verify: Back button returns to `/all-collections`

- [ ] **Step 3: Test FeaturedProducts (on home page)**

1. Navigate to home page
2. Scroll to featured products section
3. Click a product card
4. Verify: Navigates to `/product/{handle}` without reload
5. Verify: Back button works

- [ ] **Step 4: Test other collection pages**

Repeat steps 2-3 for:
- `/electronic-humidors`
- `/cabinet-humidors`
- `/desktop-humidors`
- `/travel-humidors`
- `/accessories`
- `/new-arrivals`

- [ ] **Step 5: Test Add to Cart button doesn't trigger navigation**

1. Click Add to Cart on any product card
2. Verify: Stays on same page
3. Verify: Only adds item to cart

- [ ] **Step 6: Verify scroll behavior**

1. Scroll down a collection page
2. Click a product
3. Verify: New page scrolls to top automatically

- [ ] **Step 7: No manual commit (testing only)**

---

## Task 12: Final TypeCheck and Lint

**Files:**
- All modified files

- [ ] **Step 1: Full TypeScript check**

```bash
cd C:\Users\ejerc\DLS-Belle1
npm run typecheck
```

Expected: No errors

- [ ] **Step 2: Check for any lint issues**

```bash
cd C:\Users\ejerc\DLS-Belle1
npm run lint 2>&1 | head -20
```

Expected: No new errors (ignore pre-existing)

- [ ] **Step 3: No commit needed (just verification)**

---

## Task 13: Push All Changes to Production

**Files:**
- All 9 modified component files + App.tsx + new hook

- [ ] **Step 1: Verify all commits are on branch**

```bash
cd C:\Users\ejerc\DLS-Belle1
git log --oneline | head -12
```

Expected: Should show 9-10 commits starting with "fix: update ... product links"

- [ ] **Step 2: Push to main**

```bash
cd C:\Users\ejerc\DLS-Belle1
git push origin main
```

Expected: All 10 commits pushed successfully

- [ ] **Step 3: Verify Netlify deployment triggered**

Check Netlify deploy logs (may take 2-3 minutes to build and deploy)

- [ ] **Step 4: Test on live site**

1. Navigate to production site (dunnluxuryselections.com)
2. Go to `/all-collections`
3. Click a product image
4. Verify: Product page loads without full page reload
5. Verify: URL is `/product/{handle}`

---

## Success Criteria

✅ All product images/cards clickable on all collection pages  
✅ Navigation is smooth (SPA routing, no full page reload)  
✅ Back button returns to previous page  
✅ Scroll-to-top works on navigation  
✅ Add to Cart button doesn't trigger navigation  
✅ No TypeScript errors  
✅ All 10 commits pushed to main  
✅ Netlify deployment successful  
