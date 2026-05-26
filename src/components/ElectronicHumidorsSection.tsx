import { useState } from 'react';
import { ShoppingBag, Star, ArrowRight, CheckCircle2, Zap, Loader2, ZoomIn, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopifyCollection, formatMoney, getDefaultVariantId } from '../hooks/useShopifyCollection';
import type { ShopifyProduct } from '../lib/shopify';

const STATIC_PRODUCTS = [
  {
    id: 's-1',
    name: 'Raching RR980 Cigar Humidor',
    price: '$6,387',
    priceNum: 6387,
    badge: 'Flagship',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
    capacity: '3,000–4,000 cigars',
    features: ['TFT touchscreen', 'Fingerprint lock', 'Mobile app unlock'],
  },
  {
    id: 's-2',
    name: 'RACHING CT48A Stainless Steel Grand Humidor',
    price: '$4,752',
    priceNum: 4752,
    badge: 'Premium',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    capacity: '2,500–3,000 cigars',
    features: ['Anti-fingerprint steel', 'Quick dehumidification', 'Ammonia removal'],
  },
  {
    id: 's-3',
    name: 'Raching MON800A Precision Climate Humidor',
    price: '$1,824',
    priceNum: 1824,
    image: 'https://dunnluxuryselections.com/cdn/shop/files/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
    capacity: '500–600 cigars',
    features: ['LCD digital screen', 'Water-cooling', 'Cedar shelves'],
  },
  {
    id: 's-4',
    name: 'Reagan Electronic Cabinet Humidor',
    price: '$6,147',
    priceNum: 6147,
    badge: 'Bestseller',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/CT48A-silver.jpg',
    capacity: 'Up to 4,000 cigars',
    features: ['LCD touchscreen', 'Dual climate zones', 'Cedar-lined shelves'],
  },
];

type DisplayProduct = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  badge?: string;
  image: string;
  capacity: string;
  features: string[];
  shopifyVariantId?: string;
  rating?: number;
};

function fromShopify(p: ShopifyProduct): DisplayProduct {
  const variantId = getDefaultVariantId(p);
  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
  const price = variant?.price ?? p.priceRange.minVariantPrice;
  const image = variant?.image?.url ?? p.featuredImage?.url ?? '';
  return {
    id: `shopify-${p.id}`,
    name: p.title,
    price: formatMoney(price.amount, price.currencyCode),
    priceNum: parseFloat(price.amount),
    badge: p.tags.find((t) => ['Flagship', 'Bestseller', 'Premium', 'New'].includes(t)),
    image,
    capacity: p.description?.match(/(\d[\d,]*)\s*cigars/i)?.[0] ?? '',
    features: p.tags.slice(0, 3),
    shopifyVariantId: variantId,
    rating: 5,
  };
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} className={s <= Math.round(rating) ? 'text-gold-500 fill-gold-500' : 'text-charcoal-700'} />
      ))}
    </div>
  );
}

