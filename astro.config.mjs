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
  // --- CONFIGURACIÓN DE SEGURIDAD REFORZADA ---
  security: {
    checkOrigin: false, // Desactiva la verificación estricta
  },
  server: {
    host: '0.0.0.0',
    port: 10000,
  },
  // --------------------------------------------
  integrations: [
    icon(), 
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});