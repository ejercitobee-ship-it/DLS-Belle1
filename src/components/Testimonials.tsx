import { memo } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'James Hartwell',
    role: 'Private Collector, London',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 5,
    text: 'The Raching cabinet I purchased has completely transformed how I store my collection. The precision humidity control is unmatched and the craftsmanship is extraordinary.',
    product: 'Raching RR980',
  },
  {
    id: 2,
    name: 'Marcus de Vries',
    role: 'Owner, The Cigar Lounge Amsterdam',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    rating: 5,
    text: "Dunn's installed our bespoke walk-in humidor and the result exceeded every expectation. Our clients are consistently amazed. Truly the signature of luxury.",
    product: 'Bespoke Walk-in Installation',
  },
  {
    id: 3,
    name: 'Alessandro Ferrari',
    role: 'F&B Director, Milan',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
    rating: 5,
    text: 'Professional service from consultation to delivery. The Santiago counter display elevates our bar programme and attracts serious aficionados every evening.',
    product: 'Santiago Counter Display',
  },
];

export default memo(Testimonials);

function Testimonials() {
  return (
    <section className="py-24 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              The Aficionado's Verdict
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
            Trusted by <span className="text-gradient-gold italic">Connoisseurs</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={18} className="text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-white font-semibold">4.9</span>
            <span className="text-cream-200/40 text-sm">· 10 verified reviews</span>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-charcoal-950 border border-charcoal-800/60 hover:border-gold-700/30 rounded-lg p-6 transition-colors duration-300 group"
            >
              <Quote size={28} className="text-gold-600/40 mb-4" />

              <p className="text-cream-200/70 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-1 mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={11} className={`${s <= t.rating ? 'text-gold-500 fill-gold-500' : 'text-charcoal-700'}`} />
                ))}
              </div>

              <div className="border-t border-charcoal-800/60 pt-4 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover object-top grayscale group-hover:grayscale-0 transition-all"
                  loading="lazy"
                  width="40"
                  height="40"
                />
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-cream-200/40 text-xs">{t.role}</div>
                </div>
              </div>

              <div className="mt-3 text-gold-500/50 text-[10px] tracking-[0.25em] uppercase">
                {t.product}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
