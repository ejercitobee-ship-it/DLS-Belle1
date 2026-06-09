# Image Optimization Guide

## WebP Conversion

All product images have WebP variants for optimized delivery. The LazyImage component automatically detects browser support and serves WebP when available, with PNG/JPG fallback.

### Current Images

The following images are stored in `public/images/`:

- `hero-bg.png` - Hero section background image
- `bespoke-walk-in-humidor.png` - Bespoke walk-in humidor showcase
- `collections-travel-humidors.png` - Travel humidors collection image
- `og-image.jpg` - Open Graph image for social sharing
- `logo.png` - Brand logo

### WebP Variants to Create

WebP files should be created alongside originals with `.webp` extension:

```
public/images/
├── hero-bg.webp ← hero-bg.png (25-35% smaller)
├── bespoke-walk-in-humidor.webp ← bespoke-walk-in-humidor.png
├── collections-travel-humidors.webp ← collections-travel-humidors.png
├── og-image.webp ← og-image.jpg
└── logo.webp ← logo.png
```

### How to Convert Images to WebP

#### Option 1: Using FFmpeg (Command Line - Recommended)

FFmpeg offers the best control and quality settings:

```bash
# Install FFmpeg
# macOS: brew install ffmpeg
# Windows: https://ffmpeg.org/download.html
# Linux: apt-get install ffmpeg

# Convert with quality 80 (recommended)
ffmpeg -i image.jpg -c:v libwebp -quality 80 image.webp

# Convert multiple files
for file in *.jpg; do
  ffmpeg -i "$file" -c:v libwebp -quality 80 "${file%.jpg}.webp"
done
```

#### Option 2: Using Online Converter

Quick and no installation required:

1. Visit: https://convertio.co/jpg-webp/ or https://cloudconvert.com/jpg-to-webp
2. Upload your image
3. Set quality to 80
4. Download the WebP version

#### Option 3: Using VS Code Extension

If you prefer a GUI:

1. Install "WebP Converter" extension in VS Code
2. Right-click image → Convert to WebP
3. Configure quality in extension settings

#### Option 4: Using macOS Preview (Quick)

For quick conversions on macOS:

1. Open image in Preview
2. File → Export As
3. Format → Choose "WebP"
4. Quality → 80
5. Save

### Quality Settings Guide

- **Quality 75:** Smaller file size (15-25% reduction), visible compression artifacts on some images
- **Quality 80:** Recommended - Good balance of size and quality (25-35% reduction)
- **Quality 85:** Higher quality (20-30% reduction), slightly larger file size
- **Quality 90+:** Minimal compression, large file size - not recommended

### Performance Impact

Expected improvements when WebP is implemented:

| Metric | Improvement |
|--------|-------------|
| Image File Size | 25-35% smaller |
| Page Load Time | 15-20% faster |
| Core Web Vitals | Improved LCP/FID scores |
| Bandwidth Usage | 25-35% reduction |

### Browser Support

WebP support by browser:

- Chrome 25+ (2013)
- Firefox 65+ (2019)
- Safari 16+ (2022)
- Edge 18+ (2019)
- Opera 12.1+ (2012)
- **Coverage:** ~96% of users globally

The `LazyImage` component automatically:
1. Detects browser support for WebP
2. Serves WebP if supported
3. Falls back to original format if not supported

### Implementation in Components

The `LazyImage` component and `getWebPPath()` utility handle WebP delivery:

```typescript
import LazyImage from './LazyImage';
import { getWebPPath } from '../lib/imageOptimization';

<LazyImage
  src="/images/hero-bg.png"
  webpSrc={getWebPPath('/images/hero-bg.png')}
  alt="Hero background"
  className="w-full"
/>
```

This will:
- Request `/images/hero-bg.webp` in WebP-capable browsers
- Fall back to `/images/hero-bg.png` in older browsers
- Handle lazy loading and responsive images

### Verification

To verify WebP images are being served correctly:

1. **Open DevTools Network Tab:**
   - Press F12 or Right-click → Inspect
   - Go to Network tab
   - Filter by "webp"

2. **Load a Page with Images:**
   - Navigate to a page with LazyImage components
   - Look for `.webp` file requests

3. **Check Network Requests:**
   - If WebP images appear in requests, conversion is working
   - If only original format appears, your browser may not support WebP
   - Mobile browsers will request WebP (iOS Safari 16+, Android Chrome)

4. **Test in Different Browsers:**
   - Modern browsers (Chrome, Firefox, Safari 16+): Should request .webp
   - Older browsers: Will request original format
   - Both should work without errors

### Batch Conversion Script

For converting all images at once, use this bash script:

```bash
#!/bin/bash
# Save as: convert_to_webp.sh

TARGET_DIR="${1:-.}"
QUALITY="${2:-80}"

echo "Converting images in $TARGET_DIR to WebP (quality: $QUALITY)..."

for file in "$TARGET_DIR"/*.{jpg,jpeg,png}; do
  [ -e "$file" ] || continue
  output="${file%.*}.webp"
  echo "Converting: $file → $output"
  ffmpeg -i "$file" -c:v libwebp -quality "$QUALITY" "$output" -y
done

echo "Conversion complete!"
```

Usage:
```bash
chmod +x convert_to_webp.sh
./convert_to_webp.sh public/images 80
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| WebP file is too large | Reduce quality setting (try 75) |
| WebP looks compressed | Increase quality (try 85) |
| WebP not being served | Check filename matches pattern (remove special chars) |
| Some browsers show broken images | Ensure fallback image exists and is correct |
| Conversion fails | Check image file format is valid JPEG/PNG/GIF |

### Next Steps

1. Convert all images in `public/images/` to WebP format
2. Test in different browsers (use DevTools Network tab)
3. Verify file size reduction (should be 25-35% smaller)
4. Monitor Core Web Vitals improvement in Google Analytics
5. Update any hardcoded image paths to use LazyImage component

### References

- WebP Format: https://developers.google.com/speed/webp
- LazyImage Component: `src/components/LazyImage.tsx`
- Image Optimization Utility: `src/lib/imageOptimization.ts`
- Schema.org ImageObject: https://schema.org/ImageObject
