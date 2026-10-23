import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

/**
 * Superficie de las tarjetas (marco "Canva" + forma "Subtract" de Figma). Pieza interna: no se exporta desde el paquete.
 * La usan FileCard, InteractiveCard, InformationCard y DataCard.
 *
 * - Va detrás del contenido (`absolute inset-0 -z-10`): la raíz de la tarjeta queda transparente, como en Figma.
 *   La raíz debe ser `relative isolate`.
 * - Esquinas de radius/general/2xl (24).
 * - Colores por variables CSS que pone la tarjeta (así cambian con :hover o :checked sin tocar la geometría):
 *   - `--surface-fill`: relleno.
 *   - `--surface-edge`: trazo interior de 1 px (border/general/lg). Sin él el trazo toma el color del relleno y no se ve.
 * - `notch`: muesca arriba a la derecha donde va el Button corner. `md` = 48 (Button corner de 40), `sm` = 40 (de 32).
 *   Geometría de Figma (rectángulo menos un cuadrado de N×N con las esquinas redondeadas a N/2): esquina convexa de N/2
 *   antes de la muesca, curva cóncava de radio N/2 con centro a N/2 del borde derecho y del superior, y esquina convexa
 *   de N/2 al bajar por el borde derecho. Se recorta con una máscara de gradientes (`border-radius` no la hace), así la
 *   siguen el relleno, el trazo y el contenido recortado. La capa interior usa la misma muesca desplazada 1 px.
 * - `shadow`: con muesca, `filter: drop-shadow` sobre esta capa (sigue el canal alfa de la máscara; nunca en la raíz de
 *   la tarjeta, que rasterizaría el contenido). Sin muesca, `box-shadow` con los tokens `shadow-ds-on-card`
 *   (effect/shadow sm, en la capa Canva) y `shadow-ds-on-canva` (effect/shadow md con spread −2, en la capa Subtract),
 *   como en Figma. Las sombras de CAOS tienen alfa 0 en oscuro. Una sombra condicional (p. ej. solo en hover) se pasa
 *   por `className`.
 * - `fill`: relleno plano sin trazo (p. ej. el Backdrop de la miniatura de FileCard).
 * - `children`: contenido recortado por la silueta (una foto). Con contenido deja de ser `aria-hidden`.
 */

export type NotchedSurfaceNotch = 'none' | 'sm' | 'md';
export type NotchedSurfaceShadow = 'none' | 'on-card' | 'on-canva' | 'on-card-on-canva';

const NOTCH_SIZE = { sm: 40, md: 48 } as const;

const SOLID = 'linear-gradient(#000,#000)';

/**
 * Máscara de la silueta. `a` = ancho de la muesca desde el borde derecho, `v` = radio de las esquinas convexas
 * (y distancia del centro de la curva cóncava a los bordes); el radio cóncavo es `a - v`.
 */
function notchMask(a: number, v: number): CSSProperties {
  const c = a - v;
  const layers: [image: string, size: string, position: string][] = [
    // Todo lo que queda a la izquierda de la muesca
    [SOLID, `calc(100% - ${a + v}px) 100%`, 'left top'],
    // Todo lo que queda debajo de la muesca
    [SOLID, `100% calc(100% - ${a + v}px)`, 'left bottom'],
    // Esquina convexa antes de la muesca
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right ${a}px top 0`],
    [SOLID, `${v}px ${a}px`, `right ${a}px top ${v}px`],
    // Curva cóncava
    [`radial-gradient(circle at 100% 0,transparent ${c - 0.5}px,#000 ${c + 0.5}px)`, `${c}px ${c}px`, `right ${v}px top ${v}px`],
    [SOLID, `${c}px ${v}px`, `right ${v}px top ${a}px`],
    // Esquina convexa al bajar por el borde derecho
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right 0 top ${a}px`],
  ];
  const image = layers.map((l) => l[0]).join(',');
  const size = layers.map((l) => l[1]).join(',');
  const position = layers.map((l) => l[2]).join(',');
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: size,
    WebkitMaskSize: size,
    maskPosition: position,
    WebkitMaskPosition: position,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
}

// drop-shadow no admite spread: se usa el x/y/blur de effect/shadow sm (0 4 12) y md (0 12 32)
const DROP_SHADOW: Record<NotchedSurfaceShadow, string> = {
  none: '',
  'on-card': '[filter:drop-shadow(0_4px_12px_var(--ds-responsive-effect-shadow-sm))]',
  'on-canva': '[filter:drop-shadow(0_12px_32px_var(--ds-responsive-effect-shadow-md))]',
  'on-card-on-canva':
    '[filter:drop-shadow(0_4px_12px_var(--ds-responsive-effect-shadow-sm))_drop-shadow(0_12px_32px_var(--ds-responsive-effect-shadow-md))]',
};

export interface NotchedSurfaceProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Muesca arriba a la derecha: `md` = 48 (Button corner de 40), `sm` = 40 (de 32). Por defecto `none`. */
  notch?: NotchedSurfaceNotch;
  /** Sombra de la superficie (effect/shadow sm = on-card, md = on-canva). Por defecto `none`. */
  shadow?: NotchedSurfaceShadow;
  /** Relleno plano sin trazo (valor CSS). Sin él: relleno `--surface-fill` y trazo `--surface-edge`. */
  fill?: string;
  /** Contenido recortado por la silueta (p. ej. una foto). */
  children?: ReactNode;
  'data-figma-part'?: string;
}

export function NotchedSurface({ notch = 'none', shadow = 'none', fill, children, className, style, ...rest }: NotchedSurfaceProps) {
  const a = notch === 'none' ? 0 : NOTCH_SIZE[notch];
  const v = a / 2;
  const notched = a > 0;
  const outerMask = notched ? notchMask(a, v) : undefined;
  // 1 px adentro: misma muesca desplazada (convexas v - 1, cóncava v + 1)
  const innerMask = notched ? notchMask(a, v - 1) : undefined;
  const boxShadow = !notched && shadow !== 'none';
  return (
    <span
      aria-hidden={children ? undefined : true}
      data-figma-part="Canva"
      {...rest}
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 block',
        notched ? DROP_SHADOW[shadow] : 'rounded-ds-radius-general-2xl',
        boxShadow && (shadow === 'on-card' || shadow === 'on-card-on-canva') && 'shadow-ds-on-card',
        className
      )}
      style={style}
    >
      {fill ? (
        <span className="absolute inset-0 block rounded-ds-radius-general-2xl" style={{ ...outerMask, backgroundColor: fill }} />
      ) : (
        // Capa exterior: color del trazo (o del relleno si no hay trazo)
        <span
          className={cn(
            'absolute inset-0 block rounded-ds-radius-general-2xl bg-(color:--surface-edge,var(--surface-fill))',
            boxShadow && (shadow === 'on-canva' || shadow === 'on-card-on-canva') && 'shadow-ds-on-canva'
          )}
          style={outerMask}
        >
          {/* Capa interior: relleno, 1 px (border/general/lg) hacia dentro */}
          <span
            className="absolute inset-(--ds-responsive-border-general-lg) block overflow-hidden rounded-[calc(var(--ds-responsive-radius-general-2xl)-var(--ds-responsive-border-general-lg))] bg-(color:--surface-fill)"
            style={innerMask}
          >
            {children}
          </span>
        </span>
      )}
    </span>
  );
}
