import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { CardHeadingLevel } from '../_internal/types';

/**
 * Tipo de acción de la derecha (prop `Propiedad 1` de Figma):
 * - `more`: botón de tres puntos en la muesca de la esquina; abre un menú.
 * - `communication`: dos botones de ícono (llamar y chat).
 * - `external-link`: botón principal de llamada en la muesca de la esquina.
 */
export type ContactCardVariant = 'more' | 'communication' | 'external-link';

export interface ContactCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Variante (Propiedad 1 de Figma): qué acción se dibuja a la derecha. Por defecto `more`. */
  variant?: ContactCardVariant;
  /**
   * Línea principal (p. ej. el nombre; capa "Subtitulo" de Figma). Es el encabezado y el nombre accesible de la
   * tarjeta, como `title` en las demás tarjetas.
   */
  title: ReactNode;
  /**
   * Línea pequeña y gris sobre el título (p. ej. el rol; capa "Titulo" de Figma). Va después del encabezado en el DOM
   * y se ve arriba (`order-first`), como en Figma.
   */
  eyebrow?: ReactNode;
  /**
   * Nombre de la persona para los nombres accesibles de las acciones ("Llamar a Ana Pérez").
   * Por defecto, el `title` si es texto.
   */
  personName?: string;
  /** Avatar de la izquierda (56): normalmente `<Avatar variant="photo" size="lg" … />`. */
  leading?: ReactNode;
  /** Calificación sobre el avatar (Badge ícono + número), de 0 a 5. Se muestra con coma decimal ("4,5"). */
  rating?: number;
  /** Texto para lectores que sigue a la calificación. Por defecto "de 5 estrellas". */
  ratingLabel?: string;
  /** Nivel del encabezado del título. Por defecto 3; `'none'` lo deja como párrafo. */
  headingLevel?: CardHeadingLevel;
  /** `more`: ítems del menú (`DropdownMenuItem`). Sin ellos el botón solo dispara `onMoreClick`. */
  menuItems?: ReactNode;
  /** `more`: nombre accesible del botón. Por defecto "Más opciones de {personName}". */
  moreLabel?: string;
  /** `more`: clic del botón cuando no hay `menuItems`. */
  onMoreClick?: MouseEventHandler<HTMLButtonElement>;
  /** `communication` y `external-link`: clic del botón de llamada. */
  onCall?: MouseEventHandler<HTMLButtonElement>;
  /** Nombre accesible del botón de llamada. Por defecto "Llamar a {personName}". */
  callLabel?: string;
  /** `communication`: clic del botón de chat. */
  onChat?: MouseEventHandler<HTMLButtonElement>;
  /** Nombre accesible del botón de chat. Por defecto "Chatear con {personName}". */
  chatLabel?: string;
  /** Reemplaza por completo lo que se dibuja a la derecha (sin muesca). */
  actions?: ReactNode;
  className?: string;
}
