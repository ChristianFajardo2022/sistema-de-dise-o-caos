import { ComponentDocsContainer, ComponentDocsPage } from './StorybookDocsPage';
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
