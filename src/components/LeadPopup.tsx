import { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface LeadPopupProps {
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  onRestore?: () => void;
}

export default function LeadPopup({ onClose, onMinimize, isMinimized, onRestore }: LeadPopupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    if (status === 'success') {
      onClose();
      return;
    }
    // If form has data and user hasn't submitted, minimize instead of closing
    if ((name || email || phone)) {
      onMinimize?.();
      return;
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json().catch(() => ({ error: 'Network error' }));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  // Minimized floating button
  if (isMinimized) {
    return (
      <button
        onClick={onRestore}
        className="fixed bottom-6 right-6 z-[100] bg-amber-600 hover:bg-amber-500 text-white rounded-full p-3 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:scale-110 animate-bounce"
        aria-label="Open lead form"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative bg-charcoal-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">Thank You!</h3>
            <p className="text-white/70 text-sm">
              Your information has been received. Our team will reach out to you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <h3 className="text-xl font-serif text-white mb-1">Unlock Exclusive Access</h3>
              <p className="text-white/60 text-sm">
                Join our inner circle for early access to rare collections and private events.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-charcoal-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-charcoal-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-charcoal-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Get Exclusive Access
                  </>
                )}
              </button>
            </form>

            <p className="text-white/40 text-xs text-center mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
