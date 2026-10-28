import type { DialogHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode, RefObject } from 'react';
import type { ButtonIconSize, ButtonState } from '../Button/Button.types';
import type { IconName } from '../Icon/Icon.types';

/**
 * Acción del pie de un modal (un Button de CAOS). El tipo (Primary, Secondary, Tertiary) lo da la prop que la recibe.
 * Al hacer clic se llama `onClick` y después el modal se cierra (`onOpenChange(false)`), salvo que `onClick` llame a
 * `event.preventDefault()` (p. ej. para validar o esperar una petición antes de cerrar).
 */
export interface ModalAction {
  /** Texto del botón. */
  label: ReactNode;
  /** Se llama al hacer clic, antes de cerrar. `event.preventDefault()` evita el cierre. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Deshabilita el botón (estado Inactive). */
  disabled?: boolean;
  /** Estado load: spinner y `aria-busy` (no aplica a la acción terciaria). */
  loading?: boolean;
  /** Estado forzado del Button; `delete` para una acción destructiva. */
  state?: ButtonState;
  /** Ícono antes del texto. */
  leftIcon?: ReactNode;
  /** Ícono después del texto. */
  rightIcon?: ReactNode;
  /** Medida del ícono (por defecto la de Button md). */
  iconSize?: ButtonIconSize;
  /** Nombre accesible propio, si el texto visible no basta (debe empezar con el texto visible). */
  'aria-label'?: string;
}

/** Type de Figma del Simple modal: ícono y color semánticos. */
export type AlertModalType = 'info' | 'error' | 'alert' | 'success';

/** Props comunes de los dos modales (lo que va en el `<dialog>`). */
export interface ModalBaseProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title' | 'children' | 'role'> {
  /** Abierto (controlado). Úsalo con `onOpenChange`. */
  open?: boolean;
  /** Abierto al montar (no controlado). Por defecto `false`. */
  defaultOpen?: boolean;
  /** Se llama al pedir abrir o cerrar: Escape, clic en el fondo, el botón cerrar o una acción del pie. */
  onOpenChange?: (open: boolean) => void;
  /** Título (prop Heading / Text heading de Figma). Sin título, pasa `aria-label` para dar nombre al diálogo. */
  title?: ReactNode;
  /** Nivel del título. Por defecto `2`. */
  headingLevel?: 2 | 3 | 4;
  /** Acción principal (Button Primary). */
  primaryAction?: ModalAction;
  /** Acción secundaria (Button Secondary, prop Btn secondary de Figma). */
  secondaryAction?: ModalAction;
  /** Acción terciaria (Button Tertiary, prop Btn tertiary de Figma). */
  tertiaryAction?: ModalAction;
  /** Pie propio: reemplaza a las tres acciones (p. ej. un Button con `href`). */
  actions?: ReactNode;
  /** Botón cerrar (prop Icon close de Figma). Por defecto `true`. En móvil Figma no lo dibuja: se cierra con Escape, el fondo o una acción. */
  closable?: boolean;
  /** Nombre accesible del botón cerrar. Por defecto `'Cerrar'`. */
  closeLabel?: string;
  /** Cierra con un clic en el fondo (solo si el puntero bajó y subió en el fondo). Por defecto `true`. */
  closeOnBackdrop?: boolean;
  /** Elemento que recibe el foco al abrir. Por defecto lo elige el modal (ver cada componente). */
  initialFocus?: RefObject<HTMLElement | null>;
}

/** Simple modal de Figma: aviso o confirmación corta con ícono semántico. */
export interface AlertModalProps extends ModalBaseProps {
  /** Type de Figma: ícono y color semánticos. Por defecto `success` (el de Figma). */
  type?: AlertModalType;
  /** Descripción destacada (↪ Text description1 de Figma, en semibold). */
  description?: ReactNode;
  /** Texto de apoyo (↪ Text descriptio2 de Figma, en regular). */
  children?: ReactNode;
}

/** Complex modal de Figma: encabezado, cuerpo libre con desplazamiento y pie con acciones. */
export interface ModalProps extends ModalBaseProps {
  /** Lateral de Figma: `true` = panel lateral derecho a todo el alto; `false` = centrado con el cerrar en la muesca. Por defecto `false`. */
  lateral?: boolean;
  /** Descripción bajo el título (prop Description / Description2 de Figma). */
  description?: ReactNode;
  /** Ícono del encabezado en un Avatar icon (prop Icon de Figma). Sin él no se dibuja. */
  icon?: IconName;
  /** Nombre accesible de la zona de contenido cuando desborda y se desplaza. Por defecto `'Contenido'`. */
  bodyLabel?: string;
  /** Contenido (slot Container de Figma). */
  children?: ReactNode;
}

/** Props internas de las superficies (lo que dibuja cada modal dentro del `<dialog>`). */
export interface ModalPanelBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  title?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  titleId?: string;
  descriptionId?: string;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  tertiaryAction?: ModalAction;
  actions?: ReactNode;
  closable?: boolean;
  closeLabel?: string;
  /** Cierre pedido por el botón cerrar o por una acción. Sin él (superficie suelta en documentación) no se cierra nada. */
  onClose?: () => void;
  /** Ref que el panel engancha al elemento que debe recibir el foco inicial. */
  focusRef?: RefObject<HTMLElement | null>;
  'data-figma'?: string;
}

/** Superficie del Simple modal, suelta (sin `<dialog>`): para documentación o para montarla en otro contenedor. */
export interface AlertModalPanelProps extends ModalPanelBaseProps {
  type?: AlertModalType;
  description?: ReactNode;
  children?: ReactNode;
}

/** Superficie del Complex modal, suelta (sin `<dialog>`). */
export interface ModalPanelProps extends ModalPanelBaseProps {
  lateral?: boolean;
  description?: ReactNode;
  icon?: IconName;
  bodyLabel?: string;
  children?: ReactNode;
}
