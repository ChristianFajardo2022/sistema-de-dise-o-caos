import type { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import type { ButtonSize } from '../Button/Button.types';

/** Props de la raíz (el contenedor del botón y el contador). Acepta atributos `data-*`. */
export type NotificationBellRootProps = HTMLAttributes<HTMLSpanElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

export interface NotificationBellProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type' | 'aria-label' | 'aria-labelledby'> {
  /**
   * Notificaciones sin leer. Con un número mayor que 0 se dibuja el contador (Type `Icon+badge` de Figma); con 0 o sin
   * valor es el botón solo (Type `Default`).
   */
  count?: number;
  /** Máximo que muestra el contador: por encima se lee "99+". Por defecto 99 (lo que dibuja Figma). */
  max?: number;
  /** Size del Button de Figma: `xs` 32 (el átomo) o `sm` 48 y `md` 56 (el botón de los paneles y el Header). Por defecto `xs`. */
  size?: ButtonSize;
  /** Nombre accesible base. Por defecto "Notificaciones"; con contador se le añade ", N sin leer". */
  label?: string;
  /** Texto que sigue a la cantidad en el nombre accesible. Por defecto "sin leer". */
  unreadLabel?: string;
  /**
   * El panel de notificaciones que abre está a la vista: expone `aria-expanded` y pinta el botón en el aspecto
   * Press de Figma (el del Type `Dropdown` de los paneles). Sin `open` no se expone `aria-expanded`.
   */
  open?: boolean;
  /** Atributos del contenedor. `ref`, `aria-controls` y el resto de props van al botón. */
  rootProps?: NotificationBellRootProps;
  /** Clases adicionales para el contenedor. */
  className?: string;
}
