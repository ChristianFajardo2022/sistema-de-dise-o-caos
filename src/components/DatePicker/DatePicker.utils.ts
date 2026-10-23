/**
 * Utilidades del DatePicker: patrón de fecha según el idioma, formato, lectura del texto escrito y máscara ligera.
 * Solo `Date` e `Intl` nativos. Todas las fechas en hora local, a las 00:00.
 */
import type { DateRange } from '../Calendar';

export type DateSegment = 'day' | 'month' | 'year';

/** Orden de día, mes y año y el separador del idioma (es: día/mes/año con "/"). */
export interface DatePattern {
  order: DateSegment[];
  separator: string;
  /** Pista de formato para el placeholder y la ayuda: "dd/mm/aaaa" en español. */
  hint: string;
}

/** Separador entre las dos fechas de un rango. */
export const RANGE_SEPARATOR = ' – ';

const SEGMENT_LENGTH: Record<DateSegment, number> = { day: 2, month: 2, year: 4 };

/** Letras de la pista por idioma; si no está, día "d", mes "m" y año "y". */
const HINT_LETTERS: Record<string, Partial<Record<DateSegment, string>>> = {
  es: { year: 'a' },
  pt: { year: 'a' },
  fr: { day: 'j', year: 'a' },
  it: { day: 'g', year: 'a' },
  de: { day: 't', year: 'j' },
};

/** Lee el orden y el separador del idioma con `Intl.DateTimeFormat.formatToParts`. */
export function getDatePattern(locale: string): DatePattern {
  let order: DateSegment[] = ['day', 'month', 'year'];
  let separator = '/';
  try {
    const parts = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(
      new Date(2026, 10, 23)
    );
    const found = parts.filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year').map((p) => p.type as DateSegment);
    if (found.length === 3) order = found;
    const literal = parts.find((p) => p.type === 'literal')?.value.trim();
    if (literal) separator = literal;
  } catch {
    // Idioma no válido: se queda el patrón por defecto (día/mes/año)
  }
  const lang = locale.toLowerCase().split('-')[0];
  const letters = { day: 'd', month: 'm', year: 'y', ...HINT_LETTERS[lang] };
  const hint = order.map((s) => letters[s].repeat(SEGMENT_LENGTH[s])).join(separator);
  return { order, separator, hint };
}

const pad = (n: number, len: number) => String(n).padStart(len, '0');

/** Fecha → texto con el patrón ("14/10/2026"). */
export function formatWithPattern(date: Date, pattern: DatePattern): string {
  const values: Record<DateSegment, string> = {
    day: pad(date.getDate(), 2),
    month: pad(date.getMonth() + 1, 2),
    year: pad(date.getFullYear(), 4),
  };
  return pattern.order.map((s) => values[s]).join(pattern.separator);
}

/** Texto → fecha con el patrón. Acepta cualquier separador no numérico u 8 dígitos seguidos. `null` si no es una fecha real. */
export function parseWithPattern(text: string, pattern: DatePattern): Date | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  let groups = trimmed.split(/\D+/).filter(Boolean);
  if (groups.length === 1 && groups[0].length === 8) {
    const digits = groups[0];
    let i = 0;
    groups = pattern.order.map((s) => {
      const g = digits.slice(i, i + SEGMENT_LENGTH[s]);
      i += SEGMENT_LENGTH[s];
      return g;
    });
  }
  if (groups.length !== 3) return null;
  const values = {} as Record<DateSegment, number>;
  for (let i = 0; i < 3; i++) {
    const seg = pattern.order[i];
    const g = groups[i];
    if (seg === 'year' ? g.length !== 4 : g.length > 2) return null;
    values[seg] = Number(g);
  }
  const { day, month, year } = values;
  const date = new Date(year, month - 1, day);
  // Fechas imposibles (31/02) se corren al mes siguiente: se descartan
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

/** Rango → texto ("12/10/2026 – 04/11/2026"). Solo el inicio si aún no hay fin. */
export function formatRangeWithPattern(range: DateRange, format: (d: Date) => string): string {
  if (!range.start) return '';
  return range.end ? `${format(range.start)}${RANGE_SEPARATOR}${format(range.end)}` : format(range.start);
}

/**
 * Máscara ligera: ordena lo escrito en los segmentos del patrón, pone el separador al completar cada segmento y,
 * si se escribe un separador antes de tiempo, completa con cero el día o el mes ("1/" → "01/").
 * Se aplica solo cuando se escribe al final del campo, así no mueve el cursor al editar en medio.
 */
export function maskDateText(raw: string, pattern: DatePattern, range: boolean): string {
  const segments = range ? [...pattern.order, ...pattern.order] : pattern.order;
  const done: string[] = [];
  let buf = '';
  for (const ch of raw) {
    if (done.length >= segments.length) break;
    const seg = segments[done.length];
    const len = SEGMENT_LENGTH[seg];
    if (/\d/.test(ch)) {
      buf += ch;
      if (buf.length === len) {
        done.push(buf);
        buf = '';
      }
    } else if (buf) {
      done.push(seg === 'year' ? buf : buf.padStart(len, '0'));
      buf = '';
    }
  }
  let out = '';
  done.forEach((value, i) => {
    out += value;
    if (i < segments.length - 1) out += i === pattern.order.length - 1 ? RANGE_SEPARATOR : pattern.separator;
  });
  return out + buf;
}

/** "2026-10-14" (valor del input oculto del formulario). */
export const toIsoDate = (d: Date) => `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1, 2)}-${pad(d.getDate(), 2)}`;
