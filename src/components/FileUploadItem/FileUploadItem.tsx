import { forwardRef, useId } from 'react';
import type { FileUploadItemProps, FileUploadStatus } from './FileUploadItem.types';
import {
  fileUploadActionsClass,
  fileUploadGroupClass,
  fileUploadIconColor,
  fileUploadItemVariants,
  fileUploadMessageVariants,
  fileUploadNameClass,
  fileUploadRowClass,
  fileUploadTextsClass,
} from './FileUploadItem.variants';
import { Avatar } from '../Avatar';
import type { IconName } from '../Icon/Icon.types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { cn } from '../../utils/cn';

const DEFAULT_MESSAGE: Record<FileUploadStatus, string> = {
  loading: 'Cargando',
  complete: 'Carga completa',
  error: 'Error',
  'loading-error': 'Error de carga',
  alert: 'Carga con advertencias',
};

const STATUS_ICON: Record<Exclude<FileUploadStatus, 'loading'>, IconName> = {
  complete: 'tick-circle',
  error: 'close-circle',
  'loading-error': 'close-circle',
  alert: 'warning',
};

/**
 * Ítem de carga de archivo (component set "File card" 11557:17694 de Figma). Muestra el nombre, el estado como texto
 * (anunciado con aria-live, no solo por color), la barra de progreso (role="progressbar", nombrada por el archivo) y
 * las acciones. Cada acción se nombra con el archivo ("Eliminar <título>", como ListItem).
 */
export const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  (
    {
      title,
      status = 'loading',
      message,
      progress = 0,
      icon = 'folder',
      onDelete,
      onDownload,
      onRetry,
      deleteLabel,
      downloadLabel,
      retryLabel,
      className,
      ...restProps
    },
    ref
  ) => {
    const nameId = useId();
    const isError = status === 'error' || status === 'loading-error' || status === 'alert';
    const showBar = status === 'loading' || status === 'alert';
    const text = message ?? DEFAULT_MESSAGE[status];
    const canDownload = status === 'complete' || status === 'error';
    const canRetry = status === 'loading-error' || status === 'alert';
    // Si el título no es texto, el nombre queda genérico y el título llega como descripción
    const titleText = typeof title === 'string' || typeof title === 'number' ? String(title) : null;
    const actionName = (label: string | undefined, verb: string) => label ?? (titleText ? `${verb} ${titleText}` : verb);
    const describedBy = titleText ? undefined : nameId;

    return (
      <div ref={ref} {...restProps} className={cn(fileUploadItemVariants(), className)}>
        <div className={fileUploadRowClass}>
          <div className={fileUploadGroupClass}>
            <Avatar
              variant="icon"
              size="sm"
              contrast="on-card"
              icon={status === 'loading' ? icon : STATUS_ICON[status]}
              className={fileUploadIconColor[status]}
            />
            <div className={fileUploadTextsClass}>
              <p id={nameId} data-figma-part={isError ? 'Error Message' : 'Filename'} className={fileUploadNameClass}>
                {title}
              </p>
              <p
                aria-live="polite"
                data-figma-part={isError ? 'Error Details' : 'Status'}
                className={fileUploadMessageVariants({ status })}
              >
                {text}
              </p>
            </div>
          </div>
          <div className={fileUploadActionsClass}>
            {canDownload && onDownload && (
              <Button
                variant="tertiary"
                size="xs"
                iconOnly
                aria-label={actionName(downloadLabel, 'Descargar')}
                aria-describedby={describedBy}
                onClick={onDownload}
                data-figma-part="Icon-sizes"
              >
                <Icon name="download" size={20} />
              </Button>
            )}
            {canRetry && onRetry && (
              <Button
                variant="tertiary"
                size="xs"
                iconOnly
                aria-label={actionName(retryLabel, 'Reintentar')}
                aria-describedby={describedBy}
                onClick={onRetry}
                data-figma-part="Icon-sizes"
              >
                <Icon name="refresh" size={20} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="tertiary"
                size="xs"
                iconOnly
                state="delete"
                aria-label={actionName(deleteLabel, 'Eliminar')}
                aria-describedby={describedBy}
                onClick={onDelete}
                data-figma-part="Icon-sizes"
              >
                <Icon name="trash" size={20} />
              </Button>
            )}
          </div>
        </div>
        {showBar && (
          <ProgressBar
            type="linear-text"
            status={status === 'alert' ? 'alert' : 'success'}
            value={progress}
            aria-labelledby={nameId}
            statusLabel={typeof text === 'string' ? text : undefined}
          />
        )}
      </div>
    );
  }
);

FileUploadItem.displayName = 'FileUploadItem';
