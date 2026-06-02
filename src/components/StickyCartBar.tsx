import { useEffect, useState } from 'react';
import { ShoppingBag, Lock, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Props = {
  onOpen: () => void;
};

export default function StickyCartBar({ onOpen }: Props) {
  const { items, totalItems, subtotal, isOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if we're on a page where the bar should NOT appear
  const isExcludedPage = () => {
    const path = window.location.pathname;
    return (
      path.includes('/checkout') ||
      path.includes('/order-confirmation') ||
      path.includes('/thank-you')
    );
  };

  useEffect(() => {
    // Only show on mobile, when cart has items, drawer is closed, not on excluded pages, and not dismissed
    const checkVisibility = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      const hasItems = items.length > 0;
      const drawerClosed = !isOpen;
      const excluded = isExcludedPage();
      
      setIsVisible(isMobile && hasItems && drawerClosed && !excluded && !isDismissed);
    };

    checkVisibility();
    window.addEventListener('resize', checkVisibility);
    
    // Check visibility when cart changes
    const interval = setInterval(checkVisibility, 500);
    
    return () => {
      window.removeEventListener('resize', checkVisibility);
      clearInterval(interval);
    };
  }, [items.length, isOpen, isDismissed, subtotal]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal-950 border-t border-charcoal-800/60 md:hidden safe-bottom">
      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute -top-6 right-2 w-6 h-6 bg-charcoal-800 rounded-full flex items-center justify-center text-cream-200/50 hover:text-white transition-colors"
        aria-label="Dismiss cart bar"
      >
        <X size={12} />
      </button>

      <div className="px-4 py-3">
        {/* Cart summary */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-gold-400" />
            <span className="text-cream-200 text-sm">
              Your cart: <span className="text-white font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </span>
          </div>
          <span className="text-white font-bold font-serif">{fmt(subtotal)}</span>
        </div>

        {/* Checkout button */}
        <button
          onClick={onOpen}
          className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-bold text-sm py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Lock size={14} />
          Checkout Securely
        </button>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-[10px] text-cream-200/40">
            <Lock size={10} className="text-emerald-500" />
            <span>SSL Secure</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-cream-200/40">
            <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Secure payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
