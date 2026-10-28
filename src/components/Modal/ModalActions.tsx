import type { MouseEvent, Ref, RefObject } from 'react';
import type { ButtonVariant } from '../Button/Button.types';
import type { ModalAction } from './Modal.types';
import type { ModalFocusAction } from './ModalActions.utils';
import { Button } from '../Button';

interface ModalActionButtonsProps {
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  tertiaryAction?: ModalAction;
  /** Cierre tras el clic (si `onClick` no llamó a `preventDefault`). */
  onClose?: () => void;
  /** Acción a la que se engancha `focusRef`. */
  focusAction?: ModalFocusAction;
  focusRef?: RefObject<HTMLElement | null>;
  /** Clases de cada botón (p. ej. ancho completo en móvil). */
  buttonClassName?: string;
}

/**
 * Botones del pie en el orden de Figma (Tertiary, Secondary, Primary). Pieza interna de la carpeta Modal.
 * Cada acción llama a su `onClick` y después cierra, salvo `event.preventDefault()`.
 */
export function ModalActionButtons({
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onClose,
  focusAction,
  focusRef,
  buttonClassName,
}: ModalActionButtonsProps) {
  const render = (action: ModalAction | undefined, variant: ButtonVariant, key: ModalFocusAction) => {
    if (!action) return null;
    const { label, onClick, ...rest } = action;
    return (
      <Button
        {...rest}
        key={key}
        ref={key === focusAction ? (focusRef as Ref<HTMLButtonElement>) : undefined}
        variant={variant}
        size="md"
        className={buttonClassName}
        data-figma-part="Button"
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) onClose?.();
        }}
      >
        {label}
      </Button>
    );
  };
  return (
    <>
      {render(tertiaryAction, 'tertiary', 'tertiary')}
      {render(secondaryAction, 'secondary', 'secondary')}
      {render(primaryAction, 'primary', 'primary')}
    </>
  );
}
