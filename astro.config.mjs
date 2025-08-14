// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lexduo.com.ua',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PRISMIC_'],
  },
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    // Define image quality
    quality: 80,
    // Enable WebP format
    format: ['webp'],
  },
});
