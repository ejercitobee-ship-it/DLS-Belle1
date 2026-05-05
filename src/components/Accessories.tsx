import { useState } from 'react';
import { ShoppingBag, Star, ChevronDown, ArrowLeft, Filter, CheckCircle2, Droplets, Thermometer, Wine, Circle, Package, Loader2, ZoomIn, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopifyCollection, formatMoney } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';

type Category = 'All' | 'Humidification' | 'Barware' | 'Ashtrays' | 'Monitoring';

// ─── Static fallback data ─────────────────────────────────────────────────────

type StaticProduct = {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  category: Category;
  tagline: string;
  description: string;
  material: string;
  features: string[];
  includes: string[];
  dimensions?: string;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
};

const STATIC_PRODUCTS: StaticProduct[] = [
  { id: 1, name: 'Cigar Oasis Plus Electronic Humidifier', price: '$198', priceNum: 198, category: 'Humidification', tagline: 'Automatic precision humidity control', description: 'The ultimate automatic humidity control system for medium to large humidors. Actively regulates moisture with a precision sensor, large backlit digital display, and optional Wi-Fi remote monitoring — removing all guesswork from cigar care.', material: 'Electronic system with digital display and water cartridge', features: ['Large backlit digital display — temp & humidity', 'Adjustable set point, factory preset ~70% RH', 'Quiet built-in fan for even air circulation', 'Large water cartridge — months between refills', 'Low-water indicator alerts', 'Optional Wi-Fi app monitoring (subscription)', 'Up to ~10 cubic feet capacity'], includes: ['Device', 'Ribbon cable', 'Water cartridge'], image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', badge: 'Premium', rating: 4.9, reviews: 14 },
  { id: 2, name: 'Humidity Beads (1 lb)', price: '$20', priceNum: 20, category: 'Humidification', tagline: 'Reusable silica bead humidification', description: 'Simple, reusable, low-maintenance humidification maintaining ideal 70% RH without messy gels or liquids contacting your cigars. Rechargeable with distilled water — works across desktop, cabinet, and travel humidors.', material: 'Clear silica gel crystals', features: ['Maintains 70% RH consistently', 'Rechargeable and reusable — no replacement needed', 'No gel contact with cigars', 'Works in desktop, cabinet, and travel humidors', 'Expands significantly when hydrated'], includes: ['1 lb resealable bag of clear humidity gel crystals'], image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', rating: 4.7, reviews: 22 },
  { id: 3, name: '300 Series Digital Hygrometer (Gray)', price: '$25', priceNum: 25, category: 'Monitoring', tagline: 'Slim precision monitor with gunmetal finish', description: 'Compact precision instrument designed specifically for cigar storage. The gunmetal bezel and slim 0.5" profile fits unobtrusively in any humidor, delivering real-time dual temperature and humidity readouts.', material: 'Digital with gunmetal bezel and gray finish', features: ['Real-time dual readout — temp & humidity', 'Fahrenheit / Celsius toggle', 'Built-in calibration for ongoing accuracy', 'Double-sided Velcro mounting included', '0.5" slim profile', 'Battery included'], includes: ['1× Hygrometer (gray)', '1× Battery', '1× Double-sided Velcro mount'], dimensions: '1⅞" face diameter · 0.5" slim profile', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', rating: 4.8, reviews: 31 },
  { id: 4, name: 'Digital Hygrometer w/ Calibration (Gold)', price: '$23', priceNum: 23, category: 'Monitoring', tagline: 'Precision monitor with polished gold bezel', description: 'Pairs exact humidity readings with a decorator-ready polished gold bezel — turning a functional device into a stylish room addition. Magnetic mounting included for instant placement on metal surfaces.', material: 'Digital with polished gold bezel', features: ['Large easy-to-read display', 'Calibration feature for long-term accuracy', 'Fahrenheit / Celsius toggle', 'Magnetic mounting for metal surfaces', 'Battery included for immediate setup'], includes: ['1× Hygrometer (gold)', '1× Battery', '1× Magnetic mounting set'], dimensions: '2.49" face · 0.6" thickness', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', rating: 4.7, reviews: 18 },
  { id: 5, name: "Admiral's Voyage Ship Decanter Set", price: '$127', priceNum: 127, category: 'Barware', tagline: 'Hand-blown 1000ml ship decanter — 5 piece', description: 'A hand-blown 1000ml carafe with a meticulously detailed glass ship floating inside — the perfect centerpiece for an executive office or cigar lounge. Presented in a secure gift-ready executive box.', material: 'Premium hand-blown lead-free crystalline glass', features: ['Internal glass ship detail — conversation piece', 'Airtight glass stopper prevents oxidation', 'Mahogany-stained display base', 'Weighted for a premium feel', '4× globe-etched weighted rocks glasses', 'Gift-ready executive box'], includes: ['1× Ship decanter (1000ml)', '4× Globe-etched rocks glasses', 'Custom mahogany wood stand', 'Executive gift box'], dimensions: '1000ml (35oz)', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', badge: 'Gift Set', rating: 4.8, reviews: 9 },
  { id: 6, name: 'Thin Red Line Whiskey Decanter Set', price: '$128', priceNum: 128, category: 'Barware', tagline: 'Firefighter tribute — tattered flag edition', description: 'A tribute to first responders — the striking Tattered American Flag motif with iconic Red Line rendered in premium borosilicate glass. Presented in an engraved handcrafted wooden box.', material: 'Premium hand-blown borosilicate glass, lead-free & food-grade certified', features: ['High-definition tattered Red Line American Flag design', 'Precision-engineered airtight glass stopper', 'Extreme thermal shock resistance', 'Weighted rocks glasses for comfortable grip', 'Handcrafted engraved wooden presentation box'], includes: ['1× Decanter (730ml / 24.7oz)', '2× 10oz rocks glasses', 'Engraved wooden presentation box'], dimensions: '730ml (24.7oz)', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', badge: 'Limited', rating: 4.9, reviews: 6 },
  { id: 7, name: 'Classic Square Whiskey Decanter Set', price: '$71', priceNum: 71, category: 'Barware', tagline: 'Gold rim — 3-piece executive set', description: 'Timeless square silhouette with gold rim detailing and premium high-clarity glass. Dishwasher safe for easy maintenance and available with custom logo engraving for corporate gifting.', material: 'Premium high-clarity machine-made glass', features: ['Classic square silhouette with gold rim', 'Dishwasher safe', 'Substantial, premium feel in hand', 'Customisable branding — logo engraving available'], includes: ['1× Square decanter', '2× Matching whiskey glasses', 'Protective packaging'], dimensions: '113mm W × 306mm H · 1900g total', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', rating: 4.6, reviews: 11 },
  { id: 8, name: 'Executive Dual-View Whiskey Smoker Kit', price: '$142', priceNum: 142, category: 'Barware', tagline: '12-piece infusion set with smoker gun', description: 'Professional 12-piece infusion set for elevated mixology. The theatrical dual-view display lets you watch smoke dance around your spirits before the magnetic clasp seals it inside.', material: 'Premium wood, bamboo, and high-temp glass', features: ['Dual crystal-clear windows with magnetic clasp', 'Advanced smoker gun with dual-speed fan', 'Funnel-shaped reservoir for maximum smoke density', 'Fits 2 glasses simultaneously', '6 wood chip varieties — Apple, Hickory, Oak, Cherry, Cinnamon, Mesquite', 'Luxury bamboo presentation tray'], includes: ['1× Smoker box', '1× Dual-speed smoker gun', '1× Bamboo tray', '1× Glass top', '6× Wood chip tins', '3× Screens', '1× Cleaning brush'], image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', badge: 'Gift Set', rating: 4.8, reviews: 15 },
  { id: 9, name: 'Rockford Grid Ashtray', price: '$35', priceNum: 35, category: 'Ashtrays', tagline: 'Cast aluminum grid on mango wood base', description: 'High-polished cast aluminum grid atop a rich mango wood base — the Rockford Grid delivers striking contrast and substantial heft. The removable grid makes cleaning effortless.', material: 'Polished cast aluminum grid · mango wood base', features: ['High-polished cast aluminum removable grid', 'Rich mango wood base', 'Strategically placed holes guide ash to reservoir', 'Felt-lined bottom protects surfaces', 'Substantial weighted feel'], includes: ['Ashtray with removable grid'], dimensions: '7.5" × 7.5" × 2.75" · ~2 lbs', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', rating: 4.7, reviews: 8 },
  { id: 10, name: 'UrbanMatrX Ashtray', price: '$59', priceNum: 59, category: 'Ashtrays', tagline: 'Zinc alloy grid on golden walnut base', description: 'A forward-looking statement piece combining a progressive grid-pattern polished zinc alloy top with an antiqued brass finish over a golden walnut wood base. Weather-resistant for indoor or outdoor use.', material: 'Gun gray zinc alloy top (antiqued brass) · golden walnut wood base', features: ['Progressive grid-pattern design', 'Polished gun gray zinc alloy top', 'Multiple slots for cigars and cigarettes', 'Weather-resistant construction', 'Felt-lined base protects surfaces'], includes: ['Ashtray (ready to use)'], dimensions: '9" × 9" × 2" H', image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png', badge: 'Popular', rating: 4.6, reviews: 12 },
];

// ─── Display type ─────────────────────────────────────────────────────────────

type DisplayProduct = {
  key: string;
  name: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  category: Category;
  tagline: string;
  description: string;
  material: string;
  features: string[];
  includes: string[];
  dimensions?: string;
  image: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  shopifyVariantId?: string;
  shopifyProduct?: ShopifyProduct;
};

function inferCategory(p: ShopifyProduct): Category {
  const text = (p.productType + ' ' + p.tags.join(' ')).toLowerCase();
  if (text.includes('humidif') || text.includes('humidity') || text.includes('bead')) return 'Humidification';
  if (text.includes('hygro') || text.includes('monitor') || text.includes('thermometer')) return 'Monitoring';
  if (text.includes('decant') || text.includes('whiskey') || text.includes('barware') || text.includes('glass') || text.includes('smoker')) return 'Barware';
  if (text.includes('ashtray') || text.includes('ash')) return 'Ashtrays';
  return 'All' as Category;
}

function fromShopify(p: ShopifyProduct): DisplayProduct {
  const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
  const priceObj = variant?.price ?? p.priceRange.minVariantPrice;
  const compareObj = variant?.compareAtPrice;
  const image = variant?.image ?? p.featuredImage;

  const badges = ['Premium', 'Gift Set', 'Limited', 'Popular', 'New', 'Sale'];
  const badgeTag = p.tags.find((t) => badges.includes(t));
  const category = inferCategory(p);

  return {
    key: p.id,
    name: p.title,
    price: formatMoney(priceObj.amount, priceObj.currencyCode),
    priceNum: parseFloat(priceObj.amount),
    originalPrice: compareObj ? formatMoney(compareObj.amount, compareObj.currencyCode) : undefined,
    category: category === 'All' ? 'Humidification' : category,
    tagline: p.productType || p.tags.slice(0, 3).join(', '),
    description: p.description,
    material: p.productType || 'Premium materials',
    features: p.tags,
    includes: [p.title],
    image: image?.url ?? '',
    badge: badgeTag,
    shopifyVariantId: variant?.id,
    shopifyProduct: p,
  };
}

function fromStatic(p: StaticProduct): DisplayProduct {
  return { key: `static-${p.id}`, ...p };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const categories: Category[] = ['All', 'Humidification', 'Monitoring', 'Barware', 'Ashtrays'];

const categoryIcons: Record<Category, React.ElementType> = {
  All: Package,
  Humidification: Droplets,
  Monitoring: Thermometer,
  Barware: Wine,
  Ashtrays: Circle,
};

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const badgeStyles: Record<string, string> = {
  Premium: 'bg-amber-700 text-white',
  'Gift Set': 'bg-emerald-700 text-white',
  Limited: 'bg-red-700 text-white',
  Popular: 'bg-blue-700 text-white',
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
      id: product.shopifyVariantId ? `sp-${product.shopifyVariantId}` : `acc-${product.key}`,
      name: product.name,
      subtitle: product.tagline,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
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
        <button onClick={onBack} className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-sm mb-8 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Accessories
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
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold-400 text-[10px] tracking-[0.3em] uppercase font-medium border border-gold-600/30 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-cream-200/50 italic mb-4">{product.tagline}</p>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="bg-charcoal-900 border border-charcoal-800/60 rounded-lg p-3">
                <p className="text-cream-200/40 text-[10px] tracking-[0.2em] uppercase mb-1">Material</p>
                <p className="text-cream-100 text-xs font-medium leading-snug">{product.material}</p>
              </div>
              {product.dimensions && (
                <div className="bg-charcoal-900 border border-charcoal-800/60 rounded-lg p-3">
                  <p className="text-cream-200/40 text-[10px] tracking-[0.2em] uppercase mb-1">Dimensions</p>
                  <p className="text-cream-100 text-xs font-medium leading-snug">{product.dimensions}</p>
                </div>
              )}
            </div>

            {product.features.length > 0 && (
              <div className="mb-6">
                <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">Features</p>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-cream-200/65">
                      <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-4 mb-8">
              <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">What's Included</p>
              <div className="flex flex-wrap gap-2">
                {product.includes.map((item) => (
                  <span key={item} className="text-xs text-cream-200/65 bg-charcoal-950/60 border border-charcoal-700/40 px-3 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>

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

export default function AccessoriesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<DisplayProduct | null>(null);
  const [addedKey, setAddedKey] = useState<string | null>(null);
  const { addItem } = useCart();

  const { products: shopifyProducts, loading, collectionImage } = useShopifyCollection(
    'accessories-1',
    'accessories',
  );

  const displayProducts: DisplayProduct[] =
    shopifyProducts.length > 0
      ? shopifyProducts.map(fromShopify)
      : STATIC_PRODUCTS.map(fromStatic);

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.stopPropagation();
    addItem({
      id: product.shopifyVariantId ? `sp-${product.shopifyVariantId}` : `acc-${product.key}`,
      name: product.name,
      subtitle: product.tagline,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedKey(product.key);
    setTimeout(() => setAddedKey(null), 1500);
  };

  const filtered = displayProducts.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    return 0;
  });

  if (selected) return <ProductDetail product={selected} onBack={() => setSelected(null)} />;

  const heroImage = collectionImage
    || 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png';

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={heroImage} alt="Accessories" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/92 via-charcoal-950/65 to-charcoal-950/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Collection</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Accessories &amp; <span className="text-gradient-gold italic">Essentials</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-lg">
              Everything to complete your collection — humidification, precision monitoring, premium barware, and refined ashtrays.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Category tabs */}
        {!loading && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat];
              const count = cat === 'All' ? displayProducts.length : displayProducts.filter((p) => p.category === cat).length;
              if (cat !== 'All' && count === 0) return null;
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
                  <Icon size={13} />
                  {cat}
                  <span className={`text-[10px] font-bold ${activeCategory === cat ? 'text-charcoal-800' : 'text-cream-200/30'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-charcoal-800/50">
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
              className="flex items-center gap-2 text-sm text-cream-200/60 hover:text-cream-100 border border-charcoal-700/60 hover:border-gold-600/30 rounded px-4 py-2 transition-colors"
            >
              <Filter size={13} />
              <span>{sortOptions.find((o) => o.value === sort)?.label ?? 'Featured'}</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-charcoal-900 border border-gold-700/20 rounded shadow-xl z-10">
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
                  <div className="h-2.5 bg-charcoal-800 rounded w-1/3" />
                  <div className="h-3 bg-charcoal-800 rounded w-3/4" />
                  <div className="h-2 bg-charcoal-800 rounded w-1/2" />
                  <div className="h-4 bg-charcoal-800 rounded w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product grid */}
        {!loading && (
          sorted.length === 0 ? (
            <div className="py-24 text-center text-cream-200/30">No products in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((product) => {
                const Icon = categoryIcons[product.category] ?? Package;
                return (
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
                          <Package size={28} className="text-charcoal-600" />
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
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] text-gold-500/70 bg-gold-700/10 border border-gold-700/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Icon size={9} /> {product.category}
                        </span>
                      </div>
                      <h3 className="text-cream-100 text-sm font-semibold leading-snug mb-1 group-hover:text-white transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-cream-200/40 text-xs leading-snug mb-2.5 line-clamp-1">{product.tagline}</p>
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
                );
              })}
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
              { label: 'Travel Humidors', href: '#travel' },
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
