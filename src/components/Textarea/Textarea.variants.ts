import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Textarea Variants
 *
 * Fuente: tipo Coment del component set "General input" de Figma (8 states, alto 86).
 * La base visual (recuadro, estados, label flotante) sale de Input (`inputFieldVariants`,
 * `inputLabelVariants`); aquí solo van lo propio del área de texto.
 *
 * - Campo: padding 8/12, gap 16 entre el bloque de texto (38) y el contador (12/16), borde de 1px y radio field/md.
 *   Con una línea y contador mide 8 + 38 + 16 + 16 + 8 = 86 (Figma da 88 solo en Default y Disabled: ver "para diseño").
 * - Bloque de texto: label 12/16 arriba, 4 de separación y el texto en 14/18 (la primera línea empieza a 20).
 *   El label en reposo va en el primer renglón (14/18, top 0), no centrado como en Input.
 */

/** El <textarea> real, debajo del label (hermano anterior del label: `peer`). */
export const textareaControlVariants = cva(
  [
    'peer block w-full min-w-0 appearance-none border-0 bg-transparent p-0 outline-none',
    'pt-[20px] pb-0 text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm)',
    'text-(color:--val) [font-family:inherit] [font-weight:inherit]',
    'disabled:cursor-not-allowed',
    // El placeholder del consumidor solo se ve con foco (vacío); el " " interno nunca se ve
    'placeholder:text-(color:--ph) [--ph:transparent] focus:[--ph:var(--val)]',
  ].join(' '),
  {
    variants: {
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
      showPlaceholder: {
        // Estados forzados de documentación: el placeholder se ve siempre
        true: '[--ph:var(--val)]',
        false: '',
      },
      auto: {
        // field-sizing: content donde exista; el respaldo en JS ajusta la altura inline
        true: '[field-sizing:content] overflow-y-auto',
        false: '',
      },
    },
    defaultVariants: { resize: 'vertical', showPlaceholder: false, auto: false },
  }
);

/** Contador "n/máx" (12/16). Color según el state, como en Figma. */
export const textareaCounterVariants = cva('text-ds-typography-field-size-xs leading-(--ds-responsive-typography-field-line-height-xs)', {
  variants: {
    tone: {
      secondary: 'text-ds-text-field-label-secondary',
      muted: 'text-ds-text-field-disabled-negative',
    },
  },
  defaultVariants: { tone: 'secondary' },
});
