import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/**
 * Type del set "Hamburguer menu (Atom)" de Figma: `with-text` (ícono + texto), `dropdown` (con submenú y chevron) y
 * `single-icon` (solo ícono, el de la barra contraída).
 */
export type SideBarItemType = 'with-text' | 'dropdown' | 'single-icon';

/** State del ítem de Figma. Solo fuerza el aspecto (documentación); en uso normal sale de CSS y de `selected`. */
export type SideBarItemState = 'default' | 'hover' | 'select';

/** Presentación de la barra: escritorio ("Menu desktop"), móvil ("Menu mobile") o según el ancho (48rem). */
export type SideBarLayout = 'auto' | 'desktop' | 'mobile';

/** Subenlace de un ítem con submenú (fila "Dropdown list" de Figma). */
export interface SideBarSubItemData {
  /** Identificador único (es el `value` de la barra cuando está seleccionado). */
  id: string;
  /** Texto del subenlace. */
  label: string;
  /** Destino. Sin `href` es un botón que solo cambia `value`. */
  href?: string;
}

/** Ítem de primer nivel de la barra. */
export interface SideBarItemData {
  /** Identificador único (es el `value` de la barra cuando está seleccionado). */
  id: string;
  /** Prop Option de Figma: texto del ítem. En la barra contraída es el nombre accesible y el tooltip. */
  label: string;
  /** Ícono de la biblioteca CAOS (Figma usa `home1` de línea). Obligatorio: es lo único visible en la barra contraída. */
  icon: IconName;
  /** Destino. Sin `href` (y sin `items`) es un botón que solo cambia `value`. */
  href?: string;
  /** Prop Badge de Figma: número del Badge (p. ej. pendientes). Sin valor no se dibuja. */
  badge?: number | string;
  /** Texto para lectores que sigue al número del badge (p. ej. "sin leer"). Por defecto "nuevos". */
  badgeLabel?: string;
  /** Subenlaces: el ítem pasa a Type `dropdown` (disclosure con `aria-expanded`). */
  items?: SideBarSubItemData[];
}

export interface SideBarItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children' | 'onSelect'> {
  /** Type de Figma. Por defecto `dropdown` si hay `submenu`; si no, `with-text`. */
  type?: SideBarItemType;
  /** Fuerza el aspecto de un State, solo para documentación. */
  state?: SideBarItemState;
  /** Prop Option de Figma: texto del ítem. En `single-icon` es el nombre accesible y el tooltip. */
  children: ReactNode;
  /** Prop Icon de Figma: ícono de la biblioteca CAOS. Sin él no se dibuja (salvo en `single-icon`, que lo necesita). */
  icon?: IconName;
  /** Prop Badge de Figma: número del Badge. Sin valor no se dibuja. */
  badge?: number | string;
  /** Texto para lectores que sigue al número del badge. Por defecto "nuevos". */
  badgeLabel?: string;
  /** Sección actual (State Select): `aria-current="page"` y aspecto seleccionado. */
  selected?: boolean;
  /** Destino del ítem (sin submenú). Con él la fila es un `<a>`; sin él, un `<button>`. */
  href?: string;
  /** Se activa la fila (clic, Enter o Espacio). En un ítem con submenú, además de abrir o cerrar la lista. */
  onSelect?: () => void;
  /** Submenú abierto (controlado por quien lo usa; `SideBar` lo maneja solo). */
  expanded?: boolean;
  /** Pide abrir o cerrar el submenú (clic en la fila con submenú). */
  onExpandedChange?: (expanded: boolean) => void;
  /** Subenlaces (`SideBarSubItem`). Es la lista "List items" del Type Dropdown de Figma. */
  submenu?: ReactNode;
  /** Atributos extra de la fila (`<a>` o `<button>`), p. ej. `data-*` o `id`. */
  controlProps?: HTMLAttributes<HTMLElement> & { [K in `data-${string}`]?: string | number | boolean };
  className?: string;
}

