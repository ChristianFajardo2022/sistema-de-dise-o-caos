/**
 * Lector de tokens.css para las páginas de Fundamentos.
 *
 * Decisión: se importa el archivo como texto (`?raw`) y se parsea, en lugar de usar `getComputedStyle`,
 * porque las tablas deben mostrar los valores de AMBOS temas y de los tres breakpoints a la vez, y el
 * navegador solo expone el valor del tema y del ancho activos. Así la tabla es la misma en dark, light,
 * móvil y escritorio, y sigue a tokens.css sin escribir nada a mano.
 *
 * Ámbitos que reconoce (según los selectores de tokens.css):
 *  - base:    `:root` (primitivos)
 *  - dark:    `:where(:root, .dark, [data-theme="dark"])`
 *  - light:   `:where(.light, [data-theme="light"])`
 *  - common:  bloque común (responsive base = móvil)
 *  - tablet / desktop: `@media (width >= 48rem)` / `(width >= 64rem)`
 *  - theme:   `@theme inline` (utilidades Tailwind, p. ej. `--shadow-ds-on-card`)
 */
import tokensCss from '../../styles/tokens.css?raw';

export type TokenScope = 'base' | 'dark' | 'light' | 'common' | 'tablet' | 'desktop' | 'theme';
export type TokenTheme = 'dark' | 'light';
export type TokenBreakpoint = 'mobile' | 'tablet' | 'desktop';

export const BREAKPOINT_LABELS: Record<TokenBreakpoint, string> = {
  mobile: 'móvil',
  tablet: 'tablet',
  desktop: 'escritorio',
};

function scopeOf(stack: string[]): TokenScope | null {
  const last = stack[stack.length - 1] ?? '';
  if (stack.some((s) => s.startsWith('@utility') || s.startsWith('@custom-variant'))) return null;
  if (stack.some((s) => s.startsWith('@theme'))) return 'theme';
  const media = stack.find((s) => s.startsWith('@media'));
  const bp: TokenScope | null = media?.includes('64rem') ? 'desktop' : media?.includes('48rem') ? 'tablet' : null;
  if (last.includes(':where(:root, .dark')) return 'dark';
  if (last.startsWith(':where(.light')) return 'light';
  if (last.includes('.light, .dark')) return bp ?? 'common';
  if (last === ':root') return 'base';
  return null;
}

/** Recorre el CSS (sin comentarios) con una pila de selectores y guarda cada `--variable: valor;` en su ámbito. */
function parse(css: string): Record<TokenScope, Map<string, string>> {
  const out: Record<TokenScope, Map<string, string>> = {
    base: new Map(),
    dark: new Map(),
    light: new Map(),
    common: new Map(),
    tablet: new Map(),
    desktop: new Map(),
    theme: new Map(),
  };
  const stack: string[] = [];
  let buf = '';
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (ch === '{') {
      stack.push(buf.trim().replace(/\s+/g, ' '));
      buf = '';
    } else if (ch === '}') {
      stack.pop();
      buf = '';
    } else if (ch === ';') {
      const m = buf.trim().match(/^(--[\w-]+)\s*:\s*([\s\S]+)$/);
      const scope = m ? scopeOf(stack) : null;
      if (m && scope) out[scope].set(m[1], m[2].trim().replace(/\s+/g, ' '));
      buf = '';
    } else buf += ch;
  }
  return out;
}

const scopes = parse(tokensCss);

/** Variables declaradas en un ámbito de tokens.css (solo lectura). */
export function tokensIn(scope: TokenScope): ReadonlyMap<string, string> {
  return scopes[scope];
}

/** Ámbitos donde se busca una variable, del más específico al más general, para un tema y un breakpoint. */
function lookupOrder(theme: TokenTheme, bp: TokenBreakpoint): TokenScope[] {
  const order: TokenScope[] = [];
  if (bp === 'desktop') order.push('desktop');
  if (bp !== 'mobile') order.push('tablet');
  order.push(theme, 'common', 'base');
  return order;
}

/** Valor sin resolver de una variable en un tema y breakpoint (puede ser una referencia a otra variable o un color-mix). */
export function rawToken(name: string, theme: TokenTheme, bp: TokenBreakpoint = 'mobile'): string | undefined {
  for (const scope of lookupOrder(theme, bp)) {
    const v = scopes[scope].get(name);
    if (v !== undefined) return v;
  }
  return undefined;
}

/** Sigue las referencias entre variables hasta llegar a un valor final (hex, px, color-mix…). */
export function resolveToken(name: string, theme: TokenTheme, bp: TokenBreakpoint = 'mobile'): string | undefined {
  let value = rawToken(name, theme, bp);
  for (let i = 0; i < 12 && value; i++) {
    const m = value.match(/^var\((--[\w-]+)\)$/);
    if (!m) break;
    value = rawToken(m[1], theme, bp);
  }
  return value;
}

export interface ColorRef {
  /** Nombre corto del primitivo de color, p. ej. "G06" */
  primitive: string;
  /** Opacidad en porcentaje (100 si no hay color-mix) */
  percent: number;
}

/** Descompone un token de color en primitivo + opacidad, p. ej. color-mix(g06 8%) → { primitive: "G06", percent: 8 }. */
export function colorRef(name: string, theme: TokenTheme, bp: TokenBreakpoint = 'mobile'): ColorRef | undefined {
  let value = name.startsWith('--') ? `var(${name})` : name;
  let percent = 100;
  for (let i = 0; i < 12; i++) {
    const mix = value.match(/^color-mix\(in srgb, var\((--[\w-]+)\) ([\d.]+)%, transparent\)$/);
    if (mix) {
      percent = (percent * Number(mix[2])) / 100;
      value = `var(${mix[1]})`;
      continue;
    }
    const ref = value.match(/^var\((--[\w-]+)\)$/);
    if (!ref) return undefined;
    const next = rawToken(ref[1], theme, bp);
    if (next === undefined || /^#|^rgb/.test(next)) {
      return { primitive: ref[1].split('-').pop()!.toUpperCase(), percent };
    }
    value = next;
  }
  return undefined;
}

export interface ShadowToken {
  /** Nombre de la utilidad, p. ej. "shadow-ds-on-card" */
  name: string;
  x: string;
  y: string;
  blur: string;
  spread: string;
  /** Variable de color que usa la sombra, p. ej. "--color-ds-responsive-effect-shadow-on-card" */
  colorVar: string;
}

/** Sombras definidas en tokens.css (x, y, blur, spread y una variable de color). */
export function readShadowTokens(): ShadowToken[] {
  const found: ShadowToken[] = [];
  for (const [key, value] of scopes.theme) {
    if (!key.startsWith('--shadow-')) continue;
    const m = value.match(/^(-?[\d.]+\w*) (-?[\d.]+\w*) (-?[\d.]+\w*) (-?[\d.]+\w*) var\((--[\w-]+)\)$/);
    if (!m) continue;
    found.push({ name: key.slice(2), x: m[1], y: m[2], blur: m[3], spread: m[4], colorVar: m[5] });
  }
  return found;
}

/** "0px" → "0"; deja el resto igual. Las tablas muestran números sin unidad como en Figma. */
export function stripPx(value: string): string {
  return value.replace(/px$/, '');
}

/** Valor numérico en px de un token en un breakpoint (tema oscuro; los espacios y tamaños no cambian con el tema). 0 si no existe. */
export function px(name: string, bp: TokenBreakpoint = 'mobile'): number {
  return parseFloat(resolveToken(name, 'dark', bp) ?? '0');
}
