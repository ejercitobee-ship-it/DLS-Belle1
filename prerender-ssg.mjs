// Static Site Generation - Build v2
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') });

const DIST_DIR = path.resolve(__dirname, 'dist');
const BASE_URL = 'https://dunnluxuryselections.com';

// Products will be fetched and added to routes dynamically

// FAQ content shared with the React components (visible accordions).
// Editing src/data/siteFaqs.json updates both the page and this schema.
const siteFaqs = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'src/data/siteFaqs.json'), 'utf-8'),
);

const faqPageSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

// Service schema for the custom walk-in offering. Intentionally Service +
// nationwide areaServed, not LocalBusiness — pure e-commerce, no storefront.
// Service model: we design, manufacture, and ship components; installation is
// carried out by the client's team with our guidance.
const walkInServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom Walk-In Humidor Design & Supply',
  serviceType: 'Custom humidor design and component supply',
  description:
    'End-to-end design, engineering, and manufacturing of bespoke walk-in humidors for private residences, cigar lounges, restaurants, and retail spaces. Every component — Spanish cedar lining, shelving, and precision climate-control equipment — is crafted to measure and shipped nationwide as a complete kit, with detailed installation instructions and remote guidance for your build team. Residential projects typically complete in 4–8 weeks; commercial builds in 8–16 weeks.',
  provider: { '@id': `${BASE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'United States' },
  url: `${BASE_URL}/walk-in-humidor`,
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: `${BASE_URL}/walk-in-humidor`,
    servicePhone: { '@type': 'ContactPoint', telephone: '+1-888-431-9214', contactType: 'Sales' },
  },
  hoursAvailable: 'By appointment',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    description:
      'Custom-quoted per project after complimentary consultation. Financing available through Shop Pay Installments for qualified buyers.',
  },
};

const productPageSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description || `Premium humidor: ${product.title}`,
  url: `${BASE_URL}/product/${product.handle}`,
  image: product.image?.src || `${BASE_URL}/placeholder-humidor.jpg`,
  brand: {
    '@type': 'Brand',
    name: "Dunn's Luxury Selections",
  },
  sku: product.id,
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/product/${product.handle}`,
    priceCurrency: 'USD',
    price: product.priceRange?.minVariantPrice?.amount || '0',
    availability: product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
  },
});

// Dynamically generate product routes from Shopify data
async function generateProductRoutes() {
  try {
    // Note: Product pages are client-side rendered via React routing.
    // Prerendering them here is optional for SEO enhancement.
    // If import fails (e.g., TS not transpiled), we gracefully skip and
    // let React handle product pages on the client side.
    console.log('Skipping product page prerendering (client-side rendered via React routing)');
    return [];
  } catch (error) {
    console.warn('Could not fetch products:', error.message);
    return [];
  }
}

// Dynamically generate article routes from Shopify data
async function generateArticleRoutes() {
  try {
    // Fetch articles from Shopify
    console.log('Fetching articles from Shopify...');

    // Use dynamic import - try to load the compiled shopify module
    let articles = [];
    try {
      // Attempt to import from dist if available (after TypeScript compilation)
      const { fetchArticles: fetchArticlesImpl } = await import('./dist/lib/shopify.mjs')
        .catch(() => ({ fetchArticles: async () => [] }));

      if (fetchArticlesImpl) {
        articles = await fetchArticlesImpl(100); // Fetch up to 100 articles
      }
    } catch (importError) {
      console.warn('Could not import fetchArticles, articles will not be prerendered:', importError.message);
      return [];
    }

    if (articles.length === 0) {
      console.log('No articles to prerender');
      return [];
    }

    console.log(`Found ${articles.length} articles to prerender`);

    return articles.map(article => {
      // Ensure image URL is absolute
      let imageUrl = article.image?.url || `${BASE_URL}/og-image.jpg`;
      // If relative, make it absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${BASE_URL}${imageUrl}`;
      }

      return {
        path: `/article/${article.blog.handle}/${article.handle}`,
        file: `article/${article.blog.handle}/${article.handle}/index.html`,
        title: `${article.title} | Dunn's Luxury Selections`,
        description: article.excerpt ? article.excerpt.substring(0, 160) : `Read this article from Dunn's Luxury Selections Journal.`,
        canonical: `${BASE_URL}/article/${article.blog.handle}/${article.handle}`,
        ogImage: imageUrl,
      };
    });
  } catch (error) {
    console.warn('Could not fetch articles, skipping article prerendering:', error.message);
    return [];
  }
}

