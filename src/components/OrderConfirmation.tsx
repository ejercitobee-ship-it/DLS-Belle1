import { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber: string;
    email: string;
    total: string;
  } | null>(null);

  useEffect(() => {
    // Get order details from URL parameters
    // Shopify returns: ?checkout=TOKEN, ?order_id=ID, or legacy ?checkout_id=ID
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutToken = urlParams.get('checkout') || urlParams.get('checkout_id');
    const orderId = urlParams.get('order_id');
    const orderTotal = urlParams.get('total') || '0';
    const checkoutId = checkoutToken || orderId;

    // If no checkout/order ID, redirect to home (prevent direct access)
    if (!checkoutToken && !orderId) {
      window.location.href = '/';
      return;
    }

    // Get order details from session storage or use URL params
    const storedOrder = sessionStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else {
      // Fallback order details from URL
      setOrderDetails({
        orderNumber: orderId || 'DLS-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        email: '',
        total: '$' + orderTotal,
      });
    }

    // Wait for gtag to be available (async script loading)
    const waitForGtag = (retries = 10, delay = 100) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        fireConversionEvents();
      } else if (retries > 0) {
        setTimeout(() => waitForGtag(retries - 1, delay), delay);
      } else {
        console.warn('Google Tag Manager (gtag) not available after retries');
      }
    };

    const fireConversionEvents = () => {
      const gtag = (window as any).gtag;
      console.log('🔥 Firing conversion events for order:', { orderId, checkoutId, total: orderTotal });

      // Google Ads Conversion Tracking (AW-17833894840)
      try {
        gtag('event', 'conversion', {
          'send_to': 'AW-17833894840/LxbdCPIH-7QcELjH7rdC',
          'value': parseFloat(orderTotal) || 0,
          'currency': 'USD',
          'transaction_id': checkoutId,
        });
        console.log('✅ Google Ads conversion event fired successfully');
      } catch (error) {
        console.error('❌ Error firing Google Ads conversion:', error);
      }

      // Google Analytics 4 - Purchase Event
      try {
        let purchaseItems: object[] = [];
        try {
          const cartJson = localStorage.getItem('dunns_cart');
          if (cartJson) {
            const cartItems = JSON.parse(cartJson);
            purchaseItems = cartItems.map((item: { id: string; name: string; priceNum: number; quantity: number }) => ({
              item_id: item.id,
              item_name: item.name,
              price: item.priceNum,
              quantity: item.quantity,
            }));
          }
        } catch { /* ignore parse errors */ }

        gtag('event', 'purchase', {
          transaction_id: orderId || checkoutId,
          value: parseFloat(orderTotal) || 0,
          currency: 'USD',
          items: purchaseItems,
        });
        console.log('✅ GA4 purchase event fired successfully');

        // Clear cart after confirmed purchase
        localStorage.removeItem('dunns_cart');
        localStorage.removeItem('dunns_shopify_cart_id');
      } catch (error) {
        console.error('❌ Error firing GA4 purchase event:', error);
      }
    };

    // Start waiting for gtag
    waitForGtag();
  }, []);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="text-cream-200/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-950">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gold-600/20 border-2 border-gold-500 flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} className="text-gold-500" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-gold-400 text-xs font-medium tracking-[0.4em] uppercase">
              Order Confirmed
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">
            Thank You for Your
            <br />
            <span className="text-gradient-gold italic">Purchase</span>
          </h1>

          <p className="text-cream-200/60 text-lg mb-8 max-w-xl mx-auto">
            Your order has been received and is being prepared with the utmost care.
            We appreciate your trust in Dunn's Luxury Selections.
          </p>

          {/* Order Details Card */}
          <div className="bg-charcoal-900 border border-charcoal-800/50 rounded-lg p-8 max-w-lg mx-auto mb-8">
            <div className="text-center mb-6">
              <p className="text-cream-200/40 text-sm uppercase tracking-wider mb-2">Order Number</p>
              <p className="text-white text-2xl font-bold font-serif">{orderDetails.orderNumber}</p>
            </div>

            <div className="border-t border-charcoal-800/50 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-cream-200/60">Confirmation sent to:</span>
                <span className="text-cream-100">{orderDetails.email || 'Check your inbox for your confirmation email'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cream-200/60">Order Total:</span>
                <span className="text-gold-400 font-bold text-xl">{orderDetails.total}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            <div className="bg-charcoal-900/50 border border-charcoal-800/30 rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 flex items-center justify-center mx-auto mb-4">
                <Mail size={20} className="text-gold-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Confirmation Email</h3>
              <p className="text-cream-200/50 text-sm">We've sent a detailed confirmation to your email.</p>
            </div>

            <div className="bg-charcoal-900/50 border border-charcoal-800/30 rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 flex items-center justify-center mx-auto mb-4">
                <Package size={20} className="text-gold-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">Order Processing</h3>
              <p className="text-cream-200/50 text-sm">Your items are being carefully prepared for shipment.</p>
            </div>

            <div className="bg-charcoal-900/50 border border-charcoal-800/30 rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-gold-600/10 flex items-center justify-center mx-auto mb-4">
                <Truck size={20} className="text-gold-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">White-Glove Delivery</h3>
              <p className="text-cream-200/50 text-sm">Expect delivery within 5-10 business days.</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/collections"
              className="inline-flex items-center justify-center gap-2 bg-gold-gradient text-charcoal-950 font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-gold-500/50 text-gold-400 font-medium text-sm tracking-widest uppercase px-8 py-4 rounded hover:bg-gold-700/10 transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
