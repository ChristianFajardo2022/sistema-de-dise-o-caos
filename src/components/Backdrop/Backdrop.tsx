import { forwardRef } from 'react';
import type { BackdropProps } from './Backdrop.types';
import { backdropVariants } from './Backdrop.variants';
import { cn } from '../../utils/cn';

/** Capa de fondo: no recibe `children`; el Modal compone la capa y su contenido. */
export const Backdrop = forwardRef<HTMLDivElement, BackdropProps>(
  ({ open = true, position = 'fixed', className, ...restProps }, ref) => {
    if (!open) return null;
    return (
      <div
        {...restProps}
        ref={ref}
        aria-hidden="true"
        data-figma-part="Backdrop"
        className={cn(backdropVariants({ position }), className)}
      />
    );
  }
);

Backdrop.displayName = 'Backdrop';
