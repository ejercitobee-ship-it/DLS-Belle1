import { useState, useCallback, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Filter,
  Sparkles,
  Package,
  Thermometer,
  Droplets,
  Maximize2,
  Layers,
  Lock,
  Zap,
  CheckCircle2 as Check,
  ZoomIn,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { fetchCollectionByHandle, fetchProducts, type ShopifyProduct } from '../lib/shopify';
import { getProductPrice, getDefaultVariantId } from '../hooks/useShopifyCollection';

type Category = 'All' | 'Grand Cabinets' | 'Dual-Zone' | 'Compact';

type Product = {
  id: string;
  shopifyVariantId?: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
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
  images?: string[];
  badge?: string;
  rating?: number;
  reviews?: number;
  isNew: boolean;
};

const STATIC_PRODUCTS: Product[] = [
  {
    id: 'na-1',
    name: 'Raching RR980',
    subtitle: 'Grand Electronic Cigar Humidor',
    price: '$8,255',
    priceNum: 8255,
    category: 'Grand Cabinets',
    capacity: '3,000–4,000 cigars',
    capacityNum: 4000,
    dimensions: '690 × 700 × 1865 mm',
    material: 'Spanish cedar shelves & drawers',
    finish: 'Brown or Forest Green',
    storage: [
      '6 Spanish cedar shelves',
      '4 Spanish cedar drawers',
      'Fingerprint + password dual-lock',
      'Mobile App Remote Unlock',
    ],
    humidification: 'High-Efficiency Water-Cooling · 16–22°C (±1°C) · 60–75% RH (±1%)',
    features: [
      'TFT touchscreen display with cigar diagnostics',
      'Draw resistance detection',
      'Fingerprint & password locks + Mobile App unlock',
      'Ammonia removal control',
      'Customizable lighting schedules',
      '110V/220V global compatibility',
    ],
    description:
      'Redefines what a premium aging vault should be. With expanded storage, smart locking, and real-time cigar diagnostics, the RR980 is built for serious collectors who demand precision, prestige, and presence.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
    badge: 'Flagship',
    rating: 5.0,
    reviews: 3,
    isNew: true,
  },
  {
    id: 'na-2',
    name: 'Raching CT48A',
    subtitle: 'Stainless Steel Grand Electronic Humidor',
    price: '$6,350',
    priceNum: 6350,
    category: 'Grand Cabinets',
    capacity: '2,500–3,000 cigars',
    capacityNum: 3000,
    dimensions: '690 × 700 × 1850 mm',
    material: 'Spanish cedar interior · Anti-fingerprint stainless steel exterior',
    finish: 'Silver Anti-Fingerprint Stainless Steel',
    storage: [
      '8 layers Spanish cedar shelves',
      '3 slide-rail shelves for deep access',
      'Quick Dehumidification Drawer',
      'Partition boards included',
    ],
    humidification: 'Advanced Water-Cooling · 16–22°C (±1°C) · 60–75% RH (±1%)',
    features: [
      'Anti-fingerprint stainless steel exterior',
      'Quick Dehumidification Drawer',
      'Ammonia Removal Device',
      'Slide-rail shelves for effortless deep access',
      'Silent, stable compressor operation',
    ],
    description:
      "A bold fusion of industrial strength and refined luxury. The CT48A's stainless steel finish is as striking as its performance — built for collections that demand both beauty and precision.",
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    badge: 'Premium',
    rating: 4.9,
    reviews: 1,
    isNew: true,
  },
  {
    id: 'na-3',
    name: 'Reagan Electronic Cabinet',
    subtitle: 'Furniture-Grade Electronic Humidor Cabinet',
    price: '$6,147',
    priceNum: 6147,
    category: 'Grand Cabinets',
    capacity: 'Up to 4,000 cigars',
    capacityNum: 4000,
    dimensions: 'Furniture-grade cabinet',
    material: 'Cedar-lined sliding shelves',
    finish: 'Crown molding with embossed panels',
    storage: [
      '12 cedar-lined sliding shelves',
      'Dual climate zones',
      'Dual water reservoirs',
      'Tinted tempered glass doors',
    ],
    humidification: 'Dual circulating fans + reservoirs · 41–71°F · 56–78% dual zones',
    features: [
      'LCD touchscreen display',
      'Dual climate zones',
      'Tinted tempered glass doors',
      'White LED interior lighting',
      'De-mist function',
      '110/120V or 220/240V',
    ],
    description:
      'Redefines luxury cigar storage by blending furniture-grade elegance with professional-grade climate control. The Reagan Cabinet is the centrepiece of any serious cigar room or lounge.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 6,
    isNew: true,
  },
  {
    id: 'na-4',
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
    storage: [
      '8 layers Spanish cedar cigar shelves',
      '9 layers beech wood wine shelves',
      'Independent doors per zone',
    ],
    humidification: 'Water-cooling · Cigar: 16–22°C, 60–75% RH · Wine: 5–22°C',
    features: [
      'Two independently controlled climate zones',
      'Spanish cedar cigar zone',
      'Beech wood wine shelving',
      'Whisper-quiet operation',
      'Large glass door with wooden accents',
    ],
    description:
      'Blends precise climate control with sophisticated design — housing a world-class cigar collection and premium wine cellar in a single, stunning cabinet.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 5,
    isNew: true,
  },
  {
    id: 'na-5',
    name: 'Raching CS600',
    subtitle: 'Luxury Wine & Cigar Dual-Zone Cabinet',
    price: '$4,450',
    priceNum: 4450,
    category: 'Dual-Zone',
    capacity: '1,200–1,400 cigars · 100–110 wine bottles',
    capacityNum: 1400,
    dimensions: '1200 × 610 × 1760 mm',
    material: 'Spanish cedar (cigar) · Beech wood (wine)',
    finish: 'Large glass door with digital control panel',
    storage: [
      '7 Spanish cedar cigar shelves',
      '10 beech wood wine shelves',
      'Double-door cabinet design',
    ],
    humidification: 'Integrated compressor · Wine: 5–22°C · Cigar: 16–22°C, 60–75% RH',
    features: [
      'Independent temperature controls per zone',
      'Digital control panel',
      'Whisper-quiet, energy-efficient operation',
      'Spanish cedar lining throughout cigar chamber',
      'Large glass door for 360° collection viewing',
    ],
    description:
      'Fuses precision dual-zone climate control with sophisticated design — a double-door cabinet that makes wine and cigar preservation equally effortless.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 8,
    isNew: true,
  },
  {
    id: 'na-6',
    name: 'Raching MON800A Carbon Fiber',
    subtitle: 'Compact Electronic Humidor — Carbon Fiber Edition',
    price: '$2,352',
    priceNum: 2352,
    category: 'Compact',
    capacity: '500–600 cigars',
    capacityNum: 600,
    dimensions: '600 × 610 × 820 mm',
    material: 'Carbon fiber exterior · Spanish cedar interior',
    finish: 'Carbon Fiber',
    storage: [
      '2-layer Spanish cedar shelves',
      'Compact form factor — 59 kg',
    ],
    humidification: 'Water-Cooling · 16–22°C (±1°C) · 60–75% RH (±1%)',
    features: [
      'Carbon fiber exterior',
      'LCD digital control panel',
      'Whisper-quiet operation',
      'Professional-grade cooling',
      'Contemporary design',
    ],
    description:
      'Professional-grade climate control wrapped in striking carbon fiber. The MON800A Carbon Fiber Edition combines advanced technology with contemporary aesthetics for the modern aficionado.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 4,
    isNew: true,
  },
  {
    id: 'na-7',
    name: 'Raching MON800A Precision',
    subtitle: 'Compact Electronic Humidor — Precision Climate',
    price: '$1,824',
    priceNum: 1824,
    category: 'Compact',
    capacity: '500–600 cigars',
    capacityNum: 600,
    dimensions: '600 × 610 × 820 mm',
    material: 'Spanish cedar lining · Durable elegant exterior',
    finish: 'Classic Elegant',
    storage: [
      '2-layer Spanish cedar shelves',
    ],
    humidification: 'Water-Cooling Technology · 16–22°C (±1°C) · 60–75% RH (±1%)',
    features: [
      'LCD digital screen',
      'Industrial-grade reliability',
      'Integrated cooling system',
      'Easy maintenance design',
      'Durable elegant finish',
    ],
    description:
      'Professional-grade cabinet for serious cigar enthusiasts and premium venues. Combines industrial reliability with elegant design, delivering consistent precision climate control.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    rating: 4.8,
    reviews: 1,
    isNew: true,
  },
];

const categories: Category[] = ['All', 'Grand Cabinets', 'Dual-Zone', 'Compact'];

const sortOptions = [
  { label: 'Newest First', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Capacity: High to Low', value: 'capacity-desc' },
];

function inferCategory(p: ShopifyProduct): Category {
  const t = (p.title + ' ' + p.productType + ' ' + p.tags.join(' ')).toLowerCase();
  if (t.includes('dual') || t.includes('wine') || t.includes('cs6') || t.includes('sd8')) return 'Dual-Zone';
  if (t.includes('compact') || t.includes('mon8') || t.includes('mini')) return 'Compact';
  return 'Grand Cabinets';
}

function fromShopify(p: ShopifyProduct): Product {
  const { price, priceNum, compareAt } = getProductPrice(p);
  const variantId = getDefaultVariantId(p);
  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
  const image = variant?.image?.url ?? p.featuredImage?.url ?? '';
  const nums = (p.title + ' ' + p.description).match(/\d[\d,]*/g)
    ?.map((n) => parseInt(n.replace(/,/g, ''), 10))
    .filter((n) => n >= 5 && n <= 10000) ?? [];
  const capacityNum = nums.length ? Math.max(...nums) : 100;

  return {
    id: `shopify-${p.id}`,
    shopifyVariantId: variantId,
    name: p.title,
    subtitle: p.productType || 'Luxury Humidor',
    price,
    priceNum,
    originalPrice: compareAt ?? undefined,
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

const categoryColors: Record<Category, { text: string; border: string; bg: string }> = {
  All: { text: '', border: '', bg: '' },
  'Grand Cabinets': { text: 'text-amber-400', border: 'border-amber-600/30', bg: 'bg-amber-700/10' },
  'Dual-Zone': { text: 'text-purple-400', border: 'border-purple-600/30', bg: 'bg-purple-700/10' },
  Compact: { text: 'text-sky-400', border: 'border-sky-600/30', bg: 'bg-sky-700/10' },
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

function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const cat = categoryColors[product.category];
  const [added, setAdded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
      shopifyVariantId: product.shopifyVariantId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <>
      {zoomImg && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setZoomImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal-800/80 text-white hover:bg-charcoal-700 transition-colors"
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
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to New Arrivals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <button
              className="w-full rounded-lg overflow-hidden aspect-[4/5] block relative group/img focus:outline-none"
              onClick={() => setZoomImg(product.image)}
              aria-label="View full image"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </button>
            <span className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded bg-gold-600 text-charcoal-950 pointer-events-none">
              <Sparkles size={10} /> New Arrival
            </span>
            <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-gold-600/20 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-gold-600/20 pointer-events-none" />
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] tracking-[0.3em] uppercase font-semibold border px-2.5 py-1 rounded-full ${cat.text} ${cat.border} ${cat.bg}`}>
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
              {product.originalPrice && (
                <span className="text-cream-200/40 text-lg line-through">{product.originalPrice}</span>
              )}
            </div>

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

            {/* Storage */}
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

            {/* Features */}
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

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-95 transition-all"
              >
                {added ? <><Check size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function NewArrivals() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [shopifyProducts, setShopifyProducts] = useState<ShopifyProduct[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    async function loadNewArrivals() {
      try {
        // Strategy 1: fetch the "new-arrivals" collection (confirmed to have products)
        const col = await fetchCollectionByHandle('new-arrivals', 50);
        if (!cancelled && col && col.products.length) {
          console.log('[NewArrivals] Loaded', col.products.length, 'products from collection');
          setShopifyProducts(col.products);
          return;
        }
        // Strategy 2: fall back to all products sorted newest first
        const { products: newest } = await fetchProducts(12);
        if (!cancelled && newest.length) {
          console.log('[NewArrivals] Fallback: loaded', newest.length, 'newest products');
          setShopifyProducts(newest);
        }
      } catch (err) {
        console.warn('[NewArrivals] Fetch failed, using static fallback:', err);
      }
    }
    loadNewArrivals();
    return () => { cancelled = true; };
  }, []);
  const products: Product[] = shopifyProducts.length
    ? shopifyProducts.map(fromShopify)
    : STATIC_PRODUCTS;

  const handleAddToCart = useCallback((e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  }, [addItem]);

  const filtered = products.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    if (sort === 'capacity-desc') return b.capacityNum - a.capacityNum;
    return 0;
  });

  if (selected) return <ProductDetail product={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src="https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_a49256d8-5931-453f-be44-8d33853ae843.png"
          alt="Electronic Humidors"
          className="w-full h-full object-cover object-center"
        />
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

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <Sparkles size={12} className="text-gold-400" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Collection</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              New <span className="text-gradient-gold italic">Arrivals</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-xl">
              The latest additions to our curated humidor collection — freshly arrived luxury pieces from the world's finest makers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: '7 Flagship Models', sub: 'Raching, Reagan & more' },
            { label: 'Up to 4,000 Cigars', sub: 'Raching RR980 capacity' },
            { label: 'Dual-Zone Available', sub: 'Cigar + wine storage' },
            { label: 'From $1,824', sub: 'MON800A Precision' },
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
          {sorted.map((product) => {
            const cat = categoryColors[product.category];
            return (
              <div
                key={product.id}
                onClick={() => setSelected(product)}
                className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg overflow-hidden cursor-pointer card-hover"
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" />
                  </div>
                  {/* New badge */}
                  <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded bg-gold-600 text-charcoal-950">
                    <Sparkles size={8} /> New
                  </span>
                  {/* Category pill */}
                  <span className={`absolute top-2.5 right-2.5 text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-charcoal-950/80 ${cat.text}`}>
                    {product.category}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
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
                      {product.originalPrice && (
                        <span className="text-cream-200/30 text-xs line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
