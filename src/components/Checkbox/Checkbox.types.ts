import type { InputHTMLAttributes, ReactNode } from 'react';

/** Contrast de Figma: positive sobre superficies oscuras, negative sobre claras. */
export type SelectionContrast = 'positive' | 'negative';

/**
 * State de Figma. Solo fuerza el aspecto (para documentación);
 * en uso normal sale de checked y disabled.
 */
export type SelectionState = 'default' | 'select' | 'disabled-default' | 'disabled-select';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /** Contrast: positive (superficies oscuras) o negative (superficies claras) */
  contrast?: SelectionContrast;
  /** State forzado, solo para documentación */
  state?: SelectionState;
  /** Texto junto al control. Si se omite, solo se dibuja el control de 16px. */
  children?: ReactNode;
  /** Clases adicionales para la fila */
  className?: string;
}
