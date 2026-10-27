import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ChatMessage Variants
 *
 * Fuente: component set "Conversacion (Atom)" de Figma (14948:8400), Property 1 = Default | Variant2 | Variant4 | Variant5 (266 de
 * ancho; en la pantalla Chat 14562:57994 ocupa todo el ancho de la conversación).
 *
 * - Fila: gap space/general/lg (8), centrada en vertical. El lado opuesto al avatar deja un margen de
 *   space/general/6xl (56 en escritorio, 40 en móvil, responsive).
 * - Default (`incoming`): avatar sm (32) y burbuja a la izquierda; Variant5 es su versión de audio. Variant2 y Variant4
 *   (audio) son `outgoing`: burbuja y avatar a la derecha.
 * - Burbuja: radius/general/xl (16). Texto: padding 8 arriba y abajo (space/general/lg) y 12 a los lados
 *   (space/general/xl); audio: 12 en los cuatro lados. Gap 2 (space/general/sm) entre contenido y hora.
 *   - incoming: background/general/gray-seventh, texto text/neutral/gray y hora text/neutral/gray 2.
 *   - outgoing: background/acent/secondary, texto text/neutral/black-unicolor y hora text/acent/secondary (unicolor:
 *     no cambian con el tema).
 * - Texto: 12/16 Semibold (typography/size/sm, weight/Semibold). Hora visible: 10/14 regular (body/size/xs).
 * - `type="audio"`: la burbuja se estira (FILL) y lleva el marco "Reproductor" (`ChatAudioPlayer`, con la hora de
 *   duración a la izquierda de la onda).
 */
export const chatMessageVariants = cva('flex w-full min-w-0 items-center gap-ds-space-general-lg', {
  variants: {
    direction: {
      incoming: 'justify-start pr-ds-space-general-6xl',
      outgoing: 'justify-end pl-ds-space-general-6xl',
    },
  },
  defaultVariants: { direction: 'incoming' },
});

export const chatMessageBubbleVariants = cva(
  [
    'flex min-w-0 flex-col gap-ds-space-general-sm rounded-ds-radius-general-xl',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm [overflow-wrap:anywhere]',
  ].join(' '),
  {
    variants: {
      direction: {
        incoming: 'bg-ds-background-general-gray-seventh text-ds-text-neutral-gray',
        outgoing: 'bg-ds-background-acent-secondary',
      },
      type: {
        // Texto: 8 arriba/abajo (general/lg) y 12 a los lados (general/xl)
        text: 'px-ds-space-general-xl py-ds-space-general-lg',
        // Audio: 12 en los cuatro lados
        audio: 'flex-1 p-ds-space-general-xl',
      },
    },
    compoundVariants: [
      // La hora de duración del reproductor hereda el color de la burbuja: en la saliente es text/acent/secondary
      { direction: 'outgoing', type: 'text', class: 'text-ds-text-neutral-black-unicolor' },
      { direction: 'outgoing', type: 'audio', class: 'text-ds-text-acent-secondary' },
    ],
    defaultVariants: { direction: 'incoming', type: 'text' },
  }
);

/** Hora visible dentro de la burbuja (capa "Hora"): 10/14 regular, bajo el contenido. */
export const chatMessageTimeVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs',
  ].join(' '),
  {
    variants: {
      direction: {
        incoming: 'text-ds-text-neutral-gray-2',
        outgoing: 'text-ds-text-acent-secondary',
      },
    },
    defaultVariants: { direction: 'incoming' },
  }
);

/** Avatar de 32 (dimention/avatar/sm). */
export const chatMessageAvatarVariants = cva('flex shrink-0 items-center justify-center');

/** Registro de mensajes: lista sin viñetas, gap space/general/lg (8) como el slot Container3 de Figma. */
export const chatMessageListVariants = cva('m-0 flex list-none flex-col gap-ds-space-general-lg p-0');
