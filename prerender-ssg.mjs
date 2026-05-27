import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, 'dist');

// Route metadata for static generation
const routes = [
  { path: '/', file: 'index.html', title: "Dunn's Luxury Selections | Humidor Collections", description: "Explore Dunn's Luxury Selections — bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.", canonical: 'https://dunnluxuryselections.com/' },
  { path: '/electronic-humidors', file: 'electronic-humidors/index.html', title: "Electronic Humidors | Dunn's Luxury Selections", description: "Precision climate-controlled cabinets for discerning collectors and luxury venues. Shop Raching, Reagan, and more.", canonical: 'https://dunnluxuryselections.com/electronic-humidors' },
  { path: '/walk-in-humidor', file: 'walk-in-humidor/index.html', title: "Bespoke Walk-In Humidors | Dunn's Luxury Selections", description: "Custom walk-in humidor design and installation for private residences, lounges, and commercial spaces.", canonical: 'https://dunnluxuryselections.com/walk-in-humidor' },
  { path: '/desktop-humidors', file: 'desktop-humidors/index.html', title: "Desktop Humidors | Dunn's Luxury Selections", description: "Elegant desktop humidors crafted from Spanish cedar, leather, and carbon fiber for the discerning aficionado.", canonical: 'https://dunnluxuryselections.com/desktop-humidors' },
  { path: '/travel-humidors', file: 'travel-humidors/index.html', title: "Travel Humidors | Dunn's Luxury Selections", description: "Portable travel humidors and cigar cases designed for protection and style on the move.", canonical: 'https://dunnluxuryselections.com/travel-humidors' },
  { path: '/accessories', file: 'accessories/index.html', title: "Cigar Accessories | Dunn's Luxury Selections", description: "Premium cigar cutters, lighters, ashtrays, hygrometers, and humidification accessories.", canonical: 'https://dunnluxuryselections.com/accessories' },
  { path: '/cabinet-humidors', file: 'cabinet-humidors/index.html', title: "Cabinet Humidors | Dunn's Luxury Selections", description: "Furniture-grade cabinet humidors combining timeless craftsmanship with precision climate control.", canonical: 'https://dunnluxuryselections.com/cabinet-humidors' },
  { path: '/new-arrivals', file: 'new-arrivals/index.html', title: "New Arrivals | Dunn's Luxury Selections", description: "Discover the latest luxury humidors and cigar accessories newly added to our collection.", canonical: 'https://dunnluxuryselections.com/new-arrivals' },
  { path: '/collections', file: 'collections/index.html', title: "All Collections | Dunn's Luxury Selections", description: "Browse our complete collection of luxury humidors, accessories, and bespoke cigar storage solutions.", canonical: 'https://dunnluxuryselections.com/collections' },
  { path: '/about', file: 'about/index.html', title: "About Us | Dunn's Luxury Selections", description: "America's premier destination for luxury cigar humidors. Precision, prestige, and presence.", canonical: 'https://dunnluxuryselections.com/about' },
  { path: '/journal', file: 'journal/index.html', title: "Journal | Dunn's Luxury Selections", description: "Expert guides, care tips, and stories from the world of luxury cigar storage.", canonical: 'https://dunnluxuryselections.com/journal' },
  { path: '/privacy-policy', file: 'privacy-policy/index.html', title: "Privacy Policy | Dunn's Luxury Selections", description: "Our privacy policy outlines how we protect your personal information.", canonical: 'https://dunnluxuryselections.com/privacy-policy' },
  { path: '/terms-of-service', file: 'terms-of-service/index.html', title: "Terms of Service | Dunn's Luxury Selections", description: "Terms and conditions for using Dunn's Luxury Selections website and services.", canonical: 'https://dunnluxuryselections.com/terms-of-service' },
  { path: '/cookie-policy', file: 'cookie-policy/index.html', title: "Cookie Policy | Dunn's Luxury Selections", description: "Information about how we use cookies on our website.", canonical: 'https://dunnluxuryselections.com/cookie-policy' },
  { path: '/delivery-info', file: 'delivery-info/index.html', title: "Delivery Information | Dunn's Luxury Selections", description: "Shipping, delivery times, and tracking information for your orders.", canonical: 'https://dunnluxuryselections.com/delivery-info' },
  { path: '/returns-warranty', file: 'returns-warranty/index.html', title: "Returns & Warranty | Dunn's Luxury Selections", description: "Our returns policy and warranty coverage for luxury humidors and accessories.", canonical: 'https://dunnluxuryselections.com/returns-warranty' },
  { path: '/care-guides', file: 'care-guides/index.html', title: "Care Guides | Dunn's Luxury Selections", description: "Expert guidance on maintaining and caring for your luxury humidor.", canonical: 'https://dunnluxuryselections.com/care-guides' },
  { path: '/checkout', file: 'checkout/index.html', title: "Checkout | Dunn's Luxury Selections", description: "Complete your purchase securely.", canonical: 'https://dunnluxuryselections.com/checkout' },
  { path: '/shopify-setup', file: 'shopify-setup/index.html', title: "Shopify Setup | Dunn's Luxury Selections", description: "Shopify store configuration and setup guide.", canonical: 'https://dunnluxuryselections.com/shopify-setup' },
];

// Read the base index.html
const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

console.log('Starting static site generation...\n');

for (const route of routes) {
  // Replace meta tags in the HTML
  let html = baseHtml
    .replace(/\u003ctitle\u003e[^\u003c]*\u003c\/title\u003e/, `\u003ctitle\u003e${route.title}\u003c/title\u003e`)
    .replace(/\u003cmeta name="description" content="[^"]*"\u003e/, `\u003cmeta name="description" content="${route.description}"\u003e`)
    .replace(/\u003clink rel="canonical" href="[^"]*"\u003e/, `\u003clink rel="canonical" href="${route.canonical}"\u003e`)
    .replace(/\u003cmeta property="og:url" content="[^"]*"\u003e/, `\u003cmeta property="og:url" content="${route.canonical}"\u003e`)
    .replace(/\u003cmeta property="og:title" content="[^"]*"\u003e/, `\u003cmeta property="og:title" content="${route.title}"\u003e`)
    .replace(/\u003cmeta property="og:description" content="[^"]*"\u003e/, `\u003cmeta property="og:description" content="${route.description}"\u003e`);

  // Create directory if needed
  const outputPath = path.join(DIST_DIR, route.file);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  
  // Write the file
  fs.writeFileSync(outputPath, html);
  console.log(`✓ Generated: ${route.file}`);
  console.log(`  Title: ${route.title}`);
  console.log(`  Canonical: ${route.canonical}`);
}

console.log('\nStatic site generation complete!');
console.log(`Generated ${routes.length} pages.`);
