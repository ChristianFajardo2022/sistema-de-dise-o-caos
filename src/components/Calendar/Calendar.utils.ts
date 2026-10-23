/**
 * Utilidades de fechas del Calendar. Solo `Date` e `Intl` nativos (sin librerías de fechas).
 * Todas trabajan en hora local y devuelven fechas a las 00:00.
 */

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
export const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Suma meses conservando el día (si el mes destino es más corto, usa su último día). */
export function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  target.setDate(Math.min(d.getDate(), daysInMonth(target.getFullYear(), target.getMonth())));
  return target;
}
export const addYears = (d: Date, n: number) => addMonths(d, n * 12);

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Compara dos fechas por día: negativo si a < b, 0 si es el mismo día, positivo si a > b. */
export const compareDays = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

export function clampDate(d: Date, min?: Date, max?: Date) {
  if (min && compareDays(d, min) < 0) return startOfDay(min);
  if (max && compareDays(d, max) > 0) return startOfDay(max);
  return d;
}

/** Semanas del mes (cada una con 7 fechas, incluidos los días de los meses vecinos). */
export function buildMonthWeeks(month: Date, weekStartsOn: number): Date[][] {
  const first = startOfMonth(month);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const total = Math.ceil((lead + daysInMonth(first.getFullYear(), first.getMonth())) / 7);
  const start = addDays(first, -lead);
  return Array.from({ length: total }, (_, w) => Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)));
}

/** Primer año de la página de 20 años que contiene a `year` (2020–2039, 2040–2059…). */
export const yearPageStart = (year: number) => Math.floor(year / 20) * 20;

const cap = (s: string, locale: string) => s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);
const stripDiacritics = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '');

/** Textos de fecha según el `locale`, todos con `Intl.DateTimeFormat` nativo. */
export function createFormatters(locale: string) {
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const monthLong = new Intl.DateTimeFormat(locale, { month: 'long' });
  const monthYear = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const monthYearLabel = monthYear;
  const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const weekdayLong = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const year = new Intl.DateTimeFormat(locale, { year: 'numeric' });
  const dayDigits = new Intl.NumberFormat(locale, { useGrouping: false });
  const yearNumber = new Intl.NumberFormat(locale, { useGrouping: false });
  // 1 de enero de 2023 fue domingo: sirve de base para los nombres de los días
  const refDay = (dow: number) => new Date(2023, 0, 1 + dow);

  return {
    /** "lunes, 3 de noviembre de 2026": nombre accesible de cada día. */
    dayLabel: (d: Date) => long.format(d),
    /** "3": número que se dibuja en la celda. Sin cero a la izquierda para que esté dentro del nombre accesible (WCAG 2.5.3). */
    dayNumber: (d: Date) => dayDigits.format(d.getDate()),
    /** "Octubre 2026": título del mes visible. */
    monthTitle: (d: Date) => cap(monthYear.format(d), locale),
    /** "Octubre": nombre del mes (también el texto de la celda de mes, para que esté dentro de su nombre accesible). */
    monthName: (monthIndex: number) => cap(monthLong.format(new Date(2023, monthIndex, 1)), locale),
    /** "octubre de 2026": nombre accesible de la celda de mes. */
    monthLabel: (d: Date) => monthYearLabel.format(d),
    /** "2026". */
    yearText: (y: number) => yearNumber.format(y),
    yearLabel: (d: Date) => year.format(d),
    /** "Do", "Lu"… (2 letras sin tilde, como Figma). */
    weekdayShort: (dow: number) =>
      cap(Array.from(stripDiacritics(weekdayShort.format(refDay(dow))).replace(/\.$/, '')).slice(0, 2).join(''), locale),
    /** "domingo". */
    weekdayLong: (dow: number) => weekdayLong.format(refDay(dow)),
  };
}

export type CalendarFormatters = ReturnType<typeof createFormatters>;
