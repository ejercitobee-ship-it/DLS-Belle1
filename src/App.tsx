import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
// Build v2 - Cache bust
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import NewArrivalsHomepageSection from './components/NewArrivalsHomepageSection';
import Bespoke from './components/Bespoke';
import DealsBanner from './components/DealsBanner';
import Testimonials from './components/Testimonials';
import WhyUs from './components/WhyUs';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import LeadPopup from './components/LeadPopup';
import StickyCartBar from './components/StickyCartBar';
import FinancingBanner from './components/FinancingBanner';
import { PersistentCTA } from './components/PersistentCTA';
import { CartProvider, useCart } from './context/CartContext';
import { usePageMeta } from './hooks/usePageMeta';

const ElectronicHumidors = lazy(() => import('./components/ElectronicHumidors'));
const WalkInHumidor = lazy(() => import('./components/WalkInHumidor'));
const DesktopHumidors = lazy(() => import('./components/DesktopHumidors'));
const TravelHumidors = lazy(() => import('./components/TravelHumidors'));
const AccessoriesPage = lazy(() => import('./components/Accessories'));
const CabinetHumidors = lazy(() => import('./components/CabinetHumidors'));
const NewArrivals = lazy(() => import('./components/NewArrivals'));
const Checkout = lazy(() => import('./components/Checkout'));
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'));
const ShopifySetup = lazy(() => import('./components/ShopifySetup'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CookiePolicy = lazy(() => import('./components/CookiePolicy'));
const DeliveryInfo = lazy(() => import('./components/DeliveryInfo'));
const ReturnsWarranty = lazy(() => import('./components/ReturnsWarranty'));
const CareGuides = lazy(() => import('./components/CareGuides'));
const About = lazy(() => import('./components/About'));
const AllCollections = lazy(() => import('./components/AllCollections'));
const Journal = lazy(() => import('./components/Journal'));
const ArticlePage = lazy(() => import('./components/ArticlePage'));
const ProductPage = lazy(() => import('./components/ProductPage'));
const Financing = lazy(() => import('./components/Financing'));

type Page =
  | 'home'
  | 'electronic-humidors'
  | 'walk-in-humidor'
  | 'desktop-humidors'
  | 'travel-humidors'
  | 'accessories'
  | 'cabinet-humidors'
  | 'new-arrivals'
  | 'checkout'
  | 'order-confirmation'
  | 'shopify-setup'
  | 'privacy-policy'
  | 'terms-of-service'
  | 'cookie-policy'
  | 'delivery-info'
  | 'returns-warranty'
  | 'care-guides'
  | 'about'
  | 'all-collections'
  | 'journal'
  | 'article'
  | 'product'
  | 'financing';

const PATH_TO_PAGE: Record<string, Page> = {
  '/': 'home',
  '/home': 'home',
  '/home/': 'home',
  '/electronic-humidors': 'electronic-humidors',
  '/electronic-humidors/': 'electronic-humidors',
  '/walk-in-humidor': 'walk-in-humidor',
  '/walk-in-humidor/': 'walk-in-humidor',
  '/desktop-humidors': 'desktop-humidors',
  '/desktop-humidors/': 'desktop-humidors',
  '/travel-humidors': 'travel-humidors',
  '/travel-humidors/': 'travel-humidors',
  '/accessories': 'accessories',
  '/accessories/': 'accessories',
  '/cabinet-humidors': 'cabinet-humidors',
  '/cabinet-humidors/': 'cabinet-humidors',
  '/new-arrivals': 'new-arrivals',
  '/new-arrivals/': 'new-arrivals',
  '/shopify-setup': 'shopify-setup',
  '/shopify-setup/': 'shopify-setup',
  '/privacy-policy': 'privacy-policy',
  '/privacy-policy/': 'privacy-policy',
  '/terms-of-service': 'terms-of-service',
  '/terms-of-service/': 'terms-of-service',
  '/cookie-policy': 'cookie-policy',
  '/cookie-policy/': 'cookie-policy',
  '/delivery-info': 'delivery-info',
  '/delivery-info/': 'delivery-info',
  '/returns-warranty': 'returns-warranty',
  '/returns-warranty/': 'returns-warranty',
  '/care-guides': 'care-guides',
  '/care-guides/': 'care-guides',
  '/about': 'about',
  '/about/': 'about',
  '/all-collections': 'all-collections',
  '/all-collections/': 'all-collections',
  '/collections': 'all-collections',
  '/collections/': 'all-collections',
  '/journal': 'journal',
  '/journal/': 'journal',
  '/financing': 'financing',
  '/financing/': 'financing',
  '/checkout': 'checkout',
  '/checkout/': 'checkout',
  '/order-confirmation': 'order-confirmation',
  '/order-confirmation/': 'order-confirmation',
};

// Also support legacy hash-based URLs for backwards compatibility
const HASH_TO_PAGE: Record<string, Page> = {
  '#electronic-humidors': 'electronic-humidors',
  '#electronic': 'electronic-humidors',
  '#walk-in-humidor': 'walk-in-humidor',
  '#walk-in': 'walk-in-humidor',
  '#desktop-humidors': 'desktop-humidors',
  '#desktop': 'desktop-humidors',
  '#travel-humidors': 'travel-humidors',
  '#travel': 'travel-humidors',
  '#accessories': 'accessories',
  '#cabinet-humidors': 'cabinet-humidors',
  '#new-arrivals': 'new-arrivals',
  '#shopify-setup': 'shopify-setup',
  '#privacy-policy': 'privacy-policy',
  '#terms-of-service': 'terms-of-service',
  '#cookie-policy': 'cookie-policy',
  '#delivery-info': 'delivery-info',
  '#returns-warranty': 'returns-warranty',
  '#care-guides': 'care-guides',
  '#about': 'about',
  '#all-collections': 'all-collections',
  '#journal': 'journal',
};

function getInitialPage(): Page {
  const rawPath = window.location.pathname;
  const path = rawPath.replace(/\/$/, '') || '/'; // Remove trailing slash
  const hash = window.location.hash;

  // Path-based routing (preferred)
  if (path.startsWith('/article/')) return 'article';
  if (path.startsWith('/product/')) return 'product';
  if (PATH_TO_PAGE[path]) return PATH_TO_PAGE[path];

  // Legacy hash-based routing fallback
  if (hash.startsWith('#article/')) return 'article';
  if (HASH_TO_PAGE[hash]) return HASH_TO_PAGE[hash];

  return 'home';
}

function getArticleHandles(): { blogHandle: string; articleHandle: string } {
  const path = window.location.pathname;
  if (path.startsWith('/article/')) {
    const parts = path.slice('/article/'.length).split('/');
    return { blogHandle: parts[0] ?? '', articleHandle: parts[1] ?? '' };
  }
  // Legacy hash fallback
  const hash = window.location.hash;
  if (hash.startsWith('#article/')) {
    const parts = hash.slice('#article/'.length).split('/');
    return { blogHandle: parts[0] ?? '', articleHandle: parts[1] ?? '' };
  }
  return { blogHandle: '', articleHandle: '' };
}

function getProductHandle(): string {
  const path = window.location.pathname;
  if (path.startsWith('/product/')) {
    return path.slice('/product/'.length);
  }
  return '';
}

function PageContent({ page }: { page: Page }) {
  const isFullPageOverlay = page === 'checkout' || page === 'shopify-setup' || page === 'order-confirmation';
  const { openCart } = useCart();

  const navigate = (next: Page) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: next }));
  };

  if (isFullPageOverlay) {
    if (page === 'checkout') return <Suspense fallback={null}><Checkout onBack={() => navigate('home')} /></Suspense>;
    if (page === 'order-confirmation') return <Suspense fallback={null}><OrderConfirmation /></Suspense>;
    return <Suspense fallback={null}><ShopifySetup onBack={() => navigate('home')} /></Suspense>;
  }

  if (page === 'electronic-humidors') return <ElectronicHumidors />;
  if (page === 'walk-in-humidor') return <WalkInHumidor />;
  if (page === 'desktop-humidors') return <DesktopHumidors />;
  if (page === 'travel-humidors') return <TravelHumidors />;
  if (page === 'accessories') return <AccessoriesPage />;
  if (page === 'cabinet-humidors') return <CabinetHumidors />;
  if (page === 'new-arrivals') return <NewArrivals />;
  if (page === 'privacy-policy') return <PrivacyPolicy />;
  if (page === 'terms-of-service') return <TermsOfService />;
  if (page === 'cookie-policy') return <CookiePolicy />;
  if (page === 'delivery-info') return <DeliveryInfo />;
  if (page === 'returns-warranty') return <ReturnsWarranty />;
  if (page === 'care-guides') return <CareGuides />;
  if (page === 'about') return <About />;
  if (page === 'all-collections') return <AllCollections />;
  if (page === 'journal') return <Journal />;
  if (page === 'financing') return <Financing />;
  if (page === 'article') {
    const { blogHandle, articleHandle } = getArticleHandles();
    return <ArticlePage blogHandle={blogHandle} articleHandle={articleHandle} />;
  }
  if (page === 'product') {
    const handle = getProductHandle();
    return <ProductPage handle={handle} />;
  }

  // Home
  void openCart;
  return (
    <>
      <Hero />
      <FinancingBanner />
      <Collections />
      <NewArrivalsHomepageSection />
      <Bespoke />
      <DealsBanner />
      <Testimonials />
      <WhyUs />
      <Newsletter />
    </>
  );
}

