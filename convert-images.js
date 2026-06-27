import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imagesToConvert = [
  'public/images/hero-bg.png',
  'public/images/brian-dunn-founder.png',
  'public/images/bespoke-walk-in-humidor.png',
  'public/images/collections-travel-humidors.png',
];

async function convertImagesToWebP() {
  for (const imagePath of imagesToConvert) {
    const fullPath = path.resolve(__dirname, imagePath);
    const outputPath = imagePath.replace('.png', '.webp');
    const fullOutputPath = path.resolve(__dirname, outputPath);

    try {
      const stats = fs.statSync(fullPath);
      console.log(`Converting ${path.basename(imagePath)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

      await sharp(fullPath)
        .webp({ quality: 85 })
        .toFile(fullOutputPath);

      const outputStats = fs.statSync(fullOutputPath);
      const savings = ((1 - outputStats.size / stats.size) * 100).toFixed(1);
      console.log(`✓ ${path.basename(outputPath)} (${(outputStats.size / 1024 / 1024).toFixed(2)} MB) - ${savings}% reduction\n`);
    } catch (err) {
      console.error(`✗ Error converting ${imagePath}:`, err.message);
    }
  }
}

convertImagesToWebP();
