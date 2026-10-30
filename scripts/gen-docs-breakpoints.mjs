import fs from 'node:fs';
import path from 'node:path';

/**
 * Genera src/docs/breakpoints.generated.ts: los valores de las variables `--ds-responsive-*` (y las de color
 * `--color-ds-responsive-*`) de cada breakpoint, leídos de src/styles/tokens.css. Los usa el marco de dispositivo de la
 * documentación (bloque `breakpoints`) para mostrar un componente con los valores de Mobile, Tablet o Desktop sin
 * depender del ancho de la ventana. Solo salen las variables que cambian entre breakpoints.
 * Uso: `npm run build:docs-breakpoints`. No editar el .ts generado a mano.
 */
const root = path.resolve(import.meta.dirname, '..');
const css = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');

const base = {};
const tablet = {};
const desktop = {};
let media = null; // 'tablet' | 'desktop' | null
let mediaDepth = 0;
let depth = 0;

for (const line of css.split('\n')) {
  const m = line.match(/@media \(width >= (\d+)rem\)/);
  if (m && line.includes('{')) {
    media = m[1] === '48' ? 'tablet' : m[1] === '64' ? 'desktop' : null;
    mediaDepth = depth;
  }
  const decl = line.match(/^\s*(--(?:color-)?ds-responsive-[\w-]+):\s*(.+?);\s*$/);
  if (decl) {
    const target = media === 'tablet' ? tablet : media === 'desktop' ? desktop : base;
    target[decl[1]] = decl[2];
  }
  for (const ch of line) {
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (media && depth === mediaDepth) media = null;
    }
  }
}

const mobile = base;
const tabletAll = { ...base, ...tablet };
const desktopAll = { ...tabletAll, ...desktop };
const changing = [...new Set([...Object.keys(tablet), ...Object.keys(desktop)])].sort();
const pick = (all) => Object.fromEntries(changing.map((k) => [k, all[k]]));

const out = `// Generado por scripts/gen-docs-breakpoints.mjs (\`npm run build:docs-breakpoints\`) desde src/styles/tokens.css. No editar a mano.
// Variables responsive que cambian entre breakpoints, con el valor de cada uno (Mobile base, Tablet 48rem, Desktop 64rem).

export type DocBreakpointName = 'mobile' | 'tablet' | 'desktop';

export const BREAKPOINT_VARS: Record<DocBreakpointName, Record<string, string>> = ${JSON.stringify(
  { mobile: pick(mobile), tablet: pick(tabletAll), desktop: pick(desktopAll) },
  null,
  2,
)};
`;
fs.writeFileSync(path.join(root, 'src/docs/breakpoints.generated.ts'), out);
console.log(`breakpoints.generated.ts: ${changing.length} variables`);
