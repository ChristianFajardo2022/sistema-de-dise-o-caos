/** Utilidades de color para las páginas de Fundamentos (sin dependencia de React). */

/** Luminancia relativa WCAG de un color #rrggbb */
export function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste WCAG entre dos colores #rrggbb */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Negro y blanco digital (primitivos N01 y B01): iguales en ambos temas */
const DARK = { hex: '#000000', css: 'var(--color-ds-primitives-color-primary-n01)' };
const LIGHT = { hex: '#fefefe', css: 'var(--color-ds-primitives-color-primary-b01)' };

/** Color de texto (referencia CSS) con mayor contraste WCAG sobre un fondo #rrggbb: negro o blanco digital */
export function onColor(hex: string): string {
  return contrast(hex, DARK.hex) >= contrast(hex, LIGHT.hex) ? DARK.css : LIGHT.css;
}
