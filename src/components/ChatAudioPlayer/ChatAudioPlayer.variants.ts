import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ChatAudioPlayer Variants
 *
 * Fuente: marco "Reproductor" que repiten Conversacion (Atom) 14948:8400 (Variant3), Audio (Atom) 14894:2745 (State3)
 * y la pantalla Chat 14562:57994 (composer móvil). No es un set propio de Figma.
 *
 * - Fila centrada de 36 de alto (FIXED en Figma, `min-h-9`), gap 10 (sin token: se usa space/general/lg 8 + 2 de la escala de Tailwind, `gap-2.5`).
 * - Botón: Button xs (32) solo ícono `play`, secondary (trazo border/button/secondary low) o primary.
 * - "Onda de audio": alto 26 (sin token), barras de 3 de ancho con radio completo y separación 3; las reproducidas en
 *   background/acent/tertiary y las demás en background/general/gray-fifth. Ocupa el ancho libre y recorta.
 * - "Hora": 12 px en text/neutral/body. Figma usa Inter 12/auto sin variables: se usa la familia primaria con
 *   typography/size/sm y body/line-height-short/sm (16).
 */
export const chatAudioPlayerVariants = cva('flex min-h-9 w-full min-w-0 items-center gap-2.5');

/** Contenedor de la onda: recorta las barras que no caben y dibuja el foco del control de posición. */
export const chatAudioPlayerWaveVariants = cva(
  [
    'relative flex h-[26px] min-w-0 flex-1 items-center gap-[3px] overflow-hidden rounded-ds-radius-general-sm',
    'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-solid',
    'has-[input:focus-visible]:outline-ds-border-field-active',
  ].join(' ')
);

export const chatAudioPlayerBarVariants = cva('w-[3px] shrink-0 rounded-full', {
  variants: {
    played: {
      true: 'bg-ds-background-acent-tertiary',
      false: 'bg-ds-background-general-gray-fifth',
    },
  },
  defaultVariants: { played: false },
});

/** Control de posición nativo, invisible y estirado sobre la onda (da teclado y lectores de pantalla). */
export const chatAudioPlayerSeekVariants = cva(
  'absolute inset-0 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-default'
);

export const chatAudioPlayerTimeVariants = cva(
  [
    'm-0 shrink-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-neutral-body tabular-nums',
  ].join(' ')
);
