import { FoundationDoc } from '../_doc/FoundationDoc';
import type { FoundationDocTab } from '../_doc/foundationDoc.types';
import { doc } from './Iconografia.doc';

export type IconografiaTab = FoundationDocTab;

/**
 * Página "Iconografía" de Fundamentos de diseño, con la plantilla v2 (encabezado, pestañas y secciones de las páginas de
 * componentes), como Tipografía, Colores, Retículas, Contenedores y espacios, Formas y Texturas. El contenido está en
 * `Iconografia.doc.tsx`; los valores, en el componente `Icon` y en `tokens.css`. El catálogo buscable es la última
 * sección de Definición. `initialTab` abre la página en una pestaña (una historia por pestaña).
 */
export function Iconografia({ initialTab = 'definicion' }: { initialTab?: IconografiaTab }) {
  return <FoundationDoc doc={doc} initialTab={initialTab} />;
}
