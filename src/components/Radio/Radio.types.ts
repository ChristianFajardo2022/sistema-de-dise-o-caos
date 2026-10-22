import type { InputHTMLAttributes, ReactNode } from 'react';
import type { SelectionContrast, SelectionState } from '../Checkbox/Checkbox.types';

export type RadioContrast = SelectionContrast;
export type RadioState = SelectionState;

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /** Contrast: positive (superficies oscuras) o negative (superficies claras) */
  contrast?: RadioContrast;
  /** State forzado, solo para documentación */
  state?: RadioState;
  /** Texto junto al control. Si se omite, solo se dibuja el control de 16px. */
  children?: ReactNode;
  /** Clases adicionales para la fila */
  className?: string;
}
