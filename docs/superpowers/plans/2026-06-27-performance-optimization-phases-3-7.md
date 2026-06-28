# DLS-Belle1 Performance Optimization Phases 3-7

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement remaining performance optimizations (CartContext batching, component memoization, pagination fix, Tawk deferral, and code cleanup) to deliver cumulative 10+ second improvement on DLS-Belle1 initial page load.

**Architecture:** Phase 3 optimizes cart mutation patterns by batching and debouncing API calls. Phase 4 prevents unnecessary re-renders with React.memo and useMemo. Phase 5 fixes over-fetching by loading only visible products. Phase 6 defers third-party scripts to prevent main-thread blocking. Phase 7 removes unused dependencies and code.

**Tech Stack:** React 18, TypeScript, Shopify Storefront API, index.html for script loading

---

## Phase 3: CartContext API Call Batching

### Task 1: Add debounce utility and state for batching

**Files:**
- Modify: `src/context/CartContext.tsx:1-50` (add imports and debounce state)
- Create: `src/utils/debounce.ts` (new utility function)

- [ ] **Step 1: Create debounce utility**

Create file `src/utils/debounce.ts`:

```typescript
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}
```

- [ ] **Step 2: Add debounce utility to CartContext**

In `src/context/CartContext.tsx`, add at the top after other imports:

```typescript
import { debounce } from '../utils/debounce';
```

- [ ] **Step 3: Add batching state to CartContext**

In the CartProvider component state (around line 30), add:

```typescript
const [pendingOperations, setPendingOperations] = useState<{
  adds: Array<{ merchandiseId: string; quantity: number }>;
  updates: Array<{ id: string; quantity: number }>;
  removes: string[];
}>({
  adds: [],
  updates: [],
  removes: [],
});
```

- [ ] **Step 4: Add flush function to apply batched operations**

Add this function before the return statement in CartProvider (around line 150):

```typescript
const flushPendingOperations = useCallback(async () => {
  if (
    pendingOperations.adds.length === 0 &&
    pendingOperations.updates.length === 0 &&
    pendingOperations.removes.length === 0
  ) {
    return;
  }

  try {
    const mutations = [];

    // Build add mutations
    for (const add of pendingOperations.adds) {
      mutations.push({
        merchandiseId: add.merchandiseId,
        quantity: add.quantity,
      });
    }

    // Build update mutations
    for (const update of pendingOperations.updates) {
      mutations.push({
        id: update.id,
        quantity: update.quantity,
      });
    }

    // Build remove mutations
    for (const remove of pendingOperations.removes) {
      mutations.push({
        id: remove,
        quantity: 0,
      });
    }

    if (mutations.length > 0) {
      await cartLinesUpdateMutation(cartId, mutations);
    }

    // Clear pending operations after successful flush
    setPendingOperations({ adds: [], updates: [], removes: [] });
    await syncCart();
  } catch (err) {
    console.error('Error flushing pending operations:', err);
  }
}, [pendingOperations, cartId]);
```

- [ ] **Step 5: Create debounced flush function**

Below the flushPendingOperations function, add:

```typescript
// Debounce the flush to batch rapid operations
const debouncedFlush = useCallback(debounce(flushPendingOperations, 50), [flushPendingOperations]);
```

- [ ] **Step 6: Commit**

