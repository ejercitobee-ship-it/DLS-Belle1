import { ArrowRight, CheckCircle2 } from 'lucide-react';

const features = [
  'Custom dimensions and finishes',
  'Climate-controlled systems',
  'Integrated lighting and display',
  'Commercial-grade humidity control',
  'Private consultation and design',
  'Installation and commissioning',
];

export default function Bespoke() {
  return (
    <section id="bespoke" className="py-24 bg-charcoal-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative overflow-hidden lg:overflow-visible">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              <img
                src="/generated-1777557488471-ycjey.png"
                alt="Bespoke walk-in humidor"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-4 right-4 bg-charcoal-900 border border-gold-700/30 rounded-lg p-5 shadow-xl shadow-black/50 max-w-[200px]">
              <div className="text-3xl font-serif font-bold text-gradient-gold mb-1">50+</div>
              <div className="text-cream-200/60 text-sm leading-snug">Bespoke installations worldwide</div>
            </div>

            {/* Decorative frame lines */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-gold-600/30 rounded-tl-sm pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-gold-600/30 rounded-br-sm pointer-events-none" />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Bespoke Solutions
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
              Your Vision,
              <br />
              <span className="text-gradient-gold italic">Masterfully Crafted</span>
            </h2>

            <p className="text-cream-200/60 text-lg leading-relaxed mb-8">
              From intimate private collections to grand commercial installations,
              our bespoke walk-in humidors are designed to transform any space into
              a sanctuary for the world's finest cigars. Each commission begins
              with a personal consultation.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-cream-200/70">
                  <CheckCircle2 size={15} className="text-gold-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://dunnluxuryselections.com/walk-in-humidor/"
                className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded hover:opacity-90 transition-opacity"
              >
                Request Consultation
                <ArrowRight size={15} />
              </a>
              <a
                href="/all-collections"
                className="inline-flex items-center gap-2 border border-gold-500/40 text-gold-400 font-medium text-sm tracking-widest uppercase px-7 py-4 rounded hover:bg-gold-700/10 transition-colors"
              >
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
