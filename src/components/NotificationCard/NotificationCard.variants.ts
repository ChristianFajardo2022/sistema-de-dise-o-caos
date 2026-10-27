import { cva } from 'class-variance-authority';
import { PAD_B_CARD_STROKE, STROKE_BOTTOM, STROKE_VAR } from '../NotificationItem/NotificationItem.shared';

/**
 * CAOS Design System — NotificationCard Variants
 *
 * Fuente: component set "Group notification (Atom)" de Figma (14963:6348), Type = Simple | Simple delete × State =
 * Unread | Read (351×128). Las variantes Group, Group delete y Dropdown group son `NotificationGroup`.
 *
 * - Raíz: marco horizontal sin relleno con la tarjeta ("Content") y el marco "Eliminate".
 * - Unread: tarjeta de relleno background/container/hover-on-canva, relleno space/container/on-card (24), radio
 *   radius/general/xl (16), gap 4. Read: sin relleno ni radio, relleno vertical 24 y trazo inferior de
 *   border/divider/md (0.5) en border/general/default-on-card (box-shadow inset; su grosor se suma al relleno inferior,
 *   como cuenta Figma el alto).
 * - Con el botón eliminar a la vista la tarjeta pierde el radio derecho (Unread) o gana relleno derecho 16 (Read).
 * - Hora: 12/16 regular (typography/size/sm); título: Prospero semibold 12/16 (heading/size/xs); descripción 14/20 regular
 *   (typography/body/size/md y line-height-large/md). Todo en text/neutral/white.
 * - Eliminate: 48 de ancho, relleno 8/12, radio derecho 16, background/semantic/error/tertiary y ícono trash de 24 en
 *   background/general/white (la variable que enlaza Figma).
 */
export const notificationCardRootVariants = cva('m-0 box-border flex w-full min-w-0 list-none items-stretch p-0');

export const notificationCardContentVariants = cva(
  [
    'relative isolate box-border flex min-w-0 flex-1 flex-col gap-ds-space-general-md',
    'has-[[data-notification-control]:focus-visible]:outline-2 has-[[data-notification-control]:focus-visible]:outline-offset-2',
    'has-[[data-notification-control]:focus-visible]:outline-solid has-[[data-notification-control]:focus-visible]:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      unread: {
        true: 'rounded-ds-radius-general-xl bg-ds-background-container-hover-on-canva p-ds-space-container-on-card',
        false: ['pt-ds-space-container-on-card', STROKE_VAR, STROKE_BOTTOM, PAD_B_CARD_STROKE].join(' '),
      },
      revealed: { true: '', false: '' },
    },
    compoundVariants: [
      { unread: true, revealed: true, class: 'rounded-r-none' },
      { unread: false, revealed: true, class: 'pr-ds-space-general-2xl' },
    ],
    defaultVariants: { unread: false, revealed: false },
  }
);

export const notificationCardTimeRowVariants = cva('flex items-center gap-ds-space-general-lg');

export const notificationCardHeadingRowVariants = cva('flex min-w-0 items-center gap-ds-space-general-lg');

/** Título: Prospero semibold, heading/size/xs (12/16 en el principal). */
export const notificationCardTitleVariants = cva(
  [
    'm-0 block min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-left no-underline outline-none',
    'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-white',
  ].join(' '),
  {
    variants: {
      interactive: {
        true: "cursor-pointer after:absolute after:inset-0 after:z-0 after:content-['']",
        false: '',
      },
    },
    defaultVariants: { interactive: false },
  }
);

export const notificationCardDescriptionVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white',
  ].join(' ')
);

/**
 * Marco "Eliminate": 0 de ancho hasta que se muestra (deslizar, `revealed` o foco dentro) y 48 con el botón.
 * El botón queda siempre en el DOM para que el teclado y los lectores lleguen a él.
 */
export const notificationDeleteVariants = cva(
  [
    'box-border flex shrink-0 self-stretch overflow-hidden rounded-r-ds-radius-general-xl bg-ds-background-semantic-error-tertiary',
    'transition-[width] duration-200 ease-out focus-within:w-12 motion-reduce:transition-none',
  ].join(' '),
  {
    variants: { revealed: { true: 'w-12', false: 'w-0' } },
    defaultVariants: { revealed: false },
  }
);

export const notificationDeleteButtonVariants = cva(
  [
    'm-0 box-border flex h-full w-12 shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent',
    'px-ds-space-general-xl py-ds-space-general-lg text-ds-background-general-white outline-none',
    'focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' ')
);
