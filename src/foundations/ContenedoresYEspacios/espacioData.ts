import { px, rawToken, stripPx, tokensIn } from '../_doc/tokensCss';
import type { TokenBreakpoint } from '../_doc/tokensCss';

/*
 * Datos de la página Contenedores y espacios. Manda `src/styles/tokens.css`: la escala primitiva, los espacios
 * responsivos y los padding de contenedor se leen de ahí con los lectores de `_doc/tokensCss.ts`. Lo que tokens.css no
 * tiene (la escala de la documentación anterior de Figma) está en `FIGMA` y solo se usa para la auditoría.
 */

/** De menor a mayor, como las columnas de las tablas. */
export const BREAKPOINTS_ASC: { bp: TokenBreakpoint; label: string }[] = [
  { bp: 'mobile', label: 'Mobile' },
  { bp: 'tablet', label: 'Tablet' },
  { bp: 'desktop', label: 'Desktop' },
];

/** Desktop arriba, como en la página de Retículas. */
export const BREAKPOINTS = [...BREAKPOINTS_ASC].reverse();

export const PRIMITIVE_PREFIX = '--ds-primitives-space-';
export const RESPONSIVE_PREFIX = '--ds-responsive-';

export interface PrimitiveSpace {
  /** Sufijo del token, p. ej. "2xl". */
  key: string;
  /** Variable completa, p. ej. "--ds-primitives-space-2xl". */
  variable: string;
  value: number;
}

/** Escala de espacios primitivos de tokens.css, de menor a mayor. */
export function readPrimitiveSpaces(): PrimitiveSpace[] {
  const out: PrimitiveSpace[] = [];
  for (const [variable, value] of tokensIn('base')) {
    const m = variable.match(/^--ds-primitives-space-(.+)$/);
    if (m) out.push({ key: m[1], variable, value: parseFloat(value) });
  }
  return out.sort((a, b) => a.value - b.value);
}

export const SCALE = readPrimitiveSpaces();

/** Primitivo de un valor ("space-2xl") o undefined. */
export function primitiveByValue(value: number): PrimitiveSpace | undefined {
  return SCALE.find((s) => s.value === value);
}

/** Valor en px de un primitivo por su sufijo ("6xl" → 40). */
export const primitivePx = (key: string): number => px(`${PRIMITIVE_PREFIX}${key}`);

/** "16 px", con coma decimal si hace falta. */
export const pxText = (n: number): string => `${String(n).replace('.', ',')} px`;

/** Referencia CSS a un primitivo; la clave sale de la escala de tokens.css. */
export const primitiveVar = (key: string): string => `var(${PRIMITIVE_PREFIX}${key})`;

// ───────────────────────── responsivos ─────────────────────────

export type SpaceFamily = 'general' | 'container' | 'canva' | 'component';

export const FAMILIES: { family: SpaceFamily; title: string; caption: string }[] = [
  { family: 'general', title: 'General', caption: 'Espacios generales por breakpoint' },
  { family: 'container', title: 'Contenedor', caption: 'Padding de contenedores por breakpoint' },
  { family: 'canva', title: 'Lienzo', caption: 'Márgenes del lienzo por breakpoint' },
  { family: 'component', title: 'Componente', caption: 'Espacios de componentes por breakpoint' },
];

function familyOf(variable: string): SpaceFamily {
  const name = variable.slice(RESPONSIVE_PREFIX.length);
  if (name.startsWith('space-general-')) return 'general';
  if (name.startsWith('space-container-')) return 'container';
  if (name.startsWith('space-canva-')) return 'canva';
  return 'component';
}

/** Orden de las tallas: xs, sm, md, lg, xl, 2xl, 3xl… */
function sizeRank(variable: string): number {
  const size = variable.split('-').pop() ?? '';
  const named = ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(size);
  if (named >= 0) return named;
  const n = size.match(/^(\d+)xl$/);
  return n ? 4 + Number(n[1]) : 99;
}

/** Variables responsivas de espacio de tokens.css (`space-*` y `gap-*`), por familia. */
export function readResponsiveSpaces(): Record<SpaceFamily, string[]> {
  const names = new Set<string>();
  for (const scope of ['common', 'tablet', 'desktop'] as const) {
    for (const name of tokensIn(scope).keys()) {
      if (/^--ds-responsive-(space|gap)-/.test(name)) names.add(name);
    }
  }
  const out: Record<SpaceFamily, string[]> = { general: [], container: [], canva: [], component: [] };
  for (const name of names) out[familyOf(name)].push(name);
  out.general.sort((a, b) => sizeRank(a) - sizeRank(b));
  out.container.sort((a, b) => a.localeCompare(b));
  out.canva.sort((a, b) => a.localeCompare(b));
  const group = (v: string) => v.slice(0, v.lastIndexOf('-'));
  out.component.sort((a, b) => group(a).localeCompare(group(b)) || sizeRank(a) - sizeRank(b));
  return out;
}

