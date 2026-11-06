import tokensCss from '../../styles/tokens.css?raw';
import { px, rawToken, tokensIn } from '../_doc/tokensCss';
import type { TokenBreakpoint } from '../_doc/tokensCss';

/*
 * Datos de la página Formas. Manda `src/styles/tokens.css`: los radios primitivos, los responsive y los grosores de línea
 * se leen de ahí con los lectores de `_doc/tokensCss.ts`. Lo que tokens.css no tiene (los valores de la documentación
 * anterior de Figma) está en `FIGMA` y solo se usa para la auditoría.
 */

/** De menor a mayor, como las columnas de las tablas. */
export const BREAKPOINTS_ASC: { bp: TokenBreakpoint; label: string }[] = [
  { bp: 'mobile', label: 'Mobile' },
  { bp: 'tablet', label: 'Tablet' },
  { bp: 'desktop', label: 'Desktop' },
];

export const RADIUS_PRIMITIVE_PREFIX = '--ds-primitives-radius-';
export const STROKE_PRIMITIVE_PREFIX = '--ds-primitives-stroke-';
export const RESPONSIVE_RADIUS_PREFIX = '--ds-responsive-radius-';
export const RESPONSIVE_BORDER_PREFIX = '--ds-responsive-border-';

/** "16 px", con coma decimal si hace falta. */
export const pxText = (n: number): string => `${String(n).replace('.', ',')} px`;

// ───────────────────────── primitivos ─────────────────────────

export interface Primitive {
  /** Sufijo del token, p. ej. "3xl". */
  key: string;
  /** Variable completa, p. ej. "--ds-primitives-radius-3xl". */
  variable: string;
  value: number;
}

function readPrimitives(prefix: string): Primitive[] {
  const out: Primitive[] = [];
  for (const [variable, value] of tokensIn('base')) {
    if (variable.startsWith(prefix)) out.push({ key: variable.slice(prefix.length), variable, value: parseFloat(value) });
  }
  return out.sort((a, b) => a.value - b.value);
}

/** Radios primitivos de tokens.css, de menor a mayor. */
export const RADII = readPrimitives(RADIUS_PRIMITIVE_PREFIX);
/** Grosores de línea primitivos de tokens.css, de menor a mayor. */
export const STROKES = readPrimitives(STROKE_PRIMITIVE_PREFIX);

/** Valor en px de un radio primitivo por su sufijo ("3xl" → 24). */
export const radiusPx = (key: string): number => px(`${RADIUS_PRIMITIVE_PREFIX}${key}`);

/** Referencia CSS a un radio primitivo; la clave sale de tokens.css. */
export const radiusVar = (key: string): string => `var(${RADIUS_PRIMITIVE_PREFIX}${key})`;

// ───────────────────────── responsivos ─────────────────────────

export type RadiusFamily = 'general' | 'container' | 'field' | 'modal' | 'button';

export const FAMILIES: { family: RadiusFamily; title: string; caption: string }[] = [
  { family: 'general', title: 'General', caption: 'Radios generales por breakpoint' },
  { family: 'container', title: 'Contenedor', caption: 'Radios de contenedor por breakpoint' },
  { family: 'field', title: 'Campo', caption: 'Radios de campos y controles por breakpoint' },
  { family: 'modal', title: 'Modal', caption: 'Radios del modal por breakpoint' },
  { family: 'button', title: 'Botón', caption: 'Radio del botón por breakpoint' },
];

function familyOf(variable: string): RadiusFamily {
  const name = variable.slice(RESPONSIVE_RADIUS_PREFIX.length);
  if (name.startsWith('general-')) return 'general';
  if (name.startsWith('container-')) return 'container';
  if (name.startsWith('modal-')) return 'modal';
  if (name.startsWith('button-')) return 'button';
  return 'field';
}

/** Radio (px) de una variable responsive en un breakpoint. */
export const radiusAt = (variable: string, bp: TokenBreakpoint): number => px(variable, bp);

/** Variables responsive de radio de tokens.css, por familia y de menor a mayor radio en Desktop. */
export function readResponsiveRadii(): Record<RadiusFamily, string[]> {
  const names = new Set<string>();
  for (const scope of ['common', 'tablet', 'desktop'] as const) {
    for (const name of tokensIn(scope).keys()) if (name.startsWith(RESPONSIVE_RADIUS_PREFIX)) names.add(name);
  }
  const out: Record<RadiusFamily, string[]> = { general: [], container: [], field: [], modal: [], button: [] };
  for (const name of names) out[familyOf(name)].push(name);
  for (const list of Object.values(out)) list.sort((a, b) => radiusAt(a, 'desktop') - radiusAt(b, 'desktop') || a.localeCompare(b));
  return out;
}

export const RESPONSIVE = readResponsiveRadii();

/** Variables responsive de borde (grosor de línea) de tokens.css. */
export const BORDERS: string[] = [...tokensIn('common').keys()].filter((k) => k.startsWith(RESPONSIVE_BORDER_PREFIX));

/** Nombre corto sin el prefijo ("radius-container-on-canva"). */
export const shortName = (variable: string): string => variable.replace(/^--ds-responsive-/, '');

/** Primitivo al que apunta una variable responsive en un breakpoint ("radius-3xl"). */
export function primitiveOf(variable: string, bp: TokenBreakpoint): string {
  const raw = rawToken(variable, 'dark', bp) ?? '';
  const ref = raw.match(/^var\(--ds-primitives-(.+)\)$/);
  return ref ? ref[1] : raw;
}

