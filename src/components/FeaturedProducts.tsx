import { useState, useEffect } from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigateToProduct } from '../hooks/useNavigateToProduct';
import { fetchProductsByTag, fetchProducts, type ShopifyProduct, type ShopifyProductVariant } from '../lib/shopify';

function formatMoney(amount: string, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));
}

function getDefaultVariant(product: ShopifyProduct): ShopifyProductVariant | null {
  return product.variants.find((v) => v.availableForSale) ?? product.variants[0] ?? null;
}

function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-charcoal-700'}
        />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-charcoal-950 rounded-xl overflow-hidden border border-charcoal-800/50 animate-pulse">
      <div className="aspect-[4/3] bg-charcoal-800" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 bg-charcoal-800 rounded w-1/2" />
        <div className="h-3.5 bg-charcoal-800 rounded w-3/4" />
        <div className="h-2.5 bg-charcoal-800 rounded w-1/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-charcoal-800 rounded w-1/4" />
          <div className="h-8 bg-charcoal-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const navigateToProduct = useNavigateToProduct();

  useEffect(() => {
    async function load() {
      try {
        // Try common Shopify tag variants used for new arrivals
        let p = await fetchProductsByTag('New Arrival', 20);
        if (!p.length) p = await fetchProductsByTag('new-arrival', 20);
        if (!p.length) p = await fetchProductsByTag('new_arrival', 20);
        if (!p.length) p = await fetchProductsByTag('New', 20);
        // Final fallback: latest products
        if (!p.length) {
          const result = await fetchProducts(12);
          p = result.products;
        }
        setProducts(p);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = getDefaultVariant(product);
    if (!variant) return;
    const price = variant.price;
    const image = variant.image ?? product.featuredImage;
    addItem({
      id: `sp-${variant.id}`,
      name: product.title,
      subtitle: product.productType || undefined,
      price: formatMoney(price.amount, price.currencyCode),
      priceNum: parseFloat(price.amount),
      image: image?.url ?? '',
      category: product.productType || undefined,
      shopifyVariantId: variant.id,
    });
    setAddedId(variant.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      <section id="featured-products" className="py-16 md:py-24 bg-charcoal-900 relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,140,60,0.06),_transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold-500" />
                <span className="inline-flex items-center gap-2 text-gold-400 text-xs font-semibold tracking-[0.4em] uppercase">
                  <Sparkles size={11} className="text-gold-400" />
                  New Arrivals
                </span>
                <div className="h-px w-8 bg-gold-500" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">
                Just <span className="text-gradient-gold italic">Arrived</span>
              </h2>
              <p className="text-cream-200/45 text-sm mt-2 max-w-md">
                The latest additions to our curated humidor collection — freshly sourced, ready to impress.
              </p>
            </div>
            <a
              href="/new-arrivals"
              className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors group self-start md:self-auto border border-gold-600/30 hover:border-gold-500/50 px-5 py-2.5 rounded-lg hover:bg-gold-700/10"
            >
              View All New Arrivals
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16">
              <Loader2 size={32} className="text-charcoal-600 mx-auto mb-4" />
              <p className="text-cream-200/40 text-sm">Unable to load products. Please refresh the page.</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((product, idx) => {
                const variant = getDefaultVariant(product);
                const price = variant?.price ?? product.priceRange.minVariantPrice;
                const image = product.featuredImage;
                const inStock = product.variants.some((v) => v.availableForSale);
                const variantId = variant?.id ?? '';
                const isAdded = addedId === variantId;

                return (
                  <a
                    key={product.id}
                    href={`/product/${product.handle}`}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button')) return;
                      e.preventDefault();
                      navigateToProduct(product.handle);
                    }}
                    className="group bg-charcoal-950 rounded-xl overflow-hidden border border-charcoal-800/50 hover:border-gold-600/50 card-hover cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gold-900/10"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square bg-charcoal-900">
                      {image && (
                        <img
                          src={image.url}
                          alt={image.altText ?? product.title}
                          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}

                      {/* New arrival badge — every card */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-charcoal-950 text-gold-400 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-gold-600/40 shadow-md">
                          <Sparkles size={7} />
                          New
                        </span>
                      </div>

                      {/* Sequence number — subtle luxury touch */}
                      <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-charcoal-600 select-none">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {inStock && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                          <span className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-xs tracking-widest uppercase font-medium drop-shadow-lg">View Product</span>
                        </div>
                      )}
                      {!inStock && (
                        <div className="absolute inset-0 bg-charcoal-950/60 flex items-center justify-center">
                          <span className="text-[10px] font-bold tracking-widest uppercase text-cream-200/60 bg-charcoal-900/80 px-3 py-1.5 rounded">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 md:p-4">
                      {product.productType && (
                        <p className="text-gold-500/60 text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-1 truncate">
                          {product.productType}
                        </p>
                      )}
                      <h3 className="text-cream-100 text-xs md:text-sm font-medium leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
                        {product.title}
                      </h3>
                      <StarRating rating={5} />
                      <div className="flex items-center justify-between mt-2.5 gap-2">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-white font-bold text-sm md:text-base truncate">
                            {formatMoney(price.amount, price.currencyCode)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!inStock}
                          className={`flex-shrink-0 flex items-center gap-1 text-[10px] md:text-xs font-semibold tracking-wide uppercase py-1.5 px-2.5 md:px-3 rounded-lg transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                            isAdded
                              ? 'bg-emerald-700/20 text-emerald-400 border border-emerald-700/40'
                              : 'bg-gold-gradient text-charcoal-950 hover:opacity-90'
                          }`}
                          aria-label="Add to cart"
                        >
                          {isAdded ? (
                            <><CheckCircle2 size={11} /> <span className="hidden sm:inline">Added</span></>
                          ) : (
                            <><ShoppingBag size={11} /> <span className="hidden sm:inline">Add</span></>
                          )}
                        </button>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
