import { ArrowRight, Award, Shield, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

const trustBadges = [
  { icon: Award, label: 'Curated Luxury', sub: 'Handpicked collections' },
  { icon: Shield, label: 'Authenticity Guaranteed', sub: 'Certified products' },
  { icon: Truck, label: 'White-Glove Delivery', sub: 'Free on select items' },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[75vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/generated-1777557213922-8v5be.png"
          alt="Luxury humidor"
          className="w-full h-full object-cover object-center transition-transform duration-[1.2s] ease-out"
          style={{ transform: visible ? 'scale(1)' : 'scale(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/75 to-charcoal-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
      </div>

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-24 w-full">
        <div
          className="max-w-2xl transition-all duration-700 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '200ms',
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-3 md:mb-6">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-[10px] sm:text-xs font-medium tracking-[0.3em] sm:tracking-[0.4em] uppercase">
              Crafted for the Discerning Few
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-3 md:mb-6">
            The World's Finest
            <br />
            <span className="text-gradient-gold italic">Humidor Collections</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-cream-200/70 text-sm md:text-xl leading-relaxed mb-6 md:mb-10 max-w-lg">
            Dunn's Luxury Selections brings together the most exceptional humidors and cigar accessories in the world — curated for collectors, lounges, and connoisseurs who settle for nothing but the best.
          </p>

          {/* CTAs — stacked on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-16">
            <a
              href="/all-collections"
              className="flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded hover:opacity-90 active:scale-95 transition-all min-h-[52px]"
            >
              Explore Collections
              <ArrowRight size={16} />
            </a>
            <a
              href="https://dunnluxuryselections.com/#walk-in-humidor"
              className="flex items-center justify-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-sm tracking-widest uppercase px-7 py-4 rounded hover:bg-gold-700/10 active:bg-gold-700/20 transition-colors min-h-[52px]"
            >
              Bespoke Solutions
            </a>
          </div>

          {/* Trust badges — 1 column on xs, row on sm+ */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 md:gap-10">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-gold-500" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold tracking-wide">{label}</div>
                  <div className="text-cream-200/50 text-[11px]">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — hidden on small screens to save space */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-cream-200/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold-500/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
