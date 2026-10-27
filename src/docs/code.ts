import type { DocCodeExample, DocCodeReference, DocPropRow } from './types';

/** Forma de `<Nombre>.docs.json` que usa la referencia de código. */
export interface DocsJson {
  component: string;
  props?: Record<string, { type?: string; default?: string; required?: boolean; description?: string }>;
  subcomponents?: Record<string, string>;
  examples?: DocCodeExample[];
}

/** Referencia de código a partir de `<Nombre>.docs.json`. */
export function codeFromDocsJson(json: DocsJson): DocCodeReference {
  return {
    importName: json.component,
    related: Object.keys(json.subcomponents ?? {}),
    props: Object.entries(json.props ?? {}).map(([name, p]) => ({
      name,
      type: p.type,
      defaultValue: p.default,
      required: p.required,
      description: p.description,
    })),
    examples: json.examples,
  };
}

/** Lo que usa la plantilla de un ArgType de Storybook (docgen del código + `argTypes` de la historia). */
export interface ArgTypeLike {
  name?: string;
  description?: string;
  type?: { required?: boolean; name?: string };
  table?: { disable?: boolean; type?: { summary?: string }; defaultValue?: { summary?: string } };
}

/**
 * Props reales a partir del ArgTypes de Storybook (sale del docgen de los tipos del componente). El tipo y la
 * obligatoriedad vienen del código; la descripción y el valor por defecto que falten se completan con `docs.json`.
 * Se omiten los argTypes ocultos (`table.disable`).
 */
export function propsFromArgTypes(argTypes: Record<string, ArgTypeLike>, json?: DocsJson): DocPropRow[] {
  return Object.entries(argTypes)
    .filter(([, a]) => !a.table?.disable)
    .map(([key, a]) => {
      const fromJson = json?.props?.[key];
      // El docgen resume las uniones con alias como "union": ahí sirve más el tipo escrito en docs.json
      const summary = a.table?.type?.summary;
      return {
        name: a.name ?? key,
        type: (summary && summary !== 'union' ? summary : undefined) ?? fromJson?.type ?? summary ?? a.type?.name,
        defaultValue: a.table?.defaultValue?.summary ?? fromJson?.default,
        required: a.type?.required ?? fromJson?.required,
        // Sin el marcado de Markdown del JSDoc (negritas); los `código` se dejan tal cual
        description: (a.description || fromJson?.description)?.replace(/\*\*/g, ''),
      };
    });
}
