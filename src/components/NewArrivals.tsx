import React, { useState, useCallback, useMemo } from 'react';
import {
  ShoppingBag,
  Star,
  ChevronDown,
  Filter,
  Sparkles,
  Package,
  Zap,
  CheckCircle2 as Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigateToProduct } from '../hooks/useNavigateToProduct';
import { useShopifyCollection, getProductPrice, getDefaultVariantId } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';
import { STATIC_PRODUCTS, Product } from '../lib/newArrivalProducts';
import FinancingBanner from './FinancingBanner';

type Category = 'All' | 'Grand Cabinets' | 'Desktop' | 'Travel';

type ProductCategory = Category | null;

// Use the shared static products
// STATIC_PRODUCTS is imported from '../lib/newArrivalProducts'

const categories: Category[] = ['All', 'Grand Cabinets', 'Desktop', 'Travel'];

const sortOptions = [
  { label: 'Newest First', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Capacity: High to Low', value: 'capacity-desc' },
];

function inferCategory(p: ShopifyProduct): ProductCategory {
  const t = (p.title + ' ' + p.productType + ' ' + p.tags.join(' ')).toLowerCase();
  if (t.includes('travel') || t.includes('portable')) return 'Travel';
  if (t.includes('desktop') || t.includes('countertop') || t.includes('tabletop')) return 'Desktop';
  if (t.includes('cabinet') || t.includes('grand') || t.includes('estate') || t.includes('raching') || t.includes('humidor cabinet')) return 'Grand Cabinets';
  return null;
}

function fromShopify(p: ShopifyProduct): Product {
  const { price, priceNum, compareAt: _compareAt } = getProductPrice(p);
  void _compareAt;
  const variantId = getDefaultVariantId(p);
  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
  const image = variant?.image?.url ?? p.featuredImage?.url ?? '';
  const nums = (p.title + ' ' + p.description).match(/\d[\d,]*/g)
    ?.map((n) => parseInt(n.replace(/,/g, ''), 10))
    .filter((n) => n >= 5 && n <= 10000) ?? [];
  const capacityNum = nums.length ? Math.max(...nums) : 100;

  return {
    id: `shopify-${p.id}`,
    handle: p.handle,
    shopifyVariantId: variantId,
    name: p.title,
    subtitle: p.productType || 'Luxury Humidor',
    price,
    priceNum,
    originalPrice: undefined,
    category: inferCategory(p),
    capacity: `${capacityNum.toLocaleString()} cigars`,
    capacityNum,
    material: 'Premium construction',
    finish: 'Premium finish',
    storage: [],
    humidification: 'Integrated humidification',
    features: p.tags.slice(0, 6),
    description: p.description || p.title,
    image,
    images: p.images.map((img) => img.url),
    badge: 'New',
    isNew: true,
  };
}

const categoryColors: Record<string, { text: string; border: string; bg: string }> = {
  All: { text: '', border: '', bg: '' },
  'Grand Cabinets': { text: 'text-amber-400', border: 'border-amber-600/30', bg: 'bg-amber-700/10' },
  Desktop: { text: 'text-sky-400', border: 'border-sky-600/30', bg: 'bg-sky-700/10' },
  Travel: { text: 'text-emerald-400', border: 'border-emerald-600/30', bg: 'bg-emerald-700/10' },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} className={s <= Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-charcoal-700'} />
      ))}
    </div>
  );
}

