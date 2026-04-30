import { useState } from 'react';
import {
  ShoppingBag,
  Star,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Filter,
  Layers,
  Thermometer,
  Droplets,
  Package,
  Lock,
  Maximize2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopifyCollection, getProductPrice, getDefaultVariantId } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';

type Category = 'All' | 'Dual-Zone' | 'Classic Cabinet' | 'Smart Climate';

type DisplayProduct = {
  id: string;
  shopifyId: string;
  shopifyVariantId: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  compareAt?: string;
  category: Category;
  capacity: string;
  capacityNum: number;
  dimensions?: string;
  material: string;
  finish: string;
  storage: string[];
  humidification: string;
  features: string[];
  description: string;
  image: string;
  images: string[];
  badge?: string;
  rating?: number;
  reviews?: number;
};

const STATIC_PRODUCTS: DisplayProduct[] = [
  {
    id: 'ch-1',
    shopifyId: '',
    shopifyVariantId: '',
    name: 'Raching SD800',
    subtitle: 'Dual-Zone Cigar & Wine Cabinet',
    price: '$7,600',
    priceNum: 7600,
    category: 'Dual-Zone',
    capacity: '~1,600 cigars · ~130 wine bottles',
    capacityNum: 1600,
    dimensions: '1200 × 610 × 1920 mm',
    material: 'Spanish cedar (cigar) · Beech wood (wine)',
    finish: 'Refined glass door with wooden accents',
    storage: ['8 layers Spanish cedar cigar shelves', '9 layers beech wood wine shelves', 'Independent doors per zone'],
    humidification: 'Integrated water-cooling · High-performance compressor',
    features: ['Dual zones 16–22°C ±1°C, 60–75% RH ±1%', 'Wine zone: 5–22°C ±1°C', 'Advanced airflow & quiet operation', '2-year warranty'],
    description: 'The SD800 is the pinnacle of dual-zone preservation — independently controlled cigar and wine compartments in a single showroom-worthy cabinet.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png',
    images: [],
    badge: 'Flagship',
    rating: 4.9,
    reviews: 7,
  },
  {
    id: 'ch-2',
    shopifyId: '',
    shopifyVariantId: '',
    name: 'Raching CS600',
    subtitle: 'Luxury Wine & Cigar Humidor Cabinet',
    price: '$4,450',
    priceNum: 4450,
    category: 'Dual-Zone',
    capacity: '1,200–1,400 cigars · 100–110 wine bottles',
    capacityNum: 1400,
    dimensions: '1200 W × 610 D × 1760 H mm',
    material: 'Spanish cedar (cigar) · Beech wood (wine)',
    finish: 'Large glass door with digital control panel',
    storage: ['7 Spanish cedar cigar shelves', '10 beech wood wine shelves', 'Double-door cabinet design'],
    humidification: 'Dual-zone precision climate control',
    features: ['Wine zone: 5–22°C ±1°C', 'Cigar zone: 16–22°C, 60–75% RH', 'Whisper-quiet, energy-efficient', '2-year warranty'],
    description: 'The CS600 combines wine and cigar storage in an elegant double-door cabinet with independent climate controls.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png',
    images: [],
    badge: 'Popular',
    rating: 4.8,
    reviews: 11,
  },
  {
    id: 'ch-3',
    shopifyId: '',
    shopifyVariantId: '',
    name: 'Bermuda',
    subtitle: 'High-Capacity Collection Cabinet',
    price: '$3,800',
    priceNum: 3800,
    category: 'Classic Cabinet',
    capacity: '4,000 cigars',
    capacityNum: 4000,
    material: 'Spanish cedar lining',
    finish: 'Dark cherry',
    storage: ['12 oversized removable trays with adjustable dividers', '4 pull-out drawers housing 24 humidifiers', 'Dual full-length framed glass doors'],
    humidification: '24 built-in humidifiers + external hygrometer',
    features: ['Optional touch-activated dimmable LED', 'Rear wiring port for electric upgrades', 'Spanish cedar interior throughout'],
    description: 'The Bermuda is built for serious collectors who refuse to compromise on scale. 4,000 cigars, 12 oversized trays, 24 integrated humidifiers.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png',
    images: [],
    badge: 'Best Capacity',
    rating: 4.8,
    reviews: 9,
  },
  {
    id: 'ch-4',
    shopifyId: '',
    shopifyVariantId: '',
    name: 'Spartacus',
    subtitle: 'Showroom-Worthy 1,000-Cigar Cabinet',
    price: '$1,145',
    priceNum: 1145,
    category: 'Classic Cabinet',
    capacity: '~1,000 cigars',
    capacityNum: 1000,
    material: 'Spanish cedar interior',
    finish: 'Rich dark cherry',
    storage: ['3 oversized trays with 8 adjustable dividers', 'Pull-out drawer with 6 built-in humidifiers', 'Full-length framed glass door'],
    humidification: '6 built-in humidifiers + dedicated hygrometer',
    features: ['Full-length framed glass door', 'Brass lock and key', 'Rear wiring port for optional electric upgrade'],
    description: 'Three oversized trays with 8 adjustable dividers each, a dedicated pull-out humidifier drawer, and a full-length glass door.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png',
    images: [],
    rating: 4.7,
    reviews: 13,
  },
];

