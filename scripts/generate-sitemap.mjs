// Generates dist/sitemap.xml at build time from static routes plus the live
// Shopify catalog (products) and blog (articles). Runs after prerender-ssg.
// If the Shopify API is unreachable, the static routes still ship — the build
// never fails because of the sitemap.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const BASE_URL = 'https://dunnluxuryselections.com';

// Public Storefront API credentials (same values baked into the client bundle).
const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'luxury-dunn-selections.myshopify.com';
const SHOP_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '68ba4d5231bfe1cc188916fc62fa8882';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/collections', priority: '0.9', changefreq: 'weekly' },
  { path: '/electronic-humidors', priority: '0.9', changefreq: 'weekly' },
  { path: '/cabinet-humidors', priority: '0.9', changefreq: 'weekly' },
  { path: '/desktop-humidors', priority: '0.9', changefreq: 'weekly' },
  { path: '/travel-humidors', priority: '0.9', changefreq: 'weekly' },
  { path: '/accessories', priority: '0.9', changefreq: 'weekly' },
  { path: '/new-arrivals', priority: '0.8', changefreq: 'weekly' },
  { path: '/walk-in-humidor', priority: '0.9', changefreq: 'monthly' },
  { path: '/financing', priority: '0.8', changefreq: 'monthly' },
  { path: '/journal', priority: '0.7', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/care-guides', priority: '0.6', changefreq: 'monthly' },
  { path: '/delivery-info', priority: '0.5', changefreq: 'monthly' },
  { path: '/returns-warranty', priority: '0.5', changefreq: 'monthly' },
  { path: '/onepager', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
  { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
];

async function storefront(query) {
  const res = await fetch(`https://${SHOP_DOMAIN}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOP_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Storefront API ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchProducts() {
  const urls = [];
  let cursor = null;
  for (let page = 0; page < 10; page++) {
    const after = cursor ? `, after: "${cursor}"` : '';
    const data = await storefront(
      `{ products(first: 250${after}) { pageInfo { hasNextPage endCursor } edges { node { handle updatedAt } } } }`,
    );
    for (const { node } of data.products.edges) {
      urls.push({
        path: `/product/${node.handle}`,
        lastmod: node.updatedAt?.slice(0, 10),
        priority: '0.8',
        changefreq: 'weekly',
      });
    }
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }
  return urls;
}

async function fetchArticles() {
  const urls = [];
  const data = await storefront(
    `{ blogs(first: 5) { edges { node { handle articles(first: 250) { edges { node { handle publishedAt } } } } } } }`,
  );
  for (const { node: blog } of data.blogs.edges) {
    for (const { node: article } of blog.articles.edges) {
      urls.push({
        path: `/article/${blog.handle}/${article.handle}`,
        lastmod: article.publishedAt?.slice(0, 10),
        priority: '0.6',
        changefreq: 'monthly',
      });
    }
  }
  return urls;
}

function toXml(urls) {
  const entries = urls
    .map((u) => {
      // Prerendered directory pages serve with a trailing slash; SPA routes
      // (/product/, /article/) must not have one or handle parsing breaks.
      const isSpaRoute = u.path.startsWith('/product/') || u.path.startsWith('/article/');
      const loc = u.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${u.path}${isSpaRoute ? '' : '/'}`;
      const lastmod = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${lastmod}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

let urls = [...STATIC_ROUTES];
try {
  const [products, articles] = await Promise.all([fetchProducts(), fetchArticles()]);
  urls = urls.concat(products, articles);
  console.log(`Sitemap: ${STATIC_ROUTES.length} static + ${products.length} products + ${articles.length} articles = ${urls.length} URLs`);
} catch (err) {
  console.warn(`Sitemap: Shopify fetch failed (${err.message}) — shipping static routes only.`);
}

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), toXml(urls));
console.log('Wrote dist/sitemap.xml');
