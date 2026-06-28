import { Droplets, Thermometer, TreePine, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

const guides = [
  {
    icon: Droplets,
    title: 'Seasoning Your New Humidor',
    intro: 'Before placing any cigars inside a new humidor, it must be seasoned — a critical step that primes the Spanish Cedar interior to maintain consistent humidity.',
    steps: [
      'Wipe the interior cedar surfaces with a clean, damp (not wet) cloth. Do not use tap water if possible; distilled water is preferred.',
      'Place a small dish or shot glass filled with distilled water inside the humidor and close the lid.',
      'Leave the humidor closed for 24–48 hours, allowing the cedar to slowly absorb moisture.',
      'Remove the water dish, charge your humidification device, and check the hygrometer. Target 68–72% relative humidity.',
      'Wait until the reading stabilises (typically 12–24 hours more) before adding your cigars.',
    ],
  },
  {
    icon: Thermometer,
    title: 'Ideal Storage Conditions',
    intro: 'Cigars thrive in a stable, controlled environment. Fluctuations — not just extremes — are the primary cause of deterioration.',
    steps: [
      'Maintain a relative humidity (RH) of 65–72%. Most premium cigars are best stored at 68–70% RH.',
      'Keep the temperature between 65–70°F (18–21°C). Avoid placing humidors near windows, vents, or heating sources.',
      'Check your hygrometer reading at least weekly. Digital hygrometers should be calibrated every 6 months.',
      'Rotate your cigars periodically — top to bottom and front to back — to ensure even humidity exposure.',
      'Never store cigars near strong odours; cedar helps, but proximity to perfumes or cleaning products can affect flavour.',
    ],
  },
  {
    icon: TreePine,
    title: 'Caring for Spanish Cedar',
    intro: 'Spanish Cedar is the gold standard for humidor lining. Proper care ensures it continues to regulate humidity and protect your collection for decades.',
    steps: [
      'Never use chemical cleaners, polishes, or oils on cedar interiors. A lightly dampened cloth is the only cleaning agent needed.',
      'If you notice a white dusty residue, this is crystallised tannins — a natural reaction. Wipe gently with a dry cloth.',
      'Cedar trays and dividers can be carefully sanded with very fine sandpaper (220-grit) if surface contamination is an issue.',
      'Keep cedar away from direct contact with propylene glycol-based humidification devices, which can damage the wood over time.',
      'Boveda packs are the recommended passive humidification method for cedar-lined humidors and accessories.',
    ],
  },
  {
    icon: Wrench,
    title: 'Maintaining Electronic Humidors',
    intro: 'Electronic and cabinet humidors incorporate active climate control systems that require periodic maintenance to operate at peak performance.',
    steps: [
      'Clean the evaporator tray or water reservoir every 4–6 weeks with distilled water to prevent mineral build-up and bacterial growth.',
      'Check and replace the air filter (where applicable) every 3–6 months, or sooner in dusty environments.',
      'Verify that the door seal remains airtight. A simple test: close the door on a thin piece of paper — it should hold with light resistance.',
      'Recalibrate the electronic hygrometer sensor annually using a Boveda calibration kit or salt test.',
      'If the unit is not in use for an extended period, remove water from the reservoir to prevent stagnation and odour.',
    ],
  },
];

export default function CareGuides() {
  usePageMeta({
    title: "Humidor Care Guides | Expert Maintenance Tips | Dunn's Luxury Selections",
    description: "Expert guidance on humidor care, storage conditions, seasoning, and maintenance. Learn how to preserve your cigar collection with proper humidity and temperature control.",
    canonicalPath: '/care-guides',
    ogImage: 'https://dunnluxuryselections.com/og-image.jpg',
  });

  return (
    <div className="min-h-screen bg-charcoal-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Expert Guidance</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Care <span className="text-gradient-gold italic">Guides</span>
        </h1>
        <p className="text-cream-200/60 text-lg leading-relaxed mb-16 max-w-2xl">
          Expert guidance from our team of cigar storage specialists to help you maintain optimal conditions and get the most from your humidor.
        </p>

        {/* Important notice */}
        <div className="flex items-start gap-4 bg-charcoal-900 border border-gold-700/20 rounded-lg p-6 mb-14">
          <AlertTriangle size={18} className="text-gold-500 flex-shrink-0 mt-0.5" />
          <p className="text-cream-200/60 text-sm leading-relaxed">
            <strong className="text-cream-100">Always use distilled water</strong> when moistening humidification devices or seasoning cedar. Tap water contains minerals that will clog humidifiers, deposit white residue on cedar, and shorten the lifespan of your humidor's internal components.
          </p>
        </div>

        {/* Guides */}
        <div className="space-y-12">
          {guides.map(({ icon: Icon, title, intro, steps }) => (
            <div key={title} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden">
              <div className="h-1 bg-gold-gradient" />
              <div className="p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-11 h-11 rounded-full border border-gold-600/40 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold-500" />
                  </div>
                  <h2 className="font-serif text-2xl text-white font-semibold">{title}</h2>
                </div>
                <p className="text-cream-200/60 text-sm leading-relaxed mb-7">{intro}</p>
                <ol className="space-y-4">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full border border-gold-600/30 bg-gold-700/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gold-400 text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-cream-200/60 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        {/* Quick tips */}
        <div className="mt-14 bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8">
          <h2 className="font-serif text-2xl text-white font-semibold mb-6">Quick Reference Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Target humidity: 68–70% RH',
              'Target temperature: 65–70°F (18–21°C)',
              'Always use distilled water',
              'Season new humidors before use',
              'Rotate cigars every 2–4 weeks',
              'Calibrate hygrometers every 6 months',
              'Boveda packs: replace when fully hardened',
              'Store humidors away from direct sunlight',
            ].map((tip, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0" />
                <span className="text-cream-200/60 text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expert help CTA */}
        <div className="mt-10 text-center">
          <p className="text-cream-200/50 text-sm mb-4">Still have questions? Our aficionado team is on hand.</p>
          <a
            href="mailto:support@dunnluxuryselections.com"
            className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-7 py-3.5 rounded hover:opacity-90 transition-opacity"
          >
            Ask Our Experts
          </a>
        </div>

      </div>
    </div>
  );
}
