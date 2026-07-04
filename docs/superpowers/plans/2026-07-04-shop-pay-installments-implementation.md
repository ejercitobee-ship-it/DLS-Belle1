# Shop Pay Installments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the "Pay in full or in installments" option in Shop Pay checkout by fixing the cart payload structure to meet Shopify's eligibility requirements.

**Architecture:** Investigate current cart GraphQL query → verify it includes `availableForSale` field on variants → ensure `buyerIdentity.countryCode` is set to "US" → add logging to capture actual payload → test locally → deploy to production.

**Tech Stack:** TypeScript, GraphQL (Shopify Storefront API), React Context, Cloudflare Workers

---

## File Structure

**Files to Modify:**
- `src/lib/shopify.ts` — CartCreate and CartLinesAdd GraphQL queries (add `availableForSale` field)
- `src/context/CartContext.tsx` — Verify `buyerIdentity.countryCode` is set correctly
- `functions/api/shop-pay-session.ts` — Add console.log statements for debugging

**No new files needed** — this is a fix to existing functionality.

---

### Task 1: Verify Current Cart Query Structure

**Files:**
- Read: `src/lib/shopify.ts:1-100` (find cartCreate function)

- [ ] **Step 1: Open src/lib/shopify.ts and locate the cartCreate function**

Run: `grep -n "cartCreate\|cartLinesAdd" src/lib/shopify.ts`

This will show you where the cart creation queries are defined. Look for GraphQL query strings that define the cart structure.

- [ ] **Step 2: Check if the ProductVariant query includes availableForSale**

In the `cartCreate` and `cartLinesAdd` GraphQL queries, find the ProductVariant section. It should look like:

```graphql
... on ProductVariant {
  id
  title
  availableForSale    # ← THIS MUST BE PRESENT
  priceV2 {
    amount
    currencyCode
  }
}
```

Look for the word `availableForSale` in the variant query. If it's missing, note this.

- [ ] **Step 3: Document findings**

Create a note of:
- Does `availableForSale` exist in the variant query? (yes/no)
- Approximate line number where it is (or should be)
- Any other fields that look unusual or missing

---

### Task 2: Add availableForSale Field to Cart Query (if missing)

**Files:**
- Modify: `src/lib/shopify.ts` (cartCreate GraphQL query)

- [ ] **Step 1: Find the cartCreate function in src/lib/shopify.ts**

Look for a function or constant that defines the `cartCreate` mutation. It will contain a GraphQL query string with `mutation CreateCart`.

- [ ] **Step 2: Locate the ProductVariant fragment within the query**

Inside the query, find where `ProductVariant` fields are defined. It should be nested under `merchandise` or similar.

- [ ] **Step 3: Add availableForSale field if missing**

If `availableForSale` is NOT present, add it to the variant fragment:

```graphql
... on ProductVariant {
  id
  title
  availableForSale    # ← Add this line
  priceV2 {
    amount
    currencyCode
  }
}
```

Exact location depends on your current query structure. Find the variant section and add the line after `title` or `id`.

- [ ] **Step 4: Do the same for cartLinesAdd mutation**

Find the `cartLinesAdd` mutation in the same file and add `availableForSale` to its ProductVariant fragment using the same pattern.

- [ ] **Step 5: Commit**

```bash
git add src/lib/shopify.ts
git commit -m "fix: add availableForSale to cart GraphQL queries for Shop Pay Installments eligibility"
```

---

### Task 3: Verify buyerIdentity.countryCode is Set to "US"

**Files:**
- Read: `src/context/CartContext.tsx:1-150` (find where buyerIdentity is set)

- [ ] **Step 1: Open src/context/CartContext.tsx and search for buyerIdentity**

Run: `grep -n "buyerIdentity\|countryCode" src/context/CartContext.tsx`

This shows where buyer identity is configured.

- [ ] **Step 2: Locate where the cart is created with buyerIdentity**

Find the `cartCreate` function call in CartContext. It should look something like:

```typescript
const cart = await cartCreate({
  buyerIdentity: {
    countryCode: "US",  // ← MUST BE HERE
    email: userEmail
  },
  lines: [...]
});
```

