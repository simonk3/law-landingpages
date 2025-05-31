import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [400, 600, 800];
const images = [
  'image1.webp',
  'P9308000.webp',
  'P9307467.webp'
];

async function optimizeImages() {
  const publicDir = path.join(__dirname, '../public/images');
  
  // Ensure the directory exists
  if (!fs.existsSync(publicDir)) {
    console.error('Public images directory not found!');
    return;
  }

  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    
    // Check if source image exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Source image not found: ${image}`);
      continue;
    }

    const baseName = image.replace('.webp', '');
    
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `${baseName}-${size}.webp`);
      
      try {
        await sharp(inputPath)
          .resize(size)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        console.log(`Created: ${baseName}-${size}.webp`);
      } catch (error) {
        console.error(`Error processing ${image} at size ${size}:`, error);
      }
    }
  }
}

optimizeImages().catch(console.error); 