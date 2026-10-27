import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ChatCard Variants
 *
 * Fuente: component set "Chat card" de Figma (14857:9704), State = Default | Active (767×72).
 *
 * - Raíz: fila centrada, padding space/general/xl (12), gap space/general/3xl (24), radius/general/xl (16).
 *   Default transparente; Active (`selected`) con background/container/select-on-card.
 * - Fila interna: avatar de 48 y texto, gap 16 (space/general/2xl). Texto: gap 4; título Prospero semibold 16/20
 *   (heading/size/md) en text/neutral/heading, descripción 14/18 en text/neutral/gray.
 * - Meta a la derecha: gap 8, alineada al final; hora 12/16 en text/neutral/gray y Badge número.
 * - El control (botón o enlace) es el título, estirado con `::after` sobre toda la tarjeta; lo demás es visual.
 *   Foco visible: outline de 2px en la raíz (el control es pequeño).
 * - Los botones de la fila de Figma (Frame 1984080549, x=1218, fuera del cuadro de 767) no se ven en el set: son el
 *   slot `actions`.
 */
export const chatCardVariants = cva(
  [
    'relative isolate box-border flex w-full min-w-0 items-center gap-ds-space-general-3xl p-ds-space-general-xl',
    'rounded-ds-radius-general-xl transition-colors duration-300 ease-out motion-reduce:transition-none',
    'has-[[data-chat-control]:focus-visible]:outline-2 has-[[data-chat-control]:focus-visible]:outline-offset-2',
    'has-[[data-chat-control]:focus-visible]:outline-solid has-[[data-chat-control]:focus-visible]:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      selected: {
        true: 'bg-ds-background-container-select-on-card',
        false: 'bg-transparent',
      },
    },
    defaultVariants: { selected: false },
  }
);

export const chatCardMainVariants = cva('flex min-w-0 flex-1 items-center gap-ds-space-general-2xl');

/** Avatar de 48 con el indicador de en línea (Badge simple Success) abajo a la derecha. */
export const chatCardLeadingVariants = cva('relative flex size-12 shrink-0 items-center justify-center');

export const chatCardTextVariants = cva('flex min-w-0 flex-1 flex-col gap-ds-space-general-md');

/** Título: es el control (botón o enlace) reiniciado, con el área clicable estirada a toda la tarjeta. */
export const chatCardControlVariants = cva(
  [
    'm-0 block min-w-0 cursor-pointer appearance-none truncate border-0 bg-transparent p-0 text-left no-underline outline-none',
    "after:absolute after:inset-0 after:z-0 after:rounded-[inherit] after:content-['']",
    'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
    'disabled:cursor-not-allowed',
  ].join(' ')
);

export const chatCardDescriptionVariants = cva(
  [
    'm-0 min-w-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-gray',
  ].join(' '),
  {
    variants: {
      /** Una línea (átomo, 18) o dos (lista de la pantalla Chat, 36) antes de los puntos suspensivos. */
      lines: {
        1: 'truncate',
        2: 'line-clamp-2 break-words',
      },
    },
    defaultVariants: { lines: 1 },
  }
);

export const chatCardMetaVariants = cva('flex shrink-0 flex-col items-end justify-center gap-ds-space-general-lg');

export const chatCardTimeVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-neutral-gray',
  ].join(' ')
);

export const chatCardActionsVariants = cva('relative z-[1] flex shrink-0 items-center gap-ds-space-general-lg');
