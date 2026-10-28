import { forwardRef, isValidElement } from 'react';
import type { ReactNode } from 'react';
import type { SnackbarAction, SnackbarProps } from './Toast.types';
import { defaultRole, escapeCloses, has, useAutoClose } from './Toast.shared';
import { ToastIcon, ToastInformation } from './ToastParts';
import { snackbarActionsClass, toastVariants } from './Toast.variants';
import { Button } from '../Button';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

const isAction = (node: unknown): node is SnackbarAction =>
  typeof node === 'object' && node !== null && !isValidElement(node) && 'label' in node;

/**
 * Snackbar (set 11844:10443 de Figma): como el Toast pero sin botón de cierre ni muesca, con hasta dos
 * acciones (Button tertiary xs unicolor) bajo el texto. Región viva con las mismas reglas que el Toast.
 * Sin botón de cierre, la salida es una acción (con `closeOnAction` llama a `onClose`), Escape o `duration`.
 */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  (
    { type = 'success', title, description, icon, label, role, duration, onClose, action, secondaryAction, closeOnAction = true, className, onKeyDown, onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest },
    ref
  ) => {
    const timer = useAutoClose(duration, onClose);
    const close = escapeCloses(onClose);
    const renderAction = (node: SnackbarAction | ReactNode, part: string) => {
      if (!has(node)) return null;
      if (!isAction(node)) return <span data-figma-part={part}>{node as ReactNode}</span>;
      return (
        <Button
          key={part}
          data-figma-part={part}
          variant="tertiary"
          size="xs"
          unicolor
          href={node.href}
          onClick={() => {
            node.onClick?.();
            if (closeOnAction) onClose?.();
          }}
        >
          {node.label}
        </Button>
      );
    };
    const first = renderAction(action, 'Button');
    const second = renderAction(secondaryAction, 'Button 2');
    return (
      <div
        {...rest}
        ref={ref}
        role={role ?? defaultRole(type)}
        aria-atomic="true"
        data-theme="dark"
        data-type={type}
        className={cn(toastVariants({ surface: 'flat' }), className)}
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
        <NotchedSurface fill="var(--color-ds-background-container-default-unicolor)" />
        <ToastIcon type={type} icon={icon} />
        <ToastInformation type={type} label={label} title={title} description={description}>
          {(first || second) && (
            <div className={snackbarActionsClass} data-figma-part="CTA">
              {first}
              {second}
            </div>
          )}
        </ToastInformation>
      </div>
    );
  }
);

Snackbar.displayName = 'Snackbar';
