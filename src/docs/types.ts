import type { ReactNode } from 'react';
import type { IconName } from '../components/Icon/Icon.types';

/**
 * Esquema de contenido de la página de documentación de un componente (plantilla "Documentación" de Figma).
 * Cada componente exporta un objeto `doc` de este tipo desde `<Nombre>.doc.tsx`; `ComponentDoc` lo dibuja.
 * La guía para redactarlo está en `.qa/docs/guia-contenido.md`.
 */

/** Clasificación del componente según su composición (diseño atómico). */
export type DocClassification = 'atomo' | 'molecula' | 'composicion';

/** Texto que admite marcado en línea: `<strong>`, `<code>`, `<em>`. Nada de bloques (párrafos, listas). */
export type DocInline = ReactNode;

/** Tarjeta (Panel de Figma): título, etiqueta opcional, vista de ejemplo, texto y viñetas. */
export interface DocCardContent {
  /** Título de la tarjeta (16 px semibold). */
  title: string;
  /** Etiqueta corta en versalitas bajo el título (p. ej. "Átomo principal", "Composición"). */
  eyebrow?: string;
  /** Ejemplo con el componente real; se dibuja dentro de un marco gris (`DocPreview`). */
  preview?: ReactNode;
  /** Alto mínimo del marco del ejemplo, en px de la escala de Tailwind (`sm` 96, `md` 160, `lg` 208). Por defecto se ajusta al contenido. */
  previewSize?: 'sm' | 'md' | 'lg';
  /** Texto bajo el ejemplo. Varios párrafos: pasar un arreglo (cada elemento es un párrafo). */
  description?: DocInline | DocInline[];
  /** Viñetas (en vez de, o además de, `description`). */
  bullets?: DocInline[];
  /** Color de las viñetas: `accent` (violeta, por defecto) o `error` (rojo, para "Cuándo evitarlo"). */
  bulletTone?: 'accent' | 'error';
}

/** Celda de la grilla de ejemplos (`gallery`): etiqueta, vista y detalle. */
export interface DocGalleryItem {
  /** Etiqueta arriba (12 px semibold). */
  label: string;
  /** Ejemplo con el componente real. */
  preview?: ReactNode;
  /** Detalle bajo el ejemplo (una o dos líneas). */
  description?: DocInline;
}

/** Parte de la anatomía. Se numera sola (1, 2, 3…) en el orden del arreglo. */
export interface DocAnatomyPart {
  /** Nombre de la parte (p. ej. "Contenedor"). */
  name: string;
  /** Qué es o para qué sirve, en una línea. */
  description: DocInline;
}

/** Buena o mala práctica. */
export interface DocPractice {
  /** `do` = buena práctica (✓ verde), `dont` = mala práctica (✕ rojo). */
  kind: 'do' | 'dont';
  /** Regla en imperativo ("Describe el resultado", "No repitas…"). */
  title: string;
  /** Explicación o ejemplo concreto. */
  description: DocInline;
  /** Ejemplo visual opcional (componente real). */
  preview?: ReactNode;
  /**
   * Estilo v2 (Cards con muesca): el título visible es "Hacer" / "Evitar", `description` es la regla en una línea y
   * el ejemplo va en un panel tintado con marco de dispositivo. Con él, `title` solo nombra el ejemplo (lectores de
   * pantalla y clave de lista).
   */
  framed?: boolean;
}

/** Tono de la etiqueta de una columna de estados. */
export type DocTone = 'neutral' | 'accent' | 'success' | 'error';

/** Columna del bloque `states`: un estado con su descripción y sus muestras. */
export interface DocStateItem {
  /** Nombre del estado (p. ej. "Hover"). */
  label: string;
  /** Color de la etiqueta. */
  tone?: DocTone;
  /** Qué significa y cuándo aparece. */
  description: DocInline;
  /** Muestras con el componente real, una por tile. */
  samples: ReactNode[];
}

/**
 * Parte señalada en un lienzo de anatomía. El marcador se coloca midiendo el elemento en el DOM.
 */
