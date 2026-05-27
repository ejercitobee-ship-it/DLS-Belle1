import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROUTES = [
  '/',
  '/journal',
  '/all-collections',
  '/collections',
  '/cabinet-humidors',
  '/desktop-humidors',
  '/electronic-humidors',
  '/travel-humidors',
  '/accessories',
  '/walk-in-humidor',
  '/about',
  '/privacy-policy',
  '/terms-of-service',
  '/cookie-policy',
  '/delivery-info',
  '/returns-warranty',
  '/care-guides',
  '/checkout',
  '/shopify-setup',
  '/new-arrivals',
];

const DIST_DIR = path.resolve(__dirname, 'dist');
const PORT = 3456;

// Start a simple static file server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Parse URL
      const urlPath = req.url === '/' ? '/index.html' : req.url;
      const filePath = path.join(DIST_DIR, urlPath);
      const safePath = path.resolve(filePath);
      
      // Security: ensure path is within dist
      if (!safePath.startsWith(path.resolve(DIST_DIR))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      
      // If requesting a directory or HTML path without extension, serve index.html
      let finalPath = safePath;
      if (!path.extname(safePath)) {
        const indexPath = path.join(safePath, 'index.html');
        if (fs.existsSync(indexPath)) {
          finalPath = indexPath;
        } else if (fs.existsSync(safePath + '.html')) {
          finalPath = safePath + '.html';
        } else {
          // SPA fallback
          finalPath = path.join(DIST_DIR, 'index.html');
        }
      }
      
      if (!fs.existsSync(finalPath)) {
        // SPA fallback for non-existent files
        finalPath = path.join(DIST_DIR, 'index.html');
      }
      
      const ext = path.extname(finalPath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
      }[ext] || 'application/octet-stream';
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(fs.readFileSync(finalPath));
    });
    
    server.listen(PORT, () => {
      console.log(`Static server running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log('Starting prerender...');

  const server = await startServer();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of ROUTES) {
    const page = await browser.newPage();

    const url = `http://localhost:${PORT}${route}`;
    
    // Use networkidle to wait for all resources to load
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    
    // Additional wait for React to hydrate and render
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Wait for the page content to be ready (check if title is not the default)
    await page.waitForFunction(() => {
      const title = document.title;
      return title && title !== 'Dunn\'s Luxury Selections' && !title.includes('Loading');
    }, { timeout: 10000 });

    const html = await page.content();

    // Write to dist folder
    const outputPath = route === '/'
      ? path.join(DIST_DIR, 'index.html')
      : path.join(DIST_DIR, route, 'index.html');

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);

    // Verify the title
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]*)"/);
    console.log(`✓ Prerendered: ${route}`);
    console.log(`  Title: ${titleMatch ? titleMatch[1] : 'NOT FOUND'}`);
    console.log(`  Canonical: ${canonicalMatch ? canonicalMatch[1] : 'NOT FOUND'}`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('Prerender complete!');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
