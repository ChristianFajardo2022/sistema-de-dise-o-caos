/**
 * Plantilla de documentación de componentes (solo Storybook; no se exporta del paquete).
 * - `ComponentDoc`: la página completa a partir de un `doc` (`<Nombre>.doc.tsx`).
 * - Piezas sueltas (`DocSection`, `DocCard`, `DocTable`…) para casos que el esquema no cubre (bloque `custom`).
 * - `componentDocsParameters` (en `./storybook`): une la página Docs de Storybook con la plantilla.
 */
export { ComponentDoc, DocBlockView } from './ComponentDoc';
export type { ComponentDocTab } from './ComponentDoc';
export { CodeReference, DocCodeBlock } from './CodeReference';
export { codeFromDocsJson, propsFromArgTypes } from './code';
export type { DocsJson, ArgTypeLike } from './code';
export {
  DocAnatomy,
  DocBullets,
  DocCallout,
  DocCard,
  DocContentCard,
  DocGallery,
  DocGrid,
  DocHeader,
  DocNumber,
  DocPracticeCard,
  DocPractices,
  DocPreview,
  DocSection,
  DocTable,
  DocTag,
  DocText,
  DocUsage,
} from './DocParts';
export { DocDecor } from './DocDecor';
export * from './types';