export interface DocAnatomyMark {
  /** Número del marcador; debe coincidir con la pauta (1 = primera de la lista). */
  n: number;
  /** Selector (querySelector) dentro de la vista. */
  selector: string;
  /** Si el selector coincide con varios elementos: cuál (0 = primero, -1 = último). Por defecto 0. */
  index?: number;
  /** Lado de la parte donde queda el marcador. */
  side: 'top' | 'bottom' | 'left' | 'right';
}

/** Cota medida del DOM: padding (violeta) o separación (verde) con su valor en px. */
export type DocAnatomyDimension =
  /** Padding de `selector` en el lado indicado (computado). */
  | { kind: 'padding'; selector: string; index?: number; side: 'top' | 'bottom' | 'left' | 'right' }
  /** Separación horizontal entre dos elementos (el borde derecho del primero y el izquierdo del segundo). */
  | { kind: 'gap'; from: string; fromIndex?: number; to: string; toIndex?: number }
  /** Alto de `selector`, con un corchete a la derecha. */
  | { kind: 'height'; selector: string; index?: number };

/** Lienzo con puntos de la anatomía: etiqueta, componente real, marcadores y cotas. */
export interface DocAnatomyCanvas {
  /** Etiqueta sobre el lienzo (p. ej. "Botón con texto"). */
  label: string;
  /** Componente real. */
  preview: ReactNode;
  /** Partes con marcador. */
  marks: DocAnatomyMark[];
  /** Cotas de espaciado. */
  dimensions?: DocAnatomyDimension[];
}

/** Un grupo de la anatomía: 1 o 2 lienzos y, debajo, sus pautas numeradas. */
export interface DocAnatomyGroup {
  canvases: DocAnatomyCanvas[];
  /** Pautas numeradas (1, 2, 3…) en el orden del arreglo. */
  guidelines: DocInline[];
}

/** Entrada de la tarjeta de tokens: una parte del componente con su token de color y/o de texto. */
export interface DocTokenEntry {
  /** Nombre de la parte (p. ej. "Fondo"). */
  part: string;
  /** Token de color sin el prefijo `ds-` (p. ej. "background-button-primary-default"). Muestra su hex del modo activo. */
  color?: string;
  /** Token de tipografía (solo el nombre; no es un color). */
  text?: string;
}

/** Grupo de tokens: vista del componente a la izquierda, entradas a la derecha. */
export interface DocTokenGroup {
  title: string;
  /** Componente real (el interruptor de modo lo cambia con la tarjeta). */
  preview: ReactNode;
  entries: DocTokenEntry[];
}

/** Contenido de una tarjeta de breakpoint (Mobile o Tablet). */
export interface DocBreakpointCard {
  /** Viñetas bajo la vista. */
  bullets: DocInline[];
  /** Vista con el componente real: se dibuja en el marco del dispositivo con los valores responsive del breakpoint. */
  preview: ReactNode;
}

/** Columna de la tarjeta Desktop: subtítulo, viñetas y vista. */
export interface DocBreakpointColumn extends DocBreakpointCard {
  title: string;
}

/**
 * Bloques de una sección. Todos los bloques ocupan el ancho completo de la sección; las grillas internas pasan a una
 * columna en móvil.
 */
