# Collections Grid Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize AllCollections page to display 16 products per initial load (4×4 grid), remove collection filter, and default sort to most expensive first.

**Architecture:** All changes are in `src/components/AllCollections.tsx`. The component currently manages collection filtering, price filtering, and sorting state. We remove the collection filter state and UI, change the default sort to price-desc, increase PAGE_SIZE to 16, update the grid to fixed 4 columns, and simplify FilterBar props.

**Tech Stack:** React, TypeScript, Tailwind CSS, Lucide React icons

---

## Task 1: Remove Collection Filter State

**Files:**
- Modify: `src/components/AllCollections.tsx:220-230`

- [ ] **Step 1: Locate the collection state variables**

Open `src/components/AllCollections.tsx` and find lines 227-228:
```typescript
const [selectedCollection, setSelectedCollection] = useState('');
```

- [ ] **Step 2: Delete the selectedCollection state**

Remove these two lines entirely. The file should not have any `selectedCollection` or `setSelectedCollection` variables.

- [ ] **Step 3: Verify no other references to selectedCollection in state setup**

Scan lines 220-235 to confirm no other collection-related state exists. You should see:
```typescript
const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(0);
const [sort, setSort] = useState<SortKey>('price-desc');
const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
```

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: remove selectedCollection state from AllCollections"
```

---

## Task 2: Change Default Sort to Price-Desc

**Files:**
- Modify: `src/components/AllCollections.tsx:228`

- [ ] **Step 1: Locate the sort state**

Find the line that initializes sort state (around line 228):
```typescript
const [sort, setSort] = useState<SortKey>('featured');
```

- [ ] **Step 2: Change default sort to price-desc**

Replace with:
```typescript
const [sort, setSort] = useState<SortKey>('price-desc');
```

- [ ] **Step 3: Verify the change**

Confirm the line now reads `'price-desc'` instead of `'featured'`.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: change AllCollections default sort to price-desc (highest first)"
```

---

## Task 3: Change PAGE_SIZE from 12 to 16

**Files:**
- Modify: `src/components/AllCollections.tsx:33`

- [ ] **Step 1: Locate PAGE_SIZE constant**

Find line 33 (near top of file, after imports):
```typescript
const PAGE_SIZE = 12;
```

- [ ] **Step 2: Update to 16**

Replace with:
```typescript
const PAGE_SIZE = 16;
```

- [ ] **Step 3: Verify the change**

Confirm it now reads `16`.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: increase AllCollections PAGE_SIZE from 12 to 16"
```

---

## Task 4: Remove Collection Filtering Logic

**Files:**
- Modify: `src/components/AllCollections.tsx:272-283`

- [ ] **Step 1: Locate the collection filter logic**

Find the block that filters by collection (lines 272-283):
```typescript
// Filter by collection (client-side via tags / productType matching collection title)
const collectionFiltered = selectedCollection
  ? allProducts.filter((p) => {
      const col = collections.find((c) => c.handle === selectedCollection);
      if (!col) return true;
      // match by productType or tag containing collection title words
      const titleWords = col.title.toLowerCase().split(' ').filter((w) => w.length > 3);
      const pType = p.productType.toLowerCase();
      const pTags = p.tags.map((t) => t.toLowerCase()).join(' ');
      return titleWords.some((w) => pType.includes(w) || pTags.includes(w));
    })
  : allProducts;
```

- [ ] **Step 2: Replace entire block with simple assignment**

Delete the entire `collectionFiltered` block above and replace with:
```typescript
// No collection filtering — show all products
const collectionFiltered = allProducts;
```

- [ ] **Step 3: Verify the change**

Confirm lines 272-283 are now replaced by a single comment and one line of code.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: remove collection filtering logic from AllCollections"
```

---

## Task 5: Update useEffect Dependency Array

**Files:**
- Modify: `src/components/AllCollections.tsx:298-300`

- [ ] **Step 1: Locate the useEffect that resets visible count**

Find the useEffect block (around lines 298-300):
```typescript
// Reset visible count when filter/sort changes
useEffect(() => {
  setVisibleCount(PAGE_SIZE);
}, [selectedCollection, sort, minPrice, maxPrice]);
```

- [ ] **Step 2: Remove selectedCollection from dependencies**

Update the dependency array to:
```typescript
}, [sort, minPrice, maxPrice]);
```

The full useEffect should now be:
```typescript
// Reset visible count when filter/sort changes
useEffect(() => {
  setVisibleCount(PAGE_SIZE);
}, [sort, minPrice, maxPrice]);
```

- [ ] **Step 3: Verify the change**

Confirm `selectedCollection` is removed and only `sort`, `minPrice`, `maxPrice` remain.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: remove selectedCollection from useEffect dependency array"
```

---

## Task 6: Remove Collection Filter from FilterBar Props

**Files:**
- Modify: `src/components/AllCollections.tsx:371-380`

- [ ] **Step 1: Locate the FilterBar component call**

Find the FilterBar invocation (around lines 371-380):
```typescript
<FilterBar
  collections={collections}
  selectedCollection={selectedCollection}
  onCollectionChange={setSelectedCollection}
  sort={sort}
  onSortChange={setSort}
  minPrice={minPrice}
  onMinPriceChange={setMinPrice}
  maxPrice={maxPrice}
  onMaxPriceChange={setMaxPrice}
/>
```

- [ ] **Step 2: Remove collection-related props**

Delete these three lines:
```typescript
  collections={collections}
  selectedCollection={selectedCollection}
  onCollectionChange={setSelectedCollection}
```

The FilterBar should now be:
```typescript
<FilterBar
  sort={sort}
  onSortChange={setSort}
  minPrice={minPrice}
  onMinPriceChange={setMinPrice}
  maxPrice={maxPrice}
  onMaxPriceChange={setMaxPrice}
