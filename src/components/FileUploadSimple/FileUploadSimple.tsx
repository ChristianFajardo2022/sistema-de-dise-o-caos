import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import type { DragEvent, FocusEvent } from 'react';
import type { FileUploadSimpleFile, FileUploadSimpleProps, FileUploadSimpleStatus } from './FileUploadSimple.types';
import {
  fileUploadSimpleIconVariants,
  fileUploadSimpleLinkClass,
  fileUploadSimpleNameClass,
  fileUploadSimpleProgressRowClass,
  fileUploadSimpleRootClass,
} from './FileUploadSimple.variants';
import { Alert } from '../Alert';
import { ButtonCorner } from '../ButtonCorner';
import {
  FileDropzone,
  defaultRejectionMessage,
  describeAccept,
  fileDropzoneContentClass,
  fileDropzoneMaxVariants,
  fileDropzoneRowClass,
  fileDropzoneSpecsVariants,
  fileDropzoneTitleVariants,
  fileDropzoneActionVariants,
  filterFiles,
  formatFileSize,
} from '../FileDropzone';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';

// Figma: 21407:3920, 21412:4523
/**
 * Carga de un solo archivo (sets "File upload simple-2" y "File upload simple" de Figma): un
 * recuadro de 304 que cambia de contenido según `status`. En `idle` es un FileDropzone (se reutiliza tal cual); en
 * `uploading` muestra el progreso dentro del recuadro (ProgressBar + botón eliminar) y en `loaded` el archivo con
 * "volver a cargar" y su tamaño. No sube nada: quien lo usa recibe el archivo en `onFileChange`, hace la carga y
 * describe `status` y `progress`. Sin `status`, elegir un archivo pasa a `loaded` y eliminar vuelve a `idle`.
 *
 * En `uploading` y `loaded` usa el FileDropzone en modo contenido propio (`icon` + `children`): el recuadro, el trazo
 * y sus estados son los mismos que en `idle`. El `ref` apunta al
 * `<input type="file">` activo.
 *
 * Teclado y lector: el input nativo sigue siendo el control (Enter/Espacio abren el selector); "volver a cargar" y
 * eliminar son botones; el progreso es un `role="progressbar"` nombrado por el archivo; el inicio de la carga y su
 * final se anuncian en una región `role="status"`; al cambiar de estado el foco pasa al control que lo sustituye.
 */
