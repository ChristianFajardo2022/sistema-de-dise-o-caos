/**
 * Datos de color de la página Colores, todos leídos de tokens.css mediante `_doc/tokensCss`.
 * Nada de esto se escribe a mano: las familias, los grupos, los valores por modo y los contrastes se derivan de las
 * variables. Lo único escrito aquí son normas de la documentación de Figma (qué primitivo es el principal de cada
 * familia en cada modo y los porcentajes de dominancia) y los pares de contraste que se miden.
 */
import { colorRef, contrast, luminance, rawToken, resolveToken, tokensIn } from '../_doc';
import type { TokenTheme } from '../_doc';

/** Modos en el orden de las tablas: oscuro (el predeterminado de tokens.css) y claro. */
export const THEMES: TokenTheme[] = ['dark', 'light'];
export const THEME_LABELS: Record<TokenTheme, string> = { dark: 'Oscuro', light: 'Claro' };

/** Hex en mayúsculas (#2E3033), como se muestra en la página. */
export const upperHex = (hex: string) => hex.toUpperCase();

/** Número con coma decimal (12,49) y sin ceros sobrantes. */
export function decimal(value: number, digits = 2): string {
  return String(Number(value.toFixed(digits))).replace('.', ',');
}

/** Relación de contraste con dos decimales y coma ("4,40:1"), como la mide WCAG. */
export const ratioText = (ratio: number) => `${ratio.toFixed(2).replace('.', ',')}:1`;

/** Nombre del token sin el prefijo `--color-ds-` (el sufijo de sus utilidades: `bg-ds-…`, `text-ds-…`). */
export const tokenName = (variable: string) => variable.replace(/^--color-ds-/, '');

/* ---------- Primitivos ---------- */

export interface Primitive {
  /** Nombre corto, p. ej. "G13" */
  code: string;
  /** Variable CSS completa */
  variable: string;
  /** Valor en tokens.css (los primitivos no cambian con el modo) */
  hex: string;
}

export type FamilyId = 'primary' | 'secondary' | 'tertiary' | 'information' | 'confirmation' | 'error' | 'alert';

export interface PrimitiveFamily {
  id: FamilyId;
  label: string;
  items: Primitive[];
}

const PRIMITIVE_RE = /^--color-ds-primitives-color-([a-z]+)-([a-z]+\d+)$/;

export const FAMILY_LABELS: Record<FamilyId, string> = {
  primary: 'Primario',
  secondary: 'Secundario',
  tertiary: 'Terciario',
  information: 'Informativo',
  confirmation: 'Confirmación',
  error: 'Error',
  alert: 'Alerta',
};

/** Familias de primitivos de color en el orden de tokens.css; cada una de su tono más oscuro al más claro. */
export function readPrimitiveFamilies(): PrimitiveFamily[] {
  const byFamily = new Map<FamilyId, Primitive[]>();
  for (const [variable] of tokensIn('base')) {
    const m = variable.match(PRIMITIVE_RE);
    if (!m) continue;
    const id = m[1] as FamilyId;
    const item: Primitive = { code: m[2].toUpperCase(), variable, hex: resolveToken(variable, 'dark') ?? '' };
    byFamily.set(id, [...(byFamily.get(id) ?? []), item]);
  }
  return [...byFamily].map(([id, items]) => ({
    id,
    label: FAMILY_LABELS[id] ?? id,
    items: [...items].sort((a, b) => luminance(a.hex) - luminance(b.hex)),
  }));
}

/** Primitivos "externos" (`--ds-external-*`): alias a una biblioteca externa de Figma, con su propio valor. */
export function readExternalPrimitives(): Primitive[] {
  return [...tokensIn('base')]
    .filter(([k]) => k.startsWith('--ds-external-'))
    .map(([variable]) => ({ code: variable.split('-').pop()!.toUpperCase(), variable, hex: resolveToken(variable, 'dark') ?? '' }));
}

/** Variable de un primitivo por su nombre corto ("A05" → `--color-ds-primitives-color-secondary-a05`). */
export function primitiveVar(code: string): string | undefined {
  const lower = code.toLowerCase();
  for (const [variable] of tokensIn('base')) {
    const m = variable.match(PRIMITIVE_RE);
    if (m && m[2] === lower) return variable;
  }
  return undefined;
}

/** Hex de un primitivo (igual en los dos modos). */
export const primitiveHex = (variable: string) => resolveToken(variable, 'dark');

/**
 * Primitivo principal de cada familia en cada modo, según la documentación de Figma ("Principal" en las tarjetas Light
 * y Dark). Es una norma de uso, no un token: el valor sale de tokens.css.
 */
