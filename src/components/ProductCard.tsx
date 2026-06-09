import { ShoppingBag, CheckCircle2, Sparkles } from 'lucide-react';
import LazyImage from './LazyImage';
import { getWebPPath } from '../lib/imageOptimization';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import type { ShopifyProduct, ShopifyProductVariant } from '../lib/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  imageAlt: string;
  index?: number;
  showNewBadge?: boolean;
}

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
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
          className={s <= Math.round(rating) ? 'text-gold-500' : 'text-charcoal-700'}
        >
          <path d="M10 1l3.09 6.26L20 7.24l-5 4.87 1.18 6.88L10 15.77l-6.18 3.25L5 12.11 0 7.24l6.91-1.01L10 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({
  product,
  imageAlt,
  index,
  showNewBadge = true
}: ProductCardProps) {
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const variant = getDefaultVariant(product);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const image = product.featuredImage;
  const inStock = product.variants.some((v) => v.availableForSale);
  const variantId = variant?.id ?? '';
  const isAdded = addedId === variantId;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <a
      href={`/product/${product.handle}`}
      className="group bg-charcoal-950 rounded-xl overflow-hidden border border-charcoal-800/50 hover:border-gold-600/50 card-hover cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gold-900/10"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-charcoal-900">
        {image && (
          <LazyImage
            src={image.url}
            webpSrc={getWebPPath(image.url)}
            alt={imageAlt}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* New arrival badge */}
        {showNewBadge && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 bg-charcoal-950 text-gold-400 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-gold-600/40 shadow-md">
              <Sparkles size={7} />
              New
            </span>
          </div>
        )}

        {/* Sequence number — subtle luxury touch */}
        {index !== undefined && (
          <span className="absolute bottom-2.5 right-3 text-[10px] font-mono text-charcoal-600 select-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}

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
            onClick={handleAddToCart}
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
}
