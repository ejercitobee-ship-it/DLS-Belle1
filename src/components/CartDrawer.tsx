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

  // Calculate shipping based on subtotal
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
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-charcoal-800/50 bg-charcoal-950">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <ShoppingBag size={18} className="text-gold-400 flex-shrink-0" />
            <span className="font-serif text-base sm:text-lg md:text-xl text-white font-semibold truncate">Your Cart</span>
            {totalItems > 0 && (
              <span className="text-[11px] font-bold bg-gold-600 text-charcoal-950 px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-cream-200/50 hover:text-white hover:bg-charcoal-800 rounded transition-colors"
            aria-label="Close cart"
          >
            <X size={18} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 mb-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-5 text-center py-8 sm:py-12 px-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-charcoal-800/60 flex items-center justify-center ring-1 ring-charcoal-700">
                <Package size={24} className="sm:w-7 sm:h-7 text-gold-400/60" />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <p className="text-cream-100 text-sm sm:text-base font-semibold">Your cart is empty</p>
                <p className="text-cream-200/50 text-xs sm:text-sm leading-relaxed px-1">Add some luxury humidors to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="text-[11px] sm:text-xs text-gold-400 hover:text-gold-300 font-semibold transition-all duration-200 border border-gold-600/40 hover:border-gold-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded hover:bg-gold-700/15 active:scale-95 mt-1"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-2 sm:gap-3 bg-charcoal-900 rounded-lg py-5 sm:py-6 px-4 sm:px-5 border border-charcoal-800/40"
              >
                {/* Image */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-5">
                  {/* Item Title */}
                  <h4 className="text-xs sm:text-sm font-medium m-0 leading-snug text-cream-100 line-clamp-2 break-words">
                    {item.name}
                  </h4>

                  {/* Item Size/Subtitle */}
                  {item.subtitle && (
                    <p className="text-[11px] sm:text-xs text-cream-200/40 m-0 truncate">{item.subtitle}</p>
                  )}

                  {/* Item Category */}
                  {item.category && (
                    <p className="text-[11px] sm:text-xs text-cream-200/40 m-0 truncate">{item.category}</p>
                  )}

                  {/* Item Price */}
                  <p className="text-xs sm:text-sm font-semibold text-gold-400 mt-0.5 sm:mt-1 m-0">
                    {fmt(item.priceNum * item.quantity)}
                  </p>

                  {/* Item Controls */}
                  <div className="flex items-center justify-between gap-2 mt-0.5 sm:mt-1">
                    {/* Qty controls */}
                    <div className="flex items-center gap-0.5 bg-charcoal-950 border border-charcoal-700/50 rounded">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-cream-200/50 hover:text-white transition-colors active:bg-charcoal-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} className="sm:w-2.5 sm:h-2.5" />
                      </button>
                      <span className="text-white text-xs font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-cream-200/50 hover:text-white transition-colors active:bg-charcoal-800"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} className="sm:w-2.5 sm:h-2.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center text-cream-200/30 hover:text-red-400 transition-colors active:scale-90"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} className="sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-charcoal-800/50 bg-charcoal-900/40 flex flex-col gap-5 sm:gap-6" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}>
            {/* Cart Summary Section */}
            <div className="space-y-1.5 sm:space-y-2">
              {/* Summary Items */}
              <div className="flex flex-col gap-2 sm:gap-3">
                {/* Subtotal Row */}
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2 py-2 sm:py-2.5">
                  <span className="text-cream-200/60 font-normal">Subtotal</span>
                  <span className="text-cream-100 font-medium text-right break-words">{fmt(subtotal)}</span>
                </div>

                {/* Shipping & Insurance */}
                <div className="py-2.5 sm:py-3">
                  <ShippingCalculator productPrice={subtotal} compact={true} />
                </div>

                {/* Taxes Row */}
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2 py-2 sm:py-2.5">
                  <span className="text-cream-200/60 font-normal">Taxes</span>
                  <span className="text-cream-200/50 font-normal text-right text-[11px] sm:text-xs md:text-sm whitespace-nowrap">Calculated at checkout</span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 sm:my-6 h-px bg-gradient-to-r from-charcoal-600 via-charcoal-500/20 to-transparent"></div>

              {/* Total Row */}
              <div className="flex justify-between items-center pt-4 sm:pt-5 md:pt-6 border-t border-charcoal-700/50 gap-2">
                <span className="text-gold-400 font-semibold text-xs sm:text-sm md:text-base">Estimated Total</span>
                <span className="text-gold-400 font-bold text-base sm:text-lg md:text-2xl break-words">{fmt(totalWithShipping)}</span>
              </div>
            </div>

            {/* Financing & Checkout Section */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Financing Offer Banner */}
              {qualifiesForFinancing(totalWithShipping) && (
                <section aria-label="Financing offer" className="bg-gold-400/8 border border-gold-400/25 rounded-lg p-5 sm:p-6 mt-6 sm:mt-8 flex gap-2.5 sm:gap-3 items-start transition-all duration-200 hover:bg-gold-400/12 hover:border-gold-400/35">
                  <div className="flex-shrink-0 text-gold-400 pt-0.5"><CreditCard size={18} className="sm:w-5 sm:h-5" /></div>
                  <div className="flex flex-col gap-2.5 sm:gap-3 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gold-300 m-0">Financing Available</p>
                    <p className="text-[11px] sm:text-xs text-cream-100 m-0 leading-relaxed break-words">
                      Your order qualifies: as low as <strong className="text-gold-400 font-semibold">${formatMonthlyPayment(totalWithShipping)}/mo × {FINANCING_TERM_MONTHS}</strong>
                    </p>
                    <p className="text-[11px] sm:text-xs text-cream-200/50 m-0 leading-snug break-words">
                      With Shop Pay — 0% interest for qualified buyers
                    </p>
                    <a href="/financing" onClick={closeCart} className="text-[11px] sm:text-xs text-gold-400 no-underline mt-0.5 sm:mt-1 inline-block hover:text-gold-300 hover:underline transition-colors font-medium whitespace-nowrap">
                      Learn more →
                    </a>
                  </div>
                </section>
              )}

              {/* Checkout CTA */}
              <div className="flex flex-col gap-3 sm:gap-4 mt-6 sm:mt-8">
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-gold-400 to-amber-700 text-black border border-gold-300/30 px-3 sm:px-4 md:px-5 py-4 sm:py-5 md:py-6 text-xs sm:text-sm md:text-base font-bold rounded-lg tracking-wide transition-all duration-300 hover:from-amber-300 hover:to-amber-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-400/40 hover:border-gold-300/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0"
              >
                {checkoutLoading ? (
                  <><div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> <span className="hidden sm:inline">Preparing Checkout...</span><span className="sm:hidden">Preparing...</span></>
                ) : (
                  <><Lock size={14} className="sm:w-3.5 sm:h-3.5" /> SECURE CHECKOUT</>
                )}
              </button>

              <button
                onClick={closeCart}
                className="w-full bg-transparent text-gold-400 border border-gold-400/60 px-3 sm:px-4 md:px-5 py-3.5 sm:py-4 md:py-5 text-xs sm:text-sm md:text-base font-semibold rounded-lg tracking-wide transition-all duration-300 hover:bg-gold-400/10 hover:border-gold-400 active:scale-95"
              >
                Continue Shopping
              </button>
            </div>

              {checkoutError && (
                <div className="flex flex-col gap-2 sm:gap-2.5 text-[11px] sm:text-xs bg-red-900/15 border border-red-700/40 rounded-lg px-3 sm:px-3.5 py-2.5 sm:py-3">
                  <div className="flex items-start gap-2 sm:gap-2.5 text-red-400">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span className="leading-snug break-words">Couldn't connect to checkout. Try the direct link below.</span>
                  </div>
                  <a
                    href={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`}
                    className="text-gold-400 hover:text-gold-300 font-semibold transition-colors break-all"
                  >
                    Go directly to Shopify cart →
                  </a>
                </div>
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-charcoal-700/30 text-center space-y-3 sm:space-y-4">
              {/* Payment methods */}
              <div className="flex items-center justify-center gap-2 mb-4 flex-wrap opacity-60">
                {['Shop Pay', 'Visa', 'Mastercard', 'Amex', 'PayPal'].map((m) => (
                  <span key={m} className="text-[9px] sm:text-[10px] text-cream-200/50 bg-charcoal-800/50 border border-charcoal-700/40 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md font-medium transition-colors hover:text-cream-100 hover:border-charcoal-600">
                    {m}
                  </span>
                ))}
              </div>

              {/* Trust badges */}
              <div className="space-y-1.5 sm:space-y-2.5 text-xs text-cream-200/40">
                <div className="flex items-center justify-center gap-1.5">
                  <Lock size={11} className="text-emerald-500 flex-shrink-0" />
                  <span className="break-words">SSL Secured by Shopify</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="break-words">10-day return guarantee</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="break-words">Expert concierge support & setup</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