/>
```

- [ ] **Step 3: Verify the change**

Confirm only sort, minPrice, and maxPrice props remain.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: remove collection filter props from FilterBar invocation"
```

---

## Task 7: Update FilterBar Component Signature and UI

**Files:**
- Modify: `src/components/AllCollections.tsx:161-173`

- [ ] **Step 1: Locate FilterBar function signature**

Find the FilterBar component function (around lines 161-173):
```typescript
function FilterBar({
  collections,
  selectedCollection,
  onCollectionChange,
  sort,
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: {
  collections: ShopifyCollection[];
  selectedCollection: string;
  onCollectionChange: (v: string) => void;
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  minPrice: number;
  onMinPriceChange: (v: number) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
}) {
```

- [ ] **Step 2: Remove collection-related props from destructuring**

Update the function signature to:
```typescript
function FilterBar({
  sort,
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
}: {
  sort: SortKey;
  onSortChange: (v: SortKey) => void;
  minPrice: number;
  onMinPriceChange: (v: number) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
}) {
```

- [ ] **Step 3: Verify the change**

Confirm the destructuring and type definition no longer include `collections`, `selectedCollection`, or `onCollectionChange`.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: remove collection props from FilterBar signature"
```

---

## Task 8: Remove Collection Dropdown UI from FilterBar

**Files:**
- Modify: `src/components/AllCollections.tsx:181-196`

- [ ] **Step 1: Locate the collection dropdown in FilterBar JSX**

Find the collection dropdown div (around lines 181-196):
```typescript
      {/* Collection dropdown */}
      <div className="relative">
        <select
          value={selectedCollection}
          onChange={(e) => onCollectionChange(e.target.value)}
          className="appearance-none bg-charcoal-900 border border-charcoal-700/60 hover:border-gold-500/40 focus:border-gold-500/60 text-cream-200/70 text-xs font-medium tracking-wide rounded px-4 py-2.5 pr-8 outline-none transition-colors cursor-pointer"
        >
          <option value="">All Collections</option>
          {collections.map((c) => (
            <option key={c.id} value={c.handle}>
              {c.title}
            </option>
          ))}
        </select>
        <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-cream-200/30" />
      </div>
```

- [ ] **Step 2: Delete the entire collection dropdown div**

Remove all of the above code (the complete `<div className="relative">` block for the collection dropdown).

- [ ] **Step 3: Verify the change**

Confirm the collection dropdown is completely removed. The FilterBar JSX should now start with the Filter label and go directly to the Price Range Filter.

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: remove collection dropdown UI from FilterBar"
```

---

## Task 9: Update Grid Layout to Fixed 4 Columns

**Files:**
- Modify: `src/components/AllCollections.tsx:411`

- [ ] **Step 1: Locate the product grid**

Find the grid div (around line 411):
```typescript
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
```

- [ ] **Step 2: Change to fixed 4 columns on all screens**

Replace with:
```typescript
                <div className="grid grid-cols-4 gap-4 md:gap-6">
```

This removes the `md:grid-cols-3` and `lg:gap-8` variants, applying 4 columns uniformly while keeping responsive gaps.

- [ ] **Step 3: Verify the change**

Confirm the line now reads `grid-cols-4` (not `grid-cols-2 md:grid-cols-3`).

- [ ] **Step 4: Commit**

```bash
git add src/components/AllCollections.tsx
git commit -m "refactor: change AllCollections grid to fixed 4 columns on all screens"
```

---

## Task 10: Build and Test

**Files:**
- Test: `src/components/AllCollections.tsx` (compiled output)

- [ ] **Step 1: Run TypeScript check**

```bash
npm run typecheck
```

Expected: No TypeScript errors. If errors appear, fix them before proceeding.

- [ ] **Step 2: Build the project**

```bash
npm run build 2>&1 | tail -5
```

Expected: Successful build output. Example:
```
Generated 21 pages.
Sitemap: 19 static + 66 products + 44 articles = 129 URLs
Wrote dist/sitemap.xml
```

If build fails, review error messages and fix before proceeding.

- [ ] **Step 3: Verify no console errors**

Check that build completed without warnings related to missing props or undefined variables.

- [ ] **Step 4: Final commit with all changes**

```bash
git log --oneline | head -10
```

Expected: You should see ~9 commits from this implementation plan (Tasks 1-9).

---

## Testing Checklist

After building, these should all pass. (Manual browser testing required for full verification.)

- [ ] Grid displays 4 columns at all breakpoints (test with DevTools responsive mode: 375px, 768px, 1024px)
- [ ] First load shows 16 products (4×4 grid)
- [ ] Load More button appears and loads next batch of 16
- [ ] Collection dropdown is completely removed from UI
- [ ] Price filter inputs work (min/max filter products)
- [ ] Sort dropdown works and defaults to "Price: High to Low"
- [ ] All products show (no collection filtering applied)
- [ ] No TypeScript errors or console warnings related to undefined props
- [ ] Products are responsive and readable at 4-column layout on mobile

---

## Rollback

If 4-column mobile proves unusable after testing in browser:

1. Revert grid to `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8`
2. Revert PAGE_SIZE to `12`
3. No other changes needed — filtering and sorting logic remain intact

```bash
git revert HEAD~9..HEAD
```

---

## Summary

**9 commits, ~2-3 minutes per commit:**
1. Remove selectedCollection state
2. Change default sort to price-desc
3. Change PAGE_SIZE to 16
4. Remove collection filtering logic
5. Update useEffect dependency array
6. Remove collection props from FilterBar invocation
7. Update FilterBar function signature
8. Remove collection dropdown UI
9. Update grid layout
10. Build and verify

Total time: ~20-30 minutes if executed sequentially. Each task is independent and builds on the previous one.
