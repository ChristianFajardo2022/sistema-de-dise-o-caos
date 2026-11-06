import { colorRef, readShadowTokens, resolveToken } from '../_doc/tokensCss';
import type { ShadowToken, TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';
import { THEMES, pairRatio, primitiveVar } from '../Colores/colorData';

/*
 * Datos de la página Elevaciones. Manda `src/styles/tokens.css`: las sombras (posición, desenfoque, expansión y color por
 * modo y por breakpoint) se leen de ahí. Lo que tokens.css no tiene (la tabla shadow.s / .m / .l de Figma) está en
 * `FIGMA_SOMBRAS` y se marca como valor de referencia, para compararlo con el código.
 */

/** De menor a mayor, como las columnas de las tablas y el orden de las vistas. */
export const BREAKPOINTS_ASC: { bp: TokenBreakpoint; label: string }[] = [
  { bp: 'mobile', label: 'Mobile' },
  { bp: 'tablet', label: 'Tablet' },
  { bp: 'desktop', label: 'Desktop' },
];

/** Sombras con utilidad de Tailwind (`shadow-ds-*`), leídas de `@theme` en tokens.css. */
export const SOMBRAS: ShadowToken[] = readShadowTokens();

/** Nombre de la variable de color de una sombra por breakpoint: `--color-ds-background-effect-shadow-shadow-on-card-mobile`. */
export const sombraVar = (nombre: SombraNombre, bp: TokenBreakpoint): string => `--color-ds-background-effect-shadow-shadow-${nombre}-${bp}`;

/** Variable responsive del color de una sombra (la que usan las utilidades): `--color-ds-responsive-effect-shadow-on-card`. */
export const sombraResponsiva = (nombre: SombraNombre): string => `--color-ds-responsive-effect-shadow-${nombre}`;

export type SombraNombre = 'on-card' | 'on-canva-md' | 'on-canva-sm';

/** Las tres sombras de color que define tokens.css. `on-canva-sm` no tiene utilidad: solo la usa FloatButton. */
export const SOMBRA_NOMBRES: SombraNombre[] = ['on-card', 'on-canva-md', 'on-canva-sm'];

export interface ColorSombra {
  /** Primitivo, p. ej. "G06". */
  primitive: string;
  /** Hex del primitivo. */
  hex: string;
  /** Opacidad, de 0 a 100. */
  percent: number;
}

/** Color de una sombra en un modo y un breakpoint: primitivo, su hex y su opacidad. */
export function colorSombra(nombre: SombraNombre, theme: TokenTheme, bp: TokenBreakpoint): ColorSombra | undefined {
  const ref = colorRef(sombraVar(nombre, bp), theme, bp);
  if (!ref) return undefined;
  const variable = primitiveVar(ref.primitive);
  const hex = variable ? resolveToken(variable, theme, bp) : undefined;
  return hex ? { primitive: ref.primitive, hex, percent: Number(ref.percent.toFixed(2)) } : undefined;
}

/** Porcentaje con coma y sin espacio. */
export const pct = (n: number): string => `${String(n).replace('.', ',')}%`;

/** "G06 8%". */
export const colorSombraTexto = (c: ColorSombra): string => `${c.primitive} ${pct(c.percent)}`;

/** Sombras que valen 0% de opacidad en un modo, en todos los breakpoints. */
export const invisibleEn = (nombre: SombraNombre, theme: TokenTheme): boolean =>
  ['mobile', 'tablet', 'desktop'].every((bp) => (colorSombra(nombre, theme, bp as TokenBreakpoint)?.percent ?? 0) === 0);

/** Opacidades de una sombra por breakpoint en un modo: "8% (Mobile), 24% (Tablet) y 30% (Desktop)". */
export function opacidades(nombre: SombraNombre, theme: TokenTheme): string {
  const partes = BREAKPOINTS_ASC.map(({ bp, label }) => `${pct(colorSombra(nombre, theme, bp)?.percent ?? 0)} (${label})`);
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
}

/** Valor sin unidad: "0px" → "0". */
export const sinPx = (valor: string): string => valor.replace(/px$/, '');

/** Sombra de una utilidad por su nombre ("shadow-ds-on-card"). */
export const sombraDe = (utilidad: string): ShadowToken | undefined => SOMBRAS.find((s) => s.name === utilidad);

/** "0 4 12 0" para una utilidad, como se lee en Figma. */
export function geometria(utilidad: string): string {
  const s = sombraDe(utilidad);
  return s ? [s.x, s.y, s.blur, s.spread].map(sinPx).join(' ') : '—';
}

// ───────────────────────── niveles ─────────────────────────

export interface Nivel {
  id: 'primero' | 'segundo' | 'tercero';
  nombre: string;
  /** Utilidad de sombra que le toca. */
  utilidad: string;
  /** Qué es. */
  que: string;
  /** Componentes que ya llevan esa sombra (revisado en `src/components/`). */
  componentes: string;
}

/**
 * Qué sombra usa cada nivel en el código. Figma no asigna un token a cada nivel; la asignación sale de lo que hacen los componentes:
 * las tarjetas y el interruptor de tema usan la menor; paneles, tablas, barras y menús, la mayor.
 */
export const NIVELES: Nivel[] = [
  {
    id: 'primero',
    nombre: 'Primer nivel',
    utilidad: 'shadow-ds-on-card',
    que: 'Elementos interactivos anidados dentro de un contenedor madre.',
    componentes: 'ThemeSwitch, ProfileCard (hero), BlogCard, FeatureCard, FileCard y la capa del lienzo de InformationCard e InteractiveCard (complex).',
  },
  {
    id: 'segundo',
    nombre: 'Segundo nivel',
    utilidad: 'shadow-ds-on-canva-md',
    que: 'Contenedores madre: tarjetas, secciones, tablas y paneles.',
    componentes: 'InformationCard, InteractiveCard (hover), ChatDetailsPanel, Tabs, Accordion, Table, SideBar y el recorte de FeatureCard.',
  },
  {
    id: 'tercero',
    nombre: 'Tercer nivel',
    utilidad: 'shadow-ds-on-canva-md',
    que: 'Elementos que se superponen: menús y paneles flotantes.',
    componentes: 'DropdownMenu y SearchInput, con borde interior de 1 px. Modal, AlertModal, Popover, Toast y Tooltip no llevan sombra.',
  },
];

// ───────────────────────── Figma ─────────────────────────

export interface FilaFigma {
  nombre: string;
  /** Capas: posición X, Y y blur. */
  capas: { x: number; y: number; blur: number }[];
  /** Color tal cual lo escribe Figma. */
  color: string;
  /** Qué sombra de código se le parece. */
  codigo: string;
  /** Qué coincide y qué no. */
  nota: string;
}

/** Tabla "Valores de sombra" de la documentación anterior de Figma. No tiene token: se compara con el código. */
export const FIGMA_SOMBRAS: FilaFigma[] = [
  { nombre: 'shadow.s', capas: [{ x: 0, y: 4, blur: 16 }], color: 'A06 al 8%', codigo: 'shadow-ds-on-card', nota: 'Coincide la posición. El código usa blur 12, sin expansión y G06 o G08 en lugar de A06.' },
  { nombre: 'shadow.m', capas: [{ x: -3, y: 3, blur: 32 }], color: 'A06 al 12%', codigo: 'shadow-ds-on-canva-md', nota: 'Coincide el blur. El código usa 0, 12 y expansión de -2.' },
  {
    nombre: 'shadow.l',
    capas: [
      { x: -8, y: 0, blur: 80 },
      { x: 0, y: -8, blur: 80 },
    ],
    color: 'A06 al 8%',
    codigo: 'Ninguna',
    nota: 'No existe en tokens.css ni se usa en componentes: son dos capas de 80 de blur.',
  },
];

// ───────────────────────── contraste ─────────────────────────

export interface ParBorde {
  label: string;
  /** Qué se mide: el relleno de una superficie o un borde. */
  tipo: 'superficie' | 'borde';
  /** Superficie o borde: variable de color. */
  fg: string;
  /** Lo que queda detrás: variable de color. */
  bg: string;
  /** Lo que queda detrás, en palabras ("el fondo de la página"). */
  sobre: string;
}

const SURFACE = '--color-ds-background-container-surface';
const EN_LIENZO = '--color-ds-background-container-default-on-canva';
const EN_TARJETA = '--color-ds-background-container-default-on-card';
const CAMPO = '--color-ds-background-field-surface';
const BORDE_TARJETA = '--color-ds-border-general-default-on-card';
const BORDE_GRIS = '--color-ds-border-general-gray-secondary';

/** Pares de delimitación (1.4.11, mínimo 3:1): superficies y bordes de un contenedor o un flotante contra lo que tienen detrás. */
export const PARES_BORDE: ParBorde[] = [
  { label: 'Superficie de un contenedor madre sobre el fondo de la página', tipo: 'superficie', fg: EN_LIENZO, bg: SURFACE, sobre: 'el fondo de la página' },
  { label: 'Superficie de un elemento anidado sobre su contenedor madre', tipo: 'superficie', fg: EN_TARJETA, bg: EN_LIENZO, sobre: 'un contenedor madre' },
  { label: 'Superficie de un menú flotante sobre el fondo de la página', tipo: 'superficie', fg: CAMPO, bg: SURFACE, sobre: 'el fondo de la página' },
  { label: 'Borde del flotante sobre el fondo de la página', tipo: 'borde', fg: BORDE_TARJETA, bg: SURFACE, sobre: 'el fondo de la página' },
  { label: 'Borde del flotante sobre un contenedor madre', tipo: 'borde', fg: BORDE_TARJETA, bg: EN_LIENZO, sobre: 'un contenedor madre' },
  { label: 'Borde gris sobre el fondo de la página', tipo: 'borde', fg: BORDE_GRIS, bg: SURFACE, sobre: 'el fondo de la página' },
  { label: 'Borde gris sobre un contenedor madre', tipo: 'borde', fg: BORDE_GRIS, bg: EN_LIENZO, sobre: 'un contenedor madre' },
];

/** Pares que no llegan a 3:1 en algún modo. */
export const BAJOS_BORDE = PARES_BORDE.flatMap((p) =>
  THEMES.flatMap((theme) => {
    const ratio = pairRatio(p.fg, p.bg, theme);
    return ratio !== undefined && ratio < 3 ? [{ ...p, theme, ratio }] : [];
  }),
);

/** Pares que sí llegan a 3:1 en los dos modos. */
export const PARES_BORDE_OK = PARES_BORDE.filter((p) => THEMES.every((theme) => (pairRatio(p.fg, p.bg, theme) ?? 0) >= 3));