export const PRINCIPAL: Record<'primary' | 'secondary' | 'tertiary', Record<TokenTheme, string>> = {
  primary: { light: 'N01', dark: 'B01' },
  secondary: { light: 'A05', dark: 'A03' },
  tertiary: { light: 'M05', dark: 'M03' },
};

/** Principales de los semánticos: tono 05 en claro y 03 en oscuro (Confirmación, Informativo, Alerta, Error). */
export const SEMANTIC_PRINCIPAL: { family: FamilyId; light: string; dark: string }[] = [
  { family: 'confirmation', light: 'V05', dark: 'V03' },
  { family: 'information', light: 'AI05', dark: 'AI03' },
  { family: 'alert', light: 'Y05', dark: 'Y03' },
  { family: 'error', light: 'R05', dark: 'R03' },
];

/** Porcentajes de dominancia de la documentación de Figma (norma de uso; los colores salen de tokens.css). */
export const DOMINANCE: { code: string; percent: number }[] = [
  { code: 'B01', percent: 50 },
  { code: 'N01', percent: 30 },
  { code: 'A05', percent: 5 },
  { code: 'M05', percent: 3 },
  { code: 'V05', percent: 3 },
  { code: 'AI05', percent: 3 },
  { code: 'R05', percent: 3 },
  { code: 'Y05', percent: 3 },
];

/* ---------- Tokens semánticos ---------- */

export interface ColorInfo {
  /** Valor CSS para pintar (hex o color-mix con primitivos) */
  css: string;
  /** Hex del color base, en minúsculas como en tokens.css */
  hex: string;
  /** Primitivo al que apunta, p. ej. "G13"; `undefined` si el token tiene un valor directo */
  primitive?: string;
  /** Opacidad en % (100 si es opaco) */
  percent: number;
}

