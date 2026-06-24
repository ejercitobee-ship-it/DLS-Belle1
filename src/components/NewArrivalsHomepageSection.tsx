import { useState } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useShopifyCollection, formatMoney, getDefaultVariantId } from '../hooks/useShopifyCollection';
import { useNavigateToProduct } from '../hooks/useNavigateToProduct';
import type { ShopifyProduct } from '../lib/shopify';

const STATIC_PRODUCTS = [
  {
    id: 's-1',
    handle: 'raching-rr980',
    name: 'Raching RR980 Cigar Humidor',
    price: '$6,387',
    priceNum: 6387,
    image: '/images/products/c28eff7e15a7f40ecba3853c6731fb2c.jpg',
  },
  {
    id: 's-2',
    handle: 'raching-ct48a',
    name: 'RACHING CT48A Stainless Steel Grand Humidor',
    price: '$4,752',
    priceNum: 4752,
    image: '/images/products/CT48A-silver.jpg',
  },
  {
    id: 's-3',
    handle: 'raching-mon800a',
    name: 'Raching MON800A Precision Climate Humidor',
    price: '$1,824',
    priceNum: 1824,
    image: '/images/products/raching-cs600-luxury-cigar-humidor-cabinet.jpg',
  },
  {
    id: 's-4',
    handle: 'reagan-cabinet',
    name: 'Reagan Electronic Cabinet Humidor',
    price: '$6,147',
    priceNum: 6147,
    image: '/images/products/CT48A-silver.jpg',
  },
];

type DisplayProduct = {
  id: string;
  handle: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  shopifyVariantId?: string;
};

function fromShopify(p: ShopifyProduct): DisplayProduct {
  const variantId = getDefaultVariantId(p);
  const variant = p.variants.find((v) => v.id === variantId) ?? p.variants[0];
  const price = variant?.price ?? p.priceRange.minVariantPrice;
  const image = variant?.image?.url ?? p.featuredImage?.url ?? '';
  return {
    id: `shopify-${p.id}`,
    handle: p.handle,
    name: p.title,
    price: formatMoney(price.amount, price.currencyCode),
    priceNum: parseFloat(price.amount),
    image,
    shopifyVariantId: variantId,
  };
}

export default function NewArrivalsHomepageSection() {
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const { products: shopifyProducts, loading } = useShopifyCollection('new-arrivals', 'products');
  const navigateToProduct = useNavigateToProduct();

  const products: DisplayProduct[] = shopifyProducts.length
    ? shopifyProducts.slice(0, 4).map(fromShopify)
    : STATIC_PRODUCTS;

  const handleProductClick = (e: React.MouseEvent, product: DisplayProduct) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    e.preventDefault();
    navigateToProduct(product.handle);
  };

  const handleAddToCart = (product: DisplayProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
      category: 'New Arrivals',
      shopifyVariantId: product.shopifyVariantId,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section className="py-16 md:py-20 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-10 md:mb-12">
          New <span className="text-gradient-gold italic">Arrivals</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-charcoal-950 rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-charcoal-800" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-charcoal-800 rounded w-2/3" />
                  <div className="h-4 bg-charcoal-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {products.map((product) => {
              const isAdded = addedId === product.id;
              return (
                <a
                  key={product.id}
                  href={`/product/${product.handle}`}
                  onClick={(e) => handleProductClick(e, product)}
                  className="group bg-charcoal-950 rounded-lg overflow-hidden border border-charcoal-800/50 hover:border-gold-600/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-square bg-charcoal-900 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="inline-block bg-gold-600/20 text-gold-400 text-[9px] font-bold tracking-wide uppercase px-2 py-1 rounded border border-gold-600/40">
                        New
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-white text-xs md:text-sm font-medium line-clamp-2 group-hover:text-gold-300 transition-colors mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-white font-serif font-bold text-sm md:text-base truncate">
                        {product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-shrink-0 flex items-center justify-center p-1.5 md:p-2 rounded transition-all active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-700/20 text-emerald-400 border border-emerald-700/40'
                            : 'bg-gold-gradient text-charcoal-950 hover:opacity-90'
                        }`}
                        aria-label="Add to cart"
                      >
                        {isAdded ? (
                          <CheckCircle2 size={14} className="md:hidden" />
                        ) : (
                          <ShoppingBag size={14} className="md:hidden" />
                        )}
                        {isAdded ? (
                          <CheckCircle2 size={16} className="hidden md:block" />
                        ) : (
                          <ShoppingBag size={16} className="hidden md:block" />
                        )}
                      </button>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
