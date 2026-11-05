import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — NotificationPanel Variants
 *
 * Fuentes: component sets "Simple notifications" (12602:6152) y "Complex notifications" (15302:8832) de Figma,
 * Type = No notification | Notification × State = Default | Dropdown. La tarjeta es el marco "Profile card" (400 de ancho).
 *
 * - Tarjeta: relleno background/container/default-on-canva, radio radius/container/On card (24 en escritorio), trazo de
 *   1 px border/general/md en border/general/default-on-card (box-shadow inset; Figma enlaza border/general/sm, 0.5),
 *   gap space/general/2xl (16). Padding, las variables que enlaza Figma: Simple space/container/on-canva (32 Desktop,
 *   24 Tablet, 20 Mobile); Complex space/container/on-card (24 Desktop y Tablet, 16 Mobile).
 * - Encabezado: título Prospero semibold 16/20 (Figma enlaza typography/heading/size/md y line-height/md; se usan los
 *   primitivos size/lg y line-height/xl, mismos valores) y a la derecha los chips del filtro (+ ajustes en Complex), gap
 *   gap/general/2xl (24 escritorio, 20 móvil: space/general/3xl).
 * - Divisor: border/general/md en border/general/default-on-card. Lista: gap 16 en Simple y 8 en Complex.
 * - Estado vacío: `EmptyState` No Content (ícono document en Simple y notification en Complex, sin título).
 */
export const notificationPanelVariants = cva(
  [
    'relative box-border flex w-full min-w-0 flex-col gap-ds-space-general-2xl outline-none',
    'rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva',
    'shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-default-on-card)]',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      variant: {
        simple: 'p-ds-space-container-on-canva',
        complex: 'p-ds-space-container-on-card',
      },
    },
    defaultVariants: { variant: 'simple' },
  }
);

export const notificationPanelHeaderVariants = cva('flex min-w-0 items-center gap-ds-space-general-3xl');

export const notificationPanelTitleVariants = cva(
  [
    'm-0 min-w-0 flex-1',
    'font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-primitives-typography-size-lg leading-(--ds-primitives-typography-line-height-xl) text-ds-text-neutral-white',
  ].join(' ')
);

/** Marco "Chips" de Figma: los chips del filtro y el botón de ajustes, gap 8. */
export const notificationPanelActionsVariants = cva('flex shrink-0 items-center gap-ds-space-general-lg');

export const notificationPanelDividerVariants = cva(
  'h-[var(--ds-responsive-border-general-md)] w-full shrink-0 bg-ds-border-general-default-on-card'
);

export const notificationPanelListVariants = cva('m-0 flex list-none flex-col p-0', {
  variants: {
    variant: {
      simple: 'gap-ds-space-general-2xl',
      complex: 'gap-ds-space-general-lg',
    },
  },
  defaultVariants: { variant: 'simple' },
});

/** Fila de pestañas: botones de desplazamiento opcionales a los lados de la lista de pestañas. */
export const notificationTabStripVariants = cva('flex min-w-0 items-center');

/**
 * Título de sección de la lista ("Hoy", "Ayer"): Helvetica Neue 14/18 regular en text/neutral/white. Figma enlaza
 * typography/weight/Regular, aunque en el panel de escritorio dibuja 700 (literal sin variable) y en el móvil 400.
 */
export const notificationPanelHeadingVariants = cva(
  [
    'm-0 list-none p-0',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white',
  ].join(' ')
);
