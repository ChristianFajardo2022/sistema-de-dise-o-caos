import { px, rawToken, tokensIn } from '../_doc/tokensCss';
import type { TokenBreakpoint } from '../_doc/tokensCss';

/*
 * Datos de la página Retículas. Manda `src/styles/tokens.css`: columnas, canal, márgenes, lienzos y breakpoints se leen
 * de ahí. Lo que tokens.css no tiene (retícula secundaria, pantalla de 1920, guía central y retícula derecha) sale de la
 * documentación anterior de Figma y está marcado como tal (`FIGMA`). La auditoría compara las dos fuentes.
 */

export const BREAKPOINTS: { bp: TokenBreakpoint; label: string; screen: string }[] = [
  { bp: 'desktop', label: 'Desktop', screen: 'Escritorio' },
  { bp: 'tablet', label: 'Tablet', screen: 'Tablet' },
  { bp: 'mobile', label: 'Mobile', screen: 'Móvil' },
];

/** De menor a mayor (para rangos y diagramas en fila). */
export const BREAKPOINTS_ASC = [...BREAKPOINTS].reverse();

/** Variables responsive de la retícula, en el orden de la tabla. */
export const GRID_VARS = {
  columns: '--ds-responsive-column-default',
  gutter: '--ds-responsive-gutter-default',
  lateral: '--ds-responsive-space-canva-lateral',
  lateralWeb: '--ds-responsive-space-canva-lateral-web',
  top: '--ds-responsive-space-canva-top',
  bottom: '--ds-responsive-space-canva-bottom',
  width: '--ds-responsive-dimention-canva-width',
  height: '--ds-responsive-dimention-canva-height',
} as const;

export type GridParam = keyof typeof GRID_VARS;
export type GridSpec = Record<GridParam, number>;

/** Medidas de la retícula en un breakpoint, leídas de tokens.css. */
export function gridSpec(bp: TokenBreakpoint): GridSpec {
  const out = {} as GridSpec;
  for (const [key, variable] of Object.entries(GRID_VARS) as [GridParam, string][]) out[key] = px(variable, bp);
  return out;
}

export const SPECS: Record<TokenBreakpoint, GridSpec> = {
  mobile: gridSpec('mobile'),
  tablet: gridSpec('tablet'),
  desktop: gridSpec('desktop'),
};

/** Inicio de cada breakpoint en px (tokens.css los declara en rem en `@theme`). */
export function breakpointStart(bp: TokenBreakpoint): number {
  if (bp === 'mobile') return 0;
  return parseFloat(tokensIn('theme').get(`--breakpoint-${bp}`) ?? '0') * 16;
}

/** Valor en rem de un breakpoint, como está en tokens.css ("48rem"). */
export function breakpointRem(bp: Exclude<TokenBreakpoint, 'mobile'>): string {
  return tokensIn('theme').get(`--breakpoint-${bp}`) ?? '';
}

/** Rango de un breakpoint: "768 a 1023 px" o "1024 px en adelante". */
export function breakpointRange(bp: TokenBreakpoint): string {
  const i = BREAKPOINTS_ASC.findIndex((b) => b.bp === bp);
  const next = BREAKPOINTS_ASC[i + 1];
  const start = breakpointStart(bp);
  return next ? `${start} a ${breakpointStart(next.bp) - 1} px` : `${start} px en adelante`;
}

/** Breakpoint que se aplica con una ventana de `width` px CSS. */
export function breakpointAt(width: number): TokenBreakpoint {
  return [...BREAKPOINTS_ASC].reverse().find((b) => width >= breakpointStart(b.bp))?.bp ?? 'mobile';
}

/** Ancho de `span` columnas en un breakpoint, con el lienzo `width` (por defecto, el del token) y el margen fijo. */
export function spanWidth(bp: TokenBreakpoint, span: number, width = SPECS[bp].width): number {
  const s = SPECS[bp];
  const column = (width - s.lateral * 2 - s.gutter * (s.columns - 1)) / s.columns;
  return Math.round(column * span + s.gutter * (span - 1));
}

