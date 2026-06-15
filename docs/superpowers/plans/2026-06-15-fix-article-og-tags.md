# Fix Article Open Graph Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dynamic Open Graph meta tags to Journal and ArticlePage components so articles display correct titles, descriptions, and images when shared on Facebook/Meta instead of showing generic homepage metadata.

**Architecture:** Import the existing `usePageMeta` hook into both Journal.tsx (for the listing page) and ArticlePage.tsx (for individual articles). For Journal.tsx, set page-level meta with /journal canonical. For ArticlePage.tsx, call usePageMeta with article-specific title, description, image URL, and canonical path constructed from the article handle. This ensures Facebook's Sharing Debugger reads article-specific OG tags from the initial HTML.

**Tech Stack:** React hooks (usePageMeta), Shopify article data structure (ShopifyArticle with title, excerpt, image, handle)

---

## Task 1: Add OG tags to Journal.tsx (listing page)

**Files:**
- Modify: `src/components/Journal.tsx` (add import and usePageMeta call)

- [ ] **Step 1: Import usePageMeta hook**

At the top of `src/components/Journal.tsx`, after the existing imports (around line 3), add:

```typescript
import { usePageMeta } from '../hooks/usePageMeta';
```

File should now have imports like:
```typescript
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User, Loader2, Tag } from 'lucide-react';
import { fetchArticles, type ShopifyArticle } from '../lib/shopify';
import { usePageMeta } from '../hooks/usePageMeta';
```

- [ ] **Step 2: Call usePageMeta with Journal page metadata**

Inside the `Journal()` function body (after line 177, before the return statement), add this call right after the state initialization:

```typescript
usePageMeta({
  title: "The Dunn's Journal | Stories of Craft, Culture & Connoisseurship",
  description: "Insights on cigar care, collector culture, and the art of the perfect smoke. Read expert guides and brand stories from Dunn's Luxury Selections.",
  canonicalPath: '/journal',
  ogImage: 'https://dunnluxuryselections.com/og-image.jpg',
});
```

Add it right after line 180 (`const [activeCategory, setActiveCategory] = useState<Category>('All');`), before the `useEffect`.

- [ ] **Step 3: Verify syntax**

Run syntax check:
```bash
cd C:\Users\ejerc\DLS-Belle1
npm run typecheck
```

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/Journal.tsx
git commit -m "feat: add dynamic OG tags to Journal listing page"
```

---

## Task 2: Add article-specific OG tags to ArticlePage.tsx

**Files:**
- Modify: `src/components/ArticlePage.tsx` (add import and usePageMeta call)

- [ ] **Step 1: Import usePageMeta hook**

At the top of `src/components/ArticlePage.tsx`, after the existing imports (around line 3), add:

```typescript
import { usePageMeta } from '../hooks/usePageMeta';
```

File should now have imports like:
```typescript
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Loader2, AlertCircle } from 'lucide-react';
import { fetchArticleByHandle, fetchArticles, type ShopifyArticle } from '../lib/shopify';
import { usePageMeta } from '../hooks/usePageMeta';
```

- [ ] **Step 2: Call usePageMeta with article-specific metadata when article loads**

Inside the `ArticlePage()` function body (around line 107), after the `useState` declarations (after line 117), add this code to set OG tags when article is loaded:

```typescript
// Set OG tags when article is loaded
useEffect(() => {
  if (article) {
    const articlePath = `/journal/${article.blog.handle}/${article.handle}`;
    const articleImage = article.image?.url || 'https://images.pexels.com/photos/5379763/pexels-photo-5379763.jpeg?auto=compress&cs=tinysrgb&w=1200';
    
    usePageMeta({
      title: `${article.title} | Dunn's Luxury Selections`,
      description: article.excerpt || `Read this article from Dunn's Luxury Selections Journal.`,
      canonicalPath: articlePath,
      ogImage: articleImage,
    });
  }
}, [article]);
```

This `useEffect` hook will run whenever the `article` state changes, setting the meta tags once the article is fetched.

**Where to place it:** Add this right after the main `useEffect` (after line 156, before the return statement).

- [ ] **Step 3: Verify syntax**

Run syntax check:
```bash
cd C:\Users\ejerc\DLS-Belle1
npm run typecheck
```

Expected: No TypeScript errors

- [ ] **Step 4: Commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add src/components/ArticlePage.tsx
git commit -m "feat: add dynamic article-specific OG tags to ArticlePage"
```