Check if `countryCode: "US"` is explicitly set. If it's missing or set to something else, note this.

- [ ] **Step 3: If countryCode is missing, add it**

If `buyerIdentity` exists but `countryCode` is missing, add it:

```typescript
const cart = await cartCreate({
  buyerIdentity: {
    countryCode: "US",  // ← Add this line
    email: userEmail,
  },
  lines: [...]
});
```

- [ ] **Step 4: Verify the type definition for buyerIdentity**

Search for the CartCreate type or interface definition (also in shopify.ts likely). Ensure it accepts `countryCode`. It should look like:

```typescript
interface CreateCartInput {
  buyerIdentity: {
    countryCode?: string;
    email?: string;
  };
  lines: CartLine[];
}
```

If `countryCode` isn't in the type, add it.

- [ ] **Step 5: Commit**

```bash
git add src/context/CartContext.tsx src/lib/shopify.ts
git commit -m "fix: ensure buyerIdentity.countryCode is set to US for Shop Pay Installments"
```

---

### Task 4: Add Logging to Debug Cart Payload

**Files:**
- Modify: `functions/api/shop-pay-session.ts` (add console.log before Shopify API call)

- [ ] **Step 1: Open functions/api/shop-pay-session.ts and find where the payload is prepared**

Look for the line where `variables` is created. It should look like:

```typescript
const variables = {
  input: {
    paymentRequest: { ... },
    sourceIdentifier,
  },
};
```

- [ ] **Step 2: Add console.log to see the exact payload being sent**

Right before the Shopify API call (before `fetch(shopifyUrl, ...)`), add:

```typescript
console.log('Shop Pay session payload:', JSON.stringify(variables, null, 2));
console.log('Payment request:', JSON.stringify(paymentRequest, null, 2));
console.log('Country code:', paymentRequest.countryCode);
console.log('Currency code:', paymentRequest.currencyCode);
```

This will print the exact payload to Cloudflare logs so you can verify it has the right structure.

- [ ] **Step 3: Commit**

```bash
git add functions/api/shop-pay-session.ts
git commit -m "debug: add logging to Shop Pay session payload for troubleshooting"
```

---

### Task 5: Test Locally - Add Item and Check Shop Pay

**Files:**
- No files modified; test only

- [ ] **Step 1: Start local dev server**

```bash
npm run dev
```

Expected: Vite server runs on localhost:5173

- [ ] **Step 2: Open browser to localhost:5173**

Navigate to any product page (e.g., Desktop Humidors)

- [ ] **Step 3: Add $3,500+ item to cart**

Click "Add to Cart" on the Humidor Supreme ($3,500) or any high-value item.

- [ ] **Step 4: Go to Checkout**

Click the cart icon → "Checkout" button

- [ ] **Step 5: Fill in customer details and shipping**

- Email: test@example.com
- Address: any US address
- Shipping: select Standard

- [ ] **Step 6: Click "Shop Pay" button**

This should redirect to shop.app/checkout/...

- [ ] **Step 7: Scroll to Payment section and verify "Pay in full or in installments" appears**

Expected: In the "Plan" section, you should see:
- ✅ "Pay now" (radio button)
- ✅ "Pay in monthly installments" (radio button) ← **THIS IS THE GOAL**

If installments option appears → Success! ✅
If NOT → Check Cloudflare logs for the console.log output from Task 4 and review the payload structure.

---

### Task 6: Check Cloudflare Logs for Payload (if installments still missing)

**Files:**
- No files modified; debugging only

- [ ] **Step 1: Go to Cloudflare Dashboard → Workers & Pages → dls-belle1 → Real-time logs**

- [ ] **Step 2: Trigger the Shop Pay session creation again (run Task 5 step 6 again)**

Watch the logs in real-time.

- [ ] **Step 3: Look for the console.log output**

You should see:
```
Shop Pay session payload: {
  input: {
    paymentRequest: {
      lineItems: [...],
      subtotalAmount: "...",
      totalAmount: "...",
      currencyCode: "USD",
      countryCode: "US"  ← MUST BE "US"
    },
    sourceIdentifier: "..."
  }
}
```

- [ ] **Step 4: Verify required fields**

