import { forwardRef } from 'react';
import type { RatingBarProps } from './Rating.types';
import { ratingBarRowClasses, ratingBarVariants } from './Rating.variants';
import { IconStar } from './IconStar';
import { ProgressBar } from '../ProgressBar';
import { cn } from '../../utils/cn';

const countFormat = new Intl.NumberFormat('es');

/**
 * Desglose de reseñas por estrellas. Cada fila es un `<li>` con una estrella decorativa y un
 * `ProgressBar` (que expone "5 estrellas" como nombre y el porcentaje o la cantidad como valor).
 */
export const RatingBar = forwardRef<HTMLUListElement, RatingBarProps>(
  ({ distribution, total: totalProp, display = 'percentage', label, barProps, className, ...restProps }, ref) => {
    const total = totalProp ?? distribution.reduce((sum, row) => sum + Math.max(row.count, 0), 0);

    return (
      <ul
        {...restProps}
        ref={ref}
        aria-label={label}
        className={cn(ratingBarVariants(), className)}
      >
        {distribution.map((row, index) => (
          <li
            key={row.stars}
            data-figma-part={`Frame ${7 + index}`}
            className={ratingBarRowClasses}
          >
            <IconStar state="select" size={16} />
            <ProgressBar
              {...barProps}
              className={cn('min-w-0 flex-1', barProps?.className)}
              label={`${row.stars} ${row.stars === 1 ? 'estrella' : 'estrellas'}`}
              value={Math.max(row.count, 0)}
              max={total > 0 ? total : 1}
              formatValue={(count, percent) =>
                display === 'count' ? countFormat.format(count) : `${Math.round(percent)}%`
              }
            />
          </li>
        ))}
      </ul>
    );
  }
);

RatingBar.displayName = 'RatingBar';
