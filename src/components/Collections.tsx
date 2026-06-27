import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import BreadcrumbSchema from './BreadcrumbSchema';

const STATIC_COLLECTIONS = [
  {
    id: 'electronic',
    handle: 'electronic-hunidors',
    name: 'Electronic Humidors',
    description: 'Climate-controlled precision storage with digital humidity management.',
    image: '/images/collections/electronic-humidors-hero.png',
    count: '9 Products',
    featured: true,
  },
  {
    id: 'desktop',
    handle: 'desktop-humidors',
    name: 'Desktop Humidors',
    description: 'Elegant stationary humidors for the discerning home collector.',
    image: '/images/collections/collections-travel-humidors.png',
    count: '22 Products',
    featured: false,
  },
  {
    id: 'cabinet-humidors',
    handle: 'cabinet-humidors',
    name: 'Cabinet Humidors',
    description: 'Floor-standing masterpieces from 600 to 4,000+ cigars — classic cedar cabinets and precision smart-climate systems.',
    image: '/images/collections/cabinet-humidors-hero.png',
    count: '8 Products',
    featured: false,
  },
  {
    id: 'travel',
    handle: 'travel-humidors',
    name: 'Travel Humidors',
    description: 'Protect your prized cigars wherever your journey takes you.',
    image: '/images/collections/chat-gpt-image-apr-15-2026.png',
    count: '18 Products',
    featured: false,
  },
  {
    id: 'accessories',
    handle: 'accessories-1',
    name: 'Accessories',
    description: 'Premium cutters, lighters, and care essentials for the aficionado.',
    image: '/images/collections/accessories-hero.png',
    count: '31 Products',
    featured: false,
  },
  {
    id: 'bespoke-walkins',
    handle: 'bespoke-walkins',
    name: 'Walk-in Humidors',
    description: 'Bespoke floor-to-ceiling installations for the ultimate cigar sanctuary.',
    image: '/images/collections/collections-banner.png',
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

export default function Collections() {
  const [collections] = useState<DisplayCollection[]>(STATIC_COLLECTIONS);
  // Note: Removed unnecessary fetchCollections API call
  // STATIC_COLLECTIONS provides excellent fallback and prevents waterfall
  // Collections page has dedicated fetching via Collections.tsx component

  return (
    <section id="collections" className="py-24 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/all-collections' }
          ]}
          className="mb-8"
        />


        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Shop by Collection
            </span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-4">
            Humidor Collections
          </h1>
          <p className="text-cream-200/60 text-lg max-w-xl mx-auto">
            Each collection is handpicked for quality, craftsmanship, and the
            signature of true luxury.
          </p>
        </div>

        {/* Collections Grid */}
        <h2 className="font-serif text-3xl text-white font-bold mb-8">Featured Collections</h2>
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
                  loading="lazy"
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
                    {col.description && (
                      <p className="text-cream-200/70 text-sm mb-2 line-clamp-2">
                        {col.description}
                      </p>
                    )}
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
