import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** Type de Figma */
export type ButtonCornerVariant = 'icon' | 'dots' | 'radiobutton' | 'checkbox' | 'favorite';

/** Contrast de Figma: On canva, On card y Unicolor canva (sobre foto o color; no cambia con el tema) */
export type ButtonCornerContrast = 'on-canva' | 'on-card' | 'unicolor-canva';

/** @deprecated Usa `ButtonCornerContrast` (Figma renombró Status → Contrast). */
export type ButtonCornerStatus = ButtonCornerContrast;

/**
 * State de Figma: Default, Hover, Select e Inactive. Solo para forzar el aspecto en documentación;
 * en uso real el hover sale de CSS, Select de `aria-pressed="true"` o `aria-expanded="true"` e Inactive de `disabled`.
 * Unicolor canva no define Hover, Select ni Inactive (se queda en Default).
 */
export type ButtonCornerState = 'default' | 'hover' | 'select' | 'inactive';

/** Size de Figma: md 40 · sm 32 */
export type ButtonCornerSize = 'md' | 'sm';

/**
 * Medida del ícono de `variant="icon"` en px. 16 es la de Button corner; 20 es la de la flecha de volver de las
 * pantallas móviles (44×44 en Figma: el círculo crece con el ícono y conserva el padding, md 44 · sm 36).
 */
export type ButtonCornerIconSize = 16 | 20;

export interface ButtonCornerBaseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children' | 'aria-pressed'> {
  /** Type: contenido del botón */
  variant?: ButtonCornerVariant;
  /** Contrast: relleno y tokens de color según la superficie (por defecto `on-canva`) */
  contrast?: ButtonCornerContrast;
  /** @deprecated Usa `contrast`. Se mantiene como alias; si se pasan los dos, manda `contrast`. */
  status?: ButtonCornerContrast;
  /**
   * Fuerza el aspecto de un estado para documentación (como Button y Checkbox).
   * Sin `state`, el hover es real (CSS) y Select se ve con `pressed` o `aria-expanded`.
   */
  state?: ButtonCornerState;
  /** Size: md 40 · sm 32 */
  size?: ButtonCornerSize;
  /** Stroke=Yes: trazo de 1px (border/general/md) */
  stroke?: boolean;
  /** Ícono para variant="icon" (por defecto, flecha diagonal). Se dibuja a la medida de `iconSize`. */
  icon?: ReactNode;
  /** Medida del ícono de variant="icon": 16 (por defecto) o 20 (md 44 · sm 36). No aplica a los otros tipos. */
  iconSize?: ButtonCornerIconSize;
  /**
   * Solo checkbox, radiobutton y favorite: expone `aria-pressed` y activa el aspecto Select.
   * En favorite además rellena el corazón (Favorite (Atom) variante 3).
   */
  pressed?: boolean;
  /** Clases adicionales */
  className?: string;
}

/** El nombre accesible es obligatorio: aria-label o aria-labelledby (uno de los dos) */
export type ButtonCornerProps = ButtonCornerBaseProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );
