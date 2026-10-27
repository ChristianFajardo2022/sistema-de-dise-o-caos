import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Spinner Variants
 *
 * Fuente: component sets "Spinner" (11262:916, 2 variantes: Type) y "Spinner button"
 * (11309:1208, 6 variantes: Type × Size) de Figma.
 *
 * - ring: marco de dimention/icono/M (56; 48 en Mobile) con dos elipses de trazo 1.5 (border/general/xl)
 *   hacia dentro: la exterior llena el marco y la interior mide dimention/icono/S (24; 16 en Mobile).
 *   Una es border/general/white y la otra border/general/gray-secondary; Type 1 y 2 las intercambian.
 * - dots: caja de 24×24 (md) o 16×16 (sm) con tres elipses de 8 o 6, fondo background/general/white.
 *   Type 1, 2 y 3 rotan la posición de los puntos.
 */
export const spinnerVariants = cva('relative inline-flex shrink-0 items-center justify-center align-middle', {
  variants: {
    variant: {
      ring: 'size-ds-dimention-icono-m',
      dots: '',
    },
    size: {
      md: '',
      sm: '',
    },
  },
  compoundVariants: [
    { variant: 'dots', size: 'md', className: 'size-6' },
    { variant: 'dots', size: 'sm', className: 'size-4' },
  ],
  defaultVariants: { variant: 'ring', size: 'md' },
});

/** Trazo de 1.5 hacia dentro (box-shadow inset: Chrome redondea border-width). */
export const ringBase =
  'absolute inset-0 m-auto rounded-full shadow-[inset_0_0_0_var(--ds-responsive-border-general-lg)_currentColor]';

/** Colores de los anillos: token de Figma o currentColor */
export const ringTone = {
  bright: { default: 'text-ds-border-general-white', current: 'text-current' },
  muted: { default: 'text-ds-border-general-gray-secondary', current: 'text-current opacity-50' },
} as const;

/**
 * Posiciones de los tres puntos según Type, por tamaño (x, y de la esquina, en px de Figma).
 * Las tres ranuras: arriba izquierda, arriba derecha y abajo. El orden de cada Type es el de
 * las elipses "Ellipse 6, 7 y 8" de Figma.
 */
export const dotSlots = {
  md: { tl: 'left-0 top-0', tr: 'left-4 top-0', b: 'left-2 top-4' },
  sm: { tl: 'left-0 top-0', tr: 'left-[10px] top-0', b: 'left-[5px] top-[10px]' },
} as const;

export const dotOrder: Record<'1' | '2' | '3', ('tl' | 'tr' | 'b')[]> = {
  '1': ['tl', 'tr', 'b'],
  '2': ['b', 'tl', 'tr'],
  '3': ['tr', 'b', 'tl'],
};

/**
 * Geometría de la animación (misma que el Load de Button): triángulo equilátero con el centroide como
 * origen del giro; --dx/--dy es lo que se acerca cada punto al centro al juntarse.
 */
export const dotMotion = {
  md: { origin: 'origin-[12px_8.62px]', bottom: 'left-2 top-[13.86px]', tl: '[--dx:8px] [--dy:4.62px]', tr: '[--dx:-8px] [--dy:4.62px]', b: '[--dx:0px] [--dy:-9.24px]' },
  sm: { origin: 'origin-[8px_5.89px]', bottom: 'left-[5px] top-[8.66px]', tl: '[--dx:5px] [--dy:2.89px]', tr: '[--dx:-5px] [--dy:2.89px]', b: '[--dx:0px] [--dy:-5.77px]' },
} as const;
