import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon/Icon.types';
import { Toast, Toaster } from '../../components/Toast';
import { NotchedSurface } from '../../components/_internal/NotchedSurface';
import { DocBlockView } from '../../docs/ComponentDoc';
import { docBody, docInline } from '../../docs/docShared';
import type { DocInline, DocTone } from '../../docs/types';
import { cn } from '../../utils/cn';
import { ScrollRegion } from './ScrollRegion';
import type { DocCodeSample, DocTableColumn, DocTextCard, FoundationBlock } from './foundationDoc.types';

/*
 * Bloques de texto de la plantilla v2 para los fundamentos (piloto: Tipografía, documentación de Figma 23455:55864):
 * tabla, tarjetas de texto, nota y código. Mismo estilo que las piezas de `src/docs/` (Card simple, panel "Ejemplo",
 * cuerpo 14/20). Todo sale de tokens.
 *
 * Están escritos para mudarse a `src/docs/` (los cuatro casos se suman a `DocBlockView`); hasta entonces
 * `FoundationBlockView` dibuja los bloques nuevos y delega el resto en `DocBlockView`.
 */

// ───────────────────────── base ─────────────────────────

/** Título de tarjeta (Text card H2 = Heading-md-600): Prospero semibold 20/24. */
const cardTitle =
  'm-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading text-balance';

/** Subtítulo dentro de una tarjeta (Subheading-sm-600): Prospero semibold 16/20. */
const subTitle =
  'm-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading';

/** Párrafos con el cuerpo de la plantilla (14/20, `text/neutral/body`). */
function Paragraphs({ children }: { children: DocInline | DocInline[] }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <div className="flex flex-col gap-ds-space-general-2xl">
      {items.map((p, i) => (
        <p key={i} className={docBody}>
          {p}
        </p>
      ))}
    </div>
  );
}

// Figma: "Tarjeta" = Card/Type=Simple, Contrast=On canva (22124:13138)
/**
 * Card simple sobre el lienzo: superficie `NotchedSurface` sin muesca (radio 24, sombra on-canva), relleno
 * `default-on-canva`, padding `space/container/on-canva-stretch` (32 en escritorio) y 24 entre piezas.
 */
export function DocSimpleCard({ children, className, ...rest }: { children: ReactNode; className?: string; role?: string; 'aria-labelledby'?: string }) {
  return (
    <div {...rest} className={cn('relative isolate flex min-w-0 flex-col gap-ds-space-general-3xl p-ds-space-container-on-canva-stretch', className)}>
      <NotchedSurface shadow="on-canva" fill="var(--color-ds-background-container-default-on-canva)" />
      {children}
    </div>
  );
}

// Figma: "Ejemplo" (panel dentro de la tarjeta)
/** Panel "Ejemplo": `background/container/default-on-card`, radio `radius/container/on-card` (24) y padding 24. */
export function DocExamplePanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-ds-space-general-2xl rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card p-ds-space-container-on-card', className)}>
      {children}
    </div>
  );
}

// ───────────────────────── tabla ─────────────────────────

const cellText =
  'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-typography-body-line-height-short-md font-ds-primitives-typography-weight-regular text-left align-top text-pretty';
/** 16 de padding y 16 entre celdas (8 a cada lado); radio 16 en los extremos de la fila. */
const cellBox =
  'py-ds-space-general-2xl px-ds-space-general-lg first:pl-ds-space-general-2xl last:pr-ds-space-general-2xl first:rounded-l-ds-radius-general-xl last:rounded-r-ds-radius-general-xl';

// Figma: Table / Table/Header / Row/Body-MD (23455:56033)
/**
 * Tabla de documentación: cabecera `background/container/default-on-card` y filas `background/table/default`, separadas
 * 8 (`border-spacing`), con radio 16 y padding 16; celdas 14/18 (Body/Short text sm) que admiten varias líneas. La
 * primera celda de cada fila es su encabezado (`th scope="row"`) en `text/acent/firts`. Los anchos de columna son
 * proporcionales (`width`); si la tabla no cabe en `minWidth`, hace scroll horizontal propio.
 */
