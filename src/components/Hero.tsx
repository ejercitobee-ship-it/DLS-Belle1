import { ArrowRight, Award, Shield, Truck } from 'lucide-react';

const trustBadges = [
  { icon: Award, label: 'Curated Luxury', sub: 'Handpicked collections' },
  { icon: Shield, label: 'Authenticity Guaranteed', sub: 'Certified products' },
  { icon: Truck, label: 'White-Glove Delivery', sub: 'Free on select items' },
];

export default function Hero({ onOpenBuyerGuideModal }: { onOpenBuyerGuideModal?: () => void }) {
  return (
    <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.png"
          alt="Luxury humidor"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/75 to-charcoal-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
      </div>

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Crafted for the Discerning Few
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 md:mb-6">
            The World's Finest
            <br />
            <span className="text-gradient-gold italic">Humidor Collections</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-cream-200/70 text-base md:text-xl leading-relaxed mb-8 md:mb-10 max-w-lg">
            Dunn's Luxury Selections brings together the most exceptional humidors and cigar accessories in the world — curated for collectors, lounges, and connoisseurs who settle for nothing but the best.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 md:mb-16 max-w-sm sm:max-w-none">
            <a
              href="/all-collections"
              className="flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded hover:opacity-90 active:scale-95 transition-all"
            >
              Explore Collections
              <ArrowRight size={16} />
            </a>
            <a
              href="https://dunnluxuryselections.com/walk-in-humidor/"
              className="flex items-center justify-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-sm tracking-widest uppercase px-7 py-4 rounded hover:bg-gold-700/10 active:bg-gold-700/20 transition-colors"
            >
              Bespoke Solutions
            </a>
            {onOpenBuyerGuideModal && (
              <button
                onClick={onOpenBuyerGuideModal}
                className="inline-block px-6 py-3 bg-gold-600 text-white font-semibold rounded-lg hover:bg-gold-700 transition-colors"
              >
                Download Free Guide
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-10">
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
