import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: [path.dirname(require.resolve('next/package.json'))] }));
const sources = ['components/watcha/WatchaPage.tsx', 'components/watcha/CloudsHero.tsx'].map(file => fs.readFileSync(file, 'utf8')).join('\n');
const paths = [...new Set([...sources.matchAll(/["'](\/[^"'\n]+\.(?:png|jpg|jpeg|webp|svg))["']/gi)].map(match => match[1]))].sort();
const dimensions = {};
for (const src of paths) {
  const metadata = await sharp(path.join('public', src)).metadata();
  dimensions[src] = { width: metadata.width, height: metadata.height };
}
fs.writeFileSync('components/watcha/media-dimensions.json', JSON.stringify(dimensions, null, 2) + '\n');
console.log(`Recorded dimensions for ${paths.length} images.`);
