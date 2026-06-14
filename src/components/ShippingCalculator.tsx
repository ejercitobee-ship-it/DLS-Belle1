import { useState, useEffect } from 'react';
import { useShippingRates } from '../hooks/useShippingRates';
import { trackShippingCalculatorUsed } from '../lib/analytics';
import { Truck, AlertCircle, ChevronDown } from 'lucide-react';

interface ShippingCalculatorProps {
  productHandle?: string;
  productPrice: number;
}

export default function ShippingCalculator({ productHandle = 'cart', productPrice }: ShippingCalculatorProps) {
  const [expanded, setExpanded] = useState(false);
  const { shippingRate, loading, error, calculateShipping } = useShippingRates(productHandle);

  useEffect(() => {
    // Automatically calculate shipping based on product price
    if (productPrice > 0) {
      calculateShipping(productPrice);
    }
  }, [productPrice, calculateShipping]);

  useEffect(() => {
    if (shippingRate) {
      trackShippingCalculatorUsed(String(productPrice), parseFloat(shippingRate.cost));
    }
  }, [shippingRate, productPrice]);

  return (
    <div className="mb-6 bg-charcoal-900/60 border border-charcoal-800/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-charcoal-800/30 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <Truck size={16} className="text-gold-500" />
          <span className="text-white text-xs font-semibold tracking-[0.25em] uppercase">
            Shipping and Insurance
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`text-gold-500 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[300px]' : 'max-h-0'}`}>
        <div className="px-4 pb-4 pt-2 space-y-3">
          {loading && (
            <div className="text-center text-cream-200/60 text-sm">Calculating...</div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded p-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {shippingRate && (
            <div className="space-y-2 border-t border-charcoal-700/50 pt-3">
              <div className="flex justify-between items-start">
                <span className="text-charcoal-400 text-xs uppercase tracking-wide">Estimated Cost</span>
                <span className="text-gold-400 font-bold text-sm">${shippingRate.cost}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-charcoal-400 text-xs uppercase tracking-wide">Ship Date</span>
                <span className="text-cream-100 text-sm">1-2 business days</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-charcoal-400 text-xs uppercase tracking-wide">Carrier</span>
                <span className="text-cream-100 text-sm">We will notify once it is being picked up</span>
              </div>
              <div className="pt-2 border-t border-charcoal-700/50 text-charcoal-500 text-xs">
                ✓ Insured during transit
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
