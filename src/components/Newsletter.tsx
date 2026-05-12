import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify-customer`;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      await fetch(EDGE_FN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'newsletter',
          email,
        }),
      });
      // Always show success — don't leak whether email exists
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #211e1c 0%, #3d3634 50%, #211e1c 100%)',
      }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="/generated-1777557213922-8v5be.png"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-charcoal-950/60" />

      {/* Gold corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-gold-600/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-gold-600/30" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-full border border-gold-600/40 flex items-center justify-center mx-auto mb-6">
          <Mail size={20} className="text-gold-500" />
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
            Join the Circle
          </span>
          <div className="h-px w-8 bg-gold-500" />
        </div>

        <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
          Stay <span className="text-gradient-gold italic">Ahead</span>
        </h2>
        <p className="text-cream-200/60 text-lg mb-10 max-w-lg mx-auto">
          Be first to receive new arrivals, exclusive deals, and expert guidance
          from our team of cigar storage specialists.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 text-emerald-400">
            <CheckCircle size={20} />
            <span className="font-medium">Thank you — you're on the list.</span>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-charcoal-900/80 border border-charcoal-700 focus:border-gold-500 text-cream-100 placeholder-cream-200/30 text-sm px-4 py-3 rounded outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gold-gradient text-charcoal-950 font-semibold text-xs tracking-widest uppercase px-6 py-3 rounded hover:opacity-90 active:scale-95 transition-all whitespace-nowrap disabled:opacity-70"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
          </>
        )}

        <p className="text-cream-200/25 text-xs mt-4">
          No spam. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
