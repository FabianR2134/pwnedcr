// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://pwnedcr.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['gsap', 'lenis', 'three'],
    },
  },
});