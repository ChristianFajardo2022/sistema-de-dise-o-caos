import { contrast } from '../_doc/color';
import { colorRef, tokensIn } from '../_doc/tokensCss';
import type { TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';
import { THEMES, colorInfo } from '../Colores/colorData';

/*
 * Datos de la página Texturas. Manda `src/styles/tokens.css`: los tokens de degradado y de efecto se leen de ahí. Lo que
 * tokens.css no tiene (el degradado de 45° de N01 a A06, el glass y el blur de 16 de la documentación de Figma) está en
 * `REFERENCIA` y se marca como valor de referencia, sin token.
 */

/** De menor a mayor, como las columnas de las tablas y el orden de las vistas. */
export const BREAKPOINTS_ASC: { bp: TokenBreakpoint; label: string }[] = [
  { bp: 'mobile', label: 'Mobile' },
  { bp: 'tablet', label: 'Tablet' },
  { bp: 'desktop', label: 'Desktop' },
];

// ───────────────────────── tokens de tokens.css ─────────────────────────

/** Variables de color que empiezan con `prefix` (en el orden de tokens.css). */
const colorTokens = (prefix: string, keep: (name: string) => boolean = () => true): string[] =>
  [...tokensIn('dark').keys()].filter((k) => k.startsWith(prefix) && keep(k));

/** Tokens de degradado (`background/degrade/*`): los extremos de cada gradiente, uno por componente. */
export const DEGRADE_TOKENS = colorTokens('--color-ds-background-degrade-');

/** Tokens de efecto (`background/effect/*`) sin las sombras, que son de elevación y van en su propio fundamento. */
export const EFFECT_TOKENS = colorTokens('--color-ds-background-effect-', (k) => !k.startsWith('--color-ds-background-effect-shadow-'));

/** Componente que usa cada token en el código, o undefined si ninguno lo usa (revisado en `src/components/`). */
export const USADO_POR: Record<string, string> = {
  '--color-ds-background-degrade-nav-bar-0': 'NavBar',
  '--color-ds-background-degrade-nav-bar-100': 'NavBar',
  '--color-ds-background-effect-backdrop': 'Backdrop, Modal y AlertModal',
  '--color-ds-background-effect-button': 'Button (brillo del Primary)',
};

/** Nombre de un token sin el prefijo `--color-ds-`, con barras: "background/degrade/nav-bar-0". */
export const tokenSlash = (variable: string): string => variable.replace(/^--color-ds-/, '').replace(/^(background)-(degrade|effect)-/, '$1/$2/');

/** Valor de un token de color en un modo: "N01 5 %", "G13", o "—" si no resuelve. */
export function colorCell(token: string, theme: TokenTheme): string {
  const ref = colorRef(token, theme);
  return ref ? `${ref.primitive}${ref.percent < 100 ? ` ${String(Number(ref.percent.toFixed(2))).replace('.', ',')}%` : ''}` : '—';
}

/** Utilidades de color de Tailwind que genera `@theme` para un token de color (`bg-`, `from-`, `to-`). */
export function utilidadColor(variable: string, prefix: 'bg' | 'from' | 'to' = 'bg'): string | undefined {
  return tokensIn('theme').has(variable) ? `${prefix}-ds-${variable.replace(/^--color-ds-/, '')}` : undefined;
}

// ───────────────────────── valores de referencia de Figma ─────────────────────────

/** Variables de los primitivos que usan las texturas. N01, B01 y A06 son iguales en los dos modos. */
export const PRIM = {
  n01: '--color-ds-primitives-color-primary-n01',
  b01: '--color-ds-primitives-color-primary-b01',
  a06: '--color-ds-primitives-color-secondary-a06',
  a03: '--color-ds-primitives-color-secondary-a03',
} as const;

/**
 * Valores de la tabla "Valores de textura" de Figma. Ninguno tiene token en tokens.css. Los de glass son los seis
 * parámetros del efecto glass de Figma; el CSS los aproxima, porque la refracción no tiene equivalente exacto.
 */
export const REFERENCIA = {
  degradado: { angulo: 45, inicio: 0, fin: 100 },
  glass: [
    { figma: 'Light', es: 'Luz', valor: '-45°, 80%' },
    { figma: 'Refraction', es: 'Refracción', valor: '80' },
    { figma: 'Depth', es: 'Profundidad', valor: '20' },
    { figma: 'Dispersion', es: 'Dispersión', valor: '50' },
    { figma: 'Frost', es: 'Esmerilado', valor: '4' },
    { figma: 'Splay', es: 'Abertura', valor: '0' },
  ],
  /** Relleno del glass con opacidad: B01 al 60%. */
  glassRelleno: 60,
  blur: 16,
} as const;

/** Aproximación en CSS del glass: desenfoque de 4 px (Frost), saturación y brillo, y una luz del 20% a -45°. */
export const GLASS_CSS = {
  filtro: 'blur(4px) saturate(180%) brightness(1.15)',
  luz: 0.2,
  borde: 0.25,
} as const;

// ───────────────────────── contraste ─────────────────────────

/** Hex de un token de color en un modo (con sus 6 dígitos). */
export const hexOf = (variable: string, theme: TokenTheme): string | undefined => colorInfo(variable, theme)?.hex;

const channels = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb: number[]): string => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

