import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * State de Figma. hover, focus y press solo fuerzan el aspecto (para documentación);
 * en uso normal salen de la interacción.
 */
export type ButtonLinkState = 'default' | 'hover' | 'focus' | 'press' | 'inactive';

/**
 * Props de ButtonLink. Con `href` se dibuja como `<a>` (navegación). Sin `href` es un `<button type="button">` real con el
 * mismo aspecto, para acciones en línea como "Reenviar código": Enter y Espacio nativos, `disabled` nativo.
 * Los manejadores de eventos y el `ref` reciben el elemento que se dibuja (`<a>` o `<button>`).
 */
export interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>, 'type'> {
  /** Destino. Sin `href` el componente es un `<button>` (acción), no un enlace. */
  href?: string;
  /** Solo sin `href` (modo botón): tipo del `<button>`. Por defecto `button`. */
  type?: 'button' | 'submit' | 'reset';
  /** State forzado */
  state?: ButtonLinkState;
  /**
   * Estado inactive. Enlace: quita el href, deja `role="link"` y `aria-disabled` (no es enfocable). Botón: `disabled`
   * nativo.
   */
  disabled?: boolean;
  /** "Icon right" de Figma: muestra el ícono de enlace externo después del texto */
  iconRight?: boolean;
  /** Reemplaza el ícono de enlace externo. Se dibuja a 12px con el color del estado. */
  icon?: ReactNode;
  /** Clases adicionales */
  className?: string;
  children?: ReactNode;
}
