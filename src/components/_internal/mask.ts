import type { CSSProperties } from 'react';

/** Capa de una máscara CSS: imagen, tamaño y posición. */
export type MaskLayer = [image: string, size: string, position: string];

/** Relleno sólido para las capas de máscara. */
export const SOLID_MASK = 'linear-gradient(#000,#000)';

/**
 * Arma el `style` de una máscara de varias capas (con prefijo WebKit), sin repetición.
 * `subtractFirst`: la primera capa resta la unión de las demás (`subtract` / `source-out` en WebKit); sin él las capas
 * se suman (composición por defecto).
 */
export function maskStyle(layers: MaskLayer[], subtractFirst = false): CSSProperties {
  const image = layers.map((l) => l[0]).join(',');
  const size = layers.map((l) => l[1]).join(',');
  const position = layers.map((l) => l[2]).join(',');
  const style: CSSProperties = {
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: size,
    WebkitMaskSize: size,
    maskPosition: position,
    WebkitMaskPosition: position,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  };
  if (subtractFirst) {
    style.maskComposite = layers.map((_, i) => (i === 0 ? 'subtract' : 'add')).join(',') as CSSProperties['maskComposite'];
    (style as Record<string, string>).WebkitMaskComposite = layers.map((_, i) => (i === 0 ? 'source-out' : 'source-over')).join(',');
  }
  return style;
}

/**
 * Máscara de la silueta. `a` = ancho y alto de la muesca desde la esquina superior derecha, `v` = radio de las esquinas
 * convexas, `c` = radio de la curva cóncava (por defecto `a - v`: la curva va de un tramo convexo al otro sin tramos
 * rectos, la geometría de `radius="2xl"`). Con `c < a - v` quedan tramos rectos entre las curvas.
 */
export function notchMask(a: number, v: number, c = a - v): CSSProperties {
  const k = a - c;
  // Tramo recto del fondo de la muesca entre la curva cóncava y la esquina convexa del borde derecho
  const flat = a - v - c;
  return maskStyle([
    // Todo lo que queda a la izquierda de la muesca
    [SOLID_MASK, `calc(100% - ${a + v}px) 100%`, 'left top'],
    // Todo lo que queda debajo de la muesca
    [SOLID_MASK, `100% calc(100% - ${a + v}px)`, 'left bottom'],
    // Esquina convexa antes de la muesca
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right ${a}px top 0`],
    [SOLID_MASK, `${v}px ${a}px`, `right ${a}px top ${v}px`],
    // Curva cóncava
    [`radial-gradient(circle at 100% 0,transparent ${c - 0.5}px,#000 ${c + 0.5}px)`, `${c}px ${c}px`, `right ${k}px top ${k}px`],
    [SOLID_MASK, `${c}px ${v}px`, `right ${k}px top ${a}px`],
    ...(flat > 0 ? [[SOLID_MASK, `${flat}px ${v}px`, `right ${v}px top ${a}px`] as MaskLayer] : []),
    // Esquina convexa al bajar por el borde derecho
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right 0 top ${a}px`],
  ]);
}
