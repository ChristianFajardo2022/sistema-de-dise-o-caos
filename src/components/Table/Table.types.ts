import type {
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import type { BadgeState } from '../Badge/Badge.types';

/**
 * Cómo se dibuja la tabla.
 * - `auto`: tabla en escritorio y tableta; en móvil (menos de 48rem) dibuja `mobile` si se pasa.
 * - `table`: siempre la tabla (con desplazamiento horizontal si no cabe).
 * - `mobile`: siempre `mobile` (útil para documentación).
 */
export type TableLayout = 'auto' | 'table' | 'mobile';

export interface TableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'aria-label'> {
  /**
   * Nombre accesible de la tabla (qué contiene, p. ej. "Usuarios"). También nombra la región de desplazamiento
   * horizontal, que solo existe (y recibe foco con Tab) cuando la tabla no cabe.
   */
  label: string;
  /** Cómo se dibuja: `auto` (por defecto), `table` o `mobile`. */
  layout?: TableLayout;
  /** Versión móvil (normalmente `TableMobileList` con `TableMobileRow`). Sin ella, en móvil se dibuja la tabla. */
  mobile?: ReactNode;
  /** Clases del contenedor con desplazamiento horizontal (`ScrollArea`). */
  scrollClassName?: string;
  /** Filas: `TableHeader` y `TableBody`. */
  children?: ReactNode;
  className?: string;
}

/**
 * State de Figma de la fila (Default, Hover, Select). Solo fuerza el aspecto, para documentación: en uso real Hover
 * sale de `:hover` y del foco dentro de la fila, y Select de `selected`.
 */
export type TableRowState = 'default' | 'hover' | 'select';

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * Fila seleccionada (State Select de sus celdas). Es solo el aspecto: la selección se anuncia con la casilla de la
   * fila (en una tabla estática `aria-selected` no es válido en `<tr>`).
   */
  selected?: boolean;
  /** Fuerza el aspecto, solo para documentación. */
  state?: TableRowState;
  className?: string;
}

/** Type de `Header table (Atom)`: texto o casilla (columna de selección de 48). */
export type TableHeadType = 'text' | 'checkbox';
/** Alineación del contenido de la celda. */
export type TableAlign = 'start' | 'center' | 'end';
/** Columna fija al desplazar en horizontal (Sticky 1 y 2 de Figma): al inicio o al final. */
export type TableSticky = 'start' | 'end';
/** Orden de la columna, como `aria-sort`. */
export type TableSortDirection = 'none' | 'ascending' | 'descending';

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Type de Figma: `text` (por defecto) o `checkbox` (pasa la casilla de "seleccionar todas" como `children`). */
  type?: TableHeadType;
  /** Alineación. Por defecto `start`; Figma centra la última columna (acciones). */
  align?: TableAlign;
  /** Columna fija al desplazar en horizontal. */
  sticky?: TableSticky;
  /**
   * Distancia al borde de la columna fija (cualquier longitud CSS), para fijar varias: p. ej. `'3rem'` para la segunda
   * columna fija detrás de la casilla de 48. Por defecto 0.
   */
  stickyOffset?: string | number;
  /**
   * Orden de la columna. Con valor, el texto se vuelve un botón con el ícono de orden (prop Icon de Figma) y la
   * celda lleva `aria-sort` cuando es `ascending` o `descending`. Sin valor, la columna no se ordena.
   */
  sort?: TableSortDirection;
  /** Al activar el botón de orden. Recibe la dirección siguiente (`ascending` salvo que ya lo esté). */
  onSortChange?: (next: Exclude<TableSortDirection, 'none'>) => void;
  /** Texto del encabezado (o la casilla en `type="checkbox"`). */
  children?: ReactNode;
  className?: string;
}

/** Type del contenido de la celda: por defecto o `checkbox` (columna de selección de 48). */
export type TableCellType = 'default' | 'checkbox';

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** `checkbox`: columna de selección (48 de ancho, la casilla con 4 a cada lado). */
  type?: TableCellType;
  /** Alineación del contenido. Por defecto `start`. */
  align?: TableAlign;
  /** Columna fija al desplazar en horizontal. */
  sticky?: TableSticky;
  /** Distancia al borde de la columna fija (longitud CSS). Por defecto 0. */
  stickyOffset?: string | number;
  /** Contenido. Va dentro de un `TableItem` (40 de alto, gap 8). */
  children?: ReactNode;
  className?: string;
}

export interface TableItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Alineación del contenido. Por defecto `start`. */
  align?: TableAlign;
  /** Type=Checkbox: 4 a cada lado de la casilla. */
  checkbox?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface TableEmptyProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Cantidad de columnas de la tabla: la celda del estado vacío las ocupa todas. */
  colSpan: number;
  /** Contenido, normalmente un `EmptyState`. */
  children: ReactNode;
  className?: string;
}

