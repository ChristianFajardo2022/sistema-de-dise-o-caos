import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import type { NotchedSurfaceShadow } from './shadows';
import { cn } from '../../utils/cn';
import { SOLID_MASK, maskStyle } from './mask';
import { DROP_SHADOW } from './shadows';

/**
 * Superficie de las tarjetas (marco "Canva" + forma "Subtract" de Figma). Pieza interna: no se exporta desde el paquete.
 * La usan FileCard, InteractiveCard, InformationCard, DataCard y las tarjetas de la tanda 4B.
 *
 * - Va detrás del contenido (`absolute inset-0 -z-10`): la raíz de la tarjeta queda transparente, como en Figma.
 *   La raíz debe ser `relative isolate`.
 * - Esquinas de radius/general/2xl (24).
 * - Colores por variables CSS que pone la tarjeta (así cambian con :hover o :checked sin tocar la geometría):
 *   - `--surface-fill`: relleno.
 *   - `--surface-edge`: trazo interior de 1 px (border/general/lg). Sin él el trazo toma el color del relleno y no se ve.
 * - `notch`: muesca arriba a la derecha donde va el Button corner. `md` = 48 (Button corner de 40), `sm` = 40 (de 32),
 *   `lg` = 54 (un botón de 48 centrado en la muesca).
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
 * - `bleed`: el contenido llena la silueta entera (sin el trazo de 1 px). Lo usan las fotos de ProductCard y BlogCard.
 * - `DROP_SHADOW` / `cornerShadowClass`: la misma sombra para el Button corner que va en la muesca.
 */

export type NotchedSurfaceNotch = 'none' | 'sm' | 'md' | 'lg';
export type { NotchedSurfaceShadow } from './shadows';

const NOTCH_SIZE = { sm: 40, md: 48, lg: 54 } as const;

/**
 * Máscara de la silueta. `a` = ancho de la muesca desde el borde derecho, `v` = radio de las esquinas convexas
 * (y distancia del centro de la curva cóncava a los bordes); el radio cóncavo es `a - v`.
 */
function notchMask(a: number, v: number): CSSProperties {
  const c = a - v;
  return maskStyle([
    // Todo lo que queda a la izquierda de la muesca
    [SOLID_MASK, `calc(100% - ${a + v}px) 100%`, 'left top'],
    // Todo lo que queda debajo de la muesca
    [SOLID_MASK, `100% calc(100% - ${a + v}px)`, 'left bottom'],
    // Esquina convexa antes de la muesca
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right ${a}px top 0`],
    [SOLID_MASK, `${v}px ${a}px`, `right ${a}px top ${v}px`],
    // Curva cóncava
    [`radial-gradient(circle at 100% 0,transparent ${c - 0.5}px,#000 ${c + 0.5}px)`, `${c}px ${c}px`, `right ${v}px top ${v}px`],
    [SOLID_MASK, `${c}px ${v}px`, `right ${v}px top ${a}px`],
    // Esquina convexa al bajar por el borde derecho
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right 0 top ${a}px`],
  ]);
}

export interface NotchedSurfaceProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Muesca arriba a la derecha: `md` = 48 (Button corner de 40), `sm` = 40 (de 32), `lg` = 54 (aloja un botón de 48
   * centrado, a 3 px de los bordes). Por defecto `none`.
   */
  notch?: NotchedSurfaceNotch;
  /** Sombra de la superficie (effect/shadow sm = on-card, md = on-canva). Por defecto `none`. */
  shadow?: NotchedSurfaceShadow;
  /** Relleno plano sin trazo (valor CSS). Sin él: relleno `--surface-fill` y trazo `--surface-edge`. */
  fill?: string;
  /**
   * Contenido a sangre (p. ej. una foto que llena la silueta): sin capa de trazo, el contenido ocupa toda la silueta
   * (`inset-0`, radio completo y la muesca exterior, no la desplazada 1 px). El relleno es `--surface-fill` si la
   * tarjeta lo define; si no, transparente. Por defecto `false`.
   */
  bleed?: boolean;
  /** Contenido recortado por la silueta (p. ej. una foto). */
  children?: ReactNode;
  'data-figma-part'?: string;
}

export function NotchedSurface({ notch = 'none', shadow = 'none', fill, bleed = false, children, className, style, ...rest }: NotchedSurfaceProps) {
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
      {bleed ? (
        <span
          className={cn(
            'absolute inset-0 block overflow-hidden rounded-ds-radius-general-2xl bg-(color:--surface-fill,transparent)',
            boxShadow && (shadow === 'on-canva' || shadow === 'on-card-on-canva') && 'shadow-ds-on-canva'
          )}
          style={outerMask}
        >
          {children}
        </span>
      ) : fill ? (
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
