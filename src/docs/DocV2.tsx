import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { Avatar } from '../components/Avatar';
import { Icon } from '../components/Icon';
import type { IconName } from '../components/Icon/Icon.types';
import { NotchedSurface } from '../components/_internal/NotchedSurface';
import { cn } from '../utils/cn';
import { DocDeviceFrame } from './DocDeviceFrame';
import { DocBullets } from './DocParts';
import { colorVar, toHex } from './colorUtils';
import { DocSectionHeadContext, docBody } from './docShared';
import figmaLogo from './assets/figma-logo.png';
import type {
  DocAnatomyCanvas,
  DocAnatomyGroup,
  DocBreakpointCard,
  DocBreakpointColumn,
  DocInline,
  DocStateItem,
  DocTokenGroup,
  DocTone,
} from './types';

/*
 * Piezas v2 de la plantilla (estilo de las páginas Stepper de Figma, `.qa/docs/plantilla-v2.md`): tarjeta grande,
 * lienzo con puntos, anatomía medida del DOM, estados, tokens y modos, breakpoints y "Uso en Figma".
 * Todo sale de tokens (`src/styles/tokens.css`).
 */

// ───────────────────────── base ─────────────────────────

/** Etiqueta de columna / nombre de parte (Body-sm-600 short): Helvetica Neue semibold 14/18. */
const label600 =
  'm-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-lg font-ds-primitives-typography-weight-semibold';

/** Texto xs (Body-xs-400): 10/14. */
const xs = 'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-xs leading-ds-primitives-typography-line-height-sm';

// Figma: "Tarjeta" (Anatomía, Estados, Tokens y modos, Desktop…)
/**
 * Tarjeta grande: `default-on-canva`, radio `radius/container/on-canva` (32), padding `space/container/on-canva`, 40 entre
 * piezas y sombra lg (-12, 12, blur 100; alfa 0 en oscuro).
 */