Check that the payload contains:
- ✅ `countryCode: "US"`
- ✅ `currencyCode: "USD"`
- ✅ `lineItems` array with items
- ✅ `totalAmount` is > $35 and < $30,000

If all present and correct → Installments should appear (if not, Shopify store settings may need adjustment)
If missing → Return to Task 2 or 3 and verify the cart query/context setup.

---

### Task 7: Verify Cart Query Has availableForSale in API Response

**Files:**
- No files modified; debugging only

- [ ] **Step 1: Open Browser DevTools → Network tab**

While on localhost:5173, click the cart icon to sync cart.

- [ ] **Step 2: Look for GraphQL request to Shopify (will be named `https://.../graphql.json`)**

- [ ] **Step 3: Click on the request and view Response**

Look for the `cart.lines[].merchandise.availableForSale` field in the response. It should show `true` or `false` for each product variant.

Expected:
```json
{
  "data": {
    "cart": {
      "lines": [
        {
          "merchandise": {
            "id": "...",
            "availableForSale": true  ← MUST BE PRESENT AND TRUE
          }
        }
      ]
    }
  }
}
```

If `availableForSale` is missing or `false` → Return to Task 2 and verify the query includes the field.
If present and `true` → Continue to Task 8.

---

### Task 8: Deploy to Production

**Files:**
- No files modified; deployment only

- [ ] **Step 1: Push all commits to main**

```bash
git push origin main
```

Expected: Commits appear on GitHub, Cloudflare auto-triggers build.

- [ ] **Step 2: Monitor Cloudflare deployment**

Go to Cloudflare Dashboard → dls-belle1 → Deployments

Expected: New deployment appears with status "Building" → "Success" (takes 2-3 min)

- [ ] **Step 3: Wait for deployment to complete**

Once status shows ✅ "Success", the code is live.

---

### Task 9: Test on Production - Verify Installments Appear Live

**Files:**
- No files modified; test only

- [ ] **Step 1: Go to https://dunnluxuryselections.com**

- [ ] **Step 2: Add $3,500+ item to cart**

Add Humidor Supreme or any high-value item.

- [ ] **Step 3: Go to Checkout**

- [ ] **Step 4: Fill in customer details (US address)**

- [ ] **Step 5: Click Shop Pay button**

- [ ] **Step 6: Verify "Pay in full or in installments" option appears**

Expected: In the Shop Pay Plan section:
- ✅ "Pay now"
- ✅ "Pay in monthly installments"

If BOTH appear → **SUCCESS! Feature is working.** ✅
If installments still missing → Check Cloudflare logs again and review the payload structure.

---

### Task 10: (Optional) Test Complete Payment Flow

**Files:**
- No files modified; test only

- [ ] **Step 1: In Shop Pay checkout, select "Pay in monthly installments"**

- [ ] **Step 2: Use test card: 4111 1111 1111 1111**

Expiry: Any future date (e.g., 12/26)
CVC: Any 3 digits (e.g., 123)

- [ ] **Step 3: Complete payment**

- [ ] **Step 4: Verify redirect to order confirmation page**

Expected: Redirect to https://dunnluxuryselections.com/order-confirmation

If successful → Payment flow complete! 🎉
If error → Check browser console for errors and Cloudflare Worker logs for API response.

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/lib/shopify.ts` | Add `availableForSale` to ProductVariant in cartCreate and cartLinesAdd queries |
| `src/context/CartContext.tsx` | Ensure `buyerIdentity.countryCode: "US"` is set in cart creation |
| `functions/api/shop-pay-session.ts` | Add console.log statements for payload debugging |

**Commits:** 3 commits total (small, focused changes)

---

## Rollback Plan

If anything breaks on production:

```bash
git revert HEAD
git push origin main
```

Cloudflare will auto-rebuild and revert to previous working state (2-3 min).

---

## Testing Checklist

- [ ] Local: Add to cart → Shop Pay → See installments option
- [ ] Logs: Verify payload has countryCode: "US" and currencyCode: "USD"
- [ ] API response: Verify availableForSale field is present in cart query
- [ ] Production: Add to cart → Shop Pay → See installments option
- [ ] (Optional) Complete test payment with installments selected
