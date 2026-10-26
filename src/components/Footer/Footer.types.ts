import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react';

/** Type de Figma: Portals (marca + acerca de + contacto + legal) o Web (columnas de enlaces, sellos y barra inferior). */
export type FooterType = 'portals' | 'web';

/** Nivel del encabezado de cada grupo (`<h2>` a `<h6>`). */
export type FooterHeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Una fila de un grupo (viñeta + texto de Figma).
 * - Solo `label` (con `href`): enlace.
 * - `label` + `value`: rótulo en peso medium con el valor debajo (contacto). Con `href`, el valor es el enlace (`tel:`, `mailto:`).
 * - Solo `value`: texto plano.
 */
export interface FooterItem {
  label?: ReactNode;
  value?: ReactNode;
  href?: string;
  /** Atributos extra del `<a>` (onClick para routers, rel, target). */
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

/** Un grupo con encabezado y filas (columna de Figma, o fila del acordeón en móvil). */
export interface FooterSection {
  title: ReactNode;
  items: FooterItem[];
}

/** Red social: el nombre accesible es obligatorio porque el ícono no tiene texto. */
export interface FooterSocialLink {
  /** Nombre accesible del enlace (p. ej. "Facebook"). */
  name: string;
  href: string;
  /** Ícono (normalmente `<Icon name="…" size={24} />`). */
  icon: ReactNode;
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
}

export interface FooterProps extends Omit<ComponentPropsWithoutRef<'footer'>, 'title' | 'about'> {
  /** Type de Figma. Portals: marca, acerca de y redes arriba. Web: sellos y, en la barra inferior, marca compacta y redes. */
  type?: FooterType;
  /** Logo. En Portals es la marca completa; en Web, una marca compacta de 32 px junto al copyright. */
  logo?: ReactNode;
  /** Título del bloque "acerca de" (solo Portals). */
  aboutTitle?: ReactNode;
  /** Texto "acerca de" (solo Portals). Sin él, el bloque no se dibuja (prop Acerca de nosotros de Figma). */
  about?: ReactNode;
  /** Grupo de contacto (rótulo + valor), se dibuja antes de `sections`. */
  contact?: FooterSection;
  /** Grupos de enlaces. */
  sections?: FooterSection[];
  /** Redes sociales. */
  social?: FooterSocialLink[];
  /** Sellos y certificaciones (Web). Se coloca abajo a la derecha de las columnas: reserva espacio con la columna más alta. */
  badges?: ReactNode;
  /** Botón de acción (el Button secondary sm de Figma). */
  action?: ReactNode;
  /** Botón de acción en móvil (Figma usa un Button primary md a todo el ancho). Por defecto, `action`. */
  mobileAction?: ReactNode;
  /** Texto de copyright (barra inferior). */
  copyright?: ReactNode;
  /** Nota legal a la derecha de la barra inferior (solo Portals), p. ej. "Todos los derechos reservados". */
  legal?: ReactNode;
  /** Nivel de los encabezados de grupo. Por defecto 2. */
  headingLevel?: FooterHeadingLevel;
  /** Nombre accesible del `nav` que agrupa los enlaces. */
  navLabel?: string;
  /** Nombre accesible de la lista de redes sociales. Por defecto "Redes sociales". */
  socialLabel?: string;
  /** En móvil los grupos van en un Accordion (Figma). Con `false` se mantienen como columnas apiladas. Por defecto `true`. */
  mobileAccordion?: boolean;
  className?: string;
}
