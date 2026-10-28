import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Page (Atom) Variants
 *
 * Fuente: component set "Page (Atom)" de Figma (11953:4965), State Default | Hover | Select.
 *
 * - Círculo de 32 (radius/general/full), número 12/16 centrado, peso Medium (semibold) en Default y Hover.
 * - Default y Hover: relleno background/general/gray-seventh y texto text/neutral/white. En Figma Hover es igual a
 *   Default; aquí el hover real aclara un paso (background/general/gray-sixth) para dar respuesta (para diseño).
 * - Select: relleno background/general/white, texto text/neutral/black, peso Regular.
 * - Foco con teclado: no existe en Figma; outline de 2px (WCAG 2.4.7).
 */
export const paginationPageVariants = cva(
  [
    'inline-flex size-8 shrink-0 items-center justify-center rounded-ds-radius-general-full p-0',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    'text-ds-typography-body-size-sm leading-(--ds-responsive-typography-body-line-height-short-sm)',
    'cursor-pointer select-none transition-colors duration-150 motion-reduce:transition-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      visual: {
        default:
          'bg-ds-background-general-gray-seventh text-ds-text-neutral-white [font-weight:var(--ds-primitives-typography-weight-semibold)] hover:bg-ds-background-general-gray-sixth',
        hover:
          'bg-ds-background-general-gray-sixth text-ds-text-neutral-white [font-weight:var(--ds-primitives-typography-weight-semibold)]',
        select:
          'bg-ds-background-general-white text-ds-text-neutral-black [font-weight:var(--ds-primitives-typography-weight-regular)]',
      },
    },
    defaultVariants: { visual: 'default' },
  }
);
