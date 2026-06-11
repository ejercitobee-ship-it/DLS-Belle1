import { BadgeCheck, ArrowRight } from 'lucide-react';
import { qualifiesForFinancing, formatMonthlyPayment, FINANCING_TERM_MONTHS } from '../lib/financing';

/**
 * Prominent financing banner shown directly under the price on product pages.
 * Renders nothing for items under the financing minimum.
 */
export default function FinancingCallout({ priceNum }: { priceNum: number }) {
  if (!qualifiesForFinancing(priceNum)) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-gold-600/20 to-gold-600/10 border border-gold-500/50 rounded-lg px-4 sm:px-5 py-4 sm:py-4.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <BadgeCheck size={18} className="text-gold-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="min-w-0">
            <p className="text-cream-100 text-sm sm:text-base leading-relaxed">
              Finance for as low as{' '}
              <span className="text-gold-300 font-bold font-serif text-base sm:text-lg">
                {formatMonthlyPayment(priceNum)}
              </span>
              <span className="text-cream-200/70 text-xs sm:text-sm font-normal"> every 2 weeks</span>
            </p>
            <p className="text-cream-200/60 text-xs mt-1">
              0% interest, {FINANCING_TERM_MONTHS} payments • No hidden fees
            </p>
          </div>
        </div>
        <a
          href="/financing"
          className="inline-flex items-center justify-center gap-1.5 sm:gap-1 text-gold-400 hover:text-gold-300 focus:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500/40 rounded px-2 py-1 transition-all font-medium text-xs whitespace-nowrap flex-shrink-0"
          aria-label="Learn more about Shop Pay financing options"
        >
          <span className="hidden sm:inline">Learn more</span>
          <span className="sm:hidden">More</span>
          <ArrowRight size={14} className="flex-shrink-0" />
        </a>
      </div>
    </div>
  );
}
