import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributeAnchorTarget, ReactNode } from 'react';

/** Type de Figma. Button link es un componente aparte (ButtonLink). */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

/** Contrats de Figma. Solo aplica a secondary. */
export type ButtonContrast = 'low' | 'high';

export type ButtonSize = 'md' | 'sm' | 'xs';

/**
 * State de Figma. hover, focus y press solo fuerzan el aspecto (para documentación);
 * en uso normal salen de la interacción. Tertiary no tiene load.
 */
export type ButtonState = 'default' | 'hover' | 'focus' | 'press' | 'inactive' | 'delete' | 'load';

/**
 * Medida del ícono en px (Icon-sizes de Figma). Por defecto sale del tamaño y del tipo: con texto 20 en md y sm y 14
 * en xs; Icon-single 20 en md y sm y 16 en xs (primary y secondary), o 24 y 20 en tertiary.
 */
export type ButtonIconSize = 14 | 16 | 20 | 24;

export interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Type: jerarquía visual del botón */
  variant?: ButtonVariant;
  /** Contrats: nivel de contraste de secondary */
  contrast?: ButtonContrast;
  /** Unicolor: texto e ícono de un solo color (secondary y tertiary sin icon-single). Inactive y Delete conservan sus colores. */
  unicolor?: boolean;
  /**
   * Size: md 56 · sm 48 · xs 32. Con texto es el alto mínimo (un ícono de 20 en xs lo lleva a 36). Icon-single sigue los
   * tokens responsive de Figma: md 56 · sm 48 · xs 32 en escritorio y md 48 · sm 40 · xs 32 en móvil.
   */
  size?: ButtonSize;
  /** Ocupa todo el ancho del contenedor (`w-full`). Por defecto el botón mide lo que pide su contenido. */
  fullWidth?: boolean;
  /**
   * Solo con `iconOnly`: Icon-single de 44×44 de los botones de Top App Bar iOS (Figma fija 44 en lugar del 56/48/32
   * de `size`). El ícono es de 20 y queda centrado; `size` solo decide el aspecto del tipo, no la medida.
   */
  touchTarget?: boolean;
  /** State forzado. `delete` es el estado de acción destructiva de cada tipo. */
  state?: ButtonState;
  /** Estado load: muestra el spinner y establece aria-busy (tertiary no tiene load) */
  loading?: boolean;
  /** Ícono antes del texto (iconLeft en Figma). Se dibuja a la medida de `iconSize` con el color del estado. */
  leftIcon?: ReactNode;
  /** Ícono después del texto (iconRigth en Figma). Se dibuja a la medida de `iconSize` con el color del estado. */
  rightIcon?: ReactNode;
  /**
   * Medida del ícono en px. Sin valor sigue a Figma por tamaño y tipo (ver `ButtonIconSize`); úsalo solo cuando la
   * pantalla de Figma dibuja otra medida. Con texto, un ícono más alto que la línea estira el botón (xs + 20 → 36).
   */
  iconSize?: ButtonIconSize;
  /**
   * Destino: con `href` el botón se dibuja como `<a>` (navegación real, con Cmd/Ctrl/clic medio) y conserva todos los
   * efectos del tipo, incluido el barrido de Primary. Inactive quita el `href` (no navega ni entra en el orden de
   * tabulación) y deja `role="link"` + `aria-disabled`; Load lo conserva con `aria-disabled` y cancela el clic.
   * `type` no aplica. El `ref` apunta al `<a>` aunque esté tipado como `HTMLButtonElement`.
   */
  href?: string;
  /** Solo con `href`: destino de la navegación (`_blank` agrega el aviso sr-only "se abre en una pestaña nueva"). */
  target?: HTMLAttributeAnchorTarget;
  /** Solo con `href`: relación del enlace (con `target="_blank"` se usa `noopener noreferrer` si no se indica). */
  rel?: string;
  /** Solo con `href`: descarga el destino en lugar de navegar. */
  download?: AnchorHTMLAttributes<HTMLAnchorElement>['download'];
  /** Solo con `href`: idioma del destino. */
  hrefLang?: string;
  /** Clases adicionales */
  className?: string;
  children?: ReactNode;
}

/** Con iconOnly el nombre accesible es obligatorio: aria-label o aria-labelledby (uno de los dos) */
type ButtonIconOnlyProps = ButtonBaseProps & {
  /** Icon-single: botón cuadrado solo con ícono (pasar el ícono como children) */
  iconOnly: true;
} & (
    | { 'aria-label': string; 'aria-labelledby'?: string }
    | { 'aria-labelledby': string; 'aria-label'?: string }
  );

type ButtonTextProps = ButtonBaseProps & {
  /** Icon-single: botón cuadrado solo con ícono (con true exige aria-label o aria-labelledby) */
  iconOnly?: false;
};

export type ButtonProps = ButtonIconOnlyProps | ButtonTextProps;
