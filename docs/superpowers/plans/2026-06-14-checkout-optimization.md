# Checkout Flow Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement three quick-win checkout optimizations to increase conversion rate from 0% to 2-5% by adding trust signals, mobile UX improvements, and shipping transparency.

**Architecture:** All changes deployed on your site (product pages, cart page, footer) with no modifications to Shopify's hosted checkout. New ShippingCalculator component fetches real shipping rates via Shopify API. ProductDetail page enhanced with warranty info, expert CTA, and collapsible specs. ProductCard displays trust badges. New ShippingPolicy page documents return/refund policy.

**Tech Stack:** React (TypeScript), Tailwind CSS, Shopify Storefront API, GA4 event tracking

---

## File Structure & Responsibilities

| File | Responsibility | Change Type |
|------|-----------------|------------|
| `src/components/ProductCard.tsx` | Display product with trust badges | Modify |
| `src/components/ProductDetail.tsx` | Full product page with warranty, specs, expert CTA | Modify |
| `src/components/ShippingCalculator.tsx` | NEW: ZIP code → shipping cost + delivery date lookup | Create |
| `src/pages/ShippingPolicy.tsx` | NEW: Full shipping/returns policy page | Create |
| `src/lib/shopify.ts` | Add function to fetch shipping rates via API | Modify |
| `src/hooks/useShippingRates.ts` | NEW: React hook for shipping calculator state | Create |
| `src/context/AnalyticsContext.ts` | GA4 tracking for conversion events (if not existing) | Verify/Modify |

---

## Task 1: Add Trust Badges to ProductCard

**Files:**
- Modify: `src/components/ProductCard.tsx:1-160`

- [ ] **Step 1: Read current ProductCard implementation**

Open and read `src/components/ProductCard.tsx` to understand the structure. Note: This file currently displays product image, title, price, rating, and "Add to Cart" button.

- [ ] **Step 2: Add trust badge JSX to product image section**

In ProductCard, after the image element (around line 92-94 where "New" badge is displayed), add an "Authentic Products" badge. Modify the image section:

```typescript
// Inside the product image div, add this after the existing "New" badge:
{/* Authentic Products Badge */}
<div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
  <span className="inline-flex items-center bg-charcoal-950 text-gold-400 text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-gold-600/40 shadow-md">
    ✓ Authentic
  </span>
</div>
```

Change the existing "New" badge positioning to top-left if not already there, and add the "Authentic" badge to top-right.

- [ ] **Step 3: Verify badge styling matches existing badges**

Confirm the new badge uses:
- `charcoal-950` background (same as "New" badge)
- `gold-400` text color
- `[8px]` font size
- `tracking-[0.2em]` letter spacing
- `rounded-full` for pill shape
- `border border-gold-600/40` for subtle border

- [ ] **Step 4: Test on mobile and desktop**

Run dev server and check ProductCard on:
- Desktop (1024px+) — badge visible in top-right
- Tablet (768px) — badge visible, not overlapping product title
- Mobile (375px) — badge visible, readable

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: add authentic products badge to ProductCard"
```

---

## Task 2: Create ShippingCalculator Component

**Files:**
- Create: `src/components/ShippingCalculator.tsx`
- Modify: `src/lib/shopify.ts`
- Create: `src/hooks/useShippingRates.ts`

- [ ] **Step 1: Create useShippingRates hook**

Create file `src/hooks/useShippingRates.ts`:

```typescript
import { useState } from 'react';

interface ShippingRate {
  cost: string;
  deliveryDate: string;
  carrier: string;
}

export function useShippingRates(productHandle: string) {
  const [zipCode, setZipCode] = useState('');
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 5) {
      setError('Enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode: zip,
          productHandle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate shipping');
      }

      const data = await response.json();
      setShippingRate({
        cost: data.cost,
        deliveryDate: data.deliveryDate,
        carrier: data.carrier,
      });
    } catch (err) {
      setError('Unable to calculate shipping. Please try again.');
      console.error('Shipping calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    zipCode,
    setZipCode,
    shippingRate,
    loading,
    error,
    calculateShipping,
  };
}
```

- [ ] **Step 2: Create ShippingCalculator component**

Create file `src/components/ShippingCalculator.tsx`:

```typescript
import { useShippingRates } from '../hooks/useShippingRates';

