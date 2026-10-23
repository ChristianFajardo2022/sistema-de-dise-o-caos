import { forwardRef } from 'react';
import type { IconStarProps } from './Rating.types';
import { ICON_STAR_GLYPH, iconStarVariants } from './Rating.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Estrella de Ratings & Reviews (Icon Star (Atom)). Es decorativa: siempre `aria-hidden`;
 * el significado lo da el componente que la usa (StarRating, RatingBar, NumberRating).
 */
export const IconStar = forwardRef<HTMLSpanElement, IconStarProps>(
  ({ state = 'default', size = 16, className, ...restProps }, ref) => (
    <span
      {...restProps}
      ref={ref}
      aria-hidden="true"
      className={cn(iconStarVariants({ state, size }), className)}
    >
      <Icon name="star" variant="fill" size={ICON_STAR_GLYPH[state][size]} data-figma-part="_vector" />
    </span>
  )
);

IconStar.displayName = 'IconStar';
