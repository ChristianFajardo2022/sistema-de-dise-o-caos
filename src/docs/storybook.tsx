import type { DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { ReactNode } from 'react';
import { ComponentDocsContainer, ComponentDocsPage, ProbeDocsContainer, ProbeDocsPage } from './StorybookDocsPage';
import type { DocsJsonLoaders } from './StorybookDocsPage';
import type { DocsJson } from './code';
import type { ComponentDocContent } from './types';

/*
 * Conexión de la plantilla con Storybook: la página Docs de un componente (la de `tags: ['autodocs']`) se reemplaza
 * por `ComponentDoc`. Uso en `<Nombre>.stories.tsx`:
 *
 *   import { componentDocsParameters } from '../../docs/storybook';
 *   import { doc } from './Tooltip.doc';
 *   import docsJson from './Tooltip.docs.json';
 *   const meta = { …, parameters: { docs: componentDocsParameters(doc, docsJson) } };
 */

/**
 * Parámetros `docs` para que la página Docs del componente use la plantilla. `docsJson` aporta los ejemplos de código
 * y completa descripciones y valores por defecto que el docgen no trae.
 */
export function componentDocsParameters(doc: ComponentDocContent, docsJson?: DocsJson) {
  return {
    container: ComponentDocsContainer,
    page: () => <ComponentDocsPage doc={doc} docsJson={docsJson} />,
  };
}

/**
 * Parámetros `docs` globales del modo sondeo (`STORYBOOK_DOCS_PROBE=1`, ver `.storybook/preview.tsx`): la página Docs
 * de cada componente con `docs.json` y sin plantilla propia usa la plantilla v2 con la pestaña Desarrollo funcionando
 * (Definición y Aplicación vacías), para revisar Desarrollo antes de escribir el `<Nombre>.doc.tsx`. Los componentes
 * sin `docs.json` siguen con la página automática; los que ya usan `componentDocsParameters` no cambian (su `meta`
 * manda sobre los parámetros globales). `loaders`: `import.meta.glob('…/*.docs.json')` sin `eager`.
 */
export function probeDocsParameters(loaders: DocsJsonLoaders) {
  return {
    container: (props: DocsContainerProps & { children?: ReactNode }) => <ProbeDocsContainer {...props} loaders={loaders} />,
    page: () => <ProbeDocsPage loaders={loaders} />,
  };
}
