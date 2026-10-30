// Utilidades de color de la documentación: variables de los tokens y su valor real (hex).

/** Variable de color de un token (prefijo `color-ds` y nombre), armada por partes: el nombre se conoce al ejecutar. */
export const colorVar = (token: string) => ['var(-', '-color-ds-', token, ')'].join('');

/** `rgb(…)`, `rgba(…)` o `color(srgb …)` → `#RRGGBB` (o `#RRGGBBAA` con transparencia). Otros formatos pasan por canvas. */
export function toHex(css: string): string {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;
  const rgb = css.match(/^rgba?\(([^)]+)\)$/);
  const srgb = css.match(/^color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+%?))?\)$/);
  if (rgb) {
    const p = rgb[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
    [r, g, b] = p;
    if (p.length > 3) a = p[3];
  } else if (srgb) {
    r = parseFloat(srgb[1]) * 255;
    g = parseFloat(srgb[2]) * 255;
    b = parseFloat(srgb[3]) * 255;
    if (srgb[4]) a = srgb[4].endsWith('%') ? parseFloat(srgb[4]) / 100 : parseFloat(srgb[4]);
  } else {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    if (!ctx) return css;
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [pr, pg, pb, pa] = ctx.getImageData(0, 0, 1, 1).data;
    [r, g, b, a] = [pr, pg, pb, pa / 255];
  }
  const h = (v: number) => Math.round(v).toString(16).padStart(2, '0').toUpperCase();
  return `#${h(r)}${h(g)}${h(b)}${a < 1 ? h(a * 255) : ''}`;
}

