import { useEffect } from 'react';
import { useShippingRates } from '../hooks/useShippingRates';
import { trackShippingCalculatorUsed } from '../lib/analytics';
import { Truck, AlertCircle } from 'lucide-react';

interface ShippingCalculatorProps {
  productHandle: string;
  productPrice: number;
}

export default function ShippingCalculator({ productHandle, productPrice }: ShippingCalculatorProps) {
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
    <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={18} className="text-gold-400" />
        <h3 className="text-cream-100 font-medium text-sm">Shipping Cost Estimator</h3>
      </div>

      <div className="space-y-3">
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
          <div className="bg-charcoal-950/70 border border-gold-600/30 rounded p-3 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-charcoal-400 text-xs uppercase tracking-wide">Estimated Shipping</span>
              <span className="text-gold-400 font-bold text-lg">${shippingRate.cost}</span>
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
  );
}
