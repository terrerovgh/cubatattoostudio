/**
 * Optimize bg.jpg into bg.webp for hero background.
 * Run with: npm run optimize-images
 */
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const srcPath = path.resolve('public/img/bg.jpg');
const destPath = path.resolve('public/img/bg.webp');

try {
  const buffer = await fs.readFile(srcPath);
  const optimized = await sharp(buffer)
    .resize({ width: 1920 }) // adjust resolution as needed
    .webp({ quality: 80 })
    .toBuffer();
  await fs.writeFile(destPath, optimized);
  console.log(`✅ Generated ${destPath}`);
} catch (err) {
  console.error('Image optimization failed:', err);
  process.exit(1);
}
