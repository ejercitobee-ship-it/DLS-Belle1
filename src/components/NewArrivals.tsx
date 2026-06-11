import { useState, useCallback } from 'react';
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
import { useShopifyCollection, getProductPrice, getDefaultVariantId } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';
import FinancingBanner from './FinancingBanner';

type Category = 'All' | 'Grand Cabinets' | 'Desktop' | 'Travel';

type ProductCategory = Category | null;

type Product = {
  id: string;
  handle: string;
  shopifyVariantId?: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  category: ProductCategory;
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
    handle: 'raching-rr980-grand-estate-cigar-humidor',
    name: 'Raching RR980',
    subtitle: 'Grand Estate Cigar Humidor',
    price: '$8,255',
    priceNum: 8255,
    category: 'Grand Cabinets',
    capacity: '3,000–4,000 cigars',
    capacityNum: 4000,
    dimensions: '27.2" W × 27.6" D × 73.4" H',
    material: 'Premium Spanish Cedar shelves & drawers',
    finish: 'Available in Brown & Forest Green',
    storage: [
      '6 Spanish cedar shelves',
      '4 Spanish cedar drawers',
      'Fingerprint + password dual-lock access',
      'Mobile App Remote Unlock',
    ],
    humidification: 'High-Efficiency Water-Cooling · 16–22°C (±1°C) · 60–75% RH (±1%)',
    features: [
      'TFT display with integrated cigar diagnostics',
      'Draw resistance detection — verifies smoking readiness',
      'Fingerprint & password locks + Mobile App unlock',
      'Ammonia removal control for pristine aging',
      'Customizable lighting schedules & brightness',
      '215mm taller than RR880 (+1,000 cigar capacity)',
      '110V/220V global compatibility',
    ],
    description:
      'The RR980 is the definitive grand estate humidor — a monumental cabinet engineered for collectors who demand the absolute apex of environmental precision. TFT diagnostics, draw resistance detection, and mobile app remote unlock place it in a category of its own. Spanish cedar throughout, ammonia removal, and customizable lighting make this the centerpiece of any serious private lounge or tasting room.',
    image: '/images/products/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
    badge: 'New',
    rating: 5.0,
    reviews: 3,
    isNew: true,
  },
  {
    id: 'na-2',
    handle: 'raching-ct48a-stainless-steel-grand-humidor',
    name: 'Raching CT48A',
    subtitle: 'Stainless Steel Grand Humidor',
    price: '$6,350',
    priceNum: 6350,
    category: 'Grand Cabinets',
    capacity: '2,500–3,000 cigars',
    capacityNum: 3000,
    dimensions: '27.2" W × 27.6" D × 72.8" H',
    material: 'Spanish cedar interior · Anti-fingerprint stainless steel exterior',
    finish: 'Silver Anti-Fingerprint Stainless Steel',
    storage: [
      '8 layers Spanish cedar shelves',
      '3 slide-rail shelves for deep storage access',
      'Partition boards for brand/strength/age organization',
      'Quick Dehumidification Drawer',
    ],
    humidification: 'Advanced Water-Cooling · 16–22°C (±1°C) · 60–75% RH (±1%)',
    features: [
      'Anti-fingerprint stainless steel exterior',
      'Quick Dehumidification Drawer for rapid moisture reduction',
      'Ammonia Removal Device',
      'Slide-rail shelves for effortless deep access',
      'Partition boards — organize by brand, strength, or age',
      'Silent, stable compressor operation',
    ],
    description:
      'The CT48A is the Pro-User model that marries industrial-grade durability with refined luxury. An anti-fingerprint stainless steel exterior handles the demands of high-traffic environments, while warm Spanish cedar shelves inside ensure flawless cigar preservation. Built for serious collectors, upscale lounges, and boutique cigar retailers who refuse to compromise.',
    image: '/images/products/CT48A-silver.jpg',
    badge: 'New',
    rating: 4.9,
    reviews: 1,
    isNew: true,
  },
  {
    id: 'na-3',
    handle: 'raching-sd800-dual-zone-cigar-wine-cabinet',
    name: 'Raching SD800',
    subtitle: 'Dual-Zone Cigar & Wine Cabinet',
    price: '$7,600',
    priceNum: 7600,
    category: 'Grand Cabinets',
    capacity: '~1,600 cigars · ~130 wine bottles',
    capacityNum: 1600,
    dimensions: '1200 × 610 × 1920 mm · ~190 kg',
    material: 'Spanish cedar (cigar) · Beech wood (wine)',
    finish: 'Refined glass door with wooden accents',
    storage: [
      '8 layers Spanish cedar cigar shelves',
      '9 layers beech wood wine shelves',
      'Independent doors per zone',
    ],
    humidification: 'Integrated water-cooling · Cigar: 16–22°C, 60–75% RH · Wine: 5–22°C',
    features: [
      'Two independently controlled climate zones',
      'Cigar zone: 16–22°C (±1°C), 60–75% RH (±1%)',
      'Wine zone: 5–22°C (±1°C)',
      'Quiet high-performance compressor',
      'Minimal energy loss between zones',
      'Large glass door with refined wooden accents',
      '2-year warranty',
    ],
    description:
      'The SD800 combines precision cigar and wine storage in a single statement cabinet with two fully independent climate zones. Spanish cedar cigar shelves and beech wood wine shelves sit behind a large glass door framed in refined wooden accents — a natural centerpiece for collectors who entertain at the highest level.',
    image: '/images/products/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 5,
    isNew: true,
  },
  {
    id: 'na-4',
    handle: 'raching-cs600-luxury-wine-cigar-humidor-cabinet',
    name: 'Raching CS600',
    subtitle: 'Luxury Wine & Cigar Humidor Cabinet',
    price: '$4,450',
    priceNum: 4450,
    category: 'Grand Cabinets',
    capacity: '1,200–1,400 cigars · 100–110 wine bottles',
    capacityNum: 1400,
    dimensions: '1200 W × 610 D × 1760 H mm',
    material: 'Spanish cedar (cigar) · Beech wood (wine)',
    finish: 'Large glass door with digital control panel',
    storage: [
      '7 Spanish cedar cigar shelves',
      '10 beech wood wine shelves',
      'Double-door cabinet design',
    ],
    humidification: 'Dual-zone precision · Wine: 5–22°C · Cigar: 16–22°C, 60–75% RH (±2%)',
    features: [
      'Independent temperature controls per zone',
      'Digital control panel for intuitive management',
      'Whisper-quiet, energy-efficient operation',
      'Spanish cedar lining throughout cigar chamber',
      'Large glass door for 360° collection viewing',
      '2-year warranty',
    ],
    description:
      'The CS600 fuses precision dual-zone climate control with sophisticated design — a double-door cabinet that makes wine and cigar preservation equally effortless. Ideal for private lounges, luxury homes, upscale hotels, and premium retail environments that demand both form and function.',
    image: '/images/products/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 8,
    isNew: true,
  },
  {
    id: 'na-5',
    handle: 'marciano-countertop-display-humidor-250-cigars',
    name: 'Marciano',
    subtitle: 'Countertop Display Humidor — 250 Cigars',
    price: '$420',
    priceNum: 420,
    category: 'Desktop',
    capacity: 'Up to 250 cigars',
    capacityNum: 250,
    dimensions: '26" W × 11.5" D × 20" H',
    material: 'Spanish cedar trays',
    finish: 'Deep dark mahogany',
    storage: [
      '3 removable & reversible Spanish cedar trays on gold-plated pins',
      '6 adjustable dividers for custom organization',
      'Flexible layout — trays face forward or toward double doors',
    ],
    humidification: 'Two large humidifiers · Calibrated external hygrometer',
    features: [
      '360° view with four glass sides',
      'Magnetic doors with airtight seal',
      'Lock & key set for secure storage',
      'Calibrated external hygrometer',
      'Gold-plated support pins',
      'Deep dark mahogany premium finish',
    ],
    description:
      'The Marciano is a countertop showpiece — four glass sides deliver a complete 360° view of your collection while magnetic airtight doors and two large humidifiers maintain perfect conditions. Gold-plated support pins and deep dark mahogany finish make it equally at home in home bars, offices, luxury lounges, and boutique shops.',
    image: '/images/products/marciano-250-countertop-display.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 4,
    isNew: true,
  },
  {
    id: 'na-6',
    handle: 'modena-desktop-display-humidor-100-cigars',
    name: 'Modena',
    subtitle: 'Desktop Display Humidor — 100 Cigars',
    price: '$178',
    priceNum: 178,
    category: 'Desktop',
    capacity: 'Up to 100 cigars',
    capacityNum: 100,
    dimensions: '21.5" W × 10" D × 7" H',
    material: 'Spanish cedar interior',
    finish: 'Dark cherry',
    storage: [
      '5 compartments via 4 adjustable Spanish cedar dividers',
      'Internal locking hinges',
    ],
    humidification: '2 gold-polished humidifiers · Built-in hygrometer',
    features: [
      'Angled glass top for effortless at-a-glance viewing',
      'Lock & key set',
      'Internal locking hinges',
      'Elegant gold hardware — handles, lid pull',
      'Built-in hygrometer',
      'Premium dark cherry finish',
    ],
    description:
      'The Modena elevates cigar storage into an architectural experience. An angled glass top, gold hardware, and dark cherry finish combine precision engineering with refined visual character. Perfectly sized for desktop, credenza, or shelf placement — for both the new collector and the seasoned aficionado refining a curated stash.',
    image: '/images/products/modena-cherry-finish-humidor.jpg',
    badge: 'New',
    rating: 4.7,
    reviews: 6,
    isNew: true,
  },
  {
    id: 'na-7',
    handle: 'santiago-end-table-humidor-700-cigars',
    name: 'Santiago',
    subtitle: 'End Table Humidor — 700 Cigars',
    price: '$570',
    priceNum: 570,
    category: 'Desktop',
    capacity: 'Up to 700 cigars',
    capacityNum: 700,
    dimensions: 'End table silhouette with beveled glass top',
    material: 'Spanish cedar lining throughout',
    finish: 'Rich walnut with polished silver hardware',
    storage: [
      '2 smooth-slide pull-out drawers with 3 dividers each',
      'Lower sturdy shelf for boxes & bulk reserves',
      'Lockable sections with lock & key sets',
    ],
    humidification: '6 humidifiers · Silver digital hygrometer visible through glass top',
    features: [
      'Beveled glass top — hygrometer visible at a glance',
      'Embossed wood panels on all sides',
      'Polished silver hardware throughout',
      'Rear wiring port for optional electric upgrade',
      'Doubles as functional furniture end table',
      'Museum-quality sculpted presentation',
    ],
    description:
      'The Santiago fuses timeless craftsmanship with modern practicality — a 700-cigar humidor that doubles as a living room end table. A beveled glass top puts your silver digital hygrometer in plain sight while embossed panels and polished silver hardware ensure it belongs in the finest interiors. For collectors who live with their collection.',
    image: '/images/products/santiago-700-end-table-humidor.jpg',
    badge: 'New',
    rating: 4.8,
    reviews: 7,
    isNew: true,
  },
  {
    id: 'na-8',
    handle: 'traveler-15-travel-humidor-by-humidor-supreme',
    name: 'Traveler 15',
    subtitle: 'Travel Humidor by Humidor Supreme®',
    price: '$42',
    priceNum: 42,
    category: 'Travel',
    capacity: '9–12 cigars',
    capacityNum: 12,
    dimensions: '9" W × 8" D × 2" H',
    material: 'Durable exterior · Built-in humidifier',
    finish: 'Available in Mahogany, Cherry, Burl',
    storage: ['Built-in humidifier', 'Compact travel-ready footprint'],
    humidification: 'Built-in humidifier · Includes XIKAR® Boveda® 60G RH seasoning packs',
    features: [
      'Ready out-of-box with pre-installed humidity packs',
      'Available in Mahogany, Cherry, and Burl finishes',
      'Compact for luggage, backpacks, desk drawers',
      'Durable exterior resistant to travel stress',
      'XIKAR® Boveda® 60G RH included',
    ],
    description:
      'The Traveler 15 is the sleek, travel-ready companion engineered for portability without compromising flavor. Compact enough for luggage or a backpack, it ships ready to use with pre-installed Boveda® humidity packs. Three classic finish options ensure it matches any traveler\'s style.',
    image: '/images/products/portable-cigar-humidor-boveda.png',
    badge: 'New',
    rating: 4.6,
    reviews: 9,
    isNew: true,
  },
  {
    id: 'na-9',
    handle: 'traveler-5-travel-humidor-by-humidor-supreme',
    name: 'Traveler 5',
    subtitle: 'Travel Humidor by Humidor Supreme®',
    price: '$34',
    priceNum: 34,
    category: 'Travel',
    capacity: '8–12 cigars',
    capacityNum: 12,
    dimensions: '8¾" W × 5 11/16" D × 2" H',
    material: 'Sleek Mahogany exterior',
    finish: 'Sleek Mahogany',
    storage: ['Clear acrylic window for inventory check without opening'],
    humidification: 'Built-in humidification · Embedded hygrometer · XIKAR® Boveda® 60G RH',
    features: [
      'Clear acrylic window — check inventory without opening',
      'Embedded hygrometer for real-time humidity monitoring',
      'Built-in humidification system',
      'XIKAR® Boveda® 60G RH seasoning packs included',
      'Fits bags, backpacks, and briefcases',
    ],
    description:
      'The Traveler 5 is the ultimate compact travel companion — a clear acrylic window lets you check your inventory at a glance without ever breaking the seal. Embedded hygrometer, built-in humidification, and included Boveda® packs mean it\'s ready to protect your cigars from the moment it arrives.',
    image: '/images/products/humidor-supreme-traveler-5.png',
    badge: 'New',
    rating: 4.6,
    reviews: 11,
    isNew: true,
  },
  {
    id: 'na-10',
    handle: 'traveler-10-desktop-travel-humidor-by-humidor-supreme',
    name: 'Traveler 10',
    subtitle: 'Desktop Travel Humidor by Humidor Supreme®',
    price: '$39',
    priceNum: 39,
    category: 'Travel',
    capacity: '20–30 cigars',
    capacityNum: 30,
    dimensions: '8¾" W × 5 11/16" D × 3 3/16" H',
    material: 'Spanish cedar lining · Mahogany exterior',
    finish: 'Classic Mahogany',
    storage: ['Spanish cedar lining throughout'],
    humidification: 'Built-in humidification · Precision hygrometer · XIKAR® Boveda® 60G RH',
    features: [
      'Spanish cedar lining for natural moisture management',
      'Precision hygrometer included',
      'Built-in humidification system',
      'XIKAR® Boveda® 60G RH seasoning packs included',
      'Dual purpose — desktop display or travel',
      'Classic mahogany exterior — gift-ready',
    ],
    description:
      'The Traveler 10 bridges the gap between desktop display and travel companion. Spanish cedar lining, a precision hygrometer, and included Boveda® packs keep up to 30 cigars in perfect condition — whether on your desk, in a carry-on, or gifted to the aficionado in your life.',
    image: '/images/products/traveler-10-cigar-humidor.png',
    badge: 'New',
    rating: 4.7,
    reviews: 8,
    isNew: true,
  },
];

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

export default function NewArrivals() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();

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

  const filtered = products.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    if (sort === 'capacity-desc') return b.capacityNum - a.capacityNum;
    return 0;
  });

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-charcoal-900">
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
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Just In</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              New <span className="text-gradient-gold italic">Arrivals</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-xl">
              The latest additions to our collection — grand estate cabinets, precision desktop humidors, and travel companions, all arriving fresh to the catalogue.
            </p>
          </div>
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
          {sorted.map((product) => {
            const cat = product.category ? categoryColors[product.category] : null;
            return (
              <a
                key={product.id}
                href={`/product/${product.handle}`}
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
                    </div>
                    <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </a>
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
