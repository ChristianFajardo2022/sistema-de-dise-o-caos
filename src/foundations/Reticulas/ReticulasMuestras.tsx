import type { CSSProperties, ReactNode } from 'react';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import type { TokenBreakpoint } from '../_doc/tokensCss';
import { COLUMN_CLASS, GridDiagram, Legend, MARGIN_CLASS, PANEL_CLASS, ScreenRow } from './GridDiagram';
import { BREAKPOINTS, BREAKPOINTS_ASC, COMPOSICION, FIGMA, SPECS, pxText } from './reticulaData';

/*
 * Muestras propias de Retículas (bloques `custom` / `preview` de la página): diagramas a escala de cada tipo de
 * retícula, la misma composición en el marco de cada breakpoint y los ejemplos de Do and Dont’s. Las medidas salen de
 * tokens.css (`reticulaData.ts`); dentro de `DocDeviceFrame` las utilidades `ds-` toman los valores del breakpoint del
 * marco, así la retícula que se ve es la del código.
 */

// ───────────────────────── base ─────────────────────────

const primary = 'font-ds-primitives-typography-family-primary';
const semibold = 'font-ds-primitives-typography-weight-semibold';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600), como en Tipografía y Colores. */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');
/** Texto de un bloque de composición: 12/16. */
const blockText = cn(primary, 'm-0 text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md text-ds-text-neutral-heading');
/** Texto de un bloque en las pantallas a escala (se reducen con `ShrinkToFit`): 16/20. */
const screenText = cn(primary, 'm-0 text-ds-primitives-typography-size-lg leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-heading');

/** Leyenda común de los diagramas. */
export function GridLegend({ gutter }: { gutter: number }) {
  return (
    <Legend
      items={[
        { className: MARGIN_CLASS, label: 'Margen' },
        { className: COLUMN_CLASS, label: 'Columna' },
        { className: 'bg-ds-background-container-default-on-canva', label: `Canal (${pxText(gutter)})` },
      ]}
    />
  );
}

/** Pie de un diagrama: valor destacado y detalle. */
function Caption({ title, detail }: { title: ReactNode; detail?: ReactNode }) {
  return (
    <>
      <strong className="text-ds-text-neutral-heading">{title}</strong>
      {detail !== undefined && (
        <>
          <br />
          {detail}
        </>
      )}
    </>
  );
}

// ───────────────────────── pantallas ─────────────────────────

/** Pantallas de trabajo a la misma escala: los tres lienzos de tokens.css y la de 1920 de Figma. */
export function PantallasAEscala() {
  const screens = [
    ...BREAKPOINTS_ASC.map(({ bp, screen }) => ({ label: screen, width: SPECS[bp].width, height: SPECS[bp].height })),
    { label: 'Escritorio amplio', ...FIGMA.screens.wide },
  ];
  return (
    <ScreenRow
      name="Pantallas a escala"
      screens={screens.map((s) => ({
        width: s.width,
        node: (
          <figure className="m-0 flex flex-col items-center gap-ds-space-general-lg">
            <div
              aria-hidden="true"
              className="w-full border border-ds-border-general-default-on-card bg-ds-background-container-default-on-canva"
              style={{ aspectRatio: `${s.width} / ${s.height}` }}
            >
              <div className="h-[4%] bg-ds-background-graphic-neutral-secondary-opacity" />
            </div>
            <figcaption className="text-center text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md text-ds-text-neutral-body">
              <Caption title={s.label} detail={`${s.width} × ${s.height}`} />
            </figcaption>
          </figure>
        ),
      }))}
    />
  );
}

// ───────────────────────── estructura y tipos ─────────────────────────

/** Retícula de escritorio con sus tres parámetros. */
export function EstructuraReticula() {
  const d = SPECS.desktop;
  return (
    <div className="flex flex-col gap-ds-space-general-3xl">
      <GridDiagram width={d.width} height={420} columns={d.columns} gutter={d.gutter} lateral={d.lateral} />
      <GridLegend gutter={d.gutter} />
    </div>
  );
}

/** Pantallas de una retícula en sus cuatro anchos: 376, 768, 1440 (tokens) y 1920 (con los valores de Desktop). */
function screensFor(margin: 'lateral' | 'lateralWeb') {
  return [
    ...BREAKPOINTS_ASC.map(({ bp }) => ({ bp, width: SPECS[bp].width, height: SPECS[bp].height })),
    { bp: 'desktop' as TokenBreakpoint, width: FIGMA.screens.wide.width, height: FIGMA.screens.wide.height },
  ].map((s) => {
    const spec = SPECS[s.bp];
    return { ...s, columns: spec.columns, gutter: spec.gutter, lateral: spec[margin] };
  });
}

