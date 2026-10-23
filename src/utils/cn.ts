import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Valor de una utilidad generada desde tokens.css (`h-ds-…`, `p-ds-…`, `rounded-ds-…`, `shadow-ds-…`). */
const isDsToken = (value: string) => value.startsWith('ds-');

/*
 * tailwind-merge no conoce las utilidades de tokens.css:
 * - Tipografía: sin esto toma text-ds-*-size-* como color de texto y font-ds-*-family-* como peso, y al juntarlas
 *   con su color o su peso borra una de las dos.
 * - Medidas (`--spacing-ds-*`: alto, ancho, size, padding, margin, gap, inset), radios (`--radius-ds-*`) y sombras
 *   (`--shadow-ds-*`): sin esto no las ve en conflicto con `h-auto`, `p-0`, `rounded-sm`, `shadow-none`…, deja las dos
 *   y gana la que el CSS genere después (había que forzar con `!`). Con la escala extendida gana la última de cn().
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [isDsToken],
      radius: [isDsToken],
      shadow: [isDsToken],
    },
    classGroups: {
      'font-size': [{ text: [(value: string) => /^ds-(?:[a-z]+-)*typography-.*size-/.test(value)] }],
      'font-family': [{ font: [(value: string) => /^ds-.*typography-family-/.test(value)] }],
      'font-weight': [{ font: [(value: string) => /^ds-.*typography-weight-/.test(value)] }],
      leading: [{ leading: [(value: string) => /^ds-/.test(value)] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