function ProductDetailModal({ product, onClose }: { product: DisplayProduct; onClose: () => void }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'Electronic Humidors',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      {zoomImg && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImg(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal-800/80 text-white" onClick={() => setZoomImg(null)}><X size={20} /></button>
          <img src={zoomImg} alt={product.name} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-charcoal-950 rounded-t-2xl overflow-y-auto md:inset-0 md:m-auto md:rounded-xl md:max-w-2xl md:max-h-[85vh]" style={{ maxHeight: '90dvh' }}>
        <div className="flex justify-center pt-3 pb-1 md:hidden"><div className="w-10 h-1 bg-charcoal-700 rounded-full" /></div>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-charcoal-800 text-cream-200/60 hover:text-white"><X size={17} /></button>
        <div className="px-5 pt-4 pb-8 md:px-8 md:pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-xl overflow-hidden aspect-square bg-charcoal-900">
              <button className="w-full h-full block group/img" onClick={() => setZoomImg(product.image)}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center"><ZoomIn size={28} className="text-white opacity-0 group-hover/img:opacity-100" /></div>
              </button>
              {product.badge && (
                <div className="absolute top-3 left-3 bg-gold-gradient text-charcoal-950 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">{product.badge}</div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-gold-500/70 text-[10px] tracking-[0.4em] uppercase mb-2">Electronic Humidor</p>
              <h2 className="font-serif text-2xl text-white font-bold leading-tight mb-3">{product.name}</h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-white font-serif">{product.price}</span>
              </div>
              <StarRating rating={product.rating} />
              {product.capacity && (
                <p className="text-cream-200/50 text-sm mt-3 mb-4">Capacity: <span className="text-cream-100">{product.capacity}</span></p>
              )}
              <ul className="space-y-2 mb-6">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-cream-200/65">
                    <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-3">
                <button onClick={handleAdd} className="flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase py-4 rounded-lg hover:opacity-90 active:scale-95 transition-all">
                  {added ? <><CheckCircle2 size={16} /> Added!</> : <><ShoppingBag size={16} /> Add to Cart</>}
                </button>
                <a href="/electronic-humidors" className="text-center text-xs text-gold-400 hover:text-gold-300 transition-colors">View Full Collection →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-charcoal-950 rounded-xl overflow-hidden border border-charcoal-800/50 animate-pulse">
      <div className="aspect-[4/3] bg-charcoal-800" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 bg-charcoal-800 rounded w-1/2" />
        <div className="h-3.5 bg-charcoal-800 rounded w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-charcoal-800 rounded w-1/4" />
          <div className="h-8 bg-charcoal-800 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export default function ElectronicHumidorsSection() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<DisplayProduct | null>(null);
  const { addItem } = useCart();
  const { products: shopifyProducts, loading } = useShopifyCollection('electronic-humidors', 'electronic-hunidors');

  const products: DisplayProduct[] = shopifyProducts.length
    ? shopifyProducts.map(fromShopify)
    : STATIC_PRODUCTS;

  const handleAddToCart = (e: React.MouseEvent, product: DisplayProduct) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'Electronic Humidors',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      <section id="electronic-humidors-section" className="py-16 md:py-24 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(180,140,60,0.06),_transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold-500" />
                <span className="inline-flex items-center gap-2 text-gold-400 text-xs font-semibold tracking-[0.4em] uppercase">
                  <Zap size={11} className="text-gold-400" />
                  Precision Climate Control
                </span>
                <div className="h-px w-8 bg-gold-500" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-white font-bold leading-tight">
                Electronic <span className="text-gradient-gold italic">Humidors</span>
              </h2>
              <p className="text-cream-200/45 text-sm mt-2 max-w-md">
                Smart climate-controlled storage with digital precision — engineered for the serious collector.
              </p>
            </div>
            <a
              href="/electronic-humidors"
              className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors group self-start md:self-auto border border-gold-600/30 hover:border-gold-500/50 px-5 py-2.5 rounded-lg hover:bg-gold-700/10"
            >
              View All Electronic Humidors
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {products.slice(0, 8).map((product) => {
                const isAdded = addedId === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSelected(product)}
                    className="group bg-charcoal-950 rounded-xl overflow-hidden border border-charcoal-800/50 hover:border-gold-600/50 card-hover cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gold-900/10"
                  >
                    <div className="relative overflow-hidden aspect-square bg-charcoal-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.badge && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="inline-flex items-center gap-1 bg-charcoal-950 text-gold-400 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border border-gold-600/40 shadow-md">
                            {product.badge}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                        <ZoomIn size={22} className="text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" />
                      </div>
                    </div>

                    <div className="p-3 md:p-4">
                      <p className="text-gold-500/60 text-[9px] md:text-[10px] tracking-[0.3em] uppercase mb-1 truncate">Electronic Humidor</p>
                      <h3 className="text-cream-100 text-xs md:text-sm font-medium leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">{product.name}</h3>
                      <StarRating rating={product.rating} />
                      <div className="flex items-center justify-between mt-2.5 gap-2">
                        <span className="text-white font-bold text-sm md:text-base truncate font-serif">{product.price}</span>
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className={`flex-shrink-0 flex items-center gap-1 text-[10px] md:text-xs font-semibold tracking-wide uppercase py-1.5 px-2.5 md:px-3 rounded-lg transition-all active:scale-95 ${
                            isAdded
                              ? 'bg-emerald-700/20 text-emerald-400 border border-emerald-700/40'
                              : 'bg-gold-gradient text-charcoal-950 hover:opacity-90'
                          }`}
                          aria-label="Add to cart"
                        >
                          {isAdded ? <><CheckCircle2 size={11} /> <span className="hidden sm:inline">Added</span></> : <><ShoppingBag size={11} /> <span className="hidden sm:inline">Add</span></>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <Loader2 size={32} className="text-charcoal-600 mx-auto mb-4" />
              <p className="text-cream-200/40 text-sm">Unable to load products. Please refresh.</p>
            </div>
          )}
        </div>
      </section>

      {selected && <ProductDetailModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
