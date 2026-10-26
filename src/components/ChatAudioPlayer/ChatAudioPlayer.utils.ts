/** Onda de Figma: 19 barras propias y luego el patrón 10-15-22-12-8 repetido (179 barras en total), en px de 26. */
const FIGMA_HEAD = [8, 14, 20, 12, 24, 17, 10, 22, 16, 26, 18, 12, 20, 14, 9, 17, 24, 13, 19];
const FIGMA_LOOP = [10, 15, 22, 12, 8];

export const DEFAULT_WAVEFORM: readonly number[] = Object.freeze(
  Array.from({ length: 179 }, (_, i) =>
    i < FIGMA_HEAD.length ? FIGMA_HEAD[i] / 26 : FIGMA_LOOP[(i - FIGMA_HEAD.length) % FIGMA_LOOP.length] / 26
  )
);

/** Segundos -> "m:ss" (o "h:mm:ss" desde una hora). 1214 -> "20:14". */
export function formatAudioTime(seconds: number): string {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** Cantidad de barras reproducidas para una posición. */
export function playedBars(count: number, currentTime: number, duration: number): number {
  if (!(duration > 0)) return 0;
  return Math.round((Math.min(Math.max(currentTime, 0), duration) / duration) * count);
}

/** Ancho de una barra de la onda y separación entre barras, en px (Figma: 3 y 3). */
export const WAVE_BAR_WIDTH = 3;
export const WAVE_BAR_GAP = 3;

/** Barras que caben en un ancho de onda: `floor((ancho + separación) / (barra + separación))`. 415 px -> 69. */
export function visibleBarCount(width: number): number {
  if (!(width > 0)) return 0;
  return Math.floor((width + WAVE_BAR_GAP) / (WAVE_BAR_WIDTH + WAVE_BAR_GAP));
}

/**
 * Onda reducida a `count` barras que representan todo el audio (toma `waveform[floor(i × largo / count)]`). Si la
 * onda ya cabe (`count >= largo`), se devuelve igual: no se estira.
 */
export function resampleWaveform(waveform: readonly number[], count: number): readonly number[] {
  if (!(count > 0) || count >= waveform.length) return waveform;
  return Array.from({ length: count }, (_, i) => waveform[Math.floor((i * waveform.length) / count)]);
}
