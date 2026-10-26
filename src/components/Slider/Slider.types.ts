import type { HTMLAttributes } from 'react';

/** Valor del slider: un número (Simple) o el par `[mínimo, máximo]` (Range). */
export type SliderValue = number | [number, number];

/** Tamaño visual del pulgar: `simple` (16), `range` (8) o `number` (22, con el valor adentro). */
export type SliderThumbAppearance = 'simple' | 'range' | 'number';

export interface SliderProps<T extends SliderValue = number>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /** Valor mínimo (por defecto 0) */
  min?: number;
  /** Valor máximo (por defecto 100) */
  max?: number;
  /** Paso entre valores (por defecto 1). Las flechas mueven un paso; RePág/AvPág, una décima parte del rango. */
  step?: number;
  /** Valor (controlado). Un número para Simple o `[a, b]` para Range. Usar con `onValueChange`. */
  value?: T;
  /** Valor inicial (no controlado). Un par `[a, b]` convierte el slider en rango. */
  defaultValue?: T;
  /** Se llama en cada cambio (arrastre, clic en la pista o tecla) */
  onValueChange?: (value: T) => void;
  /** Se llama al terminar la interacción: al soltar el puntero o con cada tecla */
  onValueCommit?: (value: T) => void;
  /** Muestra el valor dentro del pulgar (Type "Simple number" / "Range number" de Figma) */
  showValue?: boolean;
  /** Da formato al valor: texto del pulgar (`showValue`) y `aria-valuetext` */
  formatValue?: (value: number) => string;
  /** Deshabilitado: no responde a puntero ni teclado y sale del orden de tabulación */
  disabled?: boolean;
  /**
   * Nombre accesible (obligatorio éste o `aria-labelledby`). En Simple nombra al pulgar; en Range nombra al grupo
   * (`role="group"`) y cada pulgar se nombra con `thumbLabels`. No dibuja etiqueta: Figma no la tiene. En un
   * formulario, la etiqueta visible va fuera y se enlaza con `aria-labelledby` (WCAG 3.3.2).
   */
  'aria-label'?: string;
  /** Id de la etiqueta visible que nombra al slider (al pulgar en Simple, al grupo en Range). */
  'aria-labelledby'?: string;
  /** Nombres de los pulgares en Range (por defecto `['Mínimo', 'Máximo']`) */
  thumbLabels?: [string, string];
  /** Nombre para formularios: agrega un `input type="hidden"` por pulgar (en Range, dos con el mismo nombre) */
  name?: string;
  /** Clases adicionales para la raíz */
  className?: string;
}

