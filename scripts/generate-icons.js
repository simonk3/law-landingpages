// Renders the raster icon set from public/favicon.svg.
// Re-run with `npm run icons` after editing the source SVG.
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg', 'utf8');

// iOS masks the icon with its own squircle and composites it on white, so the
// touch icon is rendered full-bleed and opaque rather than pre-rounded.
const fullBleed = svg
  .replace('<rect width="64" height="64" rx="15"', '<rect width="64" height="64"')
  .replace(/<rect x="3\.5"[\s\S]*?\/>/, '');

const targets = [
  { src: svg, out: 'public/favicon-32.png', size: 32 },
  { src: fullBleed, out: 'public/apple-touch-icon.png', size: 180 },
  { src: svg, out: 'public/icon-192.png', size: 192 },
  { src: svg, out: 'public/icon-512.png', size: 512 },
];

for (const { src, out, size } of targets) {
  await sharp(Buffer.from(src), { density: 1200 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`${out} -> ${size}x${size}`);
}

writeFileSync(
  'public/site.webmanifest',
  JSON.stringify(
    {
      name: 'Lex Duo — Адвокати Кушніренко',
      short_name: 'Lex Duo',
      lang: 'uk',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0d0d0d',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  ) + '\n'
);
console.log('public/site.webmanifest');
