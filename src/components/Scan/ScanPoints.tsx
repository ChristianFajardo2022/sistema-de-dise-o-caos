import { forwardRef } from 'react';
import type { ScanPointsProps } from './Scan.types';
import { SCAN_POINTS_COUNT } from './Scan.types';
import { REDUCED_MOTION_QUERY, useMediaQuery } from '../../utils/useMediaQuery';
import { cn } from '../../utils/cn';

/** Esquina superior izquierda de cada punto de 5×5 (nombre del nodo en Figma → posición). */
const POINTS = [
  { id: 1, x: 92.5, y: 134.5 },
  { id: 2, x: 21.5, y: 129.5 },
  { id: 3, x: 62, y: 0 },
  { id: 4, x: 84.5, y: 99.5 },
  { id: 5, x: 118.5, y: 62.5 },
  { id: 6, x: 5.5, y: 54.5 },
  { id: 7, x: 48.5, y: 59.5 },
  { id: 8, x: 57, y: 167 },
] as const;

/** Orden en que los puntos pasan a opacidad completa (fotogramas 1 a 8 de Figma). */
const CAPTURE_ORDER = [6, 3, 7, 5, 4, 1, 8, 2];
const DIM = 0.3;
const FRAME_SECONDS = 0.45;

const opacityAt = (id: number, step: number) => (step <= 0 ? 0 : CAPTURE_ORDER.indexOf(id) < step ? 1 : DIM);

/**
 * Puntos del marco de captura (`points-scan`, 9 fotogramas). Un fotograma es `step` (0-8): los puntos se encienden en
 * orden. Con `animated` (por defecto) recorre los 9 fotogramas en bucle con SVG; con `prefers-reduced-motion: reduce`
 * o `animated={false}` muestra el fotograma fijo `step`. Decorativo salvo que se pase `label`.
 */
export const ScanPoints = forwardRef<SVGSVGElement, ScanPointsProps>(
  ({ step = SCAN_POINTS_COUNT, animated = true, label, className, ...restProps }, ref) => {
    const reduced = useMediaQuery(REDUCED_MOTION_QUERY);
    const run = animated && !reduced;
    const current = Math.min(SCAN_POINTS_COUNT, Math.max(0, Math.round(step)));
    const frames = Array.from({ length: SCAN_POINTS_COUNT + 1 }, (_, i) => i);
    // 9 fotogramas más una pausa al final antes de reiniciar
    const keyTimes = [...frames, SCAN_POINTS_COUNT].map((_, i, all) => (i / all.length).toFixed(4)).join(';');
    const dur = `${((SCAN_POINTS_COUNT + 2) * FRAME_SECONDS).toFixed(2)}s`;
    return (
      <svg
        ref={ref}
        width={129}
        height={175}
        viewBox="0 0 129 175"
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        className={cn('inline-block shrink-0', className)}
        {...restProps}
      >
        {POINTS.map(({ id, x, y }) => (
          <circle
            key={id}
            data-figma-part={String(id)}
            cx={x + 2.5}
            cy={y + 2.5}
            r={2.5}
            opacity={opacityAt(id, run ? 0 : current)}
            className="fill-ds-background-general-white-unicolor"
          >
            {run && (
              <animate
                attributeName="opacity"
                calcMode="discrete"
                dur={dur}
                repeatCount="indefinite"
                keyTimes={keyTimes}
                values={[...frames, SCAN_POINTS_COUNT].map((f) => opacityAt(id, f)).join(';')}
              />
            )}
          </circle>
        ))}
      </svg>
    );
  }
);

ScanPoints.displayName = 'ScanPoints';
