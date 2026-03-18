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
  // --- ESTO ARREGLA EL ERROR DE "FORBIDDEN" ---
  security: {
    checkOrigin: false, 
  },
  // --------------------------------------------
  server: {
    host: true, // Importante para que acepte conexiones de Render
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