export type DocBlock =
  /** Grilla de tarjetas (2 columnas por defecto; 1 en móvil). */
  | { type: 'cards'; columns?: 1 | 2 | 3; items: DocCardContent[] }
  /** Tabla: encabezados y filas. La primera celda de cada fila es su encabezado. */
  | { type: 'table'; caption: string; columns: string[]; rows: DocInline[][] }
  /** "Cuándo usarlo" / "Cuándo evitarlo": dos tarjetas con viñetas (violeta y roja). */
  | { type: 'usage'; use: DocInline[]; avoid: DocInline[] }
  /** Anatomía: vista del componente y lista numerada de partes. */
  | { type: 'anatomy'; title?: string; preview: ReactNode; parts: DocAnatomyPart[] }
  /** Anatomía v2: tarjeta con lienzos de puntos (marcadores y cotas medidos del DOM) y pautas numeradas. */
  | { type: 'anatomy'; groups: DocAnatomyGroup[] }
  /** Estados: tarjeta con una columna por estado (etiqueta con tono, descripción y muestras). */
  | { type: 'states'; items: DocStateItem[] }
  /**
   * Tokens y modos: tarjeta con el título y la bajada de la sección adentro (`titleInside`), interruptor de modo y un
   * grupo por fila. El hex de cada token se calcula en vivo.
   */
  | { type: 'tokens'; groups: DocTokenGroup[] }
  /** Breakpoints: tarjetas de Desktop (dos columnas), Mobile y Tablet con el componente en su marco de dispositivo. */
  | { type: 'breakpoints'; desktop: { columns: DocBreakpointColumn[] }; mobile: DocBreakpointCard; tablet: DocBreakpointCard }
  /** "Uso en Figma": tarjeta con muesca a la izquierda, logo, título y viñetas. Va en una sección `titleInside`. */
  | { type: 'figma'; bullets: DocInline[] }
  /** Tarjeta con una grilla de ejemplos (posiciones, matriz de estados, respuesta a la interacción). */
  | { type: 'gallery'; title: string; columns?: 2 | 3 | 4; align?: 'center' | 'start'; items: DocGalleryItem[] }
  /** Nota destacada: `info` (violeta) o `warning` (amarillo). */
  | { type: 'note'; tone?: 'info' | 'warning'; content: DocInline }
  /** Buenas y malas prácticas en pares (✓ / ✕), dos columnas. */
  | { type: 'practices'; items: DocPractice[] }
  /** Párrafo suelto (con marcado en línea). */
  | { type: 'text'; content: DocInline }
  /** Escape para casos que no cubren los demás bloques. Úsalo poco: lo que se repite debe volverse un bloque. */
  | { type: 'custom'; content: ReactNode };

/** Sección de la página (título h2 y bajada; sin número). */
export interface DocSectionContent {
  /** Título de la sección (p. ej. "Propósito y anatomía"). */
  title: string;
  /** Bajada: una o dos frases bajo el título. */
  description: DocInline;
  /** Contenido. */
  blocks: DocBlock[];
  /**
   * El título y la bajada se dibujan dentro de la tarjeta del bloque (`tokens`, `figma`) en vez de sobre ella. La
   * sección debe tener un solo bloque de ese tipo.
   */
  titleInside?: boolean;
}

/** Contenido completo de la página de un componente. */
export interface ComponentDocContent {
  /** Nombre visible del componente (h1). */
  name: string;
  /** Ícono de la tarjeta del encabezado (biblioteca CAOS, nombre del manifest). */
  icon: IconName;
  /** Clasificación principal; la descripción debe decirla con palabras. */
  classification: DocClassification;
  /** Descripción grande del encabezado: qué es y su clasificación, en una o dos frases. */
  summary: string;
  /** Secciones de Definición, en orden. */
  definition: DocSectionContent[];
  /** Secciones de Aplicación, en orden. */
  application: DocSectionContent[];
}

/** Fila de la referencia de código (una prop). */
export interface DocPropRow {
  name: string;
  /** Tipo en TypeScript, como texto. */
  type?: string;
  /** Valor por defecto, como texto. */
  defaultValue?: string;
  required?: boolean;
  description?: string;
}

/** Ejemplo de código (de `<Nombre>.docs.json`). */
export interface DocCodeExample {
  title: string;
  code: string;
}

/** Datos de la pestaña Código. */
export interface DocCodeReference {
  /** Nombre que se importa del paquete (p. ej. "Tooltip"). */
  importName: string;
  /** Otros nombres exportados que se usan junto al principal (p. ej. "TooltipBubble"). */
  related?: string[];
  props: DocPropRow[];
  examples?: DocCodeExample[];
}
