/**
 * Datos de color de la página Colores, todos leídos de tokens.css mediante `_doc/tokensCss`.
 * Nada de esto se escribe a mano: las familias, los grupos y los contrastes se derivan de las variables.
 */
import { colorRef, luminance, rawToken, resolveToken, tokensIn } from '../_doc';
import type { TokenTheme } from '../_doc';

export const THEMES: TokenTheme[] = ['dark', 'light'];
export const THEME_LABELS: Record<TokenTheme, string> = { dark: 'Oscuro', light: 'Claro' };

/* ---------- Primitivos ---------- */

export interface Primitive {
  /** Nombre corto, p. ej. "G10" */
  code: string;
  /** Variable CSS completa */
  variable: string;
  /** Valor por tema (solo difiere si tokens.css redefine el primitivo en un tema) */
  value: Record<TokenTheme, string>;
}

export interface PrimitiveFamily {
  id: string;
  label: string;
  items: Primitive[];
}

const PRIMITIVE_RE = /^--color-ds-primitives-color-([a-z]+)-([a-z]+\d+)$/;

const FAMILY_LABELS: Record<string, string> = {
  primary: 'Primario',
  secondary: 'Secundario',
  tertiary: 'Terciario',
  information: 'Informativo',
  confirmation: 'Confirmación',
  error: 'Error',
  alert: 'Alerta',
};

/** Familias de primitivos de color en el orden en que aparecen en tokens.css; neutros de oscuro a claro. */
export function readPrimitiveFamilies(): PrimitiveFamily[] {
  const byFamily = new Map<string, Primitive[]>();
  for (const [variable] of tokensIn('base')) {
    const m = variable.match(PRIMITIVE_RE);
    if (!m) continue;
    const item: Primitive = {
      code: m[2].toUpperCase(),
      variable,
      value: {
        dark: resolveToken(variable, 'dark') ?? '',
        light: resolveToken(variable, 'light') ?? '',
      },
    };
    byFamily.set(m[1], [...(byFamily.get(m[1]) ?? []), item]);
  }
  return [...byFamily].map(([id, items]) => ({
    id,
    label: FAMILY_LABELS[id] ?? id,
    items: [...items].sort((a, b) => luminance(a.value.light) - luminance(b.value.light)),
  }));
}

/** Primitivos "externos" (--ds-external-*): copias fuera de la familia con su propio valor. */
export function readExternalPrimitives(): Primitive[] {
  return [...tokensIn('base')]
    .filter(([k]) => k.startsWith('--ds-external-'))
    .map(([variable]) => ({
      code: variable.split('-').pop()!.toUpperCase(),
      variable,
      value: { dark: resolveToken(variable, 'dark') ?? '', light: resolveToken(variable, 'light') ?? '' },
    }));
}

/* ---------- Tokens semánticos ---------- */

export interface ColorInfo {
  /** Valor CSS para pintar (hex o color-mix con primitivos) */
  css: string;
  /** Hex del color base */
  hex: string;
  /** Primitivo al que apunta, p. ej. "G13" */
  primitive: string;
  /** Opacidad en % (100 si es opaco) */
  percent: number;
}

/** Color final de un token en un tema: valor CSS, hex base, primitivo y opacidad. */
export function colorInfo(variable: string, theme: TokenTheme): ColorInfo | undefined {
  const css = resolveToken(variable, theme);
  const ref = colorRef(variable, theme);
  if (!css || !ref) return undefined;
  const inner = css.match(/color-mix\(in srgb, var\((--[\w-]+)\)/);
  const hex = inner ? resolveToken(inner[1], theme) : css;
  if (!hex || !hex.startsWith('#')) return undefined;
  return { css, hex, primitive: ref.primitive, percent: Number(ref.percent.toFixed(2)) };
}

export type TokenCategory = 'text' | 'buttons' | 'icon' | 'link' | 'background' | 'border' | 'shadow' | 'graphics';

export const CATEGORY_ORDER: TokenCategory[] = ['text', 'buttons', 'icon', 'link', 'background', 'border', 'graphics', 'shadow'];

export const CATEGORY_LABELS: Record<TokenCategory, string> = {
  text: 'Text',
  buttons: 'Buttons',
  icon: 'Icon',
  link: 'Link',
  background: 'Background',
  border: 'Border',
  graphics: 'Graphics',
  shadow: 'Shadow',
};

/** Clasifica `--color-ds-<tipo>-<subgrupo>-…` en la categoría de la documentación y su grupo interno. */
function classify(variable: string): { category: TokenCategory; group: string } | null {
  const parts = variable.replace('--color-ds-', '').split('-');
  const [kind, sub, third] = parts;
  if (!['text', 'icon', 'background', 'border'].includes(kind)) return null;
  if (sub === 'button') return { category: 'buttons', group: `${kind} · ${third}` };
  if (kind === 'text' && sub === 'link') return { category: 'link', group: 'link' };
  if (kind === 'background' && sub === 'graphic') return { category: 'graphics', group: third };
  if (kind === 'background' && sub === 'effect' && third === 'shadow') return { category: 'shadow', group: 'shadow' };
  return { category: kind as TokenCategory, group: sub };
}

export interface TokenGroup {
  group: string;
  tokens: string[];
}

/** Tokens semánticos de color agrupados por categoría y subgrupo (unión de oscuro y claro). */
export function readSemanticColors(): Record<TokenCategory, TokenGroup[]> {
  const names = new Set<string>([...tokensIn('dark').keys(), ...tokensIn('light').keys()]);
  const acc = {} as Record<TokenCategory, Map<string, string[]>>;
  for (const c of CATEGORY_ORDER) acc[c] = new Map();
  for (const variable of [...names].sort()) {
    if (!variable.startsWith('--color-ds-') || variable.startsWith('--color-ds-primitives-')) continue;
    if (rawToken(variable, 'dark') === undefined && rawToken(variable, 'light') === undefined) continue;
    const c = classify(variable);
    if (!c) continue;
    acc[c.category].set(c.group, [...(acc[c.category].get(c.group) ?? []), variable]);
  }
  const out = {} as Record<TokenCategory, TokenGroup[]>;
  for (const c of CATEGORY_ORDER) out[c] = [...acc[c]].map(([group, tokens]) => ({ group, tokens }));
  return out;
}

/** Cantidad de tokens de una lista de grupos. */
export function countTokens(groups: TokenGroup[]): number {
  return groups.reduce((n, g) => n + g.tokens.length, 0);
}