/** Type=Profile: avatar, nombre y descripción. */
export interface TableProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Avatar (normalmente `<Avatar variant="initials" size="sm" name="…" />`). */
  avatar?: ReactNode;
  /**
   * Indicador de estado (Badge simple de 8) en el avatar, abajo a la derecha, como en Figma. Se lo pasa al `avatar`
   * (que debe ser un `<Avatar>` de tamaño `sm`; Avatar lo dibuja en `sm`, `md` y `lg`, no en `xs` ni disabled).
   */
  badge?: boolean;
  /** Color semántico del indicador (State del Badge). Por defecto el del Badge (`default`). */
  badgeState?: BadgeState;
  /** Texto sr-only del indicador (p. ej. "En línea"). Sin él, el indicador es decorativo. */
  badgeLabel?: string;
  /** Nombre (prop "Item name text" de Figma). */
  name: ReactNode;
  /** Descripción (prop Description). Sin ella no se dibuja. */
  description?: ReactNode;
  className?: string;
}

/** Type=Text: título y descripción. */
export interface TableTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Título (prop "Item name text" de Figma). */
  children: ReactNode;
  /** Descripción (prop Description). Sin ella no se dibuja. */
  description?: ReactNode;
  className?: string;
}

/** Type=Highlighted text: texto destacado. */
export interface TableHighlightedTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
}

/** Type=Text+badge: punto de estado (Badge simple) y textos. */
export interface TableBadgeTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Título. */
  children: ReactNode;
  /** Descripción. Sin ella no se dibuja. */
  description?: ReactNode;
  /** Color semántico del punto. Por defecto `default` (el de Figma). */
  badgeState?: BadgeState;
  /**
   * Texto sr-only del punto (p. ej. "Activo"). Sin él el punto es decorativo: el color solo no basta (WCAG 1.4.1).
   */
  badgeLabel?: string;
  className?: string;
}

/** Type=Button (Actions Block): acciones de la fila, centradas con gap 4. */
export interface TableActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Botones (Button, Dots…). */
  children: ReactNode;
  className?: string;
}

export interface TableDisclosureProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Abierto (Up=On de Figma: chevron hacia arriba). Controlado. */
  expanded?: boolean;
  /** Abierto al inicio (no controlado). */
  defaultExpanded?: boolean;
  /** Se llama con el nuevo valor al pulsar el botón. */
  onExpandedChange?: (expanded: boolean) => void;
  /** `id` de la región que muestra u oculta (va en `aria-controls`). */
  controls?: string;
  /** State Select de Figma: fondo de fila seleccionada. */
  selected?: boolean;
  /**
   * Nombre accesible del botón. No cambia con el estado (lo anuncia `aria-expanded`). Por defecto "Ver más datos".
   */
  label?: string;
  className?: string;
}

export interface TableMobileListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'aria-label'> {
  /** Nombre accesible de la lista (el mismo de la tabla, p. ej. "Usuarios"). */
  'aria-label': string;
  /** Filas: `TableMobileRow`. */
  children?: ReactNode;
  className?: string;
}

/** State de Figma de `Row mobile`. Solo fuerza el aspecto, para documentación (en uso real sale de `selected`). */
export type TableMobileRowState = 'default' | 'select';

export interface TableMobileRowProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** Fila seleccionada: marca la casilla y aplica el aspecto Select. Controlado. */
  selected?: boolean;
  /** Seleccionada al inicio (no controlado). */
  defaultSelected?: boolean;
  /** Al marcar o desmarcar la casilla. Sin `selected`, `defaultSelected` ni este manejador no hay casilla. */
  onSelectedChange?: (selected: boolean) => void;
  /** Nombre accesible de la casilla (p. ej. "Seleccionar Ana Pérez"). Por defecto "Seleccionar fila". */
  selectionLabel?: string;
  /** Etiqueta de estado de la fila (prop Tag de Figma), normalmente un `Tag` de tamaño sm. */
  tag?: ReactNode;
  /** Acciones a la derecha de la cabecera (Button, Dots…). */
  actions?: ReactNode;
  /** Campos: `TableMobileField`. */
  children?: ReactNode;
  /**
   * Cantidad de campos visibles con la fila cerrada. Los demás se muestran con el botón de abajo (Dropdown table).
   * Por defecto todos (sin botón).
   */
  visibleFields?: number;
  /** Abierta (controlado). */
  expanded?: boolean;
  /** Abierta al inicio (no controlado). */
  defaultExpanded?: boolean;
  /** Al abrir o cerrar. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Nombre accesible del botón de abrir. Por defecto "Ver más datos". */
  expandLabel?: string;
  /** Fuerza el aspecto, solo para documentación. */
  state?: TableMobileRowState;
  className?: string;
}

export interface TableMobileFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nombre del campo (el encabezado de la columna). */
  label: ReactNode;
  /** Valor del campo (el contenido de la celda). */
  children: ReactNode;
  className?: string;
}

export interface TableRowCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Campos del resumen (siempre visibles), en una fila con gap 32. */
  summary: ReactNode;
  /** Detalle que se muestra al abrir. */
  children?: ReactNode;
  /** Pie de la tarjeta abierta (p. ej. un Button tertiary "Ver más"), alineado a la derecha. */
  footer?: ReactNode;
  /** Abierta (Variant2 de Figma). Controlado. */
  expanded?: boolean;
  /** Abierta al inicio (no controlado). */
  defaultExpanded?: boolean;
  /** Al abrir o cerrar. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Nombre accesible del botón chevron (no cambia con el estado). Por defecto "Ver detalle". */
  toggleLabel?: string;
  className?: string;
}
