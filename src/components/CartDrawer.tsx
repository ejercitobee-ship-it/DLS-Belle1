import { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, Package, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Props = {
  onCheckout: () => void;
};

export default function CartDrawer({ onCheckout: _onCheckout }: Props) {
  void _onCheckout;
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, subtotal, shopifyCheckout, checkoutUrl } = useCart();
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

      {/* Drawer — full width on mobile, fixed 420px on sm+ */}
      <div
        className={`fixed top-0 right-0 z-50 h-full h-[100dvh] w-full sm:w-[420px] bg-charcoal-950 border-l border-charcoal-800/60 flex flex-col shadow-2xl shadow-black/50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-charcoal-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-gold-400" />
            <span className="font-serif text-lg text-white font-semibold">Your Cart</span>
            {totalItems > 0 && (
              <span className="text-[11px] font-bold bg-gold-600 text-charcoal-950 px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          {/* Close button — min 44px touch target */}
          <button
            onClick={closeCart}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-cream-200/50 hover:text-white hover:bg-charcoal-800 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
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
                className="text-xs text-gold-400 hover:text-gold-300 font-medium transition-colors border border-gold-600/30 px-5 py-3 rounded hover:bg-gold-700/10 min-h-[44px]"
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
                <div className="flex-shrink-0 rounded overflow-hidden" style={{ width: 72, height: 72 }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-cream-100 text-sm font-semibold leading-snug line-clamp-2 mb-0.5">
                    {item.name}
                  </p>
                  {item.subtitle && (
                    <p className="text-cream-200/40 text-xs line-clamp-1 mb-1">{item.subtitle}</p>
                  )}
                  {item.category && (
                    <p className="text-gold-500/60 text-[10px] tracking-wider uppercase mb-2">{item.category}</p>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    {/* Qty controls — min 44px touch targets */}
                    <div className="flex items-center gap-0.5 bg-charcoal-950 border border-charcoal-700/50 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] text-cream-200/50 hover:text-white active:bg-charcoal-800 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-white text-sm font-medium w-6 text-center flex-shrink-0">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] text-cream-200/50 hover:text-white active:bg-charcoal-800 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-white text-sm font-bold font-serif">
                        {fmt(item.priceNum * item.quantity)}
                      </span>
                      {/* Trash — min 44px touch target */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center justify-center min-w-[44px] min-h-[44px] text-cream-200/30 hover:text-red-400 active:text-red-400 transition-colors rounded-lg"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
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
          <div
            className="px-4 sm:px-5 py-5 border-t border-charcoal-800/50 space-y-4 bg-charcoal-900/40 flex-shrink-0"
            style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))' }}
          >
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

            {/* Checkout CTA — prominent, full width */}
            <button
              onClick={async () => {
                setCheckoutError(false);
                if (checkoutUrl) {
                  window.location.href = checkoutUrl;
                  return;
                }
                setCheckoutLoading(true);
                try {
                  const { url } = await shopifyCheckout();
                  if (url) {
                    window.location.href = url;
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
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 min-h-[52px]"
            >
              {checkoutLoading ? (
                <><div className="w-4 h-4 border-2 border-charcoal-950/30 border-t-charcoal-950 rounded-full animate-spin" /> Preparing Checkout...</>
              ) : (
                <>CHECKOUT</>
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

            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-cream-200/40 hover:text-cream-200/70 transition-colors py-2 min-h-[44px]"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
