# Shopify Custom Pixel Configuration

## Overview

Shopify Custom Pixels allow you to track customer events (purchases, add-to-cart, etc.) and send them to external analytics platforms. This is the **recommended method** for tracking purchases in a Shopify theme because the checkout happens on Shopify's hosted domain.

## Setup Steps

### 1. Create Custom Pixel in Shopify Admin

1. Go to **Settings** → **Customer events**
2. Click **Add app or custom code**
3. Click **Create custom pixel**
4. Name it: `Google Analytics Purchase Tracking`
5. Add the pixel code (see below)
6. Click **Save**

### 2. Google Analytics Purchase Pixel Code

```javascript
// Google Analytics Purchase Tracking Pixel
export default function initialize(data) {
  window.dataLayer = window.dataLayer || [];

  // Detect purchase event
  if (data.event.type === 'purchase') {
    const purchase = data.event.data.checkout;

    // Fire Google Analytics purchase event
    window.gtag('event', 'purchase', {
      'transaction_id': purchase.order.id,
      'affiliation': 'Dunn Luxury Selections',
      'value': purchase.subtotalPrice.amount,
      'currency': purchase.subtotalPrice.currency,
      'tax': purchase.totalTax.amount,
      'shipping': purchase.shippingLine?.price?.amount || 0,
      'items': purchase.lineItems.map(item => ({
        'item_id': item.variant.product.id,
        'item_name': item.variant.product.title,
        'item_category': item.variant.product.productType,
        'price': item.variant.price.amount,
        'quantity': item.quantity
      }))
    });

    // Fire Google Ads conversion event
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17833894840/CONVERSION_LABEL',
      'transaction_id': purchase.order.id,
      'value': purchase.subtotalPrice.amount,
      'currency': purchase.subtotalPrice.currency
    });

    console.log('Purchase tracked:', purchase.order.id);
  }

  // Track other events
  if (data.event.type === 'add_to_cart') {
    const item = data.event.data.cartLine;
    window.gtag('event', 'add_to_cart', {
      'currency': item.cost.totalAmount.currency,
      'value': item.cost.totalAmount.amount,
      'items': [{
        'item_id': item.merchandise.product.id,
        'item_name': item.merchandise.product.title,
        'price': item.merchandise.price.amount,
        'quantity': item.quantity
      }]
    });
  }

  // Publish custom metrics
  data.publisheEvent({
    'name': data.event.type,
    'data': {
      'timestamp': new Date().toISOString(),
      'eventType': data.event.type
    }
  });

  return true;
}
```

### 3. Add Conversion Label

The conversion label `CONVERSION_LABEL` in the code above must be replaced with your actual Google Ads conversion label:

1. Go to Google Ads → **Conversions** (left menu)
2. Select your conversion action
3. Copy the **Conversion ID** and **Label**
4. Format: `AW-ACCOUNT_ID/CONVERSION_LABEL`
5. Current label (July 2026): `AW-17833894840/LxbdCPIH-7QcELjH7rdC` — labels have been rotated before; verify against Google Ads before pasting

### 4. Add gtag() Function to Theme

The custom pixel calls `window.gtag()`, so you need to ensure gtag is available globally. Add to `layout/theme.liquid`:

```liquid
<script async src="https://www.googletagmanager.com/gtag/js?id=GT-55VCHDDF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GT-55VCHDDF');
  gtag('config', 'AW-17833894840');
</script>
```

## Event Types Tracked

### Purchase Event
Fires when customer completes checkout:
- Transaction ID
- Total amount
- Currency
- Tax and shipping
- Line items with prices

### Add-to-Cart Event
Fires when item added to cart:
- Item ID and name
- Price and quantity
- Cart total

### Custom Events
Additional events can be tracked:
- Page views
- Search queries
- Newsletter signups
- Contact form submissions

## Troubleshooting

### Conversions not showing in Google Ads

1. **Verify conversion label is correct**
   - Check Google Ads admin for the exact label
   - Format must be: `AW-ACCOUNT_ID/LABEL`

2. **Check conversion tracking status**
   - Google Ads → Conversions → Select conversion
   - Status should show "Recording conversions"

3. **Verify gtag code is firing**
   - Open browser console
   - Look for `window.gtag` being called
   - Check Network tab for requests to `www.google-analytics.com`

4. **Check for conflicts**
   - Ensure no other pixel code is calling gtag with conflicting config
   - Multiple gtag configs should be added sequentially

### Events showing in GA but not in Google Ads

1. **Ensure Google Ads account is linked to GA4**
   - GA4 Settings → Data Collection → Link Property

2. **Verify conversion ID is correct**
   - Copy exact ID from Google Ads, not UA property

3. **Check conversion window**
   - Google Ads conversion window is typically 30 days
   - Recent conversions may not show immediately

### Custom Pixel not firing

1. **Enable in Shopify Admin**
   - Settings → Customer events
   - Verify pixel is enabled (toggle on)

2. **Check console for errors**
   - Open Chrome DevTools
   - Check Console tab after purchase
   - Look for JavaScript errors

3. **Verify gtag() is defined**
   - In console: `typeof window.gtag`
   - Should return `"function"`

## Monitoring

### Google Analytics Real-Time Dashboard
- Settings → Events → In real-time view
- Verify purchase events appear within seconds of checkout

### Google Ads Conversion Tracking
- Ads.google.com → Conversions
- Check "Conversion Value" chart
- Verify daily conversion count

### Shopify Analytics
- Shopify Admin → Analytics → Reports
- View conversion data, ROI, and customer insights

## Important Notes

1. **Checkout is on Shopify's domain**: Purchases happen on `checkout.shopify.com` or `shop.myshopify.com`, not your main domain. The Custom Pixel is the correct way to track these.

2. **First-party cookies**: Analytics uses first-party cookies on your domain, plus Shopify's cookies on checkout domain.

3. **Conversion window**: Google Ads has a 30-day conversion window. Set it properly in conversion settings.

4. **Data retention**: GA4 retains event data for 14 months by default.

## Best Practices

✅ **DO:**
- Add purchase pixel early in setup
- Use Custom Pixel for all Shopify events
- Monitor conversion data daily in first week
- Set up alerts for anomalies
- Document conversion labels clearly

❌ **DON'T:**
- Add tracking code directly in checkout (Shopify doesn't allow custom JS in checkout)
- Use both Custom Pixel and gtag calls for same events (causes duplicates)
- Change conversion labels without updating pixel code
- Delete events in GA (they're tied to historical data)

## References

- [Shopify Custom Pixel Documentation](https://help.shopify.com/en/manual/customer-events)
- [Google Analytics 4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Google Ads Conversion Tracking](https://support.google.com/google-ads/answer/1722054)
- [DLS-Belle1 CLAUDE.md](../CLAUDE.md) - Tracking configuration notes
