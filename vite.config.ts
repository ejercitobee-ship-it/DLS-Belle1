import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const cloudflareRocketLoaderFix = (): Plugin => ({
  name: 'cloudflare-rocket-loader-fix',
  transformIndexHtml(html) {
    return html.replace(
      /<script type="module"/g,
      '<script data-cfasync="false" type="module"'
    );
  },
});

export default defineConfig({
  plugins: [react(), cloudflareRocketLoaderFix()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
