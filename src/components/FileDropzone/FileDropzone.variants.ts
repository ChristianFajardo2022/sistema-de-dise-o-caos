import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FileDropzone Variants
 *
 * Fuente: component set "Input file upload (Atom)" 11438:5774 de Figma (State Default, Hover, Disabled y Focus).
 *
 * - Raíz: columna centrada, ancho fluido (304 en el set), padding vertical space/field/2xl (40), gap 24
 *   (gap/field/3xl, que no existe en tokens.css: se usa space/field/xl, que vale lo mismo), radius/field/lg (24).
 *   Padding horizontal space/field/xl (24) en Default y space/field/lg (16) en los demás estados (así está en Figma).
 * - Trazo punteado 8/8 de border/general/lg (1) por dentro: lo dibuja un SVG (el borde CSS no admite el patrón).
 *   Default y Disabled border/field/disabled; Hover y Focus border/field/active. Hover suma el relleno
 *   background/field/active-opacity-secondary.
 * - Ícono attach-circle de 32 (line): icon/general/gray-high-contrast (Disabled icon/general/disabled-negative).
 * - Título y acción: Helvetica Neue regular field/md 16/20, text/neutral/white y text/link/default
 *   (Disabled: text/neutral/disabled-negative y text/link/inactive), gap space/general/md (4).
 * - Especificaciones: field/sm 14/18, text/neutral/gray y "Máx." text/neutral/white (Disabled: text/field/disabled-positive
 *   y disabled-negative). Contenedor de textos con gap space/field/xs (4).
 * - Foco con teclado: el input real recibe el foco y la raíz toma el aspecto Focus.
 */

const rootBase = [
  'group/dropzone relative box-border flex w-full flex-col items-center justify-center',
  'gap-ds-space-field-xl rounded-ds-radius-field-lg py-ds-space-field-2xl',
].join(' ');

const hoverLook = 'bg-ds-background-field-active-opacity-secondary text-ds-border-field-active px-ds-space-field-lg';
const focusLook =
  'text-ds-border-field-active px-ds-space-field-lg outline-2 outline-offset-2 outline-solid outline-ds-border-field-active';

export const fileDropzoneVariants = cva(rootBase, {
  variants: {
    visual: {
      // Uso normal: reacciona al puntero, al arrastre (data-dragging) y al foco del input
      auto: [
        'cursor-pointer px-ds-space-field-xl text-ds-border-field-disabled',
        'hover:bg-ds-background-field-active-opacity-secondary hover:text-ds-border-field-active hover:px-ds-space-field-lg',
        'data-[dragging=true]:bg-ds-background-field-active-opacity-secondary data-[dragging=true]:text-ds-border-field-active data-[dragging=true]:px-ds-space-field-lg',
        'has-[input:focus-visible]:text-ds-border-field-active has-[input:focus-visible]:px-ds-space-field-lg',
        'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-ds-border-field-active',
      ].join(' '),
      idle: 'cursor-pointer px-ds-space-field-xl text-ds-border-field-disabled',
      hover: `cursor-pointer ${hoverLook}`,
      focus: `cursor-pointer ${focusLook}`,
      disabled: 'cursor-not-allowed px-ds-space-field-lg text-ds-border-field-disabled',
    },
  },
  defaultVariants: { visual: 'auto' },
});

/** SVG del trazo punteado, sobre toda la raíz y sin interceptar el puntero. */
export const fileDropzoneStrokeClass = 'pointer-events-none absolute inset-0 size-full overflow-visible';

export const fileDropzoneContentClass = 'flex w-full min-w-0 flex-col items-center justify-center gap-ds-space-field-xs';
export const fileDropzoneRowClass = 'flex w-full flex-wrap items-center justify-center gap-ds-space-general-md text-center';

const fontBase = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]';
const headingBase = `${fontBase} text-ds-typography-field-size-md leading-ds-typography-field-line-height-md`;
const infoBase = `${fontBase} text-ds-typography-field-size-sm leading-ds-typography-field-line-height-sm`;

export const fileDropzoneIconVariants = cva('shrink-0', {
  variants: {
    disabled: {
      true: 'text-ds-icon-general-disabled-negative',
      false: 'text-ds-icon-general-gray-high-contrast',
    },
  },
  defaultVariants: { disabled: false },
});

export const fileDropzoneTitleVariants = cva(headingBase, {
  variants: {
    disabled: { true: 'text-ds-text-neutral-disabled-negative', false: 'text-ds-text-neutral-white' },
  },
  defaultVariants: { disabled: false },
});

export const fileDropzoneActionVariants = cva(headingBase, {
  variants: {
    disabled: { true: 'text-ds-text-link-inactive', false: 'text-ds-text-link-default' },
  },
  defaultVariants: { disabled: false },
});

export const fileDropzoneSpecsVariants = cva(infoBase, {
  variants: {
    disabled: { true: 'text-ds-text-field-disabled-positive', false: 'text-ds-text-neutral-gray' },
  },
  defaultVariants: { disabled: false },
});

export const fileDropzoneMaxVariants = cva(infoBase, {
  variants: {
    disabled: { true: 'text-ds-text-neutral-disabled-negative', false: 'text-ds-text-neutral-white' },
  },
  defaultVariants: { disabled: false },
});
