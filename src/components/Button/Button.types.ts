import type { ButtonHTMLAttributes, ReactNode } from 'react';

/** Type de Figma. Button link es un componente aparte (ButtonLink). */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

/** Contrats de Figma. Solo aplica a secondary. */
export type ButtonContrast = 'low' | 'high';

export type ButtonSize = 'md' | 'sm' | 'xs';

/**
 * State de Figma. hover, focus y press solo fuerzan el aspecto (para documentación);
 * en uso normal salen de la interacción. Tertiary no tiene load.
 */
export type ButtonState = 'default' | 'hover' | 'focus' | 'press' | 'inactive' | 'delete' | 'load';

export interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Type: jerarquía visual del botón */
  variant?: ButtonVariant;
  /** Contrats: nivel de contraste de secondary */
  contrast?: ButtonContrast;
  /** Unicolor: texto e ícono de un solo color (secondary y tertiary sin icon-single). Inactive y Delete conservan sus colores. */
  unicolor?: boolean;
  /** Size: md 56 · sm 48 · xs 32 */
  size?: ButtonSize;
  /** State forzado. `delete` es el estado de acción destructiva de cada tipo. */
  state?: ButtonState;
  /** Estado load: muestra el spinner y establece aria-busy (tertiary no tiene load) */
  loading?: boolean;
  /** Ícono antes del texto (iconLeft en Figma). Se dibuja a 20px con el color del estado. */
  leftIcon?: ReactNode;
  /** Ícono después del texto (iconRigth en Figma). Se dibuja a 20px con el color del estado. */
  rightIcon?: ReactNode;
  /** Clases adicionales */
  className?: string;
  children?: ReactNode;
}

/** Con iconOnly el nombre accesible es obligatorio: aria-label o aria-labelledby (uno de los dos) */
type ButtonIconOnlyProps = ButtonBaseProps & {
  /** Icon-single: botón cuadrado solo con ícono (pasar el ícono como children) */
  iconOnly: true;
} & (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );

type ButtonTextProps = ButtonBaseProps & {
  /** Icon-single: botón cuadrado solo con ícono (con true exige aria-label o aria-labelledby) */
  iconOnly?: false;
};

export type ButtonProps = ButtonIconOnlyProps | ButtonTextProps;