export function DocDataTable({ caption, columns, rows, minWidth = 560 }: { caption: string; columns: (string | DocTableColumn)[]; rows: DocInline[][]; minWidth?: number }) {
  const cols = columns.map((c) => (typeof c === 'string' ? { header: c } : c));
  const weighted = cols.reduce((sum, c) => sum + (c.width ?? 0), 0);
  const free = cols.filter((c) => c.width === undefined).length;
  // Con pesos, cada columna ocupa su parte; las que no tienen peso se reparten el promedio
  const share = (c: DocTableColumn) => (weighted > 0 ? (c.width ?? weighted / Math.max(1, cols.length - free)) : 1);
  const total = cols.reduce((sum, c) => sum + share(c), 0);
  return (
    // El margen negativo quita el espacio entre filas por fuera de la cabecera y de la última fila
    <ScrollRegion label={caption} className="-my-ds-space-general-lg">
      <table
        className={cn('w-full table-fixed border-separate border-spacing-x-0 border-spacing-y-ds-space-general-lg', docInline)}
        style={{ minWidth }}
      >
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          {cols.map((c) => (
            <col key={c.header} style={{ width: `${(share(c) / total) * 100}%` }} />
          ))}
        </colgroup>
        {/*
          La fila de encabezados va en el mismo `tbody` que las demás: Chrome suma el `border-spacing` entre grupos de filas
          (con `thead` quedaban 16 entre la cabecera y la primera fila; Figma pide 8). Los `th scope="col"` la anuncian igual.
        */}
        <tbody>
          <tr>
            {cols.map((c) => (
              <th key={c.header} scope="col" className={cn(cellText, cellBox, 'bg-ds-background-container-default-on-card text-ds-text-neutral-body')}>
                {c.header}
              </th>
            ))}
          </tr>
          {rows.map((cells, r) => (
            <tr key={r}>
              {cells.map((content, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className={cn(cellText, cellBox, 'bg-ds-background-table-default text-ds-text-acent-firts [overflow-wrap:anywhere]')}>
                    {content}
                  </th>
                ) : (
                  <td key={c} className={cn(cellText, cellBox, 'bg-ds-background-table-default text-ds-text-neutral-body')}>
                    {content}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}

// ───────────────────────── código ─────────────────────────

/** Copia al portapapeles (con respaldo para contextos sin permiso), como "Copiar código" de Desarrollo. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

/**
 * Código en el panel "Ejemplo": monoespaciado 14/20 en `text/neutral/heading`, con scroll horizontal propio si no cabe,
 * y debajo el botón "Copiar código" (`Button` terciario xs, el mismo de Desarrollo) con su aviso en un `Toast`.
 * Figma lo dibuja en la fuente primaria; aquí va en la monoespaciada del sistema operativo (`font-mono`), más legible.
 */
export function DocCodePanel({ label, code }: DocCodeSample) {
  const [notice, setNotice] = useState<{ ok: boolean; n: number } | null>(null);
  return (
    <DocExamplePanel>
      <ScrollRegion label={label}>
        <pre className="m-0 w-max min-w-full font-mono text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-heading">
          <code>{code}</code>
        </pre>
      </ScrollRegion>
      <div className="flex">
        <Button
          variant="tertiary"
          size="xs"
          iconSize={14}
          leftIcon={<Icon name="document-copy" variant="fill" />}
          aria-label={`Copiar código: ${label}`}
          onClick={async () => setNotice({ ok: await copyText(code), n: Date.now() })}
        >
          Copiar código
        </Button>
      </div>
      {notice && (
        <Toaster label="Avisos">
          <Toast
            key={notice.n}
            type={notice.ok ? 'success' : 'error'}
            title={notice.ok ? 'Código copiado' : 'No se pudo copiar'}
            description={notice.ok ? 'Ya está en el portapapeles.' : 'Selecciónalo y cópialo a mano.'}
            duration={2500}
            onClose={() => setNotice(null)}
          />
        </Toaster>
      )}
    </DocExamplePanel>
  );
}

// ───────────────────────── tarjetas de texto ─────────────────────────

/** Una tarjeta de texto: título, cifra, párrafos, pasos, columnas, muestra, código y pie, en ese orden. */
export function DocTextCardView({ title, figure, content, steps, columns, preview, code, footer }: DocTextCard) {
  return (
    <DocSimpleCard>
      {title && <h3 className={cardTitle}>{title}</h3>}
      {figure && (
        <p className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-3xl leading-ds-typography-heading-line-height-3xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading tabular-nums">
          {figure}
        </p>
      )}
      {content !== undefined && <Paragraphs>{content}</Paragraphs>}
      {steps && (
        // `role="list"`: con `list-none` Safari deja de anunciar la lista
        <ol role="list" className="m-0 flex list-none flex-col gap-ds-space-general-3xl p-0">
          {steps.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-ds-space-general-lg">
              <h4 className="m-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-lg leading-ds-primitives-typography-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
                <span aria-hidden="true" className="tabular-nums">
                  {i + 1}.{' '}
                </span>
                {step.title}
              </h4>
              <p className={docBody}>{step.content}</p>
            </li>
          ))}
        </ol>
      )}
      {columns && (
        <div className={cn('grid grid-cols-1 gap-ds-space-general-3xl', columns.length === 2 && '@2xl:grid-cols-2', columns.length >= 3 && '@3xl:grid-cols-3')}>
          {columns.map((column) => (
            <div key={column.title} className="flex min-w-0 flex-col gap-ds-space-general-xl">
              <h4 className={subTitle}>{column.title}</h4>
              <p className={docBody}>{column.content}</p>
            </div>
          ))}
        </div>
      )}
      {preview}
      {code && <DocCodePanel {...code} />}
      {footer !== undefined && <Paragraphs>{footer}</Paragraphs>}
    </DocSimpleCard>
  );
}

/** Fila de tarjetas de texto: 1, 2 o 3 columnas (24 entre tarjetas), una en secciones angostas. */
export function DocTextCards({ columns = 1, items }: { columns?: 1 | 2 | 3; items: DocTextCard[] }) {
  return (
    <div className={cn('grid grid-cols-1 gap-ds-primitives-space-4xl', columns === 2 && '@3xl:grid-cols-2', columns === 3 && '@4xl:grid-cols-3')}>
      {items.map((item, i) => (
        <DocTextCardView key={item.title ?? i} {...item} />
      ))}
    </div>
  );
}

// ───────────────────────── nota ─────────────────────────

/** Color del título por tono: los de la etiqueta de Estados (`DocStatesV2`). */
const toneText: Record<DocTone, string> = {
  neutral: 'text-ds-text-neutral-gray-2',
  accent: 'text-ds-text-acent-firts',
  success: 'text-ds-text-semantic-success-secondary',
  alert: 'text-ds-text-semantic-alert-secondary',
  error: 'text-ds-text-semantic-error-secondary',
};

const toneIcon: Record<DocTone, IconName> = {
  neutral: 'info-circle',
  accent: 'info-circle',
  success: 'tick-circle',
  alert: 'warning-2',
  error: 'warning-2',
};

/** Prefijo para lectores de pantalla: el color y el ícono no son la única pista del tipo de nota. */
const toneLabel: Record<DocTone, string> = {
  neutral: 'Nota',
  accent: 'Nota',
  success: 'Confirmación',
  alert: 'Advertencia',
  error: 'Error',
};

/**
 * Nota o alerta ("Discrepancia abierta…", "Alerta de interlineado…" en Figma): la misma Card simple, con el título en el
 * color del tono y su ícono de 20 a 8 del texto. `role="note"`: es contenido estático, no un aviso en vivo.
 */
export function DocNoteCard({ tone = 'alert', title, content }: { tone?: DocTone; title: string; content: DocInline | DocInline[] }) {
  return (
    <DocSimpleCard role="note">
      <h3 className={cn(cardTitle, toneText[tone], 'flex items-start gap-ds-space-general-lg')}>
        <Icon name={toneIcon[tone]} size={20} variant="fill" className="mt-0.5 shrink-0" />
        <span>
          <span className="sr-only">{toneLabel[tone]}: </span>
          {title}
        </span>
      </h3>
      <Paragraphs>{content}</Paragraphs>
    </DocSimpleCard>
  );
}

// ───────────────────────── bloque ─────────────────────────

/** Dibuja un bloque de fundamento: los nuevos aquí; el resto con `DocBlockView` de la plantilla de componentes. */
export function FoundationBlockView({ block }: { block: FoundationBlock }): ReactNode {
  switch (block.type) {
    case 'table':
      return <DocDataTable caption={block.caption} columns={block.columns} rows={block.rows} minWidth={block.minWidth} />;
    case 'cards':
      return <DocTextCards columns={block.columns} items={block.items} />;
    case 'note':
      return <DocNoteCard tone={block.tone} title={block.title} content={block.content} />;
    case 'code':
      return <DocCodePanel {...block.sample} />;
    default:
      return <DocBlockView block={block} />;
  }
}