/** Color final de un token en un modo: valor CSS, hex base, primitivo y opacidad. */
export function colorInfo(variable: string, theme: TokenTheme): ColorInfo | undefined {
  const css = resolveToken(variable, theme);
  if (!css) return undefined;
  const ref = colorRef(variable, theme);
  // Primera variable dentro de un color-mix (puede ser un primitivo u otro token)
  const inner = css.match(/color-mix\(in srgb, var\((--[\w-]+)\)/);
  const hex = inner ? resolveToken(inner[1], theme) : css;
  if (!hex || !hex.startsWith('#')) return undefined;
  // `colorRef` nombra la última variable de la cadena: solo es un primitivo si es `--color-ds-primitives-color-…`
  const last = finalVar(variable, theme);
  const primitive = last && PRIMITIVE_RE.test(last) ? ref?.primitive : undefined;
  return { css, hex, primitive, percent: Number((ref?.percent ?? 100).toFixed(2)) };
}

/** Última variable de la cadena de alias de un token (la que guarda el hex), entrando en los color-mix. */
function finalVar(variable: string, theme: TokenTheme): string | undefined {
  let name = variable;
  for (let i = 0; i < 12; i++) {
    const raw = rawToken(name, theme);
    if (raw === undefined || raw.startsWith('#')) return name;
    const m = raw.match(/var\((--[\w-]+)\)/);
    if (!m) return name;
    name = m[1];
  }
  return name;
}

export type TokenCategory = 'text' | 'buttons' | 'icon' | 'link' | 'background' | 'border' | 'divider' | 'shadow' | 'graphics';

/** Categorías de la documentación de Figma, en su orden. */
export const CATEGORY_ORDER: TokenCategory[] = ['text', 'buttons', 'icon', 'link', 'background', 'border', 'divider', 'shadow', 'graphics'];

export const CATEGORY_LABELS: Record<TokenCategory, string> = {
  text: 'Text',
  buttons: 'Buttons',
  icon: 'Icon',
  link: 'Link',
  background: 'Background',
  border: 'Border',
  divider: 'Divider',
  shadow: 'Shadow',
  graphics: 'Graphics',
};

/**
 * Tokens de los divisores. tokens.css no tiene un grupo `divider`: el divisor de CAOS (`_internal/Divider`) pinta su
 * línea con el borde general de la superficie donde va.
 */
export const DIVIDER_TOKENS = ['--color-ds-border-general-default-on-card', '--color-ds-border-general-default-on-canva'];

/** Clasifica `--color-ds-<tipo>-<subgrupo>-…` en su categoría y su grupo (prefijo del nombre, p. ej. "text-neutral"). */
function classify(variable: string): { category: TokenCategory; group: string } | null {
  const [kind, sub, third] = tokenName(variable).split('-');
  if (!['text', 'icon', 'background', 'border'].includes(kind)) return null;
  if (sub === 'button') return { category: 'buttons', group: `${kind}-button` };
  if (kind === 'text' && sub === 'link') return { category: 'link', group: 'text-link' };
  if (kind === 'background' && sub === 'graphic') return { category: 'graphics', group: `background-graphic-${third}` };
  if (kind === 'background' && sub === 'effect' && third === 'shadow') return { category: 'shadow', group: 'background-effect-shadow' };
  return { category: kind as TokenCategory, group: `${kind}-${sub}` };
}

export interface TokenGroup {
  /** Prefijo común del grupo, p. ej. "text-neutral" */
  group: string;
  tokens: string[];
}

/** Grupos base primero (neutral, container, general); el resto, en orden alfabético (el `sort` es estable). */
function groupRank(group: string): number {
  const i = ['neutral', 'container', 'general'].indexOf(group.split('-')[1] ?? '');
  return i === -1 ? 3 : i;
}

/** Tokens semánticos de color por categoría y grupo (los de los dos modos), en orden alfabético. */
export function readSemanticColors(): Record<TokenCategory, TokenGroup[]> {
  const names = new Set<string>([...tokensIn('dark').keys(), ...tokensIn('light').keys()]);
  const acc = {} as Record<TokenCategory, Map<string, string[]>>;
  for (const c of CATEGORY_ORDER) acc[c] = new Map();
  for (const variable of [...names].sort()) {
    if (!variable.startsWith('--color-ds-') || variable.startsWith('--color-ds-primitives-')) continue;
    const c = classify(variable);
    if (!c) continue;
    acc[c.category].set(c.group, [...(acc[c.category].get(c.group) ?? []), variable]);
  }
  acc.divider.set('border-general', DIVIDER_TOKENS.filter((t) => names.has(t)));
  const out = {} as Record<TokenCategory, TokenGroup[]>;
  for (const c of CATEGORY_ORDER) out[c] = [...acc[c]].map(([group, tokens]) => ({ group, tokens })).sort((a, b) => groupRank(a.group) - groupRank(b.group));
  return out;
}

/** Cantidad de tokens de una lista de grupos. */
export function countTokens(groups: TokenGroup[]): number {
  return groups.reduce((n, g) => n + g.tokens.length, 0);
}

/** Tokens que tienen un valor directo (un hex sin primitivo) en algún modo. */
export function directValueTokens(groups: TokenGroup[]): string[] {
  return groups.flatMap((g) => g.tokens).filter((t) => THEMES.some((theme) => rawToken(t, theme)?.startsWith('#')));
}

/* ---------- Contraste ---------- */

/** Pares texto/fondo que se miden: el ratio sale de los valores de tokens.css en cada modo. */
export const PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: 'Encabezado sobre la superficie', fg: '--color-ds-text-neutral-heading', bg: '--color-ds-background-container-surface' },
  { label: 'Cuerpo sobre la superficie', fg: '--color-ds-text-neutral-body', bg: '--color-ds-background-container-surface' },
  { label: 'Texto secundario sobre la superficie', fg: '--color-ds-text-neutral-gray', bg: '--color-ds-background-container-surface' },
  { label: 'Cuerpo sobre una tarjeta del lienzo', fg: '--color-ds-text-neutral-body', bg: '--color-ds-background-container-default-on-canva' },
  { label: 'Enlace sobre la superficie', fg: '--color-ds-text-link-default', bg: '--color-ds-background-container-surface' },
  { label: 'Texto del botón primario sobre su fondo', fg: '--color-ds-text-button-primary-default', bg: '--color-ds-background-button-primary-default' },
  { label: 'Texto de éxito sobre su fondo', fg: '--color-ds-text-semantic-success', bg: '--color-ds-background-semantic-success-firts' },
  { label: 'Texto informativo sobre su fondo', fg: '--color-ds-text-semantic-information', bg: '--color-ds-background-semantic-information-firts' },
  { label: 'Texto de alerta sobre su fondo', fg: '--color-ds-text-semantic-alert', bg: '--color-ds-background-semantic-alert-firts' },
  { label: 'Texto de error sobre su fondo', fg: '--color-ds-text-semantic-error', bg: '--color-ds-background-semantic-error-firts' },
];

/** Contraste WCAG de un par en un modo (con los hex base; los pares medidos son opacos). */
export function pairRatio(fg: string, bg: string, theme: TokenTheme): number | undefined {
  const f = colorInfo(fg, theme);
  const b = colorInfo(bg, theme);
  return f && b ? contrast(f.hex, b.hex) : undefined;
}

/** Nivel que alcanza un ratio con texto normal: AAA (7:1), AA (4,5:1), solo texto grande (3:1) o ninguno. */
export function ratioLevel(ratio: number): string {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'Solo texto grande';
  return 'No cumple';
}
