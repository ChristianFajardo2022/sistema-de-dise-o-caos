import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Reticulas.doc';

export type ReticulasTab = FoundationDocTab;

/**
 * Página "Retículas" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía y Colores. El contenido está en `Reticulas.doc.tsx`; los valores, en `tokens.css`.
 * `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Reticulas({ initialTab = 'definicion' }: { initialTab?: ReticulasTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
