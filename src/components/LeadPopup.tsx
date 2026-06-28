import { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';

interface LeadPopupProps {
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  onRestore?: () => void;
}

// Storage keys for session tracking
const STORAGE_KEYS = {
  seen: 'leadPopupSeen',
  skipped: 'leadPopupSkipped',
  converted: 'leadPopupConverted',
};

export default function LeadPopup({ onClose, onMinimize, isMinimized, onRestore }: LeadPopupProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collectorType, setCollectorType] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldShow, setShouldShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mouseYRef = useRef<number>(0);

  // Check session storage on mount
  useEffect(() => {
    const hasSeen = sessionStorage.getItem(STORAGE_KEYS.seen);
    const hasSkipped = sessionStorage.getItem(STORAGE_KEYS.skipped);
    const hasConverted = sessionStorage.getItem(STORAGE_KEYS.converted);
    
    // Don't show if already interacted with
    if (hasSeen || hasSkipped || hasConverted) {
      return;
    }

    // 45 second delay timer
    const delayTimer = setTimeout(() => {
      setShouldShow(true);
      sessionStorage.setItem(STORAGE_KEYS.seen, 'true');
    }, 45000);

    // Exit intent detection (mouse leaving viewport from top)
    const handleMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
      // Trigger if mouse moves to top of viewport
      if (e.clientY <= 5) {
        clearTimeout(delayTimer);
        setShouldShow(true);
        sessionStorage.setItem(STORAGE_KEYS.seen, 'true');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('scroll', handleScroll);
      }
    };

    // Scroll trigger for mobile (popup appears after scrolling 300px down)
    const handleScroll = () => {
      if (window.scrollY > 300) {
        clearTimeout(delayTimer);
        setShouldShow(true);
        sessionStorage.setItem(STORAGE_KEYS.seen, 'true');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('scroll', handleScroll);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(delayTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (shouldShow && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldShow, step]);

  const handleSkip = () => {
    sessionStorage.setItem(STORAGE_KEYS.skipped, 'true');
    onClose();
  };

  const handleClose = () => {
    if (status === 'success') {
      onClose();
      return;
    }
    // If form has data entered, minimize to bubble instead of closing
    if (firstName.trim() || email.trim() || phone.trim()) {
      onMinimize?.();
      return;
    }
    // Form is empty — fully close
    onClose();
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;
    // Store email for cart abandonment
    sessionStorage.setItem('leadPopupEmail', email.trim());
    sessionStorage.setItem('leadPopupFirstName', firstName.trim());
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: '', // No longer collecting last name
          email: email.trim(),
          phone: phone.trim() || '', // Phone is optional
          collectorType: collectorType, // Collector segmentation
        }),
      });

      const data = await response.json().catch(() => ({ error: 'Network error' }));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      sessionStorage.setItem(STORAGE_KEYS.converted, 'true');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  // Don't render if shouldn't show yet
  if (!shouldShow) {
    return null;
  }

  // Minimized floating chat bubble
  if (isMinimized) {
    return (
      <button
        onClick={onRestore}
        className="fixed bottom-6 right-6 z-[100] group"
        aria-label="Open lead form"
      >
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-charcoal-900 border border-gold-500/30 text-cream-100 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          Get Exclusive Access
          <div className="absolute top-full right-4 -mt-px border-4 border-transparent border-t-gold-500/30" />
        </div>
        {/* Bubble */}
        <div className="relative bg-gold-600 hover:bg-gold-500 text-charcoal-950 rounded-full p-4 shadow-xl shadow-gold-900/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-gold-900/50">
          <MessageCircle className="w-6 h-6" />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative bg-charcoal-900 border border-charcoal-700/60 rounded-2xl shadow-2xl shadow-black/50 max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 text-cream-200/50 hover:text-cream-100 transition-colors p-1 rounded-md hover:bg-charcoal-800/50"
          aria-label="Close"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle className="w-14 h-14 text-gold-400 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-white mb-2">Thank You!</h3>
            <p className="text-cream-200/70 text-sm">
              Your information has been received. Our team will reach out to you shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-gold-600 hover:bg-gold-500 text-charcoal-950 px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <h3 className="text-xl font-serif text-white mb-1">Collection Preview Access</h3>
              <p className="text-cream-200/60 text-sm">
                Every collector's needs are different. Help us recommend the right pieces for yours.
              </p>
            </div>

            {step === 1 ? (
              // Step 1: First Name + Email
              <form onSubmit={handleNextStep} className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-2.5 text-cream-100 placeholder-cream-200/30 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-2.5 text-cream-100 placeholder-cream-200/30 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                />

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gold-600 hover:bg-gold-500 text-charcoal-950 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full text-cream-200/50 hover:text-cream-200 text-sm py-2 transition-colors"
                >
                  Skip for now
                </button>
              </form>
            ) : step === 2 ? (
              // Step 2: Collector Type
              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-3">
                <div className="bg-charcoal-800/50 rounded-lg px-4 py-3 text-sm">
                  <p className="text-cream-200/60">
                    <span className="text-cream-100 font-medium">{firstName}</span> · {email}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-cream-200/70 text-sm font-medium">What draws you to humidors?</p>
                  <div className="space-y-2">
                    {[
                      { value: 'desktop', label: 'Desktop Collection' },
                      { value: 'cabinet', label: 'Cabinet Installation' },
                      { value: 'walkin', label: 'Walk-in Sanctuary' },
                      { value: 'travel', label: 'Travel Preservation' },
                      { value: 'investment', label: 'Investment Pieces' },
                      { value: 'other', label: 'Something Else' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg hover:bg-charcoal-800/50 transition-colors">
                        <input
                          type="radio"
                          name="collectorType"
                          value={option.value}
                          checked={collectorType === option.value}
                          onChange={(e) => setCollectorType(e.target.value)}
                          className="w-4 h-4 accent-gold-500"
                        />
                        <span className="text-cream-100 text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!collectorType}
                  className="w-full bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal-950 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-cream-200/50 hover:text-cream-200 text-sm py-2 transition-colors"
                >
                  Back
                </button>
              </form>
            ) : (
              // Step 3: Phone (optional) + Submit
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="bg-charcoal-800/50 rounded-lg px-4 py-3 text-sm space-y-1">
                  <p className="text-cream-200/60">
                    <span className="text-cream-100 font-medium">{firstName}</span> · {email}
                  </p>
                  <p className="text-cream-200/40 text-xs">
                    {collectorType && `Interested in: ${(['desktop', 'cabinet', 'walkin', 'travel', 'investment', 'other'].includes(collectorType) ? {
                      desktop: 'Desktop Collection',
                      cabinet: 'Cabinet Installation',
                      walkin: 'Walk-in Sanctuary',
                      travel: 'Travel Preservation',
                      investment: 'Investment Pieces',
                      other: 'Bespoke Solutions'
                    }[collectorType] : '')}`}
                  </p>
                </div>

                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-charcoal-950 border border-charcoal-700/60 rounded-lg px-4 py-2.5 text-cream-100 placeholder-cream-200/30 text-sm focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                />
                <p className="text-cream-200/40 text-xs px-1">
                  Add your phone to discuss your collection goals (optional)
                </p>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gold-600 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal-950 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Request Preview Access
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full text-cream-200/50 hover:text-cream-200 text-sm py-2 transition-colors"
                >
                  Back
                </button>
              </form>
            )}

            <p className="text-cream-200/30 text-xs text-center mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
