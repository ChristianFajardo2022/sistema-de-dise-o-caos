import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { NotificationRootProps } from '../NotificationItem/NotificationItem.types';

/** Type de Figma: `simple` (lista de filas de texto) o `complex` (pestañas, tarjetas y grupos). */
export type NotificationPanelVariant = 'simple' | 'complex';

/** Filtro de los chips: todas o solo las no leídas. */
export type NotificationFilterValue = 'all' | 'unread';

/** Pestaña del panel complejo (una `Tab` de Figma). Sin `label` es de solo ícono y exige `aria-label`. */
export interface NotificationPanelTab {
  /** Identificador de la pestaña; llega a `children` y a `onTabChange`. */
  value: string;
  /** Texto de la pestaña (prop Text de Figma). */
  label?: ReactNode;
  /** Ícono de la biblioteca CAOS antes del texto (Figma muestra `heart` de muestra). */
  icon?: IconName;
  /** Contador después del texto (prop Badge de Figma). */
  badge?: ReactNode;
  /** Texto para lectores que sigue al contador (p. ej. "sin leer"). */
  badgeLabel?: string;
  /** Nombre accesible de una pestaña de solo ícono. */
  'aria-label'?: string;
}

export interface NotificationFilterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Filtro activo (controlado). */
  value?: NotificationFilterValue;
  /** Filtro activo al inicio (no controlado). Por defecto `all`. */
  defaultValue?: NotificationFilterValue;
  /** Cambia el filtro. */
  onValueChange?: (value: NotificationFilterValue) => void;
  /** Textos de los chips. Por defecto "Todas" y "No leídos". */
  labels?: { all: ReactNode; unread: ReactNode };
  /** Nombre accesible del grupo de chips. Por defecto "Filtrar notificaciones". */
  'aria-label'?: string;
  className?: string;
}

export interface NotificationTabStripProps {
  /** Pestañas. Deben ir dentro de un `Tabs`. */
  tabs: NotificationPanelTab[];
  /** Nombre accesible de la lista de pestañas. Por defecto "Categorías de notificaciones". */
  'aria-label'?: string;
  /**
   * Props "Left chevron tab" y "Right chevron tab" de Figma: botones que desplazan las pestañas cuando no caben. Son un
   * atajo para puntero (`aria-hidden`, fuera del orden de Tab): con teclado, las flechas del `tablist` ya desplazan.
   */
  scrollButtons?: boolean;
  /** Nombres de los botones de desplazamiento (son `aria-hidden`; sirven de título). Por defecto "Pestañas anteriores" y "Pestañas siguientes". */
  scrollLabels?: { previous: string; next: string };
  className?: string;
}

export interface NotificationPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Type de Figma. Por defecto `simple`. */
  variant?: NotificationPanelVariant;
  /** Texto del encabezado. Por defecto "Notificaciones". */
  title?: ReactNode;
  /** Nivel del encabezado (h2 a h6). Por defecto 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Filtro activo (controlado). El panel no filtra: `children` ya debe venir filtrado. */
  filter?: NotificationFilterValue;
  /** Filtro activo al inicio (no controlado). Por defecto `all`. */
  defaultFilter?: NotificationFilterValue;
  /** Cambia el filtro (chips "Todas" y "No leídos"). */
  onFilterChange?: (filter: NotificationFilterValue) => void;
  /** Textos de los chips del filtro. Por defecto "Todas" y "No leídos". */
  filterLabels?: { all: ReactNode; unread: ReactNode };
  /** Nombre accesible del grupo de chips. Por defecto "Filtrar notificaciones". */
  filterLabel?: string;
  /** Solo `complex`: acción de ajustes (botón de ícono `setting` junto a los chips). Sin ella no se dibuja. */
  onSettingsClick?: () => void;
  /** Nombre accesible del botón de ajustes. Por defecto "Ajustes de notificaciones". */
  settingsLabel?: string;
  /** Solo `complex`: pestañas del panel (Tab de Figma). Sin ellas no se dibuja la fila de pestañas. */
  tabs?: NotificationPanelTab[];
  /** Pestaña activa (controlada). */
  tab?: string;
  /** Pestaña activa al inicio (no controlada). Por defecto la primera. */
  defaultTab?: string;
  /** Cambia la pestaña. */
  onTabChange?: (tab: string) => void;
  /** Nombre accesible de la lista de pestañas. Por defecto "Categorías de notificaciones". */
  tabsLabel?: string;
  /** Botones de desplazamiento de las pestañas (ver `NotificationTabStripProps`). */
  tabScrollButtons?: boolean;
  /**
   * Contenido de la lista: `NotificationItem`, `NotificationCard` y `NotificationGroup` (todos `<li>`), con títulos de
   * sección `NotificationPanelHeading`. Con pestañas puede ser una función que recibe la pestaña activa. Con `empty`
   * no se dibuja.
   */
  children?: ReactNode | ((tab: string | undefined) => ReactNode);
  /** Sin notificaciones: dibuja el `EmptyState` (Type "No notification" de Figma) en lugar de la lista. */
  empty?: boolean;
  /** Texto del estado vacío. Por defecto "No tienes notificaciones." ("No tienes notificaciones sin leer." con el filtro). */
  emptyDescription?: ReactNode;
  /** Título opcional del estado vacío (Figma no lo dibuja). */
  emptyTitle?: ReactNode;
  /** Nombre accesible de la lista. Por defecto "Lista de notificaciones". */
  listLabel?: string;
  /** Alto máximo de la lista antes de desplazar (cualquier valor CSS). Por defecto "24rem". */
  listMaxHeight?: string | number;
  /**
   * El panel se abre desde un botón (la campana): lo marca `role="dialog"` no modal (`aria-modal="false"`) en vez de
   * región. El foco pasa al panel al abrir y vuelve a quien lo tenía al cerrar; Escape llama a `onOpenChange(false)`.
   * El clic fuera y la posición los resuelve quien lo abre (el Header, un `Popover`…).
   */
  popup?: boolean;
  /** Visible (por defecto `true`). Con `false` no se dibuja nada. Pensado para `popup` con `onOpenChange`. */
  open?: boolean;
  /** Se llama con `false` al pulsar Escape en un panel `popup`. */
  onOpenChange?: (open: boolean) => void;
  /** Atributos de la raíz extra (`data-*`). `ref`, `id` y el resto de props van a la raíz. */
  rootProps?: NotificationRootProps;
  className?: string;
}

export interface NotificationPanelHeadingProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Nivel del encabezado (h2 a h6). Por defecto 3, para listas bajo el encabezado h2 del panel; en una pantalla con h1, usar 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Texto de la sección ("Hoy", "Ayer"). */
  children: ReactNode;
}
