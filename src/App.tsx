import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import ElectronicHumidorsSection from './components/ElectronicHumidorsSection';
import Bespoke from './components/Bespoke';
import DealsBanner from './components/DealsBanner';
import Testimonials from './components/Testimonials';
import WhyUs from './components/WhyUs';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider, useCart } from './context/CartContext';

const ElectronicHumidors = lazy(() => import('./components/ElectronicHumidors'));
const WalkInHumidor = lazy(() => import('./components/WalkInHumidor'));
const DesktopHumidors = lazy(() => import('./components/DesktopHumidors'));
const TravelHumidors = lazy(() => import('./components/TravelHumidors'));
const AccessoriesPage = lazy(() => import('./components/Accessories'));
const CabinetHumidors = lazy(() => import('./components/CabinetHumidors'));
const NewArrivals = lazy(() => import('./components/NewArrivals'));
const Checkout = lazy(() => import('./components/Checkout'));
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
  | 'article';

const PATH_TO_PAGE: Record<string, Page> = {
  '/electronic-humidors': 'electronic-humidors',
  '/walk-in-humidor': 'walk-in-humidor',
  '/desktop-humidors': 'desktop-humidors',
  '/travel-humidors': 'travel-humidors',
  '/accessories': 'accessories',
  '/cabinet-humidors': 'cabinet-humidors',
  '/new-arrivals': 'new-arrivals',
  '/shopify-setup': 'shopify-setup',
  '/privacy-policy': 'privacy-policy',
  '/terms-of-service': 'terms-of-service',
  '/cookie-policy': 'cookie-policy',
  '/delivery-info': 'delivery-info',
  '/returns-warranty': 'returns-warranty',
  '/care-guides': 'care-guides',
  '/about': 'about',
  '/all-collections': 'all-collections',
  '/journal': 'journal',
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
  const path = window.location.pathname;
  const hash = window.location.hash;

  // Path-based routing (preferred)
  if (path.startsWith('/article/')) return 'article';
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

function PageContent({ page }: { page: Page }) {
  const isFullPageOverlay = page === 'checkout' || page === 'shopify-setup';
  const { openCart } = useCart();

  const navigate = (next: Page) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: next }));
  };

  if (isFullPageOverlay) {
    if (page === 'checkout') return <Suspense fallback={null}><Checkout onBack={() => navigate('home')} /></Suspense>;
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
  if (page === 'article') {
    const { blogHandle, articleHandle } = getArticleHandles();
    return <ArticlePage blogHandle={blogHandle} articleHandle={articleHandle} />;
  }

  // Home
  void openCart;
  return (
    <>
      <Hero />
      <Collections />
      <ElectronicHumidorsSection />
      <Bespoke />
      <DealsBanner />
      <Testimonials />
      <WhyUs />
      <Newsletter />
    </>
  );
}

function AppInner() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [transitioning, setTransitioning] = useState(false);
  const [displayPage, setDisplayPage] = useState<Page>(getInitialPage);
  const pendingPage = useRef<Page | null>(null);
  const { openCart } = useCart();

  const navigate = (next: Page, articlePath?: string) => {
    if (next === displayPage && next !== 'article') return;
    pendingPage.current = next;
    setTransitioning(true);
    setTimeout(() => {
      const target = pendingPage.current!;
      setPage(target);
      setDisplayPage(target);
      if (target === 'article' && articlePath) {
        window.history.pushState(null, '', `/article/${articlePath}`);
      } else {
        window.history.pushState(null, '', target === 'home' ? '/' : `/${target}`);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTransitioning(false);
    }, 220);
  };

  useEffect(() => {
    const onPopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/article/')) {
        const handle = path.slice('/article/'.length);
        navigate('article', handle);
        return;
      }
      // Legacy hash fallback
      if (hash.startsWith('#article/')) {
        const handle = hash.slice('#article/'.length);
        navigate('article', handle);
        return;
      }

      const dest = PATH_TO_PAGE[path] ?? HASH_TO_PAGE[hash];
      if (dest) navigate(dest);
      else navigate('home');
    };

    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as Page;
      navigate(detail);
    };

    const onNavigateArticle = (e: Event) => {
      const detail = (e as CustomEvent).detail as { blogHandle: string; articleHandle: string };
      navigate('article', `${detail.blogHandle}/${detail.articleHandle}`);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('navigate', onNavigate);
    window.addEventListener('navigate-article', onNavigateArticle);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('navigate', onNavigate);
      window.removeEventListener('navigate-article', onNavigateArticle);
    };
  }, [displayPage]);

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
  }, [page]);

  const isFullPageOverlay = displayPage === 'checkout' || displayPage === 'shopify-setup';

  return (
    <div className="min-h-screen bg-charcoal-950">
      {!isFullPageOverlay && (
        <Navbar currentPage={displayPage} onCartOpen={openCart} />
      )}

      <div
        className="transition-opacity duration-220"
        style={{ opacity: transitioning ? 0 : 1, transitionDuration: '220ms' }}
      >
        <Suspense fallback={<div className="min-h-screen bg-charcoal-950" />}>
          <PageContent page={displayPage} />
        </Suspense>
      </div>

      {!isFullPageOverlay && <Footer />}

      <CartDrawer onCheckout={() => navigate('checkout')} />
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
