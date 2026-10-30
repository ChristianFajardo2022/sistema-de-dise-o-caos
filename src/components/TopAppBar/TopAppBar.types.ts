import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Type de Figma: Ios (botones circulares de 44, altura 54) o Android (botones de 48, altura 64). */
export type TopAppBarPlatform = 'ios' | 'android';

/**
 * Position de Figma:
 * - `centered`: título y subtítulo centrados entre el botón de la izquierda y las acciones (Centered Title).
 * - `left`: título y subtítulo alineados a la izquierda, junto al botón (Left-Aligned).
 * - `action-only`: fila de botones arriba y el título grande debajo (With Action Only).
 * - `title-only`: título grande en la misma fila, sin subtítulo (Title Only).
 */
export type TopAppBarPosition = 'centered' | 'left' | 'action-only' | 'title-only';

/** Nivel del heading del título */
export type TopAppBarHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// Figma: 17295:110677
/** Barra superior de pantalla (set "Top App Bar" de Figma, 8 variantes). */
export interface TopAppBarProps extends Omit<ComponentPropsWithoutRef<'header'>, 'title'> {
  /** Título (Title de Figma). Se dibuja como heading. */
  title?: ReactNode;
  /** Nivel del heading del título. Por defecto 1. */
  headingLevel?: TopAppBarHeadingLevel;
  /** Subtítulo (Subtitletext). Solo en `centered`, `left` y `action-only`; en `title-only` Figma no lo dibuja. */
  subtitle?: ReactNode;
  /** Type de Figma. Solo cambia medidas y el tipo de botón de volver. Por defecto `ios`. */
  platform?: TopAppBarPlatform;
  /** Position de Figma. Por defecto `centered`. */
  titlePosition?: TopAppBarPosition;
  /** Si se pasa, dibuja el botón de volver a la izquierda (no aplica si pasas `leading`). */
  onBack?: () => void;
  /** Nombre accesible del botón de volver. Por defecto "Volver". */
  backLabel?: string;
  /** Contenido de la izquierda en lugar del botón de volver (por ejemplo un botón de menú, como en Android). */
  leading?: ReactNode;
  /** Slot de la derecha (Espacio / Button rigth de Figma): botones de acción. */
  actions?: ReactNode;
  /** Avatar entre el botón de la izquierda y el título (prop Avatar de Figma). Pasa un `Avatar` de tamaño `md`. */
  avatar?: ReactNode;
  /** Clases adicionales */
  className?: string;
}
