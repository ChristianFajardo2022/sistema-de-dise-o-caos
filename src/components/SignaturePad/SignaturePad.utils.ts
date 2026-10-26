import type { SignatureExportOptions, SignaturePoint, SignatureStroke, SignatureValue } from './SignaturePad.types';

/** `true` si no hay ningún trazo con puntos. */
export const isSignatureEmpty = (value: SignatureValue | undefined): boolean =>
  !value || value.every((stroke) => stroke.length === 0);

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Punto normalizado a partir de una posición local en px; se limita al área. */
export function toNormalizedPoint(x: number, y: number, width: number, height: number): SignaturePoint {
  return [width > 0 ? clamp01(x / width) : 0, height > 0 ? clamp01(y / height) : 0];
}

/** Evita sumar puntos idénticos seguidos (los eventos de puntero repiten posiciones). */
export function isSamePoint(a: SignaturePoint | undefined, b: SignaturePoint): boolean {
  return !!a && a[0] === b[0] && a[1] === b[1];
}

/** Subconjunto del contexto 2D que usa el dibujo (permite probarlo sin canvas). */
export type StrokeContext = Pick<
  CanvasRenderingContext2D,
  'beginPath' | 'moveTo' | 'lineTo' | 'quadraticCurveTo' | 'stroke' | 'arc' | 'fill' | 'clearRect'
> &
  Partial<Pick<CanvasRenderingContext2D, 'lineCap' | 'lineJoin' | 'lineWidth' | 'strokeStyle' | 'fillStyle'>>;

/**
 * Dibuja un trazo suave: curvas cuadráticas que pasan por los puntos medios de cada par (el punto real es el
 * control), así no se ven las esquinas del muestreo del puntero. Un solo punto es un punto redondo.
 */
export function drawStroke(
  ctx: StrokeContext,
  stroke: SignatureStroke,
  width: number,
  height: number,
  lineWidth: number
): void {
  if (stroke.length === 0) return;
  const px = (p: SignaturePoint): [number, number] => [p[0] * width, p[1] * height];
  if (stroke.length === 1) {
    const [x, y] = px(stroke[0]);
    ctx.beginPath();
    ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const first = px(stroke[0]);
  ctx.beginPath();
  ctx.moveTo(first[0], first[1]);
  for (let i = 1; i < stroke.length - 1; i++) {
    const [cx, cy] = px(stroke[i]);
    const [nx, ny] = px(stroke[i + 1]);
    ctx.quadraticCurveTo(cx, cy, (cx + nx) / 2, (cy + ny) / 2);
  }
  const last = px(stroke[stroke.length - 1]);
  ctx.lineTo(last[0], last[1]);
  ctx.stroke();
}

/** Limpia y dibuja todos los trazos con el color y grosor dados (en las unidades del contexto: px CSS). */
export function drawStrokes(
  ctx: StrokeContext,
  strokes: SignatureValue,
  width: number,
  height: number,
  color: string,
  lineWidth: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  strokes.forEach((stroke) => drawStroke(ctx, stroke, width, height, lineWidth));
}

/**
 * Exporta la firma como data URL con un canvas fuera de pantalla. Devuelve `null` si está vacía o si el entorno
 * no tiene canvas 2D.
 */
export function strokesToDataURL(strokes: SignatureValue, options: SignatureExportOptions = {}): string | null {
  if (isSignatureEmpty(strokes) || typeof document === 'undefined') return null;
  const { strokeColor = '#000000', background, width = 600, height = 200, lineWidth = 3, type, quality } = options;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  drawStrokes(ctx, strokes, width, height, strokeColor, lineWidth);
  return canvas.toDataURL(type, quality);
}
