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
 * Conexión con la historia principal (la primera con `autodocs`): la historia para dibujarla, sus args al día (canal
 * `STORY_ARGS_UPDATED`) y cómo cambiarlos o restablecerlos (`UPDATE_STORY_ARGS` y `RESET_STORY_ARGS`).
 */
function useLiveStory(): DocLive | undefined {
  const context = useContext(DocsContext);
  const stories = context.componentStories();
  const story = stories.find((st) => st.tags.includes('autodocs')) ?? stories[0];
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
  return useMemo(
    () =>
      story
        ? {
            storyId,
            story: <Story of={story.moduleExport} />,
            args,
            argTypes: story.argTypes as Record<string, LiveArgType>,
            updateArgs,
            resetArgs,
          }
        : undefined,
    [story, storyId, args, updateArgs, resetArgs],
  );
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
    related: fromJson?.related,
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

/**
 * Marcado en línea de la bajada (`código`, **negrita**, *cursiva*, [enlace](url)). El `Markdown` de Storybook no sirve
 * aquí: sus piezas necesitan el tema de Storybook, que solo existe dentro de su contenedor.
 */
function inlineMarkdown(text: string): ReactNode[] {
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1] !== undefined) out.push(<code key={key}>{m[1]}</code>);
    else if (m[2] !== undefined) out.push(<strong key={key}>{m[2]}</strong>);
    else if (m[3] !== undefined) out.push(<em key={key}>{m[3]}</em>);
    else out.push(<a key={key} href={m[5]} className="text-ds-text-link-default underline">{m[4]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
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
