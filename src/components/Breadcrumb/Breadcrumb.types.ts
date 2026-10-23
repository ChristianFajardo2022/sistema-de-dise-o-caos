import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react';

/** Raíz del breadcrumb: `<nav>` con una lista ordenada de `BreadcrumbItem`. */
export interface BreadcrumbProps extends ComponentPropsWithoutRef<'nav'> {
  /** Nombre accesible del landmark. Por defecto "Ruta de navegación" */
  'aria-label'?: string;
  /** `BreadcrumbItem` en orden, del más general al más específico */
  children?: ReactNode;
}

/**
 * Un nivel de la ruta (Text Breadcrumb de Figma).
 * - Con `href`: enlace (Type=Default).
 * - Con `current`: página actual (Type=Select), sin enlace, `aria-current="page"`.
 * - Sin `href` ni `current`: texto plano.
 */
export interface BreadcrumbItemProps extends Omit<ComponentPropsWithoutRef<'li'>, 'children'> {
  /** Destino del enlace. Se ignora si `current` */
  href?: string;
  /** Página actual: Type=Select de Figma (peso semibold, sin enlace, aria-current="page") */
  current?: boolean;
  /**
   * Dibuja el ícono home (16) antes del texto. Sin `children` el ícono va solo y el nombre
   * accesible es "Inicio" (texto sr-only); con `children` el texto es visible.
   */
  home?: boolean;
  /** Texto sr-only del ícono home cuando no hay `children` (nombre accesible). Por defecto "Inicio". */
  homeLabel?: string;
  /**
   * Chevron separador (prop Chevron de Figma). Sin definir, aparece en todos los ítems
   * salvo el último; `true` lo fuerza, `false` lo oculta. Siempre es decorativo (aria-hidden).
   */
  chevron?: boolean;
  /** Recorta el texto largo con elipsis (ancho máximo 12rem) y pone `title` si children es texto. Sin esto, el texto se envuelve */
  truncate?: boolean;
  /** Atributos extra del `<a>` (por ejemplo `onClick` para un router) */
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>;
  /** Texto del nivel */
  children?: ReactNode;
}
