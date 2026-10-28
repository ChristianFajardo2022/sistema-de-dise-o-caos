import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Stepper Variants
 *
 * Fuentes (Figma): Stepper 13965:5884 (`Orientation` Vertical | Horizontal) e Indicators (Atom) 13804:20926
 * (`Propiedad 1` Incomplete | In progress | Complete | Error × `Orientation`).
 *
 * - Stepper vertical: columna con gap space/general/lg (8), 335 de ancho. Horizontal: fila con el mismo gap, cada paso FILL.
 * - Paso: gap space/general/2xl (16) entre barra y contenido. Vertical: barra de 2 de ancho a toda la altura (radius/general/full),
 *   contenido con padding vertical space/general/xl (12). Horizontal: barra de 2 de alto arriba y contenido sin padding.
 * - Contenido: gap lg (8), título 14/18 semibold (Medium de Figma) con ícono de 14 o aro de 12 (trazo de 1), texto 14/18 regular.
 * - Colores: incomplete = barra disabled-on-canva, ícono gray-secondary, texto body; in progress y complete = barra y aro/ícono
 *   background/general/white, título heading; error = barra e ícono semantic/error/tertiary, título text/semantic/error-secondary.
 * - Foco con teclado (solo pasos navegables): no existe en Figma; outline de 2px con border/field/active (WCAG 2.4.7).
 */
export const stepperVariants = cva('m-0 flex list-none p-0', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-ds-space-general-lg',
      horizontal: 'flex-row gap-ds-space-general-lg',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});

export const stepperStepVariants = cva(
  'm-0 box-border flex min-w-0 list-none p-0 font-ds-primitives-typography-family-primary',
  {
    variants: {
      orientation: {
        vertical: 'w-full flex-row items-stretch gap-ds-space-general-2xl',
        horizontal: 'flex-1 flex-col gap-ds-space-general-2xl',
      },
    },
    defaultVariants: { orientation: 'vertical' },
  }
);

export const stepperBarVariants = cva('shrink-0 rounded-ds-radius-general-full', {
  variants: {
    orientation: {
      vertical: 'w-0.5 self-stretch',
      horizontal: 'h-0.5 w-full',
    },
    status: {
      incomplete: 'bg-ds-background-container-disabled-on-canva',
      'in-progress': 'bg-ds-background-general-white',
      complete: 'bg-ds-background-general-white',
      error: 'bg-ds-background-semantic-error-tertiary',
    },
  },
  defaultVariants: { orientation: 'vertical', status: 'incomplete' },
});

export const stepperContentVariants = cva(
  [
    'box-border flex min-w-0 flex-1 flex-col gap-ds-space-general-lg border-0 bg-transparent p-0 text-left',
    'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
  ],
  {
    variants: {
      orientation: {
        vertical: 'justify-center py-ds-space-general-xl',
        horizontal: '',
      },
      interactive: {
        true: [
          'w-full cursor-pointer rounded-ds-radius-general-lg',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
        ],
        false: '',
      },
    },
    defaultVariants: { orientation: 'vertical', interactive: false },
  }
);

export const stepperTitleRowVariants = cva('flex items-center gap-ds-space-general-lg');

export const stepperTitleVariants = cva(
  'min-w-0 font-ds-primitives-typography-weight-semibold [overflow-wrap:anywhere]',
  {
    variants: {
      status: {
        incomplete: 'text-ds-text-neutral-body',
        'in-progress': 'text-ds-text-neutral-heading',
        complete: 'text-ds-text-neutral-heading',
        error: 'text-ds-text-semantic-error-secondary',
      },
    },
    defaultVariants: { status: 'incomplete' },
  }
);

export const stepperIconVariants = cva('shrink-0', {
  variants: {
    status: {
      incomplete: 'text-ds-background-general-gray-secondary',
      'in-progress': 'text-ds-background-general-white',
      complete: 'text-ds-background-general-white',
      error: 'text-ds-background-semantic-error-tertiary',
    },
  },
  defaultVariants: { status: 'incomplete' },
});

/** Aro de 12 del estado In progress: trazo de 1 por dentro (box-shadow inset, no border). */
export const stepperRingClass =
  'box-border block size-3 shrink-0 rounded-full [box-shadow:inset_0_0_0_var(--ds-primitives-stroke-lg)_var(--color-ds-border-general-white)]';

export const stepperDescriptionClass =
  'min-w-0 text-ds-text-neutral-body font-ds-primitives-typography-weight-regular [overflow-wrap:anywhere]';
