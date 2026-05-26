import { useState, useEffect, useRef } from 'react';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
  {
    label: 'Collections',
    href: '/all-collections',
    children: [
      { label: 'Cabinet Humidors', href: '/cabinet-humidors' },
      { label: 'Desktop Humidors', href: '/desktop-humidors' },
      { label: 'Electronic Humidors', href: '/electronic-humidors' },
      { label: 'Travel Humidors', href: '/travel-humidors' },
      { label: 'Accessories', href: '/accessories' },
      { label: 'Walk-In Humidors', href: '/walk-in-humidor' },
      { label: 'All Products', href: '/all-collections' },
    ],
  },
  { label: 'Walk-In Humidors', href: '/walk-in-humidor' },
  { label: 'New Arrivals', href: '/new-arrivals' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
];

export default function Navbar({ currentPage, onCartOpen }: { currentPage?: string; onCartOpen?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setCollectionsOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-gold-600 text-charcoal-950 text-center py-2 px-4 text-xs font-medium tracking-widest uppercase">
        Free Shipping on Selected Items &mdash; <a href="/all-collections" className="underline underline-offset-2 hover:opacity-70 transition-opacity">Shop the Full Collections</a>
      </div>

      <nav
        ref={navRef}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-charcoal-950/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gold-700/30'
            : 'bg-charcoal-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-24">

            {/* Logo */}
            <a
              href="/"
              className="flex items-center flex-shrink-0"
              onClick={closeMenu}
            >
              <img
                src="/Untitled_design__5_-removebg-preview.png"
                alt="Dunn's Luxury Selections"
                className="h-12 md:h-20 w-auto object-contain"
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
                            (child.href === '/electronic-humidors' && currentPage === 'electronic-humidors') ||
                            (child.href === '/walk-in-humidor' && currentPage === 'walk-in-humidor') ||
                            (child.href === '/desktop-humidors' && currentPage === 'desktop-humidors') ||
                            (child.href === '/travel-humidors' && currentPage === 'travel-humidors') ||
                            (child.href === '/accessories' && currentPage === 'accessories') ||
                            (child.href === '/cabinet-humidors' && currentPage === 'cabinet-humidors') ||
                            (child.href === '/all-collections' && currentPage === 'all-collections')
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
                      (link.href === '/new-arrivals' && currentPage === 'new-arrivals') ||
                      (link.href === '/walk-in-humidor' && currentPage === 'walk-in-humidor') ||
                      (link.href === '/journal' && currentPage === 'journal') ||
                      (link.href === '/about' && currentPage === 'about')
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
            <div className="flex items-center gap-1 md:gap-4">
              <button
                aria-label="Cart"
                onClick={onCartOpen}
                className="relative text-cream-200/60 hover:text-gold-400 transition-colors p-2.5"
              >
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center bg-gold-500 text-charcoal-950">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
              <a
                href="/all-collections"
                className="hidden md:inline-flex items-center gap-2 bg-gold-gradient text-charcoal-950 text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
              >
                Shop Now
              </a>
              <button
                className="md:hidden text-cream-200/80 p-2.5 rounded-lg hover:bg-charcoal-800 active:bg-charcoal-700 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`}>
                    <X size={22} />
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${mobileOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`}>
                    <Menu size={22} />
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — slides down below navbar */}
        <div
          className={`md:hidden border-t border-charcoal-800/40 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-charcoal-950 overflow-y-auto max-h-[80vh] px-4 py-4 space-y-1">

            {/* Collections accordion */}
            <div className="border-b border-charcoal-800/40">
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="w-full flex items-center justify-between px-2 py-4 text-cream-200/80 font-medium text-base active:bg-charcoal-900 rounded transition-colors"
              >
                Collections
                <ChevronDown
                  size={18}
                  className={`text-gold-500 transition-transform duration-200 ${collectionsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-250 ${collectionsOpen ? 'max-h-72' : 'max-h-0'}`}>
                <div className="pl-2 pb-3 space-y-0.5">
                  {navLinks[0].children!.map((child) => (
                    <a
                      key={child.label}
                      href={child.href}
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3.5 text-sm text-cream-200/60 hover:text-gold-400 active:text-gold-400 hover:bg-gold-700/10 rounded-lg transition-colors"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center px-2 py-4 text-cream-200/80 font-medium text-base border-b border-charcoal-800/40 hover:text-gold-400 active:text-gold-400 transition-colors last:border-b-0"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-4 pb-2">
              <a
                href="/all-collections"
                onClick={closeMenu}
                className="block w-full text-center bg-gold-gradient text-charcoal-950 font-bold text-sm tracking-widest uppercase px-6 py-4 rounded-lg hover:opacity-90 active:scale-95 transition-all"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        style={{ top: 0 }}
      />
    </>
  );
}
