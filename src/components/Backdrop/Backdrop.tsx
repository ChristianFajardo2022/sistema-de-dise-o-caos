import { forwardRef } from 'react';
import type { BackdropProps } from './Backdrop.types';
import { backdropVariants } from './Backdrop.variants';
import { cn } from '../../utils/cn';

/** Capa de fondo: no recibe `children`. Modal y AlertModal no la usan: su `<dialog>` pinta `::backdrop` con el mismo token y desenfoque. */
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
