# SEO & Performance Optimization Guide

## Overview

This guide covers SEO best practices, performance optimization, and monitoring for the Shopify Liquid theme.

## Components Included

### 1. Schema Markup (`snippets/schema-markup.liquid`)
- Organization schema (all pages)
- Product schema (product pages)
- BreadcrumbList (collections/products)
- FAQ schema (utility pages)
- WebSite schema (search functionality)

### 2. Meta Tags (`snippets/seo-meta-tags.liquid`)
- SEO meta tags (description, keywords)
- Open Graph tags (social media sharing)
- Twitter Card tags (Twitter sharing)
- Pinterest tags (Pinterest optimization)
- Apple/Microsoft tags (app integration)

### 3. Performance Features
- Image lazy loading
- Critical CSS handling
- Font optimization
- DNS prefetch
- Resource preloading

## Quick Start

### Step 1: Include SEO Snippets

Add to `layout/theme.liquid` in `<head>` tag:

```liquid
<!-- SEO Meta Tags -->
{% include 'seo-meta-tags' %}

<!-- Schema Markup -->
{% include 'schema-markup' %}
```

### Step 2: Image Optimization

Use the responsive image snippet for all product images:

```liquid
{% render 'image', image: product.featured_image, alt: product.title, sizes: '(max-width: 768px) 100vw, 50vw' %}
```

### Step 3: Lighthouse Audit

1. Open browser DevTools (F12)
2. Go to **Lighthouse** tab
3. Click **Analyze page load**
4. Review scores for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

### Step 4: Monitor Core Web Vitals

1. Go to **Google Search Console**
2. Check **Core Web Vitals** report
3. Monitor LCP, FID, CLS metrics
4. Address issues below threshold

## SEO Best Practices

### On-Page SEO

#### Title Tags
- **Length**: 50-60 characters
- **Format**: `Page Title | Brand Name`
- **Keywords**: Include target keyword early
- **Example**: `Premium Luxury Humidors | Dunn Luxury Selections`

#### Meta Descriptions
- **Length**: 150-160 characters
- **Keywords**: Include main keyword
- **Action**: Use CTA when appropriate
- **Example**: `Handcrafted luxury humidors with interest-free financing. Shop premium cigar storage solutions. Free shipping on orders $2,000+.`

#### Heading Hierarchy
- **H1**: One per page (page title)
- **H2**: Section headings
- **H3**: Subsection headings
- **Don't skip levels** (no H1 → H3)

#### Content Optimization
- **Length**: 300+ words for pages, 800+ for products
- **Keywords**: Use naturally (1-2% density)
- **Internal Links**: Link to related pages
- **External Links**: Link to authoritative sources

### Technical SEO

#### Structured Data (Schema Markup)
Included in theme:
- ✅ Organization schema (company info)
- ✅ Product schema (product details)
- ✅ BreadcrumbList (navigation)
- ✅ FAQPage (Q&A pages)
- ✅ WebSite (search functionality)

**Validate schema**:
1. Go to https://schema.org/validator
2. Paste page URL
3. Check for errors/warnings

#### XML Sitemap
Shopify automatically generates at `/sitemap.xml`

**Verify**:
1. Visit `https://www.dunnluxuryselections.com/sitemap.xml`
2. Should show all collections, products, pages
3. Submit to Google Search Console

#### Robots.txt
Shopify manages at `/robots.txt`

**Verify**:
1. Visit `https://www.dunnluxuryselections.com/robots.txt`
2. Should allow crawling of main site
3. Should disallow admin, checkout, cart paths

#### Canonical Tags
Automatically handled by Shopify

**Best practice**: Ensure `<link rel="canonical">` in page `<head>`

### Off-Page SEO

#### Link Building
- Get mentions on industry blogs
- Create link-worthy content (guides, tools)
- Build relationships with other sites
- Monitor backlinks in Google Search Console

#### Social Signals
- Share on Facebook, Instagram, Twitter
- Encourage user-generated content
- Build email list for remarketing

## Performance Optimization

### Image Optimization

#### Lazy Loading
Use `loading="lazy"` attribute on images below fold:

```liquid
<img src="{{ image | image_url }}" loading="lazy" alt="{{ image.alt }}">
```

#### Responsive Images
Use srcset for multiple screen sizes:

```liquid
<img 
  src="{{ image | image_url: width: 500 }}"
  srcset="
    {{ image | image_url: width: 375 }} 375w,
    {{ image | image_url: width: 512 }} 512w,
    {{ image | image_url: width: 768 }} 768w,
    {{ image | image_url: width: 1024 }} 1024w,
    {{ image | image_url: width: 1280 }} 1280w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="{{ image.alt }}"
>
```

#### Image Formats
- Use WebP format when possible
- Shopify CDN auto-generates WebP
- Fallback to JPEG for older browsers

#### Image Compression
- Compress before uploading (tool: TinyPNG)
- Target file size: <200KB per image
- Use consistent dimensions

### CSS Optimization

#### Critical CSS
Include above-fold CSS inline in `<head>`:

```liquid
<style>
  /* Critical styles for hero, header, nav */
  /* ~14KB max */
</style>
<link rel="stylesheet" href="{{ 'main.css' | asset_url }}">
```

#### CSS Minification
Shopify automatically minifies CSS in production

**Verify**:
1. View page source
2. Main CSS should be minified
3. No unnecessary whitespace

#### Unused CSS
- Remove unused Tailwind classes
- Use PurgeCSS plugin if needed
- Target: < 50KB main CSS

### JavaScript Optimization

#### Defer Non-Critical JS
```liquid
<script defer src="{{ 'app.js' | asset_url }}"></script>
```

