import { BadgeCheck } from 'lucide-react';
import { qualifiesForFinancing, formatMonthlyPayment, FINANCING_TERM_MONTHS } from '../lib/financing';

/**
 * Prominent financing banner shown directly under the price on product pages.
 * Renders nothing for items under the financing minimum.
 */
export default function FinancingCallout({ priceNum }: { priceNum: number }) {
  if (!qualifiesForFinancing(priceNum)) return null;

  return (
    <div className="mb-6 bg-gold-600/15 border border-gold-500/40 rounded-lg px-4 py-3.5 text-center">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <BadgeCheck size={16} className="text-gold-400 flex-shrink-0" />
        <p className="text-cream-100 text-sm">
          Finance this for as low as{' '}
          <span className="text-gold-300 font-bold font-serif text-base">
            {formatMonthlyPayment(priceNum)}/month
          </span>{' '}
          with Shop Pay — 0% interest for {FINANCING_TERM_MONTHS} months for qualified buyers
        </p>
      </div>
      <a
        href="/financing"
        className="inline-block mt-1.5 text-gold-400 hover:text-gold-300 text-xs font-medium underline underline-offset-2 transition-colors"
      >
        Learn more about financing →
      </a>
    </div>
  );
}
