/**
 * Datos de Tipografía leídos de `src/styles/tokens.css` (con `tokensCss.ts`): valores por breakpoint, alias al
 * primitivo y el catálogo de estilos de texto de Figma expresado con los tokens que usa cada uno.
 *
 * Nada de valores escritos a mano: cada cifra de las tablas sale de aquí. Lo que no es un valor (nombre del estilo en
 * Figma, uso recomendado, scopes de las variables en Figma) es contenido de la documentación.
 */
import { rawToken, resolveToken, tokensIn } from '../_doc/tokensCss';
import type { TokenBreakpoint } from '../_doc/tokensCss';

export const BREAKPOINTS: { bp: TokenBreakpoint; label: string }[] = [
  { bp: 'desktop', label: 'Desktop' },
  { bp: 'tablet', label: 'Tablet' },
  { bp: 'mobile', label: 'Mobile' },
];

const PRIMITIVE = '--ds-primitives-typography-';
const RESPONSIVE = '--ds-responsive-typography-';

/** Orden de las tallas de los tokens (xs → 14xl); `md-uniform` va justo después de `md`. */
const SIZE_ORDER = ['xs', 'sm', 'md', 'md-uniform', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl', '13xl', '14xl'];
const sizeRank = (name: string) => SIZE_ORDER.indexOf(name.split('-').pop() === 'uniform' ? 'md-uniform' : name.split('-').pop()!);

/** Número con coma decimal y hasta `digits` decimales (1,125 · 112,5). */
export function decimal(value: number, digits = 4): string {
  return String(Math.round(value * 10 ** digits) / 10 ** digits).replace('.', ',');
}

/** Valor numérico en px de un token en un breakpoint, o `undefined` si no existe. */
export function tokenPx(name: string, bp: TokenBreakpoint = 'desktop'): number | undefined {
  const value = resolveToken(name, 'dark', bp);
  return value === undefined ? undefined : parseFloat(value);
}

/** Nombre de Figma de una variable CSS: `--ds-responsive-typography-body-size-lg` → `typography/body/size/lg`. */
export function figmaName(cssVar: string): string {
  const rest = cssVar.replace(/^--ds-(?:primitives|responsive)-typography-/, '');
  const m = rest.match(/^(heading|body|field|button|interaction)-(size|line-height-large|line-height-short|line-height|font-size|font-line-height)-(.+)$/);
  if (m) return `typography/${m[1]}/${m[2]}/${m[3]}`;
  const p = rest.match(/^(family|weight|style|size|line-height|spacing)-(.+)$/);
  return p ? `typography/${p[1]}/${p[2]}` : `typography/${rest}`;
}

/** Primitivo al que apunta una variable responsive en un breakpoint, abreviado como en Figma (`size/2xl`). */
export function aliasOf(cssVar: string, bp: TokenBreakpoint): string | undefined {
  const raw = rawToken(cssVar, 'dark', bp);
  const m = raw?.match(/^var\(--ds-primitives-typography-(size|line-height)-(.+)\)$/);
  return m ? `${m[1]}/${m[2]}` : undefined;
}

// ───────────────────────── variables ─────────────────────────

/** Variables primitivas de un grupo (`family`, `weight`, `style`, `size`, `line-height`, `spacing`), en orden de talla. */
export function primitiveVars(group: string): string[] {
  const prefix = `${PRIMITIVE}${group}-`;
  const unique = [...tokensIn('base').keys()].filter((k) => k.startsWith(prefix));
  if (group === 'family') return unique.sort((a, b) => Number(!a.endsWith('primary')) - Number(!b.endsWith('primary')));
  if (group === 'weight') return unique.sort((a, b) => (tokenPx(a) ?? 0) - (tokenPx(b) ?? 0));
  if (group === 'style') return ['regular-italic', 'semibold-italic', 'bold-italic'].map((s) => `${prefix}${s}`).filter((k) => unique.includes(k));
  return unique.sort((a, b) => sizeRank(a) - sizeRank(b));
}

/** Valor de un primitivo como texto: "Helvetica Neue", "300", "16 px". */
export function primitiveValue(cssVar: string): string {
  const raw = resolveToken(cssVar, 'dark', 'desktop') ?? '';
  if (/px$/.test(raw)) return `${parseFloat(raw)} px`;
  return raw.replace(/^"|"$/g, '');
}

/**
 * Variables responsive de una o varias categorías, en el orden de Figma: tamaños y luego cada interlineado, de la
 * talla menor a la mayor. `kinds` filtra y ordena las familias de la variable (`size`, `line-height`…).
 */
export function responsiveVars(category: string, kinds: string[]): string[] {
  const all = new Set<string>();
  for (const scope of ['common', 'tablet', 'desktop'] as const) {
    for (const key of tokensIn(scope).keys()) if (key.startsWith(`${RESPONSIVE}${category}-`)) all.add(key);
  }
  return kinds.flatMap((kind) =>
    [...all]
      .filter((k) => {
        const rest = k.slice(`${RESPONSIVE}${category}-`.length);
        if (!rest.startsWith(`${kind}-`)) return false;
        const talla = rest.slice(kind.length + 1);
        return SIZE_ORDER.includes(talla);
      })
      .sort((a, b) => sizeRank(a) - sizeRank(b)),
  );
}

/** Celda de una variable responsive en un breakpoint: "20 ← size/2xl". */
export function responsiveCell(cssVar: string, bp: TokenBreakpoint): string {
  const value = tokenPx(cssVar, bp);
  const alias = aliasOf(cssVar, bp);
  if (value === undefined) return '—';
  return alias ? `${value} ← ${alias}` : String(value);
}

// ───────────────────────── estilos de texto ─────────────────────────

export type StyleFamily = 'primary' | 'secondary';
export type StyleWeight = 'regular' | 'semibold' | 'bold';

/** Estilo de texto de Figma con los tokens que lo arman en código. */
export interface TextStyleDef {
  /** Nombre del estilo local en Figma, tal cual. */
  name: string;
  family: StyleFamily;
  weight: StyleWeight;
  /** Variable CSS del tamaño. */
  size: string;
  /** Variable CSS del interlineado; sin ella, el interlineado es automático (Button). */
  lineHeight?: string;
  /** Uso recomendado. */
  use: string;
}

const h = (t: string) => `${RESPONSIVE}heading-${t}`;
const b = (t: string) => `${RESPONSIVE}body-${t}`;
const f = (t: string) => `${RESPONSIVE}field-${t}`;
const p = (t: string) => `${PRIMITIVE}${t}`;

const SUBSECTION = 'Subsecciones y títulos compactos';
const TITLE = 'Títulos de página o sección';
const DISPLAY = 'Protagonismo visual breve';
const READING = 'Párrafos de lectura continua';
const READING_BOLD = 'Énfasis dentro de la lectura';
const DATA = 'Datos, tablas y apoyo breve';
const ACTION = 'Texto de acción; el tamaño no es el área táctil';
const FIELD = 'Etiqueta o dato de formulario';

/*
 * Tokens de cada estilo. Figma confirma: Heading-md-600 = heading/size/lg + line-height/lg; Heading-xl-600 =
 * heading/size/2xl + line-height/2xl; Body/Large text/Body-md-400 = body/size/lg + line-height-large/lg; Heading-3xl-600
 * y Display-sm-700 = tamaño primitivo 48 con interlineado responsive; Display-md-700 y Body/Short 20/24 = primitivos.
 * El resto se enlaza con la variable de su categoría y talla que da el valor de Desktop de Figma (coincide con las
 * variables que Figma marca como usadas por los estilos).
 */
export const HEADING_STYLES: TextStyleDef[] = [
  { name: 'Heading/subheading-xs-600', family: 'secondary', weight: 'semibold', size: h('size-xs'), lineHeight: h('line-height-xs'), use: SUBSECTION },
  { name: 'Heading/subheading-xs-600', family: 'secondary', weight: 'semibold', size: h('size-sm'), lineHeight: h('line-height-sm'), use: SUBSECTION },
  { name: 'Heading/Subheading-sm-600', family: 'secondary', weight: 'semibold', size: h('size-md'), lineHeight: h('line-height-md'), use: SUBSECTION },
  { name: 'Heading/Heading-md-600', family: 'secondary', weight: 'semibold', size: h('size-lg'), lineHeight: h('line-height-lg'), use: TITLE },
  { name: 'Heading/Heading-lg-600', family: 'secondary', weight: 'semibold', size: h('size-xl'), lineHeight: h('line-height-xl'), use: TITLE },
  { name: 'Heading/Heading-xl-600', family: 'secondary', weight: 'semibold', size: h('size-2xl'), lineHeight: h('line-height-2xl'), use: TITLE },
  { name: 'Heading/Heading-3xl-600', family: 'secondary', weight: 'semibold', size: p('size-6xl'), lineHeight: h('line-height-3xl'), use: TITLE },
  { name: 'Heading/Heading-4xl-600', family: 'secondary', weight: 'semibold', size: h('size-5xl'), lineHeight: h('line-height-5xl'), use: TITLE },
  { name: 'Heading/Display-sm-700', family: 'secondary', weight: 'bold', size: p('size-6xl'), lineHeight: h('line-height-3xl'), use: DISPLAY },
  { name: 'Heading/Display-md-700', family: 'secondary', weight: 'bold', size: p('size-7xl'), lineHeight: p('line-height-11xl'), use: DISPLAY },
  { name: 'Heading/Display-lg-700', family: 'secondary', weight: 'bold', size: h('size-5xl'), lineHeight: h('line-height-5xl'), use: DISPLAY },
  { name: 'Heading/Display-lg-700', family: 'secondary', weight: 'bold', size: h('size-6xl'), lineHeight: h('line-height-6xl'), use: DISPLAY },
];

export const BODY_STYLES: TextStyleDef[] = [
  { name: 'Body/Large text/Body-xs-400', family: 'primary', weight: 'regular', size: b('size-sm'), lineHeight: b('line-height-large-sm'), use: READING },
  { name: 'Body/Large text/Body-xs-600', family: 'primary', weight: 'semibold', size: b('size-sm'), lineHeight: b('line-height-large-sm'), use: READING_BOLD },
  { name: 'Body/Large text/Body-sm-400', family: 'primary', weight: 'regular', size: b('size-md'), lineHeight: b('line-height-large-md'), use: READING },
  { name: 'Body/Large text/Body-sm-600', family: 'primary', weight: 'semibold', size: b('size-md'), lineHeight: b('line-height-large-md'), use: READING_BOLD },
  { name: 'Body/Large text/Body-md-400', family: 'primary', weight: 'regular', size: b('size-lg'), lineHeight: b('line-height-large-lg'), use: READING },
  { name: 'Body/Large text/Body-md-600', family: 'primary', weight: 'semibold', size: b('size-lg'), lineHeight: b('line-height-large-lg'), use: READING_BOLD },
  { name: 'Body/Large text/Body-lg-400', family: 'primary', weight: 'regular', size: b('size-xl'), lineHeight: b('line-height-large-xl'), use: READING },
  { name: 'Body/Large text/Body-lg-600', family: 'primary', weight: 'semibold', size: b('size-xl'), lineHeight: b('line-height-large-xl'), use: READING_BOLD },
  { name: 'Body/Large text/Body-lg-400', family: 'primary', weight: 'regular', size: b('size-2xl'), lineHeight: b('line-height-large-2xl'), use: READING },
  { name: 'Body/Large text/Body-lg-600', family: 'primary', weight: 'semibold', size: b('size-2xl'), lineHeight: b('line-height-large-2xl'), use: READING_BOLD },
  { name: 'Body/Short text/Body-xs-400', family: 'primary', weight: 'regular', size: b('size-xs'), lineHeight: b('line-height-short-xs'), use: 'Microtexto; revisa la legibilidad' },
  { name: 'Body/Short text/Body-xs-400', family: 'primary', weight: 'regular', size: b('size-sm'), lineHeight: b('line-height-short-sm'), use: DATA },
  { name: 'Body/Short text/Body-xs-600', family: 'primary', weight: 'semibold', size: b('size-sm'), lineHeight: b('line-height-short-sm'), use: DATA },
  { name: 'Body/Short text/Body-sm-400', family: 'primary', weight: 'regular', size: b('size-md'), lineHeight: b('line-height-short-md'), use: DATA },
  { name: 'Body/Short text/Body-sm-600', family: 'primary', weight: 'semibold', size: b('size-md'), lineHeight: b('line-height-short-md'), use: DATA },
  { name: 'Body/Short text/Body-md-400', family: 'primary', weight: 'regular', size: b('size-lg'), lineHeight: b('line-height-short-lg'), use: DATA },
  { name: 'Body/Short text/Body-md-600', family: 'primary', weight: 'semibold', size: b('size-lg'), lineHeight: b('line-height-short-lg'), use: DATA },
  { name: 'Body/Short text/Body-lg-400', family: 'primary', weight: 'regular', size: b('size-xl'), lineHeight: b('line-height-short-xl'), use: DATA },
  { name: 'Body/Short text/Body-lg-600', family: 'primary', weight: 'semibold', size: b('size-xl'), lineHeight: b('line-height-short-xl'), use: DATA },
  { name: 'Body/Short text/Body-lg-400', family: 'primary', weight: 'regular', size: p('size-2xl'), lineHeight: p('line-height-3xl'), use: DATA },
  { name: 'Body/Short text/Body-lg-600', family: 'primary', weight: 'semibold', size: p('size-2xl'), lineHeight: p('line-height-3xl'), use: DATA },
];

const bt = (t: string) => `${RESPONSIVE}button-${t}`;

export const BUTTON_STYLES: TextStyleDef[] = [
  { name: 'Button/Button-sm-400', family: 'primary', weight: 'regular', size: bt('size-sm'), use: ACTION },
  { name: 'Button/Button-sm-600', family: 'primary', weight: 'semibold', size: bt('size-sm'), use: ACTION },
  { name: 'Button/Button-md-400', family: 'primary', weight: 'regular', size: bt('size-md'), use: ACTION },
  { name: 'Button/Button-md-600', family: 'primary', weight: 'semibold', size: bt('size-md'), use: ACTION },
  { name: 'Button/Button-md-600-uni', family: 'primary', weight: 'semibold', size: bt('size-md-uniform'), use: 'Texto de acción con el mismo tamaño en todos los breakpoints' },
  { name: 'Button/Button-md-400-uni', family: 'primary', weight: 'regular', size: bt('size-md-uniform'), use: 'Texto de acción con el mismo tamaño en todos los breakpoints' },
  { name: 'Button/Button-md-600-underline', family: 'primary', weight: 'semibold', size: bt('size-md'), use: 'Acción con texto subrayado' },
  { name: 'Button/Button-md-600-underline-color', family: 'primary', weight: 'semibold', size: bt('size-md'), use: 'Acción con texto subrayado' },
];

export const FIELD_STYLES: TextStyleDef[] = [
  { name: 'Field/Field-xs-600', family: 'primary', weight: 'semibold', size: f('size-xs'), lineHeight: f('line-height-xs'), use: FIELD },
  { name: 'Field/Field-xs-400', family: 'primary', weight: 'regular', size: f('size-xs'), lineHeight: f('line-height-xs'), use: FIELD },
  { name: 'Field/Field-sm-600', family: 'primary', weight: 'semibold', size: f('size-sm'), lineHeight: f('line-height-sm'), use: FIELD },
  { name: 'Field/Field-sm-400', family: 'primary', weight: 'regular', size: f('size-sm'), lineHeight: f('line-height-sm'), use: FIELD },
  { name: 'Field/Field-md-600', family: 'primary', weight: 'semibold', size: f('size-md'), lineHeight: f('line-height-md'), use: FIELD },
  { name: 'Field/Field-md-400', family: 'primary', weight: 'regular', size: f('size-md'), lineHeight: f('line-height-md'), use: FIELD },
  { name: 'Field/Field-lg-600', family: 'primary', weight: 'semibold', size: f('size-xl'), lineHeight: f('line-height-xl'), use: 'Peso sin resolver en Figma: lee la nota de abajo' },
  { name: 'Field/Field-lg-400', family: 'primary', weight: 'regular', size: f('size-xl'), lineHeight: f('line-height-xl'), use: FIELD },
  { name: 'Field/Field-lg-400', family: 'primary', weight: 'regular', size: f('size-3xl'), lineHeight: f('line-height-3xl'), use: 'Dato destacado, como un precio' },
];

/** Nombre de la familia (de `typography/family/*`), sin comillas. */
export function familyName(family: StyleFamily): string {
  return (resolveToken(`${PRIMITIVE}family-${family}`, 'dark') ?? '').replace(/^"|"$/g, '');
}

const WEIGHT_LABEL: Record<StyleWeight, string> = { regular: 'Regular', semibold: 'Semibold', bold: 'Bold' };

/** "Semibold 600" a partir del token de peso. */
export function weightLabel(weight: StyleWeight): string {
  return `${WEIGHT_LABEL[weight]} ${resolveToken(`${PRIMITIVE}weight-${weight}`, 'dark') ?? ''}`.trim();
}

/** Tamaño e interlineado de un estilo en un breakpoint: "32 / 36 px" o "14 px · automático". */
export function sizeLine(style: Pick<TextStyleDef, 'size' | 'lineHeight'>, bp: TokenBreakpoint = 'desktop'): string {
  const size = tokenPx(style.size, bp);
  if (!style.lineHeight) return `${size} px · automático`;
  return `${size} / ${tokenPx(style.lineHeight, bp)} px`;
}

/** Proporción interlineado / tamaño en Desktop: "112,5% · 1,125". Vacío si el interlineado es automático. */
export function ratio(style: Pick<TextStyleDef, 'size' | 'lineHeight'>): string {
  const size = tokenPx(style.size, 'desktop');
  const line = style.lineHeight ? tokenPx(style.lineHeight, 'desktop') : undefined;
  if (!size || !line) return '';
  return `${decimal((line / size) * 100, 2)}% · ${decimal(line / size)}`;
}
