import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  CheckCircle2,
  Loader2,
  ZoomIn,
  X,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle, type ShopifyProduct } from '../lib/shopify';
import { getStaticProduct, type StaticProductData } from '../lib/staticProducts';
import { getProductPrice, getDefaultVariantId, formatMoney } from '../hooks/useShopifyCollection';
import { usePageMeta } from '../hooks/usePageMeta';
import { PaymentMethods, CustomerReviews, WhyBuyFromUs, FreeShippingBanner } from './ConversionElements';
import { ProductRecommendations, ProductFAQ } from './ProductSections';
import FinancingCallout from './FinancingCallout';
import ProductSpecifications from './ProductSpecifications';
import { ShopWithConfidence, ReviewCallout } from './TrustBadges';
import { getProductSpecs } from '../lib/productSpecs';
import BreadcrumbSchema from './BreadcrumbSchema';
import SchemaMarkup from './SchemaMarkup';
import LazyImage from './LazyImage';
import { generateProductSchema } from '../lib/schemaMarkupHelpers';
import { qualifiesForFinancing } from '../lib/financing';
import { getWebPPath } from '../lib/imageOptimization';
import { getRelatedLinks } from '../lib/internalLinkMap';
import ShippingCalculator from './ShippingCalculator';
import { trackAddToCart, trackExpertChatClick } from '../lib/analytics';
import { CustomizationCTA } from './CustomizationCTA';

