import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Type de Figma: color semántico de la etiqueta. */
export type TagType = 'default' | 'success' | 'alert' | 'error' | 'info' | 'neutral';

/** Size de Figma: sm (alto 24) o md (alto 32). */
export type TagSize = 'sm' | 'md';

/**
 * State de Figma. Hover, focus y press salen de CSS real (solo cuando la etiqueta es
 * interactiva); esta prop existe únicamente para forzar el aspecto en documentación.
 * `inactive` equivale a `disabled`.
 */
export type TagState = 'default' | 'hover' | 'focus' | 'press' | 'inactive';

export interface TagBaseProps {
  /** Type: color semántico. Por defecto default. */
  type?: TagType;
  /** Size: sm (24) o md (32). Por defecto md. */
  size?: TagSize;
  /** Prop Text de Figma: texto de la etiqueta. */
  children?: ReactNode;
  /** Prop Icon-left de Figma: muestra el ícono a la izquierda. Por defecto true. */
  iconLeft?: boolean;
  /** Ícono de la biblioteca CAOS para el lado izquierdo (INSTANCE_SWAP de Figma). Por defecto tag. */
  icon?: IconName;
  /**
   * Fuerza el aspecto de un estado, solo para documentación. En uso real el estado lo dan
   * :hover, :focus-visible, :active y `disabled`.
   */
  state?: TagState;
  /** Inactive: etiqueta no disponible. En un botón usa el `disabled` nativo. */
  disabled?: boolean;
  className?: string;
}

/** Sin `onClick` la etiqueta es un `<span>` estático, sin estados de interacción. */
export interface TagStaticProps extends TagBaseProps, Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'onClick'> {
  onClick?: undefined;
}

/** Con `onClick` la etiqueta es un `<button type="button">`. */
export interface TagButtonProps
  extends TagBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick' | 'disabled' | 'type'> {
  onClick: NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['onClick']>;
}

export type TagProps = TagStaticProps | TagButtonProps;
