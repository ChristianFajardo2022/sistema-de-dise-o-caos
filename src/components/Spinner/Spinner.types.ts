import type { HTMLAttributes } from 'react';

/** Forma del indicador: dos anillos concéntricos (set Spinner de Figma) o tres puntos (set Spinner button). */
export type SpinnerVariant = 'ring' | 'dots';

/**
 * Type de Figma, el fotograma con el que arranca el indicador.
 * En `ring` (Spinner): 1 = anillo exterior claro e interior gris; 2 = al revés.
 * En `dots` (Spinner button): 1, 2 y 3 son las tres posiciones de los puntos (rotación de 120°).
 */
export type SpinnerType = '1' | '2' | '3';

/** Size de Figma del Spinner button: md (24×24, puntos de 8) o sm (16×16, puntos de 6). No aplica a `ring`. */
export type SpinnerSize = 'md' | 'sm';

/**
 * Tono del color: `default` usa los tokens de Figma (borde `general/white` en anillos,
 * fondo `general/white` en puntos); `current` toma `currentColor`, para que el spinner
 * herede el color del control donde va (por ejemplo, el texto de un botón).
 */
export type SpinnerTone = 'default' | 'current';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Forma: ring (Spinner) o dots (Spinner button). Por defecto ring. */
  variant?: SpinnerVariant;
  /** Type de Figma (fotograma inicial). `ring` admite 1 y 2; `dots` admite 1, 2 y 3. Por defecto 1. */
  type?: SpinnerType;
  /** Size de Figma, solo para `dots`. Por defecto md. */
  size?: SpinnerSize;
  /** Tono de color. Por defecto default. */
  tone?: SpinnerTone;
  /** Nombre accesible que anuncia el lector de pantalla. Por defecto "Cargando". */
  label?: string;
  /**
   * Decorativo: oculta el spinner a las tecnologías de asistencia (`aria-hidden`).
   * Úsalo dentro de un control que ya anuncia el estado (p. ej. un botón con `aria-busy`).
   */
  decorative?: boolean;
  /**
   * Anima el indicador. Con `prefers-reduced-motion` la rotación se sustituye por un pulso
   * suave (el indicador no desaparece). `false` deja el fotograma estático de Figma.
   */
  animated?: boolean;
  /** Clases adicionales para el elemento raíz */
  className?: string;
}
