/**
 * Formato de cifras del sistema (convención del país, `Intl.NumberFormat('es')`).
 * Una sola fuente para calificaciones y conteos: Rating, ProfileCard, ContactCard y ProductCard la usan.
 */

const ratingFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 1 });
const countFormat = new Intl.NumberFormat('es');

/** Escala de las calificaciones (estrellas). */
export const RATING_MAX = 5;

/** Texto para lectores de pantalla que sigue a una calificación: "de 5 estrellas". */
export const RATING_SUFFIX = `de ${RATING_MAX} estrellas`;

/** Calificación con un decimal como máximo y coma decimal: `4.5` → "4,5", `4` → "4". */
export function formatRating(value: number): string {
  return ratingFormat.format(value);
}

/** Conteo entero con separador de miles: `1280` → "1280", `12800` → "12.800". */
export function formatCount(value: number): string {
  return countFormat.format(value);
}
