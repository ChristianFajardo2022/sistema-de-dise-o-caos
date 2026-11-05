import type { ReactNode } from 'react';
import type { IconName } from '../../components/Icon/Icon.types';
import type { DocBlock, DocInline, DocSectionContent, DocTone } from '../../docs/types';

/*
 * Esquema de la página de un fundamento con la plantilla v2 (piloto: Tipografía). Extiende el de los componentes
 * (`src/docs/types.ts`): las secciones admiten los mismos bloques (`DocBlock`) y, además, los bloques de texto que
 * piden los fundamentos (tabla, tarjetas de texto, nota y código).
 *
 * Vive aquí porque `src/docs/` es compartido; está escrito para mudarse tal cual a `src/docs/types.ts` (los bloques
 * nuevos se suman a `DocBlock` y `FoundationDocContent` queda junto a `ComponentDocContent`).
 */

/** Columna de un bloque `table`. */
export interface DocTableColumn {
  /** Texto del encabezado. */
  header: string;
  /**
   * Peso relativo del ancho (los anchos de Figma tal cual, p. ej. 150, 480 y 395): la columna ocupa `width / suma`
   * del ancho de la tabla. Sin él, la columna se reparte lo que sobra con las demás sin peso.
   */
  width?: number;
}

/** Paso de una lista numerada dentro de una tarjeta de texto. */
export interface DocCardStep {
  /** Nombre del paso, sin el número (la lista lo pone). */
  title: string;
  content: DocInline;
}

/** Columna interna de una tarjeta de texto (subtítulo y texto), p. ej. una por plataforma. */
export interface DocCardColumn {
  title: string;
  content: DocInline;
}

/** Código de ejemplo en el panel "Ejemplo": monoespaciado, con botón de copiar. */
export interface DocCodeSample {
  /** Nombre del bloque (región con scroll y botón de copiar). */
  label: string;
  /** Código tal cual, con sus saltos de línea y su sangría. */
  code: string;
}

/**
 * Tarjeta de texto ("Tarjeta" de Figma: Card simple sobre el lienzo). Las piezas se dibujan en este orden: título,
 * cifra destacada, párrafos, pasos numerados, columnas, muestra, código y pie.
 */
export interface DocTextCard {
  /** Título de la tarjeta (Heading-md-600, 20/24). */
  title?: string;
  /** Cifra destacada bajo el título (p. ej. "4,5:1"). */
  figure?: string;
  /** Párrafos. Un arreglo = varios párrafos. */
  content?: DocInline | DocInline[];
  /** Lista numerada de pasos (nombre del paso y texto). */
  steps?: DocCardStep[];
  /** Columnas internas con subtítulo y texto (una columna en secciones angostas). */
  columns?: DocCardColumn[];
  /** Muestra libre (componente real o pieza propia del fundamento). Se dibuja tal cual, sin panel. */
  preview?: ReactNode;
  /** Código en el panel "Ejemplo" (`background/container/default-on-card`, radio 24, padding 24). */
  code?: DocCodeSample;
  /** Párrafos bajo la muestra o el código. */
  footer?: DocInline | DocInline[];
}

/** Bloques nuevos de los fundamentos (se suman a `DocBlock`). */
export type FoundationExtraBlock =
  /**
   * Tabla ("Table" de la documentación de Figma): cabecera `background/container/default-on-card` y filas
   * `background/table/default` separadas 8, cada una con radio 16 y padding 16; celdas 14/18 de varias líneas y la
   * primera columna en `text/acent/firts` (encabezado de fila). Si no cabe hace scroll horizontal propio (región con
   * nombre, enfocable solo si desborda).
   */
  | { type: 'table'; caption: string; columns: (string | DocTableColumn)[]; rows: DocInline[][]; minWidth?: number }
  /** Tarjetas de texto en una fila de 1, 2 o 3 (una columna en secciones angostas). */
  | { type: 'cards'; columns?: 1 | 2 | 3; items: DocTextCard[] }
  /**
   * Nota o alerta: tarjeta de texto con el título en el color del tono (los de la etiqueta de Estados) y su ícono
   * (`alert` y `error`: warning-2; `success`: tick-circle; `neutral` y `accent`: info-circle). Es `role="note"`.
   */
  | { type: 'note'; tone?: DocTone; title: string; content: DocInline | DocInline[] }
  /** Código suelto en el panel "Ejemplo". */
  | { type: 'code'; sample: DocCodeSample };

/** Cualquier bloque de una sección de fundamento. */
export type FoundationBlock = DocBlock | FoundationExtraBlock;

/** Sección de un fundamento: la misma de los componentes, con los bloques ampliados. */
export interface FoundationSectionContent extends Omit<DocSectionContent, 'blocks'> {
  blocks: FoundationBlock[];
}

/** Pestaña de la página de un fundamento. */
export type FoundationDocTab = 'definicion' | 'aplicacion' | 'accesibilidad' | 'desarrollo';

/**
 * Contenido de la página de un fundamento: el mismo encabezado y las mismas secciones que la de un componente, con
 * hasta cuatro pestañas (Definición, Aplicación, Accesibilidad y Desarrollo). Una pestaña sin secciones no aparece.
 */
export interface FoundationDocContent {
  /** Nombre del fundamento (h1). */
  name: string;
  /** Ícono de la tarjeta del encabezado (biblioteca CAOS). */
  icon: IconName;
  /** Bajada del encabezado. */
  summary: string;
  definition: FoundationSectionContent[];
  application?: FoundationSectionContent[];
  accessibility?: FoundationSectionContent[];
  development?: FoundationSectionContent[];
}