---

## Task 3: Build and verify OG tags are set correctly

**Files:**
- Test: HTML output verification
- No code changes

- [ ] **Step 1: Build the project**

```bash
cd C:\Users\ejerc\DLS-Belle1
npm run build
```

Expected: Build completes successfully without errors related to Journal or ArticlePage.

- [ ] **Step 2: Verify Journal page OG tags in dist**

After build, check the generated HTML includes the Journal page OG tags:

```bash
# Check if Journal page was generated with OG tags
$journalFile = Get-ChildItem -Path "C:\Users\ejerc\DLS-Belle1\dist" -Recurse -Include "index.html" -Path "*journal*" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($journalFile) {
  $content = Get-Content $journalFile.FullName -Raw
  if ($content -match "The Dunn's Journal") {
    Write-Host "✓ Journal OG title found"
  } else {
    Write-Host "✗ Journal OG title not found"
  }
}
```

Expected: ✓ Journal OG title found (or verify manually that the Journal component includes the meta tags)

- [ ] **Step 3: Test with Meta Sharing Debugger**

Open Facebook's Sharing Debugger: https://developers.facebook.com/tools/debug/

Test two URLs:
1. `https://dunnluxuryselections.com/journal` 
   - Should show: "The Dunn's Journal | Stories of Craft, Culture & Connoisseurship"
   - Should show: Journal description

2. `https://dunnluxuryselections.com/#article/blog-handle/article-handle` (replace with actual article)
   - Should show: Article title
   - Should show: Article excerpt/description
   - Should show: Article featured image

For each URL:
- Paste into the debugger
- Click "Scrape Again"
- Verify og:title, og:description, og:image show correct content (not generic homepage)

Expected: Both URLs show article-specific metadata in the Sharing Debugger preview.

- [ ] **Step 4: Commit verification**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add -A
git commit -m "test: verify article OG tags render correctly in build output"
```

---

## Task 4: Deploy and test on production

**Files:**
- Deploy to production
- No code changes

- [ ] **Step 1: Push commits to production**

```bash
cd C:\Users\ejerc\DLS-Belle1
git log --oneline -3  # Verify the 2 commits are there
git push origin main
```

Expected: Both commits pushed successfully.

- [ ] **Step 2: Wait for production deployment**

Wait 2-5 minutes for Cloudflare Pages to rebuild and deploy.

- [ ] **Step 3: Test production URLs in Meta Sharing Debugger**

Open https://developers.facebook.com/tools/debug/

Test production URLs:
1. `https://dunnluxuryselections.com/journal`
   - Verify OG title is Journal-specific
   
2. Copy a product URL from your Journal page and test it
   - Verify OG title is article-specific
   - Click "Scrape Again" to force refresh

Expected: Production URLs show correct article-specific OG metadata in the preview.

- [ ] **Step 4: Test sharing to Facebook**

Go to your Facebook page and try sharing an article URL:
1. Paste article URL in a post
2. Watch the preview appear with article title, description, image
3. Post it

Expected: The article preview shows article-specific content (not generic homepage content).

- [ ] **Step 5: Final commit**

```bash
cd C:\Users\ejerc\DLS-Belle1
git add -A
git commit -m "deploy: article OG tags live in production"
```

---

## Self-Review Checklist

✅ **Spec coverage:**
- ✓ Journal.tsx: Add usePageMeta with /journal path (Task 1)
- ✓ ArticlePage.tsx: Add usePageMeta with article-specific metadata (Task 2)
- ✓ OG tags include: title, description, image, canonical (both tasks)
- ✓ Testing with Meta Sharing Debugger (Task 3)
- ✓ Production deployment and verification (Task 4)

✅ **Placeholder scan:**
- ✓ All code is complete and exact
- ✓ All commands are exact with expected output
- ✓ No "TBD" or "TODO" entries
- ✓ All usePageMeta calls show exact parameters

✅ **Type consistency:**
- ✓ Both components call usePageMeta with same interface: title, description, canonicalPath, ogImage
- ✓ ArticlePage constructs articlePath and articleImage consistently
- ✓ No naming conflicts

---

**Plan complete and saved.** Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch fresh subagents per task, code quality reviews after each, fast iteration

**2. Inline Execution** — Execute tasks directly in this session, batch with checkpoints

Which approach?
