import type { ReactNode } from 'react';
import type { ToastType } from './Toast.types';
import {
  TOAST_DEFAULT_ICONS,
  toastDescriptionClass,
  toastIconCircleClass,
  toastIconVariants,
  toastInformationClass,
  toastTitleClass,
} from './Toast.variants';
import { has } from './Toast.shared';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';

const DEFAULT_LABELS: Record<ToastType, string> = {
  success: 'Éxito',
  alert: 'Advertencia',
  error: 'Error',
  info: 'Información',
};

/** Círculo con el ícono del type (decorativo: el tipo lo da el texto sr-only). */
export function ToastIcon({ type, icon }: { type: ToastType; icon?: IconName }) {
  return (
    <span className={toastIconCircleClass} data-figma-part="Icon">
      <Icon
        name={icon ?? TOAST_DEFAULT_ICONS[type]}
        size={20}
        variant="fill"
        className={toastIconVariants({ type })}
        data-figma-part="Icon-sizes"
      />
    </span>
  );
}

/** Columna Information: tipo sr-only, Subheading, Description y (Snackbar) las acciones. */
export function ToastInformation({
  type,
  label,
  title,
  description,
  children,
}: {
  type: ToastType;
  label?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  const srLabel = label ?? DEFAULT_LABELS[type];
  return (
    <div className={toastInformationClass} data-figma-part="Information">
      {srLabel && <span className="sr-only">{srLabel}: </span>}
      {has(title) && (
        <p className={toastTitleClass} data-figma-part="Subheading">
          {title}
        </p>
      )}
      {has(description) && (
        <p className={toastDescriptionClass} data-figma-part="Description">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
