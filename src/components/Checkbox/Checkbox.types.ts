import type { InputHTMLAttributes, ReactNode } from 'react';

/** Contrast de Figma: positive sobre superficies oscuras, negative sobre claras. */
export type SelectionContrast = 'positive' | 'negative';

/**
 * State de Figma. Solo fuerza el aspecto (para documentación);
 * en uso normal sale de checked y disabled.
 */
export type SelectionState = 'default' | 'select' | 'disabled-default' | 'disabled-select';

/** State de Checkbox: los de `SelectionState` más el mixto (no está en Figma). Solo fuerza el aspecto (documentación). */
export type CheckboxState = SelectionState | 'indeterminate' | 'disabled-indeterminate';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /** Contrast: positive (superficies oscuras) o negative (superficies claras) */
  contrast?: SelectionContrast;
  /** State forzado, solo para documentación */
  state?: CheckboxState;
  /**
   * Estado mixto (patrón APG Checkbox Mixed-State): fija la propiedad `indeterminate` del input nativo (el lector anuncia
   * "mixto") y dibuja una raya en lugar del check. Figma no lo define: usa el relleno de Select. Al pulsar, el navegador
   * lo quita; quien lo controla decide el siguiente valor (p. ej. CheckboxTree).
   */
  indeterminate?: boolean;
  /** Texto junto al control. Si se omite, solo se dibuja el control de 16px. */
  children?: ReactNode;
  /** Clases adicionales para la fila */
  className?: string;
}
