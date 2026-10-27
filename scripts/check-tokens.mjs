import fs from 'node:fs';
import path from 'node:path';

/**
 * Falla si el código usa:
 *  1. una variable CSS (`var(--x)`) que no existe en src/styles/tokens.css (la fuente de verdad exportada de
 *     Figma) ni en src/index.css, ni la declara un componente como variable local;
 *  2. una clase `*-ds-*` (p. ej. `bg-ds-…`, `p-ds-…`, `rounded-ds-…`) que no exista en `@theme`/`@utility`.
 *     Tailwind no avisa cuando una utilidad deja de generarse: la clase simplemente no hace nada.
 */
const root = path.resolve(import.meta.dirname, '..');
const sources = ['src/styles/tokens.css', 'src/index.css'];
const scanDirs = ['src', '.storybook'];
const exts = new Set(['.ts', '.tsx', '.css', '.html']);
const classExts = new Set([...exts, '.json', '.mdx', '.md']);
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
    return classExts.has(path.extname(e.name)) && !skip.has(p) ? [p] : [];
  });
}

const allFiles = scanDirs.flatMap((d) => walk(path.join(root, d)));
const files = allFiles.filter((f) => exts.has(path.extname(f)));

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

// ── Clases *-ds-* ──
const tokensCss = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');
const themeBlock = tokensCss.slice(tokensCss.indexOf('@theme inline'), tokensCss.indexOf('@utility'));
// Claves del @theme: --<namespace>-ds-<resto>
const themeKeys = new Map(); // namespace -> Set(resto)
for (const m of themeBlock.matchAll(/^\s*--((?:font-weight|[a-z]+))-ds-([a-z0-9-]+)\s*:/gm)) {
  if (!themeKeys.has(m[1])) themeKeys.set(m[1], new Set());
  themeKeys.get(m[1]).add(m[2]);
}
const utilities = new Set([...tokensCss.matchAll(/^@utility\s+([\w-]+)/gm)].map((m) => m[1]));

// Utilidad -> namespaces de @theme que la alimentan (lo que no está aquí acepta cualquier namespace)
const COLOR_UTILS = new Set(['bg', 'border', 'outline', 'ring', 'fill', 'stroke', 'divide', 'from', 'via', 'to', 'decoration', 'caret', 'accent', 'placeholder', 'inset-ring', 'ring-offset', 'drop-shadow']);
function namespacesFor(util) {
  const base = util.replace(/-(x|y|t|r|b|l|s|e)$/, '');
  if (COLOR_UTILS.has(util) || COLOR_UTILS.has(base)) return ['color'];
  if (util === 'text') return ['color', 'text'];
  if (util === 'font') return ['font', 'font-weight'];
  if (util === 'leading') return ['leading'];
  if (util === 'shadow') return ['shadow', 'color'];
  if (/^rounded/.test(util)) return ['radius'];
  if (/^(p[xytrbse]?|m[xytrbse]?|gap(-[xy])?|space-[xy]|size|w|h|min-[wh]|max-[wh]|inset(-[xy])?|top|right|bottom|left|translate(-[xy])?|basis|indent|scroll-[mp][xytrbse]?)$/.test(util)) return ['spacing'];
  return null;
}

const brokenClasses = [];
const classRe = /(?<![\w-])(-?)([a-z][a-z0-9]*(?:-[a-z0-9]+)*?)-ds-([a-z0-9][a-z0-9-]*)/g;
for (const file of allFiles) {
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(classRe)) {
      const util = m[2];
      const rest = m[3].replace(/-+$/, '');
      if (m[3].endsWith('-')) continue; // nombre armado con ${…}
      if (utilities.has(`${util}-ds-${rest}`)) continue;
      const nss = namespacesFor(util) ?? [...themeKeys.keys()];
      if (nss.some((ns) => themeKeys.get(ns)?.has(rest))) continue;
      brokenClasses.push(`${path.relative(root, file)}:${i + 1}  ${m[0]}`);
    }
  });
}

let failed = false;
if (missing.length) {
  failed = true;
  console.error(`✗ ${missing.length} usos de variables que no existen en tokens.css:\n  ${missing.join('\n  ')}`);
}
if (brokenClasses.length) {
  failed = true;
  console.error(`✗ ${brokenClasses.length} clases *-ds-* que no existen en @theme ni en @utility de tokens.css:\n  ${brokenClasses.join('\n  ')}`);
}
if (failed) process.exit(1);
console.log(`✓ tokens: todas las variables y clases *-ds-* usadas existen (${defined.size} variables definidas)`);
