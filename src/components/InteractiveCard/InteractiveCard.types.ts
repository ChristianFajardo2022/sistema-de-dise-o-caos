import type { HTMLAttributes, InputHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';
import type { RootProps } from '../_internal/types';

/** Type de Figma: `simple` = fila con avatar, textos y radio; `complex` = tarjeta grande con secciones. */
export type InteractiveCardVariant = 'simple' | 'complex';

/**
 * State de Figma. Solo fuerza el aspecto, para documentación: en uso real Hover sale de `:hover`,
 * Select del radio marcado (`checked` / `defaultChecked`) e Inactive de `disabled`.
 */
export type InteractiveCardState = 'default' | 'hover' | 'select' | 'inactive';

/** Props del elemento raíz de la tarjeta. */
export type InteractiveCardRootProps = RootProps<HTMLDivElement>;

export interface InteractiveCardProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'title' | 'children' | 'size' | 'className' | 'content'> {
  /** Type de Figma. Por defecto `simple`. */
  variant?: InteractiveCardVariant;
  /** Prop `Tittle` de Figma. Es el nombre accesible del radio de la tarjeta. */
  title: ReactNode;
  /** Prop `Subtittle2` de Figma. Se asocia al radio como descripción (`aria-describedby`). */
  subtitle?: ReactNode;
  /**
   * Contenido antes del texto (Avatar de Figma). Por defecto un `Avatar` de ícono (32 en simple, 56 en complex)
   * que sigue el estado de la tarjeta. `null` lo quita.
   */
  leading?: ReactNode;
  /** Ícono del avatar por defecto (biblioteca CAOS). Por defecto `folder`, el de Figma. */
  icon?: IconName;
  /** Solo complex: etiquetas a la derecha del encabezado (prop `Tag superior` de Figma), normalmente `<Tag />`. */
  tags?: ReactNode;
  /**
   * Solo complex: resto del grupo "Content" de Figma, bajo el encabezado y con gap de 16
   * (`InteractiveCardHeader`, `InteractiveCardDescription`, `InteractiveCardTags`).
   */
  content?: ReactNode;
  /**
   * Solo complex: secciones de la tarjeta, con gap de 24 (`InteractiveCardDetails`, `InteractiveCardList`,
   * `InteractiveCardStats` o contenido propio). Un control propio debe llevar `data-card-action` para quedar sobre el
   * área de clic de la tarjeta.
   */
  children?: ReactNode;
  /** Solo simple: dibuja el radio (prop `Radio button` de Figma). Sin él la tarjeta sigue siendo un radio accesible. Por defecto `true`. */
  indicator?: boolean;
  /** Solo complex: nombre accesible del Button corner. Si se pasa, se dibuja la muesca con el botón. */
  cornerLabel?: string;
  /** Solo complex: clic del Button corner. */
  onCornerClick?: MouseEventHandler<HTMLButtonElement>;
  /** Solo complex: ícono de 16 del Button corner. Por defecto la flecha diagonal. */
  cornerIcon?: ReactNode;
  /** Se llama con `true` cuando el radio de la tarjeta queda marcado, además del `onChange` nativo. */
  onCheckedChange?: (checked: boolean) => void;
  /** State Inactive de Figma: radio y controles internos deshabilitados. */
  disabled?: boolean;
  /** Fuerza el aspecto de un State, solo para documentación. */
  state?: InteractiveCardState;
  /** Props para el elemento raíz (`div`). El `ref` y el resto de props van al `<input type="radio">`. */
  rootProps?: InteractiveCardRootProps;
  /** Clases adicionales para el elemento raíz (se aplican después de `rootProps.className`). */
  className?: string;
}

export interface InteractiveCardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Avatar u otro contenido a la izquierda. Por defecto el avatar de ícono de 56; `null` lo quita. */
  leading?: ReactNode;
  /** Ícono del avatar por defecto. Por defecto `folder`. */
  icon?: IconName;
  /** Primera línea. */
  title: ReactNode;
  /** Segunda línea. */
  subtitle?: ReactNode;
  /**
   * Qué línea se destaca. `title` = título grande y subtítulo de cuerpo (`Normal tittle` de Figma);
   * `subtitle` = título pequeño y subtítulo grande, p. ej. un dato (`Number tittle`). Por defecto `title`.
   */
  emphasis?: 'title' | 'subtitle';
  /** Ícono decorativo de 16 junto al subtítulo destacado (`Icon subtittle` de Figma). Solo con `emphasis="subtitle"`. */
  subtitleIcon?: IconName;
  /** Etiquetas a la derecha. */
  tags?: ReactNode;
  /** Id del título (lo usa la tarjeta para nombrar su radio). */
  titleId?: string;
  /** Id del subtítulo. */
  subtitleId?: string;
}

export type InteractiveCardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export type InteractiveCardTagsProps = HTMLAttributes<HTMLDivElement>;

export type InteractiveCardDetailsProps = HTMLAttributes<HTMLDListElement>;

export interface InteractiveCardDetailProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Término (Título de Figma). */
  term: ReactNode;
  /** Valor (Descripción de Figma). */
  children: ReactNode;
}

export type InteractiveCardListProps = HTMLAttributes<HTMLUListElement>;

export type InteractiveCardStatsProps = HTMLAttributes<HTMLDivElement>;

export interface InteractiveCardStatProps extends HTMLAttributes<HTMLDivElement> {
  /** Rótulo (Subtítulo de Figma). */
  label: ReactNode;
  /** Dato (Descripción de Figma). */
  value: ReactNode;
  /** Ícono decorativo de 16 junto al dato. */
  icon?: IconName;
}
