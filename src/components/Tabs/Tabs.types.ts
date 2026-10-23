import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { DropdownMenuProps } from '../DropdownMenu/DropdownMenu.types';

/** Size de Figma: `md` (pestaña 48 / contenedor 56 en escritorio) o `sm` (32 / 40). */
export type TabsSize = 'md' | 'sm';

/** Contrast de Figma: `on-canva` (sobre el lienzo) u `on-card` (sobre una tarjeta). */
export type TabsContrast = 'on-canva' | 'on-card';

/**
 * Activación con teclado (patrón WAI-ARIA APG Tabs).
 * - `automatic`: las flechas, Inicio y Fin mueven el foco y seleccionan la pestaña.
 * - `manual`: las flechas solo mueven el foco; Enter o Espacio seleccionan.
 */
export type TabsActivationMode = 'automatic' | 'manual';

/** State del set "Tab (Atom)". Solo fuerza el aspecto (documentación); en uso normal sale de CSS, la selección y `disabled`. */
export type TabState = 'default' | 'hover' | 'focus' | 'select' | 'inactive';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Valor de la pestaña seleccionada (controlado). */
  value?: string;
  /** Pestaña seleccionada al inicio (no controlado). Sin él se selecciona la primera habilitada. */
  defaultValue?: string;
  /** Se llama al seleccionar otra pestaña (clic o teclado). */
  onValueChange?: (value: string) => void;
  /** Size de Figma. Se aplica a `TabList` y a cada `Tab`. Por defecto `md`. */
  size?: TabsSize;
  /** Contrast de Figma. Se aplica a `TabList` y a cada `Tab`. Por defecto `on-canva`. */
  contrast?: TabsContrast;
  /** Ver `TabsActivationMode`. Por defecto `automatic`. */
  activationMode?: TabsActivationMode;
  /** `TabList` y `TabPanel`, en cualquier orden y con el marcado que se quiera entre ellos. */
  children?: ReactNode;
  className?: string;
}

export interface TabListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'> {
  /** Nombre accesible de la lista de pestañas (o `aria-labelledby`). */
  'aria-label'?: string;
  /**
   * Desborde ("more options" de Figma): va a la derecha de las pestañas, fuera del `tablist`.
   * Lo normal es `<TabOverflow>` (botón Dots con su menú).
   */
  overflow?: ReactNode;
  /** Las pestañas ocupan todo el ancho y se reparten por igual (marco "mobile" de Figma). */
  fullWidth?: boolean;
  /** Atributos del contenedor visual (la raíz con el fondo). `ref`, `aria-*` y el resto van al `tablist`. */
  rootProps?: HTMLAttributes<HTMLDivElement> & { [K in `data-${string}`]?: string | number | boolean };
  /** `Tab`. */
  children?: ReactNode;
  /** Clases del contenedor visual (la raíz). */
  className?: string;
}

interface TabBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children'> {
  /** Identificador de la pestaña; enlaza con el `TabPanel` del mismo `value`. */
  value: string;
  /** Ícono de la biblioteca CAOS antes del texto (prop Icon de Figma; Figma usa `heart` de muestra). 16 px, relleno. */
  icon?: IconName;
  /** Prop Badge de Figma: contador después del texto (`Badge` type number). Sin valor no se muestra. */
  badge?: ReactNode;
  /** Texto para lectores de pantalla que sigue al número del badge (p. ej. "sin leer"). */
  badgeLabel?: string;
  /** State Inactive de Figma: pestaña deshabilitada (no se enfoca con flechas ni se selecciona). */
  disabled?: boolean;
  /** Size; por defecto el de `Tabs`. Solo hace falta en pestañas sueltas (documentación). */
  size?: TabsSize;
  /** Contrast; por defecto el de `Tabs`. Solo hace falta en pestañas sueltas (documentación). */
  contrast?: TabsContrast;
  /**
   * Fuerza el aspecto de un State, solo para documentación. Sin esta prop, Hover y Focus salen de `:hover` y
   * `:focus-visible`, Select de la selección y Inactive de `disabled`.
   */
  state?: TabState;
  className?: string;
}

/** Pestaña con texto (prop Text de Figma = `children`). */
export interface TabWithTextProps extends TabBaseProps {
  children: ReactNode;
}

/** Pestaña de solo ícono (Single Icon=Yes de Figma): `icon` y `aria-label` obligatorios. */
export interface TabIconOnlyProps extends TabBaseProps {
  children?: undefined;
  icon: IconName;
  'aria-label': string;
}

export type TabProps = TabWithTextProps | TabIconOnlyProps;

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Valor de la pestaña que lo controla. */
  value: string;
  /** Mantiene el contenido montado cuando no está seleccionado (solo se oculta). Por defecto `false`: el panel queda, vacío. */
  keepMounted?: boolean;
  /**
   * El panel entra en el orden de Tab (`tabIndex={0}`). Por defecto `true`; APG lo pide solo si el panel no
   * tiene nada enfocable: si trae botones o enlaces, pasar `false` para no sumar un tab stop de más.
   */
  focusable?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface TabOverflowProps extends Omit<DropdownMenuProps, 'trigger' | 'aria-label'> {
  /** Nombre accesible del botón Dots. Por defecto "Más pestañas". */
  label?: string;
  /** Nombre accesible del menú. Por defecto el de `label`. */
  'aria-label'?: string;
  /** `DropdownMenuItem` con las pestañas que no caben. */
  children?: ReactNode;
}
