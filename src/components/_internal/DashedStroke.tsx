import type { SVGAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface DashedStrokeProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Largo de guion y de espacio, en px. Figma usa 8/8 en los recuadros de carga y 5/5 en Empty state. */
  dash?: number;
  /** Radio de esquina como valor CSS (`var(--radius-ds-radius-field-lg)`, `24px`…). Se descuenta medio trazo. */
  radius?: string;
}

/**
 * Trazo punteado (pieza interna, no se exporta desde el paquete). `border-dashed` no da el patrón fijo de Figma, así que
 * el contorno se dibuja con un `<rect>` SVG de 1 px que ocupa todo el elemento posicionado más cercano (`absolute inset-0`,
 * sin interceptar el puntero) y toma el color de `currentColor`. Es decorativo (`aria-hidden`). Lo usan FileDropzone,
 * FileUploadSimple y EmptyState.
 */
export function DashedStroke({
  dash = 8,
  radius = 'var(--radius-ds-radius-field-lg)',
  className,
  ...rest
}: DashedStrokeProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      {...rest}
      className={cn('pointer-events-none absolute inset-0 size-full overflow-visible', className)}
    >
      <rect
        x="0.5"
        y="0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray={`${dash} ${dash}`}
        style={{
          width: 'calc(100% - 1px)',
          height: 'calc(100% - 1px)',
          rx: `calc(${radius} - 0.5px)`,
        }}
      />
    </svg>
  );
}
