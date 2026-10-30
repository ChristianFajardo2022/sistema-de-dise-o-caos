import { forwardRef, useRef } from 'react';
import type { FileUploadProps } from './FileUpload.types';
import { fileUploadClass, fileUploadListClass } from './FileUpload.variants';
import { FileDropzone } from '../FileDropzone';
import { FileUploadItem } from '../FileUploadItem';
import { useMergedRefs } from '../../utils/refs';
import { cn } from '../../utils/cn';

// Figma: 11592:8647
/**
 * Carga de archivos completa (component set "File upload (suelto)" de Figma): un FileDropzone y, debajo,
 * la lista de archivos con un FileUploadItem por archivo. No sube nada ni guarda archivos: quien lo usa recibe los
 * archivos en `onFilesSelected`, hace la carga y describe el avance en `items`. Aporta lo que la composición suelta no
 * resuelve: la lista es una lista real (`ul` nombrada), las acciones llegan con el `id` del archivo y, al eliminar uno,
 * el foco vuelve al área para soltar en vez de perderse. El `ref` apunta al `<input type="file">`; `className` y los
 * atributos nativos, a la raíz.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      items = [],
      onRemove,
      onRetry,
      onDownload,
      listLabel = 'Archivos',
      dropzoneProps,
      accept,
      maxSize,
      multiple,
      disabled,
      title,
      actionText,
      specifications,
      maxSizeLabel,
      onFilesSelected,
      onFilesRejected,
      rejectionMessage,
      className,
      ...restProps
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRefs(innerRef, ref);

    return (
      <div {...restProps} className={cn(fileUploadClass, className)}>
        <FileDropzone
          {...dropzoneProps}
          rootProps={{ ...dropzoneProps?.rootProps, 'data-figma-part': 'Input file upload (Atom)' }}
          ref={mergedRef}
          accept={accept}
          maxSize={maxSize}
          multiple={multiple}
          disabled={disabled}
          title={title}
          actionText={actionText}
          specifications={specifications}
          maxSizeLabel={maxSizeLabel}
          onFilesSelected={onFilesSelected}
          onFilesRejected={onFilesRejected}
          rejectionMessage={rejectionMessage}
        />
        {items.length > 0 && (
          <ul ref={listRef} tabIndex={-1} aria-label={listLabel} data-figma-part="Container" className={fileUploadListClass}>
            {items.map((item) => (
              <li key={item.id} data-figma-part="File card">
                <FileUploadItem
                  title={item.name}
                  status={item.status}
                  progress={item.progress}
                  message={item.message}
                  icon={item.icon}
                  onDelete={
                    onRemove
                      ? () => {
                          onRemove(item.id);
                          const input = innerRef.current;
                          // Con el área deshabilitada el input no recibe foco: cae a la lista para no perderlo
                          if (input && !input.disabled) input.focus();
                          else listRef.current?.focus();
                        }
                      : undefined
                  }
                  onRetry={onRetry ? () => onRetry(item.id) : undefined}
                  onDownload={onDownload ? () => onDownload(item.id) : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
