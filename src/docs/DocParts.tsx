import { useId } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import type { IconName } from '../components/Icon/Icon.types';
import { ScrollRegion } from '../foundations/_doc/ScrollRegion';
import { cn } from '../utils/cn';
import { DocDecor } from './DocDecor';
import type { DocAnatomyPart, DocCardContent, DocGalleryItem, DocInline, DocPractice } from './types';

/*
 * Piezas de la plantilla "Documentación" de Figma (página 22159:22295; ejemplo Tooltip 22159:22799 y 22159:22689).
 * Medidas de Figma en escritorio: sección con padding 40 y gap 32; tarjeta (Panel) con padding 24, gap 16, radio 16,
 * fondo background/container/default-on-canva y borde border/general/default-on-canva; muestra gris
 * background/general/gray-sixth con radio 12; tabla con radio 8.
 *
 * Para diseño (no están en tokens.css o no hay valor exacto):
 * - border/general/default-on-canva (G13 / G04) → border/general/default-on-canva, mismos valores.
 * - Tipografía: los marcos de documentación usan Inter con tamaños sueltos (28, 13, 11): aquí van la familia primaria y
 *   los tamaños de la escala más cercanos (título 24/32 responsive, cuerpo 14, detalle 12).
 * - En Light, background/general/gray-sixth es blanco y la muestra se perdería sobre la tarjeta blanca: la muestra, la
 *   cabecera de tabla y el círculo de las prácticas usan background/container/hover-on-card (G03) en Light.
 */

/** Texto del cuerpo con el marcado en línea permitido (`strong`, `code`, `em`). */
const inline =
  '[&_strong]:font-ds-primitives-typography-weight-semibold [&_strong]:text-ds-text-neutral-heading [&_code]:rounded-ds-radius-general-sm [&_code]:bg-ds-background-icon-default-on-canva [&_code]:px-ds-space-general-md [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-ds-text-neutral-heading';

const body = cn(
  'm-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-body text-pretty',
  inline,
);

/** Superficie gris de muestra (Figma: background/general/gray-sixth). */
const sampleSurface = 'bg-ds-background-general-gray-sixth light:bg-ds-background-container-hover-on-card';

// ───────────────────────── encabezado ─────────────────────────

interface DocHeaderProps {
  /** Ícono de la tarjeta (biblioteca CAOS). */
  icon: IconName;
  /** Nombre del componente (h1). */
  name: string;
  /** Descripción grande: qué es y su clasificación. */
  summary: ReactNode;
  /** Pestañas (normalmente `TabList`), centradas bajo el texto. */
  tabs?: ReactNode;
}

/**
 * Encabezado ("Header document (Atom)" 14321:54945): decorado de líneas, ícono en tarjeta de 64, nombre y descripción
 * con el estilo heading 2xl (32/36 en escritorio, 24/32 en móvil) y las pestañas. Contenido de 1024 de ancho.
 */
export function DocHeader({ icon, name, summary, tabs }: DocHeaderProps) {
  return (
    <header className="relative isolate overflow-hidden">
      <DocDecor />
      <div className="relative mx-auto flex max-w-[1024px] flex-col items-center gap-ds-space-general-6xl px-ds-space-canva-lateral py-ds-space-general-6xl box-content">
        <div className="flex flex-col items-center gap-ds-primitives-space-4xl text-center">
          <span
            aria-hidden="true"
            className="flex rounded-ds-radius-general-lg bg-ds-background-container-default-on-canva p-ds-space-general-2xl text-ds-icon-general-default shadow-ds-on-canva-md"
          >
            <Icon name={icon} size={32} variant="line" />
          </span>
          <div className="font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading text-balance">
            <h1 className="m-0 text-inherit [font:inherit]">{name}</h1>
            {/* Figma: nombre y descripción en el mismo texto, separados por una línea en blanco */}
            <p className="m-0 mt-[1lh]">{summary}</p>
          </div>
        </div>
        {tabs}
      </div>
    </header>
  );
}

// ───────────────────────── sección ─────────────────────────

interface DocSectionProps {
  /** Número de la sección (1, 2…); se muestra con dos cifras. Sin número no hay insignia. */
  number?: number;
  title: string;
  description?: DocInline;
  children?: ReactNode;
  id?: string;
}

/** Insignia del número de sección (Figma "Número": 4/10 de padding, radio completo, background/acent/tertiary). */
export function DocNumber({ value }: { value: number }) {
  return (
    <span className="inline-flex shrink-0 rounded-ds-radius-general-full bg-ds-background-acent-tertiary px-ds-primitives-space-lg py-ds-space-general-md font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-sm font-ds-primitives-typography-weight-semibold text-ds-text-neutral-white-unicolor tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
  );
}

