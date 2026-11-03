import type { ReactNode } from 'react';
import type { IconName } from '../components/Icon/Icon.types';

/**
 * Esquema de contenido de la página de documentación de un componente (plantilla v2, `.qa/docs/plantilla-v2.md`).
 * Cada componente exporta un objeto `doc` de este tipo desde `<Nombre>.doc.tsx`; `ComponentDoc` lo dibuja.
 * La guía para redactarlo está en `.qa/docs/guia-contenido.md`.
 */

/** Clasificación del componente según su composición (diseño atómico). */
export type DocClassification = 'atomo' | 'molecula' | 'composicion';

/** Texto que admite marcado en línea: `<strong>`, `<code>`, `<em>`. Nada de bloques (párrafos, listas). */
export type DocInline = ReactNode;

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
 *
 * Contrato con el verificador (`scripts/docs/verificar-docs.mjs`); no cambia el aspecto:
 * - Cada lienzo lleva `data-doc-anatomy-canvas` y sus dos copias del componente, `data-doc-anatomy-view="marks"` (la de
 *   los marcadores) y `data-doc-anatomy-view="dims"` (la de las cotas), con `data-doc-anatomy-scale` (1 sin escalar).
 * - Cada marcador del lienzo lleva `data-doc-mark="<n>"`, `data-doc-mark-selector`, `data-doc-mark-index` y
 *   `data-doc-mark-side`: la parte se recupera con `querySelectorAll(selector)[index]` (índice negativo: desde el final)
 *   dentro de la vista `marks` del mismo lienzo. Su línea guía lleva `data-doc-mark-line="<n>"` y termina en el borde
 *   `side` de la parte.
 * - Cada cota lleva `data-doc-dim="padding|gap|height"` y `data-doc-dim-value="<px reales>"` (sin escala), además de
 *   `data-doc-dim-selector` / `-index` / `-side` (padding y height) o `data-doc-dim-from` / `-from-index` / `-to` / `-to-index` / `-axis` (gap),
 *   resueltos en la vista `dims`.
 * - Si dos marcadores del mismo lado se pisan, el segundo se corre a lo largo de ese lado sin salirse de su parte: la
 *   línea guía sigue siendo recta y cae sobre la parte.
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
  /**
   * Separación entre dos elementos. `axis: 'x'` (por defecto): horizontal, del borde derecho del primero al izquierdo
   * del segundo (violeta). `axis: 'y'`: vertical, del borde inferior del primero al superior del segundo (verde), para
   * piezas apiladas (filas, una burbuja sobre su disparador).
   */
  | { kind: 'gap'; from: string; fromIndex?: number; to: string; toIndex?: number; axis?: 'x' | 'y' }
  /** Alto de `selector`, con un corchete a la derecha. */
  | { kind: 'height'; selector: string; index?: number };

/**
 * Lienzo con puntos de la anatomía: etiqueta, componente real, marcadores y cotas. Sirve para cualquier forma:
 * - **Overlays abiertos** (Tooltip, Popover, Modal, menús): dibuja la forma estática abierta (`TooltipBubble`,
 *   `PopoverPanel`, `ModalPanel`, `DropdownMenuPanel`) en el flujo, junto a su disparador si hace falta. Lo que se abre en
 *   la capa superior (`popover`, `showModal()`) o con un portal queda fuera del lienzo y no se puede medir ni recortar.
 * - **Vistas más anchas que el lienzo**: se escalan para caber; marcadores y cotas se calculan sobre la vista escalada
 *   y las cifras dicen los px reales.
 * - **Varias instancias o compuestos** (Table, Tabs): `index` elige la instancia; los marcadores del mismo lado se
 *   separan solos si se pisan.
 * - **Ancho completo** (Header, Footer): `width` fija el ancho de la vista (`'fill'` o un número de px).
 * Las dos copias del componente son ilustraciones: van con `inert` (sin foco ni lector de pantalla; las pautas son la
 * fuente accesible).
 */
export interface DocAnatomyCanvas {
  /** Etiqueta sobre el lienzo (p. ej. "Botón con texto"). */
  label: string;
  /** Componente real. Varios hijos se colocan en fila (en columna con `width`). */
  preview: ReactNode;
  /**
   * Ancho de la vista. Sin él, el del contenido (se escala si no cabe). Un número: la vista se dibuja a ese ancho en px
   * (p. ej. 1440 para un Header de escritorio) y se escala para caber. `'fill'`: ocupa el ancho del lienzo. Con
   * `width`, los hijos se apilan y se estiran a lo ancho.
   */
  width?: number | 'fill';
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
  /**
   * Modo fijo: el componente fuerza ese modo (superficie unicolor, p. ej. `data-theme="dark"` en la burbuja de
   * Tooltip), así que el hex se lee siempre en él y no cambia con el interruptor. El chip lo dice y lleva
   * `data-doc-token-mode`.
   */
  mode?: 'dark' | 'light';
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
  /** "Cuándo usarlo" / "Cuándo evitarlo": dos Cards con muesca y distintivo de éxito / error. */
  | { type: 'usage'; use: DocInline[]; avoid: DocInline[] }
  /** Anatomía: tarjeta con lienzos de puntos (marcadores y cotas medidos del DOM) y pautas numeradas. */
  | { type: 'anatomy'; groups: DocAnatomyGroup[] }
  /**
   * Estados: tarjeta con una columna por estado (etiqueta con tono, descripción y muestras).
   *
   * Regla para componentes **no interactivos** (Badge, Logo, Divider, Spinner…): no tienen Hover, Focus ni Press, así
   * que la sección Estados muestra sus **variantes de aspecto**: una columna por tamaño, tono, tipo o contraste (las
   * props de apariencia de Figma), con tono `neutral` salvo que la variante sea semántica (éxito, error). La bajada lo
   * dice ("Badge no es interactivo: sus estados son variantes de aspecto"). Si el componente tiene además estados de
   * datos (vacío, cargando), van como columnas propias. Un componente interactivo documenta sus estados de interacción
   * (forzados con `state` cuando exista) y deja las variantes de aspecto para Anatomía o Tokens y modos.
   */
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
  /** Buenas y malas prácticas en pares (Hacer / Evitar), dos columnas. */
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
