// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lexduo.com.ua',
  integrations: [
    sitemap({
      lastmod: new Date(),
      priority: 0.7,
      changefreq: 'weekly',
      filter: (page) => !page.includes('/thank-you'),
      customPages: [
        'https://www.lexduo.com.ua/',
        'https://www.lexduo.com.ua/contact/',
        'https://www.lexduo.com.ua/blog/',
      ]
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    pagefind(),
  ],
  build: {
    // Inline critical CSS to reduce render-blocking requests
    inlineStylesheets: 'always',
    // Enable asset optimization
    assets: '_astro',
    // Optimize for performance
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PRISMIC_'],
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunks
      rollupOptions: {
        // Pagefind's index/JS is written to dist/pagefind after the build
        // finishes, so it can't be resolved at bundle time — leave it as a
        // runtime import for the browser to fetch.
        external: ['/pagefind/pagefind.js'],
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