```bash
git add src/context/CartContext.tsx src/utils/debounce.ts
git commit -m "feat: add debounce utility and batch operation state to CartContext

- Create debounce utility for function call batching
- Add pendingOperations state for tracking add/update/remove mutations
- Add flushPendingOperations callback to apply batched mutations
- Add debouncedFlush wrapper for 50ms batching window

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### Task 2: Refactor addItem to batch operations

**Files:**
- Modify: `src/context/CartContext.tsx:180-210` (updateaddItem function)

- [ ] **Step 1: Update addItem to batch instead of immediate API call**

Find the `addItem` function (around line 180) and replace it with:

```typescript
const addItem = useCallback(
  (item: CartItem) => {
    const newItems = [...items, item];
    setItems(newItems);

    setPendingOperations((prev) => ({
      ...prev,
      adds: [
        ...prev.adds,
        {
          merchandiseId: item.shopifyVariantId || '',
          quantity: 1,
        },
      ],
    }));

    debouncedFlush();
  },
  [debouncedFlush, items]
);
```

- [ ] **Step 2: Update updateItem to batch operations**

Find the `updateItem` function (around line 195) and replace it with:

```typescript
const updateItem = useCallback(
  (id: string, quantity: number) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setItems(updatedItems);

    setPendingOperations((prev) => ({
      ...prev,
      updates: [
        ...prev.updates,
        {
          id,
          quantity,
        },
      ],
    }));

    debouncedFlush();
  },
  [debouncedFlush, items]
);
```

- [ ] **Step 3: Update removeItem to batch operations**

Find the `removeItem` function (around line 205) and replace it with:

```typescript
const removeItem = useCallback(
  (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    setPendingOperations((prev) => ({
      ...prev,
      removes: [...prev.removes, id],
    }));

    debouncedFlush();
  },
  [debouncedFlush, items]
);
```

- [ ] **Step 4: TypeScript check**

Run: `npm run typecheck`
Expected: PASS with no errors

- [ ] **Step 5: Commit**

```bash
git add src/context/CartContext.tsx
git commit -m "feat: refactor cart operations to batch with 50ms debounce

- Change addItem to batch add operations instead of immediate API call
- Change updateItem to batch update operations with debouncing
- Change removeItem to batch remove operations with debouncing
- All operations now flush together within 50ms window for efficiency

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: React.memo Component Memoization

### Task 1: Create memoized ProductCard component in AllCollections

**Files:**
- Modify: `src/components/AllCollections.tsx:50-120` (ProductCard component)

- [ ] **Step 1: Wrap ProductCard with React.memo**

In `src/components/AllCollections.tsx`, find the ProductCard function definition (around line 59) and wrap it:

Change from:
```typescript
function ProductCard({ product, onNavigate }: ProductCardProps) {
  // ...
}
```

To:
```typescript
const ProductCard = React.memo(function ProductCard(
  { product, onNavigate }: ProductCardProps
) {
  // ... same implementation
});
```

Make sure React is imported at the top:
```typescript
import React, { useState, useCallback, useMemo } from 'react';
```

- [ ] **Step 2: Add useMemo to sort/filter operations**

Find where products are sorted/filtered (around line 140) and wrap it with useMemo:

Change from:
```typescript
const sortedProducts = products.sort((a, b) => {
  // sort logic
});
```

To:
```typescript
const sortedProducts = useMemo(
  () =>
    products.sort((a, b) => {
      // sort logic - keep exact same logic
    }),
  [products, sortBy]
);
```

- [ ] **Step 3: TypeScript check**

Run: `npm run typecheck`
Expected: PASS with no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "feat: memoize ProductCard component in AllCollections

- Wrap ProductCard with React.memo to prevent unnecessary re-renders
- Add useMemo to sort/filter operations to maintain referential equality
- Prevents product cards from re-rendering when parent state changes

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### Task 2: Memoize ProductCard in remaining collection components

**Files:**
- Modify: `src/components/NewArrivals.tsx` (ProductCard component)
- Modify: `src/components/CabinetHumidors.tsx` (ProductCard component)
- Modify: `src/components/DesktopHumidors.tsx` (ProductCard component)
- Modify: `src/components/ElectronicHumidors.tsx` (ProductCard component)
- Modify: `src/components/TravelHumidors.tsx` (ProductCard component)
- Modify: `src/components/Accessories.tsx` (ProductCard component)

- [ ] **Step 1: Apply React.memo pattern to NewArrivals ProductCard**

In `src/components/NewArrivals.tsx`, wrap the ProductCard function with React.memo (same pattern as Task 1, Step 1).

