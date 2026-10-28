import { cva } from 'class-variance-authority';
import type { ButtonCornerContrast, ButtonCornerIconSize, ButtonCornerSize, ButtonCornerState } from './ButtonCorner.types';

/**
 * CAOS Design System — ButtonCorner Variants
 *
 * Fuente: component set "Button corner" de Figma (65 variantes: Type × Contrast × State × Size × Stroke).
 *
 * - Círculo de 40 (md) o 32 (sm), radio radius/button/full. Con `iconSize` 20 (flecha de volver de las pantallas
 *   móviles, 44×44 en Figma) el círculo crece con el ícono: md 44 · sm 36, mismo padding.
 * - Padding: md space/general/xl (12), sm space/general/lg (8). Dots: md space/general/md (4) y sm 0,
 *   con un botón interno de 32 (ver ButtonCorner.tsx).
 * - Relleno por Contrast: default-on-canva, default-on-card o hover-unicolor.
 * - Stroke=Yes: trazo border/general/md (1px) en border/general/default-on-card (gray-fifth-unicolor en Unicolor).
 * - Hover (solo On canva / On card): background/container/hover-on-* y trazo border/general/lg (1.5px)
 *   en border/general/hover-on-*. Select: background/container/select-on-* y trazo border/general/md (1px)
 *   en border/general/select-on-*. Unicolor canva no tiene Hover ni Select en Figma.
 * - Los trazos van con box-shadow inset (Chrome redondea border-width y así no cambian las medidas).
 * - Hover real solo en `<button>` habilitado (`:enabled`), para que las piezas decorativas que reutilizan
 *   estas clases en un `<span>` no reaccionen. Select real con `aria-pressed="true"` o `aria-expanded="true"`.
 * - Sombra effect/shadow sm (0 4 12): la pone quien coloca el botón en la muesca (`cornerShadowClass`).
 * - Inactive (State=Inactive, solo On canva y On card): relleno background/container/disabled-on-canva (On canva) o
 *   background/icon/disable-on-card (On card), ícono icon/general/disabled-positive, sin trazo. Sale de `disabled`
 *   o se fuerza con `state="inactive"`. Unicolor canva no tiene Inactive.
 * - Unicolor canva md usa el relleno background/icon/disable-on-card; sm usa background/container/hover-unicolor.
 * - Foco con teclado: no existe en Figma; se agrega un outline de 2px (WCAG 2.4.7).
 */

// Clases escritas completas (Tailwind no ve clases armadas en tiempo de ejecución).
const strokeRest = {
  surface: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-default-on-card)]',
  unicolor: '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-gray-fifth-unicolor)]',
};

/** Clases de Hover y Select forzadas (prop `state`) por superficie */
const forced = {
  'on-canva': {
    hover: 'bg-ds-background-container-hover-on-canva [box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-hover-on-canva)]',
    select: 'bg-ds-background-container-select-on-canva [box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-select-on-canva)]',
  },
  'on-card': {
    hover: 'bg-ds-background-container-hover-on-card [box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-hover-on-card)]',
    select: 'bg-ds-background-container-select-on-card [box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-select-on-card)]',
  },
};

/** State=Inactive forzado (prop `state`) por superficie */
const inactiveForced = {
  'on-canva': 'bg-ds-background-container-disabled-on-canva text-ds-icon-general-disabled-positive [box-shadow:none]',
  'on-card': 'bg-ds-background-icon-disable-on-card text-ds-icon-general-disabled-positive [box-shadow:none]',
};

/** State=Inactive real: `<button disabled>` */
const inactiveNative = {
  'on-canva': 'disabled:bg-ds-background-container-disabled-on-canva disabled:text-ds-icon-general-disabled-positive disabled:[box-shadow:none]',
  'on-card': 'disabled:bg-ds-background-icon-disable-on-card disabled:text-ds-icon-general-disabled-positive disabled:[box-shadow:none]',
};

/** State=Default: hover real (sin pisar Select) y Select ligado a aria-pressed / aria-expanded */
const interactive = {
  'on-canva': [
    'hover:[&:enabled:not([aria-pressed=true]):not([aria-expanded=true])]:bg-ds-background-container-hover-on-canva',
    'hover:[&:enabled:not([aria-pressed=true]):not([aria-expanded=true])]:[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-hover-on-canva)]',
    'aria-pressed:bg-ds-background-container-select-on-canva',
    'aria-pressed:[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-select-on-canva)]',
    'aria-expanded:bg-ds-background-container-select-on-canva',
    'aria-expanded:[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-select-on-canva)]',
  ].join(' '),
  'on-card': [
    'hover:[&:enabled:not([aria-pressed=true]):not([aria-expanded=true])]:bg-ds-background-container-hover-on-card',
    'hover:[&:enabled:not([aria-pressed=true]):not([aria-expanded=true])]:[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-hover-on-card)]',
    'aria-pressed:bg-ds-background-container-select-on-card',
    'aria-pressed:[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-select-on-card)]',
    'aria-expanded:bg-ds-background-container-select-on-card',
    'aria-expanded:[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-select-on-card)]',
  ].join(' '),
};

