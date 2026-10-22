import fs from 'node:fs';
import path from 'node:path';
import { getMobileContent } from '../lib/mobile-content';
async function main() {
  const output = process.argv[2];
  if (!output) throw new Error('Usage: tsx scripts/export-mobile.ts <output.json>');
  const data = await getMobileContent();
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(data));
  console.log(`Exported ${data.total} articles; version ${data.version.slice(0, 12)}`);
}
void main();