const categories: Category[] = ['All', 'Classic Cabinet', 'Dual-Zone', 'Smart Climate'];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Capacity: High to Low', value: 'capacity-desc' },
];

const badgeStyles: Record<string, string> = {
  Flagship: 'bg-amber-700 text-white',
  Popular: 'bg-emerald-700 text-white',
  'Best Capacity': 'bg-blue-700 text-white',
  Customizable: 'bg-stone-600 text-white',
};

function inferCategory(p: ShopifyProduct): Category {
  const t = (p.title + ' ' + p.tags.join(' ')).toLowerCase();
  if (t.includes('dual') || t.includes('wine')) return 'Dual-Zone';
  if (t.includes('smart') || t.includes('electronic') || t.includes('digital')) return 'Smart Climate';
  return 'Classic Cabinet';
}

function extractCapacity(p: ShopifyProduct): number {
  const nums = (p.title + ' ' + p.description + ' ' + p.tags.join(' '))
    .match(/\d[\d,]*/g)
    ?.map((n) => parseInt(n.replace(/,/g, ''), 10))
    .filter((n) => n >= 100 && n <= 10000) ?? [];
  return nums.length ? Math.max(...nums) : 500;
}

function fromShopify(p: ShopifyProduct): DisplayProduct {
  const { price, priceNum, compareAt } = getProductPrice(p);
  const variantId = getDefaultVariantId(p);
  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
  const image = variant?.image?.url ?? p.featuredImage?.url ?? '';
  const capacityNum = extractCapacity(p);
  const category = inferCategory(p);

  return {
    id: `shopify-${p.id}`,
    shopifyId: p.id,
    shopifyVariantId: variantId,
    name: p.title,
    subtitle: p.productType || 'Cabinet Humidor',
    price,
    priceNum,
    compareAt: compareAt ?? undefined,
    category,
    capacity: `${capacityNum.toLocaleString()} cigars`,
    capacityNum,
    material: 'Spanish cedar lining',
    finish: 'Premium finish',
    storage: [],
    humidification: 'Integrated humidification system',
    features: p.tags.slice(0, 6),
    description: p.description || p.title,
    image,
    images: p.images.map((img) => img.url),
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-charcoal-700'}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-charcoal-800" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-charcoal-800 rounded w-3/4" />
        <div className="h-2.5 bg-charcoal-800 rounded w-1/2" />
        <div className="h-2 bg-charcoal-800 rounded w-1/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-charcoal-800 rounded w-1/4" />
          <div className="h-3 bg-charcoal-800 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ product, onBack }: { product: DisplayProduct; onBack: () => void }) {
  const [added, setAdded] = useState(false);
  const [mainImg, setMainImg] = useState(product.image);
  const { addItem } = useCart();

  const allImages = product.images.length ? product.images : [product.image].filter(Boolean);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
      shopifyVariantId: product.shopifyVariantId || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-charcoal-950 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Cabinet Humidors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden aspect-[4/5]">
              <img src={mainImg || product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            {product.badge && (
              <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded ${badgeStyles[product.badge] || 'bg-charcoal-700 text-white'}`}>
                {product.badge}
              </span>
            )}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${mainImg === img ? 'border-gold-500' : 'border-charcoal-700/50 hover:border-gold-600/40'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-gold-600/20 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-gold-600/20 pointer-events-none" />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] tracking-[0.3em] uppercase font-semibold border px-2.5 py-1 rounded-full ${
                product.category === 'Dual-Zone'
                  ? 'text-emerald-400 border-emerald-600/30 bg-emerald-700/10'
                  : product.category === 'Smart Climate'
                  ? 'text-sky-400 border-sky-600/30 bg-sky-700/10'
                  : 'text-amber-400 border-amber-600/30 bg-amber-700/10'
              }`}>
                {product.category}
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-1">
              {product.name}
            </h1>
            <p className="text-cream-200/50 italic text-lg mb-4">{product.subtitle}</p>

            {product.rating && (
              <div className="flex items-center gap-2 mb-5">
                <StarRating rating={product.rating} />
                <span className="text-white text-sm font-medium">{product.rating}</span>
                <span className="text-cream-200/40 text-sm">({product.reviews} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white font-serif">{product.price}</span>
              {product.compareAt && (
                <span className="text-cream-200/40 text-lg line-through">{product.compareAt}</span>
              )}
            </div>

            <p className="text-cream-200/60 leading-relaxed mb-8">{product.description}</p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Package, label: 'Capacity', value: product.capacity },
                { icon: Layers, label: 'Finish', value: product.finish },
                { icon: Droplets, label: 'Humidification', value: product.humidification },
                ...(product.dimensions ? [{ icon: Maximize2, label: 'Dimensions', value: product.dimensions }] : []),
                { icon: Thermometer, label: 'Material', value: product.material },
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

            {product.storage.length > 0 && (
              <div className="mb-6">
                <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">Storage Configuration</p>
                <ul className="space-y-2">
                  {product.storage.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm text-cream-200/65">
                      <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.features.length > 0 && (
              <div className="mb-8">
                <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">Key Features</p>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-cream-200/65">
                      <Lock size={11} className="text-gold-500/60 flex-shrink-0 mt-0.5" />
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
              <button className="flex-1 border border-gold-500/40 text-gold-400 font-medium text-sm tracking-widest uppercase py-4 rounded hover:bg-gold-700/10 transition-colors">
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CabinetHumidors() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<DisplayProduct | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();

  const { products: shopifyProducts, loading, collectionImage } = useShopifyCollection('cabinet-humidors');

  const products: DisplayProduct[] = shopifyProducts.length
    ? shopifyProducts.map(fromShopify)
    : STATIC_PRODUCTS;

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
      shopifyVariantId: product.shopifyVariantId || undefined,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const filtered = products.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory,
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    if (sort === 'capacity-desc') return b.capacityNum - a.capacityNum;
    return 0;
  });

  if (selected) return <ProductDetail product={selected} onBack={() => setSelected(null)} />;

  const heroImage = collectionImage || 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png';

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={heroImage}
          alt="Cabinet Humidors"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/70 to-charcoal-950/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Collection</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Cabinet <span className="text-gradient-gold italic">Humidors</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-xl">
              Floor-standing masterpieces from 600 to 4,000+ cigars — classic cedar cabinets, dual-zone wine &amp; cigar pairings, and precision smart-climate systems.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Up to 4,000 Cigars', sub: 'Bermuda cabinet' },
            { label: 'Dual-Zone Options', sub: 'Wine + cigar combined' },
            { label: 'Spanish Cedar', sub: 'All classic cabinets' },
            { label: 'From $495', sub: 'Belmont entry model' },
          ].map(({ label, sub }) => (
            <div key={label} className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg px-4 py-3">
              <p className="text-cream-100 text-xs font-semibold">{label}</p>
              <p className="text-cream-200/40 text-[10px] mt-0.5">{sub}</p>
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
              <span>{sortOptions.find((o) => o.value === sort)?.label ?? 'Featured'}</span>
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center text-cream-200/30">No products in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelected(product)}
                className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg overflow-hidden cursor-pointer card-hover"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-charcoal-800 flex items-center justify-center">
                      <Package size={32} className="text-charcoal-600" />
                    </div>
                  )}
                  {product.badge && (
                    <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded ${badgeStyles[product.badge] || 'bg-charcoal-700 text-white'}`}>
                      {product.badge}
                    </span>
                  )}
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-charcoal-950/80 ${
                    product.category === 'Dual-Zone' ? 'text-emerald-400' : product.category === 'Smart Climate' ? 'text-sky-400' : 'text-amber-400'
                  }`}>
                    {product.category}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`absolute bottom-2.5 right-2.5 w-8 h-8 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${addedId === product.id ? 'opacity-100 translate-y-0' : ''}`}
                    aria-label="Add to cart"
                  >
                    {addedId === product.id ? <CheckCircle2 size={13} /> : <ShoppingBag size={13} />}
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
                      {product.compareAt && (
                        <span className="text-cream-200/30 text-xs line-through">{product.compareAt}</span>
                      )}
                    </div>
                    <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              { label: 'Travel Humidors', href: '#travel' },
              { label: 'Accessories', href: '#accessories' },
              { label: 'Walk-In Humidors', href: '#bespoke-walkins' },
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
