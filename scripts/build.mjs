import { cp, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const unique = new Set(ids);
if (unique.size !== ids.length) throw new Error('Duplicate HTML IDs found.');
const paths = new Set();
for (const match of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith('#')) {
    if (!unique.has(value.slice(1))) throw new Error(`Missing anchor: ${value}`);
  } else if (!/^(?:https?:|mailto:|data:)/.test(value)) {
    paths.add(decodeURIComponent(value));
  }
}
for (const file of paths) if (!(await stat(join(root, file))).isFile()) throw new Error(`Missing asset: ${file}`);
const output = join(root, 'dist');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'assets', '.nojekyll', 'LICENSE']) await cp(join(root, file), join(output, file), { recursive: true });
async function count(directory) {
  let total = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) total += entry.isDirectory() ? await count(join(directory, entry.name)) : 1;
  return total;
}
console.log(`Verified ${unique.size} unique IDs, all internal anchors, and ${paths.size} linked local assets.`);
console.log(`Built ${await count(output)} static files in dist/. Ready for GitHub Pages.`);
