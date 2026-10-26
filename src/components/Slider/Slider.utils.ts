/** Cantidad de decimales de un número (para redondear al paso sin errores de coma flotante). */
function decimals(n: number) {
  if (!Number.isFinite(n)) return 0;
  const [base, exp] = String(n).toLowerCase().split('e');
  const frac = base.split('.')[1]?.length ?? 0;
  return Math.max(0, frac - (exp ? Number(exp) : 0));
}

/** Limita `value` a [min, max]. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Redondea `value` al múltiplo de `step` más cercano contando desde `min`, y lo limita a [min, max]. */
export function snapToStep(value: number, min: number, max: number, step: number) {
  if (!(step > 0)) return clamp(value, min, max);
  const snapped = Math.round((value - min) / step) * step + min;
  const precision = Math.max(decimals(step), decimals(min));
  const fixed = Number(snapped.toFixed(precision));
  // Si el rango no es múltiplo del paso, el último paso válido queda por debajo de `max`
  if (fixed > max) return Number((Math.floor((max - min) / step) * step + min).toFixed(precision));
  return clamp(fixed, min, max);
}

/** Porcentaje (0–100) de `value` dentro de [min, max]. */
export function toPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

/** Salto de RePág/AvPág: una décima parte del rango, redondeada al paso (al menos un paso). */
export function pageStep(min: number, max: number, step: number) {
  const tenth = (max - min) / 10;
  if (!(step > 0)) return tenth;
  return Math.max(step, Math.round(tenth / step) * step);
}

/** Valor del pulgar al apretar una tecla del patrón APG, o `null` si la tecla no mueve el pulgar. */
export function valueForKey(key: string, value: number, bounds: { min: number; max: number; step: number; page: number }) {
  const { min, max, step, page } = bounds;
  switch (key) {
    case 'ArrowRight':
    case 'ArrowUp':
      return value + step;
    case 'ArrowLeft':
    case 'ArrowDown':
      return value - step;
    case 'PageUp':
      return value + page;
    case 'PageDown':
      return value - page;
    case 'Home':
      return min;
    case 'End':
      return max;
    default:
      return null;
  }
}

/**
 * Qué pulgar mueve un clic o arrastre en la pista de un rango: el más cercano al punto.
 * Si los dos están en el mismo valor, decide el lado del clic; justo encima, el que todavía puede moverse.
 */
export function closestThumb(values: readonly [number, number], target: number, max: number): 0 | 1 {
  const [a, b] = values;
  if (a === b) {
    if (target < a) return 0;
    if (target > b) return 1;
    return a >= max ? 0 : 1;
  }
  return Math.abs(target - a) <= Math.abs(target - b) ? 0 : 1;
}

/** En una página de derecha a izquierda las flechas horizontales se invierten (la derecha baja el valor). */
export function directionalKey(key: string, rtl: boolean) {
  if (!rtl) return key;
  if (key === 'ArrowRight') return 'ArrowLeft';
  if (key === 'ArrowLeft') return 'ArrowRight';
  return key;
}
