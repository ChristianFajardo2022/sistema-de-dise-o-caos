import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './VozYTono.doc';

export type VozYTonoTab = FoundationDocTab;

/**
 * Página "Voz y tono" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía, Colores, Retículas, Contenedores y espacios, Formas y Texturas. El contenido está en
 * `VozYTono.doc.tsx`; el texto de la guía, en `vozYTono.content.ts`. `initialTab` abre la página en una pestaña (una
 * historia por pestaña).
 */
export function VozYTono({ initialTab = 'definicion' }: { initialTab?: VozYTonoTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
