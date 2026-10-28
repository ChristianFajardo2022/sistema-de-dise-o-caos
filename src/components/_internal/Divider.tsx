import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { dividerClass } from './dividerClass';
import type { DataAttributes } from './types';

export interface DividerProps extends HTMLAttributes<HTMLElement>, DataAttributes {
  /** Elemento: `span` (por defecto, dentro de un `<li>` u otro contenedor), `div` o `li` (fila propia de una lista). */
  as?: 'span' | 'div' | 'li';
}

/**
 * Divisor compartido (pieza interna, no se exporta desde el paquete). Decorativo: `aria-hidden`. Lo usan los submenús
 * de SideBar y la hoja móvil de Header.
 */
export function Divider({ as: Tag = 'span', className, ...rest }: DividerProps) {
  return <Tag aria-hidden="true" {...rest} className={cn(dividerClass, Tag === 'li' && 'list-none', className)} />;
}
