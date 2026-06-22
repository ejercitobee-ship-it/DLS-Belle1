# About Us Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the About Us page to feature Brian Dunn's founder story in two narrative acts, emphasizing custom/bespoke humidor engineering as the core vision.

**Architecture:** Restructure `src/components/About.tsx` to present Act 1 (Brian's origin story with portrait, 4 narrative paragraphs, and founder quote) flowing into Act 2 (updated mission, values, and authentic timeline with 2025 founding and Early 2026 partnerships). No new components needed; reuse existing design system and layout patterns.

**Tech Stack:** React, TypeScript, Tailwind CSS (existing), Lucide icons (existing)

---

## File Structure

**Single file modification:**
- `src/components/About.tsx` — Restructure hero, add narrative sections, update timeline data, reorganize into two acts

---

## Task 1: Update Hero Section with Brian's Story Intro

**Files:**
- Modify: `src/components/About.tsx:38-65`

**Context:** The hero section currently shows a generic "America's Premier Humidor Destination" headline. We're replacing it with "The Man Behind It" / "Meet Brian Dunn" to lead with the founder story.

- [ ] **Step 1: Open About.tsx and locate hero section**

File: `src/components/About.tsx`  
Lines: 38-65 (the first `<section>` with hero background)

- [ ] **Step 2: Replace the hero headline and subheading**

Current (lines 55-62):
```jsx
<h1 className="font-serif text-5xl md:text-6xl text-white font-bold leading-[1.1] mb-6">
  America's Premier
  <br />
  <span className="text-gradient-gold italic">Humidor Destination</span>
</h1>
<p className="text-cream-200/70 text-xl leading-relaxed">
  Born from a passion for the craft and a belief that cigars deserve better preservation, Dunn's Luxury Selections has spent a decade curating the world's finest humidors for discerning collectors across the United States.
</p>
```

Replace with:
```jsx
<div className="flex items-center gap-3 mb-5">
  <div className="h-px w-8 bg-gold-500" />
  <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Founder's Story</span>
</div>
<h1 className="font-serif text-5xl md:text-6xl text-white font-bold leading-[1.1] mb-6">
  The Man Behind It
</h1>
<p className="text-cream-200/70 text-xl leading-relaxed mb-4">
  Meet Brian Dunn
</p>
```

- [ ] **Step 3: Verify hero section visually in browser**

Expected: Hero now displays "Our Founder's Story" label, "The Man Behind It" headline, "Meet Brian Dunn" subtext, with gold accent line.

- [ ] **Step 4: Commit this section**

```bash
git add src/components/About.tsx
git commit -m "refactor: update About hero section to feature Brian Dunn founder story"
```

---

## Task 2: Add Brian's Origin Story Narrative (Act 1)

**Files:**
- Modify: `src/components/About.tsx:34-167` (restructure entire component)

**Context:** After the hero section, insert a new narrative section with 4 paragraphs building Brian's origin story. This becomes Act 1 of the page.

- [ ] **Step 1: Create a new section component after hero (before Mission)**

After line 65 (closing `</section>` of hero), add:

```jsx
{/* Act 1: Brian's Origin Story */}
<section className="py-24 bg-charcoal-950">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="prose-article text-cream-200/70 leading-relaxed space-y-6">
      
      <p className="text-lg text-cream-100">
        Brian Dunn, an application engineer at one of America's largest banks, discovered his passion for cigars during his banking career in Chicago. Like many collectors, he quickly realized the humidor market offered only two inadequate options: cheap imports with no support, or mass-produced furniture that treated cigars as an afterthought.
      </p>

      <p className="text-lg text-cream-100">
        But Brian saw a deeper problem. Every collector's needs were different. One person needed a 500-cigar cabinet for a man cave. Another needed a precision walk-in system for a retail lounge. A third needed a bespoke solution for a specific space. Yet the industry offered only generic, off-the-shelf answers. Brian believed every collection deserved a custom-engineered solution, designed with precision engineering and tailored to that collector's unique vision.
      </p>

      <p className="text-lg text-cream-100">
        This conviction — that cigars and their storage deserve better — became the foundation of Dunn's Luxury Selections. Not just selling humidors. Designing them. Custom-engineered, precision-crafted solutions for collectors who refuse to compromise.
      </p>

      <p className="text-lg text-cream-100">
        In 2025, Brian founded Dunn's Luxury Selections to bring that vision to life. By early 2026, he'd partnered with the industry's most respected brands to expand the possibilities — ensuring that whether you need a curated collection piece or a fully custom walk-in sanctuary, Brian's team can engineer the perfect solution.
      </p>

    </div>
  </div>
</section>

{/* Founder's Quote */}
<section className="py-20 bg-charcoal-900">
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <blockquote className="space-y-4">
      <p className="font-serif text-3xl md:text-4xl text-gold-400 italic leading-relaxed">
        "Cigars deserve precision engineering, not compromise. Every collection deserves a solution designed just for it."
      </p>
      <p className="text-cream-200/60 text-sm tracking-widest uppercase">
        — Brian Dunn, Founder
      </p>
    </blockquote>
  </div>
</section>

{/* Transition to Act 2 */}
<section className="py-16 bg-charcoal-950 border-t border-charcoal-800/40">
  <div className="max-w-3xl mx-auto px-4 text-center">
    <p className="text-cream-200/70 text-lg">
      What started as one man's vision has grown into America's premier humidor destination.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Verify narrative sections render correctly**

Expected: Three new sections appear — origin story (4 paragraphs), founder quote (centered, gold text, larger), and transition text.

- [ ] **Step 3: Check mobile responsiveness**

Resize browser to 375px width. Expected: Text stacks properly, quote remains readable, spacing adjusts.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: add Act 1 — Brian's origin story and founder quote narrative"
```

---

## Task 3: Update Mission Statement Section

**Files:**
- Modify: `src/components/About.tsx` (Mission section)

**Context:** The mission section headline stays the same ("Preserving the Art of the Cigar"), but the copy is reworded to tie explicitly back to Brian's precision-engineering philosophy.

- [ ] **Step 1: Locate mission section in About.tsx**

Current lines: ~67-85 (the "Our Mission" section with charcoal-900 background)

- [ ] **Step 2: Update mission copy to reference Brian's vision**

Current (lines 78-82):
```jsx
<p className="text-cream-200/60 text-xl leading-relaxed mb-6">
  We believe that the way a cigar is stored is as important as the cigar itself. Temperature, humidity, and the quality of the enclosure determine whether a fine cigar reaches its full potential — or falls short of it.
</p>
<p className="text-cream-200/50 text-lg leading-relaxed">
  Our mission is to ensure that every Dunn's customer has access to a storage solution equal to the calibre of their collection — from the entry-level aficionado to the seasoned private collector building a walk-in sanctuary.
</p>
```

Replace with:
```jsx
<p className="text-cream-200/60 text-lg leading-relaxed mb-6">
  Founded on Brian's belief that cigars deserve precision engineering, not compromise, Dunn's Luxury Selections exists to ensure every collector — from the entry-level aficionado to the seasoned private collector — has access to a storage solution equal to the calibre of their collection.
</p>
```

- [ ] **Step 3: Verify mission section displays correctly**

Expected: Single paragraph now (instead of two), ties mission back to Brian's philosophy.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx
git commit -m "refactor: update mission statement to tie back to Brian's vision"
```

---

## Task 4: Update Timeline Milestones (Replace with Real Data)

**Files:**
- Modify: `src/components/About.tsx:3-9` (milestones data array)

**Context:** Replace the fictional 2015-2024 timeline with the authentic 2025-2026 milestones. The timeline component structure stays the same.

- [ ] **Step 1: Locate milestones data at top of About.tsx**

Lines 3-9 define the `milestones` array.

- [ ] **Step 2: Replace entire milestones array**

Current:
```typescript
const milestones = [
  { year: '2015', title: 'Founded', desc: 'Dunn\'s Luxury Selections is established with a singular vision: to bring world-class cigar storage to the American market.' },
  { year: '2017', title: 'First Raching Partnership', desc: 'We become an authorised dealer for Raching, introducing precision electronic humidors to our curated collection.' },
  { year: '2019', title: 'Bespoke Division Launched', desc: 'Our bespoke walk-in humidor design service opens — custom-engineered components shipped with full installation guidance, serving private collectors and hospitality venues.' },
  { year: '2022', title: 'National Expansion', desc: 'We expand our white-glove delivery service to all 50 states, cementing our position as America\'s premier humidor destination.' },
  { year: '2024', title: 'Digital Flagship', desc: 'Our newly designed online flagship store launches, offering the full collection with seamless checkout and expert consultation booking.' },
];
```

Replace with:
```typescript
const milestones = [
  { year: '2025', title: 'Founded', desc: 'Brian\'s vision becomes Dunn\'s Luxury Selections, bringing curated precision-engineered humidors to discerning collectors nationwide.' },
  { year: '2026', title: 'Strategic Partnerships', desc: 'Partnered with industry-leading brands — Raching, Akar, Humidor Supreme, Palio, Cigar Caddy, and Stinky — collectively representing 200+ years of expertise in humidor engineering and design.' },
];
```

- [ ] **Step 3: Verify timeline renders with 2 milestones**

Expected: Timeline now shows only 2 milestones (2025 and 2026), alternating left/right layout, gold vertical line connects them.

- [ ] **Step 4: Check mobile layout**

Resize to 375px. Expected: Milestones stack vertically, centered, still visually connected.

- [ ] **Step 5: Commit**

```bash
git add src/components/About.tsx
git commit -m "refactor: replace timeline with authentic 2025-2026 milestones"
```

---

## Task 5: Update Page Structure Labels (Act 1 → Act 2)

**Files:**
- Modify: `src/components/About.tsx` (section labels/headings)

**Context:** Reorganize page section labels to clearly show the two-act structure. The "Our Journey" / "Values" sections become part of "Act 2: The Vision Realized".

- [ ] **Step 1: Update "What We Stand For" section label**

Current (line ~93):
```jsx
<span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">What We Stand For</span>
```

This stays the same (it's Act 2 context).

- [ ] **Step 2: Update "Our Journey" section to clarify timeline**

Current (line ~122):
```jsx
<span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Journey</span>
```

Replace with:
```jsx
<span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Timeline</span>
```

And update the heading (line ~125):
```jsx
<h2 className="font-serif text-4xl text-white font-bold">
  A Legacy of <span className="text-gradient-gold italic">Excellence</span>
</h2>
```

Replace with:
```jsx
<h2 className="font-serif text-4xl text-white font-bold">
  From Vision to <span className="text-gradient-gold italic">Reality</span>
</h2>
```

- [ ] **Step 3: Verify section labels and headings display correctly**

Expected: Timeline section now labeled "Our Timeline" with heading "From Vision to Reality".

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx
git commit -m "refactor: update section labels to clarify two-act structure"
```

---

## Task 6: Verify Values Section (Minor Updates)

**Files:**
- Modify: `src/components/About.tsx:11-32` (values data)

**Context:** The values section stays largely the same, but we verify the descriptions still align with "Brian's vision" context. No major changes needed.

- [ ] **Step 1: Review current values**

Lines 11-32 define the `values` array. Current values:
- Uncompromising Curation
- Expert Integrity
- Nationwide Commitment
- Passion for the Craft

All four values align perfectly with Brian's philosophy. No changes needed.

- [ ] **Step 2: Verify values render correctly in browser**

Expected: 4 value cards display with icons, titles, descriptions. Grid layout responsive.

- [ ] **Step 3: Commit (no changes needed, but document this)**

```bash
# No changes to values section — already aligned with Brian's vision
git status
```

Expected: Only modified files are About.tsx updates from previous tasks.

---

## Task 7: Visual Testing — Full Page

**Files:**
- Test: `src/components/About.tsx` (visual inspection)

**Context:** Test the complete redesigned About page in the browser to verify:
- Act 1 (hero + origin story + quote + transition) flows well
- Act 2 (mission + values + timeline + CTA) follows naturally
- All responsive breakpoints work (mobile, tablet, desktop)
- No visual regressions

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:5173 or similar.

- [ ] **Step 2: Navigate to /about page**

Open browser and go to: `http://localhost:5173/about`

- [ ] **Step 3: Test desktop layout (1280px+)**

Visual checklist:
- [ ] Hero section displays "The Man Behind It" headline
- [ ] Gold accent line appears above "Our Founder's Story"
- [ ] Origin story 4 paragraphs render clearly
- [ ] Founder quote is centered, gold text, visually prominent
- [ ] Transition text "What started as one man's vision..." appears
- [ ] Mission section ties back to Brian's philosophy
- [ ] Values cards display 4 items in 2x2 grid
- [ ] Timeline shows 2025 and 2026 milestones with gold connecting line
- [ ] Final CTA buttons work and are clickable
- [ ] No text overflow or truncation

- [ ] **Step 4: Test tablet layout (768px)**

Resize browser to 768px width.

Visual checklist:
- [ ] Hero text is readable (font sizes responsive)
- [ ] Origin story paragraphs stack naturally
- [ ] Founder quote still prominent
- [ ] Values grid adjusts to 2 columns
- [ ] Timeline milestones still alternate (or stack centered)
- [ ] CTA buttons responsive width

- [ ] **Step 5: Test mobile layout (375px)**

Resize browser to 375px width (iPhone-size).

Visual checklist:
- [ ] Hero section fully readable
- [ ] Paragraphs don't overflow
- [ ] Founder quote readable (font size scales down appropriately)
- [ ] Values stack to 1 column
- [ ] Timeline milestones stack vertically, centered
- [ ] CTA buttons stack vertically, full width
- [ ] Gold lines and accents still visible
- [ ] Spacing feels balanced (not cramped or stretched)

- [ ] **Step 6: Check color contrast**

- [ ] Gold text on dark background readable
- [ ] Cream text on charcoal background readable
- [ ] No WCAG contrast violations

- [ ] **Step 7: Test interactive elements**

- [ ] "Shop Collection" button links to `/all-collections`
- [ ] "Call Us" button triggers phone dial (tel: link)
- [ ] All links in footer work

- [ ] **Step 8: Document any issues**

If visual issues found:
- Take screenshot
- Note exact browser width and issue
- Report in commit message as "fixes:"

Expected outcome: Page should look professional, two-act structure should feel natural, no visual regressions from original.

- [ ] **Step 9: Commit**

If no changes were needed:
```bash
git status
# Verify all prior commits are present
```

If visual tweaks were needed, commit after fixes:
```bash
git add src/components/About.tsx
git commit -m "fix: resolve visual issues on responsive layouts"
```

---

## Task 8: TypeScript Type Check

**Files:**
- Test: `src/components/About.tsx` (type safety)

**Context:** Ensure TypeScript compilation passes without errors after all changes.

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected output:
```
> vite-react-typescript-starter@0.0.0 typecheck
> tsc --noEmit -p tsconfig.app.json

# No errors — clean exit
```

- [ ] **Step 2: If errors appear, fix them**

Common issues:
- String literals not properly quoted
- Missing prop types
- Icon imports incorrect

If errors occur, fix inline and re-run typecheck.

- [ ] **Step 3: Commit (if typecheck clean)**

```bash
git add src/components/About.tsx
git commit -m "refactor: ensure TypeScript typecheck passes"
```

Expected: TypeScript exits cleanly (exit code 0).

---

## Task 9: Final Verification & Summary

**Files:**
- Verify: All changes committed, no uncommitted changes

**Context:** Verify the complete redesign is committed and ready for deployment.

- [ ] **Step 1: Check git status**

```bash
git status
```

Expected: "On branch main" / "Your branch is ahead of 'origin/main' by X commits" / "nothing to commit, working tree clean"

- [ ] **Step 2: View commit log**

```bash
git log --oneline -5
```

Expected: Your 4-5 new commits appear at top:
- "refactor: update About hero section..."
- "feat: add Act 1 — Brian's origin story..."
- "refactor: update mission statement..."
- "refactor: replace timeline with authentic milestones..."
- "refactor: update section labels..."

- [ ] **Step 3: Verify page renders in production build**

```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 4: Review final About page one more time**

```bash
npm run dev
# Navigate to http://localhost:5173/about
```

Final visual check:
- [ ] Act 1 (hero + origin story + quote) feels cohesive
- [ ] Act 2 (mission + values + timeline + CTA) flows naturally
- [ ] Two-act structure is clear and compelling
- [ ] No typos or grammatical errors
- [ ] Brand tone is consistent

- [ ] **Step 5: Push to main**

```bash
git push origin main
```

Expected: Changes pushed to GitHub, Netlify auto-deploys.

- [ ] **Step 6: Verify deployment**

Navigate to live site: https://dunnluxuryselections.com/about

Visual check:
- [ ] Page loads without errors
- [ ] About page matches local version
- [ ] Hero displays correctly
- [ ] All sections render

---

## Summary

✓ **Act 1 Complete:**
- Hero section rebranded to "The Man Behind It"
- 4-paragraph origin story narrative emphasizing custom/bespoke vision
- Founder quote prominently displayed
- Transition text bridges to Act 2

✓ **Act 2 Complete:**
- Updated mission statement ties back to Brian's philosophy
- Values section retained (already aligned)
- Timeline updated to authentic 2025-2026 milestones
- Section labels clarified
- CTA unchanged (still functional)

✓ **Quality Checks:**
- TypeScript typecheck passes
- Responsive design verified (desktop, tablet, mobile)
- Visual testing completed
- No regressions introduced
- All changes committed and pushed

---

## Architecture Decisions

**Why no new components?**
The About page structure was already well-organized. Restructuring Act 1 and Act 2 required only content changes to existing sections, not new components.

**Why update inline?**
The milestones and values data are component-level state (defined at top of About.tsx). Keeping them there maintains simplicity and readability.

**Why this ordering?**
Tasks are ordered to build logical sections top-to-bottom (hero → narrative → mission → values → timeline → CTA), matching user reading flow. Visual testing comes last to verify the complete page works.
