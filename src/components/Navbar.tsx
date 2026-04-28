import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  {
    label: 'Collections',
    href: '#collections',
    children: [
      { label: 'Cabinet Humidors', href: '#cabinet-humidors' },
      { label: 'Desktop Humidors', href: '#desktop' },
      { label: 'Electronic Humidors', href: '#electronic' },
      { label: 'Travel Humidors', href: '#travel' },
      { label: 'Accessories', href: '#accessories' },
      { label: 'Walk-In Humidors', href: '#walk-in' },
    ],
  },
  { label: 'Walk-In Humidors', href: '#walk-in' },
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'About', href: '#about' },
];

export default function Navbar({ currentPage, onCartOpen }: { currentPage?: string; onCartOpen?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gold-600 text-charcoal-950 text-center py-2 px-4 text-xs font-medium tracking-widest uppercase">
        Free Shipping on Selected Items &mdash; Limited Time Only
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-charcoal-950/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gold-700/30'
            : 'bg-charcoal-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-28">
            {/* Logo */}
            <a href={currentPage && currentPage !== 'home' ? '/' : '#'} className="flex items-center">
              <img
                src="/Untitled_design__5_-removebg-preview.png"
                alt="Dunn's Luxury Selections"
                className="h-16 md:h-24 w-auto object-contain"
              />
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 text-sm tracking-wide text-cream-200/80 hover:text-gold-400 transition-colors font-medium py-2">
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-52 bg-charcoal-900 border border-gold-700/30 rounded shadow-xl shadow-black/50 transition-all duration-200 ${
                        activeDropdown === link.label ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      {link.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm hover:text-gold-400 hover:bg-gold-700/10 transition-colors first:rounded-t last:rounded-b ${
                            (child.href === '#electronic' && currentPage === 'electronic-humidors') ||
                            (child.href === '#walk-in' && currentPage === 'walk-in-humidor') ||
                            (child.href === '#desktop' && currentPage === 'desktop-humidors') ||
                            (child.href === '#travel' && currentPage === 'travel-humidors') ||
                            (child.href === '#accessories' && currentPage === 'accessories') ||
                            (child.href === '#cabinet-humidors' && currentPage === 'cabinet-humidors')
                              ? 'text-gold-400 bg-gold-700/10'
                              : 'text-cream-200/70'
                          }`}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-sm tracking-wide hover:text-gold-400 transition-colors font-medium ${
                      (link.href === '#new-arrivals' && currentPage === 'new-arrivals') ||
                      (link.href === '#walk-in' && currentPage === 'walk-in-humidor')
                        ? 'text-gold-400'
                        : 'text-cream-200/80'
                    }`}
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                aria-label="Search"
                className="text-cream-200/60 hover:text-gold-400 transition-colors p-1"
              >
                <Search size={18} />
              </button>
              <button
                aria-label="Cart"
                onClick={onCartOpen}
                className="relative text-cream-200/60 hover:text-gold-400 transition-colors p-1"
              >
                <ShoppingBag size={18} />
                <span className={`absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors ${totalItems > 0 ? 'bg-gold-500 text-charcoal-950' : 'bg-charcoal-700 text-charcoal-400'}`}>
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              </button>
              <a
                href="#collections"
                className="hidden md:inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
              >
                Shop Now
              </a>
              <button
                className="md:hidden text-cream-200/80 p-1"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-screen border-t border-gold-700/20' : 'max-h-0'
          }`}
        >
          <div className="bg-charcoal-950 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <a
                  href={link.href}
                  className="block py-2.5 text-sm text-cream-200/80 hover:text-gold-400 transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
                {link.children && (
                  <div className="pl-4 space-y-1">
                    {link.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block py-1.5 text-xs text-cream-200/50 hover:text-gold-400 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3">
              <a
                href="#collections"
                className="block text-center bg-gold-gradient text-charcoal-950 text-xs font-semibold tracking-widest uppercase px-5 py-3 rounded"
                onClick={() => setMobileOpen(false)}
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
