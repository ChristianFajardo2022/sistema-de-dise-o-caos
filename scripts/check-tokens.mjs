import fs from 'node:fs';
import path from 'node:path';

/**
 * Falla si el código usa una variable CSS que no existe en src/styles/tokens.css
 * (la fuente de verdad exportada de Figma) ni en src/index.css, ni la declara
 * un componente como variable local.
 */
const root = path.resolve(import.meta.dirname, '..');
const sources = ['src/styles/tokens.css', 'src/index.css'];
const scanDirs = ['src', '.storybook'];
const exts = new Set(['.ts', '.tsx', '.css', '.html']);
const skip = new Set(sources.map((s) => path.join(root, s)));

const defined = new Set();
for (const s of sources) {
  const file = path.join(root, s);
  if (!fs.existsSync(file)) continue;
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return exts.has(path.extname(e.name)) && !skip.has(p) ? [p] : [];
  });
}

const files = scanDirs.flatMap((d) => walk(path.join(root, d)));

// Variables locales que un componente declara con una clase arbitraria de Tailwind ([--btn-icon:…])
for (const file of files) {
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/\[(--[\w-]+):/g)) defined.add(m[1]);
}

const missing = [];
for (const file of files) {
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/var\((--[\w-]+)/g)) {
      if (!defined.has(m[1])) missing.push(`${path.relative(root, file)}:${i + 1}  ${m[1]}`);
    }
  });
}

if (missing.length) {
  console.error(`✗ ${missing.length} usos de variables que no existen en tokens.css:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ tokens: todas las variables usadas existen (${defined.size} definidas)`);
