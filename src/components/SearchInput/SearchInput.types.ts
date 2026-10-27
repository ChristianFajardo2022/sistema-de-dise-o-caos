import type { InputHTMLAttributes } from 'react';
import type { FieldRootProps } from '../Field/Field.types';

/**
 * State de Figma (set "Search input (Avance)"). Solo fuerza el aspecto en documentación: en uso real sale del foco,
 * `disabled`, `readOnly` y los mensajes.
 * - `active`: Active/Focus, con el panel de sugerencias abierto en el flujo.
 * - `burnt-in`: solo lectura.
 * - `success`: Confirmation. `helper`: Helper text (borde de información).
 */
export type SearchInputState = 'default' | 'filled' | 'active' | 'burnt-in' | 'disabled' | 'error' | 'success' | 'helper';

/** Sección del panel de sugerencias: palabras clave (lista), búsquedas recientes y populares (chips). */
export type SearchInputSection = 'keywords' | 'recent' | 'popular';

/** Sugerencia: el texto que se busca, o `{ value, label }` si lo que se ve es distinto de lo que se busca. */
export type SearchInputSuggestion = string | { value: string; label?: string };

/** Contenido del panel de sugerencias. Una sección vacía no se dibuja; sin ninguna, el panel no abre. */
export interface SearchInputSuggestions {
  /** Palabras clave (lista de texto, arriba). Filtrarlas según lo escrito es responsabilidad de quien usa el componente. */
  keywords?: SearchInputSuggestion[];
  /** "Búsquedas recientes": chips con lupa. */
  recent?: SearchInputSuggestion[];
  /** "Popular ahora": chips con etiqueta. */
  popular?: SearchInputSuggestion[];
}

/** Categoría del selector (el "Label ▾" de Figma). */
export interface SearchInputCategory {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Textos de la interfaz (nombres accesibles y títulos del panel). */
export interface SearchInputLabels {
  /** Nombre del botón de búsqueda. Por defecto "Buscar". */
  search: string;
  /** Nombre del selector de categoría y de su menú. Por defecto "Categoría". */
  category: string;
  /** Nombre de la lista de palabras clave. Por defecto "Sugerencias". */
  suggestions: string;
  /** Título de las búsquedas recientes. Por defecto "Búsquedas recientes". */
  recent: string;
  /** Título de las búsquedas populares. Por defecto "Popular ahora". */
  popular: string;
  /** Nombre del botón que borra las recientes. Por defecto "Borrar búsquedas recientes". */
  clearRecent: string;
  /** Nombre del botón que borra las populares. Por defecto "Borrar búsquedas populares". */
  clearPopular: string;
}

export interface SearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'prefix' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'role' | 'list'
  > {
  /** Nombre accesible del campo (obligatorio). Figma no dibuja label: va como texto solo para lectores de pantalla. */
  label: string;
  /** Prop Placeholder de Figma. No sustituye al `label`. */
  placeholder?: string;
  /** Texto buscado (controlado). */
  value?: string;
  /** Texto inicial (no controlado). */
  defaultValue?: string;
  /** Cambia el texto (al escribir, al elegir una sugerencia o al borrar con Esc). */
  onValueChange?: (value: string) => void;
  /** `onChange` nativo del `<input>`. */
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  /**
   * Se pide una búsqueda: Enter sin sugerencia activa, el botón de búsqueda o al elegir una sugerencia. Recibe el texto y
   * la categoría elegida (`undefined` sin categorías).
   */
  onSearch?: (query: string, category?: string) => void;
  /** Categorías del selector. Sin categorías no se dibujan el selector ni el separador. */
  categories?: SearchInputCategory[];
  /** Categoría elegida (controlado). */
  category?: string;
  /** Categoría inicial (no controlado). Por defecto la primera. */
  defaultCategory?: string;
  /** Cambia la categoría. */
  onCategoryChange?: (category: string) => void;
  /** Contenido del panel que se abre con el foco (Active/Focus de Figma). */
  suggestions?: SearchInputSuggestions;
  /** Se elige una sugerencia (clic o Enter). Después se llama `onSearch` con ese texto. */
  onSuggestionSelect?: (value: string, section: SearchInputSection) => void;
  /** Borra las búsquedas recientes. Con ella se dibuja el botón de papelera de esa sección. */
  onClearRecent?: () => void;
  /** Borra las búsquedas populares. Con ella se dibuja el botón de papelera de esa sección. */
  onClearPopular?: () => void;
  /** Textos de la interfaz (ver `SearchInputLabels`). */
  labels?: Partial<SearchInputLabels>;
  /** Panel de sugerencias abierto (controlado). Sin sugerencias, deshabilitado o de solo lectura no abre. */
  open?: boolean;
  /** Panel abierto al montar (no controlado). */
  defaultOpen?: boolean;
  /** Cambia al abrir o cerrar el panel. */
  onOpenChange?: (open: boolean) => void;
  /** Mensaje de ayuda debajo (borde de información, State=Helper text). */
  helperText?: string;
  /** Mensaje de error (tiene prioridad sobre éxito y ayuda). Marca `aria-invalid`. */
  errorText?: string;
  /** Mensaje de éxito (State=Confirmation). */
  successText?: string;
  /** Fuerza el aspecto de un estado (solo documentación). */
  state?: SearchInputState;
  /** Atributos para la raíz (`data-*`, `style`, `ref`…). El `ref` del componente y los atributos nativos van al `<input>`. */
  rootProps?: FieldRootProps;
}
