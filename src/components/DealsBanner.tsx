import { Tag, ArrowRight } from 'lucide-react';

const deals = [
  {
    name: 'Traveler 5 Travel Humidor',
    original: '$44',
    sale: '$30',
    saving: '32% Off',
    image: '/generated-1777557773655-n04ui.png',
  },
  {
    name: 'Dane Desktop Humidor',
    original: '$220',
    sale: '$185',
    saving: '16% Off',
    image: 'https://images.pexels.com/photos/1267317/pexels-photo-1267317.jpeg',
  },
  {
    name: 'Chalet Portable Humidor',
    original: '$50',
    sale: '$38',
    saving: '24% Off',
    image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg',
  },
];

export default function DealsBanner() {
  return (
    <section className="py-20 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Tag size={14} className="text-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Limited Edition Deals
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">
              Exclusive <span className="text-gradient-gold italic">Savings</span>
            </h2>
          </div>
          <a href="#collections" className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium group hover:text-gold-300 transition-colors">
            All Deals <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Deal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {deals.map((deal) => (
            <div key={deal.name} className="group relative rounded-lg overflow-hidden bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/30 card-hover cursor-pointer">
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute top-3 right-3 bg-red-700 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                {deal.saving}
              </div>
              <div className="p-4">
                <p className="text-cream-100 text-sm font-medium mb-2 line-clamp-1">{deal.name}</p>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-lg">{deal.sale}</span>
                  <span className="text-cream-200/40 text-sm line-through">{deal.original}</span>
                </div>
                <button className="mt-3 w-full text-center text-xs font-semibold tracking-widest uppercase text-charcoal-950 bg-gold-gradient py-2.5 rounded hover:opacity-90 transition-opacity">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
