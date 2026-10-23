import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

type DataAttributes = { [K in `data-${string}`]?: string | number | boolean };

/** Props de la fila (el `label` raíz): clases, `data-*`, eventos. */
export type SwitchRootProps = HTMLAttributes<HTMLLabelElement> & DataAttributes;

/**
 * Type del átomo "Toggle (Atom)" de Figma.
 * - `simple`: pista de 48×32 con ficha de 24 (Figma: Simple; "Toggle" es el mismo dibujo).
 * - `complex`: pista de ancho según su texto interior, 38 de alto, ficha de 30 y texto dentro de la pista.
 */
export type SwitchType = 'simple' | 'complex';

export interface SwitchTrackProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'className'>,
    DataAttributes {
  /** Type del átomo: simple (sin texto) o complex (con texto dentro de la pista) */
  type?: SwitchType;
  /** Encendido (State Select / Disabled active) */
  checked?: boolean;
  /** Deshabilitado (State Disabled inactive / Disabled active) */
  disabled?: boolean;
  /** Texto dentro de la pista (solo `complex`) */
  label?: ReactNode;
  /** `id` del texto de la pista (para nombrar un control con `aria-labelledby`). */
  labelId?: string;
  /** Oculta la pista a lectores de pantalla (por defecto sí). Con `false` el texto de la pista se lee. */
  decorative?: boolean;
  className?: string;
}

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'children' | 'size'> {
  /** Type del átomo: simple (por defecto) o complex (con `trackLabel` dentro de la pista) */
  type?: SwitchType;
  /** Encendido (controlado). Usar con `onCheckedChange`. */
  checked?: boolean;
  /** Encendido inicial (no controlado) */
  defaultChecked?: boolean;
  /** Se llama con el nuevo valor cuando el usuario alterna el interruptor */
  onCheckedChange?: (checked: boolean) => void;
  /** Texto dentro de la pista (solo `type="complex"`). Sin `children` ni `aria-label` es el nombre accesible (por `aria-labelledby`); no debe cambiar con el estado (el nombre no debe ser "On"/"Off"). */
  trackLabel?: ReactNode;
  /** Texto de descripción junto a la pista (Toggle Type=Text). Sin texto, pasar `aria-label` o `trackLabel`. */
  children?: ReactNode;
  /** Clases adicionales para la fila */
  className?: string;
  /** Props de la fila (raíz). El `ref` va al input; `className` y estas props, a la fila. */
  rootProps?: SwitchRootProps;
}
