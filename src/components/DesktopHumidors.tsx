import { useState } from 'react';
import { ShoppingBag, Star, ChevronDown, Box, CheckCircle2, Loader2, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopifyCollection, formatMoney } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';

// ─── Static fallback data ─────────────────────────────────────────────────────

type StaticProduct = {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  capacity: string;
  capacityMax: number;
  finish: string;
  dimensions?: string;
  interior: string;
  features: string[];
  description: string;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
};

const STATIC_PRODUCTS: StaticProduct[] = [
  { id: 1, name: 'Marciano', price: '$324', priceNum: 324, capacity: 'Up to 250 cigars', capacityMax: 250, finish: 'Deep dark mahogany', dimensions: '26" W × 11.5" D × 20" H', interior: 'Spanish cedar trays on gold-plated pins', features: ['360° view — 4 glass sides', '3 removable & reversible cedar trays', '6 adjustable dividers', '2 large humidifiers included', 'Calibrated external hygrometer', 'Magnetic doors with airtight seal', 'Lock & key set'], description: 'The Marciano commands attention. Four glass sides give a complete 360° view of your collection while deep mahogany woodwork and magnetic airtight doors keep conditions perfect for long-term aging.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Marciano_250-cigar_countertop_display_humidor_with_Spanish_cedar_trays.jpg', badge: 'Bestseller', rating: 4.9, reviews: 12 },
  { id: 2, name: 'Modena', price: '$138', priceNum: 138, capacity: 'Up to 100 cigars', capacityMax: 100, finish: 'Dark cherry', dimensions: '21.5" W × 10" D × 7" H', interior: 'Spanish cedar with adjustable dividers', features: ['Angled glass top display', '5 compartments with 4 cedar dividers', '2 gold-polished humidifiers', 'Built-in external hygrometer', 'Gold hardware — handles & lid pull', 'Lock & key set', 'Internal locking hinges'], description: 'The Modena blends countertop elegance with serious capacity. An angled glass lid offers an unobstructed view of up to 100 cigars, while gold-polished hardware elevates every detail.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Modena_cherry_finish_humidor_21.5x10x7_inches_perfect_for_countertop_display.jpg', badge: 'Featured', rating: 4.8, reviews: 7 },
  { id: 3, name: 'Franklin Acrylic Display', price: '$180', priceNum: 180, capacity: 'Approximately 150 cigars', capacityMax: 150, finish: 'Clear acrylic', interior: 'Acrylic shelves with 3 fixed dividers', features: ['6 open display sections', 'External mount hygrometer', 'Included humidifier', 'Rear access door with lock & key', 'Optional black or wood base', 'Full 360° visibility'], description: "Maximum visibility, minimal footprint. The Franklin's clear acrylic construction turns your collection into a statement piece — 150 cigars on full display with precision humidity control.", image: 'https://dunnluxuryselections.com/cdn/shop/files/Franklin_acrylic_display_cigar_humidor_with_clear_body_and_humidifier.jpg', badge: 'New', rating: 4.7, reviews: 4 },
  { id: 4, name: 'Milano Cigar Display', price: '$187', priceNum: 187, capacity: 'Up to 125 cigars', capacityMax: 125, finish: 'Dark mahogany', interior: 'Spanish cedar-lined trays', features: ['360° view — 4 tempered glass sides', '3 removable angled shelves', 'Adjustable dividers', 'Built-in external hygrometer', 'Included humidifier', 'Lock & key set'], description: "Four tempered glass sides deliver a full 360° showcase for up to 125 cigars. The Milano's dark mahogany frame and angled cedar shelves make it as much a piece of furniture as a humidor.", image: 'https://dunnluxuryselections.com/cdn/shop/files/Marciano_250-cigar_countertop_display_humidor_with_Spanish_cedar_trays.jpg', rating: 4.6, reviews: 5 },
  { id: 5, name: 'Duke', price: '$67', priceNum: 67, capacity: '25–50 cigars', capacityMax: 50, finish: 'Walnut', dimensions: '10¼" W × 8¾" D × 4¼" H', interior: 'Full Spanish cedar lining', features: ['Decorative routed edge detail', 'Adjustable cedar divider', 'Built-in hygrometer', 'Humidifier included', 'Scratch-resistant felt bottom', 'Internal locking hinges'], description: 'The Duke brings refined walnut craftsmanship to everyday storage. Decorative routed edges and a full cedar interior make this an exceptional choice for personal collections of 25–50 cigars.', image: 'https://dunnluxuryselections.com/cdn/shop/files/duke-routed-edge-desktop-cigar-humidor.jpg', rating: 4.7, reviews: 9 },
  { id: 6, name: 'Vizcaya Ebony', price: '$54', priceNum: 54, capacity: '25–50 cigars', capacityMax: 50, finish: 'Authentic ebony wood veneer', dimensions: '11" W × 8.5" D × 3.25" H', interior: 'Rich Spanish cedar', features: ['Authentic ebony veneer exterior', 'Adjustable cedar divider', 'Polished silver hygrometer', 'Removable humidifier', 'Internal locking hinges', 'Low-profile wide design'], description: 'Genuine ebony veneer gives the Vizcaya a deep, dramatic grain that stands apart from standard wood-finished humidors. A polished silver hygrometer completes the striking contrast.', image: 'https://dunnluxuryselections.com/cdn/shop/files/vizcaya-ebony-desktop-cigar-humidor.jpg', rating: 4.6, reviews: 3 },
  { id: 7, name: 'Vizcaya Makore Pommele', price: '$54', priceNum: 54, capacity: '25–50 cigars', capacityMax: 50, finish: 'Makore Pommele — natural striking grain', interior: 'Full Spanish cedar lining', features: ['Makore Pommele wood veneer', 'Adjustable divider', 'Polished silver hygrometer', 'Included humidifier', 'Internal locking hinges', 'Low-profile wide design'], description: 'The rare Makore Pommele veneer produces a distinctive chatoyant grain pattern — no two boxes look the same. Full Spanish cedar interior ensures proper humidity retention.', image: 'https://dunnluxuryselections.com/cdn/shop/files/vizcaya-makorem-pommele-desktop-cigar-humidor.jpg', rating: 4.8, reviews: 1 },
  { id: 8, name: 'Chalet Glasstop (Cherry)', price: '$43', priceNum: 43, capacity: '25–50 cigars', capacityMax: 50, finish: 'Rich cherry with glass top', dimensions: '10½" W × 8¾" D × 4¼" H', interior: 'Spanish cedar lining', features: ['Tempered glass top display', 'External hygrometer', 'Included humidifier', 'Adjustable divider', 'Scratch-resistant felt bottom', 'Internal locking hinges'], description: 'Classic cherry finish meets modern glass-top design. The Chalet Glasstop lets you view your cigars at a glance while maintaining the ideal cedar environment inside.', image: 'https://dunnluxuryselections.com/cdn/shop/files/chalet-glasstop-cherry-desktop-cigar-humidor.jpg', rating: 4.5, reviews: 6 },
  { id: 9, name: 'Chalet Glasstop (Black)', price: '$43', priceNum: 43, capacity: '25–50 cigars', capacityMax: 50, finish: 'Deep black with glass top', dimensions: '10½" W × 8¾" D × 4¼" H', interior: 'Spanish cedar lining', features: ['Transparent glass lid', 'External hygrometer', 'Included humidifier', 'Adjustable divider', 'Scratch-resistant felt bottom', 'Internal locking hinges'], description: 'A sleek, contemporary take on the classic glasstop humidor. The deep black exterior creates a dramatic contrast with the warm Spanish cedar interior.', image: 'https://dunnluxuryselections.com/cdn/shop/files/chalet-glasstop-black-desktop-cigar-humidor.jpg', rating: 4.5, reviews: 4 },
  { id: 10, name: 'Chardonnay', price: '$42', priceNum: 42, capacity: 'Up to 50 cigars', capacityMax: 50, finish: 'Authentic dark walnut', dimensions: '10½" W × 8¾" D × 4¼" H', interior: 'Spanish cedar lining', features: ['Authentic dark walnut exterior', 'Dedicated hygrometer', 'Integrated humidifier', 'Adjustable divider', 'Scratch-resistant felt bottom', 'Solid brass locking hinges'], description: 'Dark walnut exterior with solid brass locking hinges — the Chardonnay is a refined everyday humidor with premium construction details at an accessible price.', image: 'https://dunnluxuryselections.com/cdn/shop/files/chateau-glasstop-cherry-cigar-humidor.jpg', rating: 4.6, reviews: 1 },
  { id: 11, name: 'Chalet (Cherry)', price: '$36', priceNum: 36, capacity: '25–50 cigars', capacityMax: 50, finish: 'Rich cherry wood', dimensions: '10½" W × 8¾" D × 4¼" H', interior: 'Full Spanish cedar lining', features: ['Built-in hygrometer', 'Integrated humidifier', 'Adjustable divider', 'Scratch-resistant felt bottom', 'Internal locking hinges'], description: 'The entry point to the Chalet family — honest cherry woodwork, full cedar interior, and everything you need to keep 25–50 cigars in perfect condition.', image: 'https://dunnluxuryselections.com/cdn/shop/files/chalet-cherry-desktop-cigar-humidor.jpg', rating: 4.4, reviews: 8 },
  { id: 12, name: 'Chalet (Black)', price: '$36', priceNum: 36, capacity: 'Up to 20 cigars', capacityMax: 20, finish: 'Black exterior with glass top', dimensions: '9" W × 8.5" D × 2.25" H', interior: 'Spanish cedar lining', features: ['Glass-top lid', 'Built-in hygrometer', 'Removable humidifier', 'Internal locking hinges', 'Felt-lined bottom'], description: 'Compact, elegant, and purpose-built for personal collections. The Chalet Black keeps up to 20 cigars at peak condition in a slim glass-top profile.', image: 'https://dunnluxuryselections.com/cdn/shop/files/chalet-black-glass-top-cigar-humidor.jpg', rating: 4.4, reviews: 5 },
];

