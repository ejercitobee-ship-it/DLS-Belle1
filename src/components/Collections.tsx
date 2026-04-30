import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchCollections, type ShopifyCollection } from '../lib/shopify';

const STATIC_COLLECTIONS = [
  {
    id: 'cabinet-humidors',
    handle: 'cabinet-humidors',
    name: 'Cabinet Humidors',
    description: 'Floor-standing masterpieces from 600 to 4,000+ cigars — classic cedar cabinets, dual-zone wine & cigar pairings, and precision smart-climate systems.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_5590c39d-3612-44eb-9dc9-00a747f7a593.png',
    count: '8 Products',
    featured: true,
  },
  {
    id: 'desktop',
    handle: 'desktop-humidors',
    name: 'Desktop Humidors',
    description: 'Elegant stationary humidors for the discerning home collector.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_53_15_20PM_58d3c7d7-0abd-4484-9134-6aadfd64abfd.png',
    count: '22 Products',
    featured: false,
  },
  {
    id: 'electronic',
    handle: 'electronic-hunidors',
    name: 'Electronic Humidors',
    description: 'Climate-controlled precision storage with digital humidity management.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/ChatGPT_20Image_20Apr_2016_202026_2005_27_27_20PM_a49256d8-5931-453f-be44-8d33853ae843.png',
    count: '9 Products',
    featured: true,
  },
  {
    id: 'travel',
    handle: 'travel-humidors',
    name: 'Travel Humidors',
    description: 'Protect your prized cigars wherever your journey takes you.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/Chat-GPT-Image-Apr-15-2026-03-58-42-PM_4b5fd768-7cd5-41d5-95bf-a8e2aa58523e.png',
    count: '18 Products',
    featured: false,
  },
  {
    id: 'accessories',
    handle: 'accessories-1',
    name: 'Accessories',
    description: 'Premium cutters, lighters, and care essentials for the aficionado.',
    image: 'https://dunnluxuryselections.com/cdn/shop/collections/Gemini_Generated_Image_kb1oj6kb1oj6kb1o_0c77e364-831a-459f-9d43-be7b388ae4dc.png',
    count: '31 Products',
    featured: false,
  },
  {
    id: 'bespoke-walkins',
    handle: 'bespoke-walkins',
    name: 'Walk-in Humidors',
    description: 'Bespoke floor-to-ceiling installations for the ultimate cigar sanctuary.',
    image: 'https://dunnluxuryselections.com/cdn/shop/files/ChatGPT_Image_Apr_24_2026_01_29_33_PM.png',
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
  'cabinet-humidors': 'cabinet-humidors',
  'desktop-humidors': 'desktop',
  'electronic-hunidors': 'electronic',
  'electronic-humidors': 'electronic',
  'travel-humidors': 'travel',
  'accessories-1': 'accessories',
  'accessories': 'accessories',
  'bespoke-walkins': 'bespoke-walkins',
};

const FEATURED_HANDLES = new Set([
  'cabinet-humidors',
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
              ['cabinet-humidors','desktop-humidors','electronic-hunidors','electronic-humidors','travel-humidors','accessories-1','accessories'].includes(c.handle);
          })
          .map((c, i) => fromShopify(c, i));
        if (mapped.length >= 4) setCollections(mapped);
      })
      .catch(() => {/* keep static fallback */});
  }, []);

  return (
    <section id="collections" className="py-24 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Shop by Collection
            </span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
            Curated for <span className="text-gradient-gold italic">Connoisseurs</span>
          </h2>
          <p className="text-cream-200/60 text-lg max-w-xl mx-auto">
            Each collection is handpicked for quality, craftsmanship, and the
            signature of true luxury.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((col, i) => (
            <a
              key={col.id}
              href={`#${col.id}`}
              className={`group relative overflow-hidden rounded-lg card-hover ${
                col.featured && i === 0 ? 'sm:col-span-2 lg:col-span-1 row-span-2' : ''
              }`}
              style={{ minHeight: col.featured && i === 0 ? '480px' : '280px' }}
            >
              {col.image ? (
                <img
                  src={col.image}
                  alt={col.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-charcoal-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/95 via-charcoal-950/40 to-transparent" />
              <div className="absolute inset-0 border border-transparent group-hover:border-gold-500/30 rounded-lg transition-colors duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-gold-400 text-[10px] tracking-[0.3em] uppercase mb-1">{col.count}</p>
                    <h3 className="font-serif text-xl md:text-2xl text-white font-semibold mb-1">
                      {col.name}
                    </h3>
                    <p className="text-cream-200/60 text-sm leading-snug max-w-xs hidden group-hover:block transition-all">
                      {col.description}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-gold-500/50 flex items-center justify-center text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-3">
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
