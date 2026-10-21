import fs from 'node:fs';
import path from 'node:path';
import { transform } from '@svgr/core';

/**
 * Convierte los SVG exportados de Figma (icons/svg/*.svg, biblioteca depurada,
 * nodo 9265:10513 de CAOS _ AX) en componentes React del sistema:
 * src/icons/<Nombre>Icon.tsx, 20px por defecto y color por currentColor.
 *
 * Uso: node scripts/build-icons.mjs
 * El nombre del archivo da el del componente: arrow-right.svg → ArrowRightIcon.
 *
 * Mínimo para Button (hoy con lucide en stories y App): add, arrow-right, trash, setting.
 */
const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'icons/svg');
const outDir = path.join(root, 'src/icons');

const toPascal = (name) =>
  name.replace(/\.svg$/, '').split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('');

// Cualquier color fijo de fill o stroke pasa a currentColor; "none" se respeta
const toCurrentColor = (svg) =>
  svg.replace(/\b(fill|stroke)="(?!none")[^"]*"/g, '$1="currentColor"');

const files = fs.existsSync(srcDir) ? fs.readdirSync(srcDir).filter((f) => f.endsWith('.svg')) : [];
if (files.length === 0) {
  console.error(`No hay SVG en ${path.relative(root, srcDir)}/. Exporta los íconos de Figma ahí.`);
  process.exit(1);
}

for (const file of files) {
  const name = `${toPascal(file)}Icon`;
  const svg = toCurrentColor(fs.readFileSync(path.join(srcDir, file), 'utf8'));
  const code = await transform(
    svg,
    {
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      typescript: true,
      dimensions: false,
      svgProps: { width: '20', height: '20', 'aria-hidden': 'true', focusable: 'false' },
      svgoConfig: {
        plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }],
      },
      jsxRuntime: 'automatic',
      exportType: 'named',
      namedExport: name,
      template: ({ jsx, componentName, interfaces, props, imports }, { tpl }) => tpl`
${imports}
${interfaces}
export function ${componentName}(${props}: SVGProps<SVGSVGElement>) {
  return ${jsx};
}
`,
    },
    { componentName: name },
  );
  fs.writeFileSync(path.join(outDir, `${name}.tsx`), code);
  console.log(`${file} → src/icons/${name}.tsx`);
}
