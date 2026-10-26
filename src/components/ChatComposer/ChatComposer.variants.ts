import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ChatComposer Variants
 *
 * Fuente: component set "Audio (Atom)" de Figma (14894:2745). Pese al nombre, es el campo para escribir de la
 * conversación (no el mensaje de audio). Set con errores: dos variantes se llaman "State=State3".
 * - State=Default (98 de alto): campo con Enviar dentro y Grabar a la derecha, en una fila.
 * - State=State4 (146): lo mismo y debajo la fila "CTA" con los adjuntos (folder, image).
 * - State=State3 (114, la primera): audio grabado (onda, duración y reproducir a la derecha) y adjuntos debajo.
 * - State=State3 (134, la segunda): audio con reproducir a la izquierda; abajo adjuntos a la izquierda y Grabar + Enviar
 *   a la derecha. La pantalla Chat móvil usa esta disposición con botones sm (40) y el ícono `add` como adjunto.
 *
 * - Raíz: background/container/default-on-card, trazo de 1 (border/general/gray-sixth, suma al alto como en Figma), radius/container/On card
 *   (24 en escritorio, responsive), padding y gap space/general/2xl (16). Dos filas: gap space/general/2xl (16); con
 *   audio, space/general/4xl (32). Móvil (`touch`): padding 8/8/8/16 (space/general/lg y 2xl), gap 3xl (24), sin trazo.
 * - Campo: alto 64, padding space/general/xl (12), radius/general/xl (16). Figma no enlaza el relleno (#45484d = G12):
 *   se usa background/field/surface-secondary, que es G12 en oscuro.
 * - Texto: typography/field/size/sm y field/line-height/sm (14/18), familia primaria; ayuda en text/field/label-secondary.
 * - Botones: Button xs (32) solo ícono; Enviar primary `send2`, Grabar y adjuntos secondary. Grabar usa
 *   `maximize-circle-2` (9595:10246), el micrófono que dibuja Figma.
 */
export const chatComposerVariants = cva(
  'box-border flex w-full min-w-0 flex-col rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card',
  {
    variants: {
      touch: {
        false: [
          'gap-ds-space-general-2xl p-ds-space-general-2xl',
          // Trazo de 1 que suma al alto, como en Figma (98 = 64 + 2 × 16 + 2 × 1)
          '[border:var(--ds-responsive-border-general-lg)_solid_var(--color-ds-border-general-gray-sixth)]',
        ].join(' '),
        true: 'gap-ds-space-general-3xl py-ds-space-general-lg pr-ds-space-general-lg pl-ds-space-general-2xl',
      },
      withAudio: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [{ touch: false, withAudio: true, class: 'gap-ds-space-general-4xl' }],
    defaultVariants: { touch: false, withAudio: false },
  }
);

/** Fila superior: campo (o audio) y Grabar. */
export const chatComposerTopRowVariants = cva('flex w-full min-w-0 items-center gap-ds-space-general-2xl');

/** Campo: alto 64, relleno, radio 16 y foco visible con el token de borde activo. */
export const chatComposerFieldVariants = cva(
  [
    'box-border flex min-h-16 min-w-0 flex-1 items-start gap-2.5 rounded-ds-radius-general-xl p-ds-space-general-xl',
    'bg-ds-background-field-surface-secondary',
    'has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-offset-2',
    'has-[textarea:focus-visible]:outline-solid has-[textarea:focus-visible]:outline-ds-border-field-active',
    'has-[textarea:disabled]:opacity-60',
  ].join(' ')
);

export const chatComposerTextareaVariants = cva(
  [
    'm-0 block min-h-10 max-h-32 min-w-0 flex-1 resize-none appearance-none border-0 bg-transparent p-0 outline-none',
    '[field-sizing:content]',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-field-size-sm leading-ds-typography-field-line-height-sm text-ds-text-field-placeholder',
    'placeholder:text-ds-text-field-label-secondary disabled:cursor-not-allowed',
  ].join(' ')
);

/** Enviar dentro del campo: abajo a la derecha (centrado en el campo de una línea). */
export const chatComposerSendInlineVariants = cva('shrink-0 self-center');

/** Fila inferior (marco "CTA"): adjuntos a la izquierda, Grabar y Enviar a la derecha. */
export const chatComposerBottomRowVariants = cva('flex w-full min-w-0 items-center justify-between gap-ds-space-general-lg');

export const chatComposerGroupVariants = cva('flex shrink-0 items-center gap-ds-space-general-lg');
