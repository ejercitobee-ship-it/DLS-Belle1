import { useState } from 'react';
import { BadgeCheck, CalendarClock, CreditCard, ShieldCheck, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import { PHONE_NUMBER, PHONE_HREF } from '../lib/constants';
import { FINANCING_MIN, FINANCING_TERM_MONTHS, formatMonthlyPayment } from '../lib/financing';
import { usePageMeta } from '../hooks/usePageMeta';
import siteFaqs from '../data/siteFaqs.json';

const SUPPORT_EMAIL = 'support@dunnluxuryselections.com';

const EXAMPLE_PRICES = [2352, 4752, 6387];

const steps = [
  {
    icon: CreditCard,
    title: 'Add to Cart & Check Out',
    desc: 'Shop as usual. At our secure Shopify checkout, choose "Shop Pay · Pay in installments" as your payment method.',
  },
  {
    icon: BadgeCheck,
    title: 'Get a Real-Time Decision',
    desc: 'Enter a few basic details for an instant eligibility check. Checking your eligibility will not affect your credit score.',
  },
  {
    icon: CalendarClock,
    title: 'Split Your Purchase',
    desc: `Qualified buyers can split purchases into ${FINANCING_TERM_MONTHS} payments at 0% interest. No hidden fees, no surprises.`,
  },
  {
    icon: ShieldCheck,
    title: 'Enjoy Your Humidor Now',
    desc: 'Your order ships on the normal schedule — expert concierge support included on cabinet and electronic humidors.',
  },
];

// FAQ content lives in src/data/siteFaqs.json — the prerender script bakes the
// matching FAQPage schema into the static HTML for this route.
const faqs = siteFaqs.financing;

export default function Financing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  usePageMeta({
    title: "Shop Pay Installments | Dunn's Luxury Selections",
    description: 'Pay for your luxury humidor in 4 interest-free installments with Shop Pay. No hidden fees. Flexible payment plans on purchases $1,500+.',
    canonicalPath: '/financing',
  });

  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-12 sm:pb-14 text-center">
        <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6">
          <div className="h-px w-6 sm:w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
            Flexible Financing
          </span>
          <div className="h-px w-6 sm:w-8 bg-gold-500" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-bold leading-tight mb-5 sm:mb-6">
          Own It Now. <span className="text-gradient-gold italic">Pay Over Time.</span>
        </h1>
        <p className="text-cream-200/60 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Finance any qualifying purchase over ${FINANCING_MIN.toLocaleString()} with Shop Pay Installments.
          Qualified buyers pay 0% interest — split into {FINANCING_TERM_MONTHS} equal monthly payments.
          Approval takes less than a minute at checkout.
        </p>
      </div>

      {/* Why collectors finance */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold text-center mb-8 sm:mb-10">
          Why Serious Collectors Finance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7">
          <div className="bg-charcoal-900/40 border border-charcoal-800/30 rounded-lg p-6 sm:p-7">
            <p className="text-gold-400 text-sm font-semibold mb-3">Build Now, Cash Later</p>
            <p className="text-cream-200/60 text-sm leading-relaxed">
              Expand your collection today without depleting capital. Keep investments working while securing your pieces.
            </p>
          </div>
          <div className="bg-charcoal-900/40 border border-charcoal-800/30 rounded-lg p-6 sm:p-7">
            <p className="text-gold-400 text-sm font-semibold mb-3">Zero Interest, Full Control</p>
            <p className="text-cream-200/60 text-sm leading-relaxed">
              0% APR on approved purchases. No hidden fees, no prepayment penalties. Pay early anytime.
            </p>
          </div>
          <div className="bg-charcoal-900/40 border border-charcoal-800/30 rounded-lg p-6 sm:p-7">
            <p className="text-gold-400 text-sm font-semibold mb-3">Instant Approval, Same-Day Ship</p>
            <p className="text-cream-200/60 text-sm leading-relaxed">
              Real-time credit decision at checkout. Approved orders ship on normal schedule with expert concierge support.
            </p>
          </div>
        </div>
      </div>

      {/* Shop Pay explainer */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20">
        <div className="bg-charcoal-900/60 border border-gold-700/20 rounded-xl p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center">
              <CreditCard size={18} className="text-gold-500" />
            </div>
            <h3 className="font-semibold text-white text-lg">What is Shop Pay Installments?</h3>
          </div>
          <p className="text-cream-200/70 text-sm leading-relaxed mb-5">
            Shop Pay Installments is a lending partnership between Shopify and Affirm's network of lenders. Affirm specializes in flexible, transparent lending for purchases from $0–$17,500+. Millions of shoppers use it across Shopify stores globally.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-charcoal-950/50 rounded-lg p-4">
              <p className="text-gold-400 text-xs font-semibold tracking-wide uppercase mb-2">The Approval Process</p>
              <p className="text-cream-200/60 text-sm">Real-time credit decision using soft pull — checking eligibility doesn't affect your credit score.</p>
            </div>
            <div className="bg-charcoal-950/50 rounded-lg p-4">
              <p className="text-gold-400 text-xs font-semibold tracking-wide uppercase mb-2">Why 0% APR?</p>
              <p className="text-cream-200/60 text-sm">Affirm earns through merchant fees, not interest. That model lets them offer 0% APR to qualified buyers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold text-center mb-8 sm:mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-700/30 rounded-lg p-6 sm:p-7 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center mb-4 sm:mb-5">
                <step.icon size={20} className="text-gold-500" />
              </div>
              <p className="text-gold-500/60 text-[10px] tracking-[0.3em] uppercase mb-2 sm:mb-2.5">
                Step {idx + 1}
              </p>
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{step.title}</h3>
              <p className="text-cream-200/55 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment examples */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20">
        <div className="bg-charcoal-900/40 border border-gold-700/20 rounded-xl p-6 sm:p-8 md:p-10">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold text-center mb-3 sm:mb-4">
            Real-World Payment Examples
          </h2>
          <p className="text-cream-200/50 text-sm text-center mb-8 sm:mb-10">
            See how financing works for different collection levels
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="bg-charcoal-950 border border-charcoal-800/50 hover:border-gold-500/30 rounded-lg p-5 sm:p-6 text-center transition-colors">
              <p className="text-gold-400 text-xs font-semibold tracking-wide uppercase mb-2">Entry-Level Collection</p>
              <p className="text-white font-serif font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                ${EXAMPLE_PRICES[0].toLocaleString()}
              </p>
              <p className="text-gold-300 font-serif font-bold text-xl sm:text-2xl">
                {formatMonthlyPayment(EXAMPLE_PRICES[0])}
                <span className="text-xs sm:text-sm font-sans font-normal text-cream-200/50 ml-1">/month</span>
              </p>
              <p className="text-cream-200/40 text-xs mt-3">
                Perfect for your first desktop or travel humidor
              </p>
            </div>
            <div className="bg-charcoal-950 border border-gold-500/40 hover:border-gold-500/60 rounded-lg p-5 sm:p-6 text-center transition-colors ring-1 ring-gold-500/20">
              <p className="text-gold-400 text-xs font-semibold tracking-wide uppercase mb-2">Premium Cabinet</p>
              <p className="text-white font-serif font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                ${EXAMPLE_PRICES[1].toLocaleString()}
              </p>
              <p className="text-gold-300 font-serif font-bold text-xl sm:text-2xl">
                {formatMonthlyPayment(EXAMPLE_PRICES[1])}
                <span className="text-xs sm:text-sm font-sans font-normal text-cream-200/50 ml-1">/month</span>
              </p>
              <p className="text-cream-200/40 text-xs mt-3">
                Cabinet installations & electronic humidors
              </p>
            </div>
            <div className="bg-charcoal-950 border border-charcoal-800/50 hover:border-gold-500/30 rounded-lg p-5 sm:p-6 text-center transition-colors">
              <p className="text-gold-400 text-xs font-semibold tracking-wide uppercase mb-2">Luxury Investment</p>
              <p className="text-white font-serif font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                ${EXAMPLE_PRICES[2].toLocaleString()}
              </p>
              <p className="text-gold-300 font-serif font-bold text-xl sm:text-2xl">
                {formatMonthlyPayment(EXAMPLE_PRICES[2])}
                <span className="text-xs sm:text-sm font-sans font-normal text-cream-200/50 ml-1">/month</span>
              </p>
              <p className="text-cream-200/40 text-xs mt-3">
                Premium walk-in sanctuaries & collection builds
              </p>
            </div>
          </div>
          <p className="text-cream-200/30 text-[11px] text-center leading-relaxed mt-6">
            Payment options through Shop Pay Installments are subject to an eligibility check
            and approval, and are provided by Affirm's lending partners.
            Estimated payments shown are illustrative; your exact terms are confirmed
            at checkout before you commit. Longer-term plans may also be available for larger
            purchases.
          </p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20">
        <div className="bg-gradient-to-r from-charcoal-900/60 to-charcoal-900/40 border border-gold-700/30 rounded-lg p-8 sm:p-10 italic text-center">
          <p className="text-cream-200/70 text-base sm:text-lg leading-relaxed mb-6">
            "I financed my walk-in build so I could complete the project now and keep my cash reserves intact. The approval was instant, and the monthly payments fit perfectly into my budget. Best part? Zero interest, zero surprises."
          </p>
          <p className="text-gold-400 font-semibold">Marcus T., Collector</p>
          <p className="text-cream-200/40 text-sm">Walk-In Sanctuary, $6,200 financed</p>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-18 md:mb-20">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-bold text-center mb-8 sm:mb-10">
          Financing FAQ
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-charcoal-800/30 transition-colors"
              >
                <span className="text-cream-100 text-sm font-medium">{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-gold-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-cream-200/55 text-sm leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Questions / CTA */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-2xl text-white font-bold mb-3">Questions About Financing?</h2>
        <p className="text-cream-200/55 text-sm leading-relaxed mb-6">
          Our specialists are happy to walk you through payment options before you order.
          Call{' '}
          <a href={PHONE_HREF} className="text-gold-400 hover:text-gold-300 transition-colors">
            {PHONE_NUMBER}
          </a>{' '}
          or email{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="/all-collections"
            className="inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-7 py-3.5 rounded hover:opacity-90 transition-opacity"
          >
            Browse Collections
            <ArrowRight size={14} />
          </a>
          <div className="flex items-center gap-2 text-cream-200/40 text-xs">
            <Phone size={13} className="text-gold-500" />
            Mon–Fri, 9:00 AM – 6:00 PM CST
          </div>
        </div>
      </div>
    </div>
  );
}
