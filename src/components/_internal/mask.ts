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