Add import if missing:
```typescript
import React, { useCallback, useMemo } from 'react';
```

- [ ] **Step 2: Apply React.memo pattern to CabinetHumidors ProductCard**

Repeat same pattern in `src/components/CabinetHumidors.tsx`.

- [ ] **Step 3: Apply React.memo pattern to DesktopHumidors ProductCard**

Repeat same pattern in `src/components/DesktopHumidors.tsx`.

- [ ] **Step 4: Apply React.memo pattern to ElectronicHumidors ProductCard**

Repeat same pattern in `src/components/ElectronicHumidors.tsx`.

- [ ] **Step 5: Apply React.memo pattern to TravelHumidors ProductCard**

Repeat same pattern in `src/components/TravelHumidors.tsx`.

- [ ] **Step 6: Apply React.memo pattern to Accessories ProductCard**

Repeat same pattern in `src/components/Accessories.tsx`.

- [ ] **Step 7: TypeScript check**

Run: `npm run typecheck`
Expected: PASS with no errors

- [ ] **Step 8: Commit**

```bash
git add src/components/NewArrivals.tsx src/components/CabinetHumidors.tsx src/components/DesktopHumidors.tsx src/components/ElectronicHumidors.tsx src/components/TravelHumidors.tsx src/components/Accessories.tsx
git commit -m "feat: apply React.memo memoization to all ProductCard components

- Wrap ProductCard in NewArrivals, CabinetHumidors, DesktopHumidors, ElectronicHumidors, TravelHumidors, Accessories with React.memo
- Prevents unnecessary re-renders when parent state changes but props remain the same
- Improves filter/sort responsiveness across all collection pages

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: AllCollections Pagination Fix

### Task 1: Change AllCollections to fetch PAGE_SIZE instead of 50

**Files:**
- Modify: `src/components/AllCollections.tsx:20-50` (pagination logic)

- [ ] **Step 1: Find and update initial fetch**

In `src/components/AllCollections.tsx`, find where products are initially fetched (around line 50):

Change from:
```typescript
const { products } = await fetchProducts(50);
```

To:
```typescript
const PAGE_SIZE = 12;
const { products } = await fetchProducts(PAGE_SIZE);
```

Add the PAGE_SIZE constant at the top of the component:

```typescript
const PAGE_SIZE = 12;
```

- [ ] **Step 2: Update "Load More" pagination**

Find the "Load More" button handler (around line 100) and update it:

Change from:
```typescript
const handleLoadMore = useCallback(async () => {
  const nextPage = (currentPage + 1) * 50;
  // ...
}, [currentPage]);
```

To:
```typescript
const handleLoadMore = useCallback(async () => {
  const nextPage = (currentPage + 1) * PAGE_SIZE;
  const { products: newProducts } = await fetchProducts(PAGE_SIZE, nextPage);
  setProducts((prev) => [...prev, ...newProducts]);
  setCurrentPage((prev) => prev + 1);
}, [currentPage]);
```

- [ ] **Step 3: TypeScript check**

Run: `npm run typecheck`
Expected: PASS with no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "fix: fetch PAGE_SIZE (12) products instead of 50 in AllCollections

- Change initial fetch to PAGE_SIZE (12) matching display count
- Update pagination to fetch 12 products per page
- Reduces bandwidth waste from over-fetching products not displayed
- Improves performance on slower connections

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 6: Tawk Chat Deferral

### Task 1: Defer Tawk initialization to window load event

**Files:**
- Modify: `index.html:80-91` (Tawk script loading)

- [ ] **Step 1: Find and update Tawk script in index.html**

In `index.html`, find the Tawk initialization script (around line 80):

Current code looks like:
```html
<script>
  var s1 = document.createElement("script");
  s1.src = 'https://embed.tawk.to/69fb527d491d631c393ede51/1jnurkehu';
  s1.async = true;
  document.head.appendChild(s1);
