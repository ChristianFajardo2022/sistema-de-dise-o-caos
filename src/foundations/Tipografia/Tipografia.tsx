import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Tipografia.doc';

export type TipografiaTab = FoundationDocTab;

/**
 * Página "Tipografía" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas
 * de componentes). El contenido está en `Tipografia.doc.tsx`; los valores, en `tokens.css`.
 * `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Tipografia({ initialTab = 'definicion' }: { initialTab?: TipografiaTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