// Route metadata for static generation
const routes = [
  { path: '/', file: 'index.html', title: "Dunn's Luxury Selections | Humidor Collections", description: "Explore Dunn's Luxury Selections — bespoke humidors, cabinet humidors, electronic humidors, travel humidors, and premium cigar accessories.", canonical: 'https://dunnluxuryselections.com/' },
  { path: '/electronic-humidors', file: 'electronic-humidors/index.html', title: "Electronic Humidors | Dunn's Luxury Selections", description: "Precision climate-controlled cabinets for discerning collectors and luxury venues. Shop Raching, Reagan, and more.", canonical: 'https://dunnluxuryselections.com/electronic-humidors' },
  { path: '/walk-in-humidor', file: 'walk-in-humidor/index.html', title: "Bespoke Walk-In Humidors | Dunn's Luxury Selections", description: "Custom walk-in humidor design with nationwide component shipping for private residences, lounges, and commercial spaces — complete installation guidance included.", canonical: 'https://dunnluxuryselections.com/walk-in-humidor', schemas: [walkInServiceSchema, faqPageSchema(siteFaqs.walkIn)] },
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
  { path: '/financing', file: 'financing/index.html', title: "Financing | Dunn's Luxury Selections", description: "Finance your luxury humidor with Shop Pay Installments — 0% interest for qualified buyers, 4 monthly payments on qualifying purchases over $1,500.", canonical: 'https://dunnluxuryselections.com/financing', schemas: [faqPageSchema(siteFaqs.financing)] },
  { path: '/checkout', file: 'checkout/index.html', title: "Checkout | Dunn's Luxury Selections", description: "Complete your purchase securely.", canonical: 'https://dunnluxuryselections.com/checkout' },
  { path: '/order-confirmation', file: 'order-confirmation/index.html', title: "Order Confirmed | Dunn's Luxury Selections", description: "Thank you for your purchase. Your order has been confirmed.", canonical: 'https://dunnluxuryselections.com/order-confirmation' },
  { path: '/shopify-setup', file: 'shopify-setup/index.html', title: "Shopify Setup | Dunn's Luxury Selections", description: "Shopify store configuration and setup guide.", canonical: 'https://dunnluxuryselections.com/shopify-setup' },
];

// Read the base index.html
const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');

(async () => {
  console.log('Starting static site generation...\n');

  // Generate dynamic product routes from Shopify
  const productRoutes = await generateProductRoutes();
  const articleRoutes = await generateArticleRoutes();
  const allRoutes = [...routes, ...productRoutes, ...articleRoutes];

  console.log(`Found ${productRoutes.length} products and ${articleRoutes.length} articles to prerender.\n`);

  for (const route of allRoutes) {
  // Replace meta tags in the HTML
  let html = baseHtml
    .replace(/\u003ctitle\u003e[^\u003c]*\u003c\/title\u003e/, `\u003ctitle\u003e${route.title}\u003c/title\u003e`)
    .replace(/\u003cmeta name="description" content="[^"]*"\s*\/?\u003e/, `\u003cmeta name="description" content="${route.description}" /\u003e`)
    .replace(/\u003clink rel="canonical" href="[^"]*"\s*\/?\u003e/, `\u003clink rel="canonical" href="${route.canonical}" /\u003e`)
    .replace(/\u003cmeta property="og:url" content="[^"]*"\s*\/?\u003e/, `\u003cmeta property="og:url" content="${route.canonical}" /\u003e`)
    .replace(/\u003cmeta property="og:title" content="[^"]*"\s*\/?\u003e/, `\u003cmeta property="og:title" content="${route.title}" /\u003e`)
    .replace(/\u003cmeta property="og:description" content="[^"]*"\s*\/?\u003e/, `\u003cmeta property="og:description" content="${route.description}" /\u003e`)
    .replace(/\u003cmeta name="twitter:title" content="[^"]*"\s*\/?\u003e/, `\u003cmeta name="twitter:title" content="${route.title}" /\u003e`)
    .replace(/\u003cmeta name="twitter:description" content="[^"]*"\s*\/?\u003e/, `\u003cmeta name="twitter:description" content="${route.description}" /\u003e`);

    // Inject page-specific JSON-LD schemas into the static HTML so crawlers
    // that don't execute JavaScript (GPTBot, ClaudeBot, etc.) still see them.
    if (route.schemas?.length) {
      const schemaTags = route.schemas
        .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
        .join('\n    ');
      html = html.replace('</head>', `    ${schemaTags}\n  </head>`);
    }

    // For product pages, inject product data as a data attribute so React can hydrate
    if (route.productData) {
      html = html.replace('<div id="root">', `<div id="root" data-product='${JSON.stringify(route.productData).replace(/'/g, "&apos;")}'>`);
    }

    // Create directory if needed
    const outputPath = path.join(DIST_DIR, route.file);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the file
    fs.writeFileSync(outputPath, html);
    console.log(`✓ Generated: ${route.file}`);
    console.log(`  Title: ${route.title}`);
    console.log(`  Canonical: ${route.canonical}`);
  }

  console.log(`\nStatic site generation complete!`);
  console.log(`Generated ${allRoutes.length} pages (${routes.length} static + ${productRoutes.length} products + ${articleRoutes.length} articles).`);
})().catch(error => {
  console.error('FATAL: Unhandled error in prerender:', error);
  process.exit(1);
});
