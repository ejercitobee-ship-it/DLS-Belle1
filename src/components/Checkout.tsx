import { useState } from 'react';
import {
  ArrowLeft,
  Lock,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Truck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Store,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

type Props = { onBack: () => void };

type Field = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

const INITIAL: Field = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  phone: '',
  cardName: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
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

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function Checkout({ onBack }: Props) {
  const { items, subtotal, clearCart, shopifyCheckout, isShopifyConfigured } = useCart();
  const [fields, setFields] = useState<Field>(INITIAL);
  const [errors, setErrors] = useState<Partial<Field>>({});
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [shopifyRedirecting, setShopifyRedirecting] = useState(false);

  const shipping = subtotal > 5000 ? 0 : subtotal > 0 ? 49 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const set = (key: keyof Field, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  function validateInfo() {
    const e: Partial<Field> = {};
    if (!fields.email.includes('@')) e.email = 'Valid email required';
    if (!fields.firstName.trim()) e.firstName = 'Required';
    if (!fields.lastName.trim()) e.lastName = 'Required';
    if (!fields.address.trim()) e.address = 'Required';
    if (!fields.city.trim()) e.city = 'Required';
    if (!fields.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validatePayment() {
    const e: Partial<Field> = {};
    if (!fields.cardName.trim()) e.cardName = 'Required';
    const digits = fields.cardNumber.replace(/\s/g, '');
    if (digits.length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (fields.cardExpiry.length < 5) e.cardExpiry = 'Enter MM/YY';
    if (fields.cardCvc.length < 3) e.cardCvc = 'Enter 3-digit CVC';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrder() {
    if (!validatePayment()) return;
    setLoading(true);
    try {
      const num = 'DLS-' + Date.now().toString(36).toUpperCase();
      const { error } = await supabase.from('orders').insert({
        order_number: num,
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
        status: 'pending_payment',
        payment_method: 'card',
        card_last4: fields.cardNumber.replace(/\s/g, '').slice(-4),
      });
      if (error) throw error;
      setOrderNumber(num);
      clearCart();
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h1 className="font-serif text-3xl text-white font-bold mb-2">Order Confirmed!</h1>
          <p className="text-cream-200/60 mb-6">
            Thank you for your order. We've sent a confirmation to{' '}
            <span className="text-gold-400">{fields.email}</span>.
          </p>
          <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-4 mb-8">
            <p className="text-cream-200/40 text-xs tracking-widest uppercase mb-1">Order Number</p>
            <p className="text-white font-mono font-bold text-lg">{orderNumber}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-8 text-left">
            {[
              { icon: Truck, title: 'Processing', sub: 'Your order is being prepared' },
              { icon: ShieldCheck, title: 'Insured', sub: 'Fully insured shipping' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="bg-charcoal-900 border border-charcoal-800/40 rounded p-3">
                <Icon size={16} className="text-gold-500 mb-1.5" />
                <p className="text-cream-100 text-xs font-semibold">{title}</p>
                <p className="text-cream-200/40 text-[10px] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
          <button
            onClick={onBack}
            className="w-full bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const inputCls = (field: keyof Field) =>
    `w-full bg-charcoal-900 border ${
      errors[field] ? 'border-red-500/60' : 'border-charcoal-700/50 focus:border-gold-500/60'
    } text-cream-100 text-sm rounded px-3.5 py-3 outline-none transition-colors placeholder:text-charcoal-500`;

  const handleShopifyRedirect = async () => {
    setShopifyRedirecting(true);
    const { url, fallback } = await shopifyCheckout();
    if (!fallback && url) {
      window.location.href = url;
      return;
    }
    setShopifyRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Shopify banner — shown when Shopify is configured */}
      {isShopifyConfigured && (
        <div className="bg-emerald-900/30 border-b border-emerald-700/30 px-4 py-3">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <Store size={15} className="flex-shrink-0" />
              <span>Your store is connected to Shopify. Checkout securely through your Shopify store.</span>
            </div>
            <button
              onClick={handleShopifyRedirect}
              disabled={shopifyRedirecting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded transition-colors disabled:opacity-60 flex-shrink-0"
            >
              {shopifyRedirecting ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Redirecting...</>
              ) : (
                <>Checkout on Shopify <ExternalLink size={13} /></>
              )}
            </button>
          </div>
        </div>
      )}
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

          {/* Left — Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Progress */}
            <div className="flex items-center gap-3">
              {['Contact & Shipping', 'Payment'].map((label, i) => {
                const active = (i === 0 && step === 'info') || (i === 1 && step === 'payment');
                const done = i === 0 && step === 'payment';
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                      done ? 'bg-emerald-700 text-white' : active ? 'bg-gold-gradient text-charcoal-950' : 'bg-charcoal-800 text-charcoal-500'
                    }`}>
                      {done ? <CheckCircle2 size={12} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline ${active ? 'text-white' : done ? 'text-emerald-400' : 'text-charcoal-500'}`}>
                      {label}
                    </span>
                    {i < 1 && <div className="w-8 h-px bg-charcoal-700 mx-1" />}
                  </div>
                );
              })}
            </div>

            {/* Step 1 — Contact & Shipping */}
            {step === 'info' && (
              <div className="space-y-6">
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

                <div>
                  <h2 className="font-serif text-xl text-white font-bold mb-4">Shipping Address</h2>
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
                    <div className="col-span-2">
                      <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Address *</label>
                      <input
                        placeholder="123 Main Street, Apt 4"
                        value={fields.address}
                        onChange={(e) => set('address', e.target.value)}
                        className={inputCls('address')}
                      />
                      {errors.address && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">City *</label>
                      <input
                        placeholder="New York"
                        value={fields.city}
                        onChange={(e) => set('city', e.target.value)}
                        className={inputCls('city')}
                      />
                      {errors.city && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.city}</p>}
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
                      <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">ZIP / Postal Code *</label>
                      <input
                        placeholder="10001"
                        value={fields.zip}
                        onChange={(e) => set('zip', e.target.value)}
                        className={inputCls('zip')}
                      />
                      {errors.zip && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.zip}</p>}
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

                <button
                  onClick={() => validateInfo() && setStep('payment')}
                  className="w-full bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <button
                  onClick={() => setStep('info')}
                  className="flex items-center gap-2 text-cream-200/40 hover:text-gold-400 text-xs transition-colors group mb-2"
                >
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                  Edit shipping info
                </button>

                {/* Shipping summary */}
                <div className="bg-charcoal-900 border border-charcoal-800/40 rounded-lg p-4 text-sm">
                  <p className="text-cream-200/40 text-[10px] tracking-widest uppercase mb-2">Shipping to</p>
                  <p className="text-cream-100 font-medium">{fields.firstName} {fields.lastName}</p>
                  <p className="text-cream-200/50 text-xs mt-0.5">{fields.address}, {fields.city}, {fields.state} {fields.zip}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-serif text-xl text-white font-bold">Payment</h2>
                    <div className="flex items-center gap-1 ml-auto">
                      {['visa', 'mc', 'amex', 'discover'].map((card) => (
                        <div key={card} className="w-8 h-5 bg-charcoal-800 rounded border border-charcoal-700/50 flex items-center justify-center">
                          <CreditCard size={10} className="text-charcoal-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Name on Card *</label>
                      <input
                        placeholder="John Doe"
                        value={fields.cardName}
                        onChange={(e) => set('cardName', e.target.value)}
                        className={inputCls('cardName')}
                      />
                      {errors.cardName && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.cardName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Card Number *</label>
                      <div className="relative">
                        <input
                          placeholder="1234 5678 9012 3456"
                          value={fields.cardNumber}
                          onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
                          className={inputCls('cardNumber') + ' pr-10'}
                        />
                        <CreditCard size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
                      </div>
                      {errors.cardNumber && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">Expiry Date *</label>
                        <input
                          placeholder="MM/YY"
                          value={fields.cardExpiry}
                          onChange={(e) => set('cardExpiry', formatExpiry(e.target.value))}
                          className={inputCls('cardExpiry')}
                        />
                        {errors.cardExpiry && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-xs text-cream-200/50 mb-1.5 tracking-wide">CVC *</label>
                        <input
                          placeholder="123"
                          maxLength={4}
                          value={fields.cardCvc}
                          onChange={(e) => set('cardCvc', e.target.value.replace(/\D/g, ''))}
                          className={inputCls('cardCvc')}
                        />
                        {errors.cardCvc && <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.cardCvc}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Lock, text: '256-bit SSL Encryption' },
                    { icon: ShieldCheck, text: 'Secure Payment' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 text-[10px] text-cream-200/40">
                      <Icon size={11} className="text-emerald-500" />
                      {text}
                    </div>
                  ))}
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase py-4 rounded hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-charcoal-950/30 border-t-charcoal-950 rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Place Order — {fmt(total)}
                    </>
                  )}
                </button>

                <p className="text-center text-cream-200/30 text-[10px]">
                  By placing your order you agree to our Terms of Service and Privacy Policy.
                  <br />
                  This is a demo checkout — no real charges will be made.
                </p>
              </div>
            )}
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
