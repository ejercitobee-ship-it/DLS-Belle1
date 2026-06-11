import { BadgeCheck, CalendarClock, CreditCard, ShieldCheck, Phone, ArrowRight } from 'lucide-react';
import { PHONE_NUMBER, PHONE_HREF } from '../lib/constants';
import { FINANCING_MIN, FINANCING_TERM_MONTHS, formatMonthlyPayment } from '../lib/financing';

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
    desc: 'Your order ships on the normal schedule — white-glove delivery included on cabinet and electronic humidors.',
  },
];

export default function Financing() {
  return (
    <div className="min-h-screen bg-charcoal-950 pb-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
            Flexible Financing
          </span>
          <div className="h-px w-8 bg-gold-500" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight mb-5">
          Own It Now. <span className="text-gradient-gold italic">Pay Over Time.</span>
        </h1>
        <p className="text-cream-200/60 text-base leading-relaxed max-w-2xl mx-auto">
          Finance any qualifying purchase over ${FINANCING_MIN.toLocaleString()} with Shop Pay —
          qualified buyers pay 0% interest, split into {FINANCING_TERM_MONTHS} monthly payments.
          Choose "Shop Pay · Pay in installments" at checkout; approval takes less than a minute.
        </p>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center mb-4">
                <step.icon size={20} className="text-gold-500" />
              </div>
              <p className="text-gold-500/60 text-[10px] tracking-[0.3em] uppercase mb-2">
                Step {idx + 1}
              </p>
              <h2 className="text-white font-semibold mb-2">{step.title}</h2>
              <p className="text-cream-200/55 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment examples */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-charcoal-900/40 border border-gold-700/20 rounded-xl p-8">
          <h2 className="font-serif text-2xl text-white font-bold text-center mb-8">
            What Your Payments Could Look Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXAMPLE_PRICES.map((price) => (
              <div
                key={price}
                className="bg-charcoal-950 border border-charcoal-800/50 rounded-lg p-5 text-center"
              >
                <p className="text-cream-200/40 text-xs mb-1">Purchase price</p>
                <p className="text-white font-serif font-bold text-xl mb-3">
                  ${price.toLocaleString()}
                </p>
                <p className="text-gold-300 font-serif font-bold text-2xl">
                  {formatMonthlyPayment(price)}
                  <span className="text-sm font-sans font-normal text-cream-200/50">/month</span>
                </p>
                <p className="text-cream-200/40 text-xs mt-1">
                  × {FINANCING_TERM_MONTHS} payments · 0% interest
                </p>
              </div>
            ))}
          </div>
          <p className="text-cream-200/30 text-[11px] text-center leading-relaxed mt-6">
            Payment options through Shop Pay Installments are subject to an eligibility check
            and approval, and are provided by Affirm's lending partners.
            Estimated monthly payments shown are illustrative; your exact terms are confirmed
            at checkout before you commit. Longer-term plans may also be available for larger
            purchases.
          </p>
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
