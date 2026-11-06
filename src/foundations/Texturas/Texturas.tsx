import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Texturas.doc';

export type TexturasTab = FoundationDocTab;

/**
 * Página "Texturas" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía, Colores, Retículas, Contenedores y espacios y Formas. El contenido está en
 * `Texturas.doc.tsx`; los valores, en `tokens.css`. `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Texturas({ initialTab = 'definicion' }: { initialTab?: TexturasTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