export function DocBigCard({ children, className, ...rest }: { children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>) {
  return (
    <div
      {...rest}
      className={cn(
        'flex min-w-0 flex-col gap-ds-primitives-space-6xl rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva p-ds-space-container-on-canva text-ds-text-neutral-body shadow-[-12px_12px_100px_var(--color-ds-effect-shadow-on-canva-md)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Máscara del rombo de 2 px (cuadrado girado 45°) cada ~26.8 px: solo aporta la forma; el color es el del fondo del
 * elemento (`background/general/gray-sixth`).
 */
const DOT_MASK =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26.8' height='26.8'%3E%3Crect x='12.4' y='12.4' width='2' height='2' transform='rotate(45 13.4 13.4)'/%3E%3C/svg%3E\")";

// Figma: "Dots" sobre "Estado del indicador"
/** Lienzo con puntos: panel `default-on-card` (radio 24) con rombos decorativos de gray-sixth (en claro gray-fourth: gray-sixth es blanco y no se vería). */
export function DocDotsCanvas({ children, className, ...rest }: { children: ReactNode; className?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>) {
  return (
    <div
      {...rest}
      className={cn('relative isolate overflow-hidden rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card', className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-ds-background-general-gray-sixth light:bg-ds-background-general-gray-fourth"
        style={{ maskImage: DOT_MASK, maskSize: '26.8px 26.8px', WebkitMaskImage: DOT_MASK, WebkitMaskSize: '26.8px 26.8px' }}
      />
      {children}
    </div>
  );
}

/**
 * Marcador numerado ("Marker anatomy"), círculo de 24 con el número bold 12. Dos aspectos, como en Figma:
 * - `canvas` (sobre el lienzo, junto a la parte): sin relleno, borde de 1 px `border/acent/purpple` y número en
 *   `text/acent/firts`; su línea guía va en `background/acent/tertiary`.
 * - `list` (en las pautas numeradas): relleno `background/general/white` y número en `text/neutral/black`.
 */
// Figma: marcador del lienzo 22430:82308; marcador de las pautas 22458:90585
function Marker({ n, variant, className, style }: { n: number; variant: 'canvas' | 'list'; className?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-ds-radius-general-full font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-sm font-ds-primitives-typography-weight-bold tabular-nums',
        variant === 'canvas'
          ? 'border border-solid border-ds-border-acent-purpple text-ds-text-acent-firts'
          : 'bg-ds-background-general-white text-ds-text-neutral-black',
        className,
      )}
    >
      {n}
    </span>
  );
}

/** Pautas numeradas ("Pauta"): marcador y texto body 14/20, 10 de separación y 24 entre pautas. Es la fuente para lectores de pantalla. */
function Guidelines({ items }: { items: DocInline[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-ds-space-general-3xl p-0">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-ds-space-general-lg">
          <Marker n={i + 1} variant="list" />
          <span className={cn(docBody, 'pt-ds-space-general-sm')}>{item}</span>
        </li>
      ))}
    </ol>
  );
}

// ───────────────────────── anatomía ─────────────────────────

/** Distancia (px) del centro del marcador a su parte. */
const GUIDE = 40;
/** Radio del marcador: la línea guía nace en el borde del círculo, no en el número (el marcador no tiene relleno). */
const MARKER_RADIUS = 12;
/** Cuánto sobresalen de la parte las líneas de borde de una cota, y a qué distancia queda su etiqueta. */
const OVERSHOOT = 8;
const LABEL_GAP = 16;

interface MarkerOverlay {
  n: number;
  x: number;
  y: number;
  line: [number, number, number, number];
}

interface Band {
  /** Zona medida (padding o separación). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Eje del espacio medido: `x` horizontal (banda vertical, violeta) o `y` vertical (banda horizontal, verde). */
  axis: 'x' | 'y';
  value: number;
  /** Líneas de borde de 1 px (extremos) y posición de la etiqueta, fuera del componente. */
  edges: [number, number, number, number][];
  label: { x: number; y: number };
}

interface Bracket {
  x: number;
  y1: number;
  y2: number;
  value: number;
}

interface DimOverlay {
  bands: Band[];
  brackets: Bracket[];
}

function pick(view: HTMLElement, selector: string, index = 0): HTMLElement | null {
  const all = view.querySelectorAll<HTMLElement>(selector);
  if (all.length === 0) return null;
  return (index < 0 ? all[all.length + index] : all[index]) ?? null;
}

const round1 = (v: number) => Math.round(v * 10) / 10;

type Box = { l: number; t: number; r: number; b: number; w: number; h: number };

/** Caja de un elemento relativa al lienzo (`root`). */
const boxOf = (root: HTMLElement) => (el: HTMLElement): Box => {
  const base = root.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { l: r.left - base.left, t: r.top - base.top, r: r.right - base.left, b: r.bottom - base.top, w: r.width, h: r.height };
};

/** Marcadores de la copia superior: a GUIDE de la parte más saliente de su lado, con su línea guía. */
function measureMarkers(root: HTMLElement, view: HTMLElement, canvas: DocAnatomyCanvas): MarkerOverlay[] {
  const rect = boxOf(root);
  const found = canvas.marks.flatMap((m) => {
    const el = pick(view, m.selector, m.index);
    return el ? [{ m, r: rect(el) }] : [];
  });
  const edge = {
    top: Math.min(...found.filter((f) => f.m.side === 'top').map((f) => f.r.t)),
    bottom: Math.max(...found.filter((f) => f.m.side === 'bottom').map((f) => f.r.b)),
    left: Math.min(...found.filter((f) => f.m.side === 'left').map((f) => f.r.l)),
    right: Math.max(...found.filter((f) => f.m.side === 'right').map((f) => f.r.r)),
  };
  return found.map(({ m, r }) => {
    const cx = r.l + r.w / 2;
    const cy = r.t + r.h / 2;
    if (m.side === 'top') return { n: m.n, x: cx, y: edge.top - GUIDE, line: [cx, edge.top - GUIDE + MARKER_RADIUS, cx, r.t] };
    if (m.side === 'bottom') return { n: m.n, x: cx, y: edge.bottom + GUIDE, line: [cx, edge.bottom + GUIDE - MARKER_RADIUS, cx, r.b] };
    if (m.side === 'left') return { n: m.n, x: edge.left - GUIDE, y: cy, line: [edge.left - GUIDE + MARKER_RADIUS, cy, r.l, cy] };
    return { n: m.n, x: edge.right + GUIDE, y: cy, line: [edge.right + GUIDE - MARKER_RADIUS, cy, r.r, cy] };
  });
}

/**
 * Cotas de la copia inferior (como "Item spacing" de Figma): banda translúcida sobre la zona medida, dos líneas de
 * 1 px en sus bordes que sobresalen del componente y la cifra en una etiqueta fuera de él.
 */
function measureDimensions(root: HTMLElement, view: HTMLElement, canvas: DocAnatomyCanvas): DimOverlay {
  const rect = boxOf(root);
  const out: DimOverlay = { bands: [], brackets: [] };
  for (const d of canvas.dimensions ?? []) {
    if (d.kind === 'padding') {
      const el = pick(view, d.selector, d.index);
      if (!el) continue;
      const cs = getComputedStyle(el);
      const r = rect(el);
      const pad = { top: parseFloat(cs.paddingTop), bottom: parseFloat(cs.paddingBottom), left: parseFloat(cs.paddingLeft), right: parseFloat(cs.paddingRight) };
      const border = { top: parseFloat(cs.borderTopWidth), bottom: parseFloat(cs.borderBottomWidth), left: parseFloat(cs.borderLeftWidth), right: parseFloat(cs.borderRightWidth) };
      const value = pad[d.side];
      if (!(value > 0)) continue;
      const x0 = r.l + border.left;
      const y0 = r.t + border.top;
      const w = r.w - border.left - border.right;
      const h = r.h - border.top - border.bottom;
      const band = d.side === 'left' ? { x: x0, y: y0, w: value, h } : d.side === 'right' ? { x: x0 + w - value, y: y0, w: value, h } : d.side === 'top' ? { x: x0, y: y0, w, h: value } : { x: x0, y: y0 + h - value, w, h: value };
      const vertical = d.side === 'left' || d.side === 'right';
      out.bands.push({
        ...band,
        axis: vertical ? 'x' : 'y',
        value: round1(value),
        edges: vertical
          ? [[band.x, r.t - OVERSHOOT, band.x, r.b + OVERSHOOT], [band.x + band.w, r.t - OVERSHOOT, band.x + band.w, r.b + OVERSHOOT]]
          : [[r.l - OVERSHOOT, band.y, r.r + OVERSHOOT, band.y], [r.l - OVERSHOOT, band.y + band.h, r.r + OVERSHOOT, band.y + band.h]],
        // Padding horizontal: etiqueta arriba; vertical: a la derecha
        label: vertical ? { x: band.x + band.w / 2, y: r.t - OVERSHOOT - LABEL_GAP } : { x: r.r + OVERSHOOT + LABEL_GAP, y: band.y + band.h / 2 },
      });
    } else if (d.kind === 'gap') {
      const a = pick(view, d.from, d.fromIndex);
      const b = pick(view, d.to, d.toIndex);
      if (!a || !b) continue;
      const ra = rect(a);
      const rb = rect(b);
      const top = Math.min(ra.t, rb.t);
      const bottom = Math.max(ra.b, rb.b);
      const w = rb.l - ra.r;
      const host = a.closest('button, a') as HTMLElement | null;
      const hr = host ? rect(host) : { t: top, b: bottom };
      out.bands.push({
        x: ra.r,
        y: top,
        w,
        h: bottom - top,
        // La separación se mide entre elementos en fila: espacio horizontal
        axis: 'x',
        value: round1(w),
        edges: [[ra.r, hr.t - OVERSHOOT, ra.r, hr.b + OVERSHOOT], [rb.l, hr.t - OVERSHOOT, rb.l, hr.b + OVERSHOOT]],
        label: { x: ra.r + w / 2, y: hr.b + OVERSHOOT + LABEL_GAP },
      });
    } else {
      const el = pick(view, d.selector, d.index);
      if (!el) continue;
      const r = rect(el);
      out.brackets.push({ x: r.r + 10, y1: r.t, y2: r.b, value: round1(r.h) });
    }
  }
  return out;
}

/**
 * Cifra de una cota ("Spacer" de Figma): etiqueta de radio 4 con padding 3/1 y texto blanco, fuera del componente.
 * Color por eje, como en Figma: espacio horizontal en violeta (`background/graphic/acent-secondary`), vertical en verde
 * (`background/graphic/success-secondary`); los altos de Tamaños en gris.
 */
function ValueChip({ x, y, value, tone }: { x: number; y: number; value: number; tone: Band['axis'] | 'size' }) {
  return (
    <span
      className={cn(
        'absolute flex h-3.5 min-w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-ds-radius-general-sm px-0.5 font-ds-primitives-typography-weight-semibold text-ds-text-neutral-white-unicolor tabular-nums',
        xs,
        tone === 'x' && 'bg-ds-background-graphic-acent-secondary',
        tone === 'y' && 'bg-ds-background-graphic-success-secondary',
        tone === 'size' && 'bg-ds-background-graphic-neutral-secondary',
      )}
      style={{ left: x, top: y }}
    >
      {value}
    </span>
  );
}

/**
 * Lienzo de anatomía (como "Átomo vertical" de Figma): etiqueta (Heading 14 blanco) y un lienzo con puntos con dos copias
 * del componente real, una debajo de la otra. Arriba, la copia con los marcadores numerados y su línea guía de 1 px;
 * abajo, la copia con las cotas (bandas translúcidas con la cifra fuera del componente). Todo se mide del DOM con
 * `getBoundingClientRect` y se actualiza con `ResizeObserver`.
 */
function AnatomyCanvas({ canvas }: { canvas: DocAnatomyCanvas }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markViewRef = useRef<HTMLDivElement>(null);
  const dimViewRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<MarkerOverlay[]>([]);
  const [dims, setDims] = useState<DimOverlay>({ bands: [], brackets: [] });
  const hasDims = (canvas.dimensions?.length ?? 0) > 0;

  useLayoutEffect(() => {
    const root = rootRef.current;
    const markView = markViewRef.current;
    const dimView = dimViewRef.current;
    if (!root || !markView) return;
    const measure = () => {
      setMarkers(measureMarkers(root, markView, canvas));
      if (dimView) setDims(measureDimensions(root, dimView, canvas));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(markView);
    // Las fuentes cambian el ancho del texto
    void document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [canvas]);

  return (
    <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
      <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
        {canvas.label}
      </h3>
      <DocDotsCanvas>
        <div ref={rootRef} className="relative flex flex-col items-center gap-ds-primitives-space-9xl px-ds-primitives-space-6xl py-ds-primitives-space-8xl">
          <div ref={markViewRef} className="flex items-end gap-ds-primitives-space-8xl">
            {canvas.preview}
          </div>
          {hasDims && (
            <div ref={dimViewRef} className="flex items-end gap-ds-primitives-space-8xl">
              {canvas.preview}
            </div>
          )}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-ds-text-neutral-heading">
            <svg className="absolute inset-0 size-full overflow-visible">
              {dims.bands.map((b, i) => (
                <g key={`b${i}`} className={b.axis === 'x' ? 'text-ds-background-graphic-acent-secondary' : 'text-ds-background-graphic-success-secondary'}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} className={b.axis === 'x' ? 'fill-ds-background-graphic-acent-secondary-opacity' : 'fill-ds-background-graphic-success-secondary-opacity'} />
                  {b.edges.map((e, k) => (
                    <line key={k} x1={e[0]} y1={e[1]} x2={e[2]} y2={e[3]} stroke="currentColor" strokeWidth={1} />
                  ))}
                </g>
              ))}
              {/* Línea guía del color del marcador */}
              {markers.map((m) => (
                <line key={`l${m.n}`} x1={m.line[0]} y1={m.line[1]} x2={m.line[2]} y2={m.line[3]} stroke="currentColor" strokeWidth={1} className="text-ds-background-acent-tertiary" />
              ))}
              {dims.brackets.map((b, i) => (
                <path key={`k${i}`} d={`M${b.x - 4} ${b.y1}H${b.x}V${b.y2}H${b.x - 4}`} fill="none" stroke="currentColor" strokeWidth={1} />
              ))}
            </svg>
            {dims.bands.map((b, i) => (
              <ValueChip key={`v${i}`} x={b.label.x} y={b.label.y} value={b.value} tone={b.axis} />
            ))}
            {dims.brackets.map((b, i) => (
              <ValueChip key={`s${i}`} x={b.x + 14} y={(b.y1 + b.y2) / 2} value={b.value} tone="size" />
            ))}
            {markers.map((m) => (
              <Marker key={`m${m.n}`} n={m.n} variant="canvas" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: m.x, top: m.y }} />
            ))}
          </div>
        </div>
      </DocDotsCanvas>
    </div>
  );
}

// Figma: 22466:64567 (lienzos), 22466:64569 (pautas)
/** Anatomía v2: una tarjeta grande con uno o más grupos (1 o 2 lienzos y sus pautas numeradas debajo). */
export function DocAnatomyV2({ groups }: { groups: DocAnatomyGroup[] }) {
  return (
    <DocBigCard>
      {groups.map((group, g) => (
        <div key={g} className="flex flex-col gap-ds-primitives-space-5xl">
          <div className={cn('grid grid-cols-1 gap-ds-primitives-space-5xl', group.canvases.length > 1 && '@2xl:grid-cols-2')}>
            {group.canvases.map((canvas) => (
              <AnatomyCanvas key={canvas.label} canvas={canvas} />
            ))}
          </div>
          <Guidelines items={group.guidelines} />
        </div>
      ))}
    </DocBigCard>
  );
}

// ───────────────────────── estados ─────────────────────────

const toneClass: Record<DocTone, string> = {
  neutral: 'text-ds-text-neutral-gray-2',
  accent: 'text-ds-text-acent-firts',
  success: 'text-ds-text-semantic-success-secondary',
  error: 'text-ds-text-semantic-error-secondary',
};

// Figma: 22627:8694 (Estados)
/**
 * Estados: tarjeta grande con una columna por estado (grilla `auto-fill`, mínimo 200): etiqueta con tono, descripción y
 * un panel `default-on-card` (radio 24) con una muestra por tile (`default-on-canva`, radio 8, padding 8).
 */
export function DocStatesV2({ items }: { items: DocStateItem[] }) {
  return (
    <DocBigCard>
      <div className="grid gap-ds-primitives-space-4xl [grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr))]">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col gap-ds-space-general-2xl">
            <h3 className={cn(label600, toneClass[item.tone ?? 'neutral'])}>{item.label}</h3>
            <p className={cn(docBody, 'min-h-20')}>{item.description}</p>
            <div className="flex min-w-0 flex-1 flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card p-ds-space-general-2xl">
              {item.samples.map((sample, i) => (
                <div key={i} className="flex min-w-0 items-center justify-center overflow-hidden rounded-ds-radius-general-md bg-ds-background-container-default-on-canva p-ds-space-general-lg">
                  {sample}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DocBigCard>
  );
}

// ───────────────────────── tokens y modos ─────────────────────────

type Mode = 'dark' | 'light';


function currentDocTheme(): Mode {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** Chip de token ("Attribute"): pastilla gray-seventh con el nombre y, si es de color, un chip gray-sixth con muestra, hex y copiar. */
function TokenChip({ name, hex, onCopy }: { name: string; hex?: string; onCopy?: (hex: string) => void }) {
  return (
    <span className={cn('inline-flex max-w-full items-center gap-ds-space-general-md rounded-ds-radius-general-full bg-ds-background-general-gray-seventh py-ds-space-general-md pr-ds-primitives-space-lg pl-ds-space-general-lg text-ds-text-neutral-body', xs)}>
      <span className="min-w-0 break-all">{name}</span>
      {hex !== undefined && (
        <span className="inline-flex shrink-0 items-center gap-ds-space-general-md rounded-ds-radius-general-lg bg-ds-background-general-gray-sixth px-ds-space-general-md py-ds-space-general-sm text-ds-text-neutral-heading">
          <span
            aria-hidden="true"
            className="size-3 rounded-ds-radius-general-sm shadow-[inset_0_0_0_1px_var(--color-ds-border-general-default-on-canva)]"
            style={{ backgroundColor: colorVar(name) }}
          />
          <span className="tabular-nums">{hex || '…'}</span>
          <button
            type="button"
            aria-label={`Copiar ${hex} (${name})`}
            onClick={() => onCopy?.(hex)}
            className="flex size-3 cursor-pointer items-center justify-center rounded-ds-radius-general-sm border-0 bg-transparent p-0 text-ds-icon-general-default outline-none focus-visible:outline-2 focus-visible:outline-ds-border-general-white"
          >
            <Icon name="document-copy" size={12} variant="line" />
          </button>
        </span>
      )}
    </span>
  );
}

// Figma: 22627:10448 (cabecera con el interruptor), 22627:11802 (fila de token)
/**
 * Tokens y modos: toda la sección es una tarjeta grande con el título y la bajada adentro y, a la derecha, el
 * interruptor de modo. El interruptor cambia solo esta tarjeta (`data-theme` y clase `light`/`dark`; los tokens admiten
 * tema por contenedor). El hex de cada token se calcula en vivo con `getComputedStyle` sobre un elemento sonda de la
 * tarjeta, así cambia con el modo.
 */
export function DocTokensV2({ groups }: { groups: DocTokenGroup[] }) {
  const head = useContext(DocSectionHeadContext);
  const [mode, setMode] = useState<Mode>(currentDocTheme);
  const [hexes, setHexes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const probeRef = useRef<HTMLSpanElement>(null);

  // La tarjeta sigue al tema de la página mientras este cambie (la barra de Storybook)
  useEffect(() => {
    const observer = new MutationObserver(() => setMode(currentDocTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const next: Record<string, string> = {};
    for (const group of groups) {
      for (const entry of group.entries) {
        if (!entry.color || entry.color in next) continue;
        probe.style.color = colorVar(entry.color);
        next[entry.color] = toHex(getComputedStyle(probe).color);
      }
    }
    setHexes(next);
  }, [mode, groups]);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setMessage(`Copiado ${hex}`);
    } catch {
      setMessage(`No se pudo copiar ${hex}`);
    }
  };

  const options: { value: Mode; label: string; icon: IconName }[] = [
    { value: 'light', label: 'Modo claro', icon: 'sun' },
    { value: 'dark', label: 'Modo oscuro', icon: 'moon' },
  ];

  return (
    <DocBigCard data-theme={mode} className={cn(mode, 'text-ds-text-neutral-body')}>
      <span ref={probeRef} aria-hidden="true" className="pointer-events-none invisible absolute size-0 overflow-hidden" />
      <div className="flex items-start justify-between gap-ds-space-general-4xl">
        <div className="flex min-w-0 flex-col gap-ds-space-general-xl">
          {head && (
            <h2
              id={head.headingId}
              className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading text-balance"
            >
              {head.title}
            </h2>
          )}
          {head?.description && <p className={docBody}>{head.description}</p>}
        </div>
        <div role="group" aria-label="Modo de color" className="flex shrink-0 gap-ds-space-general-lg rounded-ds-radius-general-full bg-ds-background-container-default-on-card p-ds-space-general-lg shadow-ds-on-card">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              aria-pressed={mode === o.value}
              aria-label={o.label}
              onClick={() => setMode(o.value)}
              className={cn(
                'flex size-10 cursor-pointer items-center justify-center rounded-ds-radius-general-full border-0 p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ds-border-general-white',
                mode === o.value ? 'bg-ds-background-general-white text-ds-text-neutral-black' : 'bg-transparent text-ds-icon-general-default',
              )}
            >
              <Icon name={o.icon} size={24} variant="fill" />
            </button>
          ))}
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
      <div className="flex flex-col gap-ds-primitives-space-5xl">
        {groups.map((group) => (
          <div key={group.title} className="grid grid-cols-1 gap-ds-primitives-space-5xl @2xl:grid-cols-2">
            <DocDotsCanvas className="flex min-h-56 items-center justify-center p-ds-primitives-space-5xl">
              <div className="flex flex-wrap items-center justify-center gap-ds-space-general-4xl">{group.preview}</div>
            </DocDotsCanvas>
            <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
              <h3 className={cn(label600, 'text-ds-text-neutral-heading')}>{group.title}</h3>
              <ul className="m-0 flex list-none flex-col p-0">
                {group.entries.map((entry) => (
                  <li key={entry.part} className="flex flex-col gap-ds-space-general-lg border-t border-ds-border-general-default-on-canva py-ds-space-general-2xl first:border-t-0">
                    <h4 className={cn(label600, 'text-ds-text-neutral-heading')}>{entry.part}</h4>
                    {entry.color && (
                      <div className="flex flex-wrap items-center gap-ds-space-general-lg">
                        <span className={xs}>Token Color:</span>
                        <TokenChip name={entry.color} hex={hexes[entry.color] ?? ''} onCopy={copy} />
                      </div>
                    )}
                    {entry.text && (
                      <div className="flex flex-wrap items-center gap-ds-space-general-lg">
                        <span className={xs}>Token Text:</span>
                        <TokenChip name={entry.text} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </DocBigCard>
  );
}

// ───────────────────────── breakpoints ─────────────────────────

/** Glifo "mobile" de 24 del Avatar de Mobile / Tablet (no está en la biblioteca de íconos; `currentColor`). */
const MobileGlyph = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      fill="currentColor"
      d="M15.5 2H8.5C6.03 2 4 4.02 4 6.5V17.5C4 19.97 6.03 22 8.5 22H15.5C17.98 22 20 19.97 20 17.5V6.5C20 4.02 17.98 2 15.5 2ZM12 19.25C11.31 19.25 10.75 18.69 10.75 18C10.75 17.31 11.3 16.75 12 16.75C12.69 16.75 13.25 17.31 13.25 18C13.25 18.69 12.7 19.25 12 19.25ZM14 6.75H10C9.59 6.75 9.25 6.41 9.25 6C9.25 5.59 9.59 5.25 10 5.25H14C14.41 5.25 14.75 5.59 14.75 6C14.75 6.41 14.41 6.75 14 6.75Z"
    />
  </svg>
);

/** Cabecera de tarjeta de breakpoint: Avatar (56) y título Prospero 20/24, 24 de separación. */
function BreakpointHead({ title, kind }: { title: string; kind: 'desktop' | 'mobile' }) {
  return (
    <div className="flex items-center gap-ds-space-general-3xl">
      {kind === 'desktop' ? (
        <Avatar variant="icon" size="lg" contrast="on-card" icon="folder" />
      ) : (
        // El ícono "mobile" no está en la biblioteca: va como logo de un Avatar brand, que usa el mismo fondo
        <Avatar variant="brand" size="lg" contrast="on-canva" logo={MobileGlyph} />
      )}
      <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg font-ds-primitives-typography-weight-semibold text-ds-text-neutral-white">
        {title}
      </h3>
    </div>
  );
}

function DesktopColumn({ column }: { column: DocBreakpointColumn }) {
  return (
    <div className="flex min-w-0 flex-col gap-ds-space-general-3xl">
      <h4 className={cn(label600, 'text-ds-text-neutral-white')}>{column.title}</h4>
      <DocBullets items={column.bullets} />
      <DocDeviceFrame breakpoint="desktop" className="flex-1">
        {column.preview}
      </DocDeviceFrame>
    </div>
  );
}

function DeviceCard({ title, breakpoint, card }: { title: string; breakpoint: 'mobile' | 'tablet'; card: DocBreakpointCard }) {
  return (
    <DocBigCard>
      <DocDeviceFrame breakpoint={breakpoint} className="mx-auto min-h-80 max-w-sm">
        {card.preview}
      </DocDeviceFrame>
      <BreakpointHead title={title} kind="mobile" />
      <DocBullets items={card.bullets} />
    </DocBigCard>
  );
}

// Figma: 22659:13127 (Desktop), 22648:12735 (Mobile), 22685:15690 (Tablet)
/**
 * Aplicaciones de breakpoints: tarjeta Desktop a todo el ancho (dos columnas con subtítulo, viñetas y vista) y debajo
 * Mobile y Tablet. Cada vista se dibuja con las variables `--ds-responsive-*` de su breakpoint (`DocDeviceFrame`).
 */
export function DocBreakpointsV2({ desktop, mobile, tablet }: { desktop: { columns: DocBreakpointColumn[] }; mobile: DocBreakpointCard; tablet: DocBreakpointCard }) {
  return (
    <div className="flex flex-col gap-ds-primitives-space-5xl">
      <DocBigCard>
        <BreakpointHead title="Desktop" kind="desktop" />
        <div className="grid grid-cols-1 gap-ds-primitives-space-5xl @3xl:grid-cols-2">
          {desktop.columns.map((column) => (
            <DesktopColumn key={column.title} column={column} />
          ))}
        </div>
      </DocBigCard>
      <div className="grid grid-cols-1 gap-ds-primitives-space-5xl @3xl:grid-cols-2">
        <DeviceCard title="Mobile" breakpoint="mobile" card={mobile} />
        <DeviceCard title="Tablet" breakpoint="tablet" card={tablet} />
      </div>
    </div>
  );
}

// ───────────────────────── uso en Figma ─────────────────────────

// Figma: 22542:44196 (Uso en Figma)
/**
 * "Uso en Figma": Card con muesca arriba a la izquierda (la capa de `NotchedSurface`, espejada), círculo de 56 con el
 * logo, título Prospero 14/18 y viñetas. Padding: izquierda 80, derecha 24, arriba y abajo 40.
 */
export function DocFigmaV2({ bullets }: { bullets: DocInline[] }) {
  const head = useContext(DocSectionHeadContext);
  return (
    <div
      className="relative isolate flex min-w-0 flex-col gap-ds-space-general-3xl py-ds-primitives-space-6xl pr-ds-space-container-on-canva-stretch pl-ds-primitives-space-9xl"
    >
      <NotchedSurface notch="xl" shadow="on-canva" fill="var(--color-ds-background-container-default-on-canva)" className="-scale-x-100" />
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 flex size-14 items-center justify-center rounded-ds-radius-general-full bg-ds-background-container-default-on-canva"
      >
        <img src={figmaLogo} alt="" width={21} height={32} className="h-8 w-[21px]" />
      </span>
      {head && (
        <h2 id={head.headingId} className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
          {head.title}
        </h2>
      )}
      <DocBullets items={bullets} />
    </div>
  );
}