const ProductCard = React.memo(function ProductCard({
  product,
  categoryColors,
  addedId,
  onAddToCart,
  navigateToProduct,
}: {
  product: Product;
  categoryColors: Record<string, { text: string; border: string; bg: string }>;
  addedId: string | null;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
  navigateToProduct: (handle: string) => void;
}) {
  const cat = product.category ? categoryColors[product.category] : null;
  return (
    <a
      key={product.id}
      href={`/product/${product.handle}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        e.preventDefault();
        navigateToProduct(product.handle);
      }}
      className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg overflow-hidden cursor-pointer card-hover"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-charcoal-900">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
          <span className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-xs tracking-widest uppercase font-medium drop-shadow-lg">View Product</span>
        </div>
        {/* New badge */}
        <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-gold-600 text-charcoal-950">
          <Sparkles size={8} /> New
        </span>
        {/* Category pill */}
        {product.category && cat && (
          <span className={`absolute top-2.5 right-2.5 text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-charcoal-950/80 ${cat.text}`}>
            {product.category}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={(e) => onAddToCart(e, product)}
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${addedId === product.id ? 'opacity-100 translate-y-0' : ''}`}
          aria-label="Add to cart"
        >
          {addedId === product.id ? <Check size={13} /> : <ShoppingBag size={13} />}
        </button>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-cream-100 text-sm font-bold leading-snug mb-0.5 group-hover:text-white transition-colors">
          {product.name}
        </h3>
        <p className="text-cream-200/40 text-xs leading-snug mb-2 line-clamp-1">{product.subtitle}</p>

        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[10px] text-cream-200/40 bg-charcoal-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Package size={9} /> {product.capacity}
          </span>
        </div>

        {product.rating && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <StarRating rating={product.rating} />
            <span className="text-cream-200/40 text-[11px]">({product.reviews})</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2.5 border-t border-charcoal-800/40">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-bold text-base font-serif">{product.price}</span>
          </div>
          <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </a>
  );
});

export default function NewArrivals() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const navigateToProduct = useNavigateToProduct();

  const { products: shopifyProducts } = useShopifyCollection('new-arrivals');
  const products: Product[] = shopifyProducts.length
    ? shopifyProducts.map(fromShopify)
    : STATIC_PRODUCTS;

  const handleAddToCart = useCallback((e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category || 'New Arrivals',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }, [addItem]);

  const filtered = useMemo(() => {
    return products.filter(
      (p) => activeCategory === 'All' || p.category === activeCategory
    );
  }, [products, activeCategory]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.priceNum - b.priceNum;
      if (sort === 'price-desc') return b.priceNum - a.priceNum;
      if (sort === 'capacity-desc') return b.capacityNum - a.capacityNum;
      return 0;
    });
  }, [filtered, sort]);

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="relative min-h-[16rem] md:min-h-[20rem] overflow-hidden bg-charcoal-900 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/70 to-charcoal-950/20" />

        {/* Animated sparkle accent */}
        <div className="absolute top-6 right-8 md:right-16 flex flex-col items-end gap-1 opacity-60">
          <div className="flex gap-1">
            {[3, 6, 2, 5, 4].map((h, i) => (
              <div
                key={i}
                className="w-0.5 bg-gold-500 rounded-full animate-pulse"
                style={{ height: `${h * 4}px`, animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 md:py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <Sparkles size={12} className="text-gold-400" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Just In</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold drop-shadow-md">
            New <span className="text-gradient-gold italic">Arrivals</span>
          </h1>
          <p className="text-cream-200/60 mt-2 max-w-xl drop-shadow-sm">
            The latest additions to our collection — grand estate cabinets, precision desktop humidors, and travel companions, all arriving fresh to the catalogue.
          </p>
        </div>
      </div>

      {/* Financing Banner */}
      <FinancingBanner variant="compact" className="my-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: '10 New Products', sub: 'All freshly added' },
            { label: 'Up to 4,000 Cigars', sub: 'Raching RR980' },
            { label: 'Dual-Zone Options', sub: 'Wine + cigar storage' },
            { label: 'From $34', sub: 'Traveler 5 travel humidor' },
          ].map(({ label, sub }) => (
            <div key={label} className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg px-4 py-3 flex items-start gap-3">
              <Zap size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cream-100 text-xs font-semibold">{label}</p>
                <p className="text-cream-200/40 text-[10px] mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const count = cat === 'All' ? products.length : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-gold-gradient text-charcoal-950'
                    : 'bg-charcoal-900 border border-charcoal-700/60 text-cream-200/60 hover:text-cream-100 hover:border-gold-600/30'
                }`}
              >
                {cat}
                <span className={`text-[10px] font-bold ${activeCategory === cat ? 'text-charcoal-800' : 'text-cream-200/30'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-charcoal-800/50">
          <p className="text-cream-200/40 text-sm">
            <span className="text-white font-medium">{sorted.length}</span> products
          </p>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 border border-charcoal-700/60 hover:border-gold-600/30 rounded px-4 py-2 transition-colors"
            >
              <Filter size={13} />
              <span>{sortOptions.find((o) => o.value === sort)?.label ?? 'Newest First'}</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-charcoal-900 border border-gold-700/20 rounded shadow-xl z-10">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sort === opt.value
                        ? 'text-gold-400 bg-gold-700/10'
                        : 'text-cream-200/60 hover:text-cream-100 hover:bg-charcoal-800/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryColors={categoryColors}
              addedId={addedId}
              onAddToCart={handleAddToCart}
              navigateToProduct={navigateToProduct}
            />
          ))}
        </div>

        {/* Related collections */}
        <div className="mt-20 pt-12 border-t border-charcoal-800/40">
          <p className="text-cream-200/30 text-[10px] tracking-[0.4em] uppercase mb-6 text-center">
            Explore Other Collections
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Cabinet Humidors', href: '#cabinet-humidors' },
              { label: 'Desktop Humidors', href: '#desktop' },
              { label: 'Electronic Humidors', href: '#electronic' },
              { label: 'Travel Humidors', href: '#travel' },
              { label: 'Accessories', href: '#accessories' },
              { label: 'Walk-In Humidors', href: '#walk-in' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-cream-200/40 hover:text-gold-400 border border-charcoal-800/60 hover:border-gold-600/30 px-4 py-2 rounded-full transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
