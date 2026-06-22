# About Us Redesign: Two-Act Founder Story

**Date:** June 22, 2026  
**Project:** DLS-Belle1 (Dunn's Luxury Selections)  
**Scope:** Redesign About Us page to feature Brian Dunn's founder story with emphasis on custom/bespoke humidor engineering

---

## Context

The current About Us page presents the company mission, values, and timeline but lacks personal connection to the founder. Dunn's Luxury Selections differentiator is custom-engineered humidor solutions for discerning collectors. To strengthen brand positioning and build trust with potential customers, the About page should lead with Brian Dunn's authentic origin story and his founding philosophy around precision engineering and bespoke design.

This redesign restructures the page into two narrative acts:
- **Act 1**: "The Man Behind It" — Brian's personal journey and vision
- **Act 2**: "The Vision Realized" — How that vision became the company and its partnerships

---

## Design Overview

### **Page Structure**

```
Act 1: "The Man Behind It" (Hero + Founder Story)
├─ Hero Section (background image, title, accent)
├─ Origin Story Narrative (4 paragraphs)
├─ Founder's Quote (prominent styling)
└─ Transition Text

[Visual Divider / Subtle Break]

Act 2: "The Vision Realized" (Company Narrative)
├─ Mission Statement
├─ Values Section (4 values with icons)
├─ Timeline (2 major milestones)
└─ Final CTA
```

---

## Act 1: "The Man Behind It"

### Hero Section

**Visual**
- Full-width background image: Brian Dunn's professional portrait positioned next to a Dunn's humidor showcase (provided by user)
- Overlay: Dark gradient (charcoal-950 at 80% opacity) for text legibility
- Maintains existing design system (gold accents, serif typography)

**Text Elements**
- Accent line (gold horizontal line, 8px width)
- Label: "Our Founder's Story" (gold text, all caps, 10px, letter-spacing 0.4em)
- Headline: "The Man Behind It" (serif, 48px+ responsive, white)
- Subheading: "Meet Brian Dunn" (cream-200, 20px+)

### Brian's Origin Story (Narrative Section)

**Structure:** 4 connected paragraphs, each building the founder narrative

**Paragraph 1 — Discovery & Problem Identification**
- Brian's background: application engineer at major US bank, Chicago-based
- Discovered cigars during banking career
- Identified market gap: only two inadequate options (cheap imports OR overpriced furniture)

**Paragraph 2 — The Core Problem & Vision**
- **Key insight**: Every collector's needs are unique, but industry offers only generic solutions
- Examples: 500-cigar cabinet, retail lounge display, custom space-specific installation
- Brian's founding belief: **Custom-engineered solutions** for each collector's vision

**Paragraph 3 — The Philosophy**
- Core conviction: cigars and storage deserve better than off-the-shelf
- Not selling humidors — **designing them**
- Emphasis on precision engineering + bespoke tailoring

**Paragraph 4 — The Launch**
- 2025: Founded Dunn's Luxury Selections
- Early 2026: Partnered with industry leaders (Raching, Akar, Humidor Supreme, Palio, Cigar Caddy, Stinky)
- Result: Expanded ability to offer fully custom solutions

**Tone:** Professional, authentic, slightly formal (matches luxury brand). Emphasize "precision," "custom," "engineered," "vision."

### Founder's Quote

**Styling**
- Centered on page
- Large serif font (36px+)
- Gold color (gold-400)
- Generous whitespace around
- Optional: Light background accent box (gold-700/10, subtle)

**Text**
> "Cigars deserve precision engineering, not compromise. Every collection deserves a solution designed just for it."
> — Brian Dunn, Founder

### Transition Text

**Purpose:** Bridge from Brian's personal story to company narrative

**Text:** "What started as one man's vision has grown into America's premier humidor destination."

**Styling:** Subtle, centered, cream-200/70, smaller font (16-18px)

---

## Act 2: "The Vision Realized"

### Mission Statement

**Headline**
"Preserving the Art of the Cigar"  
(Serif, 36px+, white with gradient-gold italic on last 2 words)

**Mission Copy**
Reworded to tie explicitly back to Brian's precision-engineering philosophy:

> "Founded on Brian's belief that cigars deserve precision engineering, not compromise, Dunn's Luxury Selections exists to ensure every collector — from the entry-level aficionado to the seasoned private collector — has access to a storage solution equal to the calibre of their collection."

**Styling**
- Centered text block
- Max-width: 800px
- Text: cream-200/60, 20px line-height
- Accent line above (gold horizontal, 8px width)

### Values Section

**4 Core Values** (unchanged from current About.tsx)
- Icon (gold-500, 20px, in bordered box)
- Title (serif, white, 20px)
- Description (cream-200/55, 14px, brief)

**Values:**
1. **Uncompromising Curation** — Every product personally evaluated for quality, precision, aesthetics
2. **Expert Integrity** — Honest guidance, not sales pressure; genuine aficionados
3. **Nationwide Commitment** — White-glove service across all 50 states
4. **Passion for the Craft** — Reverence for cigars as living art form

**Layout**
- Grid: 1 column mobile, 2 columns tablet+
- Cards: bg-charcoal-900, border-charcoal-800/50, hover effect
- Spacing: 6px gaps between cards

### Timeline — The Authentic Journey

**2025: Founded**
- Milestone year in gold circle (border-gold-600/50)
- Title: "Founded"
- Description: "Brian's vision becomes Dunn's Luxury Selections, bringing curated precision-engineered humidors to discerning collectors nationwide."

**Early 2026: Strategic Partnerships**
- Milestone label: "Early 2026"
- Title: "Strategic Partnerships"
- Description: "Partnered with industry-leading brands — Raching, Akar, Humidor Supreme, Palio, Cigar Caddy, and Stinky — collectively representing 200+ years of expertise in humidor engineering and design."

**Timeline Layout**
- Alternating left/right (desktop)
- Vertical stacked (mobile)
- Gold vertical line connecting milestones (existing design pattern)
- Year in centered circle (existing design pattern)

### Final CTA Section

**Headline**
"Ready to Elevate Your Collection?"

**Copy**
"Browse our full collection or speak with our team for expert guidance tailored to your needs."

**Buttons**
- Primary: "Shop Collection" (bg-gold-gradient, text-charcoal-950)
- Secondary: "Call Us: (888) 431-9214" (border-gold-500/50, text-gold-400)

**Styling**
- Centered on page
- bg-charcoal-950, border-t border-charcoal-800/40
- py-20 padding

---

## Technical Implementation

### Files to Modify
- `src/components/About.tsx` — Main component
  - Update hero section text and heading structure
  - Rewrite narrative paragraphs (Act 1)
  - Update mission statement copy
  - Keep values and timeline structure, update copy where noted
  - Update CTA text

### CSS / Styling Notes
- Reuse existing charcoal-950, gold-500, cream-200 color scheme
- Serif font for headlines (existing font-serif utility)
- Maintain responsive breakpoints (sm, md, lg)
- No new components needed — restructure existing About.tsx

### Image Integration
- Hero section background: Use provided Brian Dunn portrait (src/images/brian-dunn-founder.jpg or similar)
- Existing hero-bg.png can be replaced or layered with Brian's image
- Ensure image maintains aspect ratio on mobile

### No Breaking Changes
- Existing page routes remain the same (/about)
- Existing metadata/SEO remains (title, description already in App.tsx)
- Timeline and values components reuse existing markup patterns

---

## Verification

### Functional Testing
1. Page loads without errors on desktop, tablet, mobile
2. Hero image displays correctly with gradient overlay
3. All text content renders properly (no truncation, line breaks natural)
4. Timeline visual alignment correct (vertical line connects milestones)
5. Buttons link to correct destinations (Shop Collection, Phone call)

### Visual Testing
1. Color contrast meets WCAG standards (gold on dark background readable)
2. Responsive layout flows correctly at 600px, 1024px, 1280px breakpoints
3. Serif typography hierarchy clear (headlines > body copy)
4. Whitespace around founder quote feels intentional and balanced
5. Brian's image integrates naturally with overlay and text

### Content Testing
1. No placeholder text (all copy finalized)
2. Year consistency (2025 founding, Early 2026 partnerships)
3. Brand partner names accurate (Raching, Akar, Humidor Supreme, Palio, Cigar Caddy, Stinky)
4. Tone consistent throughout (professional, luxury, authentic)

---

## Scope & Constraints

- **Scope:** About Us page redesign only (no other pages affected)
- **Constraint:** Brian's portrait image must be provided (user provided)
- **Constraint:** No new dependencies or external libraries
- **Timeline:** 2 major milestones (2025, Early 2026) — authentic, no fictional future dates
- **Positioning:** Emphasize custom/bespoke engineering throughout Act 1

---

## Success Criteria

✓ Readers understand Brian's origin story and founding vision  
✓ Custom/bespoke solutions emphasized as core differentiator  
✓ Trust built through authentic timeline and established brand partnerships  
✓ Clear visual hierarchy: Act 1 (personal) → Act 2 (company)  
✓ Mobile-responsive, accessible, performant  
✓ No breaking changes to existing functionality
