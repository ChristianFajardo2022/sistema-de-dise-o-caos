import { DocCodeBlock } from './DocCodeBlock';
import { DocDevelopment } from './DocDevelopment';
import type { DocLive } from './DocDevelopment';
import { DocCard, DocSection } from './DocParts';
import type { DocCodeExample, DocCodeReference } from './types';

export { DocCodeBlock };

/** Nombre del paquete (package.json) para la línea de importación. */
const PACKAGE = 'caos-design-system';

/**
 * Pestaña Desarrollo: importación, lienzo con la historia principal, código generado de los args, tarjeta Personalizar
 * (controles) y tarjeta Props (tabla de solo lectura) (todo con componentes de CAOS, ver `DocDevelopment`) y ejemplos. Las props salen del ArgTypes de Storybook
 * (docgen del código) o de `<Nombre>.docs.json`. Sin `live` solo aparece la tabla.
 */
export function CodeReference({ importName, related = [], props, examples = [], live }: DocCodeReference & { live?: DocLive }) {
  const names = [importName, ...related].join(', ');
  return (
    <>
      <DocSection
        title={live ? 'Demostración en vivo' : 'Desarrollo'}
      >
        <DocCodeBlock label="Importación">{`import { ${names} } from '${PACKAGE}';`}</DocCodeBlock>
        <DocDevelopment importName={importName} props={props} live={live} />
      </DocSection>
      {examples.length > 0 && (
        <DocSection title="Ejemplos de uso" description="Fragmentos listos para copiar.">
          <div className="grid grid-cols-1 gap-ds-space-general-2xl desktop:grid-cols-2">
            {examples.map((example: DocCodeExample) => (
              <DocCard key={example.title} title={example.title}>
                <DocCodeBlock label={`Ejemplo: ${example.title}`}>{example.code}</DocCodeBlock>
              </DocCard>
            ))}
          </div>
        </DocSection>
      )}
    </>
  );
}
