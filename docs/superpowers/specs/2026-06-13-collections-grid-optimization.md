# Collections Grid Optimization & Sorting

**Date:** 2026-06-13  
**Status:** Design Approved  
**Scope:** AllCollections page layout, filtering, and default sort behavior

---

## Overview

Optimize the All Collections page to display 16 products per initial load (4×4 grid on all screen sizes), simplify filtering by removing the collection dropdown, and change default sort to show most expensive products first.

---

## Current State

- Grid: Responsive (2 cols mobile, 3 cols tablet, 3 cols desktop)
- Initial load: PAGE_SIZE = 12 products
- Filters: Collection dropdown + price range (min/max) + sort dropdown
- Default sort: 'featured'
- Pagination: Load More button

---

## Desired State

- Grid: Fixed 4 columns on all screen sizes (mobile, tablet, desktop)
- Initial load: 16 products (4×4)
- Filters: Price range + sort dropdown only (remove collection filter)
- Default sort: 'price-desc' (highest price first)
- Pagination: Load More button (unchanged functionality, loads next 16 products)

---

## Component Changes

### AllCollections.tsx

**State Changes:**
- Remove `selectedCollection` state variable
- Remove `setSelectedCollection` state setter
- Keep `minPrice`, `maxPrice`, `sort` state (unchanged)

**Props to FilterBar:**
- Remove `selectedCollection`, `onCollectionChange` props
- Keep `sort`, `onSortChange`, `minPrice`, `onMinPriceChange`, `maxPrice`, `onMaxPriceChange` props

**Filtering Logic:**
- Remove collection filter step entirely
- Keep price range filtering (minPrice/maxPrice check)
- Result: `priceFiltered = collectionFiltered` becomes `priceFiltered = allProducts` (no collection step)

**Sorting:**
- Change initial sort state from `'featured'` to `'price-desc'`
- Sorting logic unchanged (already has price-desc handler)

**Pagination:**
- Change `PAGE_SIZE` from 12 to 16
- Load More button behavior unchanged (increments by PAGE_SIZE = 16)

**Grid Layout:**
- Current responsive grid: `grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8`
- New fixed 4-col grid: `grid-cols-4 gap-4`
- Apply across all breakpoints (remove md:/lg: variants for grid columns)
- Note: gap can stay responsive if desired (gap-4 on mobile, gap-6+ on larger screens acceptable)

---

## FilterBar Component Changes

**Props to remove:**
- `collections: ShopifyCollection[]`
- `selectedCollection: string`
- `onCollectionChange: (v: string) => void`

**UI to remove:**
- Collection dropdown select element and label
- Related CSS/styling for dropdown

**UI to keep:**
- Price range filter (min/max inputs)
- Sort dropdown
- Filter label and SlidersHorizontal icon

**JSX structure:**
- Remove collection dropdown div
- Keep single flex row with: Filter icon/label + price inputs + sort dropdown
- On mobile (<600px), already wraps via flex-wrap

---

## Reset Visible Count

**useEffect dependency array:**
- Currently: `[selectedCollection, sort, minPrice, maxPrice]`
- Change to: `[sort, minPrice, maxPrice]` (remove selectedCollection)
- Still resets pagination when any filter/sort changes

---

## Data Flow

**Before:**
1. allProducts
2. Filter by collection → collectionFiltered
3. Filter by price → priceFiltered
4. Sort → sorted
5. Paginate → displayed

**After:**
1. allProducts
2. ~~Filter by collection~~ (removed)
3. Filter by price → priceFiltered
4. Sort → sorted
5. Paginate → displayed

---

## Mobile Responsiveness

**Card size at 4 columns:**
- 375px mobile viewport: ~90px card width (tight but readable)
- 768px tablet: ~180px card width (comfortable)
- 1024px+ desktop: ~240px+ card width (spacious)

**All interactions remain touch-friendly:**
- Add to Cart button: 12px text, clickable area preserved
- Price display: Readable at small size
- Image aspect ratio: Maintained (product photos scale down proportionally)
- Hover effects: Disabled on mobile, work on desktop

---

## Testing Checklist

- [ ] Grid displays 4 columns on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] First load shows 16 products (4×4)
- [ ] Load More button loads next 16 products
- [ ] Collection dropdown is completely removed from UI
- [ ] Price filter works (min/max inputs filter products)
- [ ] Sort dropdown works, default is "Price: High to Low"
- [ ] Clicking sort/price filter resets pagination to PAGE_SIZE (16)
- [ ] All products show (no collection filtering applied)
- [ ] Add to Cart, image hover effects work on all screen sizes
- [ ] No console errors related to missing props or undefined state

---

## Files Modified

- `src/components/AllCollections.tsx` — Grid layout, state removal, filtering logic, sort default, pagination size

---

## Rollback Plan

If 4-column mobile proves unusable:
1. Revert grid to: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
2. Revert PAGE_SIZE to 12
3. No state/logic changes required (filtering still works)

---

## Notes

- This is a purely frontend change; no API, database, or Shopify backend changes required
- All existing cart, checkout, and product page flows remain unchanged
- The collection filter is UI-only removal; Shopify still has collections, just not exposed in this view
- Price filter and sort dropdown continue to work as-is (no logic changes, just layout/state cleanup)
