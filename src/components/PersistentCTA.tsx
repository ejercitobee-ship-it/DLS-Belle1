import { Phone, MessageCircle } from 'lucide-react';
import { PHONE_NUMBER, PHONE_HREF } from '../lib/constants';

export function PersistentCTA() {
  const handleChat = () => {
    // Zoho live chat trigger
    if (typeof window !== 'undefined' && (window as any).ZOHO?.SalesIQ) {
      (window as any).ZOHO.SalesIQ.floatingwindow.visible('show');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-charcoal-900 to-charcoal-800 border-t border-gold-500/30 z-40 px-4 py-4 sm:py-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left flex-1">
          <p className="text-cream-100 text-sm sm:text-base font-medium">
            Can't find what you're looking for?
          </p>
          <p className="text-cream-200/70 text-xs sm:text-sm">
            Our specialists can custom-design your perfect humidor solution.
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <a
            href={PHONE_HREF}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-charcoal-950 rounded-lg font-semibold text-sm transition-colors flex-1 sm:flex-none"
          >
            <Phone size={16} />
            <span className="hidden xs:inline">{PHONE_NUMBER}</span>
            <span className="xs:hidden">Call Us</span>
          </a>

          <button
            onClick={handleChat}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gold-500/50 hover:border-gold-400 text-gold-400 hover:text-gold-300 rounded-lg font-semibold text-sm transition-colors flex-1 sm:flex-none"
          >
            <MessageCircle size={16} />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
