import { forwardRef } from 'react';
import type { AlertProps, AlertType } from './Alert.types';
import { ALERT_DEFAULT_ICONS, alertDescriptionClass, alertIconVariants, alertTitleClass, alertVariants } from './Alert.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

const DEFAULT_LABELS: Record<AlertType, string> = {
  success: 'Éxito',
  alert: 'Advertencia',
  error: 'Error',
  info: 'Información',
};

const has = (node: unknown) => node != null && node !== false && node !== '';

/**
 * Alert: mensaje en línea de éxito, advertencia, error o información.
 * Por defecto `role="status"` (aviso cortés). Usa `role="alert"` solo para errores o
 * avisos urgentes que aparecen dinámicamente. No es interactivo.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ type = 'success', background = true, title, children, icon, label, role = 'status', className, ...restProps }, ref) => {
    const srLabel = label ?? DEFAULT_LABELS[type];
    return (
      <div
        {...restProps}
        ref={ref}
        role={role}
        className={cn(alertVariants({ type, background }), className)}
      >
        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full" data-figma-part="Icon">
          <Icon
            name={icon ?? ALERT_DEFAULT_ICONS[type]}
            size={20}
            variant="fill"
            className={alertIconVariants({ type })}
            data-figma-part="Icon-sizes"
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-ds-primitives-space-md" data-figma-part="Information">
          {srLabel && <span className="sr-only">{srLabel}: </span>}
          {has(title) && (
            <p className={alertTitleClass} data-figma-part="Subheading">
              {title}
            </p>
          )}
          {has(children) && (
            <div className={alertDescriptionClass} data-figma-part="Description">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
