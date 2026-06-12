import { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  Thermometer,
  TreePine,
  Sparkles,
  Home,
  Store,
  Wifi,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import BreadcrumbSchema from './BreadcrumbSchema';
import { getRelatedLinks } from '../lib/internalLinkMap';
import siteFaqs from '../data/siteFaqs.json';

const SUPPORT_EMAIL = 'support@dunnluxuryselections.com';

const pillars = [
  {
    icon: Thermometer,
    title: 'Advanced Climate Integration',
    description:
      'We consult on industrial-grade humidification systems and specialised HVAC cooling to ensure consistent 70/70 conditions — even across large-scale spaces.',
  },
  {
    icon: TreePine,
    title: 'Spanish Cedar Artistry',
    description:
      'Only the finest sustainably sourced Spanish Cedar is used for shelving and wall lining — enhancing aging, regulating moisture, and guarding against tobacco beetles.',
  },
  {
    icon: Sparkles,
    title: 'Executive Aesthetic',
    description:
      'From tempered glass entryways to custom LED accent lighting, we design spaces that are as visually stunning as they are functionally precise.',
  },
];

const capabilities = [
  {
    icon: Home,
    title: 'Residential Cigar Rooms',
    description:
      'Tailored to fit your home\'s unique architecture — from intimate studies to dedicated full-room sanctuaries.',
    features: [
      'Custom floor-to-ceiling cedar lining',
      'Integrated humidification systems',
      'Bespoke shelving and display',
      'Ambient LED lighting design',
    ],
  },
  {
    icon: Store,
    title: 'Retail & Hospitality',
    description:
      'High-traffic solutions built for cigar bars, lounges, golf clubs, and fine dining establishments.',
    features: [
      'Commercial-grade climate control',
      'High-capacity storage configurations',
      'Tempered glass display walls',
      'POS and access integration',
    ],
  },
  {
    icon: Wifi,
    title: 'Electronic Monitoring',
    description:
      'Remote humidity and temperature tracking systems, accessible via smartphone from anywhere in the world.',
    features: [
      'Real-time sensor dashboards',
      'Automated alert notifications',
      'Multi-zone climate logging',
      'App-based remote control',
    ],
  },
];

// FAQ content lives in src/data/siteFaqs.json — the prerender script bakes the
// matching FAQPage + Service schema into the static HTML for this route.
const faqs = siteFaqs.walkIn;

export default function WalkInHumidor() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const errs: Partial<typeof formData> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: SUPPORT_EMAIL,
          subject: 'Bespoke Walk-In Humidor Enquiry',
          text: [
            'New bespoke walk-in humidor enquiry:',
            '',
            `Name: ${formData.name.trim()}`,
            `Email: ${formData.email}`,
            `Phone: ${formData.phone}`,
          ].join('\n'),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send enquiry');
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof formData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFormData({ ...formData, [key]: e.target.value }),
  });

  return (
    <div className="min-h-screen bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbSchema
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/all-collections' },
            { label: 'Walk-In Humidors', href: '/walk-in-humidor' }
          ]}
          className="mb-8 pt-4"
        />
      </div>

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/bespoke-walk-in-humidor.png"
            alt="Bespoke walk-in humidor"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/75 to-charcoal-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Bespoke Services
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-5">
              Bespoke Walk-In
              <br />
              <span className="text-gradient-gold italic">Humidor Design</span>
            </h1>
            <p className="text-cream-200/70 text-xl leading-relaxed mb-10 max-w-xl">
              Precision engineering for professional and private collections. We transform rooms into world-class preservation sanctuaries.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#enquire"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('enquire');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-7 py-4 rounded hover:opacity-90 active:scale-95 transition-all"
              >
                Start Your Project
                <ArrowRight size={15} />
              </a>
              <a
                href="tel:8884319214"
                className="inline-flex items-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-sm tracking-widest uppercase px-7 py-4 rounded hover:bg-gold-700/10 transition-colors"
              >
                <Phone size={14} />
                (888) 431-9214
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro strip ── */}
      <section className="bg-charcoal-900 border-y border-charcoal-800/50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-cream-200/60 text-lg leading-relaxed">
            At <span className="text-white font-medium">Dunn's Luxury Selections</span>, we specialise in transforming rooms into world-class preservation sanctuaries. Whether you are a private collector building a dedicated home cigar lounge or a business owner requiring a high-capacity commercial walk-in, our team provides the expertise to maintain a perfect, climate-controlled environment.
          </p>
        </div>
      </section>

      {/* ── Three Pillars ── */}
      <section className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Our Design Philosophy
              </span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Why Choose a Custom Build
              <br />
              <span className="text-gradient-gold italic">from Dunn's?</span>
            </h2>
            <p className="text-cream-200/50 mt-4 max-w-xl mx-auto">
              A true walk-in humidor is more than a cedar-lined room — it is a complex ecosystem. Our design philosophy rests on three pillars of luxury preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="relative bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg p-8 transition-colors duration-300 group"
              >
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold-600/30 to-transparent" />
                <div className="w-12 h-12 rounded-lg border border-gold-600/30 bg-gold-700/10 flex items-center justify-center mb-6 group-hover:bg-gold-700/20 transition-colors">
                  <Icon size={22} className="text-gold-500" />
                </div>
                <div className="text-gold-600/40 font-serif text-5xl font-bold absolute top-6 right-8 leading-none">
                  0{i + 1}
                </div>
                <h3 className="font-serif text-xl text-white font-semibold mb-3">{title}</h3>
                <p className="text-cream-200/55 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="py-24 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                What We Build
              </span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold">
              Our Custom <span className="text-gradient-gold italic">Capabilities</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {capabilities.map(({ icon: Icon, title, description, features }) => (
              <div key={title} className="bg-charcoal-950 border border-charcoal-800/50 hover:border-gold-700/30 rounded-lg overflow-hidden transition-colors duration-300 group">
                {/* Top accent bar */}
                <div className="h-1 bg-gold-gradient" />
                <div className="p-8">
                  <div className="w-11 h-11 rounded-full border border-gold-600/40 flex items-center justify-center mb-5">
                    <Icon size={18} className="text-gold-500" />
                  </div>
                  <h3 className="font-serif text-xl text-white font-semibold mb-3">{title}</h3>
                  <p className="text-cream-200/55 text-sm leading-relaxed mb-6">{description}</p>
                  <ul className="space-y-2.5">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-cream-200/60">
                        <CheckCircle2 size={13} className="text-gold-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process timeline ── */}
      <section className="py-24 bg-charcoal-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                How It Works
              </span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold">
              From Vision to <span className="text-gradient-gold italic">Reality</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold-600/40 via-gold-600/20 to-transparent" />

            {[
              { step: '01', title: 'Initial Consultation', desc: 'Our executive sales team discusses your vision, reviews your space, and outlines the technical and aesthetic possibilities for your project.' },
              { step: '02', title: 'Design & Specification', desc: 'We produce detailed design drawings, material specifications, and a comprehensive quote covering all aspects of the build.' },
              { step: '03', title: 'Material Procurement', desc: 'Sustainably sourced Spanish Cedar, premium hardware, and climate systems are procured to exacting standards before construction begins.' },
              { step: '04', title: 'Build & Installation', desc: 'Our specialist installation team manages the full build process — cedar lining, shelving, climate integration, and lighting — on your timeline.' },
              { step: '05', title: 'Commissioning & Handover', desc: 'We calibrate and test all systems to target conditions, provide a full care guide, and hand over your completed sanctuary.' },
            ].map(({ step, title, desc }, i) => (
              <div
                key={step}
                className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step bubble */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-charcoal-900 border-2 border-gold-600/50 flex items-center justify-center z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <span className="text-gold-400 text-xs font-bold">{step}</span>
                </div>

                {/* Content */}
                <div className={`md:w-[calc(50%-3rem)] bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-6 ml-16 md:ml-0 ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-cream-200/55 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-charcoal-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">FAQ</span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-serif text-4xl text-white font-bold">
              Common <span className="text-gradient-gold italic">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-charcoal-950 border border-charcoal-800/50 hover:border-gold-700/30 rounded-lg overflow-hidden transition-colors duration-200"
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-cream-100 text-sm font-medium">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gold-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-48' : 'max-h-0'}`}
                >
                  <p className="px-6 pb-5 text-cream-200/55 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      <section className="py-24 bg-charcoal-950 border-t border-charcoal-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
              Explore More Collections
            </h2>
            <p className="text-cream-200/50 max-w-xl mx-auto">
              Complement your walk-in humidor with our complete range of desktop, cabinet, and electronic humidors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRelatedLinks('/walk-in-humidor').map(link => (
              <a
                key={link.href}
                href={link.href}
                className="group bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/40 rounded-lg p-8 transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="font-serif text-xl text-white font-semibold group-hover:text-gold-300 transition-colors">
                    {link.label}
                  </h3>
                  <ArrowRight size={16} className="text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-cream-200/50 text-sm">
                  {link.category === 'collections'
                    ? 'Explore our curated collection of humidors'
                    : link.category === 'services'
                    ? 'Discover our specialized services'
                    : 'Learn more about proper cigar care'}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Enquiry ── */}
      <section id="enquire" className="py-24 bg-charcoal-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left — copy & contact details */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                  Start Your Project
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight mb-6">
                Ready to Elevate
                <br />
                <span className="text-gradient-gold italic">Your Collection?</span>
              </h2>
              <p className="text-cream-200/60 text-lg leading-relaxed mb-10">
                Our executive sales team is available to discuss your vision, provide technical specifications, and offer a comprehensive quote for your custom build.
              </p>

              {/* Contact cards */}
              <div className="space-y-4 mb-10">
                <a
                  href="tel:8884319214"
                  className="flex items-center gap-4 bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/30 rounded-lg p-5 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full border border-gold-600/40 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-700/10 transition-colors">
                    <Phone size={17} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-0.5">Direct Line</p>
                    <p className="text-white font-semibold">(888) 431-9214</p>
                  </div>
                </a>

                <a
                  href="mailto:support@dunnluxuryselections.com"
                  className="flex items-center gap-4 bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/30 rounded-lg p-5 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-full border border-gold-600/40 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-700/10 transition-colors">
                    <Mail size={17} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-0.5">Executive Support</p>
                    <p className="text-white font-semibold">support@dunnluxuryselections.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-5">
                  <div className="w-11 h-11 rounded-full border border-gold-600/40 flex items-center justify-center flex-shrink-0">
                    <Clock size={17} className="text-gold-500" />
                  </div>
                  <div>
                    <p className="text-cream-200/40 text-[10px] tracking-[0.3em] uppercase mb-0.5">Availability</p>
                    <p className="text-white font-semibold">Monday – Friday &nbsp;|&nbsp; 9:00 AM – 6:00 PM CST</p>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-2 border-gold-500/50 pl-5">
                <p className="text-cream-200/50 text-sm italic leading-relaxed">
                  "A collection of such distinction deserves white-glove service."
                </p>
              </blockquote>
            </div>

            {/* Right — Consultation Form */}
            <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8">
              <h3 className="font-serif text-2xl text-white font-semibold mb-4">
                Request a Consultation
              </h3>
              <p className="text-cream-200/55 leading-relaxed text-sm mb-8">
                Ready to transform your space? Schedule a private consultation with our design team and receive a comprehensive quote for your custom walk-in humidor.
              </p>

              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={48} className="text-gold-400 mx-auto mb-4" />
                  <h4 className="text-white font-semibold mb-2">Thank You!</h4>
                  <p className="text-cream-200/60 text-sm">
                    We've received your inquiry and will be in touch within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...field('name')}
                    className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-3 text-cream-100 placeholder-cream-200/30 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                  />
                  {errors.name && <p className="text-red-400 text-xs px-1">{errors.name}</p>}

                  <input
                    type="email"
                    placeholder="Email Address"
                    {...field('email')}
                    className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-3 text-cream-100 placeholder-cream-200/30 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                  />
                  {errors.email && <p className="text-red-400 text-xs px-1">{errors.email}</p>}

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    {...field('phone')}
                    className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-3 text-cream-100 placeholder-cream-200/30 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                  />
                  {errors.phone && <p className="text-red-400 text-xs px-1">{errors.phone}</p>}

                  {submitError && (
                    <div className="flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-8 py-3 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Sending...' : 'Start Your Project'}
                    {!submitting && <ArrowRight size={15} />}
                  </button>

                  <p className="text-cream-200/25 text-xs text-center">
                    We respond within one business day. All enquiries are strictly confidential.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
