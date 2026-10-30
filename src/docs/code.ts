import type { DocCodeExample, DocCodeReference, DocPropRow } from './types';

/** Forma de `<Nombre>.docs.json` que usa la referencia de código. */
export interface DocsJson {
  component: string;
  /** `default` admite el valor tal cual (los docs.json traen `false`, `0`…); se muestra como texto. */
  props?: Record<string, { type?: string; default?: string | number | boolean; required?: boolean; description?: string }>;
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
      defaultValue: p.default === undefined ? undefined : String(p.default),
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
      // El docgen resume las uniones con alias como "union" (o "unknown"): ahí sirve más el tipo escrito en docs.json
      const summary = a.table?.type?.summary;
      return {
        name: a.name ?? key,
        type: (summary && summary !== 'union' && summary !== 'unknown' ? summary : undefined) ?? fromJson?.type ?? summary ?? a.type?.name,
        defaultValue: a.table?.defaultValue?.summary ?? (fromJson?.default === undefined ? undefined : String(fromJson.default)),
        required: a.type?.required ?? fromJson?.required,
        // Sin el marcado de Markdown del JSDoc (negritas); los `código` se dejan tal cual
        description: (a.description || fromJson?.description)?.replace(/\*\*/g, ''),
      };
    });
}

/** ArgType que entiende Storybook (lo mínimo que completa la tabla de Controls). */
type ArgTypeOut = {
  description?: string;
  table?: { type?: { summary?: string }; defaultValue?: { summary?: string } };
  control?: false | string | { type: string };
  options?: string[];
  [key: string]: unknown;
};

/** Control que corresponde a un tipo escrito en `docs.json` (`boolean`, `string`, unión de literales). Sin control si no se puede inferir. */
function controlFromType(type: string): Pick<ArgTypeOut, 'control' | 'options'> {
  if (/ReactNode|=>/.test(type)) return { control: false };
  if (type === 'boolean') return { control: 'boolean' };
  if (type === 'string') return { control: 'text' };
  const literals = type.split('|').map((t) => t.trim());
  if (literals.length > 1 && literals.every((l) => /^'[^']*'$/.test(l))) {
    return { control: literals.length > 3 ? 'select' : 'radio', options: literals.map((l) => l.slice(1, -1)) };
  }
  return {};
}

/**
 * `argTypes` para el `meta` a partir de `<Nombre>.docs.json`: la tabla de Controls muestra la descripción, el tipo y el
 * valor por defecto de cada prop (lo que el docgen no trae en uniones con alias) y un control cuando el tipo lo permite
 * (si no, la fila sale igual, sin control). Lo que el `meta` ya declare (`explicit`) manda sobre lo inferido, salvo la
 * descripción: gana la de `docs.json`, que es la completa.
 */
export function argTypesFromDocsJson<T extends Record<string, object>>(json: DocsJson, explicit: T = {} as T): Record<string, ArgTypeOut> {
  const out: Record<string, ArgTypeOut> = {};
  for (const key of new Set([...Object.keys(json.props ?? {}), ...Object.keys(explicit)])) {
    const p = json.props?.[key];
    const own = (explicit[key] ?? {}) as ArgTypeOut;
    const inferred = p?.type && own.control === undefined ? controlFromType(p.type) : {};
    out[key] = {
      ...inferred,
      ...own,
      // Storybook lo interpreta como Markdown: `<texto>` o `<a>` se tomarían por etiquetas HTML
      description: (p?.description ?? own.description)?.replace(/<([^>\n]*)>/g, '`<$1>`'),
      table: {
        ...own.table,
        type: own.table?.type ?? (p?.type ? { summary: p.type } : undefined),
        defaultValue: own.table?.defaultValue ?? (p?.default !== undefined ? { summary: String(p.default) } : undefined),
      },
    };
  }
  return out;
}
