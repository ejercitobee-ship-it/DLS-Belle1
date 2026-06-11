import { useState } from 'react';
import { ArrowLeft, Lock, ShieldCheck, Truck, ExternalLink, ShoppingBag, AlertCircle, Minus, Plus, Trash2, MessageCircle, BadgeCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { qualifiesForFinancing, formatMonthlyPayment, FINANCING_TERM_MONTHS } from '../lib/financing';

type Props = { onBack: () => void };

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function Checkout({ onBack }: Props) {
  const { items, subtotal, updateQty, removeItem, shopifyCheckout, checkoutUrl } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = subtotal >= 5000 ? 0 : subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  async function handleCheckout() {
    setError('');
    
    // GA4 - Begin Checkout Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: total,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.priceNum,
          quantity: item.quantity,
        })),
      });
    }
    
    setLoading(true);
    try {
      // Always create a fresh cart to avoid stale/expired checkout URLs
      const { url } = await shopifyCheckout();
      const baseUrl = url || checkoutUrl;
      if (baseUrl) {
        const returnUrl = `${window.location.origin}/order-confirmation`;
        const separator = baseUrl.includes('?') ? '&' : '?';
        window.location.href = `${baseUrl}${separator}return_url=${encodeURIComponent(returnUrl)}`;
        return;
      }
      setError('Could not create a Shopify checkout session. Please try again.');
    } catch {
      setError('Something went wrong. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-charcoal-950/95 backdrop-blur-md border-b border-charcoal-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cream-200/50 hover:text-gold-400 text-sm transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to shop
          </button>
          <span className="font-serif text-base text-white font-semibold">Review Your Order</span>
          <div className="flex items-center gap-1.5 text-cream-200/40 text-xs">
            <Lock size={11} className="text-emerald-400" />
            <span className="hidden sm:inline">SSL Secured</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left — CTA + Trust */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

            {/* Shopify checkout card */}
            <div className="bg-charcoal-900 border border-gold-700/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-gold-500" />
                <span className="text-white text-sm font-semibold">Secure Shopify Checkout</span>
              </div>
              <p className="text-cream-200/50 text-xs leading-relaxed mb-4">
                You'll be taken to the official Dunn's Luxury Selections Shopify store to complete your purchase securely — Affirm financing, credit card, PayPal, Apple Pay, and more accepted.
              </p>

              {/* Financing qualification */}
              {qualifiesForFinancing(total) && (
                <div className="bg-gold-600/15 border border-gold-500/40 rounded-lg px-3.5 py-3 mb-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs text-cream-100">
                    <BadgeCheck size={13} className="text-gold-400 flex-shrink-0" />
                    <span>
                      Your order qualifies for financing: as low as{' '}
                      <span className="text-gold-300 font-bold">
                        {formatMonthlyPayment(total)}/month × {FINANCING_TERM_MONTHS}
                      </span>
                    </span>
                  </div>
                  <p className="text-cream-200/50 text-[11px] mt-1">
                    0% interest for qualified buyers — choose "Shop Pay · Pay in installments" at checkout (financing powered by Affirm).{' '}
                    <a
                      href="/financing"
                      className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-charcoal-950/30 border-t-charcoal-950 rounded-full animate-spin" />
                    Preparing Checkout...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} />
                    Proceed to Checkout
                    <ExternalLink size={13} />
                  </>
                )}
              </button>

              {/* Payment method icons */}
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                {['Affirm', 'Visa', 'MC', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((m) => (
                  <span key={m} className="text-[10px] text-cream-200/30 bg-charcoal-800/60 border border-charcoal-700/30 px-2 py-1 rounded font-medium">
                    {m}
                  </span>
                ))}
              </div>

              {/* Chat with specialist */}
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                    (window as any).Tawk_API.maximize();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 mt-3 text-xs text-cream-200/40 hover:text-gold-400 transition-colors py-2"
              >
                <MessageCircle size={13} />
                Questions? Chat with a specialist
              </button>

              {error && (
                <div className="flex flex-col gap-2 text-xs bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2.5 mt-3">
                  <div className="flex items-start gap-2 text-red-400">
                    <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                  <a
                    href={`https://${import.meta.env.VITE_SHOPIFY_STORE_DOMAIN}/cart`}
                    className="text-gold-400 underline hover:text-gold-300 font-medium"
                  >
                    Go directly to Shopify cart &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: Lock, text: '256-bit SSL Encryption' },
                { icon: ShieldCheck, text: 'Powered by Shopify Payments' },
                { icon: Truck, text: 'Insured White-Glove Delivery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-cream-200/40 bg-charcoal-900/60 border border-charcoal-800/30 rounded-lg px-3.5 py-2.5">
                  <Icon size={13} className="text-gold-500/70 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            <p className="text-center text-cream-200/25 text-[10px] leading-relaxed">
              Your payment is processed securely by Shopify. We never see your card details.
            </p>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-6 bg-gold-500" />
                <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">Order Summary</span>
              </div>
              <h2 className="font-serif text-2xl text-white font-bold">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </h2>
            </div>

            {/* Item list */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-charcoal-900 border border-charcoal-800/40 rounded-xl p-4">
                  <div className="relative flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold-600 text-charcoal-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-cream-100 text-sm font-medium leading-snug line-clamp-2">{item.name}</p>
                    {item.category && (
                      <p className="text-gold-500/60 text-[10px] tracking-wider uppercase mt-0.5">{item.category}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2 bg-charcoal-950 border border-charcoal-700/40 rounded w-fit">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-cream-200/50 hover:text-white transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-white text-xs font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-cream-200/50 hover:text-white transition-colors"
                        aria-label="Increase"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <p className="text-white text-sm font-bold font-serif">{fmt(item.priceNum * item.quantity)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-cream-200/30 hover:text-red-400 transition-colors p-1"
                      aria-label="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-charcoal-900 border border-charcoal-800/40 rounded-xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-cream-200/50">Subtotal</span>
                <span className="text-cream-100 font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cream-200/50">Shipping</span>
                {shipping === 0 ? (
                  <span className="text-emerald-400 text-xs font-semibold">Free</span>
                ) : (
                  <span className="text-cream-200/70">{fmt(shipping)}</span>
                )}
              </div>
              <div className="flex justify-between text-sm text-cream-200/40 border-t border-charcoal-800/40 pt-3">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-charcoal-800/50 pt-3">
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold font-serif text-lg">{fmt(total)}</span>
              </div>
            </div>

            {shipping === 0 && subtotal > 0 && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-700/20 rounded-lg px-3.5 py-2.5">
                <Truck size={13} />
                Free shipping applied on orders over $5,000
              </div>
            )}
            {shipping > 0 && (
              <div className="flex items-center gap-2 text-xs text-cream-200/40 bg-charcoal-900/50 border border-charcoal-800/30 rounded-lg px-3.5 py-2.5">
                <Truck size={13} />
                Spend {fmt(5000 - subtotal)} more for free shipping
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
