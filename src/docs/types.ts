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

/** Sección numerada (insignia 01, 02…). El número lo pone la plantilla según el orden. */
export interface DocSectionContent {
  /** Título de la sección (p. ej. "Propósito y anatomía"). */
  title: string;
  /** Bajada: una o dos frases bajo el título. */
  description: DocInline;
  /** Contenido. */
  blocks: DocBlock[];
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
  /** Secciones de la pestaña Definición, en orden. */
  definition: DocSectionContent[];
  /** Secciones de la pestaña Aplicación, en orden. Siguen la numeración de Definición. */
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
