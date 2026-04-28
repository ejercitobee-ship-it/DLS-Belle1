import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandBar from './components/BrandBar';
import Collections from './components/Collections';
import FeaturedProducts from './components/FeaturedProducts';
import Bespoke from './components/Bespoke';
import DealsBanner from './components/DealsBanner';
import Testimonials from './components/Testimonials';
import WhyUs from './components/WhyUs';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ElectronicHumidors from './components/ElectronicHumidors';
import WalkInHumidor from './components/WalkInHumidor';
import DesktopHumidors from './components/DesktopHumidors';
import TravelHumidors from './components/TravelHumidors';
import AccessoriesPage from './components/Accessories';
import CabinetHumidors from './components/CabinetHumidors';
import NewArrivals from './components/NewArrivals';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import ShopifySetup from './components/ShopifySetup';
import { CartProvider, useCart } from './context/CartContext';

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
  | 'shopify-setup';

function getInitialPage(): Page {
  if (window.location.hash === '#electronic-humidors') return 'electronic-humidors';
  if (window.location.hash === '#walk-in-humidor') return 'walk-in-humidor';
  if (window.location.hash === '#desktop-humidors') return 'desktop-humidors';
  if (window.location.hash === '#travel-humidors') return 'travel-humidors';
  if (window.location.hash === '#accessories') return 'accessories';
  if (window.location.hash === '#cabinet-humidors') return 'cabinet-humidors';
  if (window.location.hash === '#new-arrivals') return 'new-arrivals';
  if (window.location.hash === '#shopify-setup') return 'shopify-setup';
  return 'home';
}

function AppInner() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const { openCart } = useCart();

  const navigate = (next: Page) => {
    setPage(next);
    window.history.pushState(null, '', next === 'home' ? '/' : `#${next}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onHashChange = () => {
      const map: Record<string, Page> = {
        '#electronic-humidors': 'electronic-humidors',
        '#walk-in-humidor': 'walk-in-humidor',
        '#desktop-humidors': 'desktop-humidors',
        '#travel-humidors': 'travel-humidors',
        '#accessories': 'accessories',
        '#cabinet-humidors': 'cabinet-humidors',
        '#new-arrivals': 'new-arrivals',
        '#shopify-setup': 'shopify-setup',
      };
      const next = map[window.location.hash];
      if (next) { setPage(next); window.scrollTo(0, 0); }
      else if (window.location.hash === '#home' || window.location.hash === '') setPage('home');
    };

    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail as Page;
      navigate(detail);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('navigate', onNavigate);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('navigate', onNavigate);
    };
  }, []);

  useEffect(() => {
    const hrefToPage: Record<string, Page> = {
      '#electronic': 'electronic-humidors',
      '#electronic-humidors': 'electronic-humidors',
      '#walk-in': 'walk-in-humidor',
      '#walk-in-humidor': 'walk-in-humidor',
      '#desktop': 'desktop-humidors',
      '#desktop-humidors': 'desktop-humidors',
      '#travel': 'travel-humidors',
      '#travel-humidors': 'travel-humidors',
      '#accessories': 'accessories',
      '#cabinet-humidors': 'cabinet-humidors',
      '#new-arrivals': 'new-arrivals',
      '#shopify-setup': 'shopify-setup',
    };

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      const dest = hrefToPage[href];
      if (dest) {
        e.preventDefault();
        navigate(dest);
        return;
      }
      if (href === '#' || href === '/' || href === '#home') {
        if (page !== 'home') {
          e.preventDefault();
          navigate('home');
        }
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [page]);

  return (
    <div className="min-h-screen bg-charcoal-950">
      {page !== 'checkout' && page !== 'shopify-setup' && (
        <Navbar currentPage={page} onCartOpen={openCart} />
      )}

      {page === 'checkout' ? (
        <Checkout onBack={() => navigate('home')} />
      ) : page === 'shopify-setup' ? (
        <ShopifySetup onBack={() => navigate('home')} />
      ) : page === 'electronic-humidors' ? (
        <ElectronicHumidors />
      ) : page === 'walk-in-humidor' ? (
        <WalkInHumidor />
      ) : page === 'desktop-humidors' ? (
        <DesktopHumidors />
      ) : page === 'travel-humidors' ? (
        <TravelHumidors />
      ) : page === 'accessories' ? (
        <AccessoriesPage />
      ) : page === 'cabinet-humidors' ? (
        <CabinetHumidors />
      ) : page === 'new-arrivals' ? (
        <NewArrivals />
      ) : (
        <>
          <Hero />
          <BrandBar />
          <Collections />
          <FeaturedProducts />
          <Bespoke />
          <DealsBanner />
          <Testimonials />
          <WhyUs />
          <Newsletter />
        </>
      )}

      {page !== 'checkout' && page !== 'shopify-setup' && <Footer />}

      <CartDrawer onCheckout={() => navigate('checkout')} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
