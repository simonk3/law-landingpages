// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lexduo.com.ua',
  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  build: {
    // Inline page CSS to reduce render-blocking requests
    inlineStylesheets: 'auto', // Changed from 'always' for better performance
    // Enable asset optimization
    assets: '_astro'
  },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PRISMIC_'],
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['@prismicio/client', '@prismicio/helpers'],
          }
        }
      }
    }
  },
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    // Define image quality
    quality: 85, // Slightly higher quality
    // Enable WebP format
    format: ['webp', 'avif'], // Added AVIF for better compression
    remotePatterns: [{ protocol: "https" }],
  },
  // Enable prefetch for better navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
