import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Nivel del encabezado semántico del título */
export type PageHeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Encabezado de página (set "Page Header" de Figma, 17265:93494): flecha de volver, título y descripción. */
export interface PageHeaderProps extends Omit<ComponentPropsWithoutRef<'header'>, 'title'> {
  /** Título de la página (Text header de Figma). Se dibuja como heading. */
  title: ReactNode;
  /** Nivel del heading del título. Por defecto 1. */
  headingLevel?: PageHeaderHeadingLevel;
  /** Descripción bajo el título (Text description). Sin valor, no se dibuja (prop Description de Figma = false). */
  description?: ReactNode;
  /** Si se pasa, dibuja la flecha de volver (Icon chevron-left de Figma) como botón que llama a esta función. */
  onBack?: () => void;
  /** Nombre accesible del botón de volver. Por defecto "Volver". */
  backLabel?: string;
  /** Migas de pan sobre el título (no está en Figma). Pasa un `Breadcrumb`. */
  breadcrumb?: ReactNode;
  /** Acciones a la derecha del título (no está en Figma). */
  actions?: ReactNode;
  /** Clases adicionales */
  className?: string;
}
