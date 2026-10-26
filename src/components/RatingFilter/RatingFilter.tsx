import { forwardRef } from 'react';
import type { MouseEvent } from 'react';
import type { RatingFilterProps } from './RatingFilter.types';
import { ratingFilterStarsClass, ratingFilterVariants } from './RatingFilter.variants';
import { Slider } from '../Slider';
import { StarRating } from '../Rating';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const stars = (n: number) => `${n} ${n === 1 ? 'estrella' : 'estrellas'} o más`;

/**
 * Filtro por calificación mínima: Slide bar (5 posiciones, pasos de 25 %) y una fila de cinco estrellas que la refleja.
 * La primera posición es "Sin filtro" (`null`, Type=Default de Figma); las demás, 2 a 5 estrellas o más.
 *
 * El control accesible es el slider (patrón APG Slider: flechas, Inicio, Fin). Las estrellas repiten el valor a la
 * vista y se pueden pulsar con el puntero como atajo, pero están ocultas a tecnologías de apoyo para no anunciar dos
 * controles para el mismo dato.
 */
export const RatingFilter = forwardRef<HTMLDivElement, RatingFilterProps>(
  (
    {
      value,
      defaultValue = null,
      onValueChange,
      label = 'Calificación mínima',
      'aria-labelledby': labelledBy,
      disabled = false,
      name,
      className,
      ...restProps
    },
    ref
  ) => {
    const [stored, setStored] = useControllableState<number | null>(value, defaultValue, onValueChange, 'RatingFilter');
    // La posición mínima del slider es "sin filtro": toda calificación es ≥ 1, así que "1 estrella o más" no existe
    const rating = stored !== null && stored > 1 ? stored : null;
    const setRating = (n: number) => setStored(n > 1 ? n : null);

    const pickStar = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const row = event.currentTarget;
      const star = [...row.children].findIndex((child) => child.contains(event.target as Node));
      if (star >= 0) setRating(star + 1);
    };

    return (
      <div {...restProps} ref={ref} className={cn(ratingFilterVariants(), className)}>
        <Slider
          min={1}
          max={5}
          step={1}
          value={rating ?? 1}
          onValueChange={setRating}
          formatValue={(n) => (n > 1 ? stars(n) : 'Sin filtro')}
          aria-label={labelledBy ? undefined : label}
          aria-labelledby={labelledBy}
          disabled={disabled}
          name={name}
          data-figma-part="Slide bar"
        />
        {/* Atajo con puntero: el teclado y los lectores usan el slider */}
        <StarRating
          size="md"
          value={rating ?? 0}
          aria-hidden="true"
          onClick={pickStar}
          className={cn(ratingFilterStarsClass, !disabled && 'cursor-pointer', disabled && 'opacity-50')}
          data-figma-part="Star rating"
        />
      </div>
    );
  }
);

RatingFilter.displayName = 'RatingFilter';
