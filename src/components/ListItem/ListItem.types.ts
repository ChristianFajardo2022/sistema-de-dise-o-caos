import type { LiHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';

/**
 * Type de Figma. `complex` = avatar o ícono, título con categoría y descripción debajo.
 * `simple` = título y descripción en una sola línea (sin avatar ni categoría).
 */
export type ListItemVariant = 'simple' | 'complex';

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title' | 'children'> {
  /** Type de Figma. Por defecto `complex`. */
  variant?: ListItemVariant;
  /** Prop `Tittle` de Figma. Es también el nombre accesible del checkbox y de los botones de acción. */
  title: string;
  /** Prop `Description` + `Description-2` de Figma. Si se omite no se dibuja. */
  description?: ReactNode;
  /** Prop `Category` + `Category-2` de Figma. Solo en `complex`; si se omite no se dibuja. */
  category?: ReactNode;
  /**
   * Contenido antes del texto (props `Avatar single`, `Avatar group` e `Icon` de Figma): un `<Avatar />`
   * o un `<AvatarGroup />`, que quien usa el componente compone. Solo en `complex`.
   */
  leading?: ReactNode;
  /** Prop `Select` de Figma: dibuja el checkbox de selección. */
  selectable?: boolean;
  /** Seleccionado (controlado). Usar con `onSelectedChange`. */
  selected?: boolean;
  /** Seleccionado al inicio (no controlado). */
  defaultSelected?: boolean;
  /** Cambia la selección. */
  onSelectedChange?: (selected: boolean) => void;
  /** Botón de ícono "ver" (`eye`, parte de `Group icon button` de Figma). Solo se dibuja si se pasa; va antes de editar. */
  onView?: () => void;
  /** Botón de ícono "editar" (parte de `Group icon button` de Figma). Solo se dibuja si se pasa. */
  onEdit?: () => void;
  /** Botón de ícono "eliminar" (parte de `Group icon button` de Figma). Solo se dibuja si se pasa. */
  onDelete?: () => void;
  /** Nombre accesible completo del botón ver. Por defecto "Ver" + título. */
  viewLabel?: string;
  /** Nombre accesible completo del botón editar. Por defecto "Editar" + título. */
  editLabel?: string;
  /** Nombre accesible completo del botón eliminar. Por defecto "Eliminar" + título. */
  deleteLabel?: string;
  /**
   * Opciones del menú "más opciones" (`Dots`, props `Icon`/`Icon-1` de Figma): ítems de `DropdownMenuItem`.
   * Si se pasan, se dibuja el botón de tres puntos como disparador de un `DropdownMenu`.
   */
  menu?: ReactNode;
  /** Nombre accesible del botón de tres puntos y del menú. Por defecto "Más opciones de" + título. */
  menuLabel?: string;
  /**
   * Acción "navegar" (fila que abre otra vista, p. ej. "Documentos" del panel de un chat): el título pasa a ser un
   * `<button>` estirado sobre toda la fila y se dibuja la flecha `chevron-right` de 20 al final (decorativa). Con `href`
   * el control es un enlace `<a>`. No combinar con `selectable` ni `menu` en el mismo ítem (el clic en la fila sería
   * ambiguo); `onEdit`/`onDelete` sí, quedan por encima con su propio foco.
   */
  onNavigate?: (event: MouseEvent<HTMLElement>) => void;
  /** Destino de la acción "navegar": el título es un `<a href>` estirado sobre la fila (ver `onNavigate`). */
  href?: string;
  /** Ref al control de navegación (`<button>` o `<a>`), p. ej. para devolverle el foco al volver de la vista que abre. */
  controlRef?: Ref<HTMLElement>;
  /** State Disabled de Figma: todo el ítem inactivo (checkbox, botones y menú deshabilitados; el `li` no lleva `aria-disabled`). */
  disabled?: boolean;
  /** Clases adicionales para el `<li>` raíz. */
  className?: string;
}
