import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
const entry = html.match(/<script\b[^>]*\bsrc="(\.\/assets\/[^"\s]+\.js)"[^>]*><\/script>/);
const style = html.match(/<link\b[^>]*\bhref="(\.\/assets\/[^"\s]+\.css)"[^>]*>/);
if (!entry || !style) throw new Error('Could not find bundled JavaScript and CSS. Run npm run build first.');

const [js, css] = await Promise.all([
  readFile(new URL(entry[1], dist), 'utf8'),
  readFile(new URL(style[1], dist), 'utf8'),
]);
const standalone = html
  .replace(entry[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`)
  .replace(style[0], () => `<style>${css}</style>`);
const target = resolve(process.argv[2] ?? 'dist/preview.html');
await writeFile(target, standalone);
console.log(`Preview: ${target}`);
