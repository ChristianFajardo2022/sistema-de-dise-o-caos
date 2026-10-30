import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react';
import type { IconName } from '../Icon/Icon.types';

// Figma: 14043:59452, 15005:15958
/**
 * Type de Figma.
 * - `photo`: tarjeta de 240 de alto con lienzo de 160 (foto o ícono) y el texto debajo (File card, Type=Photo).
 * - `icon`: tarjeta ancha con Avatar icon arriba y el texto debajo (File card, Type=Icon).
 * - `thumbnail`: miniatura cuadrada de 160 sin texto visible (File card). En hover o foco muestra
 *   las acciones Descargar y Eliminar.
 */
export type FileCardType = 'photo' | 'icon' | 'thumbnail';

/**
 * State de Figma. Solo fuerza el aspecto (documentación). En uso normal Hover sale de `:hover`
 * (y del foco dentro de la miniatura) y Select del control de selección marcado.
 */
export type FileCardState = 'default' | 'hover' | 'select';

/** Control de selección del Button corner: Checkbox o Radio button (props Select y Radio button de Figma). */
export type FileCardSelection = 'checkbox' | 'radio';

/** Props del input de selección. `checked`, `name`, `value` y `disabled` tienen su prop propia en la tarjeta. */
export type FileCardSelectionProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'children' | 'checked' | 'defaultChecked' | 'name' | 'value' | 'disabled'
> & { ref?: Ref<HTMLInputElement> };

export interface FileCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'defaultChecked' | 'defaultValue' | 'onChange'> {
  /** Type de Figma. Por defecto `icon`. */
  type?: FileCardType;
  /**
   * Nombre del archivo (props Title text y Tittle de Figma, capa Filename). Se recorta a una línea.
   * En `thumbnail` no se ve: queda como texto para lectores de pantalla y nombra el control y las acciones.
   */
  title: ReactNode;
  /** Metadatos del archivo (capa Status de Figma, p. ej. "Tamaño de archivo: 23 KB"). No se muestra en `thumbnail`. */
  description?: ReactNode;
  /**
   * Contenido adicional bajo el título (slots List, Box text, Tag… de Figma). No se muestra en `thumbnail`.
   */
  children?: ReactNode;
  /** Imagen del lienzo en `photo` y `thumbnail`. Sin ella se muestra el Avatar icon. */
  src?: string;
  /** Texto alternativo de la imagen. Sin él la imagen es decorativa (el título ya nombra el archivo). */
  alt?: string;
  /** Ícono del Avatar icon. Por defecto `image` en `photo` y `thumbnail`, `folder` en `icon`. */
  icon?: IconName;
  /**
   * Muestra un control de selección real en el Button corner (Checkbox o Radio). Tiene prioridad sobre el
   * botón de más opciones. Al marcarlo la tarjeta toma el aspecto Select.
   */
  selection?: FileCardSelection;
  /** Marcado (controlado). Usar con `onCheckedChange`. */
  checked?: boolean;
  /** Marcado inicial (no controlado). */
  defaultChecked?: boolean;
  /** Se llama con el nuevo valor al cambiar el control de selección (el evento llega por `selectionProps.onChange`). */
  onCheckedChange?: (checked: boolean) => void;
  /** `name` del input de selección (obligatorio en la práctica para agrupar radios). */
  name?: string;
  /** `value` del input de selección. */
  value?: string;
  /** Deshabilita el control de selección. */
  disabled?: boolean;
  /** Nombre accesible del control de selección. Por defecto lo nombra el título. */
  selectionLabel?: string;
  /**
   * Props del `<input>` de selección, incluido su `ref` (p. ej. para enfocarlo) y su `onChange` nativo.
   * El `ref` de la tarjeta va a la raíz.
   */
  selectionProps?: FileCardSelectionProps;
  /**
   * Botón de más opciones (Button corner Dots de Figma). Se dibuja si se pasa y no hay `selection`.
   * No aplica a `thumbnail`.
   */
  onMoreClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Nombre accesible completo del botón de más opciones. Por defecto "Más opciones de <título>" si el título es texto;
   * si no, "Más opciones" con el título como descripción.
   */
  moreLabel?: string;
  /** Props extra del botón de más opciones (p. ej. `aria-expanded` y `aria-controls` de un menú). */
  moreButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children' | 'type'>;
  /** Solo `thumbnail`: acción Descargar (Button primary). Se dibuja si se pasa. */
  onDownload?: MouseEventHandler<HTMLButtonElement>;
  /** Nombre accesible completo de Descargar. Por defecto "Descargar <título>" (mismo criterio que `moreLabel`). */
  downloadLabel?: string;
  /** Solo `thumbnail`: acción Eliminar (Button primary delete). Se dibuja si se pasa. */
  onDelete?: MouseEventHandler<HTMLButtonElement>;
  /** Nombre accesible completo de Eliminar. Por defecto "Eliminar <título>" (mismo criterio que `moreLabel`). */
  deleteLabel?: string;
  /** Fuerza el aspecto de un State, solo para documentación. */
  state?: FileCardState;
  /** Clases adicionales para la raíz. */
  className?: string;
}
