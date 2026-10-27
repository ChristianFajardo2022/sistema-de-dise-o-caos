import { cva } from 'class-variance-authority';
import { PAD_B_16_STROKE, STROKE_BOTTOM, STROKE_VAR } from './NotificationItem.shared';

/**
 * CAOS Design System — NotificationItem Variants
 *
 * Fuente: component set "Text notification (Atom)" de Figma (12571:4812), Type = Default | Active (333×58.5).
 *
 * - Raíz: columna, gap gap/general/sm (4), relleno inferior space/general/2xl (16) y trazo inferior de
 *   border/general/md (0.5) en border/general/default-on-card. El trazo se dibuja con box-shadow inset y su grosor se suma
 *   al relleno (Figma lo cuenta dentro del alto: 20 + 4 + 18 + 16 + 0.5 = 58.5).
 * - Fila "Heading": gap gap/general/xl (16 escritorio, 12 móvil; no hay utilidad, como el Footer) con el título a la
 *   izquierda y el punto de no leída (Badge simple Success, 12) a la derecha.
 * - Título: Helvetica Neue 16/20 (typography/size/lg y line-height-short/lg) en text/neutral/white; regular si está
 *   leída y semibold (600, typography/weight/Semibold) si no.
 * - Descripción: 14/18 (typography/size/md y line-height-short/md) en text/neutral/body.
 * - El control (título como botón o enlace) se estira con `::after` sobre toda la fila; el foco con teclado dibuja un
 *   outline de 2px en la raíz.
 */
export const notificationItemVariants = cva(
  [
    'relative isolate m-0 box-border flex w-full min-w-0 list-none flex-col gap-ds-space-general-md p-0',
    STROKE_VAR,
    STROKE_BOTTOM,
    PAD_B_16_STROKE,
    'has-[[data-notification-control]:focus-visible]:outline-2 has-[[data-notification-control]:focus-visible]:outline-offset-2',
    'has-[[data-notification-control]:focus-visible]:outline-solid has-[[data-notification-control]:focus-visible]:outline-ds-border-field-active',
  ].join(' ')
);

export const notificationItemHeadingVariants = cva(
  'flex min-w-0 items-center gap-ds-space-general-2xl max-md:gap-ds-space-general-xl'
);

export const notificationItemTitleVariants = cva(
  [
    'm-0 block min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-left no-underline outline-none',
    'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-lg',
    'leading-ds-typography-body-line-height-short-lg text-ds-text-neutral-white',
  ].join(' '),
  {
    variants: {
      unread: {
        true: '[font-weight:var(--ds-primitives-typography-weight-semibold)]',
        false: '[font-weight:var(--ds-primitives-typography-weight-regular)]',
      },
      interactive: {
        true: "cursor-pointer after:absolute after:inset-0 after:z-0 after:content-['']",
        false: '',
      },
    },
    defaultVariants: { unread: false, interactive: false },
  }
);

export const notificationItemDescriptionVariants = cva(
  [
    'm-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-body',
  ].join(' ')
);
