import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';

/** Type de Figma (set 12048:7622): numérico, campo de número o "Mostrar más". */
export type PaginationType = 'numeric' | 'input' | 'more';

/**
 * State de Figma de la pieza Page (set 11953:4965). Solo para forzar el aspecto en documentación:
 * el hover real sale de CSS y la página actual de `selected`.
 */
export type PaginationPageState = 'default' | 'hover' | 'select';

export interface PaginationPageProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Número de página que se muestra (prop `Number` de Figma). */
  number: number;
  /** Página actual: relleno claro y `aria-current="page"`. */
  selected?: boolean;
  /** Fuerza el aspecto de un State (solo documentación). */
  state?: PaginationPageState;
  className?: string;
}

/** Textos configurables (idioma y redacción). Cada función recibe los números que necesita. */
export interface PaginationLabels {
  /** Nombre accesible de la navegación. Por defecto "Paginación". */
  navigation?: string;
  /** Botón anterior. Por defecto "Anterior". */
  previous?: string;
  /** Botón siguiente. Por defecto "Siguiente". */
  next?: string;
  /** Nombre accesible de cada botón de página. Por defecto "Página n". */
  page?: (page: number) => string;
  /** Texto de estado. Por defecto "Página x de y". */
  status?: (page: number, totalPages: number) => string;
  /** Texto del botón de Type More. Por defecto "Mostrar más". */
  loadMore?: string;
  /** Texto visible antes del campo (Type input). Por defecto "Página". */
  pageWord?: string;
  /** Texto visible después del campo (Type input). Por defecto "de y". */
  ofTotal?: (totalPages: number) => string;
  /** Nombre accesible del campo (Type input). Por defecto "Número de página". */
  input?: string;
  /** Aviso cuando el número escrito está fuera de rango. Por defecto "Escribe un número entre 1 y y". */
  outOfRange?: (totalPages: number) => string;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Type de Figma: `numeric` (por defecto), `input` o `more`. */
  type?: PaginationType;
  /** Página actual, 1 a `totalPages` (controlada). */
  page?: number;
  /** Página inicial (no controlada). Por defecto 1. */
  defaultPage?: number;
  /** Total de páginas (mínimo 1). */
  totalPages: number;
  /** Se llama al cambiar de página (botones, número, campo o "Mostrar más"). */
  onPageChange?: (page: number) => void;
  /**
   * Type numeric: páginas a cada lado de la actual. Por defecto 2, con `boundaryCount` 0 da la ventana de 5 números de Figma.
   */
  siblingCount?: number;
  /**
   * Type numeric: páginas fijas al inicio y al final, con puntos suspensivos entre medias. Por defecto 0 (ventana sin
   * puntos, como Figma); con 1 o más aparece "1 … 5 6 7 … 20".
   */
  boundaryCount?: number;
  /** Textos configurables. */
  labels?: PaginationLabels;
  className?: string;
}
