# Utility Pages Guide

## Overview

The Shopify Liquid theme includes a flexible page template (`templates/page.liquid`) that supports multiple utility pages with optional sections and content organization tools.

## Creating Pages in Shopify Admin

1. Go to **Online Store** → **Pages**
2. Click **Add Page**
3. Enter **Title** (e.g., "Financing Options")
4. Enter **Content** (use the page editor)
5. Set **URL handle** (e.g., `financing`, `about`, `care-guides`)
6. Click **Save**

## Available Sections for Pages

### FAQ Accordion (`sections/faq-accordion.liquid`)

Perfect for FAQs, care instructions, and troubleshooting.

**Usage in page content:**
```liquid
{% section 'faq-accordion' %}
```

**Customization via Shopify Admin:**
- Title: "Frequently Asked Questions"
- Add blocks for each Q&A pair
- Questions and answers support rich text

**Example pages:**
- Care Guides
- Returns & Warranty
- Financing Details

### Benefits Section (`sections/benefits-section.liquid`)

Highlight key benefits or features with icons.

**Usage:**
```liquid
{% section 'benefits-section' %}
```

**Customization:**
- Heading: Section title
- Description: Intro text
- Blocks: Up to 12 benefits
  - Title (e.g., "Premium Quality")
  - Description (supports rich text)
  - Icon: Check, Star, Heart, or Shield

**Example pages:**
- About Us
- Why Choose Us
- Financing Benefits

### Call-to-Action Section (`sections/cta-section.liquid`)

Drive actions with primary and secondary buttons.

**Usage:**
```liquid
{% section 'cta-section' %}
```

**Customization:**
- Heading: e.g., "Ready to Shop?"
- Description: Supporting text
- Primary Button: Text + URL (default: "Shop Now" → collections/all)
- Secondary Button: Text + URL (default: "Learn More" → pages/about)
- Layout: Centered or Left-aligned
- Background Color: Custom color picker

## Recommended Page Structure

### Financing Page (`/pages/financing`)

1. Page title + intro text
2. Financing details section (FAQ)
3. Payment calculator/breakdown
4. Benefits section (interest-free, flexible terms, easy approval)
5. CTA section (link to qualifying products)
6. Newsletter signup (auto-included)

### About Page (`/pages/about`)

1. Company story/mission
2. Benefits section (quality, service, expertise)
3. Team or testimonials
4. CTA section (shop now or contact)
5. Newsletter signup (auto-included)

### Care Guides (`/pages/care-guides`)

1. Introduction to humidor care
2. FAQ accordion with maintenance tips
3. Step-by-step guides (rich text)
4. Benefits section (preserve investment, extend life)
5. CTA section (contact for support)
6. Newsletter signup (auto-included)

### Delivery Information (`/pages/delivery-info`)

1. Shipping policy overview
2. FAQ accordion for common questions
3. Delivery timelines
4. Costs and free shipping threshold
5. International shipping info (if applicable)
6. CTA section (ready to order)
7. Newsletter signup (auto-included)

### Returns & Warranty (`/pages/returns-warranty`)

1. Returns policy summary
2. FAQ accordion (when can I return, process, restocking fees)
3. Warranty coverage details
4. FAQ accordion (warranty coverage, what's covered)
5. Contact info for claims
6. CTA section (contact support)
7. Newsletter signup (auto-included)

### Policies (`/pages/terms`, `/pages/privacy`, `/pages/cookie-policy`)

1. Straightforward policy text
2. Use page body content only
3. These typically don't need sections
4. Newsletter signup (auto-included)

## Page Features

### Automatic Features

All pages automatically include:
- ✅ Professional header with title
- ✅ Newsletter signup section at bottom
- ✅ Responsive design (mobile + desktop)
- ✅ Dark theme styling (charcoal + gold)
- ✅ Related pages navigation (for financing and about pages)

### Styling Notes

- **Fonts**: Playfair Display for headings, Inter for body text
- **Colors**: Gold accents (#C98A10), charcoal background (#0a0a0a)
- **Spacing**: Professional padding and margins
- **Mobile**: Fully responsive with optimized touch targets

## Rich Text Editor Tips

When editing page content in Shopify Admin:

1. **Headings**: Use H2 and H3 for structure (H1 is the page title)
2. **Links**: Link to other pages or external resources
3. **Lists**: Use bullet points for readability
4. **Emphasis**: Bold for important terms, italics for subtle emphasis
5. **Spacing**: Use paragraph breaks for better readability

## Publishing & SEO

1. **URL Handle**: Must match page route (e.g., `financing` → `/pages/financing`)
2. **SEO Title**: Customize if different from page title
3. **Description**: Add meta description for search engines
4. **Visibility**: Publish when ready (draft mode for in-progress pages)

## Example: Complete Financing Page

**Title**: "Financing Options"
**Handle**: `financing`

**Content** (in page editor):
```
## How It Works

Shop Pay Installments allow you to finance purchases of $1,500 or more with no interest. Choose from flexible payment plans and enjoy interest-free financing.

[Include FAQ accordion via sections/faq-accordion]

## Common Questions

- What are the interest rates?
- How long does approval take?
- Can I pay early without penalties?

[Include benefits section via sections/benefits-section]

Benefits:
- Interest-Free: 4 payments, zero interest
- Flexible: No hidden fees
- Fast: Instant approval

[Include CTA via sections/cta-section]
Ready to finance your humidor?
```

## FAQ

**Q: Can I reorder sections on a page?**  
A: Yes, in Shopify Admin, drag sections to reorder them in the page editor.

**Q: Can I use custom HTML or JavaScript in pages?**  
A: Shopify Admin's rich text editor supports basic HTML. For advanced customization, edit the page template directly.

**Q: How do I add a page to the navigation menu?**  
A: Go to **Online Store** → **Navigation**, add a menu item with the page URL.

**Q: Can I hide pages from search?**  
A: Yes, uncheck "Visible in search results" in page settings (SEO section).

**Q: Are pages mobile-friendly?**  
A: Yes, all pages use responsive design optimized for all device sizes.
