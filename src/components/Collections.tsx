import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchCollections, type ShopifyCollection } from '../lib/shopify';

const STATIC_COLLECTIONS = [
  {
    id: 'desktop',
    handle: 'desktop-humidors',
    name: 'Desktop Humidors',
    description: 'Elegant stationary humidors for the discerning home collector.',
    image: '/generated-1777865999599-45xy3.png',
    count: '22 Products',
    featured: false,
  },
  {
    id: 'electronic',
    handle: 'electronic-hunidors',
    name: 'Electronic Humidors',
    description: 'Climate-controlled precision storage with digital humidity management.',
    image: '/generated-1777557213922-8v5be.png',
    count: '9 Products',
    featured: true,
  },
  {
    id: 'cabinet-humidors',
    handle: 'cabinet-humidors',
    name: 'Cabinet Humidors',
    description: 'Floor-standing masterpieces from 600 to 4,000+ cigars — classic cedar cabinets and precision smart-climate systems.',
    image: '/generated-1777557488471-ycjey.png',
    count: '8 Products',
    featured: false,
  },
  {
    id: 'travel',
    handle: 'travel-humidors',
    name: 'Travel Humidors',
    description: 'Protect your prized cigars wherever your journey takes you.',
    image: '/generated-1777557773655-n04ui.png',
    count: '18 Products',
    featured: false,
  },
  {
    id: 'accessories',
    handle: 'accessories-1',
    name: 'Accessories',
    description: 'Premium cutters, lighters, and care essentials for the aficionado.',
    image: '/generated-1777557978041-zp1qj.png',
    count: '31 Products',
    featured: false,
  },
  {
    id: 'bespoke-walkins',
    handle: 'bespoke-walkins',
    name: 'Walk-in Humidors',
    description: 'Bespoke floor-to-ceiling installations for the ultimate cigar sanctuary.',
    image: '/generated-1777558518629-e3jz3.png',
    count: 'By Commission',
    featured: true,
  },
];

type DisplayCollection = {
  id: string;
  handle: string;
  name: string;
  description: string;
  image: string;
  count: string;
  featured: boolean;
};

// Map Shopify handle → local nav id
const HANDLE_TO_NAV: Record<string, string> = {
  'desktop-humidors': 'desktop',
  'electronic-hunidors': 'electronic',
  'electronic-humidors': 'electronic',
  'cabinet-humidors': 'cabinet-humidors',
  'travel-humidors': 'travel',
  'accessories-1': 'accessories',
  'accessories': 'accessories',
  'bespoke-walkins': 'bespoke-walkins',
};

const FEATURED_HANDLES = new Set([
  'electronic-hunidors',
  'electronic-humidors',
  'bespoke-walkins',
]);

function fromShopify(col: ShopifyCollection, index: number): DisplayCollection {
  const navId = HANDLE_TO_NAV[col.handle] ?? col.handle;
  return {
    id: navId,
    handle: col.handle,
    name: col.title,
    description: col.description,
    image: col.image?.url ?? '',
    count: `${col.products.length > 0 ? col.products.length + ' Products' : 'View'}`,
    featured: FEATURED_HANDLES.has(col.handle) || index === 0,
  };
}

export default function Collections() {
  const [collections, setCollections] = useState<DisplayCollection[]>(STATIC_COLLECTIONS);

  useEffect(() => {
    fetchCollections(20)
      .then((cols) => {
        if (!cols.length) return;
        const mapped = cols
          .filter((c) => {
            // Only show collections that map to a known nav section
            return HANDLE_TO_NAV[c.handle] !== undefined ||
              FEATURED_HANDLES.has(c.handle) ||
              ['desktop-humidors','electronic-hunidors','electronic-humidors','cabinet-humidors','travel-humidors','accessories-1','accessories'].includes(c.handle);
          })
          .map((c, i) => fromShopify(c, i));
        if (mapped.length >= 4) setCollections(mapped);
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return (
    <section id="collections" className="py-12 md:py-24 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Shop by Collection
            </span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mb-4">
            Curated for <span className="text-gradient-gold italic">Connoisseurs</span>
          </h2>
          <p className="text-cream-200/60 text-sm md:text-lg max-w-xl mx-auto">
            Each collection is handpicked for quality, craftsmanship, and the
            signature of true luxury.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {collections.map((col, i) => (
            <a
              key={col.id}
              href={`#${col.id}`}
              className={`group relative overflow-hidden rounded-lg card-hover ${
                col.featured && i === 0 ? 'sm:col-span-2 lg:col-span-1 row-span-2' : ''
              }`}
              style={{ minHeight: col.featured && i === 0 ? '320px' : '240px' }}
            >
              {col.image ? (
                <img
                  src={col.image}
                  alt={col.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-charcoal-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/50 to-transparent" />
              <div className="absolute inset-0 border border-transparent group-hover:border-gold-500/30 rounded-lg transition-colors duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-gold-400 text-[10px] tracking-[0.3em] uppercase mb-1">{col.count}</p>
                    <h3 className="font-serif text-lg md:text-2xl text-white font-semibold mb-1 leading-snug">
                      {col.name}
                    </h3>
                    {/* Description hidden — Shopify returns long blog text */}
                  </div>
                  {/* Arrow: always visible on mobile, hover-reveal on md+ */}
                  <div className="w-9 h-9 md:w-9 md:h-9 rounded-full border border-gold-500/50 flex items-center justify-center text-gold-400 flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
