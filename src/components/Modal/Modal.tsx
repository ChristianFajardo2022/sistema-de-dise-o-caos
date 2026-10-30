import { forwardRef, useId, useRef } from 'react';
import type { Ref } from 'react';
import type { ModalPanelProps, ModalProps } from './Modal.types';
import {
  modalActionsClass,
  modalBodyVariants,
  modalCloseIconClass,
  modalCloseRowClass,
  modalCornerClass,
  modalDescriptionClass,
  modalFrameVariants,
  modalHandleClass,
  modalHeaderClass,
  modalInfoClass,
  modalPanelVariants,
  modalSurfaceClass,
  modalTitleClass,
  modalTopClass,
} from './Modal.variants';
import { ModalActionButtons } from './ModalActions';
import { Avatar } from '../Avatar';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { ScrollArea } from '../ScrollArea';
import { ModalDialog } from '../_internal/ModalDialog';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node !== undefined && node !== null && node !== false && node !== '';

// Figma: 14446:66166
/**
 * Superficie del Complex modal sin `<dialog>`: encabezado (ícono, título y descripción), contenido
 * libre con desplazamiento, pie con acciones y cerrar (Button corner en la muesca, o ícono en el panel lateral).
 * `Modal` la monta dentro del diálogo; suelta sirve para documentación.
 */
export const ModalPanel = forwardRef<HTMLDivElement, ModalPanelProps>(
  (
    {
      lateral = false,
      title,
      headingLevel = 2,
      description,
      icon,
      bodyLabel = 'Contenido',
      children,
      titleId,
      descriptionId,
      primaryAction,
      secondaryAction,
      tertiaryAction,
      actions,
      closable = true,
      closeLabel = 'Cerrar',
      onClose,
      focusRef,
      className,
      ...rest
    },
    ref
  ) => {
    const Heading = `h${headingLevel}` as const;
    const withHeader = has(title) || has(description) || icon !== undefined;
    const withActions = has(actions) || Boolean(primaryAction || secondaryAction || tertiaryAction);

    const header = withHeader && (
      <div className={modalHeaderClass} data-figma-part="Header">
        {icon !== undefined && (
          <Avatar variant="icon" icon={icon} contrast="on-card" size="md" data-figma-part="Avatar" />
        )}
        {(has(title) || has(description)) && (
          <div className={modalInfoClass} data-figma-part="Info">
            {has(title) && (
              <Heading
                id={titleId}
                ref={focusRef as Ref<HTMLHeadingElement>}
                tabIndex={-1}
                className={modalTitleClass}
                data-figma-part="Heading"
              >
                {title}
              </Heading>
            )}
            {has(description) && (
              <p id={descriptionId} className={modalDescriptionClass}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div {...rest} ref={ref} className={cn(modalPanelVariants({ lateral }), className)}>
        <div className={modalFrameVariants({ lateral })} data-figma-part="Desktop">
          {!lateral && <NotchedSurface notch={closable ? 'md' : 'none'} className={modalSurfaceClass} data-figma-part="Canva" />}
          <span aria-hidden="true" className={modalHandleClass} />
          {lateral ? (
            (closable || header) && (
              <div className={modalTopClass}>
                {closable && (
                  <div className={modalCloseRowClass} data-figma-part="Close">
                    <button type="button" aria-label={closeLabel} onClick={onClose} className={modalCloseIconClass}>
                      <Icon name="close" size={24} variant="line" data-figma-part="Icon-sizes" />
                    </button>
                  </div>
                )}
                {header}
              </div>
            )
          ) : (
            header
          )}
          {!lateral && closable && (
            <ButtonCorner
              variant="icon"
              contrast="on-canva"
              size="md"
              aria-label={closeLabel}
              icon={<Icon name="close" size={16} variant="line" data-figma-part="Icon-sizes" />}
              onClick={onClose}
              className={modalCornerClass}
              data-figma-part="Button corner "
            />
          )}
          <ScrollArea aria-label={bodyLabel} scrollbarGap="lg" className={modalBodyVariants({ lateral })} data-figma-part="Container">
            {children}
          </ScrollArea>
          {withActions && (
            <div className={modalActionsClass} data-figma-part="CTA">
              {has(actions) ? (
                actions
              ) : (
                <ModalActionButtons
                  primaryAction={primaryAction}
                  secondaryAction={secondaryAction}
                  tertiaryAction={tertiaryAction}
                  onClose={onClose}
                  buttonClassName="mobile:w-full"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ModalPanel.displayName = 'ModalPanel';

/**
 * Complex modal de Figma: diálogo (patrón APG Dialog Modal) sobre `<dialog>` con `showModal()`: foco atrapado, resto
 * inerte, Escape y clic en el fondo cierran, el documento no se desplaza debajo y al cerrar el foco vuelve a quien lo
 * abrió. Al abrir, el foco va al título (para leer desde el principio aunque el contenido sea largo).
 * `lateral`: panel lateral derecho a todo el alto; si no, centrado. En móvil (< 48rem) los dos son una hoja inferior.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      lateral = false,
      title,
      headingLevel,
      description,
      icon,
      bodyLabel,
      children,
      primaryAction,
      secondaryAction,
      tertiaryAction,
      actions,
      closable = true,
      closeLabel,
      closeOnBackdrop = true,
      initialFocus,
      className,
      ...rest
    },
    ref
  ) => {
    const baseId = useId();
    const titleId = `${baseId}-title`;
    const descriptionId = `${baseId}-description`;
    const focusRef = useRef<HTMLElement>(null);
    const [open, setOpen] = useControllableState<boolean>(openProp, defaultOpen, onOpenChange, 'Modal');
    return (
      <ModalDialog
        aria-labelledby={has(title) ? titleId : undefined}
        aria-describedby={has(description) ? descriptionId : undefined}
        {...rest}
        ref={ref}
        open={open}
        onOpenChange={setOpen}
        closeOnBackdrop={closeOnBackdrop}
        initialFocus={initialFocus ?? focusRef}
        placement={lateral ? 'side' : 'center-sheet'}
        className={cn(lateral ? 'mobile:[&>div]:max-h-[90dvh]' : '[&>div]:max-h-[90dvh]', className)}
      >
        <ModalPanel
          lateral={lateral}
          title={title}
          headingLevel={headingLevel}
          description={description}
          icon={icon}
          bodyLabel={bodyLabel}
          titleId={titleId}
          descriptionId={descriptionId}
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
          tertiaryAction={tertiaryAction}
          actions={actions}
          closable={closable}
          closeLabel={closeLabel}
          onClose={() => setOpen(false)}
          focusRef={focusRef}
        >
          {children}
        </ModalPanel>
      </ModalDialog>
    );
  }
);

Modal.displayName = 'Modal';
