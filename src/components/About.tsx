import { Gem, Globe, Shield, Star } from 'lucide-react';

const milestones = [
  { year: '2025', title: 'Founded', desc: 'Brian\'s vision becomes Dunn\'s Luxury Selections, bringing curated precision-engineered humidors to discerning collectors nationwide.' },
  { year: '2026', title: 'Strategic Partnerships', desc: 'Partnered with industry-leading brands — Raching, Akar, Humidor Supreme, Palio, Cigar Caddy, and Stinky — collectively representing 200+ years of expertise in humidor engineering and design.' },
];

const values = [
  {
    icon: Gem,
    title: 'Uncompromising Curation',
    description: 'Every product that bears the Dunn\'s name has been personally evaluated for material quality, engineering precision, and aesthetic excellence. We decline more than we accept.',
  },
  {
    icon: Shield,
    title: 'Expert Integrity',
    description: 'We provide honest, informed guidance — not sales pressure. Our team are genuine aficionados who understand that the right solution varies for every collection.',
  },
  {
    icon: Globe,
    title: 'Nationwide Commitment',
    description: 'From Miami to Seattle, we deliver with white-glove care. Distance does not diminish service — every customer receives the same premium experience.',
  },
  {
    icon: Star,
    title: 'Passion for the Craft',
    description: 'Cigars are a living art form. We share our clients\' reverence for the ritual of preparation, storage, and enjoyment that transforms a cigar into an experience.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-charcoal-950">

      {/* Hero */}
      <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/brian-dunn-founder.png"
            alt="Brian Dunn, Founder"
            className="w-full h-full object-cover"
            style={{ objectPosition: '60% center' }}
          />
          {/* Primary Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/75 to-charcoal-950/50" />
          {/* Secondary Gradient for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
        </div>

        {/* Decorative gold line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/60 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-3 sm:mb-4 md:mb-6">
              <div className="h-px w-8 sm:w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Our Founder's Story
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-3 sm:mb-4 md:mb-6">
              The Man<br />
              <span className="text-gold-400 italic">Behind It</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-cream-200/70 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-lg">
              The engineer who refused to settle for mediocre humidors — and built America's premier collection destination.
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-cream-200/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold-500/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Act 1: Brian's Origin Story */}
      <section className="py-16 sm:py-20 md:py-24 bg-charcoal-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-article leading-relaxed space-y-4 sm:space-y-6">

            <p className="text-base sm:text-lg text-cream-100 leading-relaxed">
              Brian Dunn, an engineer at one of America's largest banks, discovered his passion for cigars during his banking career in Chicago. Like many collectors, he quickly realized the humidor market offered only two inadequate options: cheap imports with no support, or mass-produced furniture that treated cigars as an afterthought.
            </p>

            <p className="text-lg text-cream-100 leading-relaxed">
              But Brian saw a deeper problem. Every collector's needs were different. One person needed a 500-cigar cabinet for a man cave. Another needed a precision walk-in system for a retail lounge. A third needed a bespoke solution for a specific space. Yet the industry offered only generic, off-the-shelf answers. Brian believed every collection deserved a custom-engineered solution, designed with precision engineering and tailored to that collector's unique vision.
            </p>

            <p className="text-lg text-cream-100 leading-relaxed">
              This conviction — that cigars and their storage deserve better — became the foundation of Dunn's Luxury Selections. Not just selling humidors. <span className="text-gold-400">Designing them.</span> Custom-engineered, precision-crafted solutions for collectors who refuse to compromise.
            </p>

            <p className="text-lg text-cream-100 leading-relaxed">
              In 2025, Brian founded Dunn's Luxury Selections to bring that vision to life. By early 2026, he'd partnered with the industry's most respected brands to expand the possibilities — ensuring that whether you need a curated collection piece or a fully custom walk-in sanctuary, Brian's team can engineer the perfect solution.
            </p>

          </div>
        </div>
      </section>

      {/* Founder's Quote */}
      <section className="py-20 bg-charcoal-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="space-y-4">
            <p className="font-serif text-3xl md:text-4xl text-gold-400 italic leading-relaxed">
              "Cigars deserve precision engineering, not compromise. Every collection deserves a solution designed just for it."
            </p>
            <p className="text-cream-200/60 text-sm tracking-widest uppercase">
              — Brian Dunn, Founder
            </p>
          </blockquote>
        </div>
      </section>

      {/* Transition to Act 2 */}
      <section className="py-16 bg-charcoal-950 border-t border-charcoal-800/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-cream-200/70 text-lg">
            What started as one man's vision has grown into America's premier humidor destination.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 md:py-24 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-6 sm:w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Mission</span>
            <div className="h-px w-6 sm:w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 sm:mb-8 tracking-tight">
            Preserving the <span className="text-gold-400 italic">Art of the Cigar</span>
          </h2>
          <p className="text-cream-100 text-sm sm:text-base md:text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
            We believe every collection deserves precision engineering, not compromise. Whether you're building your first humidor or curating a museum-quality collection, we exist to design solutions that match the calibre of your passion.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 md:py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">What We Stand For</span>
              <div className="h-px w-6 sm:w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight">
              Our <span className="text-gold-400 italic">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-500/40 rounded-lg p-8 transition-colors flex gap-6">
                <div className="w-12 h-12 rounded-lg border border-gold-600/30 bg-gold-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-bold mb-3 tracking-tight">{title}</h3>
                  <p className="text-cream-200/70 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 md:py-24 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Timeline</span>
              <div className="h-px w-6 sm:w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight">
              From Vision to <span className="text-gold-400 italic">Reality</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-600/40 via-gold-600/20 to-transparent" />
            {milestones.map(({ year, title, desc }, i) => (
              <div key={year} className={`relative flex items-start gap-8 mb-10 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-charcoal-950 border-2 border-gold-600/50 flex flex-col items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <span className="text-gold-400 text-[10px] font-bold leading-none">{year}</span>
                </div>
                <div className={`md:w-[calc(50%-4rem)] bg-charcoal-950 border border-charcoal-800/50 rounded-lg p-6 ml-20 md:ml-0 ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <h3 className="font-serif text-lg text-white font-bold mb-2 tracking-tight">{title}</h3>
                  <p className="text-cream-200/70 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-charcoal-950 border-t border-charcoal-800/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-3 sm:mb-4 tracking-tight">
            Ready to Elevate Your Collection?
          </h2>
          <p className="text-cream-100 text-sm sm:text-base mb-6 sm:mb-8">Browse our full collection or speak with our team for expert guidance tailored to your needs.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/all-collections" className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-7 py-3.5 rounded hover:opacity-90 transition-opacity">
              Shop Collection
            </a>
            <a href="tel:8884319214" className="inline-flex items-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-xs tracking-widest uppercase px-7 py-3.5 rounded hover:bg-gold-700/10 transition-colors">
              Call Us: (888) 431-9214
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
