import { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, Package, Lock, AlertCircle, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { qualifiesForFinancing, formatMonthlyPayment } from '../lib/financing';
import ShippingCalculator from './ShippingCalculator';
import { useShippingRates } from '../hooks/useShippingRates';

type Props = {
  onCheckout: () => void;
};

export default function CartDrawer({ onCheckout: _onCheckout }: Props) {
  void _onCheckout;
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, subtotal, shopifyCheckout } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(false);
  const { shippingRate, calculateShipping } = useShippingRates('cart');

  useEffect(() => {
    if (subtotal > 0) {
      calculateShipping(subtotal);
    }
  }, [subtotal, calculateShipping]);

  const shippingCost = shippingRate ? parseFloat(shippingRate.cost) : 0;
  const totalWithShipping = subtotal + shippingCost;

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
        className={`fixed top-0 right-0 z-[9999] h-full h-[100dvh] w-full sm:w-[420px] bg-charcoal-950 border-l border-charcoal-800/60 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header - Minimal */}
        <div className="px-3 py-2 border-b border-charcoal-800/50 bg-charcoal-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-gold-400" />
            <h1 className="text-sm text-white font-semibold">Your Cart</h1>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-gold-600 text-charcoal-950 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-7 h-7 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 rounded transition-colors"
            aria-label="Close cart"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Items Section - Scrollable */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-charcoal-800/60 flex items-center justify-center ring-1 ring-charcoal-700">
                  <Package size={24} className="text-gold-400/60" />
                </div>
                <div className="space-y-1">
                  <p className="text-cream-100 text-xs font-semibold">Your cart is empty</p>
                  <p className="text-cream-200/50 text-xs leading-tight">
                    Add luxury humidors
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="text-xs text-gold-400 hover:text-gold-300 font-semibold border border-gold-600/40 hover:border-gold-400 px-3 py-1.5 rounded hover:bg-gold-700/15 transition-all active:scale-95"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-2 bg-charcoal-900 rounded p-2 border border-charcoal-800/40"
                  >
                    {/* Product Image */}
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-charcoal-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details and Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
                      {/* Product Info */}
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-medium text-cream-100 line-clamp-1">
                          {item.name}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs text-cream-200/50 line-clamp-1">{item.subtitle}</p>
                        )}
                      </div>

                      {/* Price and Controls Row */}
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-gold-400">
                          {fmt(item.priceNum * item.quantity)}
                        </p>

                        <div className="flex items-center gap-1">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-charcoal-700/50 rounded bg-charcoal-950">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-6 h-6 flex items-center justify-center text-cream-200/30 hover:text-red-400 hover:bg-charcoal-800/50 rounded transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Section - Compact */}
          {items.length > 0 && (
            <div
              className="px-2 py-1.5 border-t border-charcoal-800/50 bg-charcoal-900/40 flex flex-col gap-1 overflow-y-auto text-xs"
              style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))' }}
            >
              {/* Pricing Summary - Ultra Compact */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-cream-200/60">Subtotal</span>
                  <span className="text-cream-100 font-medium">{fmt(subtotal)}</span>
                </div>

                {/* Shipping & Insurance */}
                <div>
                  <ShippingCalculator productPrice={subtotal} compact={true} />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-cream-200/60">Taxes</span>
                  <span className="text-cream-200/50">Calculated at checkout</span>
                </div>

                {/* Divider */}
                <div className="my-0.5 h-px bg-gradient-to-r from-charcoal-600 via-charcoal-500/20 to-transparent" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-gold-400 font-semibold">Total</span>
                  <span className="text-gold-400 font-bold">{fmt(totalWithShipping)}</span>
                </div>
              </div>

              {/* Financing Banner - Minimal */}
              {qualifiesForFinancing(totalWithShipping) && (
                <div className="bg-gold-400/8 border border-gold-400/25 rounded p-1.5 flex gap-2 items-start text-xs">
                  <CreditCard size={14} className="text-gold-400 flex-shrink-0 mt-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gold-300 leading-tight">Financing Available</p>
                    <p className="text-cream-100 leading-tight">
                      ${formatMonthlyPayment(totalWithShipping)}/mo with Shop Pay
                    </p>
                  </div>
                </div>
              )}

              {/* Checkout Error */}
              {checkoutError && (
                <div className="flex gap-2 bg-red-900/15 border border-red-700/40 rounded px-2 py-1">
                  <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs text-red-400 leading-snug">
                      Couldn't connect. Try direct link below.
                    </p>
                    <a
                      href={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors break-all"
                    >
                      Go to cart →
                    </a>
                  </div>
                </div>
              )}

              {/* CTA Buttons - Minimal Height */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={async () => {
                    setCheckoutError(false);
                    setCheckoutLoading(true);
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
                  className="w-full flex items-center justify-center gap-1 bg-gradient-to-br from-gold-400 to-amber-700 text-black font-bold py-2 text-xs rounded transition-all duration-300 hover:from-amber-300 hover:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? (
                    <>
                      <div className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      CHECKOUT
                    </>
                  )}
                </button>

                <button
                  onClick={closeCart}
                  className="w-full bg-transparent text-gold-400 border border-gold-400/60 font-semibold py-1.5 text-xs rounded transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-400 active:scale-95"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Signals - Minimal */}
              <div className="pt-1 border-t border-charcoal-700/30 space-y-1 text-xs">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {['Shop Pay', 'Visa', 'MC', 'Amex'].map((method) => (
                    <span
                      key={method}
                      className="text-[10px] text-cream-200/50 bg-charcoal-800/50 border border-charcoal-700/40 px-1.5 py-0.5 rounded"
                    >
                      {method}
                    </span>
                  ))}
                </div>
                <div className="space-y-0.5 text-center text-cream-200/40">
                  <div className="flex items-center justify-center gap-1">
                    <Lock size={10} className="text-emerald-500" />
                    <span className="text-xs">SSL Secured</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
