import { createElement, forwardRef, useId } from 'react';
import type { ReactNode } from 'react';
import type { ScanGuideProps, ScanGuideType } from './Scan.types';
import { GUIDE_DOTS, GUIDE_SHAPES, GUIDE_SPOT_TRANSFORM } from './ScanGuide.shapes';
import type { ShapeNode } from './ScanGuide.shapes';
import { REDUCED_MOTION_QUERY, useMediaQuery } from '../../utils/useMediaQuery';
import { cn } from '../../utils/cn';

/** Fotogramas (`Transition` de Figma) que tiene cada tipo. */
const FRAME_COUNT: Record<ScanGuideType, number> = { face: 2, code: 2, id: 3, qr: 2 };
const PHASE_SECONDS = 1.2;
/** Fracción de cada fase que dura el fundido entre fotogramas. */
const FADE = 0.06;

/** Colores fijos de las figuras exportadas de Figma (#FEFEFE, #898E98, #1D1C1C) → variable de token. */
const FIGMA_COLORS: Record<string, string> = {
  '#FEFEFE': 'var(--color-ds-background-general-white)',
  '#898E98': 'var(--color-ds-background-general-gray-fifth)',
  '#1D1C1C': 'var(--color-ds-background-container-default-on-canva)',
};
const STROKE_COLOR = 'var(--color-ds-border-general-white)';

const camel = (name: string) => name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** Dibuja un nodo exportado de Figma: atributos en camelCase, colores a tokens e ids con prefijo único. */
function renderShape(node: ShapeNode, prefix: string, key: number): ReactNode {
  const props: Record<string, unknown> = { key };
  for (const [name, raw] of Object.entries(node.a)) {
    if (name === 'xmlns') continue;
    let value: string = raw;
    if (name === 'id') value = prefix + raw;
    else if (value.includes('url(#')) value = value.replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${prefix}${id})`);
    else if (name === 'stroke' && FIGMA_COLORS[value.toUpperCase()]) value = STROKE_COLOR;
    else if ((name === 'fill' || name === 'stop-color') && FIGMA_COLORS[value.toUpperCase()]) value = FIGMA_COLORS[value.toUpperCase()];
    props[camel(name)] = value;
  }
  // SVG pasa los colores por `style`/atributo: las variables CSS solo se resuelven en `style`
  for (const attr of ['fill', 'stroke', 'stopColor'] as const) {
    const v = props[attr];
    if (typeof v === 'string' && v.startsWith('var(')) {
      props.style = { ...(props.style as object), [attr]: v };
      delete props[attr];
    }
  }
  return createElement(node.t, props, node.c?.map((child, i) => renderShape(child, prefix, i)));
}

/** Opacidad de un fotograma a lo largo del bucle: fundido cruzado entre fotogramas contiguos. */
function opacityKeys(i: number, n: number): { keyTimes: string; values: string } {
  const s = i / n;
  const e = (i + 1) / n;
  const w = FADE / n;
  let pts: [number, number][];
  if (n === 1) pts = [[0, 1], [1, 1]];
  else if (i === 0) pts = [[0, 1], [e - w, 1], [e, 0], [1 - w, 0], [1, 1]];
  else if (i === n - 1) pts = [[0, 0], [s - w, 0], [s, 1], [1 - w, 1], [1, 0]];
  else pts = [[0, 0], [s - w, 0], [s, 1], [e - w, 1], [e, 0], [1, 0]];
  return { keyTimes: pts.map(([t]) => t.toFixed(4)).join(';'), values: pts.map(([, v]) => v).join(';') };
}

/**
 * Guía animada del escaneo (`animation-scan`): rejilla de 120 puntos con foco de luz radial, visor de esquinas y la
 * figura del tipo (rostro, código de barras, documento o QR). Los trazados son los exportados de Figma (SVG de cada
 * fotograma). Con `animated` (por defecto) los fotogramas se encadenan en bucle con fundido cruzado y el foco de luz
 * se expande (SMIL); con `prefers-reduced-motion: reduce` o `animated={false}` queda fija en `frame`.
 * Decorativa salvo que se pase `label`.
 */
export const ScanGuide = forwardRef<HTMLDivElement, ScanGuideProps>(
  ({ type = 'face', frame = 2, animated = true, label, className, ...restProps }, ref) => {
    const uid = useId().replace(/:/g, '');
    const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
    const run = animated && !reduced;
    const shapes = GUIDE_SHAPES[type];
    const count = FRAME_COUNT[type];
    const f = Math.min(count, Math.max(1, Math.round(frame))) - 1;
    const dur = `${count * PHASE_SECONDS}s`;
    const gradientId = `${uid}-spot`;
    const spot = shapes.spot;
    const visible = run ? shapes.frames.map((_, i) => i) : [f];

    return (
      <div
        ref={ref}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={cn('relative box-border flex h-[140px] w-[334px] shrink-0 items-center justify-center gap-2.5 p-1', className)}
        {...restProps}
      >
        <svg width={334} height={140} viewBox="0 0 334 140" fill="none" focusable="false" className="absolute top-0 left-0 max-w-none">
          <defs>
            <radialGradient id={gradientId} cx={0} cy={0} r={1} gradientUnits="userSpaceOnUse" gradientTransform={GUIDE_SPOT_TRANSFORM}>
              <stop style={{ stopColor: FIGMA_COLORS['#898E98'] }} />
              <stop offset={spot[run ? 0 : f]} style={{ stopColor: FIGMA_COLORS['#1D1C1C'] }}>
                {run && (
                  <animate
                    attributeName="offset"
                    dur={dur}
                    repeatCount="indefinite"
                    calcMode="linear"
                    values={[...spot, spot[0]].join(';')}
                    keyTimes={[...spot, spot[0]].map((_, i) => (i / spot.length).toFixed(4)).join(';')}
                  />
                )}
              </stop>
            </radialGradient>
          </defs>
          <path data-figma-part="points" d={GUIDE_DOTS} fill={`url(#${gradientId})`} />
          {shapes.common.map((node, i) => renderShape(node, `${uid}-c-`, i))}
          {visible.map((i) => {
            const prefix = `${uid}-${i}-`;
            const keys = run ? opacityKeys(i, count) : null;
            return (
              <g key={i} opacity={keys ? (i === 0 ? 1 : 0) : undefined}>
                {keys && <animate attributeName="opacity" dur={dur} repeatCount="indefinite" calcMode="linear" keyTimes={keys.keyTimes} values={keys.values} />}
                <defs>{shapes.frames[i].defs.map((node, k) => renderShape(node, prefix, k))}</defs>
                {shapes.frames[i].nodes.map((node, k) => renderShape(node, prefix, k))}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

ScanGuide.displayName = 'ScanGuide';
