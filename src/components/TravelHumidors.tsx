import { useState } from 'react';
import { ShoppingBag, Star, ChevronDown, ArrowLeft, Box, Ruler, Layers, Tag, Filter, Luggage, Scissors, Flame, CheckCircle2, Loader2, ZoomIn, X } from 'lucide-react';
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
  features: string[];
  description: string;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  includesTools?: boolean;
};

const STATIC_PRODUCTS: StaticProduct[] = [
  { id: 1, name: 'Novelist', price: '$452', priceNum: 452, capacity: '5–10 cigars', capacityMax: 10, finish: 'Rich brown leather — book-style', dimensions: 'Compact, shelf-ready', features: ['Book-style exterior for discreet storage', 'Removable cigar tray', 'Silver hygrometer included', 'Humidifier included', 'Magnetic lid closure', 'Guillotine cutter included', 'Display-worthy design'], description: 'Literature-inspired elegance for the discerning traveler. The Novelist mimics a hardcover book — hide your collection in plain sight on a shelf, tuck it into luggage, or present it as a gift.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Novelist_brown_leather_book_style_travel_cigar_humidor_with_cutter_and_hygrometer.jpg', badge: 'Premium', rating: 4.9, reviews: 8, includesTools: true },
  { id: 2, name: 'Manhattan Travel Humidor (Brown)', price: '$50', priceNum: 50, capacity: '4–8 cigars', capacityMax: 8, finish: 'Brown ostrich-motif leather', dimensions: '8⅛" L × 5½" W × 3⅛" H', features: ['180° flat opening — full access', 'Removable cigar bed with Velcro strap', 'Integrated perforated humidifier', 'Spanish cedar lining', 'Guillotine cutter included', 'Refillable butane torch lighter', 'Secure zipper closure'], description: 'Brown ostrich-pattern leather engineered for enthusiasts who never compromise on freshness. The Manhattan opens flat at 180° for easy access, with a cutter and torch lighter built in.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Manhattan_brown_leather_humidor_with_zipper_closure_for_cigars_up_to_7_inches.jpg', badge: 'Popular', rating: 4.8, reviews: 14, includesTools: true },
  { id: 3, name: 'Manhattan Travel Humidor (Black)', price: '$50', priceNum: 50, capacity: '4–8 cigars', capacityMax: 8, finish: 'Black ostrich-style bonded leather', dimensions: '8⅛" L × 5½" W × 3⅛" H', features: ['180° flat opening — full access', 'Removable cigar bed with Velcro strap', 'Integrated perforated humidifier', 'Spanish cedar interior', 'Guillotine cutter included', 'Refillable butane torch lighter', 'Secure zipper closure'], description: 'Sleek black ostrich-style bonded leather — refined style meets travel-ready practicality. Identical to the Brown Manhattan in every specification, with a darker, more contemporary aesthetic.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Portable_Manhattan_travel_humidor_holding_4_8_cigars_up_to_7_inches.jpg', rating: 4.8, reviews: 11, includesTools: true },
  { id: 4, name: '6 Cigar Leather Humidor', price: '$44', priceNum: 44, capacity: '6–15 cigars', capacityMax: 15, finish: 'PVC leather with white contrast stitching', dimensions: '7.25" W × 10.75" D × 1.5" H', features: ['Dual slide-out removable beds', 'Spanish cedar lining', 'Black humidifier included', 'Up to 60 ring gauge capacity', 'Lightweight yet sturdy', 'Flexible storage configuration'], description: 'Elegant PVC leather with contrasting white stitching — a sophisticated slim case that holds 6 to 15 cigars depending on configuration. The dual slide-out beds accommodate wider ring gauges with ease.', image: 'https://dunnluxuryselections.com/cdn/shop/files/portable_6-cigar_PVC_leather_travel_humidor_with_slide-out_beds.jpg', rating: 4.6, reviews: 6 },
  { id: 5, name: 'Traveler 15 by Humidor Supreme', price: '$32', priceNum: 32, capacity: '9–12 cigars', capacityMax: 12, finish: 'Mahogany, Cherry, or Burl', dimensions: '9" W × 8" D × 2" H', features: ['Built-in humidification system', 'XIKAR Boveda 60G RH seasoning packs', 'Compact travel footprint', 'Durable exterior — travel-resistant', 'Available in 3 finishes'], description: 'A sleek travel-ready companion from Humidor Supreme. The Traveler 15 holds 9–12 cigars in a low-profile case built to resist the knocks of daily travel, included with Boveda seasoning packs.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Portable_cigar_humidor_with_built_in_humidifier_and_XIKAR_Boveda_60G_RH_packs.png', rating: 4.5, reviews: 9 },
  { id: 6, name: 'Traveler 10 by Humidor Supreme', price: '$30', priceNum: 30, capacity: '20–30 cigars', capacityMax: 30, finish: 'Classic mahogany', dimensions: '8¾" W × 5 11/16" D × 3 3/16" H', features: ['Built-in humidification system', 'Precision hygrometer', 'Spanish cedar lining', 'XIKAR Boveda 60G RH seasoning packs', 'Compact, portable design'], description: 'Compact elegance meets dependable cigar care. The Traveler 10 bridges desktop and travel use — at home on a desk or tucked into a weekend bag.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Traveler_10_cigar_humidor_with_Spanish_cedar_interior_and_Boveda_60G_RH_seasoning_packs.png', rating: 4.5, reviews: 7 },
  { id: 7, name: 'Traveler 5 by Humidor Supreme', price: '$26', priceNum: 26, capacity: '8–12 cigars', capacityMax: 12, finish: 'Mahogany exterior', dimensions: '8¾" W × 5 11/16" D × 2" H', features: ['Clear acrylic window for instant inventory check', 'Built-in humidification system', 'Built-in hygrometer', 'XIKAR Boveda 60G RH seasoning packs', 'Premium mahogany finish'], description: 'The ultimate compact travel companion — slim enough for carry-on use, with a transparent acrylic window so you can check your cigars without ever opening the lid.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Humidor_Supreme_Traveler_5_travel_cigar_humidor_holding_8_12_cigars.png', rating: 4.4, reviews: 12 },
  { id: 8, name: 'Traveler 20 Slim by Humidor Supreme', price: '$25', priceNum: 25, originalPrice: '$79', capacity: '8–24 cigars', capacityMax: 24, finish: 'Durable slim exterior', dimensions: '9" W × 8½" D × 2¼" H', features: ['Built-in humidifier', 'Spanish cedar interior', 'Hygrometer included', 'XIKAR Boveda 60G RH seasoning packs', 'Slim, lightweight profile'], description: 'The Traveler 20 Slim packs capacity for up to 24 cigars into a slim 2¼" profile — the best value in the range, currently on sale from $79.', image: 'https://dunnluxuryselections.com/cdn/shop/files/Humidor_Supreme_Traveller_20_Slim_travel_cigar_case_with_XIKAR_Boveda_60G_RH_packs.png', badge: 'Sale', rating: 4.6, reviews: 18 },
];

