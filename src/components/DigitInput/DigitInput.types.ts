import type { InputHTMLAttributes } from 'react';

/** Size de Figma (set 12070:15078): alto de la casilla en px. */
export type DigitInputSize = '56' | '32';

/**
 * State de Figma. Solo para forzar el aspecto en documentación: en uso real
 * el estado sale de la interacción (foco, `disabled`, `readOnly`) y de `invalid` / `confirmed`.
 * `active` cubre "Active/Focus" y `burnt-in` es el estado de solo lectura.
 */
export type DigitInputState =
  | 'default'
  | 'filled'
  | 'active'
  | 'burnt-in'
  | 'disabled'
  | 'error'
  | 'confirmation';

type DigitInputBaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'children' | 'autoComplete'
> & {
  /** Size de Figma: 56 (por defecto) o 32. */
  size?: DigitInputSize;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: DigitInputState;
  /** Estado Error: contorno de error y `aria-invalid`. */
  invalid?: boolean;
  /** Estado Confirmation: contorno de confirmación. Pierde frente a `invalid`. */
  confirmed?: boolean;
  /**
   * Marca la casilla como parte de un código de un solo uso (`autoComplete="one-time-code"`),
   * para que el sistema ofrezca el código recibido por SMS. Por defecto `false` (`off`).
   * Con varias casillas, solo la primera debería llevarlo.
   */
  oneTimeCode?: boolean;
  /**
   * Caracteres que acepta la casilla. Por defecto 1. Un grupo de casillas puede dejar más en la primera para recibir
   * el código entero del autocompletado del sistema (`one-time-code`) y repartirlo (CodeInput usa `length`).
   */
  maxLength?: number;
  /** Clases adicionales. */
  className?: string;
};

/** Cada casilla necesita nombre accesible (p. ej. "Dígito 1 de 6"): aria-label o aria-labelledby. */
export type DigitInputProps = DigitInputBaseProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );
