import { forwardRef, useId } from 'react';
import type { ScanProgressProps } from './Scan.types';
import { scanProgressValueVariants, scanProgressVariants } from './Scan.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/** Anillo de 60×60 exportado de Figma: radio exterior 30 y grosor 3 (línea media en radio 28,5). */
const RADIUS = 28.5;
const STROKE = 3;
/** Arco que arranca arriba y gira en sentido horario, en dos medias vueltas (un arco SVG no cierra el círculo entero). */
const ARC = `M30 ${30 - RADIUS} A${RADIUS} ${RADIUS} 0 1 1 30 ${30 + RADIUS} A${RADIUS} ${RADIUS} 0 1 1 30 ${30 - RADIUS}`;

/**
 * Progreso del escaneo (`progress-scan`, 0 a 100 %). Es un `role="progressbar"` con nombre (`label`); el porcentaje
 * visible es redundante y queda fuera del árbol de accesibilidad. El arco avanza con una transición corta que se
 * apaga con `prefers-reduced-motion: reduce` (queda el valor final). `complete` dibuja el estado terminado.
 */
export const ScanProgress = forwardRef<HTMLDivElement, ScanProgressProps>(
  ({ value = 0, complete = false, label = 'Progreso del escaneo', showValue = true, className, ...restProps }, ref) => {
    const gradientId = useId();
    const safe = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    const shown = complete ? 100 : Math.round(safe);
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        aria-valuetext={complete ? 'Completado' : `${shown} %`}
        className={cn(scanProgressVariants(), className)}
        {...restProps}
      >
        <svg width={60} height={60} viewBox="0 0 60 60" aria-hidden="true" focusable="false" className="absolute inset-0">
          <defs>
            {/* Figma: lineal de success/secondary a success/fourth (en el estado terminado, de tertiary a fourth al 72 %) */}
            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="30" y2="60">
              <stop offset="0" style={{ stopColor: `var(${complete ? '--color-ds-background-semantic-success-tertiary' : '--color-ds-background-semantic-success-secondary'})` }} />
              <stop offset={complete ? 0.724613 : 1} style={{ stopColor: 'var(--color-ds-background-semantic-success-fourth)' }} />
            </linearGradient>
          </defs>
          {complete ? (
            <circle data-figma-part="Ellipse 2" cx={30} cy={30} r={30} fill={`url(#${gradientId})`} />
          ) : (
            <>
              <circle
                data-figma-part="Ellipse 1"
                cx={30}
                cy={30}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE}
                className="stroke-ds-background-general-white-unicolor"
              />
              <path
                data-figma-part="Ellipse 2"
                d={ARC}
                pathLength={100}
                fill="none"
                strokeWidth={STROKE}
                strokeLinecap="round"
                stroke={`url(#${gradientId})`}
                strokeDasharray={`${safe} 100`}
                opacity={safe > 0 ? 1 : 0}
                className="transition-[stroke-dasharray] duration-300 ease-out motion-reduce:transition-none"
              />
            </>
          )}
        </svg>
        {complete ? (
          <span className="absolute top-[18.17px] left-[18px] flex">
            <Icon name="tick-circle" variant="line" size={24} className="text-ds-icon-general-default" data-figma-part="Icon-sizes" />
          </span>
        ) : (
          showValue && (
            <span aria-hidden="true" data-figma-part={`${shown}%`} className={scanProgressValueVariants()}>
              {shown}%
            </span>
          )
        )}
      </div>
    );
  }
);

ScanProgress.displayName = 'ScanProgress';
