import { useEffect, useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2, Package, Lock, AlertCircle, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { qualifiesForFinancing, formatMonthlyPayment, FINANCING_TERM_MONTHS } from '../lib/financing';
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
        {/* Header */}
        <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-charcoal-800/50 bg-charcoal-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-gold-400" />
            <h1 className="font-serif text-lg sm:text-xl text-white font-semibold">Your Cart</h1>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-gold-600 text-charcoal-950 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 rounded transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Items Section - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-charcoal-800/60 flex items-center justify-center ring-1 ring-charcoal-700">
                  <Package size={32} className="text-gold-400/60" />
                </div>
                <div className="space-y-2">
                  <p className="text-cream-100 text-sm font-semibold">Your cart is empty</p>
                  <p className="text-cream-200/50 text-xs leading-relaxed max-w-xs">
                    Add some luxury humidors to get started
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="text-xs text-gold-400 hover:text-gold-300 font-semibold border border-gold-600/40 hover:border-gold-400 px-4 py-2.5 rounded hover:bg-gold-700/15 transition-all active:scale-95 mt-2"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 bg-charcoal-900 rounded-lg p-4 sm:p-5 border border-charcoal-800/40"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-charcoal-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details and Controls */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {/* Product Info */}
                      <div className="space-y-1.5">
                        <h3 className="text-sm sm:text-base font-medium text-cream-100 line-clamp-2">
                          {item.name}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs text-cream-200/50">{item.subtitle}</p>
                        )}
                        {item.category && (
                          <p className="text-xs text-cream-200/40">{item.category}</p>
                        )}
                      </div>

                      {/* Price and Controls Row */}
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <p className="text-sm sm:text-base font-semibold text-gold-400">
                          {fmt(item.priceNum * item.quantity)}
                        </p>

                        <div className="flex items-center gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-charcoal-700/50 rounded bg-charcoal-950">
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-cream-200/30 hover:text-red-400 hover:bg-charcoal-800/50 rounded transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Section - Static */}
          {items.length > 0 && (
            <div
              className="px-4 sm:px-5 py-5 sm:py-6 border-t border-charcoal-800/50 bg-charcoal-900/40 flex flex-col gap-5 sm:gap-6 overflow-y-auto"
              style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}
            >
              {/* Pricing Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-cream-200/60">Subtotal</span>
                  <span className="text-cream-100 font-medium">{fmt(subtotal)}</span>
                </div>

                {/* Shipping & Insurance */}
                <div>
                  <ShippingCalculator productPrice={subtotal} compact={true} />
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-cream-200/60">Taxes</span>
                  <span className="text-cream-200/50 text-xs">Calculated at checkout</span>
                </div>

                {/* Divider */}
                <div className="my-2 h-px bg-gradient-to-r from-charcoal-600 via-charcoal-500/20 to-transparent" />

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gold-400 font-semibold text-sm">Estimated Total</span>
                  <span className="text-gold-400 font-bold text-lg sm:text-xl">{fmt(totalWithShipping)}</span>
                </div>
              </div>

              {/* Financing Banner */}
              {qualifiesForFinancing(totalWithShipping) && (
                <div className="bg-gold-400/8 border border-gold-400/25 rounded-lg p-4 sm:p-5 flex gap-3 items-start hover:bg-gold-400/12 hover:border-gold-400/35 transition-all">
                  <CreditCard size={18} className="text-gold-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-gold-300">Financing Available</p>
                    <p className="text-xs text-cream-100 leading-relaxed">
                      As low as <strong className="text-gold-400">${formatMonthlyPayment(totalWithShipping)}/mo × {FINANCING_TERM_MONTHS}</strong> with Shop Pay
                    </p>
                    <a
                      href="/financing"
                      onClick={closeCart}
                      className="text-xs text-gold-400 hover:text-gold-300 hover:underline font-medium inline-block transition-colors"
                    >
                      Learn more →
                    </a>
                  </div>
                </div>
              )}

              {/* Checkout Error */}
              {checkoutError && (
                <div className="flex gap-2.5 bg-red-900/15 border border-red-700/40 rounded-lg px-3.5 py-3">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-xs text-red-400 leading-snug">
                      Couldn't connect to checkout. Try the direct link below.
                    </p>
                    <a
                      href={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors break-all"
                    >
                      Go directly to Shopify cart →
                    </a>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4">
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-gold-400 to-amber-700 text-black font-bold py-4 sm:py-5 text-sm sm:text-base rounded-lg transition-all duration-300 hover:from-amber-300 hover:to-amber-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-400/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
                >
                  {checkoutLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span className="hidden sm:inline">Preparing Checkout...</span>
                      <span className="sm:hidden">Preparing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      SECURE CHECKOUT
                    </>
                  )}
                </button>

                <button
                  onClick={closeCart}
                  className="w-full bg-transparent text-gold-400 border border-gold-400/60 font-semibold py-3.5 sm:py-4 text-sm sm:text-base rounded-lg transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-400 active:scale-95"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust Signals */}
              <div className="pt-5 border-t border-charcoal-700/30 space-y-4">
                {/* Payment Methods */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['Shop Pay', 'Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                    <span
                      key={method}
                      className="text-[10px] sm:text-xs text-cream-200/50 bg-charcoal-800/50 border border-charcoal-700/40 px-2.5 py-1.5 rounded font-medium"
                    >
                      {method}
                    </span>
                  ))}
                </div>

                {/* Security Badges */}
                <div className="space-y-2 text-xs text-cream-200/40">
                  <div className="flex items-center justify-center gap-2">
                    <Lock size={12} className="text-emerald-500" />
                    <span>SSL Secured by Shopify</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>10-day return guarantee</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Expert concierge support & setup</span>
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
