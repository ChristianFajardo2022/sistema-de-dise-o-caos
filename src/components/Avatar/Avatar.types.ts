import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { BadgeState } from '../Badge/Badge.types';
import type { IconName } from '../Icon/Icon.types';

/**
 * Tipo de avatar. Reúne los átomos de Figma: `initials` y `user` son "Avatar colors"
 * (Type Names y User), `photo` es "Avatar photo", `brand` es "Avatar brand" e `icon` es "Avatar icon".
 */
export type AvatarVariant = 'initials' | 'user' | 'photo' | 'brand' | 'icon';

/**
 * Tamaño. Se nombra por el diámetro: xs 24, sm 32, md 48, lg 56 (tokens dimention/avatar/*).
 * Figma nombra distinto los átomos brand e icon (md = 56, sm = 48, xs = 32): aquí siguen la misma escala
 * que el resto. El xs de brand e icon (24) no existe en Figma y se deriva de la misma regla.
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

/** Color de las variantes `initials` y `user` (Color de Figma). El gris deshabilitado sale de `disabled`. */
export type AvatarColor = 'purple' | 'yellow' | 'blue' | 'green' | 'red';

/** Contrast de Figma para `brand` e `icon`: sobre el lienzo (On Canva) o sobre una tarjeta (On Card). */
export type AvatarContrast = 'on-canva' | 'on-card';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Type de Figma. Por defecto `initials`. */
  variant?: AvatarVariant;
  /** Diámetro: xs 24, sm 32, md 48, lg 56. Dentro de un `AvatarGroup` manda el tamaño del grupo. Por defecto `lg`. */
  size?: AvatarSize;
  /** Color de `initials` y `user`. Se ignora si `disabled`. Por defecto `purple`. */
  color?: AvatarColor;
  /** Contrast de `brand` e `icon`. Por defecto `on-canva`. */
  contrast?: AvatarContrast;
  /** Aspecto Disabled de Figma (solo visual: el avatar no es interactivo). En `photo` pasa la imagen a grises. */
  disabled?: boolean;
  /**
   * Nombre completo de la persona. En `initials` se reduce a iniciales ("Hugo García" -> "HG")
   * y es además el nombre accesible. En `user` es el nombre accesible.
   */
  name?: string;
  /** Texto alternativo de `photo`. Sin él la foto es decorativa (alt vacío). */
  alt?: string;
  /** Imagen de `photo`. Es la URL de la foto: el sistema no incluye fotos. */
  src?: string;
  /**
   * Contenido de imagen propio para `photo` (p. ej. un `<picture>` o un componente de imagen del framework).
   * Si se pasa, reemplaza al `<img>` de `src`.
   */
  children?: ReactNode;
  /** Logo de `brand`. Ocupa el recuadro del logo (32 en lg y md, 24 en sm, 16 en xs); el SVG debe usar `currentColor`. */
  logo?: ReactNode;
  /** Nombre del ícono de la biblioteca CAOS para `icon`. Por defecto `folder` (el de Figma). */
  icon?: IconName;
  /**
   * Nombre accesible para `user`, `brand` e `icon` (y para sobrescribir el de `initials`).
   * Sin ningún nombre (`label`, `name`, `alt`) el avatar es decorativo (aria-hidden).
   */
  label?: string;
  /**
   * Indicador de estado (Badge simple) abajo a la derecha. Figma lo define solo en
   * `initials`, `user` y `photo` de tamaño lg y md, y no en disabled: en los demás casos no se dibuja.
   */
  badge?: boolean;
  /** Texto sr-only del indicador (p. ej. "En línea"). Sin él, el indicador es decorativo (el color solo no basta). */
  badgeLabel?: string;
  /**
   * Color semántico del indicador (`state` del Badge), p. ej. `success` para "en línea". Por defecto el del Badge
   * (`default`), igual que en Figma.
   */
  badgeState?: BadgeState;
  /** Anillo blanco de 0.5 que separa avatares solapados. Lo activa `AvatarGroup`. */
  ringed?: boolean;
  /** Clases adicionales para el elemento raíz. */
  className?: string;
}

/** State de Figma del "+N". Hover se activa solo con el cursor; la prop sirve para forzarlo en documentación. */
export type AvatarPlusState = 'default' | 'hover';

export interface AvatarPlusProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  /** Cantidad que representa ("+N"). */
  count: number;
  /** Diámetro (alto del botón). Por defecto `sm`, el de Figma dentro del grupo. */
  size?: AvatarSize;
  /** Fuerza el aspecto Hover (trazo blanco). Solo para documentación. */
  state?: AvatarPlusState;
  /** Nombre accesible del botón. Debe contener el texto visible "+N" (WCAG 2.5.3). Por defecto "Ver +N más". */
  label?: string;
  /** Clases adicionales para el contenedor (el `<span>` que envuelve al botón). `ref` y el resto de props van al `<button>`. */
  className?: string;
}

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Avatares del grupo, normalmente `<Avatar />`. */
  children: ReactNode;
  /** Máximo de avatares visibles; el resto se resume en "+N". Por defecto 5. */
  max?: number;
  /** Tamaño de los avatares del grupo. Por defecto `sm` (Figma: grupo Size lg, avatares de 32). */
  size?: AvatarSize;
  /** Al activar el "+N". Con `overflowMenu` se llama al abrir la lista. */
  onOverflowClick?: () => void;
  /**
   * El "+N" abre (clic, Enter o Espacio) una lista con los avatares ocultos a tamaño `xs` y su nombre
   * (`name` ?? `alt` ?? `label`; sin ninguno, "Persona sin nombre"). Con `false` solo llama a `onOverflowClick`. Por defecto `true`.
   */
  overflowMenu?: boolean;
  /** Nombre accesible de la lista de personas ocultas. Por defecto "Personas ocultas". */
  overflowMenuLabel?: string;
  /** Nombre accesible del "+N". Recibe la cantidad y debe contener "+N" (WCAG 2.5.3). Por defecto "Ver +N más". */
  overflowLabel?: (count: number) => string;
  /** Clases adicionales para el elemento raíz. */
  className?: string;
}
