import { useState, useEffect } from 'react';
import { useShippingRates } from '../hooks/useShippingRates';
import { trackShippingCalculatorUsed } from '../lib/analytics';
import { Truck, AlertCircle } from 'lucide-react';

interface ShippingCalculatorProps {
  productHandle: string;
}

export default function ShippingCalculator({ productHandle }: ShippingCalculatorProps) {
  const [inputZip, setInputZip] = useState('');
  const { zipCode, setZipCode, shippingRate, loading, error, calculateShipping } = useShippingRates(productHandle);

  const handleCalculate = () => {
    calculateShipping(inputZip);
    if (inputZip.length === 5) {
      setZipCode(inputZip);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputZip.length === 5) {
      handleCalculate();
    }
  };

  useEffect(() => {
    if (shippingRate && zipCode) {
      trackShippingCalculatorUsed(zipCode, parseFloat(shippingRate.cost));
    }
  }, [shippingRate, zipCode]);

  return (
    <div className="bg-charcoal-900/50 border border-charcoal-800/50 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={18} className="text-gold-400" />
        <h3 className="text-cream-100 font-medium text-sm">Shipping Cost Estimator</h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            maxLength={5}
            placeholder="Enter ZIP code"
            value={inputZip}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setInputZip(val);
            }}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1 bg-charcoal-950 border border-charcoal-700 rounded px-3 py-2 text-cream-100 placeholder-charcoal-600 text-sm disabled:opacity-50"
          />
          <button
            onClick={handleCalculate}
            disabled={inputZip.length !== 5 || loading}
            className="bg-gold-gradient text-charcoal-950 font-semibold px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition text-sm"
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-400 text-sm bg-red-950/30 border border-red-900/50 rounded p-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {shippingRate && zipCode && (
          <div className="bg-charcoal-950/70 border border-gold-600/30 rounded p-3 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-charcoal-400 text-xs uppercase tracking-wide">Estimated Shipping</span>
              <span className="text-gold-400 font-bold text-lg">${shippingRate.cost}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-charcoal-400 text-xs uppercase tracking-wide">Delivery by</span>
              <span className="text-cream-100 text-sm">{shippingRate.deliveryDate}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-charcoal-400 text-xs uppercase tracking-wide">Carrier</span>
              <span className="text-cream-100 text-sm">{shippingRate.carrier}</span>
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
