import { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Truck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

type Props = { onBack: () => void };

type ContactField = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
};

const INITIAL: ContactField = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  phone: '',
};

const countries = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
];

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function Checkout({ onBack }: Props) {
  const { items, subtotal, clearCart, shopifyCheckout, isShopifyConfigured } = useCart();
  const [fields, setFields] = useState<ContactField>(INITIAL);
  const [errors, setErrors] = useState<Partial<ContactField>>({});
  const [loading, setLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const shipping = subtotal > 5000 ? 0 : subtotal > 0 ? 49 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const set = (key: keyof ContactField, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  function validateContact() {
    const e: Partial<ContactField> = {};
    if (!fields.email.includes('@')) e.email = 'Valid email required';
    if (!fields.firstName.trim()) e.firstName = 'Required';
    if (!fields.lastName.trim()) e.lastName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleShopifyCheckout() {
    if (!validateContact()) return;
    setLoading(true);
    try {
      // Log order intent to Supabase for CRM purposes
      await supabase.from('orders').insert({
        order_number: 'PENDING-' + Date.now().toString(36).toUpperCase(),
        customer_email: fields.email,
        customer_name: `${fields.firstName} ${fields.lastName}`,
        shipping_address: {
          address: fields.address,
          city: fields.city,
          state: fields.state,
          zip: fields.zip,
          country: fields.country,
          phone: fields.phone,
        },
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.priceNum,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        shipping,
        tax,
        total,
        status: 'redirected_to_shopify',
        payment_method: 'shopify',
      }).catch(() => { /* non-blocking */ });

      const { url, fallback } = await shopifyCheckout();
      if (!fallback && url) {
        clearCart();
        window.location.href = url;
        return;
      }
      // If Shopify cart creation failed, fall back to Shopify store directly
      window.location.href = `https://luxury-dunn-selections.myshopify.com/cart`;
    } catch {
      window.location.href = `https://luxury-dunn-selections.myshopify.com/cart`;
    } finally {
      setLoading(false);
    }
  }

  const inputCls = (field: keyof ContactField) =>
    `w-full bg-charcoal-900 border ${
      errors[field] ? 'border-red-500/60' : 'border-charcoal-700/50 focus:border-gold-500/60'
    } text-cream-100 text-sm rounded px-3.5 py-3 outline-none transition-colors placeholder:text-charcoal-500`;

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-charcoal-950/95 backdrop-blur-md border-b border-charcoal-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cream-200/50 hover:text-gold-400 text-sm transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to shop
          </button>
          <span className="font-serif text-base text-white font-semibold">Secure Checkout</span>
          <div className="flex items-center gap-1.5 text-cream-200/40 text-xs">
            <Lock size={11} className="text-emerald-400" />
            <span>SSL Secured</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left — Contact + Checkout */}
          <div className="lg:col-span-3 space-y-8">

            {/* Shopify checkout highlight */}
            {isShopifyConfigured && (
              <div className="bg-charcoal-900 border border-gold-700/30 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-gold-500" />
                  <span className="text-white text-sm font-semibold">Secure Shopify Checkout</span>
                </div>
                <p className="text-cream-200/50 text-xs leading-relaxed">
                  You'll be redirected to the official Dunn's Luxury Selections Shopify store to complete your purchase securely with your preferred payment method.
                </p>
              </div>
            )}

            {/* Contact info */}
            <div>
              <h2 className="font-serif text-xl text-white font-bold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Email Address *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={fields.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputCls('email')}
                  />
                  {errors.email && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Phone (optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={fields.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={inputCls('phone')}
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <h2 className="font-serif text-xl text-white font-bold mb-4">Your Name</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">First Name *</label>
                  <input
                    placeholder="John"
                    value={fields.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    className={inputCls('firstName')}
                  />
                  {errors.firstName && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Last Name *</label>
                  <input
                    placeholder="Doe"
                    value={fields.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    className={inputCls('lastName')}
                  />
                  {errors.lastName && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.lastName}</p>}
                </div>
              </div>
            </div>

            {/* Optional shipping hint */}
            <div>
              <h2 className="font-serif text-xl text-white font-bold mb-2">Shipping Address</h2>
              <p className="text-cream-200/40 text-xs mb-4">You can enter your full shipping address on the Shopify checkout page.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Address (optional)</label>
                  <input
                    placeholder="123 Main Street, Apt 4"
                    value={fields.address}
                    onChange={(e) => set('address', e.target.value)}
                    className={inputCls('address')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">City (optional)</label>
                  <input
                    placeholder="New York"
                    value={fields.city}
                    onChange={(e) => set('city', e.target.value)}
                    className={inputCls('city')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">State / Province</label>
                  <input
                    placeholder="NY"
                    value={fields.state}
                    onChange={(e) => set('state', e.target.value)}
                    className={inputCls('state')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">ZIP / Postal Code</label>
                  <input
                    placeholder="10001"
                    value={fields.zip}
                    onChange={(e) => set('zip', e.target.value)}
                    className={inputCls('zip')}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Country</label>
                  <select
                    value={fields.country}
                    onChange={(e) => set('country', e.target.value)}
                    className={inputCls('country') + ' cursor-pointer'}
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code} className="bg-charcoal-900">{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Lock, text: '256-bit SSL Encryption' },
                { icon: ShieldCheck, text: 'Secure Shopify Checkout' },
                { icon: Truck, text: 'Insured Delivery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[10px] text-cream-200/40">
                  <Icon size={11} className="text-emerald-500" />
                  {text}
                </div>
              ))}
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleShopifyCheckout}
              disabled={loading || items.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-charcoal-950/30 border-t-charcoal-950 rounded-full animate-spin" />
                  Redirecting to Checkout...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Proceed to Checkout — {fmt(total)}
                  <ExternalLink size={14} />
                </>
              )}
            </button>

            <p className="text-center text-cream-200/30 text-[10px]">
              You will be redirected to the official Dunn's Luxury Selections Shopify store to complete your purchase.
            </p>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-2">
            {/* Mobile toggle */}
            <button
              className="lg:hidden w-full flex items-center justify-between bg-charcoal-900 border border-charcoal-800/50 rounded-lg px-4 py-3 mb-4"
              onClick={() => setSummaryOpen(!summaryOpen)}
            >
              <span className="text-cream-100 text-sm font-medium">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold font-serif text-sm">{fmt(total)}</span>
                {summaryOpen ? <ChevronUp size={14} className="text-cream-200/50" /> : <ChevronDown size={14} className="text-cream-200/50" />}
              </div>
            </button>

            <div className={`space-y-4 ${summaryOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Items */}
              <div className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg p-4 space-y-3">
                <p className="text-cream-200/40 text-[10px] tracking-widest uppercase">Items</p>
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold-600 text-charcoal-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream-100 text-xs font-medium leading-snug line-clamp-2">{item.name}</p>
                      {item.subtitle && <p className="text-cream-200/40 text-[10px] mt-0.5 line-clamp-1">{item.subtitle}</p>}
                    </div>
                    <p className="text-white text-sm font-semibold font-serif flex-shrink-0">
                      {fmt(item.priceNum * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg p-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-cream-200/50">Subtotal</span>
                  <span className="text-cream-100">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream-200/50">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-400 text-xs font-medium">Free</span>
                  ) : (
                    <span className="text-cream-100">{fmt(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream-200/50">Estimated Tax (8%)</span>
                  <span className="text-cream-100">{fmt(tax)}</span>
                </div>
                <div className="border-t border-charcoal-800/50 pt-2.5 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-white font-bold font-serif text-lg">{fmt(total)}</span>
                </div>
              </div>

              {shipping === 0 && subtotal > 0 && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-700/20 rounded px-3 py-2">
                  <Truck size={13} />
                  Free shipping applied — orders over $5,000
                </div>
              )}
              {shipping > 0 && (
                <div className="flex items-center gap-2 text-xs text-cream-200/40 bg-charcoal-900/50 border border-charcoal-800/30 rounded px-3 py-2">
                  <Truck size={13} />
                  Add {fmt(5000 - subtotal)} more for free shipping
                </div>
              )}

              {/* Guarantee */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, text: 'Secure checkout' },
                  { icon: Truck, text: 'Insured delivery' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[10px] text-cream-200/40 bg-charcoal-900 border border-charcoal-800/30 rounded px-3 py-2">
                    <Icon size={12} className="text-gold-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
