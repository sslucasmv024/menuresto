// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import node from '@astrojs/node'; // 1. Importamos el adaptador de Node

export default defineConfig({
  output: 'server', // 2. Cambiamos a modo servidor para permitir formularios y escritura
  adapter: node({
    mode: 'standalone', // 3. Configuramos cómo se ejecutará el servidor
  }),
  integrations: [
    icon(), 
  ],
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});