function AppInner() {
  // Compute initial page synchronously to avoid hydration mismatch
  const [page, setPage] = useState<Page>(() => getInitialPage());
  const [transitioning, setTransitioning] = useState(false);
  const [displayPage, setDisplayPage] = useState<Page>(() => getInitialPage());
  const [showPopup, setShowPopup] = useState(false);
  const [popupMinimized, setPopupMinimized] = useState(false);
  const pendingPage = useRef<Page | null>(null);
  const { openCart } = useCart();

  // Seed the initial history state so back button works from first navigation
  useEffect(() => {
    const initialPage = getInitialPage();
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState({ page: initialPage }, '', window.location.href);
    }
  }, []);

  // Dynamic meta tags based on current page
  usePageMeta(
    displayPage === 'home'
      ? {
          title: "Dunn's Luxury Selections | Humidor Collections",
          description:
            "Explore Dunn's Luxury Selections — bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.",
          canonicalPath: '/',
        }
      : displayPage === 'electronic-humidors'
      ? {
          title: 'Electronic Humidors | Dunn\'s Luxury Selections',
          description:
            'Precision climate-controlled cabinets for discerning collectors and luxury venues. Shop Raching, Reagan, and more.',
          canonicalPath: '/electronic-humidors',
        }
      : displayPage === 'walk-in-humidor'
      ? {
          title: 'Bespoke Walk-In Humidors | Dunn\'s Luxury Selections',
          description:
            'Custom walk-in humidor design with nationwide component shipping for private residences, lounges, and commercial spaces — complete installation guidance included.',
          canonicalPath: '/walk-in-humidors',
        }
      : displayPage === 'desktop-humidors'
      ? {
          title: 'Desktop Humidors | Dunn\'s Luxury Selections',
          description:
            'Elegant desktop humidors crafted from Spanish cedar, leather, and carbon fiber for the discerning aficionado.',
          canonicalPath: '/desktop-humidors',
        }
      : displayPage === 'travel-humidors'
      ? {
          title: 'Travel Humidors | Dunn\'s Luxury Selections',
          description:
            'Portable travel humidors and cigar cases designed for protection and style on the move.',
          canonicalPath: '/travel-humidors',
        }
      : displayPage === 'accessories'
      ? {
          title: 'Cigar Accessories | Dunn\'s Luxury Selections',
          description:
            'Premium cigar cutters, lighters, ashtrays, hygrometers, and humidification accessories.',
          canonicalPath: '/accessories',
        }
      : displayPage === 'cabinet-humidors'
      ? {
          title: 'Cabinet Humidors | Dunn\'s Luxury Selections',
          description:
            'Furniture-grade cabinet humidors combining timeless craftsmanship with precision climate control.',
          canonicalPath: '/cabinet-humidors',
        }
      : displayPage === 'new-arrivals'
      ? {
          title: 'New Arrivals | Dunn\'s Luxury Selections',
          description:
            'Discover the latest luxury humidors and cigar accessories newly added to our collection.',
          canonicalPath: '/new-arrivals',
        }
      : displayPage === 'all-collections'
      ? {
          title: 'All Collections | Dunn\'s Luxury Selections',
          description:
            'Browse our complete collection of luxury humidors, accessories, and bespoke cigar storage solutions.',
          canonicalPath: '/collections',
        }
      : displayPage === 'about'
      ? {
          title: 'About Us | Dunn\'s Luxury Selections',
          description:
            'America\'s premier destination for luxury cigar humidors. Precision, prestige, and presence.',
          canonicalPath: '/about',
        }
      : displayPage === 'journal'
      ? {
          title: 'Journal | Dunn\'s Luxury Selections',
          description:
            'Expert guides, care tips, and stories from the world of luxury cigar storage.',
          canonicalPath: '/journal',
        }
      : displayPage === 'financing'
      ? {
          title: 'Financing | Dunn\'s Luxury Selections',
          description:
            'Finance your luxury humidor with Shop Pay Installments — 0% interest for qualified buyers, 4 monthly payments on qualifying purchases over $1,500.',
          canonicalPath: '/financing',
        }
      : displayPage === 'article'
      ? {
          title: 'Article | Dunn\'s Luxury Selections',
          description: 'Read our latest insights on luxury humidors and cigar culture.',
          canonicalPath: '/journal',
        }
      : displayPage === 'product'
      ? {
          title: 'Product | Dunn\'s Luxury Selections',
          description: 'View product details, specifications, and pricing.',
          canonicalPath: '/collections',
        }
      : displayPage === 'privacy-policy'
      ? {
          title: 'Privacy Policy | Dunn\'s Luxury Selections',
          description: 'Our privacy policy outlines how we protect your personal information.',
          canonicalPath: '/privacy-policy',
        }
      : displayPage === 'terms-of-service'
      ? {
          title: 'Terms of Service | Dunn\'s Luxury Selections',
          description: 'Terms and conditions for using Dunn\'s Luxury Selections website and services.',
          canonicalPath: '/terms-of-service',
        }
      : displayPage === 'cookie-policy'
      ? {
          title: 'Cookie Policy | Dunn\'s Luxury Selections',
          description: 'Information about how we use cookies on our website.',
          canonicalPath: '/cookie-policy',
        }
      : displayPage === 'delivery-info'
      ? {
          title: 'Delivery Information | Dunn\'s Luxury Selections',
          description: 'Shipping, delivery times, and tracking information for your orders.',
          canonicalPath: '/delivery-info',
        }
      : displayPage === 'returns-warranty'
      ? {
          title: 'Returns \u0026 Warranty | Dunn\'s Luxury Selections',
          description: 'Our returns policy and warranty coverage for luxury humidors and accessories.',
          canonicalPath: '/returns-warranty',
        }
      : displayPage === 'care-guides'
      ? {
          title: 'Care Guides | Dunn\'s Luxury Selections',
          description: 'Expert guidance on maintaining and caring for your luxury humidor.',
          canonicalPath: '/care-guides',
        }
      : displayPage === 'checkout'
      ? {
          title: 'Checkout | Dunn\'s Luxury Selections',
          description: 'Complete your purchase securely.',
          canonicalPath: '/checkout',
        }
      : displayPage === 'shopify-setup'
      ? {
          title: 'Shopify Setup | Dunn\'s Luxury Selections',
          description: 'Shopify store configuration and setup guide.',
          canonicalPath: '/shopify-setup',
        }
      : {
          title: "Dunn's Luxury Selections | Humidor Collections",
          description:
            "Explore Dunn's Luxury Selections — bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.",
          canonicalPath: '/',
        }
  );

  const navigate = useCallback((next: Page, articlePath?: string) => {
    if (next === displayPage && next !== 'article') return;
    pendingPage.current = next;
    setTransitioning(true);
    setTimeout(() => {
      const target = pendingPage.current!;
      setPage(target);
      setDisplayPage(target);
      if (target === 'article' && articlePath) {
        window.history.pushState({ page: target, articlePath }, '', `/article/${articlePath}`);
      } else {
        const url = target === 'home' ? '/' : `/${target}`;
        window.history.pushState({ page: target }, '', url);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTransitioning(false);
    }, 220);
  }, [displayPage]);

  useEffect(() => {
    let isFirstPopState = true;
    
    const onPopState = () => {
      // Skip the first popstate event which fires on initial page load in some browsers
      if (isFirstPopState) {
        isFirstPopState = false;
        return;
      }
      
      const path = window.location.pathname.replace(/\/$/, '') || '/'; // Remove trailing slash
      const hash = window.location.hash;

      if (path.startsWith('/article/')) {
        const handle = path.slice('/article/'.length);
        navigate('article', handle);
        return;
      }
      if (path.startsWith('/product/')) {
        // Force re-render even if already on product page
        pendingPage.current = 'product';
        setTransitioning(true);
        setTimeout(() => {
          setPage('product');
          setDisplayPage('product');
          window.scrollTo({ top: 0, behavior: 'instant' });
          setTransitioning(false);
        }, 220);
        return;
      }
      // Legacy hash fallback
      if (hash.startsWith('#article/')) {
        const handle = hash.slice('#article/'.length);
        navigate('article', handle);
        return;
      }

      const dest = PATH_TO_PAGE[path] ?? HASH_TO_PAGE[hash];
      if (dest) {
        // Only navigate if we're actually changing pages
        if (dest !== displayPage || dest === 'article') {
          navigate(dest);
        }
      } else {
        // Unknown path — go home if not already there
        if (displayPage !== 'home') {
          navigate('home');
        }
      }
    };

    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as Page;
      navigate(detail);
    };

    const onNavigateArticle = (e: Event) => {
      const detail = (e as CustomEvent).detail as { blogHandle: string; articleHandle: string };
      navigate('article', `${detail.blogHandle}/${detail.articleHandle}`);
    };

    const onNavigateProduct = (e: Event) => {
      const detail = (e as CustomEvent).detail as { productHandle: string };
      const target = 'product';
      // Update URL FIRST before React state, so getProductHandle() reads correct pathname
      window.history.pushState({ page: target }, '', `/product/${detail.productHandle}`);
      pendingPage.current = target;
      setTransitioning(true);
      setTimeout(() => {
        setPage(target);
        setDisplayPage(target);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTransitioning(false);
      }, 220);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('navigate', onNavigate);
    window.addEventListener('navigate-article', onNavigateArticle);
    window.addEventListener('navigate-product', onNavigateProduct);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('navigate', onNavigate);
      window.removeEventListener('navigate-article', onNavigateArticle);
      window.removeEventListener('navigate-product', onNavigateProduct);
    };
  }, []);

  useEffect(() => {
    // Map both /path and legacy #hash hrefs to page navigation
    const hrefToPage: Record<string, Page> = {
      ...PATH_TO_PAGE,
      ...HASH_TO_PAGE,
    };

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      // Product links
      if (href.startsWith('/product/')) {
        e.preventDefault();
        console.log('[Router] Product link clicked:', href);
        window.history.pushState(null, '', href);
        // Force navigation even if already on product page (different product)
        pendingPage.current = 'product';
        setTransitioning(true);
        setTimeout(() => {
          setPage('product');
          setDisplayPage('product');
          window.scrollTo({ top: 0, behavior: 'instant' });
          setTransitioning(false);
        }, 220);
        return;
      }

      // Article links
      if (href.startsWith('/article/')) {
        e.preventDefault();
        const handle = href.slice('/article/'.length);
        navigate('article', handle);
        return;
      }
      if (href.startsWith('#article/')) {
        e.preventDefault();
        const handle = href.slice('#article/'.length);
        navigate('article', handle);
        return;
      }

      const dest = hrefToPage[href];
      if (dest) {
        e.preventDefault();
        navigate(dest);
        return;
      }
      if (href === '#' || href === '/' || href === '#home' || href === '/home') {
        if (page !== 'home') {
          e.preventDefault();
          navigate('home');
        }
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [page, navigate]);

  // Lead popup — show on first visit after 3 seconds, then hide for 30 days
  const [popupMounted, setPopupMounted] = useState(false);
  useEffect(() => {
    const closedAt = localStorage.getItem('leadPopupClosed');
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    if (closedAt && Date.now() - parseInt(closedAt, 10) < thirtyDays) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
      setPopupMinimized(false);
      setPopupMounted(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isFullPageOverlay = displayPage === 'checkout' || displayPage === 'shopify-setup' || displayPage === 'order-confirmation';

  return (
    <div className="min-h-screen bg-charcoal-950">
      {!isFullPageOverlay && (
        <header>
          <Navbar currentPage={displayPage} onCartOpen={openCart} />
        </header>
      )}

      <main
        className="transition-opacity duration-220 pb-24"
        style={{ opacity: transitioning ? 0 : 1, transitionDuration: '220ms' }}
      >
        <Suspense fallback={<div className="min-h-screen bg-charcoal-950" />}>
          <PageContent page={displayPage} />
        </Suspense>
      </main>

      {!isFullPageOverlay && (
        <footer>
          <Footer />
        </footer>
      )}

      {/* Persistent CTA for consultations */}
      {!isFullPageOverlay && <PersistentCTA />}

      <CartDrawer onCheckout={() => navigate('checkout')} />

      {/* Sticky mobile checkout bar — shows when cart has items and drawer is closed */}
      {!isFullPageOverlay && <StickyCartBar onOpen={openCart} />}

      {popupMounted && (showPopup || popupMinimized) && (
        <LeadPopup
          onClose={() => {
            setShowPopup(false);
            setPopupMinimized(false);
            localStorage.setItem('leadPopupClosed', Date.now().toString());
          }}
          onMinimize={() => {
            setShowPopup(false);
            setPopupMinimized(true);
          }}
          isMinimized={popupMinimized}
          onRestore={() => {
            setShowPopup(true);
            setPopupMinimized(false);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </CartProvider>
  );
}