/* ─── Sub-components ─────────────────────────────────────────────────────────── */

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

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function ProductPage({ handle }: { handle: string }) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [staticProduct, setStaticProduct] = useState<StaticProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [added, setAdded] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { addItem } = useCart();

  // Dynamic meta tags — must be called before any early returns
  const productName = product?.title || staticProduct?.name || 'Humidor';
  const productPrice = product
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : staticProduct?.priceNum ?? 0;
  const hasFinancing = qualifiesForFinancing(productPrice);
  const baseDesc = product?.description ?? staticProduct?.description ?? 'Explore luxury humidors and cigar accessories.';
  const metaDesc = hasFinancing
    ? `${productName} - Premium humidor. Pay in 4 interest-free installments with Shop Pay. Free white-glove delivery.`
    : baseDesc.slice(0, 160);

  usePageMeta({
    title: product
      ? `${product.title} | Dunn's Luxury Selections`
      : staticProduct
      ? `${staticProduct.name} | Dunn's Luxury Selections`
      : "Dunn's Luxury Selections | Humidor Collections",
    description: metaDesc.slice(0, 160),
    canonicalPath: `/product/${handle}`,
    ogImage: product?.featuredImage?.url ?? staticProduct?.image,
  });

  useEffect(() => {
    if (!handle) {
      setError('Invalid product URL');
      setLoading(false);
      return;
    }

    // GA4 - View Item Event
    const viewItemEvent = () => {
      if (typeof window !== 'undefined' && (window as any).gtag && (product || staticProduct)) {
        const itemData = product || staticProduct;
        if (itemData) {
          const priceStr = 'price' in itemData ? itemData.price : undefined;
          const priceNum = priceStr ? parseFloat(priceStr.replace(/[^0-9.]/g, '')) : 0;
          (window as any).gtag('event', 'view_item', {
            currency: 'USD',
            value: priceNum,
            items: [{
              item_id: itemData.id || handle,
              item_name: 'name' in itemData ? itemData.name : itemData.title,
              price: priceNum,
            }],
          });
        }
      }
    };

    let cancelled = false;
    async function load(): Promise<void> {
      try {
        const p = await fetchProductByHandle(handle);
        if (!cancelled) {
          if (p) {
            setProduct(p);
            setStaticProduct(null);
            setSelectedImage(0);
            setSelectedVariant(0);
            // Fire view_item after product loads
            setTimeout(viewItemEvent, 500);
          } else {
            // Check static products fallback
            const sp = getStaticProduct(handle);
            if (sp) {
              setStaticProduct(sp);
              setProduct(null);
              // Fire view_item for static product
              setTimeout(viewItemEvent, 500);
            } else {
              setError('Product not found');
            }
          }
        }
      } catch (err) {
        if (!cancelled) {
          // On API error, try static fallback
          const sp = getStaticProduct(handle);
          if (sp) {
            setStaticProduct(sp);
            setProduct(null);
            // Fire view_item for static product
            setTimeout(viewItemEvent, 500);
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load product');
          }
        }
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

  if (error || (!product && !staticProduct)) {
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

  // Render static product if no Shopify product
  if (staticProduct) {
    return <StaticProductPage product={staticProduct} />;
  }

  const prod = product!;
  const { price, compareAt } = getProductPrice(prod);
  const variant = prod.variants[selectedVariant] ?? prod.variants[0];
  const variantPrice = variant
    ? formatMoney(variant.price.amount, variant.price.currencyCode)
    : price;
  const variantCompare = variant?.compareAtPrice
    ? formatMoney(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode)
    : compareAt;
  
  // Only show compare-at price if it's actually higher than the current price (real discount)
  const hasRealDiscount = variant?.compareAtPrice 
    && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);

  const allImages = prod.images?.length
    ? prod.images.map((i) => i.url)
    : prod.featuredImage?.url 
    ? [prod.featuredImage.url]
    : ['/images/hero-bg.png']; // Fallback image

  function handleAddToCart() {
    const variantId = getDefaultVariantId(prod);
    const img = allImages[0] ?? '';
    const priceNum = parseFloat(variant?.price.amount ?? prod.priceRange.minVariantPrice.amount);
    addItem({
      id: prod.id,
      shopifyVariantId: variantId,
      name: prod.title,
      price: variantPrice,
      priceNum: priceNum,
      image: img,
      category: prod.productType,
    });
    trackAddToCart(prod.title, priceNum, handle);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  /* ─── Render ───────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-charcoal-950 pb-32 lg:pb-24">
      {/* Free Shipping Banner */}
      <FreeShippingBanner />

      {/* Breadcrumb Navigation with Schema */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/all-collections' },
            { label: prod.productType || 'Products', href: `/collections/${prod.productType?.toLowerCase().replace(/\s+/g, '-') || 'all'}` },
            { label: prod.title, href: `/product/${handle}` }
          ]}
          className="mb-4"
        />
        <button
          onClick={() => {
            const prevPath = document.referrer;
            const currentHost = window.location.host;
            if (prevPath && prevPath.includes(currentHost)) {
              const url = new URL(prevPath);
              const path = url.pathname.replace(/^\//, '') || 'home';
              window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
            } else {
              window.dispatchEvent(new CustomEvent('navigate', { detail: 'collections' }));
            }
          }}
          className="inline-flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-xs tracking-widest uppercase font-medium transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      </div>

      {/* Product Schema Markup */}
      <SchemaMarkup
        schema={generateProductSchema({
          name: prod.title,
          description: prod.description || prod.descriptionHtml || 'Premium humidor product',
          image: prod.featuredImage?.url || allImages[0],
          price: parseFloat(variant?.price.amount ?? prod.priceRange.minVariantPrice.amount),
          url: `/product/${handle}`,
          rating: 4.9,
          reviewCount: 128,
          qualifiesForFinancing: qualifiesForFinancing(parseFloat(variant?.price.amount ?? prod.priceRange.minVariantPrice.amount)),
        })}
      />

      {/* ── Main Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* Left: Images */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-charcoal-900 rounded-xl overflow-hidden border border-charcoal-800/50 group">
              {allImages[selectedImage] ? (
                <>
                  <LazyImage
                    src={allImages[selectedImage]}
                    webpSrc={getWebPPath(allImages[selectedImage])}
                    alt={prod.title}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
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

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      idx === selectedImage ? 'border-gold-500' : 'border-charcoal-800/50 hover:border-gold-600/40'
                    }`}
                  >
                    <LazyImage
                      src={img}
                      webpSrc={getWebPPath(img)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            {prod.productType && (
              <span className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">
                {prod.productType}
              </span>
            )}

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-3">
              {prod.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <Stars rating={4.9} />
              <span className="text-cream-200/40 text-xs">4.9 · Verified Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-charcoal-800/50">
              <span className="text-3xl font-bold text-white font-serif">{variantPrice}</span>
              {hasRealDiscount && variantCompare && (
                <span className="text-lg text-cream-200/30 line-through">{variantCompare}</span>
              )}
            </div>

            {/* Financing */}
            <FinancingCallout
              priceNum={parseFloat(variant?.price.amount ?? prod.priceRange.minVariantPrice.amount)}
            />

            {/* Variants */}
            {prod.variants.length > 1 && (
              <div className="mb-6">
                <span className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-2 block">
                  Select Option
                </span>
                <div className="flex flex-wrap gap-2">
                  {prod.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(idx)}
                      className={`px-4 py-2.5 rounded text-xs font-medium tracking-wide transition-all ${
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

            {/* Trust Signals - Above Add to Cart */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-cream-200/60 text-xs">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                <span>Ships within 1–3 business days</span>
              </div>
              <div className="flex items-center gap-2 text-cream-200/60 text-xs">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                <span>Full manufacturer warranty</span>
              </div>
              <div className="flex items-center gap-2 text-cream-200/60 text-xs">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                <span>10-day return guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-cream-200/60 text-xs">
                <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                <span>White-glove delivery & setup included</span>
              </div>
            </div>

            {/* Specifications */}
            <ProductSpecifications specs={getProductSpecs(handle, prod.productType)} />

            {/* Shipping Calculator */}
            <ShippingCalculator
              productHandle={handle}
              productPrice={parseFloat(variant?.price.amount ?? prod.priceRange.minVariantPrice.amount)}
              productTags={prod.tags}
            />

            {/* Add to Cart */}
            <div className="mb-6">
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
            </div>

            {/* Expert Consultation Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  trackExpertChatClick();
                  // Open Tawk.to live chat
                  if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                    (window as any).Tawk_API.maximize();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-sm py-3 rounded-lg transition-colors border border-charcoal-700/50"
              >
                <MessageCircle size={16} />
                Expert Consultation
              </button>
            </div>

            {/* Shop with Confidence */}
            <ShopWithConfidence />
          </div>
        </div>
      </div>

      {/* ── Details Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="border-t border-charcoal-800/50 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left: Full Description */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl text-white font-bold mb-6">Product Details</h2>
              {prod.descriptionHtml ? (
                <div>
                  <div 
                    className={`prose-article overflow-hidden transition-all duration-300 ${showFullDesc ? '' : 'max-h-48'}`}
                    dangerouslySetInnerHTML={{ __html: prod.descriptionHtml }} 
                  />
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="mt-4 text-gold-400 hover:text-gold-300 text-sm font-medium flex items-center gap-1"
                  >
                    {showFullDesc ? 'Show less' : 'Read more'}
                    <ChevronDown size={16} className={`transform transition-transform ${showFullDesc ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : prod.description ? (
                <div>
                  <div className={`text-cream-200/60 leading-relaxed text-sm whitespace-pre-line overflow-hidden transition-all duration-300 ${showFullDesc ? '' : 'max-h-48'}`}>
                    {prod.description}
                  </div>
                  <button
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="mt-4 text-gold-400 hover:text-gold-300 text-sm font-medium flex items-center gap-1"
                  >
                    {showFullDesc ? 'Show less' : 'Read more'}
                    <ChevronDown size={16} className={`transform transition-transform ${showFullDesc ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <p className="text-cream-200/40 text-sm">No description available.</p>
              )}
            </div>

            {/* Right: Specs & Info */}
            <div className="space-y-8">
              {/* Tags */}
              {prod.tags.length > 0 && (
                <div>
                  <h3 className="text-white text-xs font-semibold tracking-[0.3em] uppercase mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {prod.tags.map((tag) => (
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

              {/* SKU / ID */}
              <div>
                <h3 className="text-white text-xs font-semibold tracking-[0.3em] uppercase mb-4">Product Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-200/40">SKU</span>
                    <span className="text-cream-100 font-mono text-xs">{prod.id.split('/').pop()}</span>
                  </div>
                  {prod.productType && (
                    <div className="flex justify-between">
                      <span className="text-cream-200/40">Type</span>
                      <span className="text-cream-100">{prod.productType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-cream-200/40">Availability</span>
                    <span className="text-emerald-400 text-xs">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products & Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="border-t border-charcoal-800/50 pt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white text-sm font-semibold tracking-[0.2em] uppercase mb-4">Related Collections</h3>
              <ul className="space-y-2">
                {getRelatedLinks(`/collections/${prod.productType?.toLowerCase().replace(/\s+/g, '-') || 'all'}`).map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-gold-400 hover:text-gold-300 text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product Recommendations */}
      <ProductRecommendations currentProductId={prod.id} currentHandle={handle} />

      {/* Customer Reviews - Social Proof */}
      <CustomerReviews productName={prod.title} />

      {/* Why Buy From Us */}
      <WhyBuyFromUs />

      {/* Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <PaymentMethods />
      </div>

      {/* Review Callout */}
      <ReviewCallout productName={prod.title} />

      {/* Product FAQ */}
      <ProductFAQ />

      {/* Customization CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20 lg:mb-12">
        <CustomizationCTA useCase="custom" />
      </div>

      {/* ── Sticky Mobile Button ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-charcoal-950 border-t border-charcoal-800/50 p-4 z-40">
        <button
          onClick={handleAddToCart}
          disabled={added}
          className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-3 rounded hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {added ? (
            <>
              <CheckCircle2 size={16} />
              Added!
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Proceed to Checkout
            </>
          )}
        </button>
      </div>

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
            alt={prod.title}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Static Product Page ────────────────────────────────────────────────────── */

function StaticProductPage({ product }: { product: StaticProductData }) {
  const [added, setAdded] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const { addItem } = useCart();

  // const allImages = product.images.length ? product.images : [product.image].filter(Boolean);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Free Shipping Banner */}
      <FreeShippingBanner />

      {/* Breadcrumb Navigation with Schema */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/all-collections' },
            { label: product.category, href: `/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
            { label: product.name, href: `/product/${product.handle}` }
          ]}
          className="mb-4"
        />
        <button
          onClick={() => {
            const prevPath = document.referrer;
            const currentHost = window.location.host;
            if (prevPath && prevPath.includes(currentHost)) {
              const url = new URL(prevPath);
              const path = url.pathname.replace(/^\//, '') || 'home';
              window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
            } else {
              window.dispatchEvent(new CustomEvent('navigate', { detail: 'collections' }));
            }
          }}
          className="inline-flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-xs tracking-widest uppercase font-medium transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      </div>

      {/* Product Schema Markup */}
      <SchemaMarkup
        schema={generateProductSchema({
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.priceNum,
          url: `/product/${product.handle}`,
          rating: product.rating || 4.8,
          reviewCount: 128,
        })}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-charcoal-900 rounded-xl overflow-hidden border border-charcoal-800/50 group">
              {product.image ? (
                <>
                  <LazyImage
                    src={product.image}
                    webpSrc={getWebPPath(product.image)}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <button
                    onClick={() => setZoomImage(product.image)}
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
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">
              {product.category}
            </span>

            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-5">
              <Stars rating={product.rating ?? 4.8} />
              <span className="text-cream-200/40 text-xs">{product.rating ?? 4.8} · Verified Reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-charcoal-800/50">
              <span className="text-3xl font-bold text-white font-serif">{product.price}</span>
            </div>

            {/* Financing */}
            <FinancingCallout priceNum={product.priceNum} />

            <div className="mb-6">
              <p className="text-cream-200/60 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Specifications */}
            <ProductSpecifications
              specs={product.specs ?? getProductSpecs(product.handle, product.category)}
            />

            <div className="mb-8">
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
            </div>

            {/* Shop with Confidence */}
            <ShopWithConfidence />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="border-t border-charcoal-800/50 pt-12">
          <h2 className="font-serif text-2xl text-white font-bold mb-6">Product Details</h2>
          {product.features.length > 0 && (
            <ul className="space-y-3 max-w-3xl">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-cream-200/65">
                  <CheckCircle2 size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <PaymentMethods />
      </div>

      {/* Customer Reviews - Social Proof */}
      <CustomerReviews productName={product.name} />

      {/* Why Buy From Us */}
      <WhyBuyFromUs />

      {/* Product Recommendations */}
      <ProductRecommendations currentProductId={product.id} currentHandle={product.handle} />

      {/* Review Callout */}
      <ReviewCallout productName={product.name} />

      {/* Product FAQ */}
      <ProductFAQ />

      {/* Zoom Modal */}
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
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
