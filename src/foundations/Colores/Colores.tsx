import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Colores.doc';

export type ColoresTab = FoundationDocTab;

/**
 * Página "Colores" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía. El contenido está en `Colores.doc.tsx`; los valores, en `tokens.css`.
 * `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Colores({ initialTab = 'definicion' }: { initialTab?: ColoresTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
