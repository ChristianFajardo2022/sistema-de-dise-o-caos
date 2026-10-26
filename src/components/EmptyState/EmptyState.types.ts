import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/**
 * Type de Figma (Empty states 12304:6287). Cada tipo trae su ícono y su composición:
 * - `first-use`: primer uso, sin datos todavía (ícono add-circle).
 * - `no-results`: una búsqueda o filtro sin coincidencias (ícono search).
 * - `errors-issues`: algo falló y se puede reintentar (ícono warning).
 * - `no-content`: sección vacía sin acción posible (ícono document).
 */
export type EmptyStateType = 'first-use' | 'no-results' | 'errors-issues' | 'no-content';

/** Nivel del encabezado del título (h2 a h6). Por defecto 3. */
export type EmptyStateHeadingLevel = 2 | 3 | 4 | 5 | 6;

/** Acción del estado vacío: un Button con texto. `label` es el texto (prop Text del Button de Figma). */
export type EmptyStateAction = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
  /** Texto del botón. */
  label: ReactNode;
};

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Type de Figma. Por defecto `first-use`. */
  type?: EmptyStateType;
  /** Ícono de la composición. Por defecto el del `type` (add-circle, search, warning o document). */
  icon?: IconName;
  /** Título (props Title y Title text de Figma). Sin él no se dibuja. */
  title?: ReactNode;
  /** Descripción (prop Text de Figma). Sin ella no se dibuja. */
  description?: ReactNode;
  /** Acción principal: Button primary (prop Button primary de Figma). Se dibuja si se pasa. */
  primaryAction?: EmptyStateAction;
  /** Acción secundaria: Button secondary (prop Button secondary de Figma). Se dibuja si se pasa. */
  secondaryAction?: EmptyStateAction;
  /** Nivel del encabezado del título. Por defecto 3. */
  headingLevel?: EmptyStateHeadingLevel;
  /** Clases adicionales para la raíz. */
  className?: string;
}
