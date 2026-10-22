import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** Type de Figma */
export type ButtonCornerVariant = 'icon' | 'dots' | 'radiobutton' | 'checkbox' | 'favorite';

/** Status de Figma: On canva, On card y Unicolor canva (sobre foto o color; no cambia con el tema) */
export type ButtonCornerStatus = 'on-canva' | 'on-card' | 'unicolor-canva';

/** Size de Figma: md 40 · sm 32 */
export type ButtonCornerSize = 'md' | 'sm';

export interface ButtonCornerBaseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children' | 'aria-pressed'> {
  /** Type: contenido del botón */
  variant?: ButtonCornerVariant;
  /** Status: relleno y tokens de color */
  status?: ButtonCornerStatus;
  /** Size: md 40 · sm 32 */
  size?: ButtonCornerSize;
  /** Stroke=Yes: borde exterior de 1px */
  stroke?: boolean;
  /** Ícono de 16px para variant="icon" (por defecto, flecha diagonal) */
  icon?: ReactNode;
  /**
   * Solo checkbox, radiobutton y favorite: expone aria-pressed. Figma no define aspecto
   * de seleccionado, así que el aspecto no cambia.
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
