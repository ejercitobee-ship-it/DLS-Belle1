import { useState } from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle2, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Product = {
  id: number;
  name: string;
  brand: string;
  price: string;
  priceNum: number;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
  description: string;
  features: string[];
};

const products: Product[] = [
  {
    id: 1,
    name: 'Raching RR980 Electronic Cabinet',
    brand: 'Raching',
    price: '$7,750',
    priceNum: 7750,
    rating: 5,
    reviews: 3,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
    badge: 'Flagship',
    category: 'Electronic',
    description: 'Redefines what a premium aging vault should be. With expanded storage, smart locking, and real-time cigar diagnostics, the RR980 is built for serious collectors who demand precision, prestige, and presence.',
    features: ['TFT touchscreen display', 'Fingerprint + password lock', 'Mobile app remote unlock', 'Ammonia removal control', '110V/220V global compatibility'],
  },
  {
    id: 2,
    name: 'Santiago Counter Display',
    brand: 'Humidor Supreme',
    price: '$549',
    priceNum: 549,
    rating: 4.8,
    reviews: 7,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/Santiago_700_cigar_end_table_humidor_with_walnut_finish_and_beveled_glass_top.jpg',
    badge: 'Bestseller',
    category: 'Cabinet',
    description: 'The Santiago is a premium hybrid: a 700-cigar humidor that doubles as a living room end table. Beveled glass top and embossed panels bring elegance to any room.',
    features: ['Beveled glass top', 'Embossed wood panels on all sides', 'Polished silver hardware', 'Lock & key set', 'Spanish cedar throughout'],
  },
  {
    id: 3,
    name: 'Amalfi Desktop Humidor',
    brand: 'Humidor Supreme',
    price: '$210',
    priceNum: 210,
    rating: 4.9,
    reviews: 12,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/Amalfi_desktop_humidor_with_built_in_humidifier_and_external_hygrometer.png',
    badge: 'New',
    category: 'Desktop',
    description: 'Classic craftsmanship with a modern glass-top display. The Amalfi blends countertop elegance with serious capacity for up to 150 cigars.',
    features: ['Angled glass top display', 'Spanish cedar lining', 'External hygrometer', 'Lock & key set', 'Gold hardware'],
  },
  {
    id: 4,
    name: 'Dane Prestige Desktop',
    brand: 'Humidor Supreme',
    price: '$185',
    priceNum: 185,
    originalPrice: '$220',
    rating: 4.7,
    reviews: 8,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/dane-desktop-cigar-humidor.png',
    badge: 'Sale',
    category: 'Desktop',
    description: 'The Dane Prestige brings refined walnut craftsmanship to everyday storage. Decorative routed edges and a full cedar interior make this an exceptional personal humidor.',
    features: ['Decorative routed edge detail', 'Adjustable cedar divider', 'Built-in hygrometer', 'Humidifier included', 'Internal locking hinges'],
  },
  {
    id: 5,
    name: 'Marciano Travel Companion',
    brand: 'Humidor Supreme',
    price: '$44',
    priceNum: 44,
    rating: 4.6,
    reviews: 15,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/portable_6-cigar_PVC_leather_travel_humidor_with_slide-out_beds.jpg',
    category: 'Travel',
    description: 'Elegant PVC leather with contrasting stitching — a sophisticated slim travel case that holds up to 15 cigars. Lightweight, durable, and built for life in motion.',
    features: ['Dual slide-out removable beds', 'Spanish cedar lining', 'Black humidifier included', 'Up to 60 ring gauge', 'Secure zipper closure'],
  },
  {
    id: 6,
    name: 'Modena Cigar Cabinet',
    brand: 'Humidor Supreme',
    price: '$420',
    priceNum: 420,
    rating: 4.8,
    reviews: 5,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/Modena_cherry_finish_humidor_21.5x10x7_inches_perfect_for_countertop_display.jpg',
    badge: 'New',
    category: 'Cabinet',
    description: 'The Modena blends countertop elegance with serious capacity. An angled glass lid offers an unobstructed view of up to 100 cigars while gold-polished hardware elevates every detail.',
    features: ['Angled glass top display', '5 compartments with 4 cedar dividers', '2 gold-polished humidifiers', 'Built-in external hygrometer', 'Lock & key set'],
  },
  {
    id: 7,
    name: 'Chalet Portable Humidor',
    brand: 'Humidor Supreme',
    price: '$38',
    priceNum: 38,
    originalPrice: '$50',
    rating: 4.5,
    reviews: 20,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/chalet-black-glass-top-cigar-humidor.jpg',
    badge: 'Sale',
    category: 'Travel',
    description: 'Compact, elegant, and purpose-built for personal collections. The Chalet keeps up to 25 cigars at peak condition in a slim glass-top profile.',
    features: ['Glass-top lid', 'Built-in hygrometer', 'Removable humidifier', 'Internal locking hinges', 'Felt-lined bottom'],
  },
  {
    id: 8,
    name: 'Raching MHB310 Smart Cabinet',
    brand: 'Raching',
    price: '$4,200',
    priceNum: 4200,
    rating: 5,
    reviews: 2,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    badge: 'Premium',
    category: 'Electronic',
    description: 'Professional-grade climate control wrapped in striking modern design. The MHB310 combines advanced technology with contemporary aesthetics for the modern aficionado.',
    features: ['LCD digital control panel', 'Whisper-quiet operation', 'Professional-grade cooling', 'Spanish cedar shelves', '2-year warranty'],
  },
];

