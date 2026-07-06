# Analytics & Tracking Setup Guide

## Overview

This Shopify Liquid theme includes comprehensive analytics tracking for Google Analytics 4 (GA4), Google Ads, and Shopify Custom Pixels. This guide walks through setup, configuration, and monitoring.

## Components

### 1. Google Tag Manager (GTM)
- **Purpose**: Centralized tag management
- **Tag ID**: `GTM-55VCHDDF`
- **Location**: `sections/analytics-gtag.liquid`
- **Status**: Ready to use

### 2. Google Analytics 4 (GA4)
- **Purpose**: Event tracking, user behavior, conversion analysis
- **ID**: `G-BG9K5QSYQQ`
- **Included with**: Google Tag `GT-55VCHDDF`
- **Status**: Ready to use

### 3. Google Ads Conversion Tracking
- **Purpose**: Track conversions, optimize campaigns, measure ROI
- **Account ID**: `AW-17833894840`
- **Status**: Requires configuration (see Shopify Custom Pixel setup)

### 4. Shopify Custom Pixel
- **Purpose**: Track purchases directly from Shopify checkout
- **Status**: Requires manual setup in Shopify Admin
- **Reference**: `docs/SHOPIFY-CUSTOM-PIXEL-SETUP.md`

### 5. Event Tracking Snippets
- **Purpose**: Track user interactions (clicks, searches, form submissions)
- **Location**: `snippets/analytics-events.liquid`
- **Status**: Ready to use

## Quick Start

### Step 1: Include Analytics in Theme

The analytics code should be added to `layout/theme.liquid` in the `<head>` section:

```liquid
<!-- Include in layout/theme.liquid <head> -->
{% section 'analytics-gtag' %}

<!-- Include before </body> tag for event tracking -->
{% include 'analytics-events' %}
```

### Step 2: Configure Shopify Custom Pixel

1. Go to Shopify Admin → **Settings** → **Customer events**
2. Click **Create custom pixel**
3. Paste code from `docs/SHOPIFY-CUSTOM-PIXEL-SETUP.md`
4. Add your Google Ads conversion label
5. Click **Save**

### Step 3: Verify in Google Ads

1. Go to **Google Ads** → **Conversions**
2. Create conversion action: `type: Purchase`
3. Copy conversion label (format: `AW-ACCOUNT_ID/LABEL`)
4. Add label to Custom Pixel code
5. Test with a test purchase

### Step 4: Monitor in Google Analytics

1. Go to **Google Analytics 4** → **Realtime**
2. Make a test purchase
3. Verify purchase event shows up within 30 seconds
4. Check event properties are correct

## Events Tracked

### Commerce Events

| Event | Trigger | Properties |
|-------|---------|-----------|
| `view_item` | Product page loads | Product ID, name, price, category |
| `add_to_cart` | User clicks "Add to Cart" | Product ID, name, price, quantity |
| `view_cart` | Cart page loads | Cart total, item count |
| `begin_checkout` | User clicks "Checkout" | Cart total, item count |
| `purchase` | Order confirmed | Order ID, total, items, shipping, tax |

### Engagement Events

| Event | Trigger | Properties |
|-------|---------|-----------|
| `page_view` | Page loads | Page path, title |
| `search` | User submits search | Search term, result count |
| `form_submit` | Form submitted | Form name, type |
| `newsletter_signup` | Newsletter form submitted | Email (optional) |
| `click` | User clicks tracked element | Element type, label |

### Custom Events

| Event | Trigger | Properties |
|-------|---------|-----------|
| `filter_product` | User filters products | Filter type, value |
| `sort_product` | User sorts products | Sort method |
| `view_item_list` | Collection loads | Collection name |

## Implementation Details

### Adding Event Tracking to Elements

#### Track Clicks
```liquid
<a href="/shop" data-track="shop_click" data-track-label="Shop Now">Shop</a>
```

#### Track Form Submission
```liquid
<form data-track-form="contact_form">
  <input type="email" name="email">
  <button type="submit">Send</button>
</form>
```

#### Track Newsletter Signup
```liquid
<form data-track-newsletter>
  <input type="email" name="email" placeholder="Enter your email">
  <button>Subscribe</button>
</form>
```

#### Track Custom Events in JavaScript
```javascript
// Track custom event
track('custom_event', {
  category: 'engagement',
  label: 'event_label',
  value: 100
});

// Track product interaction
trackAddToCart('123', 'Product Name', 99.99);

// Track search
trackSearch('premium humidors', 12);
```

## Configuration Files

### Main Analytics Configuration
**File**: `sections/analytics-gtag.liquid`

**Contains**:
- Google Tag Manager code
- GA4 and Google Ads initialization
- Product view tracking
- Add-to-cart event tracking
- Order confirmation tracking

**Key IDs**:
```
GA4 ID: GT-55VCHDDF (Google Tag - combines GA4 + Ads)
Google Ads Account: AW-17833894840
GA4 Property: G-BG9K5QSYQQ
```

### Event Tracking Snippet
**File**: `snippets/analytics-events.liquid`

**Contains**:
- JavaScript analytics helper object
- Auto-tracking for data-track attributes
- Product-specific tracking
- Collection-specific tracking
- Cart and order tracking

