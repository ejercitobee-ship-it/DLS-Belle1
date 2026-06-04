import { Gem, Settings, Headphones as HeadphonesIcon, Globe } from 'lucide-react';

const reasons = [
  {
    icon: Gem,
    title: 'Curated Excellence',
    description:
      'Every product in our range is personally selected for exceptional craftsmanship, material quality, and performance.',
  },
  {
    icon: Settings,
    title: 'Precision Engineering',
    description:
      'From passive cedar-lined cabinets to fully electronic climate systems, each humidor is precision-calibrated for your collection.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Guidance',
    description:
      'Our team of aficionados provides personalised advice on storage solutions tailored to your specific needs and budget.',
  },
  {
    icon: Globe,
    title: 'Nationwide Delivery',
    description:
      'White-glove delivery services across the USA with specialist handling to ensure your humidor arrives in perfect condition.',
  },
];

export default function WhyUs() {
  return (
    <section id="about" className="py-24 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Why Choose Us
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
              Products with the
              <br />
              <span className="text-gradient-gold italic">Signature of Luxury</span>
            </h2>
            <p className="text-cream-200/60 text-lg leading-relaxed mb-10">
              Dunn's Luxury Selections is America's premier destination for fine
              cigar humidors. We exist for those who understand that the way a cigar
              is stored is as important as the cigar itself.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reasons.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg border border-gold-600/30 bg-gold-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={18} className="text-gold-500" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-semibold mb-1">{title}</h3>
                    <p className="text-cream-200/50 text-xs leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image collage */}
          <div className="relative grid grid-cols-2 gap-3 h-[500px] overflow-hidden lg:overflow-visible">
            <div className="relative rounded-lg overflow-hidden row-span-2">
              <img
                src="/images/products/raching-cs600-luxury-cigar-humidor-cabinet.jpg"
                alt="Raching CS600 luxury cabinet humidor"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="/images/products/c28eff7e15a7f40ecba3853c6731fb2c.jpg"
                alt="Raching RR980 flagship cabinet humidor"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="/images/products/CT48A-silver.jpg"
                alt="CT48A electronic humidor"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Stats overlay */}
            <div className="absolute bottom-2 left-2 bg-charcoal-950 border border-gold-700/30 rounded-lg p-4 shadow-xl">
              <div className="text-2xl font-serif font-bold text-gradient-gold">$30 – $7,750</div>
              <div className="text-cream-200/50 text-xs mt-0.5">Curated price range</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
