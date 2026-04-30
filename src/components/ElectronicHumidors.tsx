import { useState } from 'react';
import { ShoppingBag, Star, ChevronDown, ArrowLeft, Zap, Thermometer, Droplets, Box, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Product = {
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

const products: Product[] = [
  {
    id: 1,
    name: 'Raching RR980 Cigar Humidor',
    brand: 'Raching',
    price: '$6,387',
    priceNum: 6387,
    badge: 'Flagship',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
    secondImage: 'https://dunnluxuryselections.com/cdn/shop/files/e1c939f2e749e72ea7323ff5cf6f9c1f.jpg',
    capacity: '3,000–4,000 cigars',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% RH (±1%)',
    cooling: 'High-Efficiency Water-Cooling',
    shelves: '6 Spanish cedar shelves + 4 drawers',
    dimensions: '690 × 700 × 1865 mm',
    features: [
      'TFT touchscreen display',
      'Fingerprint + password lock',
      'Mobile app remote unlock',
      'Ammonia removal control',
      'Customisable LED lighting',
      'Integrated cigar diagnostics',
      '110V/220V global compatibility',
    ],
    description:
      'Redefines what a premium aging vault should be. With expanded storage, smart locking, and real-time cigar diagnostics, the RR980 is built for serious collectors who demand precision, prestige, and presence.',
    rating: 5,
    reviews: 3,
  },
  {
    id: 2,
    name: 'RACHING CT48A Stainless Steel Grand Humidor',
    brand: 'Raching',
    price: '$4,752',
    priceNum: 4752,
    badge: 'Premium',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    secondImage: 'https://dunnluxuryselections.com/cdn/shop/files/1_1.jpg',
    capacity: '2,500–3,000 cigars',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% (±1%)',
    cooling: 'Advanced Water-Cooling System',
    shelves: '8 Spanish cedar shelves (3 slide-rail)',
    dimensions: '690 × 700 × 1850 mm',
    features: [
      'Anti-fingerprint stainless steel exterior',
      'Quick dehumidification drawer',
      'Ammonia removal device',
      '3 slide-rail deep-access shelves',
      'Industrial-grade reliability',
      'Partition boards included',
    ],
    description:
      'A bold fusion of industrial strength and refined luxury. The CT48A\'s stainless steel finish is as striking as its performance — built for collections that demand both beauty and precision.',
    rating: 5,
    reviews: 1,
  },
  {
    id: 3,
    name: 'Raching MON800A Carbon Fiber Edition',
    brand: 'Raching',
    price: '$2,352',
    priceNum: 2352,
    badge: 'New',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    secondImage: 'https://dunnluxuryselections.com/cdn/shop/files/SD800_5b5033f5-6084-4638-8d34-9270e189a578.jpg',
    capacity: '500–600 cigars (~150L)',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% RH (±1%)',
    cooling: 'Water-Cooling System',
    shelves: '2-layer Spanish cedar shelves',
    dimensions: '600 × 610 × 820 mm',
    features: [
      'Carbon fiber exterior',
      'LCD digital control panel',
      'Whisper-quiet operation',
      'Professional-grade cooling',
      'Lightweight at 59 kg',
      'Contemporary design',
    ],
    description:
      'Professional-grade climate control wrapped in striking carbon fiber. The MON800A Carbon Fiber Edition combines advanced technology with contemporary aesthetics for the modern aficionado.',
    rating: 4.8,
    reviews: 4,
  },
  {
    id: 4,
    name: 'Raching MON800A Precision Climate Humidor',
    brand: 'Raching',
    price: '$1,824',
    priceNum: 1824,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    secondImage: 'https://dunnluxuryselections.com/cdn/shop/files/cs6006.jpg',
    capacity: '500–600 cigars (~150L)',
    temperature: '16–22°C (±1°C)',
    humidity: '60–75% RH (±1%)',
    cooling: 'Water-Cooling Technology',
    shelves: '2-layer Spanish cedar shelves',
    dimensions: '600 × 610 × 820 mm',
    features: [
      'LCD digital screen',
      'Industrial-grade reliability',
      'Integrated cooling system',
      'Easy maintenance design',
      'Durable elegant finish',
      '59 kg net weight',
    ],
    description:
      'Professional-grade cabinet for serious cigar enthusiasts and premium venues. Combines industrial reliability with elegant design, delivering consistent precision climate control.',
    rating: 4.8,
    reviews: 1,
  },
  {
    id: 5,
    name: 'Reagan Electronic Cabinet Humidor',
    brand: 'Reagan',
    price: '$6,147',
    priceNum: 6147,
    badge: 'Bestseller',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    capacity: 'Up to 4,000 cigars',
    temperature: '41–71°F (dual climate zones)',
    humidity: '56–78% (dual zones)',
    cooling: 'Dual circulating fans + reservoirs',
    shelves: '12 cedar-lined sliding shelves',
    dimensions: 'Furniture-grade cabinet',
    features: [
      'LCD touchscreen display',
      'Dual climate zones',
      'Dual water reservoirs',
      'Tinted tempered glass doors',
      'White LED interior lighting',
      'De-mist function',
      '110/120V or 220/240V',
      'Crown molding + embossed panels',
    ],
    description:
      'Redefines luxury cigar storage by blending furniture-grade elegance with professional-grade climate control. The Reagan Cabinet is the centrepiece of any serious cigar room or lounge.',
    rating: 4.9,
    reviews: 6,
  },
  {
    id: 6,
    name: 'Raching SD800 Dual-Zone Cigar & Wine Cabinet',
    brand: 'Raching',
    price: '$5,972',
    priceNum: 5972,
    badge: 'Featured',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-sd800-dual-zone-cigar-wine-cabinet.jpg',
    secondImage: 'https://dunnluxuryselections.com/cdn/shop/files/SD800_5b5033f5-6084-4638-8d34-9270e189a578.jpg',
    capacity: '1,500–1,600 cigars + 120–130 wine bottles',
    temperature: 'Cigar: 16–22°C · Wine: 5–22°C',
    humidity: '60–75% RH (±1%)',
    cooling: 'Water-cooling + high-performance compressor',
    shelves: '8 Spanish cedar + 9 beech wood shelves',
    dimensions: '1200 × 610 × 1920 mm',
    features: [
      'Independent dual-zone doors',
      'Spanish cedar cigar zone',
      'Beech wood wine shelving',
      'Large display glass door',
      'Refined wooden accents',
      'Whisper-quiet operation',
      'Energy-efficient design',
      '~190 kg, ~760L total volume',
    ],
    description:
      'Blends precise climate control with sophisticated design — housing a world-class cigar collection and premium wine cellar in a single, stunning cabinet.',
    rating: 5,
    reviews: 2,
  },
  {
    id: 7,
    name: 'Raching CS600 Luxury Wine & Cigar Cabinet',
    brand: 'Raching',
    price: '$3,360',
    priceNum: 3360,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    secondImage: 'https://dunnluxuryselections.com/cdn/shop/files/cs6006.jpg',
    capacity: '1,200–1,400 cigars + 100–110 wine bottles',
    temperature: 'Cigar: 16–22°C · Wine: 5–22°C',
    humidity: '60–75% RH (±2%)',
    cooling: 'Integrated compressor cooling',
    shelves: '7 Spanish cedar + 10 beech wood shelves',
    dimensions: '1200 × 610 × 1760 mm',
    features: [
      '2-year warranty',
      'Double-door combined unit',
      'Digital control panel',
      'Large glass door display',
      'Spanish cedar + beech wood',
      'Whisper-quiet operation',
      'Energy-efficient',
    ],
    description:
      'Fuses precision climate control with sophisticated design for serious collectors wanting both worlds — premium cigar preservation and wine cellar performance in one refined cabinet.',
    rating: 4.7,
    reviews: 3,
  },
];

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
        <Star
          key={s}
          size={11}
          className={s <= Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-charcoal-700'}
        />
      ))}
    </div>
  );
}

