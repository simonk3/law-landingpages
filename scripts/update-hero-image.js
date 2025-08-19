#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Hero Image Update Script');
console.log('========================');
console.log('');
console.log('To update the hero image:');
console.log('1. Save your new image as "hero-new.webp" in the public/images/ directory');
console.log('2. Run: npm run optimize-images');
console.log('3. The script will create responsive versions automatically');
console.log('');
console.log('Expected files after optimization:');
console.log('- hero.webp (original)');
console.log('- hero-400.webp (mobile)');
console.log('- hero-800.webp (tablet)');
console.log('- hero-1200.webp (desktop/social)');
console.log('');

const heroPath = path.join(__dirname, '../public/images/hero-new.webp');
if (fs.existsSync(heroPath)) {
    console.log('✅ Found hero-new.webp - ready for optimization!');
    console.log('Run: npm run optimize-images');
} else {
    console.log('⚠️  Please save your new image as hero-new.webp in public/images/');
    console.log('   Then run this script again.');
}
