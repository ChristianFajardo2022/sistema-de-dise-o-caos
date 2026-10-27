import { ScrollRegion } from '../foundations/_doc/ScrollRegion';
import { cn } from '../utils/cn';
import { DocCard, DocSection, DocTable } from './DocParts';
import type { DocCodeExample, DocCodeReference, DocPropRow } from './types';

/** Nombre del paquete (package.json) para la línea de importación. */
const PACKAGE = 'caos-design-system';

const code = 'font-mono text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-heading';

/** Bloque de código con scroll horizontal propio (enfocable solo si desborda). */
export function DocCodeBlock({ children, label }: { children: string; label: string }) {
  return (
    <ScrollRegion label={label} className={cn('rounded-ds-radius-general-lg border border-ds-border-general-default-on-canva bg-ds-background-container-surface')}>
      <pre className={cn('m-0 w-max min-w-full p-ds-space-general-2xl', code)}>
        <code>{children}</code>
      </pre>
    </ScrollRegion>
  );
}

function PropName({ row }: { row: DocPropRow }) {
  return (
    <>
      <code>{row.name}</code>
      {row.required && (
        <span className="text-ds-icon-semantic-error-firts">
          <span aria-hidden="true"> *</span>
          <span className="sr-only"> (obligatoria)</span>
        </span>
      )}
    </>
  );
}

/**
 * Pestaña Código: importación, tabla de props reales (nombre, tipo, valor por defecto, descripción) y ejemplos.
 * Las props salen del ArgTypes de Storybook (docgen del código) o de `<Nombre>.docs.json`.
 */
export function CodeReference({ importName, related = [], props, examples = [] }: DocCodeReference) {
  const names = [importName, ...related].join(', ');
  return (
    <>
      <DocSection
        title="Referencia de código"
        description={
          <>
            Props de <code>{importName}</code> tal como están en el código. Las de HTML nativas que no aparecen aquí (como{' '}
            <code>className</code> o <code>aria-*</code>) pasan al elemento raíz.
          </>
        }
      >
        <DocCodeBlock label="Importación">{`import { ${names} } from '${PACKAGE}';`}</DocCodeBlock>
        <DocTable
          caption={`Props de ${importName}`}
          columns={['Prop', 'Tipo', 'Por defecto', 'Descripción']}
          minWidth={720}
          rows={props.map((row) => [
            <PropName key="n" row={row} />,
            row.type ? <code key="t">{row.type}</code> : '—',
            row.defaultValue ? <code key="d">{row.defaultValue}</code> : '—',
            row.description ?? '',
          ])}
        />
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