/** Referencia CSS al primitivo al que apunta una variable responsive en un breakpoint (para dibujar a un breakpoint fijo). */
export function radiusVarAt(variable: string, bp: TokenBreakpoint): string {
  return rawToken(variable, 'dark', bp) ?? '0px';
}

/** "24, 16 y 12 px" de Mobile a Desktop; "16 px" si es el mismo en los tres. */
export function serie(variable: string): string {
  const values = BREAKPOINTS_ASC.map(({ bp }) => radiusAt(variable, bp));
  const distinct = values.filter((v, i) => values.indexOf(v) === i);
  if (distinct.length === 1) return pxText(distinct[0]);
  return `${distinct.slice(0, -1).join(', ')} y ${distinct[distinct.length - 1]} px`;
}

/** Variables concretas que usa la página (si una no existe en tokens.css, la consola lo dice). */
export const VARS = {
  onCanva: '--ds-responsive-radius-container-on-canva',
  onCard: '--ds-responsive-radius-container-on-card',
  general: (size: string) => `--ds-responsive-radius-general-${size}`,
  field: (size: string) => `--ds-responsive-radius-field-${size}`,
  full: '--ds-responsive-radius-general-full',
  buttonFull: '--ds-responsive-radius-button-full',
  modalTop: '--ds-responsive-radius-modal-top',
  borderSm: '--ds-responsive-border-general-sm',
  borderMd: '--ds-responsive-border-general-md',
  borderLg: '--ds-responsive-border-general-lg',
} as const;

/** Variable que existe en tokens.css; avisa en la consola si no. */
export function checked(variable: string): string {
  if (rawToken(variable, 'dark') === undefined) console.error(`Formas: la variable ${variable} no está en tokens.css`);
  return variable;
}

// ───────────────────────── utilidades de Tailwind ─────────────────────────

/** Utilidad `rounded-…` de una variable responsive de radio, o undefined si `@theme` no la expone. */
export function radiusUtilityOf(variable: string): string | undefined {
  const m = variable.match(/^--ds-responsive-radius-(.+)$/);
  if (!m) return undefined;
  return tokensIn('theme').has(`--radius-ds-radius-${m[1]}`) ? `rounded-ds-radius-${m[1]}` : undefined;
}

/** Utilidad `rounded-…` de un radio primitivo, o undefined. */
export function radiusPrimitiveUtilityOf(key: string): string | undefined {
  return tokensIn('theme').has(`--radius-ds-primitives-radius-${key}`) ? `rounded-ds-primitives-radius-${key}` : undefined;
}

/** Utilidades `@utility border-ds-…` de tokens.css (ancho de borde). */
const BORDER_UTILITIES = new Set([...tokensCss.matchAll(/@utility (border-ds-[\w-]+)\s*\{/g)].map((m) => m[1]));

/** Utilidad de ancho de borde de un grosor primitivo ("border-ds-primitives-stroke-lg"), o undefined. */
export function strokeUtilityOf(key: string): string | undefined {
  const name = `border-ds-primitives-stroke-${key}`;
  return BORDER_UTILITIES.has(name) ? name : undefined;
}

/** Utilidad de ancho de borde de una variable responsive ("border-ds-border-general-md"), o undefined. */
export function borderUtilityOf(variable: string): string | undefined {
  const m = variable.match(/^--ds-responsive-border-(.+)$/);
  const name = m ? `border-ds-border-${m[1]}` : '';
  return BORDER_UTILITIES.has(name) ? name : undefined;
}

// ───────────────────────── esquema de anidación ─────────────────────────

/**
 * Niveles del esquema de radios anidados. El radio baja con la profundidad. Móvil: contenedor sobre el lienzo, sobre una
 * tarjeta y dos generales. Escritorio: los mismos dos de contenedor (que suben) y los generales de un paso más.
 */
export const NIVELES: Record<'mobile' | 'desktop', { name: string; token: string }[]> = {
  mobile: [
    { name: 'Contenedor madre', token: VARS.onCanva },
    { name: 'Hijo de 2.º nivel', token: VARS.onCard },
    { name: 'Hijo de 3.er nivel', token: VARS.general('lg') },
    { name: 'Hijo de 4.º nivel', token: VARS.general('md') },
  ],
  desktop: [
    { name: 'Contenedor madre', token: VARS.onCanva },
    { name: 'Hijo de 2.º nivel', token: VARS.onCard },
    { name: 'Hijo de 3.er nivel', token: VARS.general('xl') },
    { name: 'Hijo de 4.º nivel', token: VARS.general('lg') },
  ],
};

// ───────────────────────── Figma ─────────────────────────

/** Valores de la documentación anterior de Figma que tokens.css no tiene o dice distinto. Solo sirven a la auditoría. */
export const FIGMA = {
  /** Tabla "Valores de radio de borde". */
  radiusTable: [
    ['radius.xs', 4],
    ['radius.sm', 8],
    ['radius.md', 16],
  ],
  /** Tabla "Valor de línea". */
  strokeTable: [
    ['stroke.xs', 1],
    ['stroke.sm', 2],
    ['stroke.md', 3],
  ],
  /** Texto de "Radio de borde". */
  mobile: [8, 12, 16, 24, 48],
  desktop: [12, 16, 24, 32, 48],
  /** Esquemas anidados dibujados. */
  mobileNested: [24, 16, 12, 8],
  desktopNested: [32, 24, 16, 12],
} as const;
