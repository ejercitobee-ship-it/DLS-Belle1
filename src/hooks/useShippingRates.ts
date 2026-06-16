import { useState, useCallback } from 'react';
import { getShippingRates } from '../lib/shopify';

interface ShippingRate {
  cost: string;
  deliveryDate: string;
  carrier: string;
}

export function useShippingRates(productHandle: string, productCarrierPref?: string) {
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateShipping = useCallback(async (orderValue: number) => {
    if (orderValue <= 0) {
      setError('Invalid order value');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getShippingRates(orderValue, productHandle, productCarrierPref);
      setShippingRate({
        cost: data.cost,
        deliveryDate: data.deliveryDate,
        carrier: data.carrier,
      });
    } catch (err) {
      setError('Unable to calculate shipping. Please try again.');
      console.error('Shipping calculation error:', err);
    } finally {
      setLoading(false);
    }
  }, [productHandle, productCarrierPref]);

  return {
    shippingRate,
    loading,
    error,
    calculateShipping,
  };
}
