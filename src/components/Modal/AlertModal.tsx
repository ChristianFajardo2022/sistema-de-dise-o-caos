import { forwardRef, useId, useRef } from 'react';
import type { AlertModalPanelProps, AlertModalProps } from './Modal.types';
import {
  ALERT_MODAL_ICONS,
  alertModalActionsClass,
  alertModalBodyClass,
  alertModalCloseClass,
  alertModalDescriptionGroupClass,
  alertModalFrameClass,
  alertModalHandleClass,
  alertModalIconVariants,
  alertModalInfoClass,
  alertModalLeadClass,
  alertModalPanelVariants,
  alertModalSurfaceClass,
  alertModalTitleClass,
} from './AlertModal.variants';
import { ModalActionButtons } from './ModalActions';
import { leastDestructiveAction } from './ModalActions.utils';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { ModalDialog } from '../_internal/ModalDialog';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Superficie del Simple modal (set 11946:10227) sin `<dialog>`: ícono semántico, título, descripciones, acciones y el
 * Button corner de cerrar en la muesca. `AlertModal` la monta dentro del diálogo; suelta sirve para documentación.
 */
export const AlertModalPanel = forwardRef<HTMLDivElement, AlertModalPanelProps>(
  (
    {
      type = 'success',
      title,
      headingLevel = 2,
      description,
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
    const withDescription = has(description) || has(children);
    const withActions = has(actions) || Boolean(primaryAction || secondaryAction || tertiaryAction);
    return (
      <div {...rest} ref={ref} className={cn(alertModalPanelVariants(), className)}>
        <div className={alertModalFrameClass} data-figma-part="desktop">
          <NotchedSurface notch={closable ? 'md' : 'none'} className={alertModalSurfaceClass} data-figma-part="Canva" />
          <span aria-hidden="true" className={alertModalHandleClass} data-figma-part="Divider" />
          <Icon
            name={ALERT_MODAL_ICONS[type]}
            size={56}
            variant="line"
            className={alertModalIconVariants({ type })}
            data-figma-part="Icon-sizes"
          />
          {(has(title) || withDescription) && (
            <div className={alertModalInfoClass} data-figma-part="Info">
              {has(title) && (
                <Heading id={titleId} className={alertModalTitleClass} data-figma-part="Heading">
                  {title}
                </Heading>
              )}
              {withDescription && (
                <div id={descriptionId} className={alertModalDescriptionGroupClass} data-figma-part="Description group">
                  {has(description) && <p className={alertModalLeadClass}>{description}</p>}
                  {has(children) && <div className={alertModalBodyClass}>{children}</div>}
                </div>
              )}
            </div>
          )}
          {closable && (
            <ButtonCorner
              variant="icon"
              contrast="on-canva"
              size="md"
              aria-label={closeLabel}
              icon={<Icon name="close" size={16} variant="line" data-figma-part="Icon-sizes" />}
              onClick={onClose}
              className={alertModalCloseClass}
              data-figma-part="Button corner "
            />
          )}
          {withActions && (
            <div className={alertModalActionsClass} data-figma-part="CTA">
              {has(actions) ? (
                actions
              ) : (
                <ModalActionButtons
                  primaryAction={primaryAction}
                  secondaryAction={secondaryAction}
                  tertiaryAction={tertiaryAction}
                  onClose={onClose}
                  focusAction={leastDestructiveAction({ primaryAction, secondaryAction, tertiaryAction })}
                  focusRef={focusRef}
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

AlertModalPanel.displayName = 'AlertModalPanel';

/**
 * Simple modal de Figma: aviso o confirmación corta (`role="alertdialog"`, patrón APG Alert Dialog) sobre `<dialog>`
 * con `showModal()`: foco atrapado, resto inerte, Escape y clic en el fondo cierran, y al cerrar el foco vuelve a quien
 * lo abrió. El foco inicial va a la acción menos destructiva (Secondary, Tertiary o Primary). En escritorio va centrado;
 * en móvil (< 48rem) es una hoja inferior.
 */
export const AlertModal = forwardRef<HTMLDialogElement, AlertModalProps>(
  (
    {
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      type = 'success',
      title,
      headingLevel,
      description,
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
    const [open, setOpen] = useControllableState<boolean>(openProp, defaultOpen, onOpenChange, 'AlertModal');
    const withDescription = has(description) || has(children);
    return (
      <ModalDialog
        aria-labelledby={has(title) ? titleId : undefined}
        aria-describedby={withDescription ? descriptionId : undefined}
        {...rest}
        ref={ref}
        role="alertdialog"
        open={open}
        onOpenChange={setOpen}
        closeOnBackdrop={closeOnBackdrop}
        initialFocus={initialFocus ?? focusRef}
        placement="center-sheet"
        className={cn('[&>div]:max-h-[90dvh]', className)}
      >
        <AlertModalPanel
          type={type}
          title={title}
          headingLevel={headingLevel}
          description={description}
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
        </AlertModalPanel>
      </ModalDialog>
    );
  }
);

AlertModal.displayName = 'AlertModal';
