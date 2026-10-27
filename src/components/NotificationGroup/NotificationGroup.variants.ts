import { cva } from 'class-variance-authority';
import { PAD_B_CARD_STROKE, STROKE_BOTTOM, STROKE_VAR } from '../NotificationItem/NotificationItem.shared';

/** Trazos superior e inferior de Figma (border/general/md, border/general/default-on-card) de una fila del desplegable. */
const STROKE_TOP_BOTTOM =
  '[box-shadow:inset_0_var(--nstroke)_0_0_var(--color-ds-border-general-default-on-card),inset_0_calc(var(--nstroke)_*_-1)_0_0_var(--color-ds-border-general-default-on-card)]';

/**
 * CAOS Design System — NotificationGroup y NotificationGroupItem Variants
 *
 * Fuentes: component sets "Group notification (Atom)" (14963:6348), Type = Group | Group delete | Dropdown group ×
 * State = Unread | Read, y "Dropdown group notification (Atom)" (14914:1288), Type = Default | Eliminate × State.
 *
 * Grupo:
 * - Raíz: marco horizontal sin relleno con la tarjeta y el marco "Eliminate" (mismo que `NotificationCard`).
 * - Tarjeta Unread: relleno background/container/hover-on-canva, relleno space/container/on-card (24), radio radius/general/xl (16), gap 4.
 *   Read recogida: sin relleno, relleno vertical 24 y trazo inferior (border/divider/md). Desplegada (Dropdown group)
 *   lleva radio 16 en ambos State y, en Read, solo relleno vertical: las filas traen su propio trazo.
 * - Fila de hora: texto 12/16 y chevron-down de 16 (línea, background/general/white; gira 180° al desplegar), gap 8.
 * - "Content": gap 8, con la fila "Heading" (Badge número Success + título Prospero semibold 12/16, gap 8) y la lista.
 *
 * Fila del desplegable:
 * - Relleno [8, 12, 8, 0] con trazo superior e inferior (border/general/md); el grosor se suma al relleno, como cuenta
 *   Figma el alto (8 + 16 + 4 + 40 + 8 + 1 = 77). Radio 16 en la raíz.
 * - Hora (12/16, con el punto de no leída antes si lo está) y descripción 14/20: regular si está leída, semibold si no.
 * - En la vista previa del grupo recogido solo lleva el trazo superior (Content de 76.5 de Figma).
 */
export const notificationGroupContentVariants = cva(
  [
    'relative isolate box-border flex min-w-0 flex-1 flex-col gap-ds-space-general-md',
    'has-[[data-notification-control]:focus-visible]:outline-2 has-[[data-notification-control]:focus-visible]:outline-offset-2',
    'has-[[data-notification-control]:focus-visible]:outline-solid has-[[data-notification-control]:focus-visible]:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      unread: {
        true: 'bg-ds-background-container-hover-on-canva p-ds-space-container-on-card',
        false: 'py-ds-space-container-on-card',
      },
      expanded: { true: 'rounded-ds-radius-general-xl', false: '' },
      revealed: { true: '', false: '' },
    },
    compoundVariants: [
      { unread: true, expanded: false, class: 'rounded-ds-radius-general-xl' },
      { unread: true, revealed: true, class: 'rounded-r-none' },
      { unread: false, revealed: true, class: 'pr-ds-space-general-2xl' },
      { unread: false, expanded: false, class: [STROKE_VAR, STROKE_BOTTOM, 'pb-0', PAD_B_CARD_STROKE].join(' ') },
    ],
    defaultVariants: { unread: false, expanded: false, revealed: false },
  }
);

export const notificationGroupTimeRowVariants = cva('flex items-center gap-ds-space-general-lg');

/** Marco "Content" interior (heading + lista), gap 8. */
export const notificationGroupBodyVariants = cva('flex min-w-0 flex-col gap-ds-space-general-lg');

export const notificationGroupHeadingRowVariants = cva('flex min-w-0 items-center gap-ds-space-general-lg');

/** Título del grupo: Prospero semibold, heading/size/xs (12/16), como el de `NotificationCard`. */
export const notificationGroupTitleVariants = cva(
  [
    'm-0 min-w-0 flex-1',
    'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-white',
  ].join(' ')
);

/**
 * Botón de desplegar: el chevron de 16; su área de clic se estira con `::after` sobre toda la tarjeta (el botón no es
 * `relative`, así que el pseudo-elemento se coloca contra la tarjeta).
 */
export const notificationGroupToggleVariants = cva(
  [
    'm-0 box-border flex shrink-0 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0',
    "text-ds-background-general-white outline-none after:absolute after:inset-0 after:z-0 after:content-['']",
  ].join(' ')
);

export const notificationGroupChevronVariants = cva('transition-transform duration-200 ease-out motion-reduce:transition-none', {
  variants: { expanded: { true: 'rotate-180', false: '' } },
  defaultVariants: { expanded: false },
});

/** Lista de filas del grupo. Por encima del área de clic del botón para que cada fila sea alcanzable por separado. */
export const notificationGroupListVariants = cva('group/nlist relative z-[1] m-0 flex list-none flex-col p-0');

export const notificationGroupItemRootVariants = cva(
  'm-0 box-border flex w-full min-w-0 list-none items-stretch rounded-ds-radius-general-xl p-0'
);

export const notificationGroupItemContentVariants = cva(
  [
    'relative isolate box-border flex min-w-0 flex-1 flex-col gap-ds-space-general-md',
    'pt-[calc(var(--ds-responsive-space-general-lg)_+_var(--nstroke))] pb-[calc(var(--ds-responsive-space-general-lg)_+_var(--nstroke))]',
    'pr-ds-space-general-xl pl-0',
    STROKE_VAR,
    STROKE_TOP_BOTTOM,
    // Vista previa del grupo recogido: solo el trazo superior
    'group-data-[preview]/nlist:pb-ds-space-general-lg',
    'group-data-[preview]/nlist:[box-shadow:inset_0_var(--nstroke)_0_0_var(--color-ds-border-general-default-on-card)]',
    'has-[[data-notification-control]:focus-visible]:outline-2 has-[[data-notification-control]:focus-visible]:outline-offset-2',
    'has-[[data-notification-control]:focus-visible]:outline-solid has-[[data-notification-control]:focus-visible]:outline-ds-border-field-active',
  ].join(' ')
);

export const notificationGroupItemDescriptionVariants = cva(
  [
    'm-0 block min-w-0 appearance-none border-0 bg-transparent p-0 text-left no-underline outline-none',
    'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md',
    'leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white',
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
