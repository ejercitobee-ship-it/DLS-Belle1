import { useState, useEffect } from 'react';
import { fetchCollectionByHandle, type ShopifyProduct } from '../lib/shopify';

type UseShopifyCollectionResult = {
  products: ShopifyProduct[];
  loading: boolean;
  collectionImage: string | null;
};

export function useShopifyCollection(
  handle: string,
  fallbackHandle?: string,
): UseShopifyCollectionResult {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionImage, setCollectionImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let col = await fetchCollectionByHandle(handle, 50);
        if (!col?.products.length && fallbackHandle) {
          col = await fetchCollectionByHandle(fallbackHandle, 50);
        }
        if (!cancelled && col?.products.length) {
          setProducts(col.products);
          setCollectionImage(col.image?.url ?? null);
        }
      } catch {
        // keep static fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [handle, fallbackHandle]);

  return { products, loading, collectionImage };
}

export function formatMoney(amount: string, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    parseFloat(amount),
  );
}

export function getDefaultVariantId(product: ShopifyProduct): string {
  return (
    product.variants.find((v) => v.availableForSale)?.id ?? product.variants[0]?.id ?? ''
  );
}

export function getProductPrice(product: ShopifyProduct): { price: string; priceNum: number; compareAt: string | null } {
  const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const priceObj = variant?.price ?? product.priceRange.minVariantPrice;
  const compareObj = variant?.compareAtPrice ?? null;
  return {
    price: formatMoney(priceObj.amount, priceObj.currencyCode),
    priceNum: parseFloat(priceObj.amount),
    compareAt: compareObj ? formatMoney(compareObj.amount, compareObj.currencyCode) : null,
  };
}
