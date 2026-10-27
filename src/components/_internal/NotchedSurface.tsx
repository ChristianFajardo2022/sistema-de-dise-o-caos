import type { HTMLAttributes, ReactNode } from 'react';
import type { NotchedSurfaceShadow } from './shadows';
import { cn } from '../../utils/cn';
import { notchMask } from './mask';
import { DROP_SHADOW } from './shadows';

/**
 * Superficie de las tarjetas (marco "Canva" + forma "Subtract" de Figma). Pieza interna: no se exporta desde el paquete.
 * La usan FileCard, InteractiveCard, InformationCard, DataCard y las tarjetas de la tanda 4B.
 *
 * - Va detrás del contenido (`absolute inset-0 -z-10`, sin eventos de puntero): la raíz de la tarjeta queda
 *   transparente, como en Figma. La raíz debe ser `relative isolate`.
 * - `interactive`: el contenido de la silueta (`children`) recibe el puntero y la superficie deja de ir detrás
 *   (sin `-z-10` ni `pointer-events-none`): queda delante del contenido anterior de la tarjeta en el DOM. Para
 *   contenido interactivo dentro de la silueta (p. ej. el bloque de medios de Popover).
 * - `radius`: esquinas de radius/general/2xl (24, por defecto) o radius/general/xl (16).
 * - Colores por variables CSS que pone la tarjeta (así cambian con :hover o :checked sin tocar la geometría):
 *   - `--surface-fill`: relleno.
 *   - `--surface-edge`: trazo interior de 1 px (border/general/lg). Sin él el trazo toma el color del relleno y no se ve.
 * - `notch`: muesca arriba a la derecha donde va el Button corner. `md` = 48 (Button corner de 40), `sm` = 40 (de 32),
 *   `lg` = 54 (un botón de 48 centrado en la muesca).
 *   Geometría de Figma (rectángulo menos un cuadrado de N×N con las esquinas redondeadas):
 *   - `radius="2xl"`: esquinas de la muesca a N/2 (esquina convexa de N/2 antes de la muesca, curva cóncava de radio
 *     N/2 con centro a N/2 del borde derecho y del superior, y esquina convexa de N/2 al bajar por el borde derecho).
 *   - `radius="xl"`: todas las esquinas del booleano a 16 (convexas y cóncava), con tramos rectos entre ellas.
 *   Se recorta con una máscara de gradientes (`border-radius` no la hace), así la siguen el relleno, el trazo y el
 *   contenido recortado. La capa interior usa la misma muesca desplazada 1 px.
 * - `shadow`: con muesca, `filter: drop-shadow` sobre esta capa (sigue el canal alfa de la máscara; nunca en la raíz de
 *   la tarjeta, que rasterizaría el contenido). Sin muesca, `box-shadow` con los tokens `shadow-ds-on-card`
 *   (effect/shadow sm, en la capa Canva) y `shadow-ds-on-canva-md` (effect/shadow md con spread −2, en la capa Subtract),
 *   como en Figma. Las sombras de CAOS tienen alfa 0 en oscuro. Una sombra condicional (p. ej. solo en hover) se pasa
 *   por `className`.
 * - `fill`: relleno plano sin trazo (p. ej. el Backdrop de la miniatura de FileCard).
 * - `children`: contenido recortado por la silueta (una foto). Con contenido deja de ser `aria-hidden`.
 * - `bleed`: el contenido llena la silueta entera (sin el trazo de 1 px). Lo usan las fotos de ProductCard y BlogCard.
 * - `DROP_SHADOW` / `cornerShadowClass`: la misma sombra para el Button corner que va en la muesca.
 */

export type NotchedSurfaceNotch = 'none' | 'sm' | 'md' | 'lg';
export type { NotchedSurfaceShadow } from './shadows';

export type NotchedSurfaceRadius = 'xl' | '2xl';

const NOTCH_SIZE = { sm: 40, md: 48, lg: 54 } as const;

