import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './ContenedoresYEspacios.doc';

export type ContenedoresYEspaciosTab = FoundationDocTab;

/**
 * Página "Contenedores y espacios" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las
 * páginas de componentes), como Tipografía, Colores y Retículas. El contenido está en `ContenedoresYEspacios.doc.tsx`; los
 * valores, en `tokens.css`. `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function ContenedoresYEspacios({ initialTab = 'definicion' }: { initialTab?: ContenedoresYEspaciosTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
