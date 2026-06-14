# Mobile Grid Optimization — Responsive Luxury Design

**Date:** 2026-06-13  
**Status:** Draft for Review  
**Scope:** AllCollections responsive grid refinement for mobile/tablet experience

---

## Problem

Current implementation uses fixed 4-column grid across all screens:
- **Desktop (1024px+):** ✅ Excellent — spacious, luxury feel, clear product images
- **Tablet (768px-1023px):** ⚠️ Tight — 4 columns at ~175px width, cramped
- **Mobile (375px):** ❌ Poor — 4 columns at ~94px width, product images unreadable, luxury feel lost

---

## Solution: Responsive Grid with Breakpoints

Implement a 3-tier responsive grid that scales elegantly from mobile to desktop:

| Breakpoint | Columns | Card Width | Use Case | Feel |
|------------|---------|-----------|----------|------|
| **Mobile** (< 768px) | **2** | ~165px | Touch-friendly, image-focused | Curated, intimate |
| **Tablet** (768px - 1023px) | **3** | ~225px | Balanced, moderate detail | Professional |
| **Desktop** (≥ 1024px) | **4** | ~260px | Current (approved) | Spacious, luxury |

---

## Design Details

### Grid Tailwind Classes
```
Current (desktop-only): grid-cols-4 gap-4 md:gap-6

New (responsive): grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8
```

### Product Card Styling (No Changes)
- Image: Full width, aspect-ratio preserved, responsive scaling
- Title, price, Add to Cart: Scale proportionally with container
- Hover effects: Disabled on mobile, enabled on desktop
- Touch target (Add to Cart): 44px min height ✓ (already compliant)

### Pagination

**Option A (Recommended):** Keep PAGE_SIZE at 16, adjust initial visible based on screen
- Mobile: Show 10 products initially (5 rows × 2 cols), then Load More
- Tablet+: Show 16 products initially (as designed)

**Option B:** Adaptive PAGE_SIZE
- Mobile: PAGE_SIZE = 10 (2 cols × 5 rows)
- Tablet: PAGE_SIZE = 12 (3 cols × 4 rows)
- Desktop: PAGE_SIZE = 16 (4 cols × 4 rows) ← Current

**Recommendation:** Option A (simpler, consistent product loading)

---

## Visual Hierarchy

### Mobile (2 cols)
- **Hero:** Large product image dominates each card
- **Info:** Title, price, Add to Cart below image (stacked vertically)
- **Benefit:** Users can see product detail and scroll through curated selection without friction
- **Luxury cue:** Generous whitespace, clear product photography

### Tablet (3 cols)
- **Balance:** Medium-sized images, clear pricing
- **Benefit:** More products visible before scroll (useful for comparison shopping)

### Desktop (4 cols) — Current, Approved
- **Expansive:** Spacious layout showing diverse collection at a glance
- **Benefit:** Power users can browse efficiently

---

## Implementation

**File:** `src/components/AllCollections.tsx:420`

**Current line 420:**
```typescript
<div className="grid grid-cols-4 gap-4 md:gap-6">
```

**Change to:**
```typescript
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
```

**Changes needed:**
1. Update grid className (1 line change)
2. (Optional) Adjust PAGE_SIZE or pagination logic if Option B chosen

---

## Testing Checklist

- [ ] Mobile (375px): 2-column grid, cards readable, images visible
- [ ] Mobile (425px): 2-column grid scales nicely
- [ ] Tablet (768px): 3-column grid appears at breakpoint
- [ ] Tablet (1024px): Transitions smoothly to 4-column
- [ ] Desktop (1440px+): 4-column grid with spacious layout
- [ ] Load More button: Loads next batch correctly
- [ ] Add to Cart: Touchable and functional on all sizes
- [ ] Price/title: Readable on mobile without truncation
- [ ] Sort/filter: Responsive and functional on all sizes
- [ ] No layout shift when filter changes

---

## Rollback

If 2-column mobile feels too sparse:
```
Revert to: grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6
(3 cols on mobile, 4 on tablet+)
```

---

## Luxury Brand Considerations

✅ **What makes it luxe on mobile:**
- Fewer cards per row → each product gets breathing room
- Larger images → appreciation for product design and craftsmanship
- White space → premium aesthetic, not cramped/cluttered
- Touch-friendly → effortless browsing experience
- Fast load (fewer cards initially) → smooth performance

✅ **What stays consistent:**
- Color palette (gold, charcoal, cream)
- Typography (serif headers, elegant spacing)
- Product photography (high-quality images dominate)
- Interaction patterns (hover on desktop, tap on mobile)
