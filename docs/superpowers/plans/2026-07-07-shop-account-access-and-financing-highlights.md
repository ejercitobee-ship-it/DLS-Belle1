# Shop Account Access & Financing Highlights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a customer-account entry point (header/mobile/footer) and accurate "Create a Shop account" highlights across the Flexible Financing surfaces, all linking to the store's existing Shopify-hosted Shop Pay account.

**Architecture:** Shopify Liquid theme. All account links use the `{{ routes.account_url }}` route (resolves to the store's new customer accounts at `account.dunnluxuryselections.com`). No account UI is built — Shopify hosts it. Changes are confined to existing section/snippet files; no new schema settings, no admin changes.

**Tech Stack:** Shopify Online Store 2.0 Liquid, Theme Check, Shopify GitHub integration (branch `shopify-liquid-theme` auto-deploys to the live theme).

## Global Constraints

- Branch: `shopify-liquid-theme`. Pushing deploys to the LIVE theme via the Shopify GitHub integration (~1 min; a sync lag was seen 2026-07-07 — if a change isn't live shortly, check Shopify admin → Online Store → Themes → GitHub connection/last-synced commit).
- Every account link uses `{{ routes.account_url }}`. NEVER hardcode `account.dunnluxuryselections.com`.
- CTA/link label text is exactly **`Create a Shop account`** (header/mobile/footer account entry may use "Account"/"Sign In"/"My Account" as specified per task).
- Accuracy rule (financing copy): encourage account creation; NEVER claim the account qualifies/approves anyone for installments. Use the framing "check out faster / access installment plans at checkout — financing by Affirm, subject to approval."
- Every header SVG must carry `flex-shrink: 0` (a past bug collapsed header icons to width 0 inside flex containers).
- Do NOT add new `url`-type or `range`-type schema settings (Shopify server-side validation silently rejects section files that violate its rules). These tasks add none.
- Verification: `shopify theme check` must show 0 new errors. After deploy, verify rendered HTML with PowerShell `Invoke-WebRequest` (plain `curl` is bot-blocked and returns empty). A green theme-check is NOT proof the section deployed — always confirm the rendered storefront HTML has no `Liquid error` string.

---

### Task 1: Header account icon + CSS + mobile-nav link

**Files:**
- Modify: `sections/header.liquid` (actions row ~line 91–93; `<style>` ~line 241; mobile nav ~line 125)

**Interfaces:**
- Consumes: Shopify globals `routes.account_url`, `customer` (populated when the buyer has a storefront login session).
- Produces: `.account-icon-link` control in the header actions row; a mobile-nav account link. No exports other tasks depend on.

- [ ] **Step 1: Insert the account icon between Search and Cart**

In `sections/header.liquid`, find this block (the search-wrap close followed by the cart button):

```liquid
      </div>

      <button
        class="cart-icon-container"
        id="cart-toggle"
        aria-label="Open shopping cart"
      >
```

Replace it with (adds the account link before the cart button):

```liquid
      </div>

      <!-- Account -->
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

      <button
        class="cart-icon-container"
        id="cart-toggle"
        aria-label="Open shopping cart"
      >
```

- [ ] **Step 2: Add the account CSS**

In the same file's `<style>` block, find:

```css
  .search-icon-link:hover {
    color: var(--gold-400);
  }
```

Insert immediately AFTER it:

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
    white-space: nowrap;
  }
  @media (min-width: 768px) {
    .account-greeting { display: inline; }
  }
```

- [ ] **Step 3: Add the mobile-nav account link**

Find in the `#mobile-nav` panel:

```liquid
    <a href="/pages/about-us">About</a>
    <a href="/collections/all" class="mobile-nav-cta">Shop All Humidors</a>
```

Replace with:

```liquid
    <a href="/pages/about-us">About</a>
    <a href="{{ routes.account_url }}">{% if customer %}My Account{% else %}Sign In{% endif %}</a>
    <a href="/collections/all" class="mobile-nav-cta">Shop All Humidors</a>
```

- [ ] **Step 4: Run Theme Check**

Run: `shopify theme check sections/header.liquid`
Expected: 0 errors (offenses on this file). If the CLI isn't available, run `shopify theme check` for the whole theme and confirm no NEW offenses referencing `header.liquid`.

- [ ] **Step 5: Commit**

```bash
git add sections/header.liquid
git commit -m "Add Shop account entry point to header + mobile nav"
```

---

### Task 2: Footer "My Account" link

**Files:**
- Modify: `sections/footer.liquid` (Customer Service list ~line 57)

**Interfaces:**
- Consumes: `routes.account_url`.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Add the link to the Customer Service column**

In `sections/footer.liquid`, find:

```liquid
          <li><a href="/pages/financing">Financing</a></li>
          <li><a href="mailto:support@dunnluxuryselections.com">Contact Us</a></li>
```

Replace with:

```liquid
          <li><a href="/pages/financing">Financing</a></li>
          <li><a href="{{ routes.account_url }}">My Account</a></li>
          <li><a href="mailto:support@dunnluxuryselections.com">Contact Us</a></li>
```

- [ ] **Step 2: Run Theme Check**

Run: `shopify theme check sections/footer.liquid`
Expected: 0 offenses on this file.

- [ ] **Step 3: Commit**

```bash
git add sections/footer.liquid
git commit -m "Add My Account link to footer Customer Service column"
```

---

### Task 3: Homepage financing banner — Shop-account note + CSS

**Files:**
- Modify: `sections/financing-banner.liquid` (content column ~line 137; `{% stylesheet %}` near `.financing-description`)

**Interfaces:**
- Consumes: `routes.account_url`.
- Produces: `.financing-shop-note` element. No settings changes (the note is template markup, so it renders regardless of the `settings_data.json` description override).

- [ ] **Step 1: Add the Shop-account note beneath the CTAs**

In `sections/financing-banner.liquid`, find the end of the CTA block followed by the content-column close:

```liquid
            {%- if section.settings.cta_secondary_text != blank -%}
              <a href="{{ section.settings.cta_secondary_url }}" class="btn btn-secondary">
                {{ section.settings.cta_secondary_text }}
              </a>
            {%- endif -%}
          </div>
        {%- endif -%}
      </div>
```

Replace with (adds the note after the `.financing-ctas` `{%- endif -%}`, still inside `.financing-content`):

```liquid
            {%- if section.settings.cta_secondary_text != blank -%}
              <a href="{{ section.settings.cta_secondary_url }}" class="btn btn-secondary">
                {{ section.settings.cta_secondary_text }}
              </a>
            {%- endif -%}
          </div>
        {%- endif -%}

        <p class="financing-shop-note">
          New to Shop Pay? <a href="{{ routes.account_url }}">Create a Shop account</a>
          to check out faster and access installment plans at checkout &mdash; financing by Affirm, subject to approval.
        </p>
      </div>
```

- [ ] **Step 2: Add `.financing-shop-note` CSS**

In the same file's `{% stylesheet %}` block, find:

```css
.financing-description p {
  margin: 0;
}
```

Insert immediately AFTER it:

```css

.financing-shop-note {
  color: rgba(240, 221, 184, 0.55);
  font-size: 0.8rem;
  line-height: 1.5;
  margin: 1.25rem 0 0;
  max-width: 32rem;
}

.financing-shop-note a {
  color: var(--gold-400);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.financing-shop-note a:hover {
  color: var(--gold-300);
}
```

- [ ] **Step 3: Run Theme Check**

Run: `shopify theme check sections/financing-banner.liquid`
Expected: 0 offenses on this file.

- [ ] **Step 4: Commit**

```bash
git add sections/financing-banner.liquid
git commit -m "Add Create a Shop account note to homepage financing banner"
```

---

### Task 4: Compact financing banner — Shop-account encouragement

**Files:**
- Modify: `sections/financing-banner-compact.liquid` (schema `description` default)

**Interfaces:**
- Consumes: nothing new. The compact banner has NO `settings_data.json` override, so the schema `default` is what renders on collection pages. Its existing "Learn More" CTA (→ `/pages/financing`) carries customers to the full Shop-account CTA added in Task 5.
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Append the Shop-account encouragement to the description default**

In `sections/financing-banner-compact.liquid`, find:

```liquid
      "default": "Shop Pay Installments, powered by Affirm: pay in 4 interest-free, or spread larger pieces over monthly plans. Your rate and schedule are shown at checkout."
```

Replace with:

```liquid
      "default": "Shop Pay Installments, powered by Affirm: pay in 4 interest-free, or spread larger pieces over monthly plans. Your rate and schedule are shown at checkout. New to Shop Pay? Create a free Shop account to get started."
```

- [ ] **Step 2: Run Theme Check**

Run: `shopify theme check sections/financing-banner-compact.liquid`
Expected: 0 offenses on this file.

- [ ] **Step 3: Commit**

```bash
git add sections/financing-banner-compact.liquid
git commit -m "Encourage Shop account creation in compact financing banner"
```

---

### Task 5: Financing page — Shop-account callout card + closing CTA button

**Files:**
- Modify: `snippets/page-content-financing.liquid` (after the "Two Ways to Pay" block ~line 49; closing CTA ~line 135)

**Interfaces:**
- Consumes: `routes.account_url`; global CSS classes `dls-card`, `dls-card--gold`, `dls-container`, `dls-h2`, `dls-gold`, `dls-muted`, `btn`, `btn-primary`, `btn-secondary` (all defined in `assets/main.css`).
- Produces: nothing other tasks depend on.

- [ ] **Step 1: Insert the Shop-account callout card between "Two Ways to Pay" and "How It Works"**

In `snippets/page-content-financing.liquid`, find:

```liquid
    <p class="dls-muted" style="font-size: 0.75rem; text-align: center; margin: 1.5rem auto 0; max-width: 44rem; opacity: 0.75;">Shop Pay Installments is a lending program provided by Affirm. Eligibility, plan availability, and interest rate are decided in real time using a soft credit check that does not affect your credit score. There are never hidden fees &mdash; the exact amount and schedule you see at checkout is what you pay.</p>
  </div>

  <!-- How it works -->
```

Replace with (adds the callout container between the two sections):

```liquid
    <p class="dls-muted" style="font-size: 0.75rem; text-align: center; margin: 1.5rem auto 0; max-width: 44rem; opacity: 0.75;">Shop Pay Installments is a lending program provided by Affirm. Eligibility, plan availability, and interest rate are decided in real time using a soft credit check that does not affect your credit score. There are never hidden fees &mdash; the exact amount and schedule you see at checkout is what you pay.</p>
  </div>

  <!-- Create a Shop account -->
  <div class="dls-container" style="margin-bottom: 4rem;">
    <div class="dls-card dls-card--gold" style="padding: 2rem; text-align: center;">
      <p class="dls-gold" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.5rem;">Get Set Up</p>
      <h2 class="dls-h2" style="margin: 0 0 0.75rem;">Create a free Shop account</h2>
      <p class="dls-muted" style="max-width: 40rem; margin: 0 auto 1.5rem;">A Shop account lets you check out with Shop Pay in seconds and access installment plans at checkout &mdash; financing by Affirm, subject to approval. Your details stay saved for next time, and checking your options never affects your credit score.</p>
      <a href="{{ routes.account_url }}" class="btn btn-primary">Create a Shop account</a>
    </div>
  </div>

  <!-- How it works -->
```

- [ ] **Step 2: Add the closing "Create a Shop account" button**

Find the closing CTA section:

```liquid
    <a href="/collections/all" class="btn btn-primary">Browse Collections</a>
    <p class="dls-muted" style="font-size: 0.75rem; margin-top: 1rem;">Mon&ndash;Fri, 9:00 AM &ndash; 6:00 PM CST</p>
```

Replace with:

```liquid
    <a href="/collections/all" class="btn btn-primary">Browse Collections</a>
    <a href="{{ routes.account_url }}" class="btn btn-secondary" style="margin-left: 0.75rem;">Create a Shop account</a>
    <p class="dls-muted" style="font-size: 0.75rem; margin-top: 1rem;">Mon&ndash;Fri, 9:00 AM &ndash; 6:00 PM CST</p>
```

- [ ] **Step 3: Run Theme Check**

Run: `shopify theme check snippets/page-content-financing.liquid`
Expected: 0 offenses on this file.

- [ ] **Step 4: Commit**

```bash
git add snippets/page-content-financing.liquid
git commit -m "Add Create a Shop account callout + CTA to financing page"
```

---

### Task 6: Deploy & live verification

**Files:** none (verification only)

- [ ] **Step 1: Push to deploy**

```bash
git push origin shopify-liquid-theme
```

Wait ~1–2 min for the Shopify GitHub integration to sync. If nothing changes after several minutes, check Shopify admin → Online Store → Themes → the GitHub-connected theme's last-synced commit.

- [ ] **Step 2: Verify header + footer (logged out)**

Run (PowerShell — plain curl is bot-blocked):

```powershell
$c = (Invoke-WebRequest -Uri ("https://www.dunnluxuryselections.com/?cb=" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -Headers @{"Cache-Control"="no-cache"}).Content
"account-icon-link: " + ($c -match 'account-icon-link')
"account href present: " + ($c -match 'account\.dunnluxuryselections\.com|/account')
"footer My Account: " + ($c -match '>My Account<')
"aria Sign in (logged out): " + ($c -match 'aria-label="Sign in"')
"no Liquid error: " + (-not ($c -match 'Liquid error'))
```

Expected: `account-icon-link: True`, `footer My Account: True`, `aria Sign in (logged out): True`, `no Liquid error: True`. Confirm the account icon renders between Search and Cart.

- [ ] **Step 3: Verify homepage financing note**

```powershell
$c = (Invoke-WebRequest -Uri ("https://www.dunnluxuryselections.com/?cb=" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -Headers @{"Cache-Control"="no-cache"}).Content
"financing-shop-note: " + ($c -match 'financing-shop-note')
"Create a Shop account CTA: " + ($c -match 'Create a Shop account')
"subject to approval framing: " + ($c -match 'subject to approval')
"no 'qualify' promise: " + (-not ($c -match 'account to qualify|create an account to qualify'))
```

Expected: all True except the last which must be `True` (i.e., no forbidden "qualify" promise).

- [ ] **Step 4: Verify financing page**

```powershell
$c = (Invoke-WebRequest -Uri ("https://www.dunnluxuryselections.com/pages/financing?cb=" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -Headers @{"Cache-Control"="no-cache"}).Content
"callout heading: " + ($c -match 'Create a free Shop account')
"two Create-a-Shop-account CTAs: " + ([regex]::Matches($c,'Create a Shop account').Count)
"no Liquid error: " + (-not ($c -match 'Liquid error'))
```

Expected: `callout heading: True`, CTA count `>= 2`, `no Liquid error: True`.

- [ ] **Step 5: Verify compact banner on a collection page**

```powershell
$c = (Invoke-WebRequest -Uri ("https://www.dunnluxuryselections.com/collections/all?cb=" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -UseBasicParsing -Headers @{"Cache-Control"="no-cache"}).Content
"compact encouragement: " + ($c -match 'Create a free Shop account to get started')
```

Expected: `True`.

- [ ] **Step 6: Manual logged-in check (report to user)**

The logged-in state (first-name greeting + `aria-label="Your account"`) requires a real Shop Pay login and cannot be asserted via an anonymous request. Note in the completion report that Belle should log in once via the account icon and confirm the greeting shows her first name and the icon links to the account home.

---

## Self-Review

**Spec coverage:**
- Account entry point — header icon (Task 1), mobile nav (Task 1), footer (Task 2). ✅
- Logged-in vs logged-out behavior — Task 1 `{% if customer %}` on aria-label, greeting, mobile label; verified Task 6 Step 2/6. ✅
- Financing Shop-account highlights — homepage note (Task 3), compact (Task 4), financing page callout + closing CTA (Task 5). ✅
- Accuracy guardrail — "subject to approval / financing by Affirm" copy in Tasks 3 & 5; no "qualify" promise, asserted in Task 6 Step 3. ✅
- Upgrade-safe routing — `routes.account_url` used in every task; verified no hardcoded subdomain. ✅
- No new url/range schema settings — none added. ✅
- Header SVG `flex-shrink: 0` — Task 1 Step 2. ✅

**Placeholder scan:** No TBD/TODO; every step shows exact old/new content and exact commands. ✅

**Type/label consistency:** CTA label "Create a Shop account" identical across Tasks 3, 5; `.financing-shop-note` defined (Task 3 Step 1) and styled (Task 3 Step 2) and asserted (Task 6 Step 3); `.account-icon-link` defined (Task 1 Step 1) and styled (Task 1 Step 2) and asserted (Task 6 Step 2). ✅
