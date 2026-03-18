import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite'; // <--- LA NUEVA FORMA EN V4

export default defineConfig({
  // 1. Salida de servidor para que funcionen las APIs
  output: 'server',
  
  // 2. Adaptador de Node para Render
  adapter: node({
    mode: 'standalone',
  }),

  // 3. En Tailwind 4, se mete dentro de VITE, no en integrations
  vite: {
    plugins: [tailwindcss()], 
    ssr: {
      // Evitamos que Rollup intente procesar los binarios de Puppeteer
      external: ['puppeteer'],
    },
    optimizeDeps: {
      exclude: ['puppeteer'],
    },
    build: {
      rollupOptions: {
        external: ['puppeteer'],
      },
    },
  },
});