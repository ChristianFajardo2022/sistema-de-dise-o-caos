import { forwardRef } from 'react';
import type { NumberRatingProps } from './Rating.types';
import { numberRatingVariants } from './Rating.variants';
import { IconStar } from './IconStar';
import { cn } from '../../utils/cn';

const averageFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 1 });
const countFormat = new Intl.NumberFormat('es');

/** Promedio numérico con una estrella y, opcionalmente, el total de reseñas. Se lee como una sola frase. */
export const NumberRating = forwardRef<HTMLSpanElement, NumberRatingProps>(
  ({ value, total, label, className, ...restProps }, ref) => {
    const average = averageFormat.format(value);
    const reviews =
      total === undefined ? undefined : `${countFormat.format(total)} ${total === 1 ? 'reseña' : 'reseñas'}`;
    const text = label ?? `${average} de 5 estrellas${reviews ? `, ${reviews}` : ''}`;

    return (
      <span
        {...restProps}
        ref={ref}
        role="img"
        aria-label={text}
        className={cn(numberRatingVariants(), className)}
      >
        <span aria-hidden="true" data-figma-part="Type@29">{average}</span>
        <IconStar state="select" size={16} />
        {reviews && (
          <span aria-hidden="true" className="ml-ds-space-general-lg text-ds-text-neutral-body [font-weight:var(--ds-primitives-typography-weight-regular)]">
            {reviews}
          </span>
        )}
      </span>
    );
  }
);

NumberRating.displayName = 'NumberRating';