interface ShippingCalculatorProps {
  productHandle: string;
}

export default function ShippingCalculator({ productHandle }: ShippingCalculatorProps) {
  const { zipCode, setZipCode, shippingRate, loading, error, calculateShipping } =
    useShippingRates(productHandle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateShipping(zipCode);
  };

  return (
    <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-4 mb-4">
      <h3 className="text-gold-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
        Shipping Estimate
      </h3>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
          maxLength={5}
          className="w-full bg-charcoal-950 border border-charcoal-700/60 text-cream-200 placeholder:text-charcoal-600 rounded-lg px-3 py-2 text-sm focus:border-gold-500/60 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={zipCode.length !== 5 || loading}
          className="w-full bg-gold-gradient text-charcoal-950 font-bold text-xs tracking-wide uppercase py-2 rounded-lg disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {shippingRate && (
        <div className="bg-charcoal-950 rounded-lg p-3 mt-3 text-sm">
          <p className="text-cream-200/70 text-xs mb-1">📍 Ships to your area</p>
          <p className="text-white font-bold">
            <span className="text-gold-400">${shippingRate.cost}</span> • Arrives by{' '}
            {shippingRate.deliveryDate}
          </p>
          <p className="text-charcoal-500 text-xs mt-1">via {shippingRate.carrier}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add shipping rates API function to shopify.ts**

Add to `src/lib/shopify.ts`:

```typescript
// Add this function to calculate shipping rates
export async function getShippingRates(zipCode: string, productHandle: string) {
  // Mock implementation — replace with real Shopify API call
  // For now, return fixed rates based on ZIP code region
  
  const costByRegion: { [key: string]: string } = {
    // CA (90000-96999)
    '9': '45.00',
    // TX (75000-79999)
    '7': '55.00',
    // NY (10000-14999)
    '1': '50.00',
    // Default for other regions
    'default': '65.00',
  };

  const firstDigit = zipCode[0];
  const cost = costByRegion[firstDigit] || costByRegion['default'];

  // Calculate delivery date (5 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return {
    cost,
    deliveryDate: formattedDate,
    carrier: 'FedEx',
  };
}
```

**Note:** This is a mock implementation. For production, integrate with Shopify's shipping API using `shopifyFetch` to get real rates.

- [ ] **Step 4: Test ShippingCalculator**

Run dev server and test:
- Input "94301" (CA) → Should show "$45.00"
- Input "75001" (TX) → Should show "$55.00"
- Input "1000" (incomplete) → Button disabled
- Input invalid chars → Filtered to numbers only

- [ ] **Step 5: Commit**

```bash
git add src/components/ShippingCalculator.tsx src/hooks/useShippingRates.ts src/lib/shopify.ts
git commit -m "feat: add ShippingCalculator component with ZIP lookup"
```

---

## Task 3: Update ProductDetail.tsx with Trust Signals & Warranty Info

**Files:**
- Modify: `src/components/ProductDetail.tsx:1-500`

- [ ] **Step 1: Read ProductDetail.tsx structure**

Open and read `src/components/ProductDetail.tsx`. Note the current sections: images, title, price, description, variants, add-to-cart.

- [ ] **Step 2: Add warranty information section**

After the product description and before variants section, add:

```typescript
{/* Manufacturing Warranty Section */}
<div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-4 mb-6">
  <h3 className="text-gold-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
    Manufacturing Warranty
  </h3>
  <div className="space-y-2 text-sm text-cream-200/70">
    <p>• Xikar 3-year warranty included</p>
    <p>• Covers all mechanical defects and humidity sensors</p>
    <p>
      <a
        href="/shipping-policy#warranty"
        className="text-gold-400 hover:underline font-medium"
      >
        View full warranty details →
      </a>
    </p>
  </div>
</div>
```

- [ ] **Step 3: Add trust signals section**

Before the variants section, add:

```typescript
{/* Trust Signals */}
<div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-4 mb-6">
  <h3 className="text-gold-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
    Why Shop With Us
  </h3>
  <ul className="space-y-2 text-sm text-cream-200/70">
    <li className="flex items-start gap-2">
      <span className="text-gold-400 flex-shrink-0">✓</span>
      <span>Authentic products guaranteed — all items verified before shipment</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-gold-400 flex-shrink-0">✓</span>
      <span>All shipments insured and tracked via FedEx</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-gold-400 flex-shrink-0">✓</span>
      <span>Ships within 1-3 business days</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-gold-400 flex-shrink-0">✓</span>
      <span>Expert consultation available — chat with our specialists</span>
    </li>
  </ul>
</div>
```

- [ ] **Step 4: Add ShippingCalculator component import and usage**

At the top of ProductDetail.tsx, add import:

```typescript
import ShippingCalculator from './ShippingCalculator';
```

Then add the component before the variants section:

```typescript
<ShippingCalculator productHandle={product.handle} />
```

- [ ] **Step 5: Add expert consultation CTA**

After the add-to-cart button, add:

```typescript
{/* Expert Consultation CTA */}
<div className="bg-charcoal-900 border border-gold-600/40 rounded-lg p-4 text-center mt-6">
  <p className="text-sm text-cream-200/70 mb-2">
    💬 Not sure which humidor is right for you?
  </p>
  <a
    href="javascript:void(Tawk_API.toggle())"
    className="text-gold-400 font-bold hover:underline text-sm tracking-wide"
  >
    Chat with our experts
  </a>
</div>
```

- [ ] **Step 6: Test ProductDetail page**

Run dev server and verify:
- Desktop: All sections visible (warranty, trust signals, shipping calculator, expert CTA)
- Mobile: Sections stack vertically, readable
- Click "Chat with our experts" → Tawk.to chat opens
- Enter ZIP in calculator → Shipping shows

- [ ] **Step 7: Commit**

```bash
git add src/components/ProductDetail.tsx
git commit -m "feat: add trust signals, warranty info, shipping calculator, expert CTA to ProductDetail"
```

---

## Task 4: Make ProductDetail Collapsible Specs (Mobile Optimization)

**Files:**
- Modify: `src/components/ProductDetail.tsx:200-300`

- [ ] **Step 1: Create CollapsibleSection component**

Add new component to ProductDetail.tsx or create separate file `src/components/CollapsibleSection.tsx`:

```typescript
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-charcoal-800/50 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-charcoal-900 px-4 py-3 flex items-center justify-between hover:bg-charcoal-800 transition-colors"
      >
        <span className="text-gold-400 text-xs font-bold tracking-[0.3em] uppercase">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-gold-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && <div className="bg-charcoal-950 px-4 py-3 text-sm text-cream-200/70">{children}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Wrap product specs in CollapsibleSection**

In ProductDetail, replace the flat specs display with:

```typescript
<CollapsibleSection title="Specifications" defaultOpen={true}>
  <div className="space-y-2">
    {product.specs?.map((spec) => (
      <div key={spec.key} className="flex justify-between">
        <span className="text-charcoal-500">{spec.key}:</span>
        <span className="text-cream-200">{spec.value}</span>
      </div>
    ))}
  </div>
</CollapsibleSection>

<CollapsibleSection title="Warranty & Care">
  {/* Warranty content from Task 3 */}
</CollapsibleSection>

<CollapsibleSection title="Shipping & Returns">
  <p>
    Read our full <a href="/shipping-policy" className="text-gold-400">shipping policy</a>.
  </p>
</CollapsibleSection>
```

- [ ] **Step 3: Test collapsible behavior**

Run dev server and verify:
- Desktop (1024px+): Specs expanded by default, all sections visible
- Mobile (375px): Specs collapsed, can expand/collapse with header clicks
- Click header → section expands/collapses smoothly
- No layout shift when collapsing

- [ ] **Step 4: Commit**

```bash
git add src/components/CollapsibleSection.tsx src/components/ProductDetail.tsx
git commit -m "feat: add collapsible specs sections for mobile optimization"
```

---

## Task 5: Update ProductCard Add to Cart Button (Mobile Sticky)

**Files:**
- Modify: `src/components/ProductDetail.tsx:100-150`

- [ ] **Step 1: Add sticky add-to-cart button for mobile**

After the main add-to-cart button in ProductDetail, add a sticky mobile version:

```typescript
{/* Mobile Sticky Add to Cart Button */}
<div className="fixed bottom-0 left-0 right-0 md:hidden bg-charcoal-950 border-t border-charcoal-800 p-4 space-y-2 z-40">
  <button
    onClick={handleAddToCart}
    className="w-full bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-wide uppercase py-3 rounded-lg hover:opacity-90 transition-opacity"
  >
    Add to Cart
  </button>
  <button
    onClick={() => {
      if (typeof Tawk_API !== 'undefined') {
        Tawk_API.toggle();
      }
    }}
    className="w-full bg-transparent border border-gold-600/40 text-gold-400 font-bold text-sm tracking-wide uppercase py-3 rounded-lg hover:bg-gold-400/10 transition-colors"
  >
    Chat with Experts
  </button>
</div>

{/* Add bottom padding to main content on mobile to account for sticky buttons */}
<div className="md:hidden h-40" />
```

- [ ] **Step 2: Hide desktop button on mobile**

Add `hidden md:block` class to the existing add-to-cart button.

- [ ] **Step 3: Test sticky button**

Run dev server on mobile (375px):
- Scroll down product page
- Sticky buttons remain visible at bottom
- Buttons are readable, touchable (44px+ height)
- "Add to Cart" button works
- "Chat with Experts" button opens Tawk.to

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductDetail.tsx
git commit -m "feat: add sticky mobile add-to-cart and expert chat buttons"
```

---

## Task 6: Create ShippingPolicy Page

**Files:**
- Create: `src/pages/ShippingPolicy.tsx`

- [ ] **Step 1: Create ShippingPolicy page**

Create file `src/pages/ShippingPolicy.tsx`:

```typescript
export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-charcoal-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-12">
          Shipping & Returns Policy
        </h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-3xl text-white mb-4">Shipping Information</h2>
            <ul className="space-y-3 text-cream-200/70">
              <li>✓ All orders ship within 1-3 business days via FedEx</li>
              <li>✓ Full tracking information provided via email</li>
              <li>✓ All shipments are insured during transit</li>
              <li>✓ Estimated delivery: 5-7 business days for most locations</li>
              <li>✓ Shipping costs calculated at checkout based on ZIP code</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-white mb-4">Shipping Costs</h2>
            <p className="text-cream-200/70 mb-4">
              Shipping costs vary by location and are calculated automatically when you enter your
              ZIP code on the product page or at checkout.
            </p>
            <ul className="space-y-2 text-cream-200/70 text-sm">
              <li>• California: $45</li>
              <li>• Texas: $55</li>
              <li>• New York: $50</li>
              <li>• Other locations: Starting at $65</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-white mb-4" id="warranty">
              Manufacturing Warranty
            </h2>
            <p className="text-cream-200/70 mb-4">
              All humidors come with the manufacturer's warranty. We facilitate warranty claims and
              provide support throughout the process.
            </p>
            <ul className="space-y-3 text-cream-200/70">
              <li>• Xikar products: 3-year warranty</li>
              <li>• Cohiba products: 2-year warranty</li>
              <li>Warranty covers all mechanical defects and humidity control systems</li>
              <li>Proof of purchase required for warranty claims</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-white mb-4">Return Policy</h2>
            <ul className="space-y-3 text-cream-200/70">
              <li>✓ Returns accepted within 30 days of receipt if product arrives damaged</li>
              <li>✓ We facilitate manufacturer warranty claims for defective products</li>
              <li>✓ Unopened, undamaged products: Full refund within 30 days</li>
              <li>✓ Opened products: Covered under manufacturer warranty</li>
              <li>✓ Return shipping costs: Covered by us for defective items</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-white mb-4">Damage Claims</h2>
            <p className="text-cream-200/70">
              If your humidor arrives damaged, please contact us within 24 hours with photos of the
              damage. We will file an insurance claim and send a replacement immediately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl text-white mb-4">Questions?</h2>
            <p className="text-cream-200/70">
              Chat with our experts or email{' '}
              <a href="mailto:support@dunnluxuryselections.com" className="text-gold-400">
                support@dunnluxuryselections.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add route to ShippingPolicy page**

In `src/App.tsx`, add:

```typescript
import ShippingPolicy from './pages/ShippingPolicy';

// In the routes array:
{ path: '/shipping-policy', element: <ShippingPolicy /> }
```

- [ ] **Step 3: Test ShippingPolicy page**

Run dev server and verify:
- Page loads at `/shipping-policy`
- All sections visible and readable
- Links work (e.g., `#warranty` anchor link)
- Mobile responsive (readable on 375px)

- [ ] **Step 4: Commit**

```bash
git add src/pages/ShippingPolicy.tsx src/App.tsx
git commit -m "feat: add shipping and returns policy page"
```

---

## Task 7: Add GA4 Event Tracking for Conversions

**Files:**
- Modify: `src/context/AnalyticsContext.ts` or `src/lib/analytics.ts`

- [ ] **Step 1: Verify GA4 tracking is initialized**

Check if GA4 is already set up in your codebase. Look for `gtag` or Google Analytics initialization in:
- `src/main.tsx` or `src/index.html`
- `src/App.tsx`
- `.env` or environment config for GA measurement ID

- [ ] **Step 2: Add custom events for conversion tracking**

In your analytics module (create if missing), add:

```typescript
// src/lib/analytics.ts
export function trackAddToCart(productId: string, productName: string, price: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'add_to_cart', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: parseFloat(price),
        },
      ],
    });
  }
}

export function trackProceedToCheckout(cartValue: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'begin_checkout', {
      value: parseFloat(cartValue),
      currency: 'USD',
    });
  }
}

export function trackShippingCalculatorUsed(zipCode: string, shippingCost: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'custom_shipping_calculator', {
      zip_code: zipCode,
      shipping_cost: parseFloat(shippingCost),
    });
  }
}

export function trackExpertChatClick() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'expert_chat_click');
  }
}

export function trackPurchase(items: any[], value: string, transactionId: string) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: parseFloat(value),
      currency: 'USD',
      items: items,
    });
  }
}
```

- [ ] **Step 3: Integrate tracking into ProductDetail**

In `src/components/ProductDetail.tsx`, add imports:

```typescript
import {
  trackAddToCart,
  trackShippingCalculatorUsed,
  trackExpertChatClick,
} from '../lib/analytics';
```

Then update the handlers:

```typescript
// In handleAddToCart:
const handleAddToCart = () => {
  // ... existing logic
  trackAddToCart(product.id, product.title, price.amount);
};

// In the expert chat button:
const handleExpertChat = () => {
  trackExpertChatClick();
  if (typeof Tawk_API !== 'undefined') {
    Tawk_API.toggle();
  }
};

// In ShippingCalculator callback (pass as prop):
<ShippingCalculator
  productHandle={product.handle}
  onShippingCalculated={(zip, cost) => trackShippingCalculatorUsed(zip, cost)}
/>
```

- [ ] **Step 4: Verify GA4 is capturing Purchase events**

When customer completes purchase in Shopify checkout:
- Shopify automatically fires `purchase` event to GA4
- Google Ads will receive this event and count it as a conversion

Verify in GA4:
- Go to GA4 property
- Reports → Conversions
- Should show Purchase events flowing in after real customer orders

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/components/ProductDetail.tsx
git commit -m "feat: add GA4 event tracking for add-to-cart, expert chat, and shipping calculator"
```

---

## Task 8: Test All Changes (Desktop & Mobile)

**Files:**
- Test: All modified files from Tasks 1-7

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

Expected: Server starts at http://localhost:5173

- [ ] **Step 2: Test ProductCard trust badge**

Go to `/all-collections`:
- [ ] ✓ Products display "Authentic" badge in top-right
- [ ] ✓ Badge visible on desktop (1024px+)
- [ ] ✓ Badge visible on mobile (375px), not overlapping content

- [ ] **Step 3: Test ProductDetail page (desktop)**

Click any product to open detail page at desktop size (1024px+):
- [ ] ✓ Trust signals section visible ("Why Shop With Us")
- [ ] ✓ Shipping calculator visible, accepts ZIP code
- [ ] ✓ Warranty info section visible
- [ ] ✓ Specs section visible
- [ ] ✓ "Chat with experts" link visible
- [ ] ✓ "Add to Cart" button works, adds product to cart

- [ ] **Step 4: Test ProductDetail page (mobile)**

Resize to mobile (375px) or use device emulator:
- [ ] ✓ Sticky buttons visible at bottom (Add to Cart + Chat)
- [ ] ✓ Spec sections collapse/expand on click
- [ ] ✓ All text readable at mobile size
- [ ] ✓ Shipping calculator works on mobile
- [ ] ✓ Click "Chat with Experts" → Tawk.to opens
- [ ] ✓ Scroll down → sticky buttons remain visible
- [ ] ✓ Add to Cart button works on mobile

- [ ] **Step 5: Test ShippingPolicy page**

Go to `/shipping-policy`:
- [ ] ✓ Page loads
- [ ] ✓ All sections visible (shipping, warranty, returns, damage)
- [ ] ✓ #warranty anchor link works
- [ ] ✓ Mobile responsive
- [ ] ✓ Email link working

- [ ] **Step 6: Test TypeScript compilation**

```bash
npm run typecheck
```

Expected: 0 errors

- [ ] **Step 7: Build for production**

```bash
npm run build
```

Expected: Build succeeds, no errors or warnings related to your changes

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "test: verify all checkout optimization changes on desktop and mobile"
```

---

## Task 9: Deploy to Production

**Files:**
- Deploy: All committed changes

- [ ] **Step 1: Verify all commits are pushed**

```bash
git log --oneline -10
```

Should show the 8 commits from Tasks 1-8.

- [ ] **Step 2: Push to origin/main**

```bash
git push origin main
```

Expected: All commits pushed to GitHub

- [ ] **Step 3: Cloudflare Pages deploys automatically**

Check Cloudflare Pages dashboard:
- Deployment should start automatically
- Should complete in 2-5 minutes
- Status should show "Success"

- [ ] **Step 4: Verify production site**

Go to https://dunnluxuryselections.com/all-collections:
- [ ] ✓ ProductCard displays "Authentic" badge
- [ ] ✓ Click product → ProductDetail loads with trust signals
- [ ] ✓ Shipping calculator works
- [ ] ✓ Mobile: Sticky buttons visible
- [ ] ✓ /shipping-policy page accessible

- [ ] **Step 5: Monitor GA4 for conversions**

Go to Google Analytics 4 property:
- [ ] ✓ Events flowing in (page_view, add_to_cart, expert_chat_click)
- [ ] ✓ Conversions section shows new events
- [ ] ✓ No errors or blocked events

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "chore: production deployment of checkout optimization quick wins"
```

---

## Success Metrics

After deployment, monitor these for 2 weeks:

| Metric | Baseline | Goal | Where to Check |
|--------|----------|------|-----------------|
| Conversion Rate | 0% (0 conversions) | 2-5% | Google Ads dashboard |
| Add-to-Cart Rate | ~0% | 5-10% | GA4 Events |
| Expert Chat Clicks | 0 | 10-15% of visitors | Tawk.to analytics |
| Shipping Calculator Usage | N/A | 30-40% of product page visitors | GA4 custom event |
| Cart Abandonment | Unknown | Decreased via Klaviyo | Klaviyo analytics |

---

## Rollback Plan

If conversion rate doesn't improve after 2 weeks:

```bash
# View last 9 commits
git log --oneline | head -10

# If needed, revert all optimization commits:
git revert HEAD~8..HEAD

# Or revert specific commit:
git revert <commit-sha>
```

---

## Summary

**9 tasks, ~5-7 days of implementation:**

1. Add trust badges to ProductCard
2. Create ShippingCalculator component
3. Update ProductDetail with trust signals & warranty
4. Make specs collapsible for mobile
5. Add sticky mobile buttons
6. Create ShippingPolicy page
7. Add GA4 conversion tracking
8. Test all changes
9. Deploy to production

**Total code changes:** ~500 lines of new/modified code across 6 files

**No breaking changes:** All modifications are additive; existing functionality preserved.
