import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Controls, DocsContainer, DocsContext, Markdown, Primary, Stories, Story, Subtitle, useOf } from '@storybook/addon-docs/blocks';
import { RESET_STORY_ARGS, STORY_ARGS_UPDATED, UPDATE_STORY_ARGS } from 'storybook/internal/core-events';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { IconName } from '../components/Icon/Icon.types';
import { ComponentDoc } from './ComponentDoc';
import type { DocLive } from './DocDevelopment';
import type { LiveArgType } from './liveCode';
import { DocHeader } from './DocParts';
import { inlineMarkdown } from './inlineMarkdown';
import { codeFromDocsJson, propsFromArgTypes } from './code';
import type { ArgTypeLike, DocsJson } from './code';
import type { ComponentDocContent, DocCodeReference } from './types';

/*
 * Página y contenedor de docs de Storybook para la plantilla (los usa `componentDocsParameters` de ./storybook).
 * Conexión de la plantilla con Storybook: la página Docs de un componente (la de `tags: ['autodocs']`) se reemplaza
 * por `ComponentDoc`. Uso en `<Nombre>.stories.tsx`:
 *
 *   import { componentDocsParameters } from '../../docs/storybook';
 *   import { doc } from './Tooltip.doc';
 *   import docsJson from './Tooltip.docs.json';
 *   const meta = { …, parameters: { docs: componentDocsParameters(doc, docsJson) } };
 */

const BG = { dark: 'var(--color-ds-primitives-color-primary-n01)', light: 'var(--color-ds-primitives-color-primary-g01)' };

/** Tema de la barra de Storybook (global `theme`), leído del contexto de docs. */
function useDocsTheme(): 'dark' | 'light' {
  const context = useContext(DocsContext);
  const story = context.componentStories()[0];
  const globals = story ? context.getStoryContext(story).globals : undefined;
  return globals?.['theme'] === 'light' ? 'light' : 'dark';
}

/**
 * Contenedor de docs sin el envoltorio de Storybook (que limita el ancho a 1000 px y aplica su tipografía): solo el
 * contexto de docs, que es lo que necesitan `useOf` y el bloque `Story`. Ninguna interfaz de Storybook queda a la vista.
 */
export function ComponentDocsContainer({ context, children }: DocsContainerProps & { children?: ReactNode }) {
  return <DocsContext.Provider value={context}>{children}</DocsContext.Provider>;
}

function ThemeSync() {
  const theme = useDocsTheme();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = BG[theme];
  }, [theme]);
  return null;
}

/**
 * `parameters.docsLive`: lo que la sección Desarrollo necesita saber de un componente. Va en el `meta` (vale para todas
 * sus historias) o en la historia que alimenta el lienzo. Recetas por caso en `.qa/docs/fase1/desarrollo-recetas.md`.
 */
export interface DocsLiveParameters {
  /**
   * Transforma los args de los controles en los que usa el `render` de la historia, para que el código generado
   * coincida con lo que se ve en el lienzo (p. ej. Button: `leftIcon: true` → `<AddIcon />`). Las claves que agrega
   * salen en el código aunque no sean props de la tabla (p. ej. `aria-label`).
   */
  args?: (args: Record<string, unknown>) => Record<string, unknown>;
  /**
   * Historia que alimenta el lienzo, por su nombre de exportación (`'Interactive'`) o su nombre visible. Solo en el
   * `meta`. Por defecto, la primera con `autodocs` (o la primera). Útil cuando la primera es una matriz que no lee args.
   */
  story?: string;
  /**
   * Dibujo propio del lienzo con los args actuales, en lugar de la historia. Para lo que la historia no puede mostrar
   * dentro del lienzo: overlays que se abren en el top layer o en un portal (Modal → `ModalPanel`, la superficie sin
   * diálogo) y componentes imperativos (Toast → el aviso suelto). No pasa por los decoradores de Storybook; puede usar
   * hooks (se llama dentro de un componente). "Abrir en una pestaña nueva" sigue abriendo la historia.
   */
  render?: (args: Record<string, unknown>) => ReactNode;
  /**
   * Código propio en lugar del JSX generado. Recibe los args que cambian el código (sin valores por defecto ni
   * funciones; ya pasados por `args`). Para componentes que se usan de forma imperativa (Toast: `add({ … })` con
   * `useToastQueue`); `formatLiteral` de `docs/liveCode` escribe un objeto como en el código.
   */
  code?: (args: Record<string, unknown>) => string;
  /**
   * Props sin control en Personalizar (siguen en la tabla Props): las que la historia maneja por su cuenta (un `open`
   * controlado por el estado del `render`) o que con un valor libre rompen el componente (`locale`).
   */
  exclude?: string[];
}

/**
 * Lienzo con `docsLive.render`: un componente propio para que la función pueda usar hooks. Centrado como la historia
 * (que lo hace con el envoltorio del decorador de tema); a todo el ancho si el contenido lo pide (`w-full`).
 */
function LiveRender({ render, args }: { render: (args: Record<string, unknown>) => ReactNode; args: Record<string, unknown> }) {
  return <div className="flex justify-center-safe">{render(args)}</div>;
}

