import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { CardHeadingLevel, DataAttributes } from '../_internal/types';

/** Propiedad 2 de Figma: `vertical` = "Blog vertical" (foto arriba) · `horizontal` = "Blog horizontal" (foto a la izquierda). */
export type BlogCardOrientation = 'vertical' | 'horizontal';

/** Nivel del encabezado del título (criterio común de las tarjetas). `'none'` = párrafo. */
export type BlogCardHeadingLevel = CardHeadingLevel;

export interface BlogCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Orientación (Propiedad 2 de Figma). Por defecto `vertical`. */
  orientation?: BlogCardOrientation;
  /** Título del artículo: encabezado, nombre accesible de la tarjeta y texto del enlace principal (sin `linkLabel`). */
  title: ReactNode;
  /** Resumen bajo el título. */
  description?: ReactNode;
  /** Destino del artículo. El enlace (en el título o en `linkLabel`) se estira sobre toda la tarjeta. */
  href: string;
  /** Props extra del enlace principal (`target`, `rel`, `onClick`…). */
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> & DataAttributes;
  /** Fecha visible, con el ícono de calendario. Se dibuja en un `<time>`. */
  date?: ReactNode;
  /** Fecha en formato máquina para `<time dateTime>` (p. ej. `2024-02-07`). */
  dateTime?: string;
  /** Imagen del artículo. Sin ella se dibuja un marcador neutro. */
  src?: string;
  /** Texto alternativo de la imagen. Por defecto vacío (decorativa: el título ya nombra el artículo). */
  alt?: string;
  /** Nombre del autor, en la franja inferior de la imagen. */
  author?: ReactNode;
  /** Avatar del autor (a la izquierda del nombre, en la franja de la foto), normalmente `<Avatar variant="photo" size="xs" />`. */
  authorAvatar?: ReactNode;
  /** Etiquetas (`<Tag />`, no interactivas): a la derecha del autor en `vertical`, arriba de la imagen en `horizontal`. */
  tags?: ReactNode;
  /**
   * Texto visible tipo botón terciario ("Leer más", el "Button" de Figma). Con él, este texto es el enlace principal
   * (estirado sobre la tarjeta) y se nombra con el título + este texto ("Cinco ideas… Leer más"), así funciona el
   * control por voz (2.5.3); el título queda como texto del encabezado. Si se omite no se dibuja y el enlace es el título.
   */
  linkLabel?: ReactNode;
  /**
   * Solo `vertical`: control propio en la muesca (p. ej. `<ButtonCorner variant="favorite" aria-label="Guardar …" />`),
   * por encima del enlace estirado. Sin él la muesca muestra la flecha del Button corner como parte del enlace.
   */
  action?: ReactNode;
  /** Nivel del encabezado del título (`h2`…`h6`) o `'none'` para un `<p>`. Por defecto 3. */
  headingLevel?: BlogCardHeadingLevel;
  /** Clases adicionales para el `<article>` raíz. */
  className?: string;
}
