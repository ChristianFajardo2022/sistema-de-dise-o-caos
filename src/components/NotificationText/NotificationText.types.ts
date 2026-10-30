import type { HTMLAttributes, ReactNode } from 'react';

// Figma: 7851:2638
/** State de Figma: Error, Helper text, Confirmation e Information. */
export type NotificationTextState = 'error' | 'helper' | 'confirmation' | 'information';

export interface NotificationTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** State de Figma. Define el ícono y los colores. Por defecto `helper`. */
  state?: NotificationTextState;
  /** Mensaje (la prop "Text helper" de Figma). */
  children: ReactNode;
  /**
   * Anuncia el mensaje a lectores de pantalla cuando aparece: `error` usa `role="alert"` y
   * `confirmation` usa `role="status"`. Con `false` no añade rol (útil cuando el contenedor ya
   * es una región viva, como en Input). Ayuda e información nunca llevan rol: se leen por
   * `aria-describedby`. Por defecto `true`.
   */
  announce?: boolean;
}
