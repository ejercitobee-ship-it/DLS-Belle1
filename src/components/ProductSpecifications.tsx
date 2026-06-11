import { useState } from 'react';
import { ChevronDown, ClipboardList } from 'lucide-react';
import type { ProductSpecs } from '../lib/productSpecs';

/**
 * Collapsible specifications panel rendered above the Add to Cart button.
 * Collapsed by default so the CTA stays visible on mobile.
 */
export default function ProductSpecifications({
  specs,
  defaultOpen = false,
}: {
  specs: ProductSpecs;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const entries = Object.entries(specs);

  if (entries.length === 0) return null;

  return (
    <div className="mb-6 bg-charcoal-900/60 border border-charcoal-800/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-charcoal-800/30 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <ClipboardList size={15} className="text-gold-500" />
          <span className="text-white text-xs font-semibold tracking-[0.25em] uppercase">
            Specifications
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`text-gold-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[800px]' : 'max-h-0'}`}>
        <dl className="px-4 pb-4 pt-1 space-y-0">
          {entries.map(([label, value], idx) => (
            <div
              key={label}
              className={`flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-6 py-2.5 text-sm ${
                idx > 0 ? 'border-t border-charcoal-800/40' : ''
              }`}
            >
              <dt className="text-cream-200/40 flex-shrink-0">{label}</dt>
              <dd className="text-cream-100 sm:text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
