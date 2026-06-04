/**
 * Cloudflare Worker - Shopify Route Redirector
 * Redirects Shopify-native checkout routes from custom domain to myshopify domain
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const search = url.search;
    
    // Shopify shop configuration
    const SHOPIFY_DOMAIN = 'luxury-dunn-selections.myshopify.com';
    const SHOP_ID = '95073927538';
    
    // Define redirect patterns
    const redirectPatterns = [
      // Draft order invoices: /95073927538/invoices/{token}
      {
        pattern: new RegExp(`^/${SHOP_ID}/invoices/.*$`),
        description: 'Draft order invoices'
      },
      // Checkout pages: /checkouts/*
      {
        pattern: /^\/checkouts\/.*$/,
        description: 'Checkout pages'
      },
      // Cart with token (draft order checkout): /cart/{id}:{token}
      {
        pattern: /^\/cart\/\d+:[a-f0-9]+$/,
        description: 'Draft order cart links'
      },
      // Payments: /payments/*
      {
        pattern: /^\/payments\/.*$/,
        description: 'Payment pages'
      },
      // Orders: /orders/* (optional - for order status page)
      {
        pattern: /^\/orders\/.*$/,
        description: 'Order status pages'
      }
    ];
    
    // Check if the current path matches any redirect pattern
    const shouldRedirect = redirectPatterns.some(({ pattern }) => pattern.test(pathname));
    
    if (shouldRedirect) {
      // Construct the Shopify URL with full path and query string
      const shopifyUrl = `https://${SHOPIFY_DOMAIN}${pathname}${search}`;
      
      // Return 302 temporary redirect
      return new Response(null, {
        status: 302,
        headers: {
          'Location': shopifyUrl,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    // Pass through all other requests to the origin (headless frontend)
    return fetch(request);
  }
};
