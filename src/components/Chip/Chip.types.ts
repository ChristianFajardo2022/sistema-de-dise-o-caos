import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, MouseEvent, ReactElement, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/**
 * Type de Figma. `primary` lleva ícono opcional a la izquierda; `primary-avatar` un avatar de 24;
 * `primary-color` un punto de color de 24; `primary-box` es la versión rectangular (radio 16) cuyo texto
 * puede partirse en varias líneas.
 */
export type ChipType = 'primary' | 'primary-avatar' | 'primary-color' | 'primary-box';

/**
 * State de Figma. Hover y Focus salen de CSS real y Select de `selected`; esta prop solo fuerza el aspecto
 * en documentación. `inactive` equivale a `disabled`.
 */
export type ChipState = 'default' | 'hover' | 'focus' | 'select' | 'inactive';

/**
 * Color del punto de `primary-color`: los cinco de Avatar más `violet` (background/graphic/acent-secondary) y `cyan`
 * (background/graphic/information-*), que usa la paleta de colores de los filtros.
 */
export type ChipColor = 'purple' | 'green' | 'yellow' | 'red' | 'blue' | 'violet' | 'cyan';

/**
 * Intensidad del punto de `primary-color`.
 * - `soft`: background/graphic/*-firts (pasteles; azul = background/tertiary/secondary), la del set Chips.
 * - `strong`: background/graphic/*-secondary, la del filtro "Chips colors". `purple` y `violet` no cambian.
 */
export type ChipTone = 'soft' | 'strong';

/** Props de las partes de la raíz (la cápsula). Acepta atributos `data-*`. */
export type ChipRootProps = HTMLAttributes<HTMLSpanElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

export interface ChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type' | 'color' | 'value' | 'disabled'> {
  /** Type de Figma. Por defecto `primary`. */
  type?: ChipType;
  /** Prop Text de Figma: texto del chip. */
  children?: ReactNode;
  /**
   * Texto plano del chip para el nombre accesible del botón de quitar ("Quitar texto") cuando `children`
   * no es un string.
   */
  label?: string;
  /** Prop Icon de Figma: ícono a la izquierda en `primary` y `primary-box`. Por defecto `true`. */
  icon?: boolean;
  /** Ícono de la biblioteca CAOS (INSTANCE_SWAP de Figma). Por defecto `clock`. */
  iconName?: IconName;
  /**
   * Avatar de `primary-avatar` (p. ej. `<Avatar variant="initials" name="Ana Pérez" />`). El chip lo pasa a
   * tamaño `xs` y a `disabled` cuando está inactivo, y lo marca decorativo: el nombre ya va en el texto.
   */
  avatar?: ReactElement;
  /** Color del punto de `primary-color`. Por defecto `purple`. */
  color?: ChipColor;
  /** Intensidad del punto de `primary-color` (ver `ChipTone`). Por defecto `soft`. */
  tone?: ChipTone;
  /** Texto sr-only con el significado del color del punto (el color solo no basta). Sin él el punto es decorativo. */
  colorLabel?: string;
  /**
   * Prop Close de Figma: muestra el botón de quitar. Por defecto es `true` cuando hay `onRemove` (Figma lo trae
   * activo, pero un botón sin acción sería un control muerto).
   */
  close?: boolean;
  /**
   * Se activa al quitar (botón o Supr/Retroceso sobre el chip). Recibe el evento para saber desde dónde se quitó.
   * Dentro de un `ChipGroup` el foco pasa al chip vecino (o al grupo si era el último); en un chip suelto el
   * consumidor debe mover el foco a un lugar con sentido antes de desmontarlo.
   */
  onRemove?: (event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
  /** Nombre accesible del botón de quitar. Por defecto "Quitar" + el texto del chip. */
  removeLabel?: string;
  /** Identificador dentro de un `ChipGroup` (obligatorio para que el grupo lo seleccione). */
  value?: string;
  /** Seleccionado (controlado). Con él el chip es un botón de alternancia (`aria-pressed`). */
  selected?: boolean;
  /** Seleccionado al inicio (no controlado). */
  defaultSelected?: boolean;
  /** Cambia la selección. */
  onSelectedChange?: (selected: boolean) => void;
  /** Fuerza el aspecto de un estado, solo para documentación. */
  state?: ChipState;
  /** Inactive: chip no disponible (deshabilita cuerpo y botón de quitar). */
  disabled?: boolean;
  /** Clases adicionales para la raíz (la cápsula). `ref` y el resto de props van al cuerpo del chip. */
  className?: string;
  /** Atributos de la raíz (la cápsula), p. ej. `data-*`. */
  rootProps?: ChipRootProps;
}

/** Modo de selección de `ChipGroup`. */
export type ChipGroupSelectionMode = 'none' | 'single' | 'multiple';

export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'defaultValue'> {
  /** `Chip` hijos directos, con `value` único. */
  children: ReactNode;
  /**
   * `none`: chips sin selección (`role="group"`, cada chip es una parada de tabulación). `single`: grupo de radios
   * (`role="radiogroup"`, una parada; flechas mueven y seleccionan). `multiple`: barra de botones de alternancia
   * (`role="toolbar"`, una parada; flechas, Inicio y Fin mueven el foco). Por defecto `none`.
   */
  selectionMode?: ChipGroupSelectionMode;
  /** Valores seleccionados (controlado). En `single` tiene como máximo uno. */
  value?: string[];
  /** Valores seleccionados al inicio (no controlado). */
  defaultValue?: string[];
  /** Cambia la selección. */
  onValueChange?: (value: string[]) => void;
  /**
   * Máximo de chips visibles; el resto se resume en un "+N" que abre una lista. Sin límite por defecto. En `none`, los
   * chips con `onRemove` no se ocultan (su botón de quitar no cabe en la lista) y los ocultos con `onClick` pasan a ser
   * ítems de menú con esa acción; sin acciones, la lista es solo informativa.
   */
  max?: number;
  /** Nombre accesible del "+N". Recibe la cantidad y debe contener "+N" (WCAG 2.5.3). Por defecto "Ver +N más". */
  overflowLabel?: (count: number) => string;
  /** Nombre accesible de la lista de chips ocultos. Por defecto "Más opciones". */
  overflowMenuLabel?: string;
  /** Nombre accesible del grupo (obligatorio en `single`, recomendado siempre). */
  'aria-label'?: string;
  className?: string;
}

/** State del "+N" de Figma ("Chips plus"). Hover y Focus salen de CSS; `select` es el menú abierto. */
export type ChipPlusState = 'default' | 'hover' | 'focus' | 'select' | 'inactive';

export interface ChipPlusProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className' | 'disabled'> {
  /** Cantidad de chips ocultos ("+N"). */
  count: number;
  /** Fuerza el aspecto de un estado, solo para documentación. Con `aria-expanded` el aspecto es `select`. */
  state?: ChipPlusState;
  /** Inactive: no disponible. */
  disabled?: boolean;
  /** Nombre accesible. Debe contener el texto visible "+N" (WCAG 2.5.3). Por defecto "Ver +N más". */
  label?: string;
  className?: string;
}