const badgeStyles: Record<string, string> = {
  Flagship: 'bg-gold-600 text-charcoal-950',
  Bestseller: 'bg-emerald-700 text-white',
  New: 'bg-blue-700 text-white',
  Sale: 'bg-red-700 text-white',
  Premium: 'bg-charcoal-700 text-gold-400 border border-gold-600/50',
};

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

function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: `fp-${product.id}`,
      name: product.name,
      subtitle: product.category,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
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
            <div className="rounded-lg overflow-hidden aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            {product.badge && (
              <span className={`absolute top-4 left-4 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded ${badgeStyles[product.badge] || ''}`}>
                {product.badge}
              </span>
            )}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-gold-600/20 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-r-2 border-b-2 border-gold-600/20 pointer-events-none" />
          </div>

          {/* Info */}
          <div>
            <p className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">{product.brand} · {product.category}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-4">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-5">
              <StarRating rating={product.rating} size={13} />
              <span className="text-white text-sm font-medium">{product.rating}</span>
              <span className="text-cream-200/40 text-sm">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-white font-serif">{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-cream-200/40 text-lg line-through">{product.originalPrice}</span>
                  <span className="text-red-400 text-sm font-semibold">
                    Save {Math.round((1 - product.priceNum / parseInt(product.originalPrice.replace(/[^0-9]/g, ''))) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-cream-200/60 leading-relaxed mb-8">{product.description}</p>

            {/* Features */}
            <div className="mb-8">
              <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">Key Features</p>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-cream-200/65">
                    <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-95 transition-all"
              >
                {added ? <><CheckCircle2 size={16} /> Added to Cart!</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </button>
              <button className="flex-1 border border-gold-500/40 text-gold-400 font-medium text-sm tracking-widest uppercase py-4 rounded hover:bg-gold-700/10 transition-colors">
                <Tag size={14} className="inline mr-2" />
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturedProducts() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({
      id: `fp-${product.id}`,
      name: product.name,
      subtitle: product.category,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: product.category,
    });
    setAddedId(product.id);
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
              New <span className="text-gradient-gold italic">Arrivals</span>
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

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelected(product)}
              className="group bg-charcoal-950 rounded-lg overflow-hidden border border-charcoal-800/50 hover:border-gold-700/40 card-hover cursor-pointer"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded ${badgeStyles[product.badge] || 'bg-charcoal-800 text-cream-200'}`}
                  >
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`absolute bottom-3 right-3 w-9 h-9 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg transition-all duration-300 ${
                    hoveredId === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  } ${addedId === product.id ? 'opacity-100 translate-y-0' : ''}`}
                  aria-label="Add to cart"
                >
                  {addedId === product.id ? <CheckCircle2 size={15} /> : <ShoppingBag size={15} />}
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-gold-500/70 text-[10px] tracking-[0.3em] uppercase mb-1">{product.brand} · {product.category}</p>
                <h3 className="text-cream-100 text-sm font-medium leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={product.rating} />
                  <span className="text-cream-200/40 text-[11px]">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-base">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-cream-200/40 text-xs line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="text-gold-500 text-xs font-medium hover:text-gold-300 transition-colors flex items-center gap-1"
                  >
                    {addedId === product.id ? (
                      <><CheckCircle2 size={11} className="text-emerald-400" /><span className="text-emerald-400">Added</span></>
                    ) : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
