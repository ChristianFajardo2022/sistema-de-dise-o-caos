import { forwardRef } from 'react';
import type { ToasterPlacement, ToasterProps } from './Toast.types';
import { cn } from '../../utils/cn';

const PLACEMENT: Record<ToasterPlacement, string> = {
  'top-start': 'top-ds-space-container-on-card left-ds-space-container-on-card items-start',
  'top-center': 'top-ds-space-container-on-card left-1/2 -translate-x-1/2 items-center',
  'top-end': 'top-ds-space-container-on-card right-ds-space-container-on-card items-end',
  'bottom-start': 'bottom-ds-space-container-on-card left-ds-space-container-on-card items-start flex-col-reverse',
  'bottom-center': 'bottom-ds-space-container-on-card left-1/2 -translate-x-1/2 items-center flex-col-reverse',
  'bottom-end': 'bottom-ds-space-container-on-card right-ds-space-container-on-card items-end flex-col-reverse',
};

/**
 * Región que apila Toasts y Snackbars. Es un `<section>` con nombre (landmark de región); cada aviso lleva su
 * propia región viva, así que aquí no se repite `aria-live`. No roba el foco ni lo atrapa. Con `position="fixed"`
 * se ancla al viewport; deja pasar el puntero fuera de los avisos.
 */
export const Toaster = forwardRef<HTMLElement, ToasterProps>(
  ({ placement = 'bottom-end', position = 'fixed', label = 'Notificaciones', className, children, ...rest }, ref) => (
    <section
      {...rest}
      ref={ref}
      aria-label={label}
      className={cn(
        'pointer-events-none z-50 flex max-w-[calc(100%-2*var(--ds-responsive-space-container-on-card))] gap-ds-space-general-lg',
        position === 'fixed' ? 'fixed' : 'absolute',
        PLACEMENT[placement],
        '*:pointer-events-auto',
        className
      )}
    >
      {children}
    </section>
  )
);

Toaster.displayName = 'Toaster';
