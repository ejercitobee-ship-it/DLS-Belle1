import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  CheckCircle2,
  Zap,
  Thermometer,
  Droplets,
  Box,
  Loader2,
  ZoomIn,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle, type ShopifyProduct } from '../lib/shopify';
import { getProductPrice, getDefaultVariantId, formatMoney } from '../hooks/useShopifyCollection';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={
            s <= Math.round(rating)
              ? 'text-gold-500 fill-gold-500'
              : 'text-charcoal-600'
          }
        />
      ))}
    </div>
  );
}

function parseSpecsFromDescription(description: string): Record<string, string> {
  const specs: Record<string, string> = {};
  const lines = description.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*[-•*]?\s*([^:]+):\s*(.+)$/);
    if (match) {
      const key = match[1].trim().toLowerCase();
      const value = match[2].trim();
      if (key && value) specs[key] = value;
    }
  }
  return specs;
}

function extractFeatures(description: string): string[] {
  const features: string[] = [];
  const lines = description.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('-') ||
      trimmed.startsWith('•') ||
      trimmed.startsWith('*')
    ) {
      const feat = trimmed.replace(/^[-•*]\s*/, '').trim();
      if (feat && feat.length > 3) features.push(feat);
    }
  }
  return features;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductPage({ handle }: { handle: string }) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const p = await fetchProductByHandle(handle);
        if (!cancelled) {
          if (p) {
            setProduct(p);
            setSelectedImage(0);
            setSelectedVariant(0);
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [handle]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-gold-500 animate-spin" />
          <p className="text-cream-200/40 text-sm tracking-widest uppercase">Loading Product</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-charcoal-900 border border-red-500/30 rounded-lg p-8 text-center">
          <h2 className="text-white font-serif text-xl font-bold mb-3">Product Not Found</h2>
          <p className="text-cream-200/50 text-sm mb-6">{error || 'This product does not exist or has been removed.'}</p>
          <a
            href="/all-collections"
            className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={14} />
            Back to Collections
          </a>
        </div>
      </div>
    );
  }

  // After this point product is guaranteed non-null
  const prod = product!;

  const { price, compareAt } = getProductPrice(prod);
  const variant = prod.variants[selectedVariant] ?? prod.variants[0];
  const variantPrice = variant
    ? formatMoney(variant.price.amount, variant.price.currencyCode)
    : price;
  const variantCompare = variant?.compareAtPrice
    ? formatMoney(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)
    : compareAt;

  const allImages = prod.images.length
    ? prod.images.map((i) => i.url)
    : [prod.featuredImage?.url].filter(Boolean) as string[];

  const specs = parseSpecsFromDescription(prod.description);
  const features = extractFeatures(prod.description);

  const hasSpecs = Object.keys(specs).length > 0;

  function handleAddToCart() {
    const variantId = getDefaultVariantId(prod);
    const img = allImages[0] ?? '';
    addItem({
      id: prod.id,
      shopifyVariantId: variantId,
      name: prod.title,
      price: variantPrice,
      priceNum: parseFloat(variant?.price.amount ?? prod.priceRange.minVariantPrice.amount),
      image: img,
      category: prod.productType,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function goBack() {
    window.history.back();
  }

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-xs tracking-widest uppercase font-medium transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Images ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-charcoal-900 rounded-xl overflow-hidden border border-charcoal-800/50 group">
              {allImages[selectedImage] ? (
                <>
                  <img
                    src={allImages[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setZoomImage(allImages[selectedImage])}
                    className="absolute top-4 right-4 w-10 h-10 bg-charcoal-950/80 backdrop-blur-sm border border-charcoal-700/50 rounded-full flex items-center justify-center text-cream-200/60 hover:text-gold-400 hover:border-gold-500/40 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Zoom image"
                  >
                    <ZoomIn size={16} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-cream-200/20 text-xs tracking-widest uppercase">No Image</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === selectedImage
                        ? 'border-gold-500'
                        : 'border-charcoal-800/50 hover:border-gold-600/40'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            {/* Product type */}
            {product.productType && (
              <span className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">
                {product.productType}
              </span>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-4">
              {product.title}
            </h1>

            {/* Rating (placeholder based on tags) */}
            {product.tags.some((t) => t.toLowerCase().includes('bestseller')) && (
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={4.9} />
                <span className="text-cream-200/40 text-xs">4.9 · Verified Reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white font-serif">{variantPrice}</span>
              {variantCompare && (
                <span className="text-lg text-cream-200/30 line-through">{variantCompare}</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <p className="text-cream-200/60 leading-relaxed text-sm">
                  {product.description.split('\n')[0]}
                </p>
              </div>
            )}

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <span className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-2 block">
                  Select Option
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(idx)}
                      className={`px-4 py-2 rounded text-xs font-medium tracking-wide transition-all ${
                        idx === selectedVariant
                          ? 'bg-gold-gradient text-charcoal-950'
                          : 'bg-charcoal-900 border border-charcoal-700/50 text-cream-200/60 hover:border-gold-500/40 hover:text-cream-100'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs grid */}
            {hasSpecs && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {Object.entries(specs).slice(0, 6).map(([key, value]) => {
                  const icon =
                    key.includes('capacity') || key.includes('size') ? Box :
                    key.includes('temp') || key.includes('temperature') ? Thermometer :
                    key.includes('humid') ? Droplets :
                    key.includes('cool') || key.includes('power') ? Zap :
                    CheckCircle2;
                  const Icon = icon;
                  return (
                    <div
                      key={key}
                      className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={13} className="text-gold-500" />
                        <span className="text-cream-200/40 text-[10px] tracking-[0.2em] uppercase">
                          {key}
                        </span>
                      </div>
                      <p className="text-cream-100 text-xs font-medium leading-snug">{value}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8">
                <span className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3 block">
                  Key Features
                </span>
                <div className="flex flex-wrap gap-2">
                  {features.slice(0, 8).map((feat) => (
                    <span
                      key={feat}
                      className="text-xs text-cream-200/70 bg-charcoal-900 border border-charcoal-800/50 px-3 py-1.5 rounded-full"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && !features.length && (
              <div className="mb-8">
                <span className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3 block">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 10).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-cream-200/70 bg-charcoal-900 border border-charcoal-800/50 px-3 py-1.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-auto pt-4">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full flex items-center justify-center gap-3 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {added ? (
                  <>
                    <CheckCircle2 size={16} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                  </>
                )}
              </button>
              <p className="text-cream-200/25 text-[10px] text-center mt-3 tracking-wide">
                Free shipping on selected items. Taxes calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Description ── */}
      {product.descriptionHtml && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="border-t border-charcoal-800/50 pt-12">
            <h2 className="font-serif text-2xl text-white font-bold mb-6">Product Details</h2>
            <div
              className="prose-article max-w-3xl"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      )}

      {/* ── Zoom Modal ── */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal-800/80 text-white hover:bg-charcoal-700 transition-colors"
            onClick={() => setZoomImage(null)}
            aria-label="Close zoom"
          >
            <X size={20} />
          </button>
          <img
            src={zoomImage}
            alt={product.title}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
