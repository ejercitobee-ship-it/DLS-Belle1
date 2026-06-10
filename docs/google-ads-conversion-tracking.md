# Google Ads Conversion Tracking — Shopify Custom Pixel Setup

## Why this exists

The storefront (dunnluxuryselections.com) redirects to Shopify hosted checkout
(`luxury-dunn-selections.myshopify.com`). After payment, **Shopify does NOT
redirect customers back to our site** — the `return_url` param in
`Checkout.tsx` is ignored by Shopify. Customers finish on Shopify's Thank You
page, so conversion code in `OrderConfirmation.tsx` never runs for real
purchases.

The fix: a **Shopify Custom Pixel** that fires the Google Ads conversion on
Shopify's own Thank You page, where the customer actually lands.

## Setup (one-time, ~5 minutes)

1. Open **Shopify admin → Settings → Customer events**
   (https://admin.shopify.com/store/luxury-dunn-selections/settings/customer_events)
2. Click **Add custom pixel**, name it `Google Ads + GA4 Conversions`
3. Under Permission, choose **Not required** (or align with your consent setup)
4. Paste the code below, click **Save**, then **Connect**

## Pixel code

```js
// Google Ads + GA4 conversion tracking for Shopify checkout
// Conversion IDs (keep in sync with index.html on the storefront)
const AW_ID = 'AW-17833894840';
const AW_LABEL = 'LxbdCPIH-7QcELjH7rdC';
const GA4_ID = 'G-BG9K5QSYQQ';

const script = document.createElement('script');
script.async = true;
script.src = 'https://www.googletagmanager.com/gtag/js?id=' + AW_ID;
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', AW_ID, { allow_enhanced_conversions: true });
gtag('config', GA4_ID);

analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  const orderId = checkout.order?.id || checkout.token;
  const value = parseFloat(checkout.totalPrice?.amount) || 0;
  const currency = checkout.currencyCode || 'USD';

  // Enhanced conversions: lets Google attribute the conversion to the ad
  // click by email match, which survives the cross-domain hop.
  if (checkout.email) {
    gtag('set', 'user_data', { email: checkout.email });
  }

  console.log('🔥 DLS pixel: firing conversion', { orderId, value, currency });

  gtag('event', 'conversion', {
    send_to: AW_ID + '/' + AW_LABEL,
    value: value,
    currency: currency,
    transaction_id: orderId,
  });
  console.log('✅ DLS pixel: Google Ads conversion sent');

  gtag('event', 'purchase', {
    send_to: GA4_ID,
    transaction_id: orderId,
    value: value,
    currency: currency,
    items: (checkout.lineItems || []).map((li) => ({
      item_id: li.variant?.product?.id || li.id,
      item_name: li.title,
      price: parseFloat(li.variant?.price?.amount) || 0,
      quantity: li.quantity,
    })),
  });
  console.log('✅ DLS pixel: GA4 purchase sent');
});
```

## Deduplication

Both the pixel and `OrderConfirmation.tsx` send `transaction_id`. Google Ads
("one conversion per transaction_id") and GA4 dedupe on it, so if a customer
ever lands on both pages, the order is counted once.

## How to test

1. Place a test order (Shopify admin → Settings → Payments → enable test mode
   with the Bogus Gateway, card number `1`).
2. On the Shopify **Thank You page**, open DevTools:
   - **Console:** look for `🔥 DLS pixel: firing conversion` and the two ✅ lines
     (pixel logs may appear under a sandboxed `web-pixel` context).
   - **Network:** filter `googleadservices` — expect
     `GET googleadservices.com/pagead/conversion/17833894840/?...label=LxbdCPIH-7QcELjH7rdC&value=...` → 200.
3. In Google Ads → Goals → Conversions → Purchase: status should leave
   "Needs attention" within ~24h; conversions appear with ~3h delay.
4. Turn test mode OFF afterwards.

## Enhanced conversions (recommended)

In Google Ads → the Purchase conversion action → Settings → turn ON
**Enhanced conversions** → "Google tag". The pixel already sends hashed email
via `gtag('set', 'user_data', ...)`, which recovers attribution lost in the
cross-domain redirect (the gclid cookie does not follow the customer from
dunnluxuryselections.com to the myshopify.com checkout).