const buttonCornerCva = cva(
  [
    'box-border inline-flex shrink-0 items-center justify-center appearance-none border-0',
    'rounded-ds-radius-button-full cursor-pointer disabled:cursor-not-allowed',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      contrast: {
        'on-canva': 'bg-ds-background-container-default-on-canva text-ds-icon-general-default',
        'on-card': 'bg-ds-background-container-default-on-card text-ds-icon-general-default',
        'unicolor-canva': 'bg-ds-background-container-hover-unicolor text-ds-icon-general-default-unicolor',
      },
      state: { default: '', hover: '', select: '', inactive: '' },
      size: {
        md: 'size-[40px]',
        sm: 'size-[32px]',
      },
      dots: { true: '', false: '' },
      stroke: { true: '', false: '' },
      iconSize: { 16: '', 20: '' },
    },
    compoundVariants: [
      { size: 'md', dots: false, className: 'p-ds-space-general-xl' },
      { size: 'md', dots: true, className: 'p-ds-space-general-md' },
      { size: 'sm', dots: false, className: 'p-ds-space-general-lg' },
      { size: 'sm', dots: true, className: 'p-ds-space-general-xs' },
      // Ícono de 20: el círculo suma 4 (padding + 20 + padding)
      { size: 'md', dots: false, iconSize: 20, className: 'size-11' },
      { size: 'sm', dots: false, iconSize: 20, className: 'size-9' },
      { stroke: true, contrast: ['on-canva', 'on-card'], className: strokeRest.surface },
      { stroke: true, contrast: 'unicolor-canva', className: strokeRest.unicolor },
      // Los estados van después del trazo de reposo para reemplazarlo (cn deja la última clase de box-shadow)
      { state: 'default', contrast: 'on-canva', className: [interactive['on-canva'], inactiveNative['on-canva']] },
      { state: 'default', contrast: 'on-card', className: [interactive['on-card'], inactiveNative['on-card']] },
      { state: 'hover', contrast: 'on-canva', className: forced['on-canva'].hover },
      { state: 'hover', contrast: 'on-card', className: forced['on-card'].hover },
      { state: 'select', contrast: 'on-canva', className: forced['on-canva'].select },
      { state: 'select', contrast: 'on-card', className: forced['on-card'].select },
      { state: 'inactive', contrast: 'on-canva', className: inactiveForced['on-canva'] },
      { state: 'inactive', contrast: 'on-card', className: inactiveForced['on-card'] },
      // Unicolor canva md: Figma pinta el relleno con background/icon/disable-on-card (sm usa hover-unicolor)
      { contrast: 'unicolor-canva', size: 'md', className: 'bg-ds-background-icon-disable-on-card' },
    ],
    defaultVariants: { contrast: 'on-canva', state: 'default', size: 'md', dots: false, stroke: false, iconSize: 16 },
  }
);

export interface ButtonCornerVariantOptions {
  contrast?: ButtonCornerContrast;
  /** @deprecated Usa `contrast`. */
  status?: ButtonCornerContrast;
  state?: ButtonCornerState;
  size?: ButtonCornerSize;
  dots?: boolean;
  stroke?: boolean;
  /** Medida del ícono de variant="icon" (16 por defecto; 20 agranda el círculo). */
  iconSize?: ButtonCornerIconSize;
}

/** Clases del círculo. Acepta `status` (deprecado) como alias de `contrast`. */
export function buttonCornerVariants({ contrast, status, ...rest }: ButtonCornerVariantOptions = {}) {
  return buttonCornerCva({ contrast: contrast ?? status, ...rest });
}

/** Favorite: el trazo usa border/general/gray-secondary (white-unicolor en Unicolor), no el color de ícono */
export const buttonCornerFavoriteColor = {
  'on-canva': 'text-ds-border-general-gray-secondary',
  'on-card': 'text-ds-border-general-gray-secondary',
  'unicolor-canva': 'text-ds-border-general-white-unicolor',
} as const;

/**
 * Favorite presionado (Favorite (Atom) variante 3): corazón relleno con icon/general/default
 * (default-unicolor en Unicolor) y sin trazo.
 */
export const buttonCornerFavoritePressed = {
  'on-canva':
    '[&[aria-pressed=true]_[data-slot=icon]]:text-ds-icon-general-default [&[aria-pressed=true]_svg_path]:fill-current [&[aria-pressed=true]_svg_path]:stroke-transparent',
  'on-card':
    '[&[aria-pressed=true]_[data-slot=icon]]:text-ds-icon-general-default [&[aria-pressed=true]_svg_path]:fill-current [&[aria-pressed=true]_svg_path]:stroke-transparent',
  'unicolor-canva':
    '[&[aria-pressed=true]_[data-slot=icon]]:text-ds-icon-general-default-unicolor [&[aria-pressed=true]_svg_path]:fill-current [&[aria-pressed=true]_svg_path]:stroke-transparent',
} as const;

/** Checkbox y Radiobutton en Unicolor: el contorno del control pasa a icon/general/white-unicolor */
export const buttonCornerUnicolorRing = '[--ring:var(--color-ds-icon-general-default-unicolor)]';

/** Favorite inactivo: border/general/gray-secondary en On canva y white-unicolor en On card (así lo dibuja Figma) */
export const buttonCornerFavoriteInactive = {
  'on-canva': 'text-ds-border-general-gray-secondary',
  'on-card': 'text-ds-border-general-white-unicolor',
  'unicolor-canva': 'text-ds-border-general-white-unicolor',
} as const;

/** Checkbox y Radiobutton inactivos: contorno background/field/disabled (Selection Disabled Default) */
export const buttonCornerInactiveRing = '[--ring:var(--color-ds-background-field-disabled)]';