/** Id de historia a partir de un nombre (como `sanitize` de Storybook): `FigmaMatrix` → `figmamatrix`. */
const storyIdPart = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Historia que alimenta el lienzo: la que pide `parameters.docsLive.story` o la primera con `autodocs` (o la primera). */
function pickLiveStory<S extends { id: string; name: string; tags: string[]; parameters: Record<string, unknown> }>(stories: S[]): S | undefined {
  const wanted = (stories[0]?.parameters as { docsLive?: DocsLiveParameters } | undefined)?.docsLive?.story;
  const chosen = wanted ? stories.find((st) => st.name === wanted || st.id.split('--')[1] === storyIdPart(wanted)) : undefined;
  return chosen ?? stories.find((st) => st.tags.includes('autodocs')) ?? stories[0];
}

/**
 * Conexión con la historia principal (`pickLiveStory`): la historia para dibujarla, sus args al día (canal
 * `STORY_ARGS_UPDATED`) y cómo cambiarlos o restablecerlos (`UPDATE_STORY_ARGS` y `RESET_STORY_ARGS`).
 */
function useLiveStory(): DocLive | undefined {
  const context = useContext(DocsContext);
  const stories = context.componentStories();
  const story = pickLiveStory(stories);
  const storyId = story?.id ?? '';
  const [args, setArgs] = useState<Record<string, unknown>>(() => (story ? context.getStoryContext(story).args : {}));
  useEffect(() => {
    const onUpdated = (changed: { storyId: string; args: Record<string, unknown> }) => {
      if (changed.storyId === storyId) setArgs(changed.args);
    };
    context.channel.on(STORY_ARGS_UPDATED, onUpdated);
    return () => context.channel.off(STORY_ARGS_UPDATED, onUpdated);
  }, [context.channel, storyId]);
  const updateArgs = useCallback(
    (updatedArgs: Record<string, unknown>) => context.channel.emit(UPDATE_STORY_ARGS, { storyId, updatedArgs }),
    [context.channel, storyId],
  );
  const resetArgs = useCallback(() => context.channel.emit(RESET_STORY_ARGS, { storyId }), [context.channel, storyId]);
  return useMemo(() => {
    if (!story) return undefined;
    const params = (story.parameters as { docsLive?: DocsLiveParameters }).docsLive;
    return {
      storyId,
      story: params?.render ? <LiveRender render={params.render} args={args} /> : <Story of={story.moduleExport} />,
      args,
      renderedArgs: params?.args?.(args),
      code: params?.code,
      initialArgs: story.initialArgs,
      exclude: params?.exclude,
      argTypes: story.argTypes as Record<string, LiveArgType>,
      updateArgs,
      resetArgs,
    };
  }, [story, storyId, args, updateArgs, resetArgs]);
}

/** Página Docs: plantilla con el contenido del componente y la referencia de código (ArgTypes + docs.json). */
export function ComponentDocsPage({ doc, docsJson }: { doc: ComponentDocContent; docsJson?: DocsJson }) {
  const meta = useOf('meta', ['meta']);
  const argTypes = (meta.preparedMeta.argTypes ?? {}) as Record<string, ArgTypeLike>;
  const fromJson = docsJson ? codeFromDocsJson(docsJson) : undefined;
  const fromArgTypes = propsFromArgTypes(argTypes, docsJson);
  const live = useLiveStory();
  const code: DocCodeReference = {
    importName: fromJson?.importName ?? doc.name,
    // Los subcomponentes del `meta` (`subcomponents`) también van en la línea de importación
    related: [...new Set([...(fromJson?.related ?? []), ...Object.keys((meta.preparedMeta as { subcomponents?: object }).subcomponents ?? {})])],
    props: fromArgTypes.length > 0 ? fromArgTypes : (fromJson?.props ?? []),
    examples: fromJson?.examples,
  };
  return (
    <>
      <ThemeSync />
      <ComponentDoc doc={doc} code={code} live={live} />
    </>
  );
}

// ───────────────────────── páginas automáticas (autodocs) ─────────────────────────

/** Ícono del encabezado cuando la historia no pide otro con `parameters.docsHeader.icon`. */
const DEFAULT_HEADER_ICON: IconName = 'grid';

interface MetaDocsParameters {
  docs?: {
    description?: { component?: string };
    extractComponentDescription?: (component: unknown, ctx: { component: unknown; parameters: unknown }) => string | null;
  };
  docsHeader?: { icon?: IconName };
}

/** Bloque de markdown que no es un párrafo (lista, título, código): no sirve como bajada del encabezado. */
const NOT_A_PARAGRAPH = /^\s*(?:[-*+]\s|\d+[.)]\s|#|```|>|\|)/;

/**
 * Nombre, ícono y descripción del componente para el encabezado. La descripción es la misma que mostraba Storybook
 * (docs.description.component o el JSDoc del componente): su primer párrafo va en el encabezado y el resto debajo.
 */
