import type { HTMLAttributes } from 'react';

/** Botón de reproducir: `secondary` (burbuja y composer de escritorio, con trazo) o `primary` (composer móvil, relleno). */
export type ChatAudioPlayerButtonVariant = 'secondary' | 'primary';

/** Posición del botón de reproducir respecto de la onda. */
export type ChatAudioPlayerButtonPosition = 'start' | 'end';

export interface ChatAudioPlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onPlay' | 'onPause'> {
  /** Duración del audio en segundos. Es el texto de la derecha (capa "Hora" de Figma, p. ej. 20:14). */
  duration: number;
  /** Posición actual en segundos (controlado). Usar con `onCurrentTimeChange`. */
  currentTime?: number;
  /** Posición inicial en segundos (no controlado). Por defecto 0. */
  defaultCurrentTime?: number;
  /** Se llama al mover la posición con la onda (teclado, clic o arrastre) o con el avance de `src`. */
  onCurrentTimeChange?: (seconds: number) => void;
  /** Reproduciendo (controlado). Usar con `onPlayingChange`. */
  playing?: boolean;
  /** Reproduciendo al inicio (no controlado). */
  defaultPlaying?: boolean;
  /** Se llama al pulsar reproducir o pausar (y al terminar el audio de `src`). */
  onPlayingChange?: (playing: boolean) => void;
  /**
   * URL del audio. Si se pasa, el componente maneja un `<audio>` interno: reproducir/pausar, avance y salto.
   * Sin ella es solo presentación: quien lo usa controla `playing` y `currentTime`.
   */
  src?: string;
  /**
   * Alturas de las barras de la onda, de 0 a 1 (1 = 26 px, el alto de la capa "Onda de audio"). Las barras miden 3 con
   * separación 3; si no caben todas, la onda se reduce a las que caben en su ancho (toma una de cada
   * `largo / visibles`) para que represente todo el audio. Por defecto la onda de Figma (179 barras).
   */
  waveform?: readonly number[];
  /** Tipo del botón de reproducir. Por defecto `secondary`. */
  buttonVariant?: ChatAudioPlayerButtonVariant;
  /** Botón antes (`start`, por defecto) o después de la duración (`end`). */
  buttonPosition?: ChatAudioPlayerButtonPosition;
  /** Nombre accesible del botón en pausa. Por defecto "Reproducir audio". */
  playLabel?: string;
  /** Nombre accesible del botón reproduciendo. Por defecto "Pausar audio". */
  pauseLabel?: string;
  /** Nombre accesible del control de posición (la onda). Por defecto "Posición del audio". */
  seekLabel?: string;
  /** Clases adicionales para la raíz. */
  className?: string;
}
