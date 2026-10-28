import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, ReactElement, ReactNode, Ref, RefObject } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Type del set "Dropdown menu" de Figma: panel simple o con campo de búsqueda arriba. */
export type DropdownMenuType = 'simple' | 'search';

/**
 * Uso del panel.
 * - `menu`: menú de acciones o selección (WAI-ARIA Menu Button). Roles `menu` / `menuitem*`, foco dentro, flechas.
 * - `list`: lista informativa (p. ej. los avatares ocultos de un grupo). `ul` / `li`, ítems no accionables, sin foco dentro.
 */
export type DropdownMenuMode = 'menu' | 'list';

/** Alineación del panel con el disparador: `end` = borde derecho del panel con el borde derecho del disparador (Figma). */
export type DropdownMenuAlign = 'start' | 'end';

/** Lado preferido. Si no cabe, el panel pasa al otro lado. */
export type DropdownMenuSide = 'bottom' | 'top';

/**
 * Type del set "Dropdown list" de Figma (el ítem).
 * `simple` = solo texto, `icon` = ícono + texto (el "Simple" con Icono=true), `checkbox`, `radio` (RadioButton), `avatar` y `dropdown` ("List Item Dropdown": texto + `chevron-down` a la derecha).
 */
export type DropdownMenuItemType = 'simple' | 'icon' | 'checkbox' | 'radio' | 'avatar' | 'dropdown';

/** State del ítem de Figma. Solo fuerza el aspecto (documentación); en uso normal sale de CSS, `selected`, `checked` y `disabled`. */
export type DropdownMenuItemState = 'default' | 'hover' | 'select' | 'disabled';

/** Props que `DropdownMenu` inyecta al disparador (si `trigger` es una función, se reciben aquí). */
export interface DropdownMenuTriggerProps {
  ref: Ref<HTMLElement>;
  id: string;
  'aria-haspopup'?: 'menu';
  'aria-expanded': boolean;
  'aria-controls': string;
  /** Atributo nativo `popovertarget`: el navegador abre y cierra el panel y evita reabrirlo al hacer clic en el propio disparador. */
  popoverTarget: string;
  popoverTargetAction: 'toggle';
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

/**
 * Foco al montar la lista suelta: `first` = el ítem elegido (`selected` o radio marcado) o, si no hay, el primero;
 * `last` = el último; `none` = no se mueve (p. ej. la superficie se abrió abierta de entrada, no por la persona).
 */
export type DropdownMenuListInitialFocus = 'first' | 'last' | 'none';

/** Props de la lista de ítems suelta (`DropdownMenuList`). */
export interface DropdownMenuListProps extends HTMLAttributes<HTMLDivElement> {
  /** Nombre accesible del menú (obligatorio). */
  'aria-label': string;
  /** Cierra la superficie que contiene la lista al activar un ítem. Sin él, la lista suelta no cierra nada. */
  onClose?: () => void;
  /** Foco al montar (ver `DropdownMenuListInitialFocus`). Por defecto `none`. */
  initialFocus?: DropdownMenuListInitialFocus;
  children?: ReactNode;
}

/** Props de la lista de navegación (`DropdownMenuNavList`): enlaces con el aspecto de "Dropdown list", sin roles de menú. */
export interface DropdownMenuNavListProps extends HTMLAttributes<HTMLUListElement> {
  /** Ítems: un `<li>` por fila con un `DropdownMenuItem` (con `href`) dentro; el `<li>` admite subniveles o divisores. */
  children?: ReactNode;
}

/** Props del panel visual (set "Dropdown menu"). */
export interface DropdownMenuPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Type de Figma: `simple` o `search` (campo de búsqueda arriba). Por defecto `simple`. */
  type?: DropdownMenuType;
  /** Ver `DropdownMenuMode`. Por defecto `menu`. */
  mode?: DropdownMenuMode;
  /** Prop "Scroll bar" de Figma: reserva y dibuja el riel de 6 a la derecha. Por defecto `true`. */
  scrollbar?: boolean;
  /** Alto máximo del área de ítems (CSS). Pasado ese alto se desplaza. Por defecto `20rem`. */
  maxHeight?: string | number;
  /** Nombre accesible del menú o de la lista (obligatorio). */
  'aria-label': string;
  /** Label del campo de búsqueda (`type="search"`). Por defecto "Buscar". */
  searchLabel?: string;
  /** Valor del campo de búsqueda (controlado). Filtrar los ítems es responsabilidad de quien usa el panel. */
  searchValue?: string;
  /** Cambio del campo de búsqueda. */
  onSearchChange?: (value: string) => void;
  /**
   * Atributos del área de ítems (el slot "Check List", en modo `menu`): `id`, `ref`, `role`, `aria-labelledby`…
   * Con `role: 'listbox'` el panel sirve de lista de opciones (patrón combobox): los hijos son `role="option"` propios y
   * el foco no entra en el panel. Por defecto `role="menu"`.
   */
  listProps?: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement>; role?: 'menu' | 'listbox' } & {
    [K in `data-${string}`]?: string | number | boolean;
  };
  /** Ítems (`DropdownMenuItem`). Es el slot "Check List" de Figma. */
  children?: ReactNode;
  className?: string;
}