// ─── Display type ─────────────────────────────────────────────────────────────

type DisplayProduct = {
  key: string;
  handle: string;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  capacity: string;
  capacityMax: number;
  finish: string;
  dimensions?: string;
  interior: string;
  features: string[];
  description: string;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  shopifyVariantId?: string;
  shopifyProduct?: ShopifyProduct;
};

function extractCapacityMax(product: ShopifyProduct): number {
  const text = product.title + ' ' + product.tags.join(' ');
  const match = text.match(/(\d[\d,]*)\s*(?:cigars?)/i);
  if (match) return parseInt(match[1].replace(/,/g, ''), 10);
  return 100;
}

function fromShopify(p: ShopifyProduct): DisplayProduct {
  const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
  const priceObj = variant?.price ?? p.priceRange.minVariantPrice;
  const _compareObj = variant?.compareAtPrice;
  void _compareObj;
  const image = variant?.image ?? p.featuredImage;

  const capacityMax = extractCapacityMax(p);
  const capacity = `Up to ${capacityMax} cigars`;

  const badges = ['Bestseller', 'Featured', 'New', 'Sale'];
  const badgeTag = p.tags.find((t) => badges.includes(t));

  return {
    key: p.id,
    handle: p.handle,
    name: p.title,
    price: formatMoney(priceObj.amount, priceObj.currencyCode),
    priceNum: parseFloat(priceObj.amount),
    originalPrice: undefined,
    capacity,
    capacityMax,
    finish: p.productType || 'Premium finish',
    interior: 'Spanish cedar lining',
    features: p.tags,
    description: p.description,
    image: image?.url ?? '',
    badge: badgeTag,
    shopifyVariantId: variant?.id,
    shopifyProduct: p,
  };
}

