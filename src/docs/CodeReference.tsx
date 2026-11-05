import { useState } from 'react';
import { DocCodeBlock } from './DocCodeBlock';
import { DocDevelopment } from './DocDevelopment';
import type { DocLive } from './DocDevelopment';
import { DocCard, DocSection } from './DocParts';
import { formatExample, packageNamesInCode } from './liveCode';
import type { DocCodeExample, DocCodeReference } from './types';

export { DocCodeBlock };

/** Nombre del paquete (package.json) para la línea de importación. */
const PACKAGE = 'caos-design-system';

/** Hooks de React que pueden aparecer en un ejemplo. */
const REACT_HOOKS = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useId', 'useReducer', 'useContext', 'useLayoutEffect'];

/** Línea `import … from 'react'` con los hooks que usa el código, o nada si no usa ninguno. */
function reactImport(code: string): string[] {
  const hooks = REACT_HOOKS.filter((hook) => new RegExp(`\\b${hook}\\s*[(<]`).test(code));
  return hooks.length > 0 ? [`import { ${hooks.join(', ')} } from 'react';`] : [];
}

/**
 * Cada ejemplo se copia y compila tal cual: lleva sus propias importaciones (lo del paquete que nombra y los hooks de
 * React que usa). Si el ejemplo ya trae `import`, se deja como está.
 */
function withImports(code: string, importName: string): string {
  const src = formatExample(code);
  if (/^\s*import\s/m.test(src)) return src;
  const names = [...new Set([importName, ...packageNamesInCode(src)])].filter((name) => src.includes(name));
  const lines = [...reactImport(src), ...(names.length > 0 ? [`import { ${names.join(', ')} } from '${PACKAGE}';`] : [])];
  return lines.length > 0 ? `${lines.join('\n')}\n\n${src}` : src;
}

/**
 * Pestaña Desarrollo: importación, lienzo con la historia principal, código generado de los args, tarjeta Personalizar
 * (controles) y tarjeta Props (tabla de solo lectura) (todo con componentes de CAOS, ver `DocDevelopment`) y ejemplos. Las props salen del ArgTypes de Storybook
 * (docgen del código) o de `<Nombre>.docs.json`. Sin `live` solo aparece la tabla.
 */
export function CodeReference({ importName, related = [], props, examples = [], live }: DocCodeReference & { live?: DocLive }) {
  const [liveCode, setLiveCode] = useState('');
  // Con lienzo, lo que usa el código generado (p. ej. `Toaster`, `NotificationBell`) y no los subcomponentes que no
  // aparecen en él; sin lienzo, los subcomponentes declarados
  const used = live && liveCode ? packageNamesInCode(liveCode) : related;
  const names = [...new Set([importName, ...used])].join(', ');
  return (
    <>
      <DocSection
        title={live ? 'Demostración en vivo' : 'Desarrollo'}
      >
        <DocCodeBlock label="Importación">
          {[...reactImport(liveCode), `import { ${names} } from '${PACKAGE}';`].join('\n')}
        </DocCodeBlock>
        <DocDevelopment importName={importName} props={props} live={live} onCodeChange={setLiveCode} />
      </DocSection>
      {examples.length > 0 && (
        <DocSection title="Ejemplos de uso" description="Fragmentos listos para copiar.">
          <div className="grid grid-cols-1 gap-ds-space-general-2xl desktop:grid-cols-2">
            {examples.map((example: DocCodeExample) => (
              <DocCard key={example.title} title={example.title}>
                <DocCodeBlock label={`Ejemplo: ${example.title}`}>{withImports(example.code, importName)}</DocCodeBlock>
              </DocCard>
            ))}
          </div>
        </DocSection>
      )}
    </>
  );
}
