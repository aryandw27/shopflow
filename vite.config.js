import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'shopflow-spa-routes',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((request, _response, next) => {
          const [pathname, search] = (request.url || '/').split('?');
          const spaRoutes = new Set([
            '/landing.html',
            '/store.html',
            '/product-detail.html',
            '/content-page.html',
            '/login.html',
            '/register.html',
            '/dashboard/index.html',
            '/dashboard/products.html',
            '/dashboard/orders.html',
            '/dashboard/cart.html',
            '/dashboard/users.html',
            '/dashboard/analytics.html',
            '/dashboard/qr-generator.html',
            '/dashboard/settings.html',
            '/dashboard/cms.html',
          ]);
          if (spaRoutes.has(pathname)) request.url = `/index.html${search ? `?${search}` : ''}`;
          next();
        });
      },
    },
  ],
  appType: 'spa',
  root,
  publicDir: '../public-assets',
  base: '/',
  resolve: {
    alias: {
      '@': root,
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2020',
  },
  server: {
    port: 3000,
    open: false,
    cors: true,
    allowedHosts: ['shopflow.siliconhost.online'],
  },
  preview: {
    port: 4173,
  },
});
