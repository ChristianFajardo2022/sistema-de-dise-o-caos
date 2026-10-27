import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Contrast de Figma: la tarjeta sobre el lienzo (On canva) o sobre otra tarjeta (On card). */
export type AccordionContrast = 'on-canva' | 'on-card';

/**
 * Type de Figma del ítem: `normal` (avatar, título y descripción en el encabezado) o `table` (encabezado con una
 * fila de celdas; el título, la descripción y el contenido van en un marco interior al abrir).
 */
export type AccordionItemType = 'normal' | 'table';

/** Nivel del encabezado (`<h2>` a `<h6>`) que envuelve el botón de cada ítem. */
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Identificador del ítem dentro de un `Accordion` (lo que usan `value` y `defaultValue` del grupo).
   * Suelto no hace falta: se genera uno.
   */
  value?: string;
  /** Prop Tittle de Figma: título. Es el nombre accesible del botón. */
  title: ReactNode;
  /** Props Description y Description-2 de Figma: texto de estado bajo el título. Si se omite, no se dibuja. */
  description?: ReactNode;
  /** Prop Icon de Figma: muestra el avatar con ícono antes del título. Por defecto `true`. */
  icon?: boolean;
  /** Ícono de la biblioteca CAOS del avatar. Por defecto `folder`, el de Figma. */
  iconName?: IconName;
  /** Prop Type de Figma. Por defecto `normal`. Con `table` el encabezado muestra `cells`. */
  type?: AccordionItemType;
  /** Solo con `type="table"`: contenido de cada celda de la fila del encabezado (es el nombre accesible del botón). */
  cells?: ReactNode[];
  /** Contrast de Figma. Dentro de un `Accordion` manda el del grupo si no se indica. Por defecto `on-card`. */
  contrast?: AccordionContrast;
  /** Nivel del encabezado. Dentro de un `Accordion` hereda el del grupo. Por defecto 3. */
  headingLevel?: AccordionHeadingLevel;
  /** State=Dropdown de Figma, controlado. Solo para el ítem suelto; dentro de un grupo manda el grupo. */
  open?: boolean;
  /** Abierto al inicio (no controlado). Solo para el ítem suelto. */
  defaultOpen?: boolean;
  /** Se llama al alternar el ítem suelto. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Prop Container de Figma (slot): contenido del panel. Se apila en columna con gap 16 y
   * alineado al final; usa `className="self-stretch"` en lo que deba ocupar todo el ancho.
   */
  children?: ReactNode;
  /** Clases adicionales para el elemento raíz. */
  className?: string;
}

interface AccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'children'> {
  /** Contrast de Figma para todos los ítems del grupo. Por defecto `on-card`. */
  contrast?: AccordionContrast;
  /** Nivel del encabezado de los ítems. Por defecto 3. */
  headingLevel?: AccordionHeadingLevel;
  /** Los `AccordionItem` (cada uno con su `value`). */
  children: ReactNode;
  /** Clases adicionales para el elemento raíz. */
  className?: string;
}

/** Un solo ítem abierto a la vez. `value` es el del ítem abierto ('' = ninguno). */
export interface AccordionSingleProps extends AccordionBaseProps {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Permite cerrar el ítem abierto. Por defecto `true`; con `false` siempre queda uno abierto. */
  collapsible?: boolean;
}

/** Varios ítems abiertos a la vez. `value` es la lista de los abiertos. */
export interface AccordionMultipleProps extends AccordionBaseProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: never;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;
