// Generates the default Open Graph image (1200x630) from the hero photo.
// Social scrapers need a landscape, absolute-URL image; hero.webp is 2:3 portrait
// and gets badly cropped by Facebook/LinkedIn/X if used directly.
import sharp from 'sharp';

const SRC = 'public/images/hero.webp';
const OUT = 'public/images/og-1200x630.jpg';

await sharp(SRC)
  .resize(1200, 630, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

const { width, height, size } = await sharp(OUT).metadata();
console.log(`${OUT} -> ${width}x${height} (${Math.round(size / 1024)} KB)`);
