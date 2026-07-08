# Shop Pay Account Entry Point — Design Spec

**Date:** 2026-07-07
**Branch:** `shopify-liquid-theme` (live theme via Shopify GitHub integration)
**Scope:** Add a customer-account entry point (header icon, mobile menu, footer link) that links to the store's existing Shopify-hosted new customer accounts. No account UI is built here — Shopify already hosts it.

## Background / Current State

- The store uses **Shopify "new customer accounts"** (confirmed live): passwordless Shop/Shop Pay login, hosted by Shopify at `account.dunnluxuryselections.com`. The full logged-in experience (login, order history, order tracking, profile, saved addresses) already exists and is maintained by Shopify.
- The theme's `templates/customers/*.liquid` (account, login, register, addresses, order, activate, reset_password) are **email/password classic-account templates that are never rendered** under new customer accounts. They are vestigial. Left in place (harmless); optional cleanup noted as a non-goal.
- **The gap:** `sections/header.liquid` exposes only Search + Cart icons and a mobile menu; `sections/footer.liquid` has no account link. Customers have no way to reach their account from the storefront.

## Goal

Give customers a clear, on-brand way to reach their Shop Pay account from every page, with correct logged-in vs logged-out behavior, using upgrade-safe Shopify routing.

## Non-Goals

- No custom login, order-history, profile, or address UI (Shopify hosts all of it).
- No Shopify admin/setting changes (account system is already configured).
- No hardcoding of `account.dunnluxuryselections.com` anywhere.
- Not deleting the vestigial `templates/customers/*.liquid` files in this change (optional separate cleanup).

## Design

### 1. Header account icon — `sections/header.liquid`
Insert a person-outline account control in `.header-actions`, **between** the Search wrap (ends ~line 91) and the Cart button (~line 93), so order reads Search → Account → Cart → mobile-menu.

Markup (mirrors `.search-icon-link` pattern; icon-only with accessible label):

```liquid
<a
  href="{{ routes.account_url }}"
  class="account-icon-link"
  aria-label="{% if customer %}Your account{% else %}Sign in{% endif %}"
>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
  {%- if customer -%}
    <span class="account-greeting">{{ customer.first_name | default: 'Account' }}</span>
  {%- endif -%}
</a>
```

- Uses `routes.account_url` (resolves to the hosted account; redirects to login when not authenticated). Do **not** use a literal subdomain.
- `customer` is populated in Liquid when the buyer has a storefront login session, enabling logged-in state.
- `.account-greeting` shown only on desktop (`@media (min-width: 768px)`), hidden on mobile to keep the icon row tight. Icon-only otherwise, consistent with Search/Cart.

### 2. Header CSS — `sections/header.liquid` `<style>`
Add rules matching `.search-icon-link`, including the **`flex-shrink: 0` SVG fix** (a known past bug where header SVGs collapsed to width 0 inside flex containers):

```css
.account-icon-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(240, 221, 184, 0.85);
  text-decoration: none;
  transition: color 0.2s ease;
}
.account-icon-link:hover { color: var(--gold-400); }
.account-icon-link svg { flex-shrink: 0; }
.account-greeting {
  display: none;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}
@media (min-width: 768px) {
  .account-greeting { display: inline; }
}
```

### 3. Mobile menu link — `sections/header.liquid`
Add to the `#mobile-nav` panel (after "About", before the `.mobile-nav-cta` "Shop All Humidors"):

```liquid
<a href="{{ routes.account_url }}">{% if customer %}My Account{% else %}Sign In{% endif %}</a>
```

### 4. Footer link — `sections/footer.liquid`
Add to the **Customer Service** `<ul class="footer-links">` (after "Financing", ~line 57):

```liquid
<li><a href="{{ routes.account_url }}">My Account</a></li>
```

## Edge Cases & Constraints

- **Logged out:** icon + `aria-label="Sign in"`; click → Shop Pay/Shop passwordless login.
- **Logged in:** icon + first-name greeting (desktop) + `aria-label="Your account"`; click → account home.
- **Routing:** always `routes.account_url`; upgrade-safe and correct for new customer accounts.
- **Shopify server-side section validation:** no new `url`/`range` schema settings are added and `{% stylesheet %}`/`<style>` usage is unchanged, so none of the three known rejection rules apply. Still verify rendered HTML after deploy (green theme-check ≠ deployed).
- **SVG flex collapse:** every added header SVG carries `flex-shrink: 0`.

## Testing / Verification

1. `shopify theme check` → 0 new errors.
2. After GitHub-integration deploy, load the live homepage: confirm the account icon renders between Search and Cart (desktop) and the "My Account/Sign In" link appears in the mobile menu and footer Customer Service column.
3. Logged out: icon links to the Shop Pay login (`account.dunnluxuryselections.com`), aria-label "Sign in".
4. Logged in (after Shop Pay login): greeting shows first name, link goes to account home.
5. Confirm no Liquid error string in rendered header/footer HTML.

## Deployment Note

`shopify-liquid-theme` deploys to the live theme via the Shopify GitHub integration (~1 min normally). A sync lag was observed 2026-07-07 (commit `e003904` delayed); if this change doesn't appear live shortly after push, check the theme's GitHub connection / last-synced commit in Shopify admin → Online Store → Themes.

## Files Touched

- `sections/header.liquid` — account icon markup + CSS + mobile-nav link.
- `sections/footer.liquid` — "My Account" link in Customer Service column.
