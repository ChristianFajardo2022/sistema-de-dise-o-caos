import { forwardRef, useLayoutEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';
import type { DataAttributes } from './types';

/**
 * Texto sobre foto (pieza interna, no se exporta desde el paquete). Un único patrón para las tarjetas:
 *
 * - Siempre `data-theme="dark"`: todo lo que va dentro (textos, Button, Tag, NumberPicker, Rating) usa los tokens del
 *   modo Dark, el único que Figma dibuja sobre foto. La foto no cambia con el tema, así que el texto tampoco.
 *   Dentro no se usan las variantes `light:` / `dark:` (las de tokens.css también casan con descendientes de `.light`).
 * - Velo: degradado **opaco desde donde empieza el texto**; el tramo transparente solo ocupa `--scrim-fade` (por defecto
 *   space/general/5xl, el padding superior del bloque de ProductCard).
 *   - `edge="bottom"`: velo hacia el borde inferior de la tarjeta; se desvanece `--scrim-fade` por encima del contenido
 *     y es opaco desde donde empieza (el bloque necesita un padding superior ≥ `--scrim-fade`).
 *   - `edge="top"`: velo hacia el borde superior; opaco en todo el bloque y se desvanece hacia abajo.
 *   - `veil="self"` (por defecto): el velo es el fondo del propio bloque (no cambia su posición ni crea contexto de
 *     apilamiento: un enlace estirado de dentro sigue cubriendo toda la tarjeta). Con `edge="bottom"` el tramo opaco
 *     empieza en el borde superior del primer hijo (lo mide con ResizeObserver; sin medir, después de `--scrim-fade`),
 *     así un bloque más alto que su contenido deja ver la foto; `--scrim-tint` agrega debajo un degradado de todo el
 *     bloque (p. ej. el de Figma). Con `edge="top"` el tramo que se desvanece es la parte de abajo del bloque.
 *   - `veil="outside"`: el velo es un `::before` que sale del bloque `--scrim-out` por los lados y el borde (para llegar a
 *     los bordes de la tarjeta, p. ej. su padding) y se desvanece `--scrim-fade` por fuera, debajo (`edge="top"`) o
 *     encima (`edge="bottom"`). El bloque pasa a `relative isolate`: no sirve si dentro hay un enlace estirado.
 *   - `veil="none"`: solo fuerza el tema oscuro (p. ej. etiquetas con fondo propio).
 *   - `--scrim`: color del velo. Por defecto G12 (#45484d: blanco ~9:1, text/neutral/gray ~6:1), sin token en Figma.
 * - El velo no ocupa lugar ni cambia la caja del bloque (el comparador mide la misma geometría).
 */

export type MediaScrimEdge = 'top' | 'bottom';
export type MediaScrimVeil = 'self' | 'outside' | 'none';

export interface MediaScrimProps extends HTMLAttributes<HTMLDivElement>, DataAttributes {
  /** Borde de la tarjeta hacia el que va el velo. Por defecto `bottom`. */
  edge?: MediaScrimEdge;
  /** Cómo se dibuja el velo (ver arriba). Por defecto `self`. */
  veil?: MediaScrimVeil;
}

const vars = '[--scrim:var(--color-ds-primitives-color-primary-g12)] [--scrim-fade:var(--ds-responsive-space-general-5xl)]';

// Clases escritas enteras (Tailwind no ve clases armadas con interpolación)
const VEIL: Record<Exclude<MediaScrimVeil, 'none'>, Record<MediaScrimEdge, string>> = {
  self: {
    // Opaco desde --scrim-start (lo mide MediaScrim: el borde superior del primer hijo; sin medir, --scrim-fade) y,
    // debajo, un tinte opcional de todo el bloque (--scrim-tint, transparente por defecto: el degradado de Figma)
    bottom: [
      vars,
      '[--scrim-start:var(--scrim-fade)]',
      'bg-[linear-gradient(to_bottom,transparent_calc(var(--scrim-start)_-_var(--scrim-fade)),var(--scrim)_var(--scrim-start)),linear-gradient(to_bottom,transparent,var(--scrim-tint,transparent))]',
    ].join(' '),
    top: `${vars} bg-[linear-gradient(to_top,transparent_0,var(--scrim)_var(--scrim-fade))]`,
  },
  outside: {
    bottom: [
      vars,
      "relative isolate [--scrim-out:0px] before:pointer-events-none before:absolute before:-z-10 before:content-['']",
      'before:-top-(--scrim-fade) before:-right-(--scrim-out) before:-bottom-(--scrim-out) before:-left-(--scrim-out)',
      'before:rounded-b-ds-radius-general-2xl',
      'before:bg-[linear-gradient(to_bottom,transparent_0,var(--scrim)_var(--scrim-fade))]',
    ].join(' '),
    top: [
      vars,
      "relative isolate [--scrim-out:0px] before:pointer-events-none before:absolute before:-z-10 before:content-['']",
      'before:-top-(--scrim-out) before:-right-(--scrim-out) before:-bottom-(--scrim-fade) before:-left-(--scrim-out)',
      'before:rounded-t-ds-radius-general-2xl',
      'before:bg-[linear-gradient(to_top,transparent_0,var(--scrim)_var(--scrim-fade))]',
    ].join(' '),
  },
};

export const MediaScrim = forwardRef<HTMLDivElement, MediaScrimProps>(({ edge = 'bottom', veil = 'self', className, ...rest }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(ref, innerRef);
  const measure = veil === 'self' && edge === 'bottom';

  // `self` + `bottom`: el tramo opaco empieza donde empieza el contenido (borde superior del primer hijo), aunque el
  // bloque sea más alto que su contenido (p. ej. la tarjeta expandida): la foto de arriba sigue a la vista.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!measure || !el) return;
    const update = () => {
      const first = el.firstElementChild;
      if (!first) return el.style.removeProperty('--scrim-start');
      const top = first.getBoundingClientRect().top - el.getBoundingClientRect().top;
      el.style.setProperty('--scrim-start', `${Math.max(0, top)}px`);
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => observer.disconnect();
  }, [measure]);

  return <div ref={mergedRef} data-theme="dark" {...rest} className={cn(veil !== 'none' && VEIL[veil][edge], className)} />;
});

MediaScrim.displayName = 'MediaScrim';