type SelectedProduct = Product | null;

function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({ id: `eh-${product.id}`, name: product.name, subtitle: product.capacity, price: product.price, priceNum: product.priceNum, image: product.image, category: 'Electronic' });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-charcoal-950 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Electronic Humidors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
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
            <p className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">{product.brand}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-4">
              {product.name}
            </h1>

            {product.rating && (
              <div className="flex items-center gap-2 mb-5">
                <StarRating rating={product.rating} />
                <span className="text-white text-sm font-medium">{product.rating}</span>
                <span className="text-cream-200/40 text-sm">({product.reviews} reviews)</span>
              </div>
            )}

            <div className="text-3xl font-bold text-white mb-6 font-serif">{product.price}</div>

            <p className="text-cream-200/60 leading-relaxed mb-8">{product.description}</p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Box, label: 'Capacity', value: product.capacity },
                { icon: Thermometer, label: 'Temperature', value: product.temperature },
                { icon: Droplets, label: 'Humidity', value: product.humidity },
                { icon: Zap, label: 'Cooling', value: product.cooling },
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

            {/* Storage details */}
            <div className="mb-6 p-4 bg-charcoal-900/60 border border-charcoal-800/40 rounded-lg">
              <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-1.5">Storage</p>
              <p className="text-cream-100 text-sm">{product.shelves}</p>
              <p className="text-cream-200/50 text-xs mt-1">{product.dimensions}</p>
            </div>

            {/* Features */}
            <div className="mb-8">
              <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-3">Key Features</p>
              <div className="flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <span key={f} className="text-xs text-cream-200/70 bg-charcoal-900 border border-charcoal-800/50 px-3 py-1 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
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
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ElectronicHumidors() {
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedProduct>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({ id: `eh-${product.id}`, name: product.name, subtitle: product.capacity, price: product.price, priceNum: product.priceNum, image: product.image, category: 'Electronic' });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.priceNum - b.priceNum;
    if (sort === 'price-desc') return b.priceNum - a.priceNum;
    return 0;
  });

  if (selected) {
    return <ProductDetail product={selected} onBack={() => setSelected(null)} />;
  }

  const currentSortLabel = sortOptions.find((o) => o.value === sort)?.label ?? 'Featured';

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src="https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_a49256d8-5931-453f-be44-8d33853ae843.png"
          alt="Electronic Humidors"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/60 to-charcoal-950/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Collection
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Electronic <span className="text-gradient-gold italic">Humidors</span>
            </h1>
            <p className="text-cream-200/60 mt-2 max-w-lg">
              Precision climate-controlled cabinets for discerning collectors and luxury venues.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-charcoal-800/50">
          <p className="text-cream-200/40 text-sm">
            <span className="text-white font-medium">{products.length}</span> products
          </p>

          {/* Sort dropdown */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((product) => (
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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {product.badge && (
                  <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded ${badgeStyles[product.badge] || ''}`}>
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`absolute bottom-3 right-3 w-9 h-9 bg-gold-gradient rounded flex items-center justify-center text-charcoal-950 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${addedId === product.id ? 'opacity-100 translate-y-0' : ''}`}
                  aria-label="Add to cart"
                >
                  {addedId === product.id ? <CheckCircle2 size={15} /> : <ShoppingBag size={15} />}
                </button>
              </div>

              {/* Card body */}
              <div className="p-5">
                <p className="text-gold-500/60 text-[10px] tracking-[0.3em] uppercase mb-1.5">{product.brand}</p>
                <h3 className="text-cream-100 text-sm font-semibold leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
                  {product.name}
                </h3>

                {/* Specs pills */}
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
            </div>
          ))}
        </div>

        {/* Related collections */}
        <div className="mt-20 pt-12 border-t border-charcoal-800/40">
          <p className="text-cream-200/30 text-[10px] tracking-[0.4em] uppercase mb-6 text-center">
            Explore Other Collections
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Counter Displays', 'Desktop Humidors', 'Travel Humidors', 'Accessories', 'Bespoke Walk-ins'].map((col) => (
              <a
                key={col}
                href="#collections"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }))}
                className="text-xs text-cream-200/40 hover:text-gold-400 border border-charcoal-800/60 hover:border-gold-600/30 px-4 py-2 rounded-full transition-colors"
              >
                {col}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
