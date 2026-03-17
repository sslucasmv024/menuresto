// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  // AGREGAMOS ESTA SECCIÓN PARA RENDER
  server: {
    host: true,
    port: 10000
  },
  integrations: [
    icon(), 
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});