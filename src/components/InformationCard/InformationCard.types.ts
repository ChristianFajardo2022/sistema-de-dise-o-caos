import type { HTMLAttributes, ReactNode } from 'react';
import type { CardHeadingLevel } from '../_internal/types';

/** Nivel del encabezado del título (criterio común de las tarjetas). `'none'` = párrafo, fuera del esquema de encabezados. */
export type InformationCardHeadingLevel = CardHeadingLevel;

/**
 * Dónde van las etiquetas: `header` = arriba, a la derecha del `leading` o solas si no hay (Option 2 y 3 de Figma);
 * `content` = bajo el título (Option 1).
 */
export type InformationCardTagsPosition = 'header' | 'content';

export interface InformationCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Prop `Tittle` de Figma. Es el encabezado de la tarjeta y su nombre accesible. */
  title: ReactNode;
  /** Prop `Subtitle` de Figma: línea bajo el título. */
  subtitle?: ReactNode;
  /** Prop `Description` de Figma: texto descriptivo. */
  description?: ReactNode;
  /** Prop `Icon` de Figma: avatar arriba a la izquierda, normalmente `<Avatar variant="icon" />`. */
  leading?: ReactNode;
  /** Prop `Tag` de Figma: etiquetas, normalmente `<Tag />`. */
  tags?: ReactNode;
  /** Dónde se dibujan las etiquetas. Por defecto `header`. */
  tagsPosition?: InformationCardTagsPosition;
  /**
   * Contenido entre la descripción y el pie, con gap de 32: p. ej. el bloque de progreso (prop `Progress`)
   * o una lista de `ListItem` (prop `List`).
   */
  children?: ReactNode;
  /**
   * Lado izquierdo del pie (props `Avatar group` y `Content` de Figma): un `AvatarGroup`, un texto con calificación…
   * Si se pasa, el pie lleva una línea divisoria encima.
   */
  footer?: ReactNode;
  /** Prop `Group button` de Figma: botones a la derecha del pie, normalmente `<Button size="sm" />`. */
  actions?: ReactNode;
  /** Nivel del encabezado del título (`h2`…`h6`) o `'none'` para un `<p>`. Por defecto 3. */
  headingLevel?: InformationCardHeadingLevel;
  /** Clases adicionales para el elemento raíz (`<article>`). */
  className?: string;
}
