import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon'; // <--- IMPORTANTE: Volvemos a importar los iconos

export default defineConfig({
  output: 'server',
  
  adapter: node({
    mode: 'standalone',
  }),

  // AGREGAMOS ICON() AQUÍ PARA QUE EL BUILD NO TIRE ERROR
  integrations: [icon()], 

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