**Include in**: `layout/theme.liquid` (before `</body>`)

### Shopify Custom Pixel
**File**: `docs/SHOPIFY-CUSTOM-PIXEL-SETUP.md`

**Contains**:
- Setup instructions
- Custom pixel JavaScript code
- Conversion label configuration
- Troubleshooting guide

**Setup in**: Shopify Admin → Settings → Customer events

## Monitoring & Troubleshooting

### Verify Tracking is Working

1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Filter by "google-analytics"**
4. **Perform action** (view product, add to cart)
5. **Verify requests appear** to `www.google-analytics.com`

### Check Real-Time Data

**Google Analytics**:
1. Reports → Realtime → Overview
2. Perform action on website
3. Verify event shows up within 30 seconds

**Google Ads**:
1. Conversions
2. Select conversion action
3. Check "Conversion Details" panel

### Common Issues

#### No data in GA4
- **Check**: Is gtag() being called?
- **Fix**: Verify `sections/analytics-gtag.liquid` is included in theme
- **Test**: Console → `typeof gtag` should return "function"

#### Conversions not showing in Google Ads
- **Check**: Is conversion label correct?
- **Fix**: Copy exact label from Google Ads conversion settings
- **Check**: Is Custom Pixel enabled in Shopify Admin?
- **Fix**: Settings → Customer events → Verify pixel is ON

#### Double-counting conversions
- **Check**: Are both Custom Pixel AND gtag code firing?
- **Fix**: Remove duplicate conversion tracking
- **Use**: Shopify Custom Pixel is the primary method

#### Missing product data
- **Check**: Are product properties populated?
- **Fix**: Verify product variables in theme Liquid
- **Test**: View product page, check DevTools Network tab

## Best Practices

### DO ✅
- Set up Custom Pixel for purchases (Shopify's preferred method)
- Include `analytics-gtag` section in theme
- Include `analytics-events` snippet before `</body>`
- Monitor GA4 real-time dashboard daily
- Document conversion label in your records
- Test tracking with test orders
- Review conversion data weekly

### DON'T ❌
- Add gtag code directly in checkout (Shopify doesn't allow it)
- Use both gtag and Custom Pixel for same event (causes duplicates)
- Delete events in GA4 (deletes historical data)
- Change Google Ads account IDs without updating code
- Ignore conversion tracking setup
- Test with invalid traffic

## Data Retention & Privacy

### Google Analytics
- **Event data**: Retained for 14 months
- **User data**: Anonymized after 14 months
- **Deletion**: Data can't be recovered once deleted

### Google Ads
- **Conversion data**: Retained for 36 months
- **Click data**: Retained for 24 months
- **Privacy**: Conversions are aggregated (no PII)

### Shopify
- **Customer data**: Governed by Shopify's Privacy Policy
- **Order data**: Available for 2 years
- **GDPR compliance**: Use Shopify's data export/deletion tools

## Conversion Labeling Strategy

### Recommended Conversion Labels

1. **Purchase** (Primary)
   - `AW-17833894840/H0osCMD0pP0QErSCsesC` (example)
   - Track all completed orders

2. **High-Value Purchase** (Secondary)
   - Create separate label for orders > $1,500
   - Track financing-eligible purchases
   - Use in bid adjustments

3. **Newsletter Signup** (Optional)
   - Track email capture events
   - Useful for list-building campaigns

4. **Financing Interest** (Optional)
   - Track users who view financing page
   - Segment high-intent audiences

### Configure in Google Ads

1. Go to **Conversions** (left menu)
2. Click **+ New conversion action**
3. Choose: **Purchase (value tracking)**
4. Setup: Website → Manually track
5. Add category tags (e.g., "sales", "high-value")
6. Set **Conversion window**: 30 days (standard)
7. Save conversion

## Advanced Tracking

### Track Payment Method
```liquid
{% if checkout.payment_method %}
  <script>
    gtag('event', 'payment_method_selected', {
      'payment_method': '{{ checkout.payment_method.name }}'
    });
  </script>
{% endif %}
```

### Track Financing Selection
```liquid
<script>
  document.addEventListener('click', function(e) {
    if (e.target.dataset.financingOption) {
      track('financing_selected', {
        'option': e.target.dataset.financingOption,
        'category': 'financing'
      });
    }
  });
</script>
```

### Custom Revenue Attribution
```liquid
{% if product.price > 150000 %}
  <script>
    gtag('event', 'high_value_product_view', {
      'value': {{ product.price | divided_by: 100.0 }},
      'currency': 'USD'
    });
  </script>
{% endif %}
```

## Support & Resources

- **Google Analytics Help**: https://support.google.com/analytics
- **Google Ads Help**: https://support.google.com/google-ads
- **Shopify Custom Pixel Docs**: https://help.shopify.com/manual/customer-events
- **DLS-Belle1 Setup**: See `CLAUDE.md` in project root

## Next Steps

1. ✅ Include analytics sections in theme.liquid
2. ✅ Set up Shopify Custom Pixel
3. ✅ Configure Google Ads conversion labels
4. ✅ Monitor real-time data for 24 hours
5. ✅ Review conversion data after first week
6. ✅ Optimize Google Ads campaigns based on data
