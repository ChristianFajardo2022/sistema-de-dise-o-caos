import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/*
 * tailwind-merge no conoce las utilidades tipográficas de tokens.css: sin esto toma text-ds-*-size-* como color
 * de texto y font-ds-*-family-* como peso, y al juntarlas con su color o su peso borra una de las dos.
 */
const twMerge = extendTailwindMerge({
  extend: {
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
