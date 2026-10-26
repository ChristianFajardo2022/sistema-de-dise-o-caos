import type { HTMLAttributes, ReactNode } from 'react';
import type { CardHeadingLevel } from '../_internal/types';

/**
 * Tipo de tarjeta (el set de Figma no expone sus props: los nombres salen de las capas).
 * - `photo` = "Type=File card, State=default": foto de fondo, texto arriba y un botón.
 * - `surface` = "Type=File card": superficie con muesca para el Button corner y un espacio para contenido (lista).
 * - `cutout` = "Type=canva, State=default": foto grande recortada abajo a la izquierda, donde va el texto.
 */
export type FeatureCardVariant = 'photo' | 'surface' | 'cutout';

/** Nivel del encabezado del título (criterio común de las tarjetas). `'none'` = párrafo. */
export type FeatureCardHeadingLevel = CardHeadingLevel;

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Tipo de tarjeta. Por defecto `photo`. */
  variant?: FeatureCardVariant;
  /** Título: encabezado de la tarjeta y nombre accesible del `<article>`. En `cutout`, el texto grande. */
  title: ReactNode;
  /** Texto descriptivo bajo el título (`photo` y `surface`). */
  description?: ReactNode;
  /** Solo `cutout`: línea corta sobre el título (capa "Titulo" de Figma). */
  eyebrow?: ReactNode;
  /** Fecha visible (`photo` y `surface`), con el ícono de calendario. Se dibuja en un `<time>`. */
  date?: ReactNode;
  /** Fecha en formato máquina para `<time dateTime>` (p. ej. `2024-02-07`). */
  dateTime?: string;
  /** Imagen de fondo (`photo` y `cutout`). Sin ella se dibuja un marcador neutro. */
  src?: string;
  /** Texto alternativo de la imagen. Por defecto vacío (decorativa: el título ya nombra la tarjeta). */
  alt?: string;
  /**
   * Una acción. En `photo` va bajo el texto (normalmente `<Button variant="secondary" size="sm" unicolor />`);
   * en `surface` va en la muesca de arriba a la derecha (normalmente `<ButtonCorner status="on-card" />`) y sin ella
   * la superficie no lleva muesca. En `cutout` no se usa. Debe tener nombre accesible propio.
   */
  action?: ReactNode;
  /** Contenido bajo el texto (slot "Espacio" de Figma, p. ej. una lista de `ListItem`). `photo` y `surface`. */
  children?: ReactNode;
  /** Nivel del encabezado del título (`h2`…`h6`) o `'none'` para un `<p>`. Por defecto 3. */
  headingLevel?: FeatureCardHeadingLevel;
  /** Clases adicionales para el `<article>` raíz. */
  className?: string;
}
