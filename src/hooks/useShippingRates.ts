import { useState } from 'react';
import { getShippingRates } from '../lib/shopify';

interface ShippingRate {
  cost: string;
  deliveryDate: string;
  carrier: string;
}

export function useShippingRates(productHandle: string) {
  const [zipCode, setZipCode] = useState('');
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateShipping = async (zip: string) => {
    if (!zip || zip.length !== 5) {
      setError('Enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getShippingRates(zip, productHandle);
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
  };

  return {
    zipCode,
    setZipCode,
    shippingRate,
    loading,
    error,
    calculateShipping,
  };
}