/** Retícula fija (`lateral`) o variable (`lateralWeb`) en sus cuatro pantallas. */
export function TipoReticula({ margin }: { margin: 'lateral' | 'lateralWeb' }) {
  return (
    <ScreenRow
      name={margin === 'lateral' ? 'Retícula fija por pantalla' : 'Retícula variable por pantalla'}
      minWidth={880}
      screens={screensFor(margin).map((s) => ({
        width: s.width,
        node: (
          <GridDiagram
            width={s.width}
            height={s.height}
            columns={s.columns}
            gutter={s.gutter}
            lateral={s.lateral}
            label={<Caption title={`${s.width} px`} detail={`${s.columns} columnas · margen ${pxText(s.lateral)}`} />}
          />
        ),
      }))}
    />
  );
}

/** Retícula con función secundaria: móvil (pantalla completa y 80 de alto) y tablet y escritorio (desplegada y plegada). */
export function TipoSecundaria() {
  const m = SPECS.mobile;
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-ds-space-general-4xl">
      <ScreenRow
        name="Retícula secundaria desplegada"
        screens={[
          {
            width: m.width,
            node: (
              <GridDiagram
                width={m.width}
                height={m.height}
                columns={m.columns}
                gutter={m.gutter}
                lateral={m.lateral}
                secondary={{ side: 'full', size: 0 }}
                label={<Caption title="Móvil" detail={FIGMA.secondary.mobile.open} />}
              />
            ),
          },
          ...(['tablet', 'desktop'] as const).map((bp) => ({
            width: SPECS[bp].width,
            node: (
              <GridDiagram
                width={SPECS[bp].width}
                height={SPECS[bp].height}
                columns={SPECS[bp].columns}
                gutter={SPECS[bp].gutter}
                lateral={SPECS[bp].lateral}
                secondary={{ side: 'left', size: FIGMA.secondary[bp].openSize }}
                label={<Caption title={bp === 'tablet' ? 'Tablet' : 'Escritorio'} detail={FIGMA.secondary[bp].open} />}
              />
            ),
          })),
        ]}
      />
      <ScreenRow
        name="Retícula secundaria plegada"
        screens={[
          {
            width: m.width,
            node: (
              <GridDiagram
                width={m.width}
                height={m.height}
                columns={m.columns}
                gutter={m.gutter}
                lateral={m.lateral}
                secondary={{ side: 'top', size: FIGMA.secondary.mobile.closedSize }}
                label={<Caption title="Móvil" detail={FIGMA.secondary.mobile.closed} />}
              />
            ),
          },
          ...(['tablet', 'desktop'] as const).map((bp) => ({
            width: SPECS[bp].width,
            node: (
              <GridDiagram
                width={SPECS[bp].width}
                height={SPECS[bp].height}
                columns={SPECS[bp].columns}
                gutter={SPECS[bp].gutter}
                lateral={SPECS[bp].lateral}
                secondary={{ side: 'left', size: FIGMA.secondary[bp].closedSize }}
                label={<Caption title={bp === 'tablet' ? 'Tablet' : 'Escritorio'} detail={FIGMA.secondary[bp].closed} />}
              />
            ),
          })),
        ]}
      />
      <Legend
        items={[
          { className: MARGIN_CLASS, label: 'Margen' },
          { className: COLUMN_CLASS, label: 'Columna' },
          { className: PANEL_CLASS, label: 'Retícula secundaria' },
        ]}
      />
    </div>
  );
}

// ───────────────────────── márgenes ─────────────────────────

/** Márgenes laterales (fija o variable) en los tres breakpoints, con barra de navegación y pie. */
export function MargenesLaterales({ margin }: { margin: 'lateral' | 'lateralWeb' }) {
  return (
    <div className="mx-auto w-full max-w-4xl">
    <ScreenRow
      name={margin === 'lateral' ? 'Márgenes laterales fijos' : 'Márgenes laterales variables'}
      screens={BREAKPOINTS_ASC.map(({ bp, screen }) => {
        const s = SPECS[bp];
        return {
          width: s.width,
          node: (
            <GridDiagram
              width={s.width}
              height={s.height}
              columns={s.columns}
              gutter={s.gutter}
              lateral={s[margin]}
              chrome
              label={<Caption title={screen} detail={pxText(s[margin])} />}
            />
          ),
        };
      })}
    />
    </div>
  );
}

