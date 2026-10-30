import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/**
 * Situación que explica el mensaje. Cada tipo trae su ícono:
 * - `first-use`: primer uso, sin datos todavía (ícono add-circle).
 * - `no-results`: una búsqueda o filtro sin coincidencias (ícono search).
 * - `errors-issues`: algo falló y se puede reintentar (ícono warning).
 * - `no-content`: sección vacía sin acción posible (ícono document).
 */
export type EmptyStateType = 'first-use' | 'no-results' | 'errors-issues' | 'no-content';

/** Nivel del encabezado del título (h2 a h6). Por defecto 3. */
export type EmptyStateHeadingLevel = 2 | 3 | 4 | 5 | 6;

/** Acción del mensaje: un botón con texto. `label` es el texto del botón. */
export type EmptyStateAction = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
  /** Texto del botón. */
  label: ReactNode;
};

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Situación que explica el mensaje; define el ícono. Por defecto `first-use`. */
  type?: EmptyStateType;
  /** Ícono del dibujo. Por defecto el del `type` (add-circle, search, warning o document). */
  icon?: IconName;
  /** Título del mensaje. Si no se pasa, no aparece. */
  title?: ReactNode;
  /** Texto bajo el título. Si no se pasa, no aparece. */
  description?: ReactNode;
  /** Acción principal (botón destacado). Aparece solo si se pasa. */
  primaryAction?: EmptyStateAction;
  /** Acción secundaria (botón con borde). Aparece solo si se pasa. */
  secondaryAction?: EmptyStateAction;
  /** Nivel del encabezado del título. Por defecto 3. */
  headingLevel?: EmptyStateHeadingLevel;
  /** Clases adicionales para la raíz. */
  className?: string;
}
