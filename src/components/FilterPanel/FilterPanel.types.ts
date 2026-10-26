import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { AccordionHeadingLevel } from '../Accordion/Accordion.types';

/**
 * Valor de una sección de filtro. Lo define quien arma la sección: lista de opciones (chips, casillas, árbol),
 * texto (select, radios), número (cantidad, calificación), booleano (interruptor), fecha, rango `[a, b]` u objeto
 * (`{ from, to }`, varios selects). `undefined`, `null`, `''`, `false` y listas vacías cuentan como "sin filtro".
 */
export type FilterValue = unknown;

/** Un objeto por sección: `{ [idDeSección]: valor }`. */
export type FilterValues = Record<string, FilterValue>;

/** Lo que recibe el contenido de una `FilterSection` cuando es una función. */
export interface FilterSectionField {
  /** Id de la sección (clave en `FilterValues`). */
  id: string;
  /** Valor actual de la sección (`undefined` si no tiene). */
  value: FilterValue;
  /** Cambia el valor de la sección. */
  onValueChange: (value: FilterValue) => void;
  /** Quita el valor de la sección ("Limpiar"). */
  clear: () => void;
  /** Id del título visible, para nombrar los controles con `aria-labelledby`. */
  labelId: string;
}

/**
 * Aspecto de la sección.
 * - `card`: tarjeta plegable ("Card accordion (Atom)", On card), la del panel "Filters".
 * - `plain`: título y contenido sin tarjeta ni plegado ("Individual filter" de Figma), para filtros sueltos en una página.
 */
export type FilterSectionVariant = 'card' | 'plain';

export interface FilterSectionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'defaultValue' | 'onChange' | 'id'> {
  /** Clave de la sección en los valores del panel. Obligatoria. */
  id: string;
  /** Prop Tittle de Figma: título de la sección. Nombra el botón de plegado (card) o el grupo (plain). */
  title: ReactNode;
  /** Ver `FilterSectionVariant`. Por defecto `card`. */
  variant?: FilterSectionVariant;
  /** Texto de estado bajo el título (Description de Card accordion; Figma lo trae apagado). Solo en `card`. */
  description?: ReactNode;
  /** Avatar con ícono antes del título (prop Icon de Card accordion). Por defecto `true`. Solo en `card`. */
  icon?: boolean;
  /** Ícono del avatar. Por defecto `folder`, el de Figma. */
  iconName?: IconName;
  /** Cantidad que muestra el badge del título. Por defecto se calcula del valor (`countFilterValue`); 0 lo oculta. */
  count?: number;
  /** Muestra el botón "Limpiar" de la sección cuando tiene valor. Por defecto `true`. */
  clearable?: boolean;
  /** Texto del botón de limpiar la sección. Por defecto "Limpiar" (su nombre accesible agrega el título). */
  clearLabel?: string;
  /** Nivel del encabezado. Por defecto 3. */
  headingLevel?: AccordionHeadingLevel;
  /** Fuera de un `FilterPanel`: valor de la sección (controlado). Dentro manda el panel. */
  value?: FilterValue;
  /** Fuera de un `FilterPanel`: valor inicial (no controlado). */
  defaultValue?: FilterValue;
  /** Fuera de un `FilterPanel`: se llama al cambiar el valor. */
  onValueChange?: (value: FilterValue) => void;
  /** Solo `card` fuera de un panel: abierta al inicio. Por defecto `true`. */
  defaultOpen?: boolean;
  /**
   * Contenido (slot Container / List de Figma). Puede ser una función que recibe `FilterSectionField` para conectar
   * el control existente (ChipGroup, Select, Slider, DatePicker, CheckboxTree…) con el valor de la sección.
   */
  children?: ReactNode | ((field: FilterSectionField) => ReactNode);
  /** Clases adicionales para la raíz. */
  className?: string;
}

/** Atributos del panel visual (la superficie). Acepta `data-*`. */
export type FilterPanelSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

export interface FilterPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'defaultValue' | 'onChange' | 'children'> {
  /** Título del panel. Por defecto "Filtros avanzados" (el de Figma). */
  title?: ReactNode;
  /** Valores de todas las secciones mientras se editan (controlado). */
  value?: FilterValues;
  /** Valores iniciales (no controlado). */
  defaultValue?: FilterValues;
  /** Se llama con el objeto completo cada vez que cambia una sección o se limpia. */
  onValueChange?: (values: FilterValues) => void;
  /** Botón principal "Aplicar": recibe los valores actuales. Con `modal`, además cierra el panel. */
  onApply?: (values: FilterValues) => void;
  /** Se llama tras "Limpiar" (que deja los valores en `{}`). */
  onClear?: () => void;
  /** Texto del botón principal. Por defecto "Aplicar". */
  applyLabel?: string;
  /** Texto del botón secundario. Por defecto "Limpiar". */
  clearLabel?: string;
  /**
   * Modal: se abre como `<dialog>` modal (foco atrapado, Escape y clic fuera cierran, el foco vuelve al botón que lo abrió).
   * En escritorio es un panel lateral a la derecha; en móvil, una hoja inferior. Sin `modal`, el panel se dibuja en el flujo
   * de la página (barra lateral fija). Por defecto `true`.
   */
  modal?: boolean;
  /** Abierto (controlado). */
  open?: boolean;
  /** Abierto al inicio (no controlado). Por defecto `false` si es modal y `true` si no. */
  defaultOpen?: boolean;
  /** Se llama al abrir o cerrar (botón cerrar, Escape, clic fuera, Aplicar). */
  onOpenChange?: (open: boolean) => void;
  /** Nombre accesible del botón cerrar. Por defecto "Cerrar filtros". Sin modal, el botón solo aparece con `onOpenChange`. */
  closeLabel?: string;
  /** Secciones abiertas (controlado), por `id`. */
  openSections?: string[];
  /** Secciones abiertas al inicio. Por defecto todas (como Figma escritorio). */
  defaultOpenSections?: string[];
  /** Se llama al plegar o desplegar una sección. */
  onOpenSectionsChange?: (sections: string[]) => void;
  /** Resumen de filtros elegidos (chips que se pueden quitar) bajo el título. Por defecto `true`; sin filtros no se dibuja. */
  showSummary?: boolean;
  /** Las `FilterSection`. */
  children?: ReactNode;
  /** Clases adicionales para la superficie del panel. */
  className?: string;
  /** Atributos de la superficie del panel (con `modal`, el resto de props va al `<dialog>`). */
  surfaceProps?: FilterPanelSurfaceProps;
}