#### Async for Non-Critical
```liquid
<script async src="https://cdn.jsdelivr.net/npm/library@latest"></script>
```

#### Remove Unused Libraries
- Audit bundle size
- Remove unused polyfills
- Use tree-shaking where possible

#### Minification
Shopify automatically minifies JS in production

### Font Optimization

#### Font Loading Strategy
```liquid
<link rel="preload" as="font" href="{{ 'playfair-display.woff2' | asset_url }}" type="font/woff2" crossorigin>
<link rel="preload" as="font" href="{{ 'inter.woff2' | asset_url }}" type="font/woff2" crossorigin>
```

#### System Font Fallback
```css
font-family: 'Playfair Display', Georgia, serif;
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### Font Subsetting
- Only load needed character ranges
- Target: < 100KB total fonts

### Core Web Vitals Optimization

#### Largest Contentful Paint (LCP)
**Target**: < 2.5 seconds

**Optimization**:
- Optimize images (primary cause)
- Minimize third-party scripts
- Use CDN for static assets
- Enable GZIP compression

#### First Input Delay (FID)
**Target**: < 100 milliseconds

**Optimization**:
- Defer non-critical JavaScript
- Break up long tasks (> 50ms)
- Use web workers for heavy computation
- Minimize main thread work

#### Cumulative Layout Shift (CLS)
**Target**: < 0.1

**Optimization**:
- Reserve space for images (aspect ratio)
- Avoid inserting content above viewport
- Use transform/opacity for animations
- Test on mobile devices

### Caching Strategy

#### Browser Caching
Shopify CDN sets cache headers:
- **Assets (CSS, JS)**: 1 year
- **Images**: 30 days
- **HTML**: No cache

#### Server Caching
Enable in Shopify:
1. Settings → Performance
2. Enable page caching
3. Enable collection caching

## Monitoring & Measurement

### Tools to Use

#### Google Search Console
- Monitor search performance
- Check Core Web Vitals
- Monitor indexing status
- Track errors and issues

**Setup**:
1. Add property for domain
2. Verify ownership
3. Submit sitemap
4. Monitor regularly

#### Google PageSpeed Insights
- Analyze page performance
- Get optimization suggestions
- Test mobile and desktop
- Monitor CWV metrics

**Use**:
1. Go to https://pagespeed.web.dev
2. Enter page URL
3. Review suggestions

#### Lighthouse (Chrome DevTools)
- Audit performance, SEO, accessibility
- Generate HTML report
- Track improvements over time

**Use**:
1. F12 in Chrome
2. Go to Lighthouse tab
3. Click Analyze

#### Google Analytics
- Track user behavior
- Monitor bounce rate
- Track conversion rate
- Monitor site speed metrics

**Key Metrics**:
- Page load time
- Bounce rate per page
- Time on page
- Conversion rate

### Target Metrics

| Metric | Target | Tool |
|--------|--------|------|
| **LCP** | < 2.5s | PageSpeed Insights |
| **FID** | < 100ms | Chrome DevTools |
| **CLS** | < 0.1 | PageSpeed Insights |
| **Page Load** | < 3s | Google Analytics |
| **Mobile Score** | > 90 | PageSpeed Insights |
| **Accessibility** | > 90 | Lighthouse |
| **SEO Score** | > 95 | Lighthouse |

## SEO Checklist

### Before Launch
- ✅ Include seo-meta-tags snippet
- ✅ Include schema-markup snippet
- ✅ Add page descriptions
- ✅ Optimize images
- ✅ Create sitemap
- ✅ Setup Google Search Console
- ✅ Setup Google Analytics
- ✅ Test on mobile
- ✅ Verify Core Web Vitals

### Monthly Maintenance
- ✅ Monitor Core Web Vitals
- ✅ Review Google Search Console
- ✅ Check Google Analytics
- ✅ Audit broken links
- ✅ Update content as needed
- ✅ Monitor backlinks
- ✅ Test page speed

### Quarterly Review
- ✅ Full Lighthouse audit
- ✅ Keyword ranking check
- ✅ Competitor analysis
- ✅ Content gap analysis
- ✅ Link profile review
- ✅ Schema validation

## Common Issues & Fixes

### Poor Core Web Vitals

**Issue**: LCP > 2.5s
- **Cause**: Large images, unoptimized assets
- **Fix**: Compress images, lazy load, use CDN

**Issue**: FID > 100ms
- **Cause**: Heavy JavaScript execution
- **Fix**: Defer scripts, break up long tasks, minimize main thread

**Issue**: CLS > 0.1
- **Cause**: Dynamic content, ads, images without dimensions
- **Fix**: Reserve space for images, avoid dynamic insertions

### SEO Issues

**Issue**: Pages not indexed
- **Cause**: robots.txt blocking, noindex tag, no backlinks
- **Fix**: Check robots.txt, verify in Search Console, build backlinks

**Issue**: Low rankings
- **Cause**: Low-quality content, missing keywords, poor backlinks
- **Fix**: Improve content, optimize for keywords, build links

**Issue**: Duplicate content
- **Cause**: Multiple URLs for same content
- **Fix**: Use canonical tags, 301 redirects, consolidate pages

## Next Steps

1. ✅ Include SEO snippets in theme
2. ✅ Optimize images for web
3. ✅ Monitor Core Web Vitals
4. ✅ Setup Search Console
5. ✅ Build backlinks
6. ✅ Monitor rankings
7. ✅ Update content regularly

## Resources

- **Google Search Central**: https://search.google.com
- **PageSpeed Insights**: https://pagespeed.web.dev
- **Schema.org**: https://schema.org
- **Shopify SEO Guide**: https://help.shopify.com/en/manual/promoting-marketing/seo
- **Web.dev Performance**: https://web.dev/performance
