import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Formas.doc';

export type FormasTab = FoundationDocTab;

/**
 * Página "Formas" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía, Colores, Retículas y Contenedores y espacios. El contenido está en `Formas.doc.tsx`;
 * los valores, en `tokens.css`. `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Formas({ initialTab = 'definicion' }: { initialTab?: FormasTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
