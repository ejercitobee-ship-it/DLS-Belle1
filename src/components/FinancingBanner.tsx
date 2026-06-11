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
      <div className={`bg-charcoal-900/60 border border-gold-700/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center">
              <CreditCard size={18} className="text-gold-500" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Shop Pay Installments Available</p>
              <p className="text-cream-200/50 text-xs">Pay in 4 interest-free payments on qualifying purchases</p>
            </div>
          </div>
          <a
            href="/financing"
            className="flex-shrink-0 text-gold-400 hover:text-gold-300 transition-colors"
          >
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className={`bg-gradient-to-r from-charcoal-900 via-charcoal-900/95 to-charcoal-900 border-y border-gold-700/20 py-12 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-600/10 border border-gold-500/30 flex items-center justify-center">
                <CreditCard size={20} className="text-gold-500" />
              </div>
              <span className="text-gold-400 text-xs font-medium tracking-[0.35em] uppercase">
                Flexible Financing
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              Own It Now. <span className="text-gradient-gold italic">Pay Over Time.</span>
            </h2>

            <p className="text-cream-200/70 text-base leading-relaxed mb-6 max-w-sm">
              Finance any qualifying purchase over $1,500 with Shop Pay Installments.
              Pay in 4 equal, interest-free payments — no hidden fees, no surprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/financing"
                className="flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded hover:opacity-90 active:scale-95 transition-all"
              >
                Learn About Financing
                <ArrowRight size={14} />
              </a>
              <a
                href="/all-collections"
                className="flex items-center justify-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-xs tracking-widest uppercase px-6 py-3 rounded hover:bg-gold-700/10 active:bg-gold-700/20 transition-colors"
              >
                Shop Qualifying Products
              </a>
            </div>
          </div>

          {/* Right: Payment example */}
          <div className="bg-charcoal-950/60 border border-charcoal-800/50 rounded-lg p-6 md:p-8">
            <p className="text-cream-200/50 text-xs font-medium tracking-[0.3em] uppercase mb-4">
              Monthly Payment Examples
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-cream-200/60 text-sm">$1,500 purchase</span>
                <span className="font-serif text-gold-300 font-bold text-lg">$375<span className="text-xs font-sans text-cream-200/50"> /month</span></span>
              </div>
              <div className="h-px bg-charcoal-800/50" />
              <div className="flex justify-between items-baseline">
                <span className="text-cream-200/60 text-sm">$4,000 purchase</span>
                <span className="font-serif text-gold-300 font-bold text-lg">$1,000<span className="text-xs font-sans text-cream-200/50"> /month</span></span>
              </div>
              <div className="h-px bg-charcoal-800/50" />
              <div className="flex justify-between items-baseline">
                <span className="text-cream-200/60 text-sm">$6,000 purchase</span>
                <span className="font-serif text-gold-300 font-bold text-lg">$1,500<span className="text-xs font-sans text-cream-200/50"> /month</span></span>
              </div>
            </div>
            <p className="text-cream-200/40 text-[11px] mt-4 leading-relaxed">
              ✓ 0% interest for 4 months  ✓ Instant approval  ✓ No impact to credit score
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