export const RESPONSIVE = readResponsiveSpaces();

/** Nombre corto sin el prefijo ("space-general-2xl"). */
export const shortName = (variable: string): string => variable.slice(RESPONSIVE_PREFIX.length);

/** Primitivo al que apunta una variable responsiva en un breakpoint ("space-2xl"); si no apunta a uno, el valor tal cual. */
export function primitiveOf(variable: string, bp: TokenBreakpoint): string {
  const raw = rawToken(variable, 'dark', bp) ?? '';
  const ref = raw.match(/^var\(--ds-primitives-(.+)\)$/);
  return ref ? ref[1] : stripPx(raw);
}

/** Valor en px de una variable responsiva en un breakpoint. */
export const spaceAt = (variable: string, bp: TokenBreakpoint): number => px(variable, bp);

/** "16, 24 y 32 px" de Mobile a Desktop; "16 px" si es el mismo en los tres. */
export function serie(variable: string): string {
  const values = BREAKPOINTS_ASC.map(({ bp }) => spaceAt(variable, bp));
  if (values.every((v) => v === values[0])) return pxText(values[0]);
  return `${values.slice(0, -1).join(', ')} y ${values[values.length - 1]} px`;
}

/** Variables concretas que usa la página (si una no existe en tokens.css, la consola lo dice). */
export const VARS = {
  onCanva: '--ds-responsive-space-container-on-canva',
  onCanvaStretch: '--ds-responsive-space-container-on-canva-stretch',
  onCard: '--ds-responsive-space-container-on-card',
  onCardStretch: '--ds-responsive-space-container-on-card-stretch',
  lateral: '--ds-responsive-space-canva-lateral',
  lateralWeb: '--ds-responsive-space-canva-lateral-web',
  top: '--ds-responsive-space-canva-top',
  bottom: '--ds-responsive-space-canva-bottom',
  general: (size: string) => `--ds-responsive-space-general-${size}`,
} as const;

/** Variable de espacio que existe en tokens.css; avisa en la consola si no. */
export function checked(variable: string): string {
  if (rawToken(variable, 'dark') === undefined) console.error(`Contenedores y espacios: la variable ${variable} no está en tokens.css`);
  return variable;
}

/**
 * Sufijo de la utilidad de Tailwind de una variable responsiva de espacio ("ds-space-general-2xl" para
 * `--ds-responsive-space-general-2xl`), o undefined si `@theme` no la expone como espaciado.
 */
export function utilityOf(variable: string): string | undefined {
  const m = variable.match(/^--ds-responsive-space-(.+)$/);
  if (!m) return undefined;
  const key = `--spacing-ds-space-${m[1]}`;
  return tokensIn('theme').has(key) ? `ds-space-${m[1]}` : undefined;
}

/** Sufijo de la utilidad de un primitivo ("ds-primitives-space-2xl"), o undefined. */
export function primitiveUtilityOf(key: string): string | undefined {
  return tokensIn('theme').has(`--spacing-ds-primitives-space-${key}`) ? `ds-primitives-space-${key}` : undefined;
}

// ───────────────────────── Figma ─────────────────────────

/**
 * Valores de la documentación anterior de Figma que tokens.css no tiene o dice distinto. Solo sirven a la auditoría.
 */
export const FIGMA = {
  /** Gráfica de equivalencias y tabla "Valores de token". */
  scale: [4, 8, 16, 24, 32, 40, 56, 64, 80, 120, 160, 240],
  /** Rango que dice el texto de "Valores de token". */
  rangeText: '4 px a 80 px',
  /** Padding de los cuatro niveles del esquema de jerarquía. */
  levels: [56, 40, 24, 24],
} as const;

/** Niveles del esquema de jerarquía: el padding de cada uno es un primitivo de la escala (56, 40, 24 y 24 px). */
export const NIVELES = [
  { name: 'Contenedor madre', pad: '7xl', className: 'bg-ds-background-graphic-error-secondary-opacity' },
  { name: 'Contenedor hijo de 2.º nivel', pad: '6xl', className: 'bg-ds-background-graphic-alert-secondary-opacity' },
  { name: 'Contenedor hijo de 3.er nivel', pad: '4xl', className: 'bg-ds-background-graphic-success-secondary-opacity' },
  { name: 'Contenedor hijo de 4.º nivel', pad: '4xl', className: 'bg-ds-background-graphic-information-secondary-opacity' },
] as const;

/** Niveles con el valor de su padding leído de tokens.css. */
export const NIVELES_PADDING = NIVELES.map((n) => ({ ...n, value: primitivePx(n.pad) }));