/** Márgenes superior e inferior: entre la barra de navegación y la retícula, y entre la retícula y el pie. */
export function MargenesVerticales() {
  return (
    <div className="mx-auto w-full max-w-4xl">
    <ScreenRow
      name="Márgenes superior e inferior"
      screens={BREAKPOINTS_ASC.map(({ bp, screen }) => {
        const s = SPECS[bp];
        return {
          width: s.width,
          node: (
            <GridDiagram
              width={s.width}
              height={s.height}
              columns={s.columns}
              gutter={s.gutter}
              lateral={s.lateral}
              top={s.top}
              bottom={s.bottom}
              chrome
              label={<Caption title={screen} detail={`Superior ${pxText(s.top)} · inferior ${pxText(s.bottom)}`} />}
            />
          ),
        };
      })}
    />
    </div>
  );
}

// ───────────────────────── composición ─────────────────────────

/** Bloque de composición dentro de un `GridDiagram`. */
function DiagramBlock({ col, span, row, children }: { col: number; span: number; row: number; children?: ReactNode }) {
  return (
    <div
      className={cn('flex items-center justify-center border border-ds-border-semantic-information px-ds-space-general-xs text-center', blockText, PANEL_CLASS)}
      style={{ gridColumn: `${col} / span ${span}`, gridRow: row }}
    >
      {children}
    </div>
  );
}

const SPANS = [1, 2, 4, 6, 8, 12];

/** Contenedores de 1, 2, 4, 6, 8 y 12 columnas sobre la retícula de escritorio (sin márgenes). */
export function ComposicionColumnas() {
  const d = SPECS.desktop;
  return (
    <GridDiagram width={d.width} height={560} columns={d.columns} gutter={d.gutter} lateral={0} rows={`repeat(${SPANS.length}, 1fr)`}>
      {SPANS.map((n, i) => (
        <DiagramBlock key={n} col={1} span={n} row={i + 1}>
          {n === 1 ? '1 columna' : `${n} columnas`}
        </DiagramBlock>
      ))}
    </GridDiagram>
  );
}

/** Caso de uso: bloques `[columna, span, fila]` sobre la retícula de un breakpoint. */
export function CasoDeUso({ bp, rows, blocks }: { bp: TokenBreakpoint; rows: string; blocks: [col: number, span: number, row: number][] }) {
  const s = SPECS[bp];
  return (
    <div className={cn('mx-auto w-full', bp === 'tablet' && 'max-w-80', bp === 'mobile' && 'max-w-48')}>
      <GridDiagram width={s.width} height={s.height} columns={s.columns} gutter={s.gutter} lateral={s.lateral} rows={rows}>
        {blocks.map(([col, span, row], i) => (
          <DiagramBlock key={i} col={col} span={span} row={row} />
        ))}
      </GridDiagram>
    </div>
  );
}

// ───────────────────────── pantalla con retícula superpuesta ─────────────────────────

/** Columnas de la retícula dibujadas detrás del contenido (decorativas). */
function ColumnOverlay({ columns, inset = true }: { columns: number; inset?: boolean }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', inset && 'px-ds-space-canva-lateral')}>
      <div className="grid h-full grid-cols-ds-default gap-ds-gutter-default">
        {Array.from({ length: columns }, (_, i) => (
          <span key={i} className={COLUMN_CLASS} />
        ))}
      </div>
    </div>
  );
}

/** Bloque de contenido: nombre y columnas que ocupa. */
function Bloque({ name, span, columns, tall = false }: { name: string; span: number; columns: number; tall?: boolean }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-ds-space-general-xs rounded-ds-radius-general-md border border-ds-border-semantic-information p-ds-space-general-lg',
        PANEL_CLASS,
        tall && 'pb-ds-space-general-6xl',
      )}
      style={{ gridColumn: `span ${span} / span ${span}` } as CSSProperties}
    >
      <p className={cn(screenText, semibold)}>{name}</p>
      <p className={cn(screenText, 'text-ds-text-neutral-body')}>
        {span} de {columns} columnas
      </p>
    </div>
  );
}

/**
 * La composición de ejemplo en la pantalla de un breakpoint: lienzo del ancho del token
 * (`w-ds-dimention-canva-width`), márgenes, canal y columnas de ese breakpoint, y la retícula superpuesta. Si no cabe,
 * `ShrinkToFit` la reduce entera.
 */