// ─── Display type ─────────────────────────────────────────────────────────────

type DisplayProduct = {
  key: string;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  capacity: string;
  capacityMax: number;
  finish: string;
  dimensions?: string;
  features: string[];
  description: string;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  includesTools?: boolean;
  shopifyVariantId?: string;
  shopifyProduct?: ShopifyProduct;
};

function extractCapacityMax(product: ShopifyProduct): number {
  const text = product.title + ' ' + product.description + ' ' + product.tags.join(' ');
  const match = text.match(/(\d+)\s*(?:–|-)\s*(\d+)\s*cigars?/i) ?? text.match(/(\d+)\s*cigars?/i);
  if (match) return parseInt(match[match.length - 1], 10);
  return 10;
}

function fromShopify(p: ShopifyProduct): DisplayProduct {
  const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
  const priceObj = variant?.price ?? p.priceRange.minVariantPrice;
  const compareObj = variant?.compareAtPrice;
  const image = variant?.image ?? p.featuredImage;

  const capacityMax = extractCapacityMax(p);
  const capacity = `Up to ${capacityMax} cigars`;

  const badges = ['Premium', 'Popular', 'Sale', 'New'];
  const badgeTag = p.tags.find((t) => badges.includes(t));
  const includesTools = p.tags.some((t) => t.toLowerCase().includes('cutter') || t.toLowerCase().includes('lighter'));

  return {
    key: p.id,
    name: p.title,
    price: formatMoney(priceObj.amount, priceObj.currencyCode),
    priceNum: parseFloat(priceObj.amount),
    originalPrice: compareObj ? formatMoney(compareObj.amount, compareObj.currencyCode) : undefined,
    capacity,
    capacityMax,
    finish: p.productType || 'Premium leather',
    features: p.tags,
    description: p.description,
    image: image?.url ?? '',
    badge: badgeTag,
    includesTools,
    shopifyVariantId: variant?.id,
    shopifyProduct: p,
  };
}

