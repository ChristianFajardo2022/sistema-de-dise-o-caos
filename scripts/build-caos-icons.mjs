import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { optimize } from 'svgo';

/**
 * Genera src/icons/caos/ a partir de icons/caos (biblioteca exportada de Figma).
 *
 * Salida:
 * - icons.generated.ts: un export por ícono ({ name, line, fill }) para importar suelto y que el bundler descarte el resto.
 * - registry.generated.ts: registro completo `caosIcons` + unión `IconName`, para <Icon name="..." />.
 *
 * Cada variante se guarda como el interior del <svg> (solo <path>), ya optimizado con svgo.
 * El <svg> lo arma el componente: viewBox 24, fill="currentColor".
 */
const root = path.resolve(import.meta.dirname, '..');
const src = path.join(root, 'icons/caos');
const out = path.join(root, 'src/icons/caos');
const manifest = JSON.parse(fs.readFileSync(path.join(src, 'manifest.json'), 'utf8'));

const HEADER = '// Generado por scripts/build-caos-icons.mjs a partir de icons/caos. No editar a mano.\n';

const svgoConfig = {
  multipass: true,
  floatPrecision: 2,
  plugins: [
    { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
    'removeDimensions',
  ],
};

/** Interior del svg optimizado; falla si queda algo que no sea <path> (máscaras, clipPath, ids...) */
function inner(file) {
  const { data } = optimize(fs.readFileSync(file, 'utf8'), { path: file, ...svgoConfig });
  if (!data.includes('viewBox="0 0 24 24"')) throw new Error(`${file}: viewBox inesperado`);
  if (/<(mask|clipPath|defs|use|g|linearGradient)\b|\sid=|stroke/.test(data)) throw new Error(`${file}: contenido no soportado`);
  // Color fijo (white, #hex…) no sigue el tema: todo relleno debe ser currentColor o none
  if (/fill="(?!currentColor"|none")[^"]*"/.test(data)) throw new Error(`${file}: color fijo; usar currentColor`);
  const body = data
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')
    // el color y la regla de relleno van una vez en el <svg>; se quitan de cada path
    .replace(/\sfill="currentColor"/g, '')
    .replace(/\sclip-rule="evenodd"/g, '');
  if (!/^(<path[^>]*\/>)+$/.test(body)) throw new Error(`${file}: interior inesperado`);
  return body;
}

const ident = (name) => {
  const camel = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  return `${/^[0-9]/.test(camel) ? '_' : ''}${camel}Icon`;
};

const idents = new Set();
let icons = HEADER + "import type { CaosIconData } from './types';\n\n";
let registry = HEADER + "import type { CaosIconData } from './types';\n";
let regBody = '';
let names = '';
const imports = [];
for (const { name, category } of manifest) {
  const id = ident(name);
  if (idents.has(id)) throw new Error(`Identificador repetido: ${id}`);
  idents.add(id);
  const line = inner(path.join(src, 'line', `${name}.svg`));
  const fill = inner(path.join(src, 'fill', `${name}.svg`));
  icons += `/** ${name} (${category}) */\nexport const ${id}: CaosIconData = { name: ${JSON.stringify(name)}, line: ${JSON.stringify(line)}, fill: ${JSON.stringify(fill)} };\n`;
  imports.push(id);
  regBody += `  ${JSON.stringify(name)}: ${id},\n`;
  names += `  | ${JSON.stringify(name)}\n`;
}
registry += `import {\n${imports.map((i) => `  ${i},`).join('\n')}\n} from './icons.generated';\n\n`;
registry += `/** Nombres de todos los íconos de la biblioteca (${manifest.length}) */\nexport type IconName =\n${names};\n\n`;
registry += `/** Registro completo: importarlo arrastra los ${manifest.length} íconos. Para tree-shaking usa los exports sueltos de icons.generated */\nexport const caosIcons: Record<IconName, CaosIconData> = {\n${regBody}};\n\n`;
registry += `/** Categoría de cada ícono según Figma */\nexport const caosIconCategories: Record<IconName, string> = {\n${manifest.map((m) => `  ${JSON.stringify(m.name)}: ${JSON.stringify(m.category)},`).join('\n')}\n};\n`;

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'icons.generated.ts'), icons);
fs.writeFileSync(path.join(out, 'registry.generated.ts'), registry);
const types = `/** Un ícono de la biblioteca: interior del <svg> (solo <path>) de cada variante, viewBox 24×24 */
export interface CaosIconData {
  name: string;
  /** Variante de línea (Bold line icon) */
  line: string;
  /** Variante rellena (Fill icon) */
  fill: string;
}
`;
fs.writeFileSync(path.join(out, 'types.ts'), types);

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const all = fs.readFileSync(path.join(out, 'icons.generated.ts'));
console.log(`${manifest.length} íconos → src/icons/caos. icons.generated.ts: ${all.length} B (${kb(all.length)}), gzip ${zlib.gzipSync(all).length} B (${kb(zlib.gzipSync(all).length)})`);