function PantallaConReticula({ bp }: { bp: TokenBreakpoint }) {
  const columns = SPECS[bp].columns;
  return (
    <ShrinkToFit innerClassName="justify-start">
      <div className="relative w-ds-dimention-canva-width shrink-0 rounded-ds-radius-general-md bg-ds-background-container-surface px-ds-space-canva-lateral pt-ds-space-canva-top pb-ds-space-canva-bottom">
        <ColumnOverlay columns={columns} />
        <div className="relative grid grid-cols-ds-default gap-ds-gutter-default">
          {COMPOSICION.map((b) => (
            <Bloque key={b.name} name={b.name} span={b.span(columns)} columns={columns} tall={b.tall} />
          ))}
        </div>
      </div>
    </ShrinkToFit>
  );
}

/** Desktop arriba; Tablet y Mobile debajo, cada uno en su marco de dispositivo con las variables de su breakpoint. */
export function ReticulaPorBreakpoint() {
  const frame = (bp: TokenBreakpoint, label: string) => (
    <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{label}</h3>
      <DocDeviceFrame breakpoint={bp}>
        <PantallaConReticula bp={bp} />
      </DocDeviceFrame>
    </div>
  );
  const [desktop, tablet, mobile] = BREAKPOINTS;
  return (
    <div className="flex flex-col gap-ds-primitives-space-4xl">
      {frame(desktop.bp, desktop.label)}
      <div className="grid grid-cols-1 items-start gap-ds-primitives-space-4xl @3xl:grid-cols-[2fr_1fr]">
        {frame(tablet.bp, tablet.label)}
        {frame(mobile.bp, mobile.label)}
      </div>
    </div>
  );
}

// ───────────────────────── Do and Dont’s ─────────────────────────

/** Pantalla móvil de las prácticas: superficie, márgenes del token y retícula superpuesta. */
function PantallaMovil({ children, edge = false }: { children: ReactNode; edge?: boolean }) {
  return (
    <div className="relative w-full rounded-ds-radius-general-md bg-ds-background-container-surface py-ds-space-general-2xl">
      <ColumnOverlay columns={SPECS.mobile.columns} />
      <div className={cn('relative', !edge && 'px-ds-space-canva-lateral')}>{children}</div>
    </div>
  );
}

function Tarjeta({ name, className, style }: { name: string; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn('flex min-w-0 flex-col gap-ds-space-general-xs rounded-ds-radius-general-md border border-ds-border-semantic-information p-ds-space-general-lg', PANEL_CLASS, className)}
      style={style}
    >
      <p className={cn(blockText, semibold)}>{name}</p>
      <p className={cn(blockText, 'text-ds-text-neutral-body')}>Próxima reunión del equipo</p>
    </div>
  );
}

const span = (n: number): CSSProperties => ({ gridColumn: `span ${n} / span ${n}` });

/** Par "Alineación": bloques que empiezan y terminan en columnas, o anchos libres que no siguen la retícula. */
export function MuestraAlineacion({ free = false }: { free?: boolean }) {
  return (
    <PantallaMovil>
      {free ? (
        <div className="flex flex-col gap-ds-space-general-md">
          <Tarjeta name="Resumen" className="ml-ds-space-general-lg" />
          <div className="grid grid-cols-[5fr_3fr] gap-ds-space-general-sm">
            <Tarjeta name="Agenda" />
            <Tarjeta name="Notas" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-ds-default gap-ds-gutter-default">
          <Tarjeta name="Resumen" style={span(SPECS.mobile.columns)} />
          <Tarjeta name="Agenda" style={span(SPECS.mobile.columns / 2)} />
          <Tarjeta name="Notas" style={span(SPECS.mobile.columns / 2)} />
        </div>
      )}
    </PantallaMovil>
  );
}

/** Par "Márgenes": contenido dentro del margen lateral, o pegado al borde de la pantalla. */
export function MuestraMargenes({ edge = false }: { edge?: boolean }) {
  return (
    <PantallaMovil edge={edge}>
      <div className="grid grid-cols-ds-default gap-ds-gutter-default">
        <Tarjeta name="Resumen" style={span(SPECS.mobile.columns)} className={cn(edge && 'rounded-none')} />
        <Tarjeta name="Agenda" style={span(SPECS.mobile.columns)} className={cn(edge && 'rounded-none')} />
      </div>
    </PantallaMovil>
  );
}

