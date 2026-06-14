import { useShippingRates } from '../hooks/useShippingRates';

interface ShippingCalculatorProps {
  productHandle: string;
}

export default function ShippingCalculator({ productHandle }: ShippingCalculatorProps) {
  const { zipCode, setZipCode, shippingRate, loading, error, calculateShipping } =
    useShippingRates(productHandle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateShipping(zipCode);
  };

  return (
    <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-4 mb-4">
      <h3 className="text-gold-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
        Shipping Estimate
      </h3>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter ZIP code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
          maxLength={5}
          className="w-full bg-charcoal-950 border border-charcoal-700/60 text-cream-200 placeholder:text-charcoal-600 rounded-lg px-3 py-2 text-sm focus:border-gold-500/60 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={zipCode.length !== 5 || loading}
          className="w-full bg-gold-gradient text-charcoal-950 font-bold text-xs tracking-wide uppercase py-2 rounded-lg disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {shippingRate && (
        <div className="bg-charcoal-950 rounded-lg p-3 mt-3 text-sm">
          <p className="text-cream-200/70 text-xs mb-1">📍 Ships to your area</p>
          <p className="text-white font-bold">
            <span className="text-gold-400">${shippingRate.cost}</span> • Arrives by{' '}
            {shippingRate.deliveryDate}
          </p>
          <p className="text-charcoal-500 text-xs mt-1">via {shippingRate.carrier}</p>
        </div>
      )}
    </div>
  );
}
