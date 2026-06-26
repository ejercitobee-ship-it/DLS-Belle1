import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const cloudflareRocketLoaderFix = (): Plugin => ({
  name: 'cloudflare-rocket-loader-fix',
  transformIndexHtml(html) {
    return html.replace(
      /\u003cscript type="module"/g,
      '\u003cscript data-cfasync="false" type="module"'
    );
  },
});

// Generate a unique build timestamp for cache busting
const buildTimestamp = Date.now().toString();

export default defineConfig({
  plugins: [react(), cloudflareRocketLoaderFix()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${buildTimestamp}-[hash].js`,
        chunkFileNames: `assets/[name]-${buildTimestamp}-[hash].js`,
        assetFileNames: `assets/[name]-${buildTimestamp}-[hash][extname]`,
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          shopify: ['./src/lib/shopify.ts'],
        },
      },
    },
    // Minification removed - using default esbuild minifier
  },
  // Optimize deps for faster dev and build
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
