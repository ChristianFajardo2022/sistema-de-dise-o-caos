import type { ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { CardHeadingLevel } from '../_internal/types';

/**
 * State de Figma que es interacción. Solo fuerza el aspecto (documentación): en uso normal Hover sale de `:hover`,
 * del foco dentro de la tarjeta y de las pantallas táctiles. El State "+" de Figma no es un aspecto: es el producto ya
 * agregado (`quantity` mayor que 0), que cambia el botón por el selector de cantidad.
 */
export type ProductCardState = 'default' | 'hover';

export interface ProductCardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children' | 'onChange' | 'defaultValue'> {
  /** Nombre del producto (capa Filename de Figma). Se recorta a una línea. Nombra también las acciones. */
  title: string;
  /** Descripción corta (capa Status). Se ve en hover, con foco dentro, en táctil o con el producto agregado. */
  description?: ReactNode;
  /** Precio ya formateado (p. ej. "$129.999"). Los lectores lo anuncian como "Precio: $129.999". */
  price: string;
  /** Calificación promedio de 0 a 5 (Number rating). Sin ella no se dibuja. */
  rating?: number;
  /** Total de reseñas: solo se anuncia junto a la calificación (Figma no lo dibuja). */
  ratingCount?: number;
  /** Foto del producto (relleno de la silueta Subtract). */
  src: string;
  /** Texto alternativo de la foto. Por defecto vacío: el título ya nombra el producto. */
  alt?: string;
  /** Enlace a la ficha del producto. Con él, toda la tarjeta lleva ahí (enlace estirado sobre el título). */
  href?: string;
  /** Nivel del encabezado del título. Por defecto 3; `'none'` = párrafo. */
  headingLevel?: CardHeadingLevel;

  /** Cantidad en el carrito (controlada). Con 1 o más se muestra el selector de cantidad (State "+" de Figma). */
  quantity?: number;
  /** Cantidad inicial (no controlada). Por defecto 0. */
  defaultQuantity?: number;
  /**
   * Se llama con la nueva cantidad: 1 al agregar, la del selector después; 0 al quitar la última unidad, que devuelve
   * la tarjeta al botón de agregar.
   */
  onQuantityChange?: (quantity: number) => void;
  /** Cantidad máxima del selector. */
  maxQuantity?: number;
  /** Se llama al pulsar "Agregar al carrito" (además de `onQuantityChange(1)`). */
  onAddToCart?: MouseEventHandler<HTMLButtonElement>;
  /** Texto visible del botón de agregar. Por defecto "Agregar al carrito". */
  addToCartText?: string;
  /** Nombre accesible del botón de agregar. Por defecto "*texto*: *título*" ("Agregar al carrito: Audífonos"), que empieza por el texto visible (WCAG 2.5.3). */
  addToCartLabel?: string;
  /** Nombre accesible del selector de cantidad. Por defecto "Cantidad de *título*". */
  quantityLabel?: string;
  /**
   * Acción secundaria junto a "Agregar al carrito" (Button secondary solo ícono de Figma, con el ícono `edit`).
   * Se pasa armada, con su nombre accesible (p. ej. "Personalizar *título*"). No se muestra con el producto agregado.
   */
  action?: ReactNode;

  /** Favorito (controlado). Usar con `onFavoriteChange`. */
  favorite?: boolean;
  /** Favorito inicial (no controlado). */
  defaultFavorite?: boolean;
  /** Se llama con el nuevo valor al pulsar el botón de favorito. */
  onFavoriteChange?: (favorite: boolean) => void;
  /** Nombre accesible del botón de favorito (toggle con `aria-pressed`). Por defecto "Agregar *título* a favoritos". */
  favoriteLabel?: string;
  /** Props extra del botón de favorito. */
  favoriteButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children' | 'type' | 'aria-pressed'>;

  /** Fuerza el aspecto Hover, solo para documentación. */
  state?: ProductCardState;
  /** Clases adicionales para la raíz. */
  className?: string;
}