export interface SideBarSubItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children' | 'onSelect'> {
  /** Texto del subenlace (prop "Text item" del Dropdown list de Figma). */
  children: ReactNode;
  /** Destino. Sin él es un `<button>`. */
  href?: string;
  /** Página actual: `aria-current="page"` y aspecto Select del Dropdown list. */
  selected?: boolean;
  /** Se activa el subenlace. */
  onSelect?: () => void;
  className?: string;
}

export interface SideBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue'> {
  /** Ítems de la navegación (Espacio / List items de Figma). */
  items: SideBarItemData[];
  /** `auto` (por defecto): móvil por debajo de 48rem, escritorio desde ahí. `desktop` / `mobile` fuerzan uno. */
  layout?: SideBarLayout;
  /** Id del ítem o subenlace actual (controlado). Lleva `aria-current="page"`. */
  value?: string | null;
  /** Id actual al inicio (no controlado). */
  defaultValue?: string | null;
  /** Se activa un ítem o subenlace (también los que tienen `href`). */
  onValueChange?: (id: string) => void;
  /** Ids de los ítems con el submenú abierto (controlado). */
  openItems?: string[];
  /** Submenús abiertos al inicio (no controlado). Por defecto, el que contiene el `value` inicial. */
  defaultOpenItems?: string[];
  /** Cambian los submenús abiertos. */
  onOpenItemsChange?: (ids: string[]) => void;
  /** Escritorio: barra contraída a solo íconos (Type Default de "Menu desktop"; expandida es Type Select). Controlado. */
  collapsed?: boolean;
  /** Contraída al inicio (no controlado). Por defecto `false`. */
  defaultCollapsed?: boolean;
  /** Cambia el estado contraído (botón de flecha o un ítem con submenú pulsado en la barra contraída). */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Prop Arrow de Figma: dibuja el botón que contrae y expande la barra. Por defecto `true`. */
  collapsible?: boolean;
  /** Nombre del botón de flecha con la barra expandida. Por defecto "Contraer menú". */
  collapseLabel?: string;
  /** Nombre del botón de flecha con la barra contraída. Por defecto "Expandir menú". */
  expandLabel?: string;
  /** Slot del logo. Por defecto el `Logo` de la marca (completo expandida y en móvil símbolo; solo símbolo contraída). */
  logo?: ReactNode;
  /** Envuelve el logo en un enlace a esta dirección (p. ej. "/"). */
  homeHref?: string;
  /** Nombre del enlace del logo. Por defecto "Inicio". */
  homeLabel?: string;
  /**
   * Escritorio, slot "Options bottom" de Figma: acciones del pie sobre el botón de flecha (p. ej. el botón de modo
   * claro/oscuro, prop Mode). Botones de `Button` `iconOnly` `secondary` `low` `xs`.
   */
  footer?: ReactNode;
  /** Nombre accesible de la navegación. Por defecto "Navegación principal". */
  navLabel?: string;
  /** Móvil: menú abierto (controlado). Es el Type Menu list de "Menu mobile". */
  open?: boolean;
  /** Móvil: abierto al inicio (no controlado). */
  defaultOpen?: boolean;
  /** Móvil: se abre o se cierra el menú (botón, Escape o un enlace pulsado). */
  onOpenChange?: (open: boolean) => void;
  /**
   * Móvil, prop "Avatar+icon button" de Figma: acciones a la derecha de la barra (p. ej. `NotificationBell` y `Avatar`
   * o `AvatarMenu`). Como en Figma, no se ven con el menú abierto.
   */
  mobileActions?: ReactNode;
  /** Nombre del botón de menú cerrado. Por defecto "Abrir menú". */
  openMenuLabel?: string;
  /** Nombre del botón de menú abierto. Por defecto "Cerrar menú". */
  closeMenuLabel?: string;
  /** Móvil: clases de la hoja del menú (p. ej. para fijar su alto). */
  menuClassName?: string;
  className?: string;
}
