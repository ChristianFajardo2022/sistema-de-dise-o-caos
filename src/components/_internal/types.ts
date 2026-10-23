import type { HTMLAttributes } from 'react';

/** Atributos `data-*` sueltos (en un objeto de props TypeScript no los acepta sin declararlos). */
export type DataAttributes = { [K in `data-${string}`]?: string | number | boolean };

/**
 * Props del elemento raíz cuando el `ref` y el resto de props van a otro elemento (el control).
 * `className` de la tarjeta se aplica después de `rootProps.className`.
 */
export type RootProps<E extends HTMLElement = HTMLDivElement> = HTMLAttributes<E> & DataAttributes;

/** Nivel del encabezado del título de una tarjeta. `'none'` = párrafo (`<p>`), fuera del esquema de encabezados. */
export type CardHeadingLevel = 2 | 3 | 4 | 5 | 6 | 'none';
