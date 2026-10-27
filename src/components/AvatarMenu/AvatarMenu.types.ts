import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { AvatarSize } from '../Avatar/Avatar.types';

/** Atributos de la raíz que admiten `data-*`. */
export type AvatarMenuRootProps = HTMLAttributes<HTMLSpanElement> & {
  [K in `data-${string}`]?: string | number | boolean;
};

/** Props del panel visual (la tarjeta "Profile card" del Type Dropdown de Figma). */
export interface AvatarMenuPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Prop Name de Figma: nombre de la persona. */
  name: string;
  /** Prop Email or cargo de Figma: correo o cargo bajo el nombre. */
  email?: string;
  /** Avatar de 24 de la tarjeta. Por defecto las iniciales de `name`. */
  avatar?: ReactNode;
  /** Slot List items de Figma: `DropdownMenuItem` (modo menú). */
  children?: ReactNode;
  /** Acción "Cerrar sesión". Sin ella no se dibuja el ítem. */
  onLogout?: () => void;
  /** Texto del ítem de cierre de sesión. Por defecto "Cerrar sesión". */
  logoutLabel?: string;
  /** Nombre accesible del menú. Por defecto "Menú de perfil". */
  menuLabel?: string;
  /** Cierra el panel al activar un ítem (lo da `AvatarMenu`). Sin él, un panel suelto no cierra nada. */
  onClose?: () => void;
  className?: string;
}

export interface AvatarMenuProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type' | 'aria-label' | 'aria-labelledby'> {
  /** Nombre de la persona: iniciales del avatar, nombre de la tarjeta y del botón. */
  name: string;
  /** Correo o cargo (prop Email or cargo de Figma). */
  email?: string;
  /**
   * Avatar del botón. Por defecto las iniciales de `name` (`Avatar` initials). Debe ser decorativo: el botón ya tiene
   * nombre. Si muestra texto (iniciales propias), pasa también `label` empezando con ese texto.
   */
  avatar?: ReactNode;
  /** Diámetro del avatar del botón: `md` 48 (escritorio) o `sm` 32 (móvil). Por defecto `md`. */
  size?: Extract<AvatarSize, 'sm' | 'md'>;
  /** Slot List items de Figma: `DropdownMenuItem` de modo menú (type `simple` o `icon`). */
  children?: ReactNode;
  /** Acción del ítem "Cerrar sesión". Sin ella no se dibuja. */
  onLogout?: () => void;
  /** Texto del ítem de cierre de sesión. Por defecto "Cerrar sesión". */
  logoutLabel?: string;
  /**
   * Nombre accesible del botón. Por defecto empieza con las iniciales visibles: "HG, menú de perfil de Hugo García"
   * (WCAG 2.5.3, el nombre contiene el texto visible); con un `avatar` propio sin texto, "Menú de perfil de <name>".
   * Si lo cambias y el botón muestra texto, empieza con ese texto.
   */
  label?: string;
  /** Nombre accesible del menú. Por defecto "Menú de perfil". */
  menuLabel?: string;
  /** Abierto (controlado). Es el Type Dropdown de Figma; cerrado es el Type Default. */
  open?: boolean;
  /** Abierto al montar (no controlado). */
  defaultOpen?: boolean;
  /** Se llama al abrir o cerrar (botón, Escape, clic fuera, ítem activado). */
  onOpenChange?: (open: boolean) => void;
  /** Atributos del contenedor (`data-*`, `style`…). `ref`, `aria-*` y el resto de props van al botón. */
  rootProps?: AvatarMenuRootProps;
  /** Clases adicionales para el contenedor. */
  className?: string;
}