function fromStatic(p: StaticProduct): DisplayProduct {
  return { key: `static-${p.id}`, ...p };
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
  { label: 'Under 10', min: 0, max: 10 },
  { label: '10–20', min: 11, max: 20 },
  { label: '20+', min: 21, max: Infinity },
];

const badgeStyles: Record<string, string> = {
  Premium: 'bg-amber-700 text-white',
  Popular: 'bg-emerald-700 text-white',
  Sale: 'bg-red-700 text-white',
  New: 'bg-blue-700 text-white',
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

// ─── Product detail ───────────────────────────────────────────────────────────

function ProductDetail({ product, onBack }: { product: DisplayProduct; onBack: () => void }) {
  const [added, setAdded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [mainImg, setMainImg] = useState<string>('');
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.shopifyVariantId ? `sp-${product.shopifyVariantId}` : `th-${product.key}`,
      name: product.name,
      subtitle: product.capacity,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'Travel Humidors',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const images = product.shopifyProduct?.images ?? [];
  const allImages = images.length > 0 ? images.map((i) => i.url) : [product.image];
  const activeImg = mainImg || allImages[0];

  return (
    <>
      {zoomImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setZoomImg(null)}
        >
          <button
            className="absolute top-4 right-4 flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full bg-charcoal-800/80 text-white hover:bg-charcoal-700 transition-colors"
            onClick={() => setZoomImg(null)}
            aria-label="Close zoom"
          >
            <X size={20} />
          </button>
          <img
            src={zoomImg}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    <div className="min-h-screen bg-charcoal-950 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-sm mb-8 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Travel Humidors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="relative">
            <button
              className="w-full rounded-lg overflow-hidden aspect-square block relative group/img focus:outline-none"
              onClick={() => setZoomImg(activeImg)}
              aria-label="View full image"
            >
              <img src={activeImg} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </button>
            {product.badge && (
              <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded pointer-events-none ${badgeStyles[product.badge] || ''}`}>
                {product.badge}
              </span>
            )}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(url)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${activeImg === url ? 'border-gold-500' : 'border-charcoal-700/50 hover:border-gold-600/40'}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-gold-600/20 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-gold-600/20 pointer-events-none" />
          </div>

          {/* Info */}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-3">
              {product.name}
            </h1>
            {product.rating && (
              <div className="flex items-center gap-2 mb-5">
                <StarRating rating={product.rating} />
                <span className="text-white text-sm font-medium">{product.rating}</span>
                <span className="text-cream-200/40 text-sm">({product.reviews} reviews)</span>
              </div>
            )}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-bold text-white font-serif">{product.price}</span>
              {product.originalPrice && (
                <span className="text-cream-200/40 text-lg line-through">{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="text-red-400 text-sm font-semibold">
                  Save {Math.round((1 - product.priceNum / parseInt(product.originalPrice.replace(/[^0-9]/g, ''), 10)) * 100)}%
                </span>
              )}
            </div>
            {product.includesTools && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1.5 text-xs text-gold-400 bg-gold-700/10 border border-gold-600/20 px-3 py-1 rounded-full">
                  <Scissors size={11} /> Cutter included
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold-400 bg-gold-700/10 border border-gold-600/20 px-3 py-1 rounded-full">
                  <Flame size={11} /> Lighter included
                </div>
              </div>
            )}
            <div className="mb-8">
              <p className={`text-cream-200/60 leading-relaxed transition-all duration-300 ${descExpanded ? '' : 'line-clamp-3'}`}>
                {product.description}
              </p>
              {product.description.length > 160 && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="mt-2 text-gold-400 text-xs font-medium hover:text-gold-300 transition-colors"
                >
                  {descExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Box, label: 'Capacity', value: product.capacity },
                { icon: Layers, label: 'Exterior', value: product.finish },
                { icon: Ruler, label: 'Dimensions', value: product.dimensions ?? 'Compact carry-on' },
                { icon: Luggage, label: 'Type', value: 'Travel Humidor' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-charcoal-900 border border-charcoal-800/60 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={13} className="text-gold-500" />
                    <span className="text-cream-200/40 text-[10px] tracking-[0.2em] uppercase">{label}</span>
                  </div>
                  <p className="text-cream-100 text-xs font-medium leading-snug">{value}</p>
                </div>
              ))}
            </div>

            {product.features.length > 0 && (
              <div className="mb-8">
                <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">What's Included</p>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-cream-200/65">
                      <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-95 transition-all"
              >
                {added ? <><CheckCircle2 size={16} /> Added to Cart!</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TravelHumidors() {
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [capacityFilter, setCapacityFilter] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<DisplayProduct | null>(null);
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const { addItem } = useCart();

  const { products: shopifyProducts, loading, collectionImage } = useShopifyCollection('travel-humidors');

  const displayProducts: DisplayProduct[] =
    shopifyProducts.length > 0
      ? shopifyProducts.map(fromShopify)
      : STATIC_PRODUCTS.map(fromStatic);

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.stopPropagation();
    addItem({
      id: product.shopifyVariantId ? `sp-${product.shopifyVariantId}` : `th-${product.key}`,
      name: product.name,
      subtitle: product.capacity,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'Travel Humidors',
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

  if (selected) return <ProductDetail product={selected} onBack={() => setSelected(null)} />;

  const heroImage = collectionImage
    || 'https://dunnluxuryselections.com/cdn/shop/collections/Chat-GPT-Image-Apr-15-2026-03-58-42-PM_4b5fd768-7cd5-41d5-95bf-a8e2aa58523e.png';

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={heroImage} alt="Travel Humidors" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/92 via-charcoal-950/65 to-charcoal-950/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Collection</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Travel <span className="text-gradient-gold italic">Humidors</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-lg">
              Protect your cigars on the go — leather cases, slim hard-shells, and complete gift sets built for life in motion.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* USP strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Luggage, label: 'Carry-on Friendly', sub: 'Slim profiles for every bag' },
            { icon: Layers, label: 'Cedar Interior', sub: 'All travel models' },
            { icon: Scissors, label: 'Tools Included', sub: 'On select models' },
            { icon: Tag, label: 'From $25', sub: 'Accessible luxury' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 bg-charcoal-900 border border-charcoal-800/40 rounded-lg px-4 py-3">
              <Icon size={16} className="text-gold-500 flex-shrink-0" />
              <div>
                <p className="text-cream-100 text-xs font-semibold">{label}</p>
                <p className="text-cream-200/40 text-[10px]">{sub}</p>
              </div>
            </div>
          ))}
        </div>

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
                className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 border border-charcoal-700/60 hover:border-gold-600/30 rounded px-3 py-2 transition-colors"
              >
                <Filter size={13} />
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
              className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 border border-charcoal-700/60 hover:border-gold-600/30 rounded px-4 py-2 transition-colors"
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
                <div
                  key={product.key}
                  onClick={() => setSelected(product)}
                  className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg overflow-hidden cursor-pointer card-hover"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-charcoal-800 flex items-center justify-center">
                        <Luggage size={28} className="text-charcoal-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                      <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" />
                    </div>
                    {product.badge && (
                      <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded ${badgeStyles[product.badge] || ''}`}>
                        {product.badge}
                      </span>
                    )}
                    {product.includesTools && (
                      <span className="absolute bottom-2.5 left-2.5 text-[10px] text-gold-300 bg-charcoal-950/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <Scissors size={9} /> Tools included
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`absolute bottom-2.5 right-2.5 flex items-center justify-center min-w-[44px] min-h-[44px] bg-gold-gradient rounded text-charcoal-950 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300 ${addedKey === product.key ? 'opacity-100 translate-y-0' : ''}`}
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
                        {product.originalPrice && (
                          <span className="text-cream-200/30 text-xs line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">View →</span>
                    </div>
                  </div>
                </div>
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
              { label: 'Desktop Humidors', href: '#desktop' },
              { label: 'Electronic Humidors', href: '#electronic' },
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
