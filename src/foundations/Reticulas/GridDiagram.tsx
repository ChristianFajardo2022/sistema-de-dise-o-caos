import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { ScrollRegion } from '../_doc';

/** Colores de los diagramas (tokens semánticos que cambian con el tema) */
export const COLUMN_CLASS = 'bg-ds-background-graphic-error-secondary-opacity';
export const MARGIN_CLASS = 'bg-ds-background-graphic-information-secondary-opacity';
export const PANEL_CLASS = 'bg-ds-background-graphic-information-firts-opacity';

interface GridDiagramProps {
  /** Ancho y alto de la pantalla en px (solo fijan la proporción; el dibujo se escala) */
  width: number;
  height: number;
  columns: number;
  gutter: number;
  /** Margen lateral en px */
  lateral: number;
  /** Margen superior e inferior en px (0 = no se dibuja) */
  top?: number;
  bottom?: number;
  /** Barra de navegación y pie de página */
  chrome?: boolean;
  /** Etiquetas bajo el dibujo */
  label?: ReactNode;
  /** Panel de la retícula secundaria */
  secondary?: { side: 'left' | 'top' | 'full'; size: number };
  /** Contenido extra sobre la retícula (bloques de composición) */
  children?: ReactNode;
  /** Plantilla de filas del contenido extra, p. ej. `2fr 1fr` */
  rows?: string;
  className?: string;
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/**
 * Dibuja una pantalla con su retícula (columnas, canales y márgenes) a escala.
 * Todas las medidas llegan en px reales; las posiciones se expresan en porcentaje para que el dibujo se adapte al ancho disponible.
 */
export function GridDiagram({
  width,
  height,
  columns,
  gutter,
  lateral,
  top = 0,
  bottom = 0,
  chrome = false,
  label,
  secondary,
  children,
  rows,
  className,
}: GridDiagramProps) {
  const navH = chrome ? 56 : 0;
  const footH = chrome ? 56 : 0;
  const gridTop = navH + top;
  const gridBottom = footH + bottom;
  const leftEdge = secondary?.side === 'left' ? secondary.size : 0;
  const topEdge = secondary?.side === 'top' ? secondary.size : 0;
  const inner = width - leftEdge - lateral * 2 + (secondary?.side === 'left' ? lateral : 0);
  const gridStyle: CSSProperties = {
    left: pct(leftEdge + lateral, width),
    right: pct(lateral, width),
    top: pct(gridTop + topEdge, height),
    bottom: pct(gridBottom, height),
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    columnGap: pct(gutter, inner > 0 ? inner : width),
  };
  return (
    <figure className={cn('m-0 flex min-w-0 flex-col items-center gap-ds-space-general-lg', className)}>
      <div
        className="relative w-full overflow-hidden border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-canva"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {chrome && (
          <>
            <div className="absolute inset-x-0 top-0 bg-ds-text-neutral-heading" style={{ height: pct(navH, height) }} />
            <div className="absolute inset-x-0 bottom-0 bg-ds-background-graphic-neutral-secondary-opacity" style={{ height: pct(footH, height) }} />
          </>
        )}
        {/* márgenes laterales */}
        <div className={cn('absolute', MARGIN_CLASS)} style={{ left: 0, width: pct(leftEdge + lateral, width), top: pct(navH, height), bottom: pct(footH, height) }} />
        <div className={cn('absolute', MARGIN_CLASS)} style={{ right: 0, width: pct(lateral, width), top: pct(navH, height), bottom: pct(footH, height) }} />
        {/* márgenes superior e inferior */}
        {top > 0 && <div className={cn('absolute inset-x-0', MARGIN_CLASS)} style={{ top: pct(navH, height), height: pct(top, height) }} />}
        {bottom > 0 && <div className={cn('absolute inset-x-0', MARGIN_CLASS)} style={{ bottom: pct(footH, height), height: pct(bottom, height) }} />}
        {/* columnas */}
        <div className="absolute grid" style={gridStyle} aria-hidden="true">
          {Array.from({ length: columns }, (_, i) => (
            <div key={i} className={cn('h-full', COLUMN_CLASS)} />
          ))}
        </div>
        {children && (
          <div className="absolute grid" style={{ ...gridStyle, gridTemplateRows: rows, rowGap: pct(gutter, height) }}>
            {children}
          </div>
        )}
        {secondary?.side === 'left' && (
          <div className={cn('absolute inset-y-0 left-0 border-r border-ds-border-semantic-information', PANEL_CLASS)} style={{ width: pct(secondary.size, width), top: pct(navH, height), bottom: pct(footH, height) }} />
        )}
        {secondary?.side === 'top' && (
          <div className={cn('absolute inset-x-0 border-b border-ds-border-semantic-information', PANEL_CLASS)} style={{ top: pct(navH, height), height: pct(secondary.size, height) }} />
        )}
        {secondary?.side === 'full' && (
          <div className={cn('absolute inset-0 border-ds-border-semantic-information', PANEL_CLASS)} style={{ top: pct(navH, height) }} />
        )}
      </div>
      {label && <figcaption className="text-center text-ds-primitives-typography-size-sm leading-snug text-ds-text-neutral-body">{label}</figcaption>}
    </figure>
  );
}

/** Fila de pantallas a la misma escala: cada una ocupa un ancho proporcional a su ancho real. Hace scroll propio en pantallas angostas. */
export function ScreenRow({ screens, name }: { screens: { width: number; node: ReactNode }[]; name: string }) {
  return (
    <ScrollRegion label={name}>
      <div className="flex min-w-[560px] items-end gap-ds-space-general-4xl">
        {screens.map((s, i) => (
          <div key={i} className="min-w-0" style={{ flex: `${s.width} 1 0%` }}>
            {s.node}
          </div>
        ))}
      </div>
    </ScrollRegion>
  );
}

/** Leyenda de colores de un diagrama */
export function Legend({ items }: { items: { className: string; label: string }[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-ds-space-general-4xl gap-y-ds-space-general-md p-0 text-ds-primitives-typography-size-md text-ds-text-neutral-body">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-ds-space-general-lg">
          <span aria-hidden="true" className={cn('size-4 border border-ds-border-general-gray-fifth', it.className)} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