/**
 * Sección numerada ("Sección de documentación"): insignia, título (h2) y bajada; debajo, los bloques con 32 de
 * separación. Borde inferior de 1 px entre secciones.
 */
export function DocSection({ number, title, description, children, id }: DocSectionProps) {
  const headingId = useId();
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex scroll-mt-ds-space-general-4xl flex-col gap-ds-primitives-space-5xl border-b border-ds-border-general-default-on-canva px-ds-space-canva-lateral py-ds-primitives-space-6xl tablet:px-ds-primitives-space-6xl"
    >
      <div className="flex flex-col items-start gap-ds-space-general-lg tablet:flex-row tablet:items-center tablet:gap-ds-space-general-2xl">
        {number !== undefined && <DocNumber value={number} />}
        <div className="flex min-w-0 flex-col gap-ds-space-general-lg">
          <h2
            id={headingId}
            className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading text-balance desktop:text-ds-typography-heading-size-2xl desktop:leading-ds-typography-heading-line-height-2xl"
          >
            {title}
          </h2>
          {description && (
            <p className={cn(body, 'leading-ds-primitives-typography-line-height-2xl')}>{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

// ───────────────────────── tarjetas ─────────────────────────

interface DocCardProps {
  title?: string;
  /** Nivel del título; h3 dentro de una sección. */
  headingLevel?: 'h3' | 'h4';
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}

/** Tarjeta ("Panel"): padding 24, gap 16, radio 16, fondo default-on-canva y borde de 1 px. */
export function DocCard({ title, headingLevel: Heading = 'h3', eyebrow, children, className }: DocCardProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-ds-space-general-2xl rounded-ds-radius-general-xl border border-ds-border-general-default-on-canva bg-ds-background-container-default-on-canva p-ds-space-general-2xl tablet:p-ds-primitives-space-4xl',
        className,
      )}
    >
      {(title || eyebrow) && (
        <div className="flex flex-col gap-ds-space-general-2xl">
          {title && (
            <Heading className="m-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-lg leading-ds-primitives-typography-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
              {title}
            </Heading>
          )}
          {eyebrow && (
            <p className="m-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-xs leading-ds-primitives-typography-line-height-xs font-ds-primitives-typography-weight-semibold tracking-wide text-ds-text-acent-firts uppercase">
              {eyebrow}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/** Grilla de tarjetas: 2 columnas desde tablet (16 de separación), 1 en móvil. */
export function DocGrid({ columns = 2, children, className }: { columns?: 1 | 2 | 3 | 4; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-ds-space-general-2xl',
        columns === 2 && 'tablet:grid-cols-2',
        columns === 3 && 'tablet:grid-cols-3',
        columns === 4 && 'tablet:grid-cols-2 desktop:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

const previewMinHeight = { sm: 'min-h-24', md: 'min-h-40', lg: 'min-h-52' } as const;

interface DocPreviewProps {
  children: ReactNode;
  /** Alto mínimo: `sm` 96, `md` 160, `lg` 208. Sin él se ajusta al contenido. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Vista de ejemplo ("Muestra"): marco gris donde se renderiza el componente real, centrado. Padding 24, radio 12.
 * Si el contenido no cabe en móvil, el marco hace scroll horizontal propio.
 */
export function DocPreview({ children, size, className }: DocPreviewProps) {
  return (
    <div className={cn('flex min-w-0 overflow-x-auto rounded-ds-radius-general-lg p-ds-primitives-space-4xl', sampleSurface, size && previewMinHeight[size], className)}>
      {/* m-auto centra sin recortar cuando el contenido es más ancho que el marco */}
      <div className="m-auto flex flex-col items-center gap-ds-space-general-2xl">{children}</div>
    </div>
  );
}

/** Párrafos del cuerpo (13–14 px, color body). Un arreglo = varios párrafos. */
export function DocText({ children, className }: { children: DocInline | DocInline[]; className?: string }) {
  const paragraphs = Array.isArray(children) ? children : [children];
  return (
    <div className={cn('flex flex-col gap-ds-space-general-xl', className)}>
      {paragraphs.map((p, i) => (
        <p key={i} className={body}>
          {p}
        </p>
      ))}
    </div>
  );
}

/** Lista de viñetas ("Punto de guía"): viñeta ● de color y texto, 10 de separación horizontal y 16 entre puntos. */
export function DocBullets({ items, tone = 'accent' }: { items: DocInline[]; tone?: 'accent' | 'error' }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-ds-space-general-2xl p-0">
      {items.map((item, i) => (
        <li key={i} className="flex gap-ds-space-general-lg">
          <span
            aria-hidden="true"
            className={cn(
              'mt-ds-space-general-md size-2 shrink-0 translate-y-ds-space-general-sm rounded-ds-radius-general-full',
              tone === 'error' ? 'bg-ds-icon-semantic-error-firts' : 'bg-ds-text-acent-firts',
            )}
          />
          <span className={body}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Tarjeta completa a partir de su contenido (bloque `cards`). */
export function DocContentCard({ title, eyebrow, preview, previewSize, description, bullets, bulletTone }: DocCardContent) {
  return (
    <DocCard title={title} eyebrow={eyebrow}>
      {preview !== undefined && <DocPreview size={previewSize}>{preview}</DocPreview>}
      {description !== undefined && <DocText>{description}</DocText>}
      {bullets && <DocBullets items={bullets} tone={bulletTone} />}
    </DocCard>
  );
}

/** "Cuándo usarlo" / "Cuándo evitarlo": dos tarjetas con viñetas violeta y roja. */
export function DocUsage({ use, avoid }: { use: DocInline[]; avoid: DocInline[] }) {
  return (
    <DocGrid>
      <DocCard title="Cuándo usarlo">
        <DocBullets items={use} />
      </DocCard>
      <DocCard title="Cuándo evitarlo">
        <DocBullets items={avoid} tone="error" />
      </DocCard>
    </DocGrid>
  );
}

// ───────────────────────── tabla ─────────────────────────

interface DocTableProps {
  /** Nombre de la tabla (caption para lectores de pantalla y nombre de la región con scroll). */
  caption: string;
  columns: string[];
  /** Filas; la primera celda es el encabezado de fila. */
  rows: DocInline[][];
  /** Ancho mínimo antes de hacer scroll horizontal propio (móvil). Por defecto 560. */
  minWidth?: number;
}

/** Tabla ("Tabla"): radio 8, borde de 1 px, cabecera gris (12/16 de padding) y filas default-on-canva (14/16). */
export function DocTable({ caption, columns, rows, minWidth = 560 }: DocTableProps) {
  const cell = 'px-ds-space-general-2xl text-left align-top';
  return (
    <ScrollRegion label={caption} className="rounded-ds-radius-general-md border border-ds-border-general-default-on-canva">
      <table
        className={cn(
          'w-full table-fixed border-collapse font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-body',
          inline,
        )}
        style={{ minWidth }}
      >
        <caption className="sr-only">{caption}</caption>
        <thead className={sampleSurface}>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className={cn(cell, 'py-ds-space-general-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading')}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-ds-background-container-default-on-canva">
          {rows.map((cells, r) => (
            <tr key={r} className="border-t border-ds-border-general-default-on-canva">
              {cells.map((content, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className={cn(cell, 'py-ds-space-general-xl font-ds-primitives-typography-weight-regular')}>
                    {content}
                  </th>
                ) : (
                  <td key={c} className={cn(cell, 'py-ds-space-general-xl')}>
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

// ───────────────────────── anatomía y galería ─────────────────────────

interface DocAnatomyProps {
  title?: string;
  preview: ReactNode;
  parts: DocAnatomyPart[];
}

/** Anatomía: tarjeta con la vista (430 de ancho en escritorio) y la lista numerada "1 · Parte — descripción". */
export function DocAnatomy({ title = 'Anatomía del componente', preview, parts }: DocAnatomyProps) {
  return (
    <DocCard title={title}>
      <div className="flex flex-col gap-ds-space-general-4xl desktop:flex-row desktop:items-center desktop:gap-ds-primitives-space-6xl">
        <DocPreview className="p-ds-primitives-space-5xl desktop:w-[430px] desktop:shrink-0">{preview}</DocPreview>
        <ol className="m-0 flex list-none flex-col gap-ds-space-general-xl p-0">
          {parts.map((part, i) => (
            <li key={part.name} className={body}>
              <span className="tabular-nums">{i + 1}</span> · {part.name} — {part.description}
            </li>
          ))}
        </ol>
      </div>
    </DocCard>
  );
}

interface DocGalleryProps {
  title: string;
  columns?: 2 | 3 | 4;
  /** Alineación de la etiqueta y el detalle de cada celda. Por defecto centrada. */
  align?: 'center' | 'start';
  items: DocGalleryItem[];
}

/**
 * Tarjeta con grilla de ejemplos ("Posiciones básicas", "Matriz de estados", "Respuesta a la interacción"): celdas
 * grises con padding 20, radio 12, etiqueta, ejemplo y detalle.
 */
export function DocGallery({ title, columns = 4, align = 'center', items }: DocGalleryProps) {
  const start = align === 'start';
  return (
    <DocCard title={title}>
      <DocGrid columns={columns === 4 ? 4 : columns === 3 ? 3 : 2}>
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex min-w-0 flex-col items-center gap-ds-space-general-2xl rounded-ds-radius-general-lg p-ds-primitives-space-3xl',
              sampleSurface,
            )}
          >
            <p
              className={cn(
                'm-0 self-stretch font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading',
                start ? 'text-left' : 'text-center',
              )}
            >
              {item.label}
            </p>
            {item.preview !== undefined && <div className="flex max-w-full items-center justify-center overflow-x-auto">{item.preview}</div>}
            {item.description !== undefined && (
              <p
                className={cn(
                  'm-0 self-stretch font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md text-ds-text-neutral-body text-pretty',
                  inline,
                  start ? 'text-left' : 'text-center',
                )}
              >
                {item.description}
              </p>
            )}
          </div>
        ))}
      </DocGrid>
    </DocCard>
  );
}

// ───────────────────────── nota y prácticas ─────────────────────────

interface DocCalloutProps {
  /** `info` violeta (background/acent/secondary) o `warning` amarillo (background/semantic/alert/secondary). */
  tone?: 'info' | 'warning';
  children: DocInline;
}

/** Nota destacada ("Nota"): padding 24, radio 12, ícono info-circle de 20 y texto 13–14 del color del tono. */
export function DocCallout({ tone = 'info', children }: DocCalloutProps) {
  const warning = tone === 'warning';
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-ds-space-general-2xl rounded-ds-radius-general-lg p-ds-space-general-2xl tablet:items-center tablet:p-ds-primitives-space-4xl',
        warning
          ? 'bg-ds-background-semantic-alert-secondary text-ds-text-semantic-alert'
          : 'bg-ds-background-acent-secondary text-ds-text-acent-secondary',
      )}
    >
      <Icon name="info-circle" size={20} variant="line" className="shrink-0" />
      <p
        className={cn(
          'm-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-inherit text-pretty',
          '[&_strong]:font-ds-primitives-typography-weight-semibold [&_code]:font-mono',
        )}
      >
        {/* Prefijo para lectores de pantalla: el color no es la única pista del tipo de nota */}
        <span className="sr-only">{warning ? 'Advertencia: ' : 'Nota: '}</span>
        {children}
      </p>
    </div>
  );
}

/** Una práctica ("Práctica"): círculo de 48 con ✓ verde o ✕ rojo, título (h3) y explicación. */
export function DocPracticeCard({ kind, title, description, preview }: DocPractice) {
  const isDo = kind === 'do';
  return (
    <DocCard className="gap-ds-space-general-3xl tablet:min-h-56">
      <span className={cn('flex size-12 items-center justify-center rounded-ds-radius-general-full', sampleSurface)}>
        <Icon
          name={isDo ? 'tick-circle' : 'close-circle'}
          size={24}
          variant="fill"
          aria-label={isDo ? 'Buena práctica' : 'Mala práctica'}
          className={isDo ? 'text-ds-icon-semantic-success-firts' : 'text-ds-icon-semantic-error-firts'}
        />
      </span>
      {preview !== undefined && <DocPreview>{preview}</DocPreview>}
      <div className="flex flex-col gap-ds-space-general-3xl">
        <h3 className="m-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-lg leading-ds-primitives-typography-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
          {title}
        </h3>
        <p className={body}>{description}</p>
      </div>
    </DocCard>
  );
}

/** Buenas y malas prácticas: grilla de 2 columnas con 24 de separación (1 en móvil). Orden: do, dont, do, dont… */
export function DocPractices({ items }: { items: DocPractice[] }) {
  return (
    <div className="grid grid-cols-1 gap-ds-primitives-space-4xl tablet:grid-cols-2">
      {items.map((item) => (
        <DocPracticeCard key={item.title} {...item} />
      ))}
    </div>
  );
}

/** Etiqueta pequeña para anotar un ejemplo (Figma "Etiqueta": radio completo, background/icon/low-contrast). */
export function DocTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-ds-radius-general-full bg-ds-background-icon-default-on-canva px-ds-space-general-lg py-ds-space-general-md font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-sm font-ds-primitives-typography-weight-semibold text-ds-text-neutral-body">
      {children}
    </span>
  );
}
