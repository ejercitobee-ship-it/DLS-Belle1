import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function walk(dir, ext) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...walk(full, ext));
    else if (item.name.endsWith(ext)) results.push(full);
  }
  return results;
}

const files = walk(path.join(__dirname, 'src'), '.tsx');
const regex = /https:\/\/cdn\.shopify\.com\/s\/files\/1\/0950\/7392\/7538\/(?:files|collections)\/([^\s'"\)]+)/g;
const urls = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = regex.exec(content)) !== null) {
    urls.add(m[0]);
  }
}
for (const u of [...urls].sort()) console.log(u);
