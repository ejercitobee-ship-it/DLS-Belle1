import { useState, useEffect } from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle2, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchProducts, type ShopifyProduct, type ShopifyProductVariant } from '../lib/shopify';

const badgeStyles: Record<string, string> = {
  Flagship: 'bg-gold-600 text-charcoal-950',
  Bestseller: 'bg-emerald-700 text-white',
  New: 'bg-blue-700 text-white',
  Sale: 'bg-red-700 text-white',
  Premium: 'bg-charcoal-700 text-gold-400 border border-gold-600/50',
};

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

function ProductDetail({ product, onBack }: { product: ShopifyProduct; onBack: () => void }) {
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant | null>(
    () => getDefaultVariant(product),
  );
  const { addItem } = useCart();

  const variant = selectedVariant ?? getDefaultVariant(product);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice ?? null;
  const image = variant?.image ?? product.featuredImage;
  const priceNum = parseFloat(price.amount);
  const compareNum = compareAt ? parseFloat(compareAt.amount) : null;
  const discount = compareNum && compareNum > priceNum
    ? Math.round((1 - priceNum / compareNum) * 100)
    : null;

  const handleAdd = () => {
    if (!variant) return;
    addItem({
      id: `sp-${variant.id}`,
      name: product.title,
      subtitle: product.productType || undefined,
      price: formatMoney(price.amount, price.currencyCode),
      priceNum,
      image: image?.url ?? '',
      category: product.productType || undefined,
      shopifyVariantId: variant.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="py-16 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-sm mb-10 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Featured Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden aspect-square bg-charcoal-900">
              {image && (
                <img
                  src={image.url}
                  alt={image.altText ?? product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-gold-600/20 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-gold-600/20 pointer-events-none" />
          </div>

          {/* Info */}
          <div>
            {product.productType && (
              <p className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">
                {product.productType}
              </p>
            )}
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-5">
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white font-serif">
                {formatMoney(price.amount, price.currencyCode)}
              </span>
              {compareNum && compareNum > priceNum && (
                <>
                  <span className="text-cream-200/40 text-lg line-through">
                    {formatMoney(compareAt!.amount, compareAt!.currencyCode)}
                  </span>
                  <span className="text-red-400 text-sm font-semibold">Save {discount}%</span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-cream-200/60 leading-relaxed mb-8">{product.description}</p>
            )}

            {/* Variant selector */}
            {product.variants.length > 1 && (
              <div className="mb-8">
                <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">Select Option</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.availableForSale}
                      className={`px-4 py-2 text-xs rounded border transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'border-gold-500 bg-gold-700/20 text-gold-300'
                          : 'border-charcoal-700 text-cream-200/60 hover:border-gold-600/50 hover:text-cream-100 disabled:opacity-30 disabled:cursor-not-allowed'
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="text-[10px] tracking-wider uppercase text-cream-200/30 border border-charcoal-700 px-2.5 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                disabled={!variant?.availableForSale}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {added ? (
                  <><CheckCircle2 size={16} /> Added to Cart!</>
                ) : !variant?.availableForSale ? (
                  'Out of Stock'
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart</>
                )}
              </button>
              <a
                href="mailto:support@dunnluxuryselections.com"
                className="flex-1 flex items-center justify-center border border-gold-500/40 text-gold-400 font-medium text-sm tracking-widest uppercase py-4 rounded hover:bg-gold-700/10 transition-colors"
              >
                <Tag size={14} className="mr-2" />
                Request Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-charcoal-950 rounded-lg overflow-hidden border border-charcoal-800/50 animate-pulse">
      <div className="aspect-[4/3] bg-charcoal-800" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 bg-charcoal-800 rounded w-1/2" />
        <div className="h-3.5 bg-charcoal-800 rounded w-3/4" />
        <div className="h-2.5 bg-charcoal-800 rounded w-1/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-charcoal-800 rounded w-1/4" />
          <div className="h-3 bg-charcoal-800 rounded w-1/5" />
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
  const [selected, setSelected] = useState<ShopifyProduct | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts(10)
      .then(({ products: p }) => {
        setProducts(p);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: ShopifyProduct) => {
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

  if (selected) {
    return <ProductDetail product={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <section id="featured-products" className="py-24 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Featured Products
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Our <span className="text-gradient-gold italic">Collection</span>
            </h2>
          </div>
          <a
            href="#collections"
            className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors group"
          >
            View All Products
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* State: loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {/* State: error */}
        {error && !loading && (
          <div className="text-center py-16">
            <Loader2 size={32} className="text-charcoal-600 mx-auto mb-4" />
            <p className="text-cream-200/40 text-sm">Unable to load products. Please refresh the page.</p>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const variant = getDefaultVariant(product);
              const price = variant?.price ?? product.priceRange.minVariantPrice;
              const compareAt = variant?.compareAtPrice ?? null;
              const image = product.featuredImage;
              const inStock = product.variants.some((v) => v.availableForSale);
              const variantId = variant?.id ?? '';
              const isAdded = addedId === variantId;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelected(product)}
                  className="group bg-charcoal-950 rounded-lg overflow-hidden border border-charcoal-800/50 hover:border-gold-700/40 card-hover cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-charcoal-900">
                    {image && (
                      <img
                        src={image.url}
                        alt={image.altText ?? product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 bg-charcoal-950/60 flex items-center justify-center">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-cream-200/60 bg-charcoal-900/80 px-3 py-1.5 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {inStock && (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`absolute bottom-3 right-3 w-9 h-9 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 ${isAdded ? 'opacity-100 translate-y-0' : ''}`}
                        aria-label="Add to cart"
                      >
                        {isAdded ? <CheckCircle2 size={15} /> : <ShoppingBag size={15} />}
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    {product.productType && (
                      <p className="text-gold-500/70 text-[10px] tracking-[0.3em] uppercase mb-1">
                        {product.productType}
                      </p>
                    )}
                    <h3 className="text-cream-100 text-sm font-medium leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
                      {product.title}
                    </h3>
                    <StarRating rating={5} />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-base">
                          {formatMoney(price.amount, price.currencyCode)}
                        </span>
                        {compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount) && (
                          <span className="text-cream-200/40 text-xs line-through">
                            {formatMoney(compareAt.amount, compareAt.currencyCode)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!inStock}
                        className="text-gold-500 text-xs font-medium hover:text-gold-300 transition-colors flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isAdded ? (
                          <><CheckCircle2 size={11} className="text-emerald-400" /><span className="text-emerald-400">Added</span></>
                        ) : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
