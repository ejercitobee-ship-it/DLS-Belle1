import { useState } from 'react';
import { ShoppingBag, Star, ChevronDown, Zap, Box, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopifyCollection, formatMoney } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';
import BreadcrumbSchema from './BreadcrumbSchema';
import SchemaMarkup from './SchemaMarkup';
import { generateOrganizationSchema, generateProductSchema } from '../lib/schemaMarkupHelpers';
import { getRelatedLinks } from '../lib/internalLinkMap';
import FinancingBanner from './FinancingBanner';
import {
  CustomerReviews,
  WhyBuyFromUs,
  FAQSection,
  PaymentMethods
} from './ConversionElements';
import { PHONE_NUMBER, PHONE_HREF } from '../lib/constants';

// ─── Static fallback data ─────────────────────────────────────────────────────

type StaticProduct = {
  id: number;
  name: string;
  brand: string;
  price: string;
  priceNum: number;
  badge?: string;
  image: string;
  secondImage?: string;
  capacity: string;
  temperature: string;
  humidity: string;
  cooling: string;
  shelves: string;
  dimensions: string;
  features: string[];
  description: string;
  rating?: number;
  reviews?: number;
};

const STATIC_PRODUCTS: StaticProduct[] = [
  {
    id: 1,
    name: 'Raching RR980 Cigar Humidor',
    brand: 'Raching',
    price: '$6,387',
    priceNum: 6387,
    badge: 'Flagship',
    image: '/images/products/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
    secondImage: '/images/products/e1c939f2e749e72ea7323ff5cf6f9c1f.jpg',
    capacity: '3,000–4,000 cigars',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% RH (±1%)',
    cooling: 'High-Efficiency Water-Cooling',
    shelves: '6 Spanish cedar shelves + 4 drawers',
    dimensions: '690 × 700 × 1865 mm',
    features: ['TFT touchscreen display', 'Fingerprint + password lock', 'Mobile app remote unlock', 'Ammonia removal control', 'Customisable LED lighting', 'Integrated cigar diagnostics', '110V/220V global compatibility'],
    description: 'Redefines what a premium aging vault should be. With expanded storage, smart locking, and real-time cigar diagnostics, the RR980 is built for serious collectors who demand precision, prestige, and presence.',
    rating: 5, reviews: 3,
  },
  {
    id: 2,
    name: 'RACHING CT48A Stainless Steel Grand Humidor',
    brand: 'Raching',
    price: '$4,752',
    priceNum: 4752,
    badge: 'Premium',
    image: '/images/products/CT48A-silver.jpg',
    secondImage: '/images/products/1_1.jpg',
    capacity: '2,500–3,000 cigars',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% (±1%)',
    cooling: 'Advanced Water-Cooling System',
    shelves: '8 Spanish cedar shelves (3 slide-rail)',
    dimensions: '690 × 700 × 1850 mm',
    features: ['Anti-fingerprint stainless steel exterior', 'Quick dehumidification drawer', 'Ammonia removal device', '3 slide-rail deep-access shelves', 'Industrial-grade reliability', 'Partition boards included'],
    description: "A bold fusion of industrial strength and refined luxury. The CT48A's stainless steel finish is as striking as its performance — built for collections that demand both beauty and precision.",
    rating: 5, reviews: 1,
  },
  {
    id: 3,
    name: 'Raching MON800A Carbon Fiber Edition',
    brand: 'Raching',
    price: '$2,352',
    priceNum: 2352,
    badge: 'New',
    image: '/images/products/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    capacity: '500–600 cigars (~150L)',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% RH (±1%)',
    cooling: 'Water-Cooling System',
    shelves: '2-layer Spanish cedar shelves',
    dimensions: '600 × 610 × 820 mm',
    features: ['Carbon fiber exterior', 'LCD digital control panel', 'Whisper-quiet operation', 'Professional-grade cooling', 'Lightweight at 59 kg', 'Contemporary design'],
    description: 'Professional-grade climate control wrapped in striking carbon fiber. The MON800A Carbon Fiber Edition combines advanced technology with contemporary aesthetics for the modern aficionado.',
    rating: 4.8, reviews: 4,
  },
  {
    id: 4,
    name: 'Raching MON800A Precision Climate Humidor',
    brand: 'Raching',
    price: '$1,824',
    priceNum: 1824,
    image: '/images/products/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    capacity: '500–600 cigars (~150L)',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% RH (±1%)',
    cooling: 'Water-Cooling Technology',
    shelves: '2-layer Spanish cedar shelves',
    dimensions: '600 × 610 × 820 mm',
    features: ['LCD digital screen', 'Industrial-grade reliability', 'Integrated cooling system', 'Easy maintenance design', 'Durable elegant finish', '59 kg net weight'],
    description: 'Professional-grade cabinet for serious cigar enthusiasts and premium venues. Combines industrial reliability with elegant design, delivering consistent precision climate control.',
    rating: 4.8, reviews: 1,
  },
  {
    id: 5,
    name: 'Reagan Electronic Cabinet Humidor',
    brand: 'Reagan',
    price: '$6,147',
    priceNum: 6147,
    badge: 'Bestseller',
    image: '/images/products/CT48A-silver.jpg',
    capacity: 'Up to 4,000 cigars',
    temperature: '41–71°F (dual climate zones)',
    humidity: '56–78% (dual zones)',
    cooling: 'Dual circulating fans + reservoirs',
    shelves: '12 cedar-lined sliding shelves',
    dimensions: 'Furniture-grade cabinet',
    features: ['LCD touchscreen display', 'Dual climate zones', 'Dual water reservoirs', 'Tinted tempered glass doors', 'White LED interior lighting', 'De-mist function', '110/120V or 220/240V', 'Crown molding + embossed panels'],
    description: 'Redefines luxury cigar storage by blending furniture-grade elegance with professional-grade climate control. The Reagan Cabinet is the centrepiece of any serious cigar room or lounge.',
    rating: 4.9, reviews: 6,
  },
  {
    id: 6,
    name: 'Raching SD800 Dual-Zone Cigar & Wine Cabinet',
    brand: 'Raching',
    price: '$5,972',
    priceNum: 5972,
    badge: 'Featured',
    image: '/images/products/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    capacity: '1,500–1,600 cigars + 120–130 wine bottles',
    temperature: 'Cigar: 16–22°C · Wine: 5–22°C',
    humidity: '60–75% RH (±1%)',
    cooling: 'Water-cooling + high-performance compressor',
    shelves: '8 Spanish cedar + 9 beech wood shelves',
    dimensions: '1200 × 610 × 1920 mm',
    features: ['Independent dual-zone doors', 'Spanish cedar cigar zone', 'Beech wood wine shelving', 'Large display glass door', 'Refined wooden accents', 'Whisper-quiet operation', 'Energy-efficient design', '~190 kg, ~760L total volume'],
    description: 'Blends precise climate control with sophisticated design — housing a world-class cigar collection and premium wine cellar in a single, stunning cabinet.',
    rating: 5, reviews: 2,
  },
  {
    id: 7,
    name: 'Raching CS600 Luxury Wine & Cigar Cabinet',
    brand: 'Raching',
    price: '$3,360',
    priceNum: 3360,
    image: '/images/products/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    capacity: '1,200–1,400 cigars + 100–110 wine bottles',
    temperature: 'Cigar: 16–22°C · Wine: 5–22°C',
    humidity: '60–75% RH (±2%)',
    cooling: 'Integrated compressor cooling',
    shelves: '7 Spanish cedar + 10 beech wood shelves',
    dimensions: '1200 × 610 × 1760 mm',
    features: ['2-year warranty', 'Double-door combined unit', 'Digital control panel', 'Large glass door display', 'Spanish cedar + beech wood', 'Whisper-quiet operation', 'Energy-efficient'],
    description: 'Fuses precision climate control with sophisticated design for serious collectors wanting both worlds — premium cigar preservation and wine cellar performance in one refined cabinet.',
    rating: 4.7, reviews: 3,
  },
];