/** Primitivo al que apunta una variable responsive en un breakpoint ("space-2xl"), o el valor tal cual. */
export function primitiveOf(variable: string, bp: TokenBreakpoint): string {
  const raw = rawToken(variable, 'dark', bp) ?? '';
  const ref = raw.match(/^var\(--ds-primitives-(.+)\)$/);
  return ref ? ref[1] : raw;
}

/** "16 px" con coma decimal si hace falta. */
export const pxText = (n: number) => `${String(n).replace('.', ',')} px`;

/**
 * Valores de la documentación anterior de Figma que no tienen token (o que difieren de tokens.css). Solo se dibujan
 * donde tokens.css no dice nada; el resto va a la auditoría.
 */
export const FIGMA = {
  /** Pantallas de la sección "Pantallas" (texto y dibujo). */
  screens: { mobile: { width: 376, height: 800 }, tabletText: 834, tablet: { width: 768, height: 1024 }, desktop: { width: 1440, height: 1024 }, wide: { width: 1920, height: 1080 } },
  /** Cortes de la tabla de columnas: 0 a 643, 644 a 1079 y desde 1080 px. */
  breakpoints: { tablet: 644, desktop: 1080 },
  /** Retícula fija (aplicaciones): márgenes por breakpoint. */
  fixed: {
    mobile: { lateral: 16, top: 24, bottom: 32 },
    tablet: { lateral: 32, top: 32, bottom: 40 },
    desktop: { lateral: 56, top: 48, bottom: 56 },
  } satisfies Record<TokenBreakpoint, { lateral: number; top: number; bottom: number }>,
  /** Retícula variable (sitios web): seis cortes con su margen lateral. */
  variable: [
    { range: '0 a 643 px', lateral: '24 px' },
    { range: '644 a 1079 px', lateral: '32 px' },
    { range: '1080 a 1339 px', lateral: '80 px' },
    { range: '1340 a 1439 px', lateral: '160 px' },
    { range: '1440 a 1919 px', lateral: '240 px' },
    { range: '1920 px en adelante', lateral: 'Más de 240 px (guía central)' },
  ],
  /** Guía central de la retícula variable desde 1920 px: 12 columnas de 65 px. */
  center: { columns: 12, column: 65 },
  /** Retícula con función secundaria: panel desplegado y plegado. */
  secondary: {
    mobile: { open: 'Pantalla completa', closed: '80 px de alto', openSize: 0, closedSize: 80 },
    tablet: { open: '240 px de ancho', closed: '80 px de ancho', openSize: 240, closedSize: 80 },
    desktop: { open: '300 px de ancho', closed: '120 px de ancho', openSize: 300, closedSize: 120 },
  } satisfies Record<TokenBreakpoint, { open: string; closed: string; openSize: number; closedSize: number }>,
  /** Retícula derecha (base junto al panel secundario): 12 columnas de 70 px y 56 px a cada lado. */
  right: { columns: 12, column: 70, offset: 56 },
} as const;

/** Bloques de la composición de ejemplo y las columnas que ocupa cada uno según las columnas de la retícula. */
export const COMPOSICION: { name: string; span: (columns: number) => number; tall?: boolean }[] = [
  { name: 'Encabezado', span: (c) => c, tall: true },
  { name: 'Resumen', span: (c) => (c >= 6 ? c / 3 : c) },
  { name: 'Agenda', span: (c) => (c >= 6 ? c / 3 : c) },
  { name: 'Notas', span: (c) => (c >= 6 ? c / 3 : c) },
  { name: 'Documentos', span: (c) => (c >= 6 ? c / 2 : c) },
  { name: 'Equipo', span: (c) => (c >= 6 ? c / 2 : c) },
];