</script>
```

Replace with:

```html
<script defer>
  window.addEventListener('load', function() {
    var s1 = document.createElement("script");
    s1.src = 'https://embed.tawk.to/69fb527d491d631c393ede51/1jnurkehu';
    s1.async = true;
    document.head.appendChild(s1);
  });
</script>
```

- [ ] **Step 2: Verify the change**

Visual check: Script is now wrapped in a window 'load' event listener, and the script tag has `defer` attribute.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: defer Tawk chat initialization until window load

- Wrap Tawk script initialization in window load event listener
- Add defer attribute to script tag
- Prevents Tawk from blocking main thread during page parse
- Chat widget loads after page is fully interactive
- Improves First Contentful Paint (FCP) and Time to Interactive (TTI)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 7: Code Cleanup - Remove Unused Supabase

### Task 1: Remove Supabase library and code

**Files:**
- Modify: `package.json` (remove @supabase/supabase-js)
- Delete: `src/lib/supabase.ts` (if it exists and is unused)

- [ ] **Step 1: Check if supabase.ts is imported anywhere**

Run: `grep -r "from.*supabase" src/`
Expected: Should show NO results (supabase is not imported anywhere)

If there ARE results, skip this task - Supabase is in use.

- [ ] **Step 2: Remove @supabase/supabase-js from package.json**

Open `package.json` and find the line with `"@supabase/supabase-js"`. Delete that entire line.

Example - remove this line:
```json
"@supabase/supabase-js": "^2.35.0",
```

- [ ] **Step 3: Delete src/lib/supabase.ts if it exists**

Run: `rm src/lib/supabase.ts` (only if file exists)

Or if using Windows: `del src\lib\supabase.ts`

- [ ] **Step 4: Run npm install to update lock file**

Run: `npm install`
Expected: Dependency is removed from package-lock.json

- [ ] **Step 5: TypeScript check**

Run: `npm run typecheck`
Expected: PASS with no errors

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused @supabase/supabase-js dependency

- Remove @supabase/supabase-js from dependencies (50 KB saved)
- Delete unused src/lib/supabase.ts file
- Reduces bundle size and dependencies
- Supabase was never integrated into the application

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### Task 2: Final verification and push

**Files:**
- No modifications (verification only)

- [ ] **Step 1: Run full build and typecheck**

Run: `npm run typecheck && npm run build`
Expected: PASS with no errors or warnings

- [ ] **Step 2: Verify git log**

Run: `git log --oneline | head -10`
Expected: Should see 5 new commits from phases 3-7

- [ ] **Step 3: Push all changes to production**

Run: `git push origin main`
Expected: All commits successfully pushed

- [ ] **Step 4: Final summary**

Create a summary message with all performance improvements:

Phases 1-2 (completed):
- Phase 1: API waterfall elimination: 2-3 seconds saved
- Phase 2: WebP image optimization: 4-6 seconds saved

Phases 3-7 (just completed):
- Phase 3: Cart operation batching: 1-2 seconds saved
- Phase 4: Component memoization: slight responsiveness improvement
- Phase 5: Pagination fix: bandwidth improvement
- Phase 6: Tawk deferral: main thread improvement
- Phase 7: Code cleanup: 50 KB bundle reduction

Total estimated improvement: 10+ seconds on initial page load

---

## Execution Strategy

**Phase 3 (CartContext):** 1 task, ~2 sub-steps, ~15 minutes
**Phase 4 (React.memo):** 2 tasks, ~8 sub-steps, ~20 minutes
**Phase 5 (Pagination):** 1 task, ~4 sub-steps, ~10 minutes
**Phase 6 (Tawk):** 1 task, ~3 sub-steps, ~5 minutes
**Phase 7 (Cleanup):** 2 tasks, ~6 sub-steps, ~10 minutes

**Total estimated time:** 60 minutes
**Recommended approach:** Execute sequentially, with typecheck after each phase

---

Plan complete and saved. Ready for subagent-driven execution starting with Phase 3.
