import { forwardRef } from 'react';
import type { ToastProps } from './Toast.types';
import { defaultRole, escapeCloses, useExit, useAutoClose } from './Toast.shared';
import { ToastIcon, ToastInformation } from './ToastParts';
import { toastVariants } from './Toast.variants';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

/**
 * Toast (set 11198:12704 de Figma): aviso breve y no modal, con muesca y botón de cierre.
 * Es una región viva (`role="status"` en success e info, `role="alert"` en error y alert): se anuncia
 * sin mover el foco. Se cierra con el botón, con Escape si el foco está dentro, o solo con `duration`
 * (pausado con el puntero o el foco). Para apilarlos usa `Toaster`.
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    { type = 'success', title, description, icon, label, role, duration, onClose, open = true, onExited, onAnimationEnd, closeLabel = 'Cerrar notificación', className, onKeyDown, onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest },
    ref
  ) => {
    const timer = useAutoClose(open ? duration : undefined, onClose);
    const exit = useExit(open, onExited);
    const close = escapeCloses(onClose);
    return (
      <div
        {...rest}
        ref={ref}
        role={role ?? defaultRole(type)}
        aria-atomic="true"
        data-state={exit['data-state']}
        data-theme="dark"
        data-type={type}
        className={cn(toastVariants({ surface: 'notched' }), className)}
        onAnimationEnd={(e) => {
          exit.onAnimationEnd(e);
          onAnimationEnd?.(e);
        }}
        onMouseEnter={(e) => {
          timer.onMouseEnter();
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          timer.onMouseLeave();
          onMouseLeave?.(e);
        }}
        onFocus={(e) => {
          timer.onFocus();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          timer.onBlur();
          onBlur?.(e);
        }}
        onKeyDown={(e) => {
          close(e);
          onKeyDown?.(e);
        }}
      >
        <NotchedSurface notch="sm" />
        <ToastIcon type={type} icon={icon} />
        <ToastInformation type={type} label={label} title={title} description={description} />
        {onClose && (
          <ButtonCorner
            data-figma-part="Button corner "
            contrast="unicolor-canva"
            size="sm"
            stroke
            aria-label={closeLabel}
            icon={<Icon name="close" size={16} variant="line" data-figma-part="Icon-sizes" />}
            onClick={onClose}
            className="absolute top-0 right-0 z-[1]"
          />
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
