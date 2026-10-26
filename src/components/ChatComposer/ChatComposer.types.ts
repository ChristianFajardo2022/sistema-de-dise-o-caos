import type { FormHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export interface ChatComposerProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'children' | 'onSubmit' | 'defaultValue' | 'onChange'> {
  /** Texto del mensaje (controlado). Usar con `onValueChange`. */
  value?: string;
  /** Texto inicial (no controlado). */
  defaultValue?: string;
  /** Se llama con el texto en cada cambio. */
  onValueChange?: (value: string) => void;
  /**
   * Envía el mensaje (botón Enviar o Enter; Shift+Enter hace un salto de línea). Recibe el texto sin espacios de los
   * extremos y no se llama si está vacío. Sin `value` controlado, el campo se vacía al enviar.
   */
  onSend?: (message: string) => void;
  /** Texto de ayuda del campo (capa "Escribe un mensaje..." de Figma). */
  placeholder?: string;
  /** Etiqueta del campo para lectores de pantalla (no se dibuja: Figma no la tiene). Por defecto "Mensaje". */
  label?: string;
  /** Nombre accesible del botón Enviar. Por defecto "Enviar mensaje". */
  sendLabel?: string;
  /** Botón de grabar audio (ícono de micrófono). Se dibuja si se pasa. */
  onRecord?: () => void;
  /** Nombre accesible del botón de grabar. Por defecto "Grabar audio". */
  recordLabel?: string;
  /**
   * Adjuntos (marco "CTA" de Figma): botones a la izquierda de la fila inferior, p. ej. `Button` secondary xs de
   * ícono `folder` e `image`. Con ellos el composer pasa a dos filas.
   */
  attachments?: ReactNode;
  /**
   * Audio grabado listo para enviar: normalmente un `<ChatAudioPlayer />`. Reemplaza al campo de texto; Enviar y
   * Grabar pasan a la derecha de la fila inferior.
   */
  audio?: ReactNode;
  /** Con `audio`: envía el audio. El botón Enviar de la fila inferior se dibuja si se pasa. */
  onSendAudio?: () => void;
  /**
   * Botones grandes para pantallas táctiles (composer móvil de la pantalla Chat de Figma: Button sm con íconos de 20,
   * padding 8/8/8/16 y sin trazo). Por defecto `false`.
   */
  touch?: boolean;
  /** Deshabilita el campo y los botones propios. */
  disabled?: boolean;
  /**
   * Props extra del `<textarea>` (p. ej. `maxLength`, `name`, `autoFocus`). El `ref` del composer va al `<textarea>`
   * y es `null` mientras hay `audio` (el campo no se monta).
   */
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'placeholder' | 'disabled'>;
  /** Clases adicionales para la raíz. */
  className?: string;
}
