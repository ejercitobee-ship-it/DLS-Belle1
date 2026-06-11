import { CreditCard, ArrowRight } from 'lucide-react';

interface FinancingBannerProps {
  className?: string;
  variant?: 'full' | 'compact';
}

/**
 * Reusable financing banner for homepage and collection pages.
 * Promotes Shop Pay installment options to qualified shoppers.
 */
export default function FinancingBanner({ className = '', variant = 'full' }: FinancingBannerProps) {
  if (variant === 'compact') {
    return (
      <div className={`bg-charcoal-900/60 border border-gold-700/20 rounded-lg p-4 sm:p-5 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center">
              <CreditCard size={18} className="text-gold-500" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm">Shop Pay Installments Available</p>
              <p className="text-cream-200/50 text-xs leading-relaxed">Pay in 4 interest-free payments every 2 weeks</p>
            </div>
          </div>
          <a
            href="/financing"
            className="flex-shrink-0 inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 focus:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:ring-offset-2 focus:ring-offset-charcoal-900 rounded px-2 py-1 transition-all"
            aria-label="Learn more about Shop Pay financing"
          >
            <span className="text-xs font-medium tracking-wide uppercase hidden sm:inline">Learn More</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-gradient-to-r from-charcoal-900 via-charcoal-900/95 to-charcoal-900 border-y border-gold-700/20 py-12 sm:py-14 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left: Content */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center">
                <CreditCard size={20} className="text-gold-500" />
              </div>
              <span className="text-gold-400 text-xs font-medium tracking-[0.35em] uppercase">
                Flexible Financing
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Own It Now. <span className="text-gradient-gold italic">Pay Over Time.</span>
            </h2>

            <p className="text-cream-200/70 text-base sm:text-lg leading-relaxed mb-6 sm:mb-7 max-w-sm">
              Finance any qualifying purchase over $1,500 with Shop Pay Installments.
              Pay in 4 equal, interest-free payments every 2 weeks — no hidden fees, no surprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/financing"
                className="flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded hover:shadow-lg hover:shadow-gold-600/30 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-charcoal-900 active:scale-95 transition-all"
              >
                Learn About Financing
                <ArrowRight size={14} />
              </a>
              <a
                href="/all-collections"
                className="flex items-center justify-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-xs tracking-widest uppercase px-6 py-3 rounded hover:bg-gold-700/20 hover:border-gold-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-charcoal-900 active:bg-gold-700/30 transition-all"
              >
                Shop Qualifying Products
              </a>
            </div>
          </div>

          {/* Right: Payment example */}
          <div className="bg-charcoal-950/60 border border-charcoal-800/50 rounded-lg p-6 sm:p-7 md:p-8">
            <p className="text-cream-200/50 text-xs font-medium tracking-[0.3em] uppercase mb-5">
              Payment Examples
            </p>
            <div className="space-y-3.5">
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-cream-200/60 text-sm flex-shrink-0">$1,500</span>
                <span className="font-serif text-gold-300 font-bold text-lg text-right"><span className="text-base">$375</span> <span className="text-xs font-sans text-cream-200/50">every 2 weeks</span></span>
              </div>
              <div className="h-px bg-charcoal-800/50" />
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-cream-200/60 text-sm flex-shrink-0">$4,000</span>
                <span className="font-serif text-gold-300 font-bold text-lg text-right"><span className="text-base">$1,000</span> <span className="text-xs font-sans text-cream-200/50">every 2 weeks</span></span>
              </div>
              <div className="h-px bg-charcoal-800/50" />
              <div className="flex justify-between items-baseline gap-4">
                <span className="text-cream-200/60 text-sm flex-shrink-0">$6,000</span>
                <span className="font-serif text-gold-300 font-bold text-lg text-right"><span className="text-base">$1,500</span> <span className="text-xs font-sans text-cream-200/50">every 2 weeks</span></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-cream-200/50 text-[11px] mt-5 pt-4 border-t border-charcoal-800/50">
              <span className="flex items-center gap-1">✓ <span className="leading-relaxed">0% interest, 4 payments</span></span>
              <span className="flex items-center gap-1">✓ <span className="leading-relaxed">Instant approval</span></span>
              <span className="flex items-center gap-1">✓ <span className="leading-relaxed">No impact to credit</span></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
