import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import type { InputProps } from '../Input/Input.types';
import type { NotificationPanelProps } from '../NotificationPanel/NotificationPanel.types';

/**
 * Cómo se dibuja la cabecera: `desktop` (Header desktop de Figma, 96 de alto), `mobile` (Header mobile, 72, con menú
 * desplegable) o `auto` (escritorio desde 64rem de ancho, móvil por debajo). Por defecto `auto`.
 */
export type HeaderLayout = 'auto' | 'desktop' | 'mobile';

/** Enlace de un submenú. */
export interface HeaderLink {
  /** Texto del enlace (Text item de Figma). */
  label: ReactNode;
  href: string;
  /** Página actual: `aria-current="page"`. */
  current?: boolean;
}

/** Sección de la navegación principal (un Button menu de Figma). */
export interface HeaderNavItem {
  /** Identificador estable (para `openItem` y las claves). */
  id: string;
  /** Texto del botón. */
  label: ReactNode;
  /** Enlace directo (sin submenú). Un botón con `items` abre su submenú y no necesita `href`. */
  href?: string;
  /** Submenú: los Dropdown list de Figma. Con `items`, el botón dibuja el chevron y abre la lista. */
  items?: HeaderLink[];
  /** Sección actual: aspecto Press/select y `aria-current="page"`. */
  current?: boolean;
  /** Botón inactivo (State Inactive de Figma). */
  disabled?: boolean;
}

/** La persona de la sesión (Avatar+dropdown). */
export interface HeaderUser {
  name: string;
  /** Correo o cargo bajo el nombre. */
  email?: string;
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Ver `HeaderLayout`. Por defecto `auto`. */
  layout?: HeaderLayout;
  /** Prop Logo de Figma. Por defecto el `Logo` de la marca (type icon, size sm). */
  logo?: ReactNode;
  /** Si se pasa, el logo es un enlace a esta dirección con el nombre `homeLabel`. */
  homeHref?: string;
  /** Nombre accesible del enlace del logo. Por defecto "Inicio". */
  homeLabel?: string;
  /** Prop Menu list de Figma: las secciones de la navegación principal. */
  items?: HeaderNavItem[];
  /** Nombre accesible del `nav`. Por defecto "Navegación principal". */
  navLabel?: string;
  /** Escritorio: id de la sección con el submenú abierto (controlado); `null` = ninguna. */
  openItem?: string | null;
  /** Escritorio: sección abierta al montar (no controlado). */
  defaultOpenItem?: string | null;
  /** Escritorio: cambia la sección abierta (botón, Escape, clic fuera, enlace elegido). */
  onOpenItemChange?: (id: string | null) => void;
  /** Prop Searcher de Figma: dibuja el buscador (Input `search-header`). Por defecto `true`. */
  search?: boolean;
  /** Label del buscador. Por defecto "Buscar". */
  searchLabel?: string;
  /** Props del `<input>` del buscador (`value`, `onChange`, `name`…). */
  searchProps?: Omit<InputProps, 'label' | 'variant' | 'fullWidth' | 'leftIcon'>;
  /** Se envía el buscador (Enter) con su texto. El buscador es un `<form role="search">`. */
  onSearch?: (value: string) => void;
  /**
   * Prop Simple notification / Complex notification de Figma: el `NotificationPanel` (con sus notificaciones) que abre
   * la campana. El Header lo clona con `popup`, `open` y `onOpenChange`. Sin él no se dibuja la campana.
   */
  notificationPanel?: ReactElement<NotificationPanelProps>;
  /** No leídas, para el contador de la campana. */
  notificationCount?: number;
  /** Panel de notificaciones abierto (controlado). */
  notificationsOpen?: boolean;
  /** Panel de notificaciones abierto al montar (no controlado). */
  defaultNotificationsOpen?: boolean;
  /** Cambia el panel de notificaciones (campana, Escape, clic fuera). */
  onNotificationsOpenChange?: (open: boolean) => void;
  /** Prop Avatar de Figma: la persona de la sesión. Sin ella no se dibuja el avatar. */
  user?: HeaderUser;
  /** Slot List items del menú de perfil: `DropdownMenuItem` de modo menú. */
  profileMenu?: ReactNode;
  /** Acción "Cerrar sesión" del menú de perfil. Sin ella no se dibuja el ítem. */
  onLogout?: () => void;
  /** Texto del ítem de cierre de sesión. Por defecto "Cerrar sesión". */
  logoutLabel?: string;
  /** Prop Buttons / Button de Figma: acciones al final (p. ej. "Iniciar sesión" cuando no hay sesión). */
  actions?: ReactNode;
  /** Móvil: menú desplegable abierto (controlado). */
  menuOpen?: boolean;
  /** Móvil: menú abierto al montar (no controlado). */
  defaultMenuOpen?: boolean;
  /** Móvil: cambia el menú desplegable. */
  onMenuOpenChange?: (open: boolean) => void;
  /** Móvil: nombre del botón cuando el menú está cerrado. Por defecto "Abrir menú". */
  openMenuLabel?: string;
  /** Móvil: nombre del botón cuando el menú está abierto. Por defecto "Cerrar menú". */
  closeMenuLabel?: string;
  /** Móvil: clases adicionales del menú desplegable (p. ej. para fijar su alto). */
  menuClassName?: string;
  className?: string;
}
