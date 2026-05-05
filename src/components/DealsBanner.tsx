import { useState, useEffect } from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { fetchProducts, type ShopifyProduct } from '../lib/shopify';
import { formatMoney } from '../hooks/useShopifyCollection';

function calcDiscount(sale: number, original: number): string {
  return `${Math.round(((original - sale) / original) * 100)}% Off`;
}

export default function DealsBanner() {
  const [deals, setDeals] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Fetch a broad set and filter to ones with a compareAtPrice (on sale)
        const { products } = await fetchProducts(50);
        const onSale = products.filter((p) => {
          const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
          return variant?.compareAtPrice && parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);
        });
        if (!cancelled) setDeals(onSale.slice(0, 3));
      } catch {
        // keep empty — no static fallback needed
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (deals.length === 0) return null;

  return (
    <section className="py-20 bg-charcoal-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Tag size={14} className="text-gold-500" />
              <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
                Limited Edition Deals
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-white font-bold">
              Exclusive <span className="text-gradient-gold italic">Savings</span>
            </h2>
          </div>
          <a
            href="/all-collections"
            className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium group hover:text-gold-300 transition-colors border border-gold-600/30 hover:border-gold-500/50 px-4 py-2 rounded-lg hover:bg-gold-700/10 min-h-[44px]"
          >
            All Deals <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Deal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {deals.map((product) => {
            const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
            const salePrice = parseFloat(variant.price.amount);
            const originalPrice = parseFloat(variant.compareAtPrice!.amount);
            const saleFmt = formatMoney(variant.price.amount, variant.price.currencyCode);
            const origFmt = formatMoney(variant.compareAtPrice!.amount, variant.compareAtPrice!.currencyCode);
            const discount = calcDiscount(salePrice, originalPrice);
            const image = product.featuredImage?.url ?? variant.image?.url ?? '';

            const shopifyUrl = `https://luxury-dunn-selections.myshopify.com/products/${product.handle}`;

            return (
              <div
                key={product.id}
                onClick={() => { window.open(shopifyUrl, '_blank', 'noopener,noreferrer'); }}
                className="group relative rounded-lg overflow-hidden bg-charcoal-900 border border-charcoal-800/50 hover:border-gold-600/50 card-hover cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gold-900/20 active:scale-[0.98]"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  {image && (
                    <img
                      src={image}
                      alt={product.featuredImage?.altText ?? product.title}
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="absolute top-3 right-3 bg-red-700 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded">
                  {discount}
                </div>
                <div className="p-4">
                  <p className="text-cream-100 text-sm font-medium mb-2 line-clamp-1">{product.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg">{saleFmt}</span>
                    <span className="text-cream-200/40 text-sm line-through">{origFmt}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(shopifyUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="mt-3 w-full text-center text-xs font-semibold tracking-widest uppercase text-charcoal-950 bg-gold-gradient py-3.5 rounded hover:opacity-90 active:scale-95 transition-all min-h-[48px] shadow-md"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
