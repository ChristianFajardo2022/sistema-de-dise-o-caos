import { forwardRef } from 'react';
import type { NumberRatingProps } from './Rating.types';
import { numberRatingVariants } from './Rating.variants';
import { IconStar } from './IconStar';
import { cn } from '../../utils/cn';
import { RATING_SUFFIX, formatCount, formatRating } from '../../utils/format';

/** Promedio numérico con una estrella y, opcionalmente, el total de reseñas. Se lee como una sola frase. */
export const NumberRating = forwardRef<HTMLSpanElement, NumberRatingProps>(
  ({ value, total, label, className, ...restProps }, ref) => {
    const average = formatRating(value);
    const reviews =
      total === undefined ? undefined : `${formatCount(total)} ${total === 1 ? 'reseña' : 'reseñas'}`;
    const text = label ?? `${average} ${RATING_SUFFIX}${reviews ? `, ${reviews}` : ''}`;

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