/** Color que se ve al poner `top` con opacidad `alpha` (0 a 1) sobre `behind`. */
export function mezcla(top: string, alpha: number, behind: string): string {
  const [t, b] = [channels(top), channels(behind)];
  return toHex(t.map((c, i) => c * alpha + b[i] * (1 - alpha)));
}

export interface ParContraste {
  label: string;
  /** Texto: variable de color. */
  fg: string;
  /** Fondo: variable de color (el extremo del degradado, o lo que hay detrás del glass). */
  bg: string;
  /** Si es glass, la capa que se pone sobre `bg`: relleno y opacidad (0 a 1). */
  capa?: { color: string; alpha: number };
}

/** Pares de texto y degradado: el degradado se mide en sus dos extremos y el peor punto es el más claro (A06). */
export const PARES_DEGRADADO: ParContraste[] = [
  { label: 'Texto fijo B01 sobre el inicio (N01)', fg: PRIM.b01, bg: PRIM.n01 },
  { label: 'Texto fijo B01 sobre el final (A06)', fg: PRIM.b01, bg: PRIM.a06 },
  { label: 'Encabezado sobre el inicio (N01)', fg: '--color-ds-text-neutral-heading', bg: PRIM.n01 },
  { label: 'Encabezado sobre el final (A06)', fg: '--color-ds-text-neutral-heading', bg: PRIM.a06 },
  { label: 'Cuerpo sobre el final (A06)', fg: '--color-ds-text-neutral-body', bg: PRIM.a06 },
  { label: 'Texto secundario sobre el final (A06)', fg: '--color-ds-text-neutral-gray', bg: PRIM.a06 },
];

const SURFACE = '--color-ds-background-container-surface';

/** Pares de texto y glass: el resultado depende de lo que hay detrás. El peor caso del glass puro es la esquina con más luz. */
export const PARES_GLASS: ParContraste[] = [
  { label: 'Glass con opacidad, texto fijo N01, sobre la superficie', fg: PRIM.n01, bg: SURFACE, capa: { color: PRIM.b01, alpha: REFERENCIA.glassRelleno / 100 } },
  { label: 'Glass con opacidad, texto fijo N01, sobre un color vivo (A03)', fg: PRIM.n01, bg: PRIM.a03, capa: { color: PRIM.b01, alpha: REFERENCIA.glassRelleno / 100 } },
  { label: 'Glass con opacidad, encabezado, sobre la superficie', fg: '--color-ds-text-neutral-heading', bg: SURFACE, capa: { color: PRIM.b01, alpha: REFERENCIA.glassRelleno / 100 } },
  { label: 'Glass puro, texto fijo B01, sobre la superficie', fg: PRIM.b01, bg: SURFACE, capa: { color: '--glass-luz', alpha: GLASS_CSS.luz } },
  { label: 'Glass puro, texto fijo B01, sobre un color vivo (A03)', fg: PRIM.b01, bg: PRIM.a03, capa: { color: '--glass-luz', alpha: GLASS_CSS.luz } },
  { label: 'Glass puro, encabezado, sobre la superficie', fg: '--color-ds-text-neutral-heading', bg: SURFACE, capa: { color: '--glass-luz', alpha: GLASS_CSS.luz } },
];

/** Blanco de la luz del glass (valor suelto: tokens.css no tiene un blanco puro con opacidad). */
const LUZ = '#ffffff';

export interface MedidaContraste {
  ratio: number;
  /** Color del texto y del fondo ya compuesto, para dibujar la muestra. */
  fg: string;
  bg: string;
}

/** Contraste de un par en un modo. Con `capa`, el fondo es la capa mezclada sobre lo que hay detrás. */
export function medir(par: ParContraste, theme: TokenTheme): MedidaContraste | undefined {
  const fg = hexOf(par.fg, theme);
  const detras = hexOf(par.bg, theme);
  if (!fg || !detras) return undefined;
  const top = par.capa ? (par.capa.color === '--glass-luz' ? LUZ : hexOf(par.capa.color, theme)) : undefined;
  const bg = par.capa && top ? mezcla(top, par.capa.alpha, detras) : detras;
  return { ratio: contrast(fg, bg), fg, bg };
}

/** Pares que no llegan a 4,5:1 en algún modo. */
export const bajos = (pares: ParContraste[]) =>
  pares.flatMap((p) =>
    THEMES.flatMap((theme) => {
      const m = medir(p, theme);
      return m && m.ratio < 4.5 ? [{ ...p, theme, ratio: m.ratio }] : [];
    }),
  );
