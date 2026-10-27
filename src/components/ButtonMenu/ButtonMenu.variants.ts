import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ButtonMenu Variants
 *
 * Fuente: component set "Button menu (Atom)" de Figma (12419:5959), Type = Default × State = Default | Hover | Focus |
 * Press/select | Inactive.
 *
 * - Caja: alto 32 (padding vertical space/button/lg = 8, el texto mide dimention/button/container/xs = 16), sin padding
 *   horizontal (space/general/xs = 0), gap gap/button/internal-margin-md (4) entre ícono, texto y chevron.
 * - Texto 14 (typography/button/size/md-uniform). Regular en Default, Hover e Inactive; typography/weight/Semibold en
 *   Focus y Press/select (el botón pasa de 43 a 44 de ancho, como en Figma). Color de texto `text/button/menu/*` y de
 *   ícono `icon/button/menu/*`: default, hover, focus-press-select e inactive.
 * - Focus y Press/select dibujan lo mismo (texto blanco y Semibold); el foco con teclado añade el contorno de 2 con el
 *   token de borde activo (no existe en Figma; WCAG 2.4.7).
 */
export const buttonMenuVariants = cva(
  [
    'box-border m-0 inline-flex shrink-0 items-center justify-center border-0 bg-transparent whitespace-nowrap no-underline',
    'gap-ds-gap-button-internal-margin-md px-ds-space-general-xs py-ds-space-button-lg',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--bm-weight)] [--bm-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-button-size-md-uniform leading-[normal]',
    'text-(--bm-text) [--bm-text:var(--color-ds-text-button-menu-default)] [--bm-icon:var(--color-ds-icon-button-menu-default)]',
    'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      state: {
        default: [
          'cursor-pointer',
          'hover:[--bm-text:var(--color-ds-text-button-menu-hover)] hover:[--bm-icon:var(--color-ds-icon-button-menu-hover)]',
          'focus-visible:[--bm-text:var(--color-ds-text-button-menu-focus-press-select)] focus-visible:[--bm-icon:var(--color-ds-icon-button-menu-focus-press-select)]',
          'focus-visible:[--bm-weight:var(--ds-primitives-typography-weight-semibold)]',
        ],
        hover: 'cursor-pointer [--bm-text:var(--color-ds-text-button-menu-hover)] [--bm-icon:var(--color-ds-icon-button-menu-hover)]',
        focus:
          'cursor-pointer [--bm-text:var(--color-ds-text-button-menu-focus-press-select)] [--bm-icon:var(--color-ds-icon-button-menu-focus-press-select)] [--bm-weight:var(--ds-primitives-typography-weight-semibold)]',
        press:
          'cursor-pointer [--bm-text:var(--color-ds-text-button-menu-focus-press-select)] [--bm-icon:var(--color-ds-icon-button-menu-focus-press-select)] [--bm-weight:var(--ds-primitives-typography-weight-semibold)]',
        inactive: 'cursor-not-allowed [--bm-text:var(--color-ds-text-button-menu-inactive)] [--bm-icon:var(--color-ds-icon-button-menu-inactive)]',
      },
    },
    defaultVariants: { state: 'default' },
  }
);

/** Marco del texto ("Text-button"): alto fijo dimention/button/container/xs. */
export const buttonMenuTextClass = 'flex h-ds-dimention-button-container-xs items-center justify-center';

/** Ícono: toma el color de icono del estado (`--bm-icon`). */
export const buttonMenuIconClass = 'shrink-0 text-(--bm-icon)';
