import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

// Map routes to their metadata
const routeMetadata: Record<string, { title: string; description: string; canonicalPath: string }> = {
  '/': {
    title: "Dunn's Luxury Selections | Humidor Collections",
    description: "Explore Dunn's Luxury Selections — bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.",
    canonicalPath: '/',
  },
  '/electronic-humidors': {
    title: "Electronic Humidors | Dunn's Luxury Selections",
    description: "Precision climate-controlled cabinets for discerning collectors and luxury venues. Shop Raching, Reagan, and more.",
    canonicalPath: '/electronic-humidors',
  },
  '/walk-in-humidor': {
    title: "Bespoke Walk-In Humidors | Dunn's Luxury Selections",
    description: "Custom walk-in humidor design with nationwide component shipping for private residences, lounges, and commercial spaces — complete installation guidance included.",
    canonicalPath: '/walk-in-humidors',
  },
  '/desktop-humidors': {
    title: "Desktop Humidors | Dunn's Luxury Selections",
    description: "Elegant desktop humidors crafted from Spanish cedar, leather, and carbon fiber for the discerning aficionado.",
    canonicalPath: '/desktop-humidors',
  },
  '/travel-humidors': {
    title: "Travel Humidors | Dunn's Luxury Selections",
    description: "Portable travel humidors and cigar cases designed for protection and style on the move.",
    canonicalPath: '/travel-humidors',
  },
  '/accessories': {
    title: "Cigar Accessories | Dunn's Luxury Selections",
    description: "Premium cigar cutters, lighters, ashtrays, hygrometers, and humidification accessories.",
    canonicalPath: '/accessories',
  },
  '/cabinet-humidors': {
    title: "Cabinet Humidors | Dunn's Luxury Selections",
    description: "Furniture-grade cabinet humidors combining timeless craftsmanship with precision climate control.",
    canonicalPath: '/cabinet-humidors',
  },
  '/new-arrivals': {
    title: "New Arrivals | Dunn's Luxury Selections",
    description: "Discover the latest luxury humidors and cigar accessories newly added to our collection.",
    canonicalPath: '/new-arrivals',
  },
  '/collections': {
    title: "All Collections | Dunn's Luxury Selections",
    description: "Browse our complete collection of luxury humidors, accessories, and bespoke cigar storage solutions.",
    canonicalPath: '/collections',
  },
  '/about': {
    title: "About Us | Dunn's Luxury Selections",
    description: "America's premier destination for luxury cigar humidors. Precision, prestige, and presence.",
    canonicalPath: '/about',
  },
  '/journal': {
    title: "Journal | Dunn's Luxury Selections",
    description: "Expert guides, care tips, and stories from the world of luxury cigar storage.",
    canonicalPath: '/journal',
  },
  '/privacy-policy': {
    title: "Privacy Policy | Dunn's Luxury Selections",
    description: "Our privacy policy outlines how we protect your personal information.",
    canonicalPath: '/privacy-policy',
  },
  '/terms-of-service': {
    title: "Terms of Service | Dunn's Luxury Selections",
    description: "Terms and conditions for using Dunn's Luxury Selections website and services.",
    canonicalPath: '/terms-of-service',
  },
  '/cookie-policy': {
    title: "Cookie Policy | Dunn's Luxury Selections",
    description: "Information about how we use cookies on our website.",
    canonicalPath: '/cookie-policy',
  },
  '/delivery-info': {
    title: "Delivery Information | Dunn's Luxury Selections",
    description: "Shipping, delivery times, and tracking information for your orders.",
    canonicalPath: '/delivery-info',
  },
  '/returns-warranty': {
    title: "Returns & Warranty | Dunn's Luxury Selections",
    description: "Our returns policy and warranty coverage for luxury humidors and accessories.",
    canonicalPath: '/returns-warranty',
  },
  '/care-guides': {
    title: "Care Guides | Dunn's Luxury Selections",
    description: "Expert guidance on maintaining and caring for your luxury humidor.",
    canonicalPath: '/care-guides',
  },
  '/checkout': {
    title: "Checkout | Dunn's Luxury Selections",
    description: "Complete your purchase securely.",
    canonicalPath: '/checkout',
  },
  '/shopify-setup': {
    title: "Shopify Setup | Dunn's Luxury Selections",
    description: "Shopify store configuration and setup guide.",
    canonicalPath: '/shopify-setup',
  },
};

export function render(url: string) {
  const path = url.replace(/\/$/, '') || '/';
  const meta = routeMetadata[path] || routeMetadata['/'];
  
  const html = ReactDOMServer.renderToString(
    React.createElement(App, { initialPage: path })
  );
  
  return { html, meta };
}

export const routes = Object.keys(routeMetadata);
