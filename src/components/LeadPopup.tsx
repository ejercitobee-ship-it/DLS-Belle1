import { useState, useEffect } from 'react';
import { X, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LeadPopupProps {
  onClose: () => void;
}

export default function LeadPopup({ onClose }: LeadPopupProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Auto-close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xpwplwyl', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, source: 'dunnluxuryselections.com popup' }),
      });

      if (response.ok) {
        setStep('success');
        // Store in localStorage so we don't show again for 30 days
        localStorage.setItem('leadPopupClosed', Date.now().toString());
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem('leadPopupClosed', Date.now().toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-charcoal-900 border border-gold-700/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Decorative top bar */}
        <div className="h-1.5 bg-gold-gradient" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-charcoal-800/80 text-cream-200/60 hover:text-white hover:bg-charcoal-700 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {step === 'form' ? (
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gold-700/10 border border-gold-600/20 flex items-center justify-center">
                <Gift size={24} className="text-gold-500" />
              </div>
              <h2 className="font-serif text-2xl text-white font-bold mb-2">
                Unlock Exclusive Access
              </h2>
              <p className="text-cream-200/60 text-sm leading-relaxed">
                Join the Dunn's Luxury Selections inner circle for early access to new arrivals, private sales, and curated cigar care guides.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-name" className="block text-cream-200/50 text-xs tracking-widest uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  id="lead-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-3 text-cream-100 text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-cream-200/50 text-xs tracking-widest uppercase mb-1.5">
                  Email Address
                </label>
                <input
                  id="lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-3 text-cream-100 text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="block text-cream-200/50 text-xs tracking-widest uppercase mb-1.5">
                  Phone Number
                </label>
                <input
                  id="lead-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-3 text-cream-100 text-sm placeholder:text-cream-200/20 focus:outline-none focus:border-gold-600/50 focus:ring-1 focus:ring-gold-600/20 transition-all"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  <>
                    Get Exclusive Access <ArrowRight size={14} />
                  </>
                )}
              </button>

              <p className="text-cream-200/30 text-[10px] text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        ) : (
          /* Success state */
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-700/10 border border-emerald-600/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h2 className="font-serif text-2xl text-white font-bold mb-2">
              Welcome to the Inner Circle
            </h2>
            <p className="text-cream-200/60 text-sm leading-relaxed mb-6">
              Thank you, <span className="text-gold-400 font-medium">{name}</span>! Check your inbox for a confirmation email. You'll be the first to know about new arrivals and exclusive offers.
            </p>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 bg-charcoal-800 border border-charcoal-700/60 text-cream-100 text-sm font-medium px-6 py-3 rounded-lg hover:bg-charcoal-700 transition-colors"
            >
              Continue Shopping <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
