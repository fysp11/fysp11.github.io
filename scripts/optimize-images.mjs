import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function optimizeImage(inputPath, outputPath, width = 1200, quality = 75) {
  await sharp(join(projectRoot, inputPath))
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality, effort: 6 }) // effort: 6 for better compression
    .toFile(join(projectRoot, outputPath));

}

// Optimize project hero images
await optimizeImage(
  'public/images/projects/ai-gen.png',
  'public/images/projects/ai-gen.webp'
);

await optimizeImage(
  'public/images/projects/space-cat.jpeg',
  'public/images/projects/space-cat.webp'
);
