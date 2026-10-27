import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { DragEvent, HTMLAttributes } from 'react';
import type { FileDropzoneProps } from './FileDropzone.types';
import {
  fileDropzoneActionVariants,
  fileDropzoneContentClass,
  fileDropzoneIconVariants,
  fileDropzoneMaxVariants,
  fileDropzoneRowClass,
  fileDropzoneSpecsVariants,
  fileDropzoneTitleVariants,
  fileDropzoneVariants,
} from './FileDropzone.variants';
import { defaultRejectionMessage, describeAccept, filterFiles, formatFileSize } from './FileDropzone.utils';
import { Icon } from '../Icon';
import { DashedStroke } from '../_internal/DashedStroke';
import { cn } from '../../utils/cn';

/**
 * Área para soltar o elegir archivos (component set "Input file upload (Atom)" 11438:5774 de Figma).
 * La raíz es un `<label>` que envuelve un `<input type="file">` real (oculto de forma accesible): clic, Enter y Espacio
 * abren el selector nativo, el foco con teclado se ve en la raíz y el nombre accesible sale del título y la acción
 * ("Selecciona tu archivo"), con los tipos y el tamaño máximo como descripción. También admite arrastrar y soltar.
 * Valida tipo (`accept`), tamaño (`maxSize`) y cantidad (`multiple`); los descartados se anuncian en una región
 * aria-live y se entregan en `onFilesRejected`. El `ref` apunta al input; `className` y `rootProps`, a la raíz.
 */
export const FileDropzone = forwardRef<HTMLInputElement, FileDropzoneProps>(
  (
    {
      accept,
      maxSize,
      multiple = false,
      state,
      icon,
      children,
      title = 'Selecciona tu',
      actionText = 'archivo',
      specifications,
      maxSizeLabel,
      onFilesSelected,
      onFilesRejected,
      rejectionMessage = defaultRejectionMessage,
      rootProps,
      className,
      disabled = false,
      id,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const baseId = useId();
    const inputId = id ?? `${baseId}-input`;
    const titleId = `${baseId}-title`;
    const actionId = `${baseId}-action`;
    const specsId = `${baseId}-specs`;
    const [dragging, setDragging] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const frameRef = useRef(0);

    useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

    // Vacía la región y fija el mensaje en el cuadro siguiente: así un rechazo idéntico se vuelve a anunciar
    const announce = (message: string) => {
      cancelAnimationFrame(frameRef.current);
      setAnnouncement('');
      if (message) frameRef.current = requestAnimationFrame(() => setAnnouncement(message));
    };

    const isDisabled = disabled || state === 'disabled';
    const custom = children !== undefined;
    const visual = isDisabled ? 'disabled' : state === 'default' ? 'idle' : (state ?? 'auto');
    const specsText = specifications ?? (accept ? `${describeAccept(accept)}.` : null);
    const maxText = maxSizeLabel ?? (maxSize !== undefined ? `Máx. ${formatFileSize(maxSize)}` : null);
    const hasInfo = specsText != null || maxText != null;
    const describedBy = [hasInfo ? specsId : undefined, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

    const handleFiles = (files: File[]) => {
      if (files.length === 0) return;
      const { accepted, rejected } = filterFiles(files, { accept, maxSize, multiple });
      if (rejected.length > 0) {
        announce(rejectionMessage(rejected));
        onFilesRejected?.(rejected);
      } else {
        announce('');
      }
      if (accepted.length > 0) onFilesSelected?.(accepted);
    };

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
      if (isDisabled) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      setDragging(true);
    };
    const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
      setDragging(false);
    };
    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
      if (isDisabled) return;
      event.preventDefault();
      setDragging(false);
      handleFiles(Array.from(event.dataTransfer.files));
    };

    const iconNode =
      icon !== undefined ? (
        icon
      ) : (
        <Icon
          name="attach-circle"
          size={32}
          variant="line"
          data-figma-part="Icon Right"
          className={fileDropzoneIconVariants({ disabled: isDisabled })}
        />
      );

    // Modo con contenido propio (`children`): solo el recuadro (trazo, ícono y estados). Sin `<label>` ni input: el
    // contenido trae sus controles (botones) y el arrastre lo maneja quien lo usa mediante `rootProps`.
    if (custom) {
      return (
        <div
          {...(rootProps as HTMLAttributes<HTMLDivElement>)}
          className={cn(
            fileDropzoneVariants({ visual }),
            'cursor-auto has-[:focus-visible]:px-ds-space-field-lg has-[:focus-visible]:text-ds-border-field-active',
            rootProps?.className,
            className
          )}
        >
          <DashedStroke />
          {iconNode}
          {children}
        </div>
      );
    }

    return (
      <label
        htmlFor={inputId}
        {...rootProps}
        data-dragging={dragging || undefined}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(fileDropzoneVariants({ visual }), rootProps?.className, className)}
      >
        <input
          {...restProps}
          ref={ref}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={isDisabled}
          aria-labelledby={`${titleId} ${actionId}`}
          aria-describedby={describedBy}
          onChange={(event) => {
            handleFiles(Array.from(event.target.files ?? []));
            // Permite volver a elegir el mismo archivo
            event.target.value = '';
          }}
        />
        <DashedStroke />
        {iconNode}
        <span data-figma-part="Container " className={fileDropzoneContentClass}>
          <span data-figma-part="Frame 1984079840" className={fileDropzoneRowClass}>
            <span id={titleId} data-figma-part="Heading" className={fileDropzoneTitleVariants({ disabled: isDisabled })}>
              {title}
            </span>
            <span id={actionId} data-figma-part="Heading" className={fileDropzoneActionVariants({ disabled: isDisabled })}>
              {actionText}
            </span>
          </span>
          {hasInfo && (
            <span id={specsId} data-figma-part="Info Group" className={fileDropzoneRowClass}>
              {specsText != null && (
                <span data-figma-part="Specifications" className={fileDropzoneSpecsVariants({ disabled: isDisabled })}>
                  {specsText}
                </span>
              )}
              {maxText != null && (
                <span data-figma-part="Máx. 23 GB" className={fileDropzoneMaxVariants({ disabled: isDisabled })}>
                  {maxText}
                </span>
              )}
            </span>
          )}
        </span>
        <span role="status" aria-live="polite" className="sr-only">
          {announcement}
        </span>
      </label>
    );
  }
);

FileDropzone.displayName = 'FileDropzone';