function fromStatic(p: StaticProduct): DisplayProduct {
  const handle = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return { key: `static-${p.id}`, handle, ...p };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Capacity: High to Low', value: 'capacity-desc' },
];

const capacityFilters = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under 50', min: 0, max: 50 },
  { label: '50–100', min: 51, max: 100 },
  { label: '100–200', min: 101, max: 200 },
  { label: '200+', min: 201, max: Infinity },
];

const badgeStyles: Record<string, string> = {
  Bestseller: 'bg-emerald-700 text-white',
  Featured: 'bg-amber-700 text-white',
  New: 'bg-blue-700 text-white',
  Sale: 'bg-red-700 text-white',
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function DesktopHumidors() {
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [capacityFilter, setCapacityFilter] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const { addItem } = useCart();

  const { products: shopifyProducts, loading, collectionImage } = useShopifyCollection('desktop-humidors');

  const displayProducts: DisplayProduct[] =
    shopifyProducts.length > 0
      ? shopifyProducts.map(fromShopify)
      : STATIC_PRODUCTS.map(fromStatic);

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.shopifyVariantId ? `sp-${product.shopifyVariantId}` : `dh-${product.key}`,
      name: product.name,
      subtitle: product.capacity,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'Desktop Humidors',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedKey(product.key);
    setTimeout(() => setAddedKey(null), 1500);
  };

  const filtered = displayProducts.filter((p) => {
    const { min, max } = capacityFilters[capacityFilter];
    return p.capacityMax >= min && p.capacityMax <= max;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    if (sort === 'capacity-desc') return b.capacityMax - a.capacityMax;
    return 0;
  });

  const heroImage = collectionImage
    || '/generated-1777865999599-45xy3.png';

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={heroImage} alt="Desktop Humidors" className="w-full h-full object-cover object-center" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/60 to-charcoal-950/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Collection</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Desktop <span className="text-gradient-gold italic">Humidors</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-lg">
              Handcrafted cedar-lined boxes for personal collections — from slim 20-cigar cases to grand 250-cigar displays.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-charcoal-800/50">
          <div className="flex items-center gap-3">
            <p className="text-cream-200/40 text-sm">
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Loading…</span>
              ) : (
                <><span className="text-white font-medium">{sorted.length}</span> products</>
              )}
            </p>

            {/* Capacity filter */}
            <div className="relative">
              <button
                onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
                className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 transition-colors border border-charcoal-700/60 hover:border-gold-600/30 rounded px-3 py-2"
              >
                <SlidersHorizontal size={13} />
                <span>{capacityFilters[capacityFilter].label === 'All' ? 'Capacity' : capacityFilters[capacityFilter].label}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-1 w-40 bg-charcoal-900 border border-gold-700/20 rounded shadow-xl z-10">
                  {capacityFilters.map((cf, i) => (
                    <button key={cf.label} onClick={() => { setCapacityFilter(i); setFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${capacityFilter === i ? 'text-gold-400 bg-gold-700/10' : 'text-cream-200/60 hover:text-cream-100 hover:bg-charcoal-800/50'}`}>
                      {cf.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
              className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 transition-colors border border-charcoal-700/60 hover:border-gold-600/30 rounded px-4 py-2"
            >
              <span>{sortOptions.find((o) => o.value === sort)?.label ?? 'Featured'}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-charcoal-900 border border-gold-700/20 rounded shadow-xl z-10">
                {sortOptions.map((opt) => (
                  <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sort === opt.value ? 'text-gold-400 bg-gold-700/10' : 'text-cream-200/60 hover:text-cream-100 hover:bg-charcoal-800/50'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-charcoal-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-charcoal-800 rounded w-3/4" />
                  <div className="h-2.5 bg-charcoal-800 rounded w-1/3" />
                  <div className="h-4 bg-charcoal-800 rounded w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && (
          sorted.length === 0 ? (
            <div className="py-24 text-center text-cream-200/30">No products match this filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((product) => (
                <a
                  key={product.key}
                  href={`/product/${product.handle}`}
                  className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg overflow-hidden cursor-pointer card-hover"
                >
                  <div className="relative overflow-hidden aspect-[4/3] bg-charcoal-900">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-charcoal-800 flex items-center justify-center">
                        <Box size={28} className="text-charcoal-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                      <span className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-xs tracking-widest uppercase font-medium drop-shadow-lg">View Product</span>
                    </div>
                    {product.badge && (
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded ${badgeStyles[product.badge] || ''}`}>
                        {product.badge}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`absolute bottom-2.5 right-2.5 w-8 h-8 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${addedKey === product.key ? 'opacity-100 translate-y-0' : ''}`}
                      aria-label="Add to cart"
                    >
                      {addedKey === product.key ? <CheckCircle2 size={13} /> : <ShoppingBag size={13} />}
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="text-cream-100 text-sm font-semibold leading-snug mb-1.5 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] text-cream-200/40 bg-charcoal-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Box size={9} /> {product.capacity}
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
                      <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">View →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )
        )}

        {/* Related collections */}
        <div className="mt-20 pt-12 border-t border-charcoal-800/40">
          <p className="text-cream-200/30 text-[10px] tracking-[0.4em] uppercase mb-6 text-center">
            Explore Other Collections
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Electronic Humidors', href: '#electronic' },
              { label: 'Travel Humidors', href: '#travel' },
              { label: 'Accessories', href: '#accessories' },
              { label: 'Walk-In Humidors', href: '#bespoke-walkins' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-xs text-cream-200/40 hover:text-gold-400 border border-charcoal-800/60 hover:border-gold-600/30 px-4 py-2 rounded-full transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