/** Par "Apilar en móvil": tres bloques que ocupan las 4 columnas, o tres columnas apretadas que no siguen la retícula. */
export function MuestraApilado({ squeezed = false }: { squeezed?: boolean }) {
  const names = ['Resumen', 'Agenda', 'Notas'];
  return (
    <PantallaMovil>
      {squeezed ? (
        <div className="grid grid-cols-3 gap-ds-space-general-xs">
          {names.map((n) => (
            <Tarjeta key={n} name={n} className="p-ds-space-general-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-ds-default gap-ds-gutter-default">
          {names.map((n) => (
            <Tarjeta key={n} name={n} style={span(SPECS.mobile.columns)} />
          ))}
        </div>
      )}
    </PantallaMovil>
  );
}

// ───────────────────────── accesibilidad ─────────────────────────

/** Bloque numerado en el orden de lectura. */
function Paso({ n, name, style }: { n: number; name: string; style: CSSProperties }) {
  return (
    <li className={cn('flex min-w-0 items-center gap-ds-space-general-md rounded-ds-radius-general-md border border-ds-border-semantic-information p-ds-space-general-lg', PANEL_CLASS)} style={style}>
      <span aria-hidden="true" className={cn(blockText, semibold, 'flex size-6 shrink-0 items-center justify-center rounded-ds-radius-general-full bg-ds-background-container-surface tabular-nums')}>
        {n}
      </span>
      <span className={blockText}>{name}</span>
    </li>
  );
}

/**
 * Orden de lectura: los mismos cuatro bloques en escritorio (en fila) y en móvil (apilados) siguen el orden del código.
 * Lista ordenada, para que el orden también se anuncie.
 */
export function OrdenDeLectura() {
  const names = ['Encabezado', 'Resumen', 'Agenda', 'Notas'];
  const layouts: { bp: TokenBreakpoint; label: string; spans: number[] }[] = [
    { bp: 'desktop', label: 'Desktop', spans: [12, 4, 4, 4] },
    { bp: 'mobile', label: 'Mobile', spans: [4, 4, 4, 4] },
  ];
  return (
    <div className="grid grid-cols-1 items-start gap-ds-primitives-space-4xl @3xl:grid-cols-[2fr_1fr]">
      {layouts.map((l) => (
        <div key={l.bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
          <h3 className={sampleLabel}>{l.label}</h3>
          <DocDeviceFrame breakpoint={l.bp}>
            <ShrinkToFit innerClassName="justify-start">
            <div
              className={cn(
                'relative w-full rounded-ds-radius-general-md bg-ds-background-container-surface px-ds-space-canva-lateral py-ds-space-general-2xl',
                l.bp === 'desktop' && 'min-w-160',
              )}
            >
              <ColumnOverlay columns={SPECS[l.bp].columns} />
              <ol role="list" aria-label={`Orden de lectura en ${l.label}`} className="relative m-0 grid list-none grid-cols-ds-default gap-ds-gutter-default p-0">
                {names.map((name, i) => (
                  <Paso key={name} n={i + 1} name={name} style={span(Math.min(l.spans[i], SPECS[l.bp].columns))} />
                ))}
              </ol>
            </div>
            </ShrinkToFit>
          </DocDeviceFrame>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── Figma ─────────────────────────

/** Guía central de Figma desde 1920 px: 12 columnas de 65 px centradas; los márgenes absorben el resto. */
export function GuiaCentral() {
  const { columns, column } = FIGMA.center;
  const width = FIGMA.screens.wide.width;
  const gutter = SPECS.desktop.gutter;
  const content = columns * column + (columns - 1) * gutter;
  const lateral = (width - content) / 2;
  return (
    <GridDiagram
      width={width}
      height={FIGMA.screens.wide.height}
      columns={columns}
      gutter={gutter}
      lateral={lateral}
      label={<Caption title="Center" detail={`${columns} columnas de ${pxText(column)} · contenido de ${pxText(content)} y márgenes de ${pxText(lateral)}`} />}
    />
  );
}

/** Retícula derecha de Figma: la base alineada a la derecha y, a su izquierda, la retícula secundaria desplegada. */
export function GuiaDerecha() {
  const d = SPECS.desktop;
  const { columns, column, offset } = FIGMA.right;
  return (
    <GridDiagram
      width={d.width}
      height={d.height}
      columns={columns}
      gutter={d.gutter}
      lateral={offset}
      secondary={{ side: 'left', size: FIGMA.secondary.desktop.openSize }}
      label={<Caption title="Right" detail={`${columns} columnas de ${pxText(column)} · offset ${pxText(offset)} · secundaria de ${pxText(FIGMA.secondary.desktop.openSize)}`} />}
    />
  );
}
