import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ChatMessage Variants
 *
 * Fuente: component set "Conversacion (Atom)" de Figma (14948:8400), Property 1 = Default | Variant2 | Variant3 (266 de
 * ancho; en la pantalla Chat 14562:57994 ocupa todo el ancho de la conversación).
 *
 * - Fila: gap space/general/lg (8), centrada en vertical. El lado opuesto al avatar deja un margen de
 *   space/general/6xl (56 en escritorio, 40 en móvil, responsive).
 * - Default (`incoming`): avatar sm (32) y burbuja a la izquierda. Variant2/3 (`outgoing`): burbuja y avatar a la derecha.
 * - Burbuja: padding space/general/xl (12) arriba y abajo, space/container/second-level (16; en tokens.css es
 *   space/general/2xl) a los lados, radius/general/full.
 *   - incoming: background/acent/secondary con texto text/neutral/black-unicolor (los dos son unicolor: no cambian con
 *     el tema).
 *   - outgoing: background/general/gray-seventh con texto text/neutral/gray 2 de Figma (alias G07), que en tokens.css es
 *     text/neutral/gray (gray-2 apunta a G08/G10): se usa text/neutral/gray, como FileCard.
 * - Texto: 12/16 (typography/size/sm y body/line-height-short/sm), familia primaria regular.
 * - Variant3 (`type="audio"`): la burbuja se estira (FILL) y lleva el marco "Reproductor" (`ChatAudioPlayer`).
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
    'min-w-0 rounded-ds-radius-general-full px-ds-space-general-2xl py-ds-space-general-xl',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm [overflow-wrap:anywhere]',
  ].join(' '),
  {
    variants: {
      direction: {
        incoming: 'bg-ds-background-acent-secondary text-ds-text-neutral-black-unicolor',
        outgoing: 'bg-ds-background-general-gray-seventh text-ds-text-neutral-gray',
      },
      type: {
        text: '',
        audio: 'flex-1',
      },
    },
    defaultVariants: { direction: 'incoming', type: 'text' },
  }
);

/** Avatar de 32 (dimention/avatar/sm). */
export const chatMessageAvatarVariants = cva('flex shrink-0 items-center justify-center');

/** Registro de mensajes: lista sin viñetas, gap space/general/lg (8) como el slot Container3 de Figma. */
export const chatMessageListVariants = cva('m-0 flex list-none flex-col gap-ds-space-general-lg p-0');