function useAutoDocsHeader() {
  const meta = useOf('meta', ['meta']);
  const { title, component, parameters } = meta.preparedMeta as unknown as {
    title: string;
    component?: unknown;
    parameters: MetaDocsParameters;
  };
  const description =
    parameters.docs?.description?.component ??
    parameters.docs?.extractComponentDescription?.(component, { component, parameters }) ??
    '';
  const [first = '', ...others] = description.trim().split(/\n\s*\n/);
  const summary = NOT_A_PARAGRAPH.test(first) ? '' : first;
  return {
    name: title.split('/').at(-1) ?? title,
    icon: parameters.docsHeader?.icon ?? DEFAULT_HEADER_ICON,
    summary,
    rest: (summary ? others : [first, ...others]).join('\n\n'),
  };
}

function AutoDocsHeader() {
  const { name, icon, summary } = useAutoDocsHeader();
  return <DocHeader icon={icon} name={name} summary={summary ? <p className="m-0">{inlineMarkdown(summary)}</p> : null} />;
}

/**
 * Contenedor de las páginas Docs automáticas: el encabezado de CAOS ("Header document (Atom)") a todo el ancho, arriba,
 * y debajo el contenedor normal de Storybook con los bloques. El encabezado queda fuera del contenedor para no heredar
 * su ancho de 1000 px ni su tipografía.
 */
export function AutoDocsContainer({ context, theme, children }: DocsContainerProps & { children?: ReactNode }) {
  return (
    <>
      <DocsContext.Provider value={context}>
        <ThemeSync />
        <div className="sb-unstyled">
          <AutoDocsHeader />
        </div>
      </DocsContext.Provider>
      <DocsContainer context={context} theme={theme}>
        {children}
      </DocsContainer>
    </>
  );
}

/** Página Docs automática: la de Storybook (Primary, Controls, Stories) sin título ni descripción, que van arriba. */
export function AutoDocsPage() {
  const { rest } = useAutoDocsHeader();
  return (
    <>
      <Subtitle />
      {rest && <Markdown>{rest}</Markdown>}
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}

// ───────────────────────── modo sondeo ─────────────────────────

/**
 * Cargadores de los `<Nombre>.docs.json`, por ruta (un `import.meta.glob` sin `eager` hecho en `.storybook/preview.tsx`,
 * así las claves dicen cuáles existen sin cargarlos).
 */
export type DocsJsonLoaders = Record<string, () => Promise<unknown>>;

/** Ruta sin `./` ni `../` del principio, para comparar la del archivo de historias con las del glob. */
const fromRoot = (path: string) => path.replace(/^(?:\.\.?\/)+/, '');

/**
 * `docs.json` del componente de la página: el que está junto al archivo de historias con su mismo nombre
 * (`Modal/Modal.stories.tsx` → `Modal/Modal.docs.json`). `undefined` si no hay.
 */
function docsJsonKey(context: DocsContextLike, loaders: DocsJsonLoaders): string | undefined {
  const fileName = context.componentStories()[0]?.parameters['fileName'];
  if (typeof fileName !== 'string') return undefined;
  const wanted = fromRoot(fileName).replace(/\.stories\.[jt]sx?$/, '.docs.json');
  return Object.keys(loaders).find((key) => fromRoot(key) === wanted);
}

type DocsContextLike = { componentStories: () => { parameters: Record<string, unknown> }[] };

/**
 * Modo sondeo (`STORYBOOK_DOCS_PROBE=1`, ver `probeDocsParameters` en ./storybook): contenedor de la plantilla si el
 * componente tiene `docs.json`; si no, el de la página automática.
 */
export function ProbeDocsContainer({ loaders, ...props }: DocsContainerProps & { children?: ReactNode; loaders: DocsJsonLoaders }) {
  return docsJsonKey(props.context, loaders) ? <ComponentDocsContainer {...props} /> : <AutoDocsContainer {...props} />;
}

/**
 * Página del modo sondeo: plantilla v2 con el encabezado de la página automática (nombre, ícono y descripción) y la
 * pestaña Desarrollo funcionando; Definición y Aplicación quedan vacías. Sin `docs.json`, la página automática.
 */
export function ProbeDocsPage({ loaders }: { loaders: DocsJsonLoaders }) {
  const context = useContext(DocsContext);
  const key = docsJsonKey(context, loaders);
  const header = useAutoDocsHeader();
  const [loaded, setLoaded] = useState<{ key: string; json: DocsJson } | null>(null);
  useEffect(() => {
    if (!key) return undefined;
    let alive = true;
    void loaders[key]().then((mod) => {
      if (alive) setLoaded({ key, json: ((mod as { default?: DocsJson }).default ?? mod) as DocsJson });
    });
    return () => {
      alive = false;
    };
  }, [key, loaders]);
  if (!key) return <AutoDocsPage />;
  if (loaded?.key !== key) return null;
  const doc: ComponentDocContent = {
    name: header.name,
    icon: header.icon,
    classification: 'atomo',
    summary: header.summary,
    definition: [],
    application: [],
  };
  return <ComponentDocsPage doc={doc} docsJson={loaded.json} />;
}
