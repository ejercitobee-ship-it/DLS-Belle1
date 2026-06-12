import { Gem, Globe, Shield, Star } from 'lucide-react';

const milestones = [
  { year: '2015', title: 'Founded', desc: 'Dunn\'s Luxury Selections is established with a singular vision: to bring world-class cigar storage to the American market.' },
  { year: '2017', title: 'First Raching Partnership', desc: 'We become an authorised dealer for Raching, introducing precision electronic humidors to our curated collection.' },
  { year: '2019', title: 'Bespoke Division Launched', desc: 'Our bespoke walk-in humidor design service opens — custom-engineered components shipped with full installation guidance, serving private collectors and hospitality venues.' },
  { year: '2022', title: 'National Expansion', desc: 'We expand our white-glove delivery service to all 50 states, cementing our position as America\'s premier humidor destination.' },
  { year: '2024', title: 'Digital Flagship', desc: 'Our newly designed online flagship store launches, offering the full collection with seamless checkout and expert consultation booking.' },
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
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.png"
            alt="Luxury cigars"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/80 to-charcoal-950/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Story</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl text-white font-bold leading-[1.1] mb-6">
              America's Premier
              <br />
              <span className="text-gradient-gold italic">Humidor Destination</span>
            </h1>
            <p className="text-cream-200/70 text-xl leading-relaxed">
              Born from a passion for the craft and a belief that cigars deserve better preservation, Dunn's Luxury Selections has spent a decade curating the world's finest humidors for discerning collectors across the United States.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Mission</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-serif text-4xl text-white font-bold mb-8">
            Preserving the <span className="text-gradient-gold italic">Art of the Cigar</span>
          </h2>
          <p className="text-cream-200/60 text-xl leading-relaxed mb-6">
            We believe that the way a cigar is stored is as important as the cigar itself. Temperature, humidity, and the quality of the enclosure determine whether a fine cigar reaches its full potential — or falls short of it.
          </p>
          <p className="text-cream-200/50 text-lg leading-relaxed">
            Our mission is to ensure that every Dunn's customer has access to a storage solution equal to the calibre of their collection — from the entry-level aficionado to the seasoned private collector building a walk-in sanctuary.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">What We Stand For</span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-4xl text-white font-bold">
              Our <span className="text-gradient-gold italic">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/30 rounded-lg p-8 transition-colors flex gap-6">
                <div className="w-12 h-12 rounded-lg border border-gold-600/30 bg-gold-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={20} className="text-gold-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white font-semibold mb-3">{title}</h3>
                  <p className="text-cream-200/55 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Our Journey</span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-4xl text-white font-bold">
              A Legacy of <span className="text-gradient-gold italic">Excellence</span>
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
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-cream-200/55 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal-950 border-t border-charcoal-800/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-white font-bold mb-4">
            Ready to Elevate Your Collection?
          </h2>
          <p className="text-cream-200/55 mb-8">Browse our full collection or speak with our team for expert guidance tailored to your needs.</p>
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
