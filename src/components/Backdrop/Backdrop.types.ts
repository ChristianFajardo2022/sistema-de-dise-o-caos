import type { HTMLAttributes } from 'react';

/** Posición de la capa: fixed cubre la pantalla; absolute se contiene en el padre (relative). */
export type BackdropPosition = 'fixed' | 'absolute';

export interface BackdropProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Si es false no renderiza nada. */
  open?: boolean;
  /** Posición: fixed a pantalla completa (por defecto) o absolute dentro de un padre posicionado. */
  position?: BackdropPosition;
}