export const FileUploadSimple = forwardRef<HTMLInputElement, FileUploadSimpleProps>(
  (
    {
      accept,
      maxSize,
      title = 'Selecciona tu',
      actionText = 'archivo',
      formatsText,
      sizeText,
      file: fileProp,
      defaultFile = null,
      onFileChange,
      status: statusProp,
      defaultStatus,
      progress = 0,
      onRemove,
      onReplace,
      onFilesRejected,
      disabled = false,
      state,
      alert,
      replaceText = 'volver a cargar',
      removeLabel,
      name,
      className,
      ...restProps
    },
    ref
  ) => {
    const baseId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(inputRef, ref);
    const rootRef = useRef<HTMLDivElement>(null);
    const hadFocus = useRef(false);
    const frameRef = useRef(0);
    const [file, setFile] = useControllableState<FileUploadSimpleFile | null>(
      fileProp,
      defaultFile,
      undefined,
      { name: 'FileUploadSimple', controlled: fileProp !== undefined }
    );
    const [status, setStatus] = useControllableState<FileUploadSimpleStatus>(
      statusProp,
      defaultStatus ?? (defaultFile ? 'loaded' : 'idle'),
      undefined,
      { name: 'FileUploadSimple' }
    );
    const [dragging, setDragging] = useState(false);
    const [announcement, setAnnouncement] = useState('');
    const previous = useRef(status);

    const isDisabled = disabled || state === 'disabled';
    const fileName = file?.name ?? '';
    const specsText = formatsText ?? (accept ? describeAccept(accept) : null);
    const maxText = sizeText ?? (maxSize !== undefined ? `Máx. ${formatFileSize(maxSize)}` : null);
    const hasInfo = specsText != null || maxText != null;
    const sizeLabel = file?.size !== undefined ? formatFileSize(file.size) : null;

    useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

    const announce = (message: string) => {
      cancelAnimationFrame(frameRef.current);
      setAnnouncement('');
      if (message) frameRef.current = requestAnimationFrame(() => setAnnouncement(message));
    };

    // Anuncia el inicio y el final de la carga, y mueve el foco al control que sustituye al que desapareció
    useEffect(() => {
      if (previous.current === status) return;
      const from = previous.current;
      previous.current = status;
      if (status === 'uploading') announce(`Cargando ${fileName}`.trim());
      else if (status === 'loaded') announce(`Carga completa: ${fileName}`.trim());
      else if (status === 'idle' && from === 'uploading') announce('Carga cancelada');
      const active = document.activeElement;
      const lost = !active || active === document.body || rootRef.current?.contains(active);
      if (hadFocus.current && lost) {
        rootRef.current?.querySelector<HTMLElement>('[data-focus-target], input[type="file"]')?.focus();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const accepted = (files: File[], replacing: boolean) => {
      const { accepted: ok, rejected } = filterFiles(files, { accept, maxSize, multiple: false });
      if (rejected.length > 0) {
        announce(defaultRejectionMessage(rejected));
        onFilesRejected?.(rejected);
      }
      const next = ok[0];
      if (!next) return;
      hadFocus.current = true;
      setFile({ name: next.name, size: next.size });
      if (statusProp === undefined) setStatus('loaded');
      if (replacing) onReplace?.(next);
      onFileChange?.(next);
    };

    const remove = () => {
      hadFocus.current = true;
      setFile(null);
      if (statusProp === undefined) setStatus('idle');
      onRemove?.();
      onFileChange?.(null);
    };

    const trackFocus = {
      onFocus: () => {
        hadFocus.current = true;
      },
      onBlur: (event: FocusEvent<HTMLDivElement>) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) hadFocus.current = false;
      },
    };

    const onDrag = (event: DragEvent<HTMLElement>) => {
      if (isDisabled) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      setDragging(true);
    };
    const onDragLeave = (event: DragEvent<HTMLElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
      setDragging(false);
    };
    const onDrop = (event: DragEvent<HTMLElement>) => {
      if (isDisabled) return;
      event.preventDefault();
      setDragging(false);
      accepted(Array.from(event.dataTransfer.files), true);
    };

    const forced = state === 'hover' || state === 'focus' ? state : undefined;
    const alertNode = alert ? <Alert {...alert} data-figma-part="Alerts" className="w-full" /> : null;
    const live = (
      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    );

    const rootProps = {
      ...restProps,
      ref: rootRef,
      'data-status': status,
      className: cn(fileUploadSimpleRootClass, className),
      ...trackFocus,
    };

    if (status === 'idle' || status === 'error') {
      return (
        <div {...rootProps}>
          <FileDropzone
            ref={mergedRef}
            name={name}
            accept={accept}
            maxSize={maxSize}
            disabled={isDisabled}
            state={isDisabled ? undefined : forced}
            title={title}
            actionText={actionText}
            specifications={specsText ?? undefined}
            maxSizeLabel={maxText ?? undefined}
            onFilesSelected={(files) => accepted(files, false)}
            onFilesRejected={onFilesRejected}
            rootProps={{ 'data-figma-part': 'Input file upload (Atom)' }}
            className="min-h-[234px]"
          />
          {alertNode}
        </div>
      );
    }

    const uploading = status === 'uploading';
    const nameId = `${baseId}-name`;
    // Cargando con archivo conocido (Type=Uploading, State=Loaded): se ve el archivo, apagado, con la barra debajo
    const showFile = file != null || !uploading;
    const dim = isDisabled || uploading;

    return (
      <div {...rootProps}>
        <FileDropzone
          state={isDisabled ? undefined : uploading ? 'static' : forced}
          disabled={isDisabled}
          icon={
            <Icon
              name={showFile ? 'tick-circle' : 'attach-circle'}
              size={32}
              variant={showFile ? 'fill' : 'line'}
              data-figma-part="Icon Right"
              className={fileUploadSimpleIconVariants({ tone: isDisabled ? 'disabled' : 'loaded' })}
            />
          }
          rootProps={{
            'data-figma-part': 'Input file upload (Atom)',
            'data-dragging': dragging || undefined,
            onDragEnter: uploading ? undefined : onDrag,
            onDragOver: uploading ? undefined : onDrag,
            onDragLeave: uploading ? undefined : onDragLeave,
            onDrop: uploading ? undefined : onDrop,
          }}
          className="min-h-[234px]"
        >
          <span data-figma-part="Container " className={fileDropzoneContentClass}>
            <span data-figma-part="Frame 1984079840" className={cn(fileDropzoneRowClass, 'flex-nowrap')}>
              {!showFile ? (
                <>
                  <span data-figma-part="Heading" className={fileDropzoneTitleVariants({ disabled: true })}>
                    {title}
                  </span>
                  <span data-figma-part="Heading" className={fileDropzoneActionVariants({ disabled: true })}>
                    {actionText}
                  </span>
                </>
              ) : (
                <>
                  <span
                    id={nameId}
                    data-figma-part="Heading"
                    className={cn(fileUploadSimpleNameClass, dim && 'text-ds-text-neutral-disabled-on-card')}
                  >
                    {fileName}
                  </span>
                  <button
                    type="button"
                    data-figma-part="Heading"
                    data-focus-target
                    disabled={dim}
                    aria-describedby={nameId}
                    className={fileUploadSimpleLinkClass}
                    onClick={() => inputRef.current?.click()}
                  >
                    {replaceText}
                  </button>
                </>
              )}
            </span>
            {!showFile
              ? hasInfo && (
                  <span data-figma-part="Info Group" className={fileDropzoneRowClass}>
                    {specsText != null && (
                      <span data-figma-part="Specifications" className={fileDropzoneSpecsVariants({ disabled: true })}>
                        {specsText}
                      </span>
                    )}
                    {maxText != null && (
                      <span
                        data-figma-part="Máx. 23 GB"
                        className={cn(fileDropzoneMaxVariants({ disabled: true }), '[font-weight:var(--ds-primitives-typography-weight-regular)]')}
                      >
                        {maxText}
                      </span>
                    )}
                  </span>
                )
              : (sizeLabel != null || (maxText != null && !uploading)) && (
                  <span data-figma-part="Info Group" className={fileDropzoneRowClass}>
                    {sizeLabel != null && (
                      <span data-figma-part="Specifications" className={fileDropzoneSpecsVariants({ disabled: dim })}>
                        {sizeLabel}
                      </span>
                    )}
                    {maxText != null && !uploading && (
                      <span data-figma-part="Máx. 23 GB" className={fileDropzoneMaxVariants({ disabled: dim })}>
                        {maxText}
                      </span>
                    )}
                  </span>
                )}
          </span>
          {uploading && (
            <div data-figma-part="Frame 1984080604" className={fileUploadSimpleProgressRowClass}>
              <ProgressBar
                value={progress}
                label={fileName ? `Carga de ${fileName}` : 'Carga del archivo'}
                data-figma-part="Progress bar"
                className="min-w-0 flex-1"
              />
              <ButtonCorner
                variant="icon"
                size="sm"
                data-figma-part="Icon Right"
                data-focus-target
                disabled={isDisabled}
                aria-label={removeLabel ?? (fileName ? `Eliminar ${fileName}` : 'Eliminar archivo')}
                icon={<Icon name="trash" size={20} className="text-ds-icon-semantic-error-firts" />}
                onClick={remove}
              />
            </div>
          )}
          {!uploading && (
            <input
              ref={mergedRef}
              type="file"
              name={name}
              hidden
              tabIndex={-1}
              accept={accept}
              disabled={isDisabled}
              onChange={(event) => {
                accepted(Array.from(event.target.files ?? []), true);
                event.target.value = '';
              }}
            />
          )}
        </FileDropzone>
        {alertNode}
        {live}
      </div>
    );
  }
);

FileUploadSimple.displayName = 'FileUploadSimple';
