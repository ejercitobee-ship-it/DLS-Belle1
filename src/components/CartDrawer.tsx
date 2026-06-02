import { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, Package, Lock, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Props = {
  onCheckout: () => void;
};

export default function CartDrawer({ onCheckout: _onCheckout }: Props) {
  void _onCheckout;
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, subtotal, shopifyCheckout } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full h-[100dvh] w-full sm:w-[420px] bg-charcoal-950 border-l border-charcoal-800/60 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-800/50">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-gold-400" />
            <span className="font-serif text-lg text-white font-semibold">Your Cart</span>
            {totalItems > 0 && (
              <span className="text-[11px] font-bold bg-gold-600 text-charcoal-950 px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 rounded transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-12">
              <div className="w-16 h-16 rounded-full bg-charcoal-900 flex items-center justify-center">
                <Package size={28} className="text-charcoal-600" />
              </div>
              <div>
                <p className="text-cream-200/60 text-sm font-medium">Your cart is empty</p>
                <p className="text-cream-200/30 text-xs mt-1">Add some luxury humidors to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="text-xs text-gold-400 hover:text-gold-300 font-medium transition-colors border border-gold-600/30 px-4 py-2 rounded hover:bg-gold-700/10"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-charcoal-900 rounded-lg p-3 border border-charcoal-800/40"
              >
                {/* Image */}
                <div className="w-18 h-18 flex-shrink-0 rounded overflow-hidden" style={{ width: 72, height: 72 }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-cream-100 text-xs font-semibold leading-snug line-clamp-2 mb-0.5">
                    {item.name}
                  </p>
                  {item.subtitle && (
                    <p className="text-cream-200/40 text-[10px] line-clamp-1 mb-1">{item.subtitle}</p>
                  )}
                  {item.category && (
                    <p className="text-gold-500/60 text-[10px] tracking-wider uppercase mb-2">{item.category}</p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1 bg-charcoal-950 border border-charcoal-700/50 rounded">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-cream-200/50 hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-white text-xs font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-cream-200/50 hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-bold font-serif">
                        {fmt(item.priceNum * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-cream-200/30 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-charcoal-800/50 space-y-4 bg-charcoal-900/40 safe-bottom" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))' }}>
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cream-200/50">Subtotal</span>
                <span className="text-cream-100 font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream-200/50">Shipping</span>
                <span className="text-emerald-400 text-xs font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-charcoal-800/50 pt-2 mt-2">
                <span className="text-white">Total</span>
                <span className="text-white font-serif">{fmt(subtotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={async () => {
                setCheckoutError(false);
                setCheckoutLoading(true);
                // GA4 begin_checkout
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'begin_checkout', {
                    currency: 'USD',
                    value: subtotal,
                    items: items.map(item => ({
                      item_id: item.id,
                      item_name: item.name,
                      price: item.priceNum,
                      quantity: item.quantity,
                    })),
                  });
                }
                try {
                  const { url } = await shopifyCheckout();
                  if (url) {
                    const returnUrl = `${window.location.origin}/order-confirmation`;
                    const separator = url.includes('?') ? '&' : '?';
                    window.location.href = `${url}${separator}return_url=${encodeURIComponent(returnUrl)}`;
                    return;
                  }
                  setCheckoutError(true);
                } catch {
                  setCheckoutError(true);
                } finally {
                  setCheckoutLoading(false);
                }
              }}
              disabled={checkoutLoading}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {checkoutLoading ? (
                <><div className="w-4 h-4 border-2 border-charcoal-950/30 border-t-charcoal-950 rounded-full animate-spin" /> Preparing Checkout...</>
              ) : (
                <><Lock size={13} /> Secure Checkout</>
              )}
            </button>

            {checkoutError && (
              <div className="flex flex-col gap-2 text-xs bg-red-900/20 border border-red-700/30 rounded px-3 py-2.5">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle size={12} />
                  Couldn't connect to checkout. Try the direct link below.
                </div>
                <a
                  href={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`}
                  className="text-gold-400 underline hover:text-gold-300 font-medium"
                >
                  Go directly to Shopify cart &rarr;
                </a>
              </div>
            )}

            {/* Trust signals */}
            <div className="space-y-3 pt-2">
              {/* Payment methods */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((m) => (
                  <span key={m} className="text-[10px] text-cream-200/40 bg-charcoal-800/60 border border-charcoal-700/30 px-2 py-1 rounded font-medium">
                    {m}
                  </span>
                ))}
              </div>
              
              {/* Trust badges */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-cream-200/50">
                  <Lock size={10} className="text-emerald-500" />
                  <span>SSL Secured by Shopify</span>
                </div>                <div className="flex items-center justify-center gap-1.5 text-[10px] text-cream-200/50">
                  <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-cream-200/50">
                  <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>White-glove delivery included</span>
                </div>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-cream-200/40 hover:text-cream-200/70 transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
