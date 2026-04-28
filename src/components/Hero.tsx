import { ArrowRight, Award, Shield, Truck } from 'lucide-react';

const trustBadges = [
  { icon: Award, label: 'Curated Luxury', sub: 'Handpicked collections' },
  { icon: Shield, label: 'Authenticity Guaranteed', sub: 'Certified products' },
  { icon: Truck, label: 'White-Glove Delivery', sub: 'Free on select items' },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg"
          alt="Luxury humidor"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/70 to-charcoal-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
      </div>

      {/* Decorative gold line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              The Art of Preservation
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Where Cigars
            <br />
            <span className="text-gradient-gold italic">Meet Mastery</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-cream-200/70 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Precision-engineered humidors for cigar lounges, high-end bars, and
            private collectors who demand nothing less than perfection.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16">
            <a
              href="#collections"
              className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded hover:opacity-90 active:scale-95 transition-all"
            >
              Explore Collections
              <ArrowRight size={16} />
            </a>
            <a
              href="#bespoke"
              className="inline-flex items-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-sm tracking-widest uppercase px-7 py-4 rounded hover:bg-gold-700/10 transition-colors"
            >
              Bespoke Solutions
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 md:gap-10">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-cream-200/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gold-500/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
