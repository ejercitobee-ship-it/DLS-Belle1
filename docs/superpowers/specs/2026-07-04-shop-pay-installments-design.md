# Shop Pay Installments Integration Design

**Date:** 2026-07-04  
**Project:** DLS-Belle1 Headless Storefront  
**Goal:** Restore Shop Pay Installments payment option for high-ticket humidor sales

---

## Executive Summary

Shop Pay Installments (4 interest-free payments) worked on the legacy Shopify storefront and is confirmed working on the Shop app. After migrating to a headless storefront, the feature disappeared. This design restores it by:

1. **Phase 1 (COMPLETE):** Add missing Shopify Shop Pay OAuth credentials to Cloudflare
2. **Phase 2 (ACTIVE):** Debug and fix the cart payload structure to match Shopify's installments eligibility requirements
3. **Phase 3 (PENDING):** End-to-end testing and production deployment

---

## Problem Statement

- **Symptom:** Customers click "Shop Pay" button, redirect to Shopify checkout works (no 401 error), but "Pay in full or in installments" option doesn't appear in the Shop Pay payment section
- **Impact:** High-value customers ($3K+) lose financing option, potentially reducing conversion rate
- **Why it's broken:** Cart payload sent from headless app is missing required data fields or flags that trigger Shopify's installments eligibility check
- **Evidence:** Feature works in native Shop app (proves store is eligible), fails only on headless checkout (data structure issue)

---

## Root Cause Analysis

Shopify's Shop Pay Installments engine performs dynamic eligibility checks on the cart before showing the financing option:

1. **Inventory Status Check:** All items must have `availableForSale: true`
2. **Currency/Market Validation:** `countryCode` and `buyerIdentity.countryCode` must match exactly (US/USD, CA/CAD, UK/GBP)
3. **Cart Value Threshold:** Total must be between $35–$30,000 USD (your humidors at $500–$3,500 are perfect)
4. **Fraud Pre-Check:** Affirm backend must be able to reach customer via CSP/CORS (no blocks to affirm.com or pay.shopify.com)

**Current issue:** The headless checkout likely fails step 1 or 2 — either:
- Cart query doesn't include `availableForSale` field for variants
- Or `countryCode` / `buyerIdentity` don't match the Shopify backend expectation

---

## Solution Architecture

### Phase 1: Credentials ✅ (COMPLETE)

**Status:** Shopify Shop Pay OAuth credentials added to Cloudflare
- `SHOPIFY_SHOP_PAY_CLIENT_ID`: `[REMOVED]`
- `SHOPIFY_SHOP_PAY_SECRET`: `[REMOVED]`

**Result:** Shop Pay redirect now works (no 401 errors)

### Phase 2: Cart Payload Debug (ACTIVE)

**Objective:** Identify which Shopify eligibility check is failing and fix the cart query/payload

**Investigation Steps:**
1. Check cart GraphQL query in `src/lib/shopify.ts` — does it request `availableForSale` on variants?
2. Verify `country` / `countryCode` in `buyerIdentity` matches `US`
3. Check browser DevTools → Network → look for Affirm API calls (`affirm.com`) during checkout — are they blocked by CSP?
4. Add logging to capture the exact cart payload being sent to Shopify

**Success Criteria:**
- Installments option appears in Shop Pay payment section
- User can select "Pay in full or in installments"
- Can proceed through checkout with installments option selected

### Phase 3: Test & Deploy (PENDING)

**Local Testing:**
1. Add $3K+ humidor to cart
2. Checkout → Shop Pay → Verify installments option appears
3. Complete test payment with installments selected
4. Verify return to order confirmation page

**Production Deployment:**
1. Push changes to git
2. Cloudflare auto-builds and deploys
3. Test on live site: https://dunnluxuryselections.com
4. Rollback plan: Revert commit if issues arise

---

## Technical Details

### Cart Query Requirements

The `cartCreate` or `cartLinesAdd` GraphQL query must include:

```graphql
{
  cart {
    lines {
      merchandise {
        __typename
        ... on ProductVariant {
          id
          availableForSale  # ← CRITICAL: Must be present
          priceV2 {
            amount
            currencyCode
          }
        }
      }
    }
    buyerIdentity {
      countryCode    # ← CRITICAL: Must be "US"
      email
    }
  }
}
```

### Cart Payload Structure

When submitting to Shop Pay session creation, ensure:
```json
{
  "paymentRequest": {
    "lineItems": [
      {
        "label": "Product Name",
        "amount": "3500.00",
        "quantity": 1
      }
    ],
    "subtotalAmount": "3500.00",
    "totalAmount": "3650.00",
    "currencyCode": "USD",
    "countryCode": "US"
  },
  "sourceIdentifier": "dunn-${timestamp}-${random}"
}
```

### Files to Investigate

- `src/lib/shopify.ts` — Check `cartCreate()`, `cartLinesAdd()` queries
- `src/context/CartContext.tsx` — Verify `buyerIdentity.countryCode` is set correctly
- `functions/api/shop-pay-session.ts` — Log payload being sent to Shopify
- `public/_headers` — CSP rules must allow `affirm.com` and `pay.shopify.com`

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Cart payload still fails eligibility check | Debug using network logs; verify against Shopify API docs |
| Installments don't appear after fix | Check Shopify store settings confirm installments are enabled |
| Affirm fraud-check blocked by CSP | Review security headers; allow `affirm.com` if blocked |
| Deployment breaks existing checkout | Local testing first; rollback commit if issues arise |

---

## Success Criteria

- ✅ Installments option visible in Shop Pay payment section
- ✅ User can select "Pay in full or in installments"
- ✅ Checkout completes without errors
- ✅ Return to order confirmation page works
- ✅ Works on both local dev and production

---

## Timeline

- **Phase 1:** ✅ Complete (credentials added)
- **Phase 2:** Today (debug cart payload)
- **Phase 3:** Today (test & deploy)

---

## Rollback Plan

If production deployment breaks anything:
1. Git revert last commit: `git revert HEAD`
2. Push to main: `git push origin main`
3. Cloudflare auto-rebuilds (2–3 min)
4. Site reverts to previous working state

---

## Appendix: Shopify Installments Documentation

- Shop Pay eligibility: https://help.shopify.com/en/manual/payments/shop-pay/shop-pay-installments
- Storefront API requirements: https://shopify.dev/docs/api/storefront
- CSP header configuration: https://shopify.dev/docs/api/admin-rest/latest#top
