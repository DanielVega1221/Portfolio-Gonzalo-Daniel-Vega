import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const SITE_URL = (
  JSON.parse(readFileSync(path.resolve(__dirname, 'site.config.json'), 'utf8')) as { url: string }
).url.replace(/\/+$/, '');

// index.html cannot import site.config.json, so the origin is injected here.
function siteUrlPlugin(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', SITE_URL),
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          router: ['react-router-dom'],
          motion: ['motion'],
          lucide: ['lucide-react'],
        },
      },
    },
  },
});