/** radius/general/xl (px) para la geometría de la muesca con `radius="xl"`. */
const RADIUS_XL = 16;

// Clases escritas enteras (Tailwind no ve clases armadas con interpolación)
const RADIUS_CLASS: Record<NotchedSurfaceRadius, { outer: string; inner: string }> = {
  xl: {
    outer: 'rounded-ds-radius-general-xl',
    inner: 'rounded-[calc(var(--ds-responsive-radius-general-xl)-var(--ds-responsive-border-general-lg))]',
  },
  '2xl': {
    outer: 'rounded-ds-radius-general-2xl',
    inner: 'rounded-[calc(var(--ds-responsive-radius-general-2xl)-var(--ds-responsive-border-general-lg))]',
  },
};

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
  /** Radio de las esquinas: `2xl` = radius/general/2xl (24), `xl` = radius/general/xl (16). Por defecto `2xl`. */
  radius?: NotchedSurfaceRadius;
  /**
   * El contenido de la silueta es interactivo: recibe el puntero y la superficie no va detrás (`-z-10`), sino en su
   * lugar del DOM (delante de lo anterior). Por defecto `false`.
   */
  interactive?: boolean;
  'data-figma-part'?: string;
}

export function NotchedSurface({
  notch = 'none',
  shadow = 'none',
  fill,
  bleed = false,
  radius = '2xl',
  interactive = false,
  children,
  className,
  style,
  ...rest
}: NotchedSurfaceProps) {
  const a = notch === 'none' ? 0 : NOTCH_SIZE[notch];
  // Convexas y cóncava: N/2 con 2xl (geometría de las tarjetas); radius/general/xl con xl
  const v = radius === 'xl' ? RADIUS_XL : a / 2;
  const c = radius === 'xl' ? RADIUS_XL : a - v;
  const notched = a > 0;
  const outerMask = notched ? notchMask(a, v, c) : undefined;
  // 1 px adentro: misma muesca desplazada (convexas v - 1, cóncava c + 1)
  const innerMask = notched ? notchMask(a, v - 1, c + 1) : undefined;
  const r = RADIUS_CLASS[radius];
  const boxShadow = !notched && shadow !== 'none';
  return (
    <span
      aria-hidden={children ? undefined : true}
      data-figma-part="Canva"
      {...rest}
      className={cn(
        interactive ? 'absolute inset-0 block' : 'pointer-events-none absolute inset-0 -z-10 block',
        notched ? DROP_SHADOW[shadow] : r.outer,
        boxShadow && (shadow === 'on-card' || shadow === 'on-card-on-canva') && 'shadow-ds-on-card',
        className
      )}
      style={style}
    >
      {bleed ? (
        <span
          className={cn(
            'absolute inset-0 block overflow-hidden bg-(color:--surface-fill,transparent)',
            r.outer,
            boxShadow && (shadow === 'on-canva' || shadow === 'on-card-on-canva') && 'shadow-ds-on-canva-md'
          )}
          style={outerMask}
        >
          {children}
        </span>
      ) : fill ? (
        <span className={cn('absolute inset-0 block', r.outer)} style={{ ...outerMask, backgroundColor: fill }} />
      ) : (
        // Capa exterior: color del trazo (o del relleno si no hay trazo)
        <span
          className={cn(
            'absolute inset-0 block bg-(color:--surface-edge,var(--surface-fill))',
            r.outer,
            boxShadow && (shadow === 'on-canva' || shadow === 'on-card-on-canva') && 'shadow-ds-on-canva-md'
          )}
          style={outerMask}
        >
          {/* Capa interior: relleno, 1 px (border/general/lg) hacia dentro */}
          <span
            className={cn('absolute inset-(--ds-responsive-border-general-lg) block overflow-hidden bg-(color:--surface-fill)', r.inner)}
            style={innerMask}
          >
            {children}
          </span>
        </span>
      )}
    </span>
  );
}
