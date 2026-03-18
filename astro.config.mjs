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
  // Eliminamos el puerto fijo 10000 para que Render use el suyo
  server: {
    host: true, // Esto permite conexiones internas y externas
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