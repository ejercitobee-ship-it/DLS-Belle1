# Hero Image Optimization

## Current Status

**File:** `hero-bg.png`
- **Size:** 2.2 MB
- **Format:** PNG
- **Status:** Live on production

## WebP Conversion (Pending)

To optimize the hero image further, convert to WebP format:

### Option 1: Using Online Converter
1. Visit: https://convertio.co/png-webp/
2. Upload: `hero-bg.png`
3. Quality: 80%
4. Download: `hero-bg.webp`
5. Save to: `public/images/hero-bg.webp`

### Option 2: Using FFmpeg (Command Line)
```bash
ffmpeg -i hero-bg.png -c:v libwebp -quality 80 hero-bg.webp
```

### Option 3: Using ImageMagick
```bash
magick convert hero-bg.png -quality 80 hero-bg.webp
```

### Option 4: Using Node.js
```bash
npm install -g sharp-cli
sharp input.png output.webp --quality 80
```

## Expected Results

- **PNG:** 2.2 MB
- **WebP:** ~600-800 KB (estimated)
- **Savings:** ~65-70%
- **Quality:** Visually indistinguishable at quality 80

## Integration

Once WebP is created:

1. Add `hero-bg.webp` to `public/images/`
2. Update `src/components/Hero.tsx` to use picture element:

```jsx
<picture>
  <source srcSet="/images/hero-bg.webp" type="image/webp" />
  <img src="/images/hero-bg.png" alt="Luxury humidor" />
</picture>
```

3. Commit and push

## Performance Impact

- Faster page loads (~20-30% improvement on image)
- Better Core Web Vitals scores
- Reduced bandwidth usage
- Improved SEO ranking

## Status

- [ ] Create WebP variant
- [ ] Update Hero component
- [ ] Commit and deploy
- [ ] Verify in DevTools Network tab
