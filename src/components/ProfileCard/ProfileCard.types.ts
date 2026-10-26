import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react';
import type { CardHeadingLevel } from '../_internal/types';

/**
 * Disposición de la tarjeta (prop Type de Figma, set "Profile card" 12995:3291).
 * - `vertical`: Standar vertical. Avatar arriba y texto debajo, superficie con muesca para el Button corner.
 * - `horizontal`: Standar horizontal. Avatar a la izquierda y texto a la derecha, misma superficie.
 * - `hero`: Full / Hero. Fila ancha (avatar, texto, acciones y más opciones) con etiquetas y contadores debajo.
 *   Cuando la tarjeta mide menos de 42rem pasa a la versión Mobile de Figma (encabezado con avatar y acciones,
 *   texto y etiquetas debajo, contadores a todo el ancho).
 * - `centered`: Qualification. Todo centrado. La calificación con estrellas no es parte del layout: es contenido
 *   (`stars`) y puede ir en cualquier disposición.
 */
export type ProfileCardLayout = 'vertical' | 'horizontal' | 'hero' | 'centered';

/** Control de selección del Button corner (prop Radius button de Figma): Checkbox o Radio. */
export type ProfileCardSelection = 'checkbox' | 'radio';

/** Nivel del encabezado con el nombre de la persona (criterio común de las tarjetas). */
export type ProfileCardHeadingLevel = CardHeadingLevel;

/** Un contador de la fila Counters de Figma ("Ventas", "Reseñas", "Calificaciones"). */
export interface ProfileCardStat {
  /** Cifra (texto grande). */
  value: ReactNode;
  /** Qué cuenta (texto pequeño debajo). Es el término de la lista de definiciones. */
  label: ReactNode;
  /** Ícono decorativo junto a la cifra, p. ej. `<IconStar state="select" />` en "Calificaciones". */
  icon?: ReactNode;
}

/** Props del input de selección. `checked`, `name`, `value` y `disabled` tienen su prop propia en la tarjeta. */
export type ProfileCardSelectionProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className' | 'children' | 'checked' | 'defaultChecked' | 'name' | 'value' | 'disabled'
> & { ref?: Ref<HTMLInputElement> };

export interface ProfileCardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children' | 'defaultChecked' | 'defaultValue' | 'onChange'> {
  /** Type de Figma. Por defecto `vertical`. */
  layout?: ProfileCardLayout;
  /** Prop Title de Figma: nombre de la persona o de la tienda. Es el encabezado y el nombre accesible de la tarjeta. */
  title: ReactNode;
  /**
   * Prop Subtittle de Figma (capa "Description Block"): datos cortos bajo el nombre. Con un arreglo se separan
   * con "·" (Figma: "Bogotá D.C · Bogotá D.C").
   */
  subtitle?: ReactNode | ReactNode[];
  /** Prop Description de Figma. */
  description?: ReactNode;
  /** Prop Avatar de Figma: normalmente `<Avatar variant="photo" />` o `<Avatar variant="brand" />` de tamaño `lg`. */
  leading?: ReactNode;
  /** Calificación promedio (0 a 5) en el Badge icon + number sobre el avatar. Solo se dibuja si hay `leading`. */
  rating?: number;
  /** Texto para lectores que sigue a la cifra del Badge. Por defecto "de 5 estrellas" ("4,5 de 5 estrellas"). */
  ratingLabel?: string;
  /** Puntaje de la fila de estrellas (Star rating de Qualification), de 0 a 5. Solo lectura. */
  stars?: number;
  /** Nombre accesible de la fila de estrellas. Por defecto "N de 5 estrellas". */
  starsLabel?: string;
  /** Prop Tags de Figma: etiquetas, normalmente `<Tag iconLeft={false} />`. */
  tags?: ReactNode;
  /** Prop Counters de Figma: contadores con divisores (lista de definiciones). */
  stats?: ProfileCardStat[];
  /** Contenido adicional bajo la descripción. */
  children?: ReactNode;
  /**
   * Prop Button / Icon buttons de Figma: grupo de acciones. Cada acción debe tener un nombre que incluya a la persona
   * (p. ej. `aria-label="Contactar a Ana Pérez"` con el texto visible "Contactar").
   */
  actions?: ReactNode;
  /**
   * Botón de más opciones (Dots-moreoptions en `hero`, Button corner Dots en `vertical` y `horizontal` si no hay
   * `selection`). No aplica a `centered`.
   */
  onMoreClick?: MouseEventHandler<HTMLButtonElement>;
  /** Nombre accesible completo de más opciones. Por defecto "Más opciones de <título>". */
  moreLabel?: string;
  /** Props extra del botón de más opciones (p. ej. `aria-expanded` y `aria-controls` de un menú). */
  moreButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children' | 'type'>;
  /**
   * Control de selección real en el Button corner (prop Radius button de Figma). Solo `vertical` y `horizontal`.
   * Tiene prioridad sobre el botón de más opciones.
   */
  selection?: ProfileCardSelection;
  /** Marcado (controlado). Usar con `onCheckedChange`. */
  checked?: boolean;
  /** Marcado inicial (no controlado). */
  defaultChecked?: boolean;
  /** Se llama con el nuevo valor al cambiar la selección (el evento nativo llega por `selectionProps.onChange`). */
  onCheckedChange?: (checked: boolean) => void;
  /** `name` del input de selección (obligatorio en la práctica para agrupar radios). */
  name?: string;
  /** `value` del input de selección. */
  value?: string;
  /** Deshabilita el control de selección. */
  disabled?: boolean;
  /** Nombre accesible completo del control de selección. Por defecto "Seleccionar <título>". */
  selectionLabel?: string;
  /** Props del `<input>` de selección, incluido su `ref`. El `ref` de la tarjeta va a la raíz. */
  selectionProps?: ProfileCardSelectionProps;
  /** Nivel del encabezado del título (`h2`…`h6`) o `'none'` para un `<p>`. Por defecto 3. */
  headingLevel?: ProfileCardHeadingLevel;
  /** Clases adicionales para el elemento raíz (`<article>`). */
  className?: string;
}
