import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — TopAppBar Variants
 *
 * Fuente: component set "Top App Bar" de Figma (17295:110677, 8 variantes: Type × Position).
 * La barra de estado del teléfono no se dibuja (es decorativa y no está en la spec).
 *
 * - Raíz: padding space/general/2xl (16), gap space/general/xl (12), sin relleno, texto text/neutral/heading.
 *   Alto fijo: Ios 54 y Android 64 en una fila; With Action Only es vertical: Ios 125 y Android 120.
 * - Título: Prospero semibold. En Centered/Left, heading md (16/20); en Action Only y Title Only, heading xl (24/28).
 * - Subtítulo: body sm (12). Centered/Left en semibold (Figma pide Bold 700; se usa semibold, ver reporte) con línea 18; Action Only en regular con línea 16.
 * - Foco de los botones: lo pone cada botón (Button / ButtonCorner).
 */
export const topAppBarVariants = cva(
  'box-border w-full text-ds-text-neutral-heading p-ds-space-general-2xl gap-ds-space-general-xl',
  {
    variants: {
      platform: { ios: '', android: '' },
      position: {
        centered: 'grid grid-cols-[minmax(2.75rem,1fr)_minmax(0,auto)_minmax(2.75rem,1fr)] items-center',
        left: 'flex items-center',
        'title-only': 'flex items-center',
        'action-only': 'flex flex-col items-start justify-center',
      },
    },
    compoundVariants: [
      { platform: 'ios', position: ['centered', 'left', 'title-only'], class: 'h-[54px]' },
      { platform: 'android', position: ['centered', 'left', 'title-only'], class: 'h-16' },
      { platform: 'ios', position: 'action-only', class: 'h-[125px]' },
      { platform: 'android', position: 'action-only', class: 'h-[120px]' },
    ],
    defaultVariants: { platform: 'ios', position: 'centered' },
  }
);

/** Fila superior de `action-only`: botón de la izquierda y acciones, separados */
export const topAppBarActionRowVariants = cva('flex w-full items-center justify-between', {
  variants: { platform: { ios: 'min-h-11', android: 'min-h-12' } },
  defaultVariants: { platform: 'ios' },
});

export const topAppBarTitleBlockVariants = cva('flex min-w-0 flex-col gap-ds-space-general-md', {
  variants: {
    position: {
      centered: 'items-center text-center',
      left: 'flex-1 items-start text-left',
      'title-only': 'flex-1 items-start text-left',
      'action-only': 'w-full items-start text-left',
    },
  },
  defaultVariants: { position: 'centered' },
});

export const topAppBarTitleVariants = cva(
  [
    'm-0 min-w-0',
    'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  ].join(' '),
  {
    variants: {
      large: {
        false: 'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md',
        true: 'text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl',
      },
    },
    defaultVariants: { large: false },
  }
);

export const topAppBarSubtitleVariants = cva(
  ['m-0 font-ds-primitives-typography-family-primary text-ds-typography-body-size-sm'].join(' '),
  {
    variants: {
      weight: {
        bold: '[font-weight:var(--ds-primitives-typography-weight-semibold)] leading-ds-typography-body-line-height-large-sm',
        regular: '[font-weight:var(--ds-primitives-typography-weight-regular)] leading-ds-typography-body-line-height-short-sm',
      },
    },
    defaultVariants: { weight: 'bold' },
  }
);
