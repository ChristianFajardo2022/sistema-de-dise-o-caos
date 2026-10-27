import { useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DocsContext, useOf } from '@storybook/addon-docs/blocks';
import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import { ComponentDoc } from './ComponentDoc';
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
 * contexto de docs. Aplica el tema al documento como el decorador de las historias (ThemeWrapper).
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

/** Página Docs: plantilla con el contenido del componente y la referencia de código (ArgTypes + docs.json). */
export function ComponentDocsPage({ doc, docsJson }: { doc: ComponentDocContent; docsJson?: DocsJson }) {
  const meta = useOf('meta', ['meta']);
  const argTypes = (meta.preparedMeta.argTypes ?? {}) as Record<string, ArgTypeLike>;
  const fromJson = docsJson ? codeFromDocsJson(docsJson) : undefined;
  const fromArgTypes = propsFromArgTypes(argTypes, docsJson);
  const code: DocCodeReference = {
    importName: fromJson?.importName ?? doc.name,
    related: fromJson?.related,
    props: fromArgTypes.length > 0 ? fromArgTypes : (fromJson?.props ?? []),
    examples: fromJson?.examples,
  };
  return (
    <>
      <ThemeSync />
      <ComponentDoc doc={doc} code={code} />
    </>
  );
}
