import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Elevaciones.doc';

export type ElevacionesTab = FoundationDocTab;

/**
 * Página "Elevaciones" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía, Colores, Retículas, Contenedores y espacios, Formas y Texturas. El contenido está en
 * `Elevaciones.doc.tsx`; los valores, en `tokens.css`. `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Elevaciones({ initialTab = 'definicion' }: { initialTab?: ElevacionesTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
