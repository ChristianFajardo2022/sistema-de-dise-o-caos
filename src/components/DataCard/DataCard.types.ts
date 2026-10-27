import type { HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { CardHeadingLevel } from '../_internal/types';

/** Nivel del encabezado del título (criterio común de las tarjetas). `'none'` = párrafo, fuera del esquema de encabezados. */
export type DataCardHeadingLevel = CardHeadingLevel;

/** State de Figma. `default` y `hover` solo fuerzan el aspecto (documentación); `select` e `inactive` tienen props propias. */
export type DataCardState = 'default' | 'hover' | 'select' | 'inactive';

export interface DataCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Título (Tittle de Figma): dato o métrica principal, en la fuente secundaria de 48. */
  title: ReactNode;
  /** Descripción bajo el título (Description de Figma). */
  description?: ReactNode;
  /** Nivel del encabezado del título (`h2`…`h6`) o `'none'` para un `<p>`. Por defecto 3. */
  headingLevel?: DataCardHeadingLevel;
  /** Ícono del avatar (biblioteca CAOS). Por defecto `chart-square`, el de Figma. */
  icon?: IconName;
  /** Contenido de la izquierda: reemplaza al avatar de ícono por defecto (p. ej. un `Avatar` con foto). `null` lo quita. */
  leading?: ReactNode;
  /** Gráfico o contenido visual de la derecha (Container graphic de Figma, un slot). Es decorativo salvo que traiga su propio texto. */
  children?: ReactNode;
  /** Control al final de la tarjeta: `Switch`, `Button`, `Checkbox` o `Radio` (los que Figma deja ocultos en esta variante). */
  action?: ReactNode;
  /** State Select de Figma: superficie hover-on-card con trazo. Es solo visual: el estado de selección lo lleva el control de `action`. */
  selected?: boolean;
  /**
   * State Inactive de Figma: textos y glifo en gris. Es solo visual: pasa `disabled` al control de `action` para que
   * también quede deshabilitado.
   */
  inactive?: boolean;
  /**
   * Fuerza el State para documentación. Sin él, el hover sale de `:hover` (CSS). `selected` e `inactive` tienen prioridad.
   */
  state?: DataCardState;
  /** Clases adicionales para la raíz */
  className?: string;
}
