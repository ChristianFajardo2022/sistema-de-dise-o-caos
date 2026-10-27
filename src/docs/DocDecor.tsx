/**
 * Decorado de fondo del encabezado ("decor" de Header document (Atom), 14321:54945): un haz de líneas onduladas que
 * pasa de una curva a otra, con trazo de 1 px al 10 % de opacidad. Figma lo trae como un vector de 1361 × 1086; aquí se
 * genera con dos ondas y la interpolación entre ellas (mismo efecto, sin imagen ni SVG externo).
 *
 * Para diseño: el trazo de Figma es border/general/default-on-card (G12 / G05), que no está en tokens.css; se usa
 * border/table/hover, que tiene esos mismos valores en los dos temas.
 */

const W = 1360;
const H = 1086;
const LINES = 56;
const STEPS = 48;

/** Onda de origen y de destino: alto base, amplitud, frecuencia (ciclos en el ancho) y fase. */
const FROM = { base: 260, amp: 170, freq: 1.15, phase: 0.6 };
const TO = { base: 640, amp: 300, freq: 1.45, phase: 2.5 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function wave(t: number): string {
  const base = lerp(FROM.base, TO.base, t);
  const amp = lerp(FROM.amp, TO.amp, t);
  const freq = lerp(FROM.freq, TO.freq, t);
  const phase = lerp(FROM.phase, TO.phase, t);
  const points = Array.from({ length: STEPS + 1 }, (_, i) => {
    const x = (i / STEPS) * W;
    // Segunda armónica suave para que las líneas se crucen y abran como en Figma
    const y = base + amp * Math.sin((x / W) * Math.PI * 2 * freq + phase) + 60 * t * Math.sin((x / W) * Math.PI * 5 + phase);
    return [x, y] as const;
  });
  // Catmull-Rom → Bézier cúbica: curva continua sin quiebres
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const PATH = Array.from({ length: LINES }, (_, i) => wave(i / (LINES - 1))).join('');

/** Decorado de líneas del encabezado. Es decorativo: `aria-hidden`, sin eventos, detrás del contenido. */
export function DocDecor() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-0 -z-10 size-full text-ds-border-table-hover opacity-10"
    >
      <path d={PATH} fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
