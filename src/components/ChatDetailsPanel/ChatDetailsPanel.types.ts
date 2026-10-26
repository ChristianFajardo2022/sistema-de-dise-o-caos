import type { HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Estado que reciben los `children` en forma de función. */
export interface ChatDetailsPanelRenderState {
  collapsed: boolean;
}

export interface ChatDetailsPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Nombre accesible del panel (`<aside>`), p. ej. "Detalles de la conversación". Obligatorio. */
  'aria-label': string;
  /**
   * Muestra el botón de plegar arriba (Button secondary xs `chevron-right`; plegado, `chevron-left`). Es un botón con
   * `aria-expanded` que controla el contenido del panel.
   */
  collapsible?: boolean;
  /** Plegado (controlado): el riel de 64 de ancho (Type=Type4 de Figma). Usar con `onCollapsedChange`. */
  collapsed?: boolean;
  /** Plegado al inicio (no controlado). */
  defaultCollapsed?: boolean;
  /** Se llama al plegar o desplegar con el botón. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Nombre accesible del botón cuando el panel está desplegado. Por defecto "Ocultar detalles". */
  collapseLabel?: string;
  /** Nombre accesible del botón cuando el panel está plegado. Por defecto "Mostrar detalles". */
  expandLabel?: string;
  /**
   * Contenido: `ChatDetailsHeader`, `ChatDetailsProfile`, `ChatDetailsLink`, `ChatDetailsGrid`… También puede ser una
   * función que recibe `{ collapsed }` para cambiar el contenido en el riel.
   */
  children?: ReactNode | ((state: ChatDetailsPanelRenderState) => ReactNode);
  /** Clases adicionales para el `<aside>` raíz. */
  className?: string;
}

export interface ChatDetailsHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Volver a la vista anterior (Button tertiary xs con `chevron-left`). Se dibuja si se pasa. */
  onBack?: () => void;
  /** Texto visible del botón de volver. Por defecto "Anterior". */
  backLabel?: string;
  /**
   * Ref al botón de volver: al abrir una vista que desmonta la anterior, quien compone las vistas le da el foco (si no,
   * el foco cae en `body`).
   */
  backRef?: Ref<HTMLButtonElement>;
  /** Acciones a la derecha (p. ej. Button secondary xs `trash` con state delete y `download`). */
  actions?: ReactNode;
  /** Clases adicionales. */
  className?: string;
}

export interface ChatDetailsProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Avatar de 48: normalmente `<Avatar variant="photo" size="md" badge badgeState="success" … />`. */
  avatar?: ReactNode;
  /** Nombre de la persona o la conversación (capa "Heading" de Figma). */
  name: ReactNode;
  /** Texto debajo del nombre (capa "Lorem ipsum dolor sit amet." de Figma). */
  description?: ReactNode;
  /** Nivel del encabezado del nombre. Por defecto 2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Clases adicionales. */
  className?: string;
}

export interface ChatDetailsLinkProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onClick'> {
  /** Ícono del Avatar icon de 32 (Figma: `folder` para Documentos, `gallery` para Fotografías). */
  icon: IconName;
  /** Título de la fila (prop Tittle de Figma). En `compact` es el nombre accesible del botón. */
  children: string;
  /** Solo el Avatar icon, sin texto ni flecha (riel plegado, Type=Type4). */
  compact?: boolean;
  /** Abre la vista de la sección. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Destino si la sección es una ruta: el control es un enlace (solo en el modo normal; `compact` es siempre un botón). */
  href?: string;
  /** Deshabilitada. */
  disabled?: boolean;
  /** Clases adicionales (del `<li>` en el modo normal, del botón en `compact`). */
  className?: string;
}

export interface ChatDetailsGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Nombre accesible de la región desplazable y de la lista (p. ej. "Fotografías"). Obligatorio. */
  'aria-label': string;
  /** Tarjetas (`FileCard`): cada una va en un `<li>` de una cuadrícula de 2 columnas. */
  children?: ReactNode;
  /** Clases adicionales para el `ScrollArea`. */
  className?: string;
}

