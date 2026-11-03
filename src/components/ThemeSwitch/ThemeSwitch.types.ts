import type { ButtonHTMLAttributes } from 'react';

/** Modo de la interfaz (State del set "Switch dark/light" de Figma): Light o Dark. */
export type ThemeSwitchValue = 'light' | 'dark';

/** Superficie donde se apoya (Contrast en Figma): sobre el lienzo o sobre una tarjeta. */
export type ThemeSwitchContrast = 'on-canva' | 'on-card';

export interface ThemeSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'role' | 'children' | 'value' | 'defaultValue' | 'onChange'> {
  /** Modo activo (controlado). Úsalo con `onValueChange`. */
  value?: ThemeSwitchValue;
  /** Modo inicial (no controlado). Por defecto `'light'`. */
  defaultValue?: ThemeSwitchValue;
  /** Se llama con el nuevo modo cuando el usuario alterna el interruptor. */
  onValueChange?: (value: ThemeSwitchValue) => void;
  /** Superficie donde se apoya: cambia el fondo del contenedor. Por defecto `'on-canva'`. */
  contrast?: ThemeSwitchContrast;
  /** Nombre accesible. Por defecto "Modo oscuro". Debe ser fijo: el estado lo da `aria-checked`. */
  'aria-label'?: string;
  /** Clases adicionales para el botón */
  className?: string;
}