// ─── Display-agnostic card type (union of Shopify + static) ───────────────────

type DisplayProduct = {
  key: string;
  handle: string;
  name: string;
  brand: string;
  price: string;
  priceNum: number;
  badge?: string;
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  capacity: string;
  cooling: string;
  // Shopify-only
  shopifyVariantId?: string;
  shopifyProduct?: ShopifyProduct;
  // Static-only extras
  temperature?: string;
  humidity?: string;
  shelves?: string;
  dimensions?: string;
  features?: string[];
};

function fromShopify(p: ShopifyProduct, idx: number): DisplayProduct {
  const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
  const priceObj = variant?.price ?? p.priceRange.minVariantPrice;
  const priceNum = parseFloat(priceObj.amount);
  const image = variant?.image ?? p.featuredImage;

  // Extract capacity/cooling from tags or description heuristics
  const capacityTag = p.tags.find((t) => t.toLowerCase().includes('cigar')) ?? '';
  const capacity = capacityTag || 'See specifications';
  const cooling = p.tags.find((t) => t.toLowerCase().includes('cool')) ?? 'Electronic climate control';

  const badges = ['Flagship', 'Premium', 'New', 'Bestseller', 'Featured'];
  const badgeTag = p.tags.find((t) => badges.includes(t));
  const badge = badgeTag ?? (idx === 0 ? 'Flagship' : undefined);

  return {
    key: p.id,
    handle: p.handle,
    name: p.title,
    brand: p.productType || p.tags.find((t) => ['Raching', 'Reagan', 'Marciano'].includes(t)) || 'Premium',
    price: formatMoney(priceObj.amount, priceObj.currencyCode),
    priceNum,
    badge,
    image: image?.url ?? '',
    description: p.description,
    capacity,
    cooling,
    shopifyVariantId: variant?.id,
    shopifyProduct: p,
  };
}

function fromStatic(p: StaticProduct): DisplayProduct {
  const handle = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    key: `static-${p.id}`,
    handle,
    name: p.name,
    brand: p.brand,
    price: p.price,
    priceNum: p.priceNum,
    badge: p.badge,
    image: p.image,
    description: p.description,
    rating: p.rating,
    reviews: p.reviews,
    capacity: p.capacity,
    cooling: p.cooling,
    temperature: p.temperature,
    humidity: p.humidity,
    shelves: p.shelves,
    dimensions: p.dimensions,
    features: p.features,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Selling', value: 'best-selling' },
  { label: 'Newest', value: 'newest' },
];

const badgeStyles: Record<string, string> = {
  Flagship: 'bg-gold-600 text-charcoal-950',
  Premium: 'bg-charcoal-700 text-gold-400 border border-gold-600/50',
  New: 'bg-blue-700 text-white',
  Bestseller: 'bg-emerald-700 text-white',
  Featured: 'bg-amber-700 text-white',
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

export default function ElectronicHumidors() {
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const { addItem } = useCart();

  const { products: shopifyProducts, loading, collectionImage } = useShopifyCollection(
    'electronic-humidors',
    'electronic-hunidors',
  );

  const displayProducts: DisplayProduct[] =
    shopifyProducts.length > 0
      ? shopifyProducts.map((p, i) => fromShopify(p, i))
      : STATIC_PRODUCTS.map(fromStatic);

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.shopifyVariantId ? `sp-${product.shopifyVariantId}` : `eh-${product.key}`,
      name: product.name,
      subtitle: product.capacity,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'Electronic Humidors',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedKey(product.key);
    setTimeout(() => setAddedKey(null), 1500);
  };

  const sorted = [...displayProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    return 0;
  });

  const heroImage = collectionImage
    || '/images/collections/electronic-humidors-hero.png';

  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? 'Featured';

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/all-collections' },
            { label: 'Electronic Humidors', href: '/collections/electronic-humidors' }
          ]}
          className="mb-8 pt-4"
        />
        <SchemaMarkup schema={generateOrganizationSchema()} />
      </div>

      {/* Hero banner */}
      <div className="relative min-h-[14rem] md:min-h-[18rem] overflow-hidden flex items-center">
        <img src={heroImage} alt="Electronic Humidors" className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/60 to-charcoal-950/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 md:py-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Collection</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-bold drop-shadow-md">
            Electronic <span className="text-gradient-gold italic">Humidors</span>
          </h1>
          <p className="text-cream-200/60 mt-2 max-w-lg drop-shadow-sm">
            Precision climate-controlled cabinets for discerning collectors and luxury venues.
          </p>
          <div className="mt-4 flex items-center gap-4">
            <a href={PHONE_HREF} className="inline-flex items-center gap-2 py-1 text-gold-400 hover:text-gold-300 transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              <Phone size={16} />
              <span className="text-sm font-medium">{PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Financing Banner */}
      <FinancingBanner variant="compact" className="my-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-charcoal-800/50">
          <p className="text-cream-200/40 text-sm">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 size={13} className="animate-spin" /> Loading…</span>
            ) : (
              <><span className="text-white font-medium">{sorted.length}</span> products</>
            )}
          </p>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 transition-colors border border-charcoal-700/60 hover:border-gold-600/30 rounded px-4 py-2"
            >
              <span>{currentSortLabel}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-charcoal-900 border border-gold-700/20 rounded shadow-xl z-10">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sort === opt.value ? 'text-gold-400 bg-gold-700/10' : 'text-cream-200/60 hover:text-cream-100 hover:bg-charcoal-800/50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-charcoal-800" />
                <div className="p-5 space-y-2">
                  <div className="h-2 bg-charcoal-800 rounded w-1/3" />
                  <div className="h-3.5 bg-charcoal-800 rounded w-3/4" />
                  <div className="h-2.5 bg-charcoal-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        <h2 className="font-serif text-3xl text-white font-bold mb-8">Climate-Controlled Cabinets</h2>

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <Zap size={32} className="text-charcoal-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 text-xs tracking-widest uppercase font-medium drop-shadow-lg">View Product</span>
                  </div>
                  {product.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded ${badgeStyles[product.badge] || ''}`}>
                      {product.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`absolute bottom-3 right-3 w-9 h-9 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${addedKey === product.key ? 'opacity-100 translate-y-0' : ''}`}
                    aria-label="Add to cart"
                  >
                    {addedKey === product.key ? <CheckCircle2 size={15} /> : <ShoppingBag size={15} />}
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-gold-500/60 text-[10px] tracking-[0.3em] uppercase mb-1.5">{product.brand}</p>
                  <h3 className="text-cream-100 text-sm font-semibold leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {product.rating && product.priceNum && (
                    <SchemaMarkup
                      schema={generateProductSchema({
                        name: product.name,
                        description: product.description,
                        image: product.image,
                        price: product.priceNum,
                        url: `/product/${product.handle}`,
                        rating: product.rating,
                        reviewCount: product.reviews
                      })}
                    />
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="flex items-center gap-1 text-[10px] text-cream-200/40 bg-charcoal-950/60 px-2 py-0.5 rounded-full">
                      <Box size={9} /> {product.capacity.split('–')[0].trim()}+
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-cream-200/40 bg-charcoal-950/60 px-2 py-0.5 rounded-full">
                      <Zap size={9} /> {product.cooling.split(' ')[0]}
                    </span>
                  </div>
                  {product.rating && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <StarRating rating={product.rating} />
                      <span className="text-cream-200/40 text-[11px]">({product.reviews})</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-charcoal-800/40">
                    <span className="text-white font-bold text-lg font-serif">{product.price}</span>
                    <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Related collections */}
        <section className="mt-20 pt-12 border-t border-charcoal-800/40">
          <h2 className="font-serif text-2xl text-white font-bold mb-8">Explore More Collections</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {getRelatedLinks('/collections/electronic-humidors').map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-cream-200/40 hover:text-gold-400 border border-charcoal-800/60 hover:border-gold-600/30 px-4 py-2 rounded-full transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Customer Reviews */}
      <CustomerReviews productName="Electronic Humidors" />

      {/* Why Buy From Us */}
      <WhyBuyFromUs />

      {/* FAQ Section */}
      <FAQSection />

      {/* Payment Methods */}
      <PaymentMethods />
    </div>
  );
}