/** Props del menú con disparador: panel + popover + teclado. */
export interface DropdownMenuProps
  extends Omit<DropdownMenuPanelProps, 'onToggle' | 'onBeforeToggle' | 'id' | 'children' | 'listProps'> {
  /**
   * Disparador. Un elemento (se clona con `aria-*`, `popoverTarget`, `ref` y `onKeyDown`; debe reenviar `ref` y props al
   * elemento nativo, como `Button` o `AvatarPlus`) o una función que recibe esas props.
   */
  trigger: ReactElement | ((props: DropdownMenuTriggerProps) => ReactNode);
  /** Alineación respecto al disparador. Por defecto `end` (abajo y hacia la izquierda, como Figma). */
  align?: DropdownMenuAlign;
  /** Lado preferido. Por defecto `bottom`. */
  side?: DropdownMenuSide;
  /** Separación en px entre el ancla y el panel. Por defecto 4. */
  offset?: number;
  /**
   * Elemento al que se alinea el panel en lugar del disparador (como `anchorRef` de Select), p. ej. una barra que
   * contiene al disparador. El foco y los atributos ARIA siguen en el disparador.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /** Abierto (controlado). */
  open?: boolean;
  /** Abierto al inicio (no controlado). */
  defaultOpen?: boolean;
  /** Cambia al abrir o cerrar (clic fuera, Esc, selección, disparador). */
  onOpenChange?: (open: boolean) => void;
  /** Ítems (`DropdownMenuItem`). */
  children?: ReactNode;
}

/** Props del ítem (set "Dropdown list"). */
export interface DropdownMenuItemProps
  extends Omit<LiHTMLAttributes<HTMLElement>, 'onSelect' | 'children' | 'onChange'> {
  /** Type de Figma. Por defecto `simple`. */
  type?: DropdownMenuItemType;
  /** Ícono de la biblioteca CAOS para `type="icon"`. Por defecto `add-circle` (el de Figma). */
  icon?: IconName;
  /** Avatar para `type="avatar"` (p. ej. `<Avatar variant="photo" size="xs" … />`). Figma usa el de 24. */
  avatar?: ReactNode;
  /** Marcado de `checkbox` / `radio` (controlado). */
  checked?: boolean;
  /** Marcado inicial (no controlado). */
  defaultChecked?: boolean;
  /** Cambia el marcado de `checkbox` / `radio`. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Aspecto "Select" en `simple`, `icon` y `avatar` (en `checkbox` y `radio` sale de `checked`). En un menú es
   * `aria-current="true"`; dentro de `DropdownMenuNavList`, la página actual (`aria-current="page"`).
   */
  selected?: boolean;
  /** Fuerza el aspecto de un State, solo para documentación. */
  state?: DropdownMenuItemState;
  /** Ítem deshabilitado: no se enfoca con flechas ni se activa. */
  disabled?: boolean;
  /** Se activa (clic, Enter o Espacio). Solo en modo `menu`. */
  onSelect?: () => void;
  /** Cierra el panel al activar. Por defecto `true`, salvo en `checkbox` (se puede marcar varios). Solo modo `menu`. */
  closeOnSelect?: boolean;
  /**
   * Destino del ítem: lo vuelve un enlace real (`<a href>`, con Cmd/Ctrl/clic medio). En un menú lleva `role="menuitem"`
   * y cierra al activarse; dentro de `DropdownMenuNavList` es un enlace de navegación (`aria-current="page"` con
   * `selected`). Solo `simple`, `icon` y `avatar`.
   */
  href?: string;
  /** `target` del enlace (con `href`). */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** `rel` del enlace (con `href`). Con `target="_blank"` se recomienda `noopener noreferrer`. */
  rel?: string;
  /** Texto del ítem (prop "Text item" de Figma). */
  children?: ReactNode;
  className?: string;
}
