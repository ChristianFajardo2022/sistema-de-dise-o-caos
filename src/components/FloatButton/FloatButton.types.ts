import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Aspecto forzado, solo para documentación. En uso normal sale de la interacción. */
export type FloatButtonState = 'default' | 'hover' | 'press' | 'focus';

export interface FloatButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Nombre del ícono de la biblioteca CAOS (24 px). Por defecto `heart`, el de Figma. */
  icon?: IconName;
  /** Aspecto forzado para documentación (hover, press, focus). */
  state?: FloatButtonState;
  /** Clases adicionales. La posición fija (bottom/right) la decide quien lo usa. */
  className?: string;
}

/** Sin texto (Status=Icon single): el nombre accesible es obligatorio. */
type FloatButtonIconOnlyProps = FloatButtonBaseProps & {
  children?: undefined;
} & (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );

/** Con texto (Status=With text, extendido): el texto es el nombre accesible. */
type FloatButtonTextProps = FloatButtonBaseProps & {
  /** Texto del botón (prop Text de Figma). Con texto el botón es extendido. */
  children: ReactNode;
};

export type FloatButtonProps = FloatButtonIconOnlyProps | FloatButtonTextProps;
