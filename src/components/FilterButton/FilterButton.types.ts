import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

/** Marco de Figma que se dibuja: `desktop` (texto + chevron), `mobile` (solo ícono de filtro) o `auto` (según el ancho de la ventana, < 48rem = mobile). */
export type FilterButtonLayout = 'auto' | 'desktop' | 'mobile';

/** Atributos de la raíz (la fila Badge + botón). Acepta `data-*`. */
export type FilterButtonRootProps = HTMLAttributes<HTMLSpanElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

export interface FilterButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Prop Text de Figma (botón Tertiary). Por defecto "Filtros". En `mobile` pasa a ser el nombre accesible. */
  children?: ReactNode;
  /**
   * Cantidad de filtros aplicados (Badge Number de Figma). Con 0 o sin valor no se dibuja el badge.
   * Suele salir de `countFilters(valoresAplicados)`. También acepta texto ("99+").
   */
  count?: number | string;
  /** Prop Badge de Figma: muestra el contador. Por defecto `true`. */
  badge?: boolean;
  /**
   * Texto para lectores de pantalla que sigue al número ("3 filtros aplicados"). Puede ser una función de la cantidad.
   * Por defecto "filtro aplicado" / "filtros aplicados".
   */
  countLabel?: string | ((count: number | string) => string);
  /** Type=Inactive de Figma: botón deshabilitado y badge gris. */
  disabled?: boolean;
  /** Ver `FilterButtonLayout`. Por defecto `auto`. */
  layout?: FilterButtonLayout;
  /** Clases adicionales para la raíz (la fila). `ref` y el resto de props van al `<button>`. */
  className?: string;
  /** Atributos de la raíz. */
  rootProps?: FilterButtonRootProps;
}
