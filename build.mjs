// Builds ./public for Cloudflare: the single-file app plus headers, robots and a 404 page.
import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';

const out = new URL('./public/', import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

const html = await readFile(new URL('./index.html', import.meta.url), 'utf8');
if (!html.includes('id="specimen-data"')) throw new Error('index.html is missing the specimen data block');
await writeFile(new URL('index.html', out), html);
await cp(new URL('./static/', import.meta.url), out, { recursive: true });

console.log(`built public/ (${(html.length / 1024).toFixed(0)} KB index.html)`);
