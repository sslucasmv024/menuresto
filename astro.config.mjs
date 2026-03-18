import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // 1. Definimos que el proyecto es una SSR (Server Side Rendering)
  output: 'server',
  
  // 2. Usamos el adaptador de Node para Render
  adapter: node({
    mode: 'standalone',
  }),

  // 3. Integración de Tailwind
  integrations: [tailwind()],

  // 4. CONFIGURACIÓN VITE (Crucial para Puppeteer)
  vite: {
    ssr: {
      // Le decimos a Rollup que no intente empaquetar Puppeteer
      external: ['puppeteer'],
    },
    optimizeDeps: {
      // Evitamos que Vite intente pre-optimizar Puppeteer en el cliente
      exclude: ['puppeteer'],
    },
    build: {
      rollupOptions: {
        // Doble seguridad para que el build de producción no falle
        external: ['puppeteer'],
      },
    },
  },
});