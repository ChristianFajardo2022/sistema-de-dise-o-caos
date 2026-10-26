import type { HTMLAttributes, ReactNode } from 'react';
import type { SelectionContrast } from '../Checkbox/Checkbox.types';

/** Nodo del árbol. Con `children` es un grupo (casilla madre); sin ellos, una hoja seleccionable. */
export interface CheckboxTreeNode {
  /** Identificador único en todo el árbol. En las hojas es lo que se guarda en `value`. */
  value: string;
  /** Texto de la fila (prop "Text description" de Figma). */
  label: ReactNode;
  /** Hijos del grupo. Se dibujan debajo, con sangría de 24 (space/general/3xl). */
  children?: CheckboxTreeNode[];
  /** Nodo no disponible. En un grupo deshabilita también a sus descendientes. */
  disabled?: boolean;
}

/** Estado de una casilla del árbol: marcada, desmarcada o mixta (algunos descendientes marcados). */
export type CheckboxTreeCheckedState = boolean | 'mixed';

export interface CheckboxTreeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /** Árbol de opciones (prop List de Figma, tipo "Selection tree"). */
  items: CheckboxTreeNode[];
  /** Hojas marcadas (controlado). Los grupos se derivan: marcados si todas sus hojas lo están, mixtos si solo algunas. */
  value?: string[];
  /** Hojas marcadas al inicio (no controlado). */
  defaultValue?: string[];
  /** Se llama con la nueva lista de hojas marcadas (en el orden del árbol). */
  onValueChange?: (value: string[]) => void;
  /** Contrast de las casillas: positive (superficies oscuras, por defecto) o negative (claras). */
  contrast?: SelectionContrast;
  /** Deshabilita todo el árbol. */
  disabled?: boolean;
  /** `name` de los inputs de las hojas, para enviar en un formulario (cada hoja envía su `value`). */
  name?: string;
  /** Nombre accesible del grupo raíz (o `aria-labelledby`). */
  'aria-label'?: string;
  /** Id de la etiqueta visible que nombra el grupo raíz. */
  'aria-labelledby'?: string;
  /** Clases adicionales para la raíz. */
  className?: string;
}
