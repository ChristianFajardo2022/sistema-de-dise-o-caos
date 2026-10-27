import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ChatAudioPlayerProps } from './ChatAudioPlayer.types';
import {
  chatAudioPlayerBarVariants,
  chatAudioPlayerSeekVariants,
  chatAudioPlayerTimeVariants,
  chatAudioPlayerVariants,
  chatAudioPlayerWaveVariants,
} from './ChatAudioPlayer.variants';
import { DEFAULT_WAVEFORM, formatAudioTime, playedBars, resampleWaveform, visibleBarCount } from './ChatAudioPlayer.utils';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Reproductor de un mensaje de audio (marco "Reproductor" de Figma: botón, onda y duración). Lo usan la burbuja de
 * `ChatMessage` y la vista previa de `ChatComposer`.
 *
 * - El botón cambia de nombre e ícono: "Reproducir audio" (`play`) / "Pausar audio" (`pause`).
 * - La onda es un `<input type="range">` nativo e invisible estirado sobre las barras: flechas (1 s), Inicio/Fin,
 *   clic y arrastre, con `aria-valuetext` "0:05 de 20:14". Se dibuja el foco en la onda.
 * - La onda se reduce a las barras que caben en su ancho (ResizeObserver) y representa todo el audio: la parte
 *   encendida coincide con la posición del control.
 * - Con `src` maneja un `<audio>` interno; sin él es presentación controlada.
 */
export const ChatAudioPlayer = forwardRef<HTMLButtonElement, ChatAudioPlayerProps>(
  (
    {
      duration,
      currentTime: currentTimeProp,
      defaultCurrentTime = 0,
      onCurrentTimeChange,
      playing: playingProp,
      defaultPlaying = false,
      onPlayingChange,
      src,
      waveform = DEFAULT_WAVEFORM,
      buttonVariant = 'secondary',
      buttonPosition = 'start',
      timePosition = 'end',
      playLabel = 'Reproducir audio',
      pauseLabel = 'Pausar audio',
      seekLabel = 'Posición del audio',
      className,
      ...rest
    },
    ref
  ) => {
    const [innerTime, setInnerTime] = useState(defaultCurrentTime);
    const [innerPlaying, setInnerPlaying] = useState(defaultPlaying);
    const currentTime = currentTimeProp ?? innerTime;
    const playing = playingProp ?? innerPlaying;
    const audioRef = useRef<HTMLAudioElement>(null);
    const waveRef = useRef<HTMLDivElement>(null);
    // Barras que caben en el ancho de la onda (0 = sin medir: se dibujan todas y el contenedor recorta)
    const [visibleCount, setVisibleCount] = useState(0);

    useLayoutEffect(() => {
      const wave = waveRef.current;
      if (!wave) return;
      const measure = () => setVisibleCount(visibleBarCount(wave.clientWidth));
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(wave);
      return () => observer.disconnect();
    }, []);

    const setTime = (seconds: number) => {
      if (currentTimeProp === undefined) setInnerTime(seconds);
      onCurrentTimeChange?.(seconds);
    };
    const setPlaying = (next: boolean) => {
      if (playingProp === undefined) setInnerPlaying(next);
      onPlayingChange?.(next);
    };

    // Último setPlaying, para el efecto (cambia en cada render)
    const setPlayingRef = useRef(setPlaying);
    useEffect(() => {
      setPlayingRef.current = setPlaying;
    });

    // Con `src`, el estado manda sobre el <audio> interno
    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (playing) {
        audio.play().catch(() => setPlayingRef.current(false));
      } else {
        audio.pause();
      }
    }, [playing, src]);

    const onSeek = (event: ChangeEvent<HTMLInputElement>) => {
      const seconds = Number(event.target.value);
      if (audioRef.current) audioRef.current.currentTime = seconds;
      setTime(seconds);
    };

    // La onda visible representa todo el audio: las barras encendidas coinciden con la posición del control
    const bars = resampleWaveform(waveform, visibleCount);
    const played = playedBars(bars.length, currentTime, duration);
    const button = (
      <Button
        ref={ref}
        iconOnly
        variant={buttonVariant}
        size="xs"
        aria-label={playing ? pauseLabel : playLabel}
        onClick={() => setPlaying(!playing)}
        data-figma-part="Button"
        className="shrink-0"
      >
        <Icon name={playing ? 'pause' : 'play'} size={16} variant="fill" data-figma-part="Icon-sizes" />
      </Button>
    );

    const time = (
      <p data-figma-part="Hora" className={chatAudioPlayerTimeVariants({ position: timePosition })}>
        {formatAudioTime(duration)}
      </p>
    );

    return (
      <div {...rest} data-figma-part="Reproductor" className={cn(chatAudioPlayerVariants(), className)}>
        {buttonPosition === 'start' && button}
        {timePosition === 'start' && time}
        <div ref={waveRef} data-figma-part="Onda de audio" className={chatAudioPlayerWaveVariants()}>
          {bars.map((height, i) => (
            <span
              // Las barras no se reordenan: el índice es estable
              key={i}
              aria-hidden="true"
              className={chatAudioPlayerBarVariants({ played: i < played })}
              style={{ height: `${Math.min(Math.max(height, 0.1), 1) * 26}px` }}
            />
          ))}
          <input
            type="range"
            min={0}
            max={Math.max(duration, 0)}
            step={1}
            value={Math.min(currentTime, duration)}
            onChange={onSeek}
            aria-label={seekLabel}
            aria-valuetext={`${formatAudioTime(currentTime)} de ${formatAudioTime(duration)}`}
            disabled={!(duration > 0)}
            className={chatAudioPlayerSeekVariants()}
          />
        </div>
        {timePosition === 'end' && time}
        {buttonPosition === 'end' && button}
        {src && (
          <audio
            ref={audioRef}
            src={src}
            preload="metadata"
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
        )}
      </div>
    );
  }
);

ChatAudioPlayer.displayName = 'ChatAudioPlayer';
