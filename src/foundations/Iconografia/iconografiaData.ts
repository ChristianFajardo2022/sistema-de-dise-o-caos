import { ICON_SIZES, defaultIconVariant } from '../../components/Icon/Icon.types';
import type { IconSize, IconVariant } from '../../components/Icon/Icon.types';
import { caosIconCategories, caosIcons } from '../../icons/caos/registry.generated';
import { THEMES, pairRatio } from '../Colores/colorData';
import { colorRef, px, tokensIn } from '../_doc/tokensCss';
import type { TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';

/*
 * Datos de la página Iconografía. Mandan el componente `Icon` (`src/components/Icon/`: tamaños y regla de variante), la
 * biblioteca (`src/icons/caos/`) y `src/styles/tokens.css` (colores, dimensiones y espacios de ícono). Lo que no tiene
 * token ni prop (márgenes de seguridad, zonas tapeables y casos de tamaño de la documentación anterior de Figma) está
 * en `REFERENCIA` y se marca como valor de referencia.
 */

/** De menor a mayor, como las columnas de las tablas y el orden de las vistas. */
export const BREAKPOINTS_ASC: { bp: TokenBreakpoint; label: string }[] = [
  { bp: 'mobile', label: 'Mobile' },
  { bp: 'tablet', label: 'Tablet' },
  { bp: 'desktop', label: 'Desktop' },
];

/** Medida con coma decimal y espacio: "1,2 px". */
export const pxText = (n: number): string => `${String(n).replace('.', ',')} px`;

// ───────────────────────── biblioteca ─────────────────────────

/** Cantidad de íconos de la biblioteca (registro generado). */
export const TOTAL_ICONOS = Object.keys(caosIcons).length;

/** Cantidad de categorías (las de Figma). */
export const TOTAL_CATEGORIAS = new Set(Object.values(caosIconCategories)).size;

// ───────────────────────── tamaños ─────────────────────────

/** Tamaños del set "Icon-sizes" de Figma, los de la documentación nueva. */
export const FIGMA_SIZES: readonly IconSize[] = [12, 14, 16, 20, 24, 32, 56];

/** Tamaños del componente con la variante que dibuja por defecto. */
export const TAMANOS: { size: IconSize; variant: IconVariant; figma: boolean }[] = ICON_SIZES.map((size) => ({
  size,
  variant: defaultIconVariant(size),
  figma: FIGMA_SIZES.includes(size),
}));

/** Formatos pequeños (relleno) y medianos y grandes (línea) de la documentación nueva, con los tamaños de Figma. */
export const PEQUENOS = FIGMA_SIZES.filter((s) => defaultIconVariant(s) === 'fill');
export const GRANDES = FIGMA_SIZES.filter((s) => defaultIconVariant(s) === 'line');

/** Primer tamaño que dibuja línea: el umbral de la regla del componente. */
export const UMBRAL_LINEA = ICON_SIZES.find((s) => defaultIconVariant(s) === 'line') ?? 24;

// ───────────────────────── tokens de tokens.css ─────────────────────────

/** Variables de dimensión y de espacio de ícono (responsive). */
export const DIM_TOKENS = ['--ds-responsive-dimention-icono-s', '--ds-responsive-dimention-icono-m'];
export const SPACE_TOKENS = ['--ds-responsive-space-icon-sm', '--ds-responsive-space-icon-md'];

/** Valor en px de un token responsive en un breakpoint. */
export const pxAt = (variable: string, bp: TokenBreakpoint): number => px(variable, bp);

/** Utilidad de Tailwind que genera `@theme` para un token de dimensión o espacio (`size-ds-…`, `p-ds-…`). */
export function utilidad(variable: string, prefix: 'size' | 'p' | 'gap'): string | undefined {
  const name = variable.replace(/^--ds-responsive-/, '');
  return tokensIn('theme').has(`--spacing-ds-${name}`) ? `${prefix}-ds-${name}` : undefined;
}

/** Componente que usa cada token de dimensión o espacio (revisado en `src/components/`). */
export const USADO_POR: Record<string, string> = {
  '--ds-responsive-dimention-icono-m': 'AlertModal (ícono del tipo) y Spinner',
};

/** Variables de color que empiezan con `prefix` (en el orden de tokens.css). */
const colorTokens = (prefix: string): string[] => [...tokensIn('dark').keys()].filter((k) => k.startsWith(prefix));

/** Ordena por la posición de la primera clave de `order` que contenga el nombre (las que no están, al final). */
const ordenar = (tokens: string[], order: string[]): string[] => {
  const rank = (t: string) => {
    const i = order.findIndex((o) => t.endsWith(o));
    return i < 0 ? order.length : i;
  };
  return [...tokens].sort((a, b) => rank(a) - rank(b));
};

const NIVEL_ORDEN = ['firts', 'secondary', 'tertiary', 'on-color'];

/** Colores de ícono por familia. Los de botón (`icon/button/*`) son del componente Button y se documentan allí. */
export const COLOR_GENERAL = ordenar(colorTokens('--color-ds-icon-general-'), [
  '-general-default',
  '-general-black',
  '-gray-high-contrast',
  '-gray-low-contrast',
  '-disabled-positive',
  '-disabled-negative',
  '-default-unicolor',
  '-black-unicolor',
]);
export const COLOR_ACENTO = ordenar(colorTokens('--color-ds-icon-acent-'), NIVEL_ORDEN);
export const COLOR_SEMANTICO = ['success', 'alert', 'error', 'information'].flatMap((f) =>
  ordenar(colorTokens(`--color-ds-icon-semantic-${f}-`), NIVEL_ORDEN),
);
export const COLOR_OTROS = colorTokens('--color-ds-icon-tertiary-');
export const COLOR_BOTON = colorTokens('--color-ds-icon-button-');
/** Fondos de un ícono con contenedor (`background/icon/*`). */
export const FONDO_ICONO = colorTokens('--color-ds-background-icon-');

/** Nombre de un token de color sin el prefijo `--color-ds-`, con barras: "icon/semantic/success-firts". */
export const tokenSlash = (variable: string): string =>
  variable
    .replace(/^--color-ds-/, '')
    .replace(/^(icon|background)-(general|acent|semantic|tertiary|button|icon)-/, '$1/$2/');

/** Nombre corto de un token de dimensión o espacio: "dimention/icono-m". */
export const shortName = (variable: string): string => variable.replace(/^--ds-responsive-/, '').replace(/^(dimention|space)-/, '$1/');

/** Utilidad de color de texto de un token de ícono: "text-ds-icon-semantic-success-firts". */
export const utilidadColor = (variable: string): string | undefined =>
  tokensIn('theme').has(variable) ? `text-ds-${variable.replace(/^--color-ds-/, '')}` : undefined;

/** Valor de un token de color en un modo: "M02", "G13 50%", o "—" si no resuelve. */
export function colorCell(token: string, theme: TokenTheme): string {
  const ref = colorRef(token, theme);
  return ref ? `${ref.primitive}${ref.percent < 100 ? ` ${String(Number(ref.percent.toFixed(2))).replace('.', ',')}%` : ''}` : '—';
}

/** Descripción de cada familia semántica (texto de la documentación nueva de Figma). */
export const SEMANTICOS: { family: 'success' | 'alert' | 'error' | 'information'; label: string; uso: string }[] = [
  { family: 'success', label: 'Éxito', uso: 'Confirmaciones y estados exitosos.' },
  { family: 'alert', label: 'Alerta', uso: 'Advertencias, notificaciones y estados de precaución.' },
  { family: 'error', label: 'Error', uso: 'Validaciones fallidas, alertas críticas y acciones destructivas.' },
  { family: 'information', label: 'Información', uso: 'Mensajes informativos, ayudas y estados neutrales.' },
];

/** Los tres niveles de cada familia, en el orden de Figma. */
export const NIVELES = ['firts', 'secondary', 'tertiary'] as const;

// ───────────────────────── valores de referencia de Figma ─────────────────────────

/**
 * Valores de la documentación anterior de Figma que no tienen token ni prop. Las márgenes de seguridad y las zonas
 * tapeables se dibujan en las muestras con estas cifras.
 */
export const REFERENCIA = {
  /** Valores de línea a 24 px (Bold line y Light line). */
  linea: { bold: 2, light: 1.2, base: 24 },
  /** Margen de seguridad por tamaño de ícono. */
  seguridad: {
    light: [
      { icon: 48, margin: 24 },
      { icon: 40, margin: 16 },
      { icon: 32, margin: 16 },
    ],
    bold: [
      { icon: 32, margin: 16 },
      { icon: 24, margin: 16 },
      { icon: 20, margin: 8 },
      { icon: 16, margin: 8 },
      { icon: 12, margin: 8 },
    ],
  },
  /** Zonas tapeables: contenedor, tamaños de ícono que admite y el margen que anota Figma. */
  zonas: [
    { zone: 24, icons: [{ icon: 16, figma: 4 }] },
    {
      zone: 32,
      icons: [
        { icon: 20, figma: 6 },
        { icon: 16, figma: 16 },
      ],
    },
    { zone: 40, icons: [{ icon: 24, figma: 16 }] },
    { zone: 48, icons: [{ icon: 32, figma: 8 }] },
  ],
  /** Casos de tamaño de la documentación anterior. */
  casos: [
    { tamano: '48 px en Desktop y 40 px en Mobile', estilo: 'Light line', usos: ['Modal de diálogo (Dialog)', 'Ventana emergente (Popup)', 'Snackbar'] },
    { tamano: '24 px en Desktop y Mobile', estilo: 'Bold line', usos: ['Menú (Menu)', 'Flechas (Arrow)', 'Stepper', 'Snackbar', 'Accordion', 'Campo de texto (Input)'] },
    { tamano: '16 px en Desktop y 12 px en Mobile', estilo: 'Bold line', usos: ['Snackbar', 'Banner informativo', 'Button', 'Desplegable (Select)', 'Tooltip'] },
  ],
} as const;

/** Margen que da la geometría: (zona − ícono) / 2. */
export const margenGeometrico = (zone: number, icon: number): number => (zone - icon) / 2;

/** Mínimo de WCAG 2.5.8 (AA). */
export const MIN_OBJETIVO = 24;

// ───────────────────────── contraste ─────────────────────────

const SURFACE = '--color-ds-background-container-surface';
const ON_CANVA = '--color-ds-background-container-default-on-canva';

export interface ParIcono {
  label: string;
  fg: string;
  bg: string;
  /** Ícono inactivo: 1.4.11 no lo exige. */
  exento?: boolean;
}

/** Pares ícono/fondo que se miden (ícono con significado contra la superficie donde suele ir). */
export const PARES: ParIcono[] = [
  { label: 'General sobre la superficie', fg: '--color-ds-icon-general-default', bg: SURFACE },
  { label: 'General sobre una tarjeta del lienzo', fg: '--color-ds-icon-general-default', bg: ON_CANVA },
  { label: 'Gris de alto contraste', fg: '--color-ds-icon-general-gray-high-contrast', bg: SURFACE },
  { label: 'Gris de bajo contraste', fg: '--color-ds-icon-general-gray-low-contrast', bg: SURFACE },
  ...NIVELES.map((n) => ({ label: `Acento, ${n === 'firts' ? 'first' : n}`, fg: `--color-ds-icon-acent-${n}`, bg: SURFACE })),
  ...SEMANTICOS.flatMap((s) =>
    NIVELES.map((n) => ({ label: `${s.label}, ${n === 'firts' ? 'first' : n}`, fg: `--color-ds-icon-semantic-${s.family}-${n}`, bg: SURFACE })),
  ),
  { label: 'Ícono positivo sobre G13', fg: '--color-ds-icon-general-default-unicolor', bg: '--color-ds-primitives-color-primary-g13' },
  { label: 'Ícono negativo sobre B01', fg: '--color-ds-icon-general-black-unicolor', bg: '--color-ds-primitives-color-primary-b01' },
  { label: 'Inactivo sobre la superficie', fg: '--color-ds-icon-general-disabled-positive', bg: SURFACE, exento: true },
];

export const ratioOf = (p: ParIcono, theme: TokenTheme): number | undefined => pairRatio(p.fg, p.bg, theme);

/** Pares con significado que no llegan a 3:1 en algún modo. */
export const BAJOS = PARES.filter((p) => !p.exento).flatMap((p) =>
  THEMES.flatMap((theme) => {
    const ratio = ratioOf(p, theme);
    return ratio !== undefined && ratio < 3 ? [{ ...p, theme, ratio }] : [];
  }),
);
