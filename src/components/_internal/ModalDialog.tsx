import { forwardRef, useEffect, useRef } from 'react';
import type { DialogHTMLAttributes, KeyboardEvent, MouseEvent, PointerEvent, RefObject, SyntheticEvent } from 'react';
import { useMergedRefs } from '../../utils/refs';
import { cn } from '../../utils/cn';

/**
 * Colocación del diálogo.
 * - `center`: centrado en la pantalla.
 * - `side`: panel lateral derecho a todo el alto; en móvil (< 48rem), hoja inferior que crece hasta el 90 % del alto.
 * - `sheet`: hoja inferior en todos los tamaños.
 * - `center-sheet`: centrado en escritorio y tableta; en móvil (< 48rem), hoja inferior que crece hasta el 90 % del alto.
 */
export type ModalDialogPlacement = 'center' | 'side' | 'sheet' | 'center-sheet';

export interface ModalDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  /** Abierto. Sincroniza el `<dialog>` con `showModal()` / `close()`. */
  open: boolean;
  /** Se llama con `false` al pedir el cierre: Escape, clic en el fondo o `close()` del navegador. */
  onOpenChange: (open: boolean) => void;
  /** Rol. `alertdialog` para confirmaciones (con foco inicial en la acción menos destructiva). Por defecto el implícito de `<dialog>`. */
  role?: DialogHTMLAttributes<HTMLDialogElement>['role'];
  /** Elemento que recibe el foco al abrir. Por defecto el del navegador (el primero enfocable o el que tenga `autofocus`). */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Cierra con un clic en el fondo. Solo cuenta si el puntero bajó y subió en el fondo (no un arrastre desde dentro). Por defecto `true`. */
  closeOnBackdrop?: boolean;
  /** Bloquea el desplazamiento del documento mientras está abierto. Por defecto `true`. */
  lockScroll?: boolean;
  /** Ver `ModalDialogPlacement`. Por defecto `center`. */
  placement?: ModalDialogPlacement;
}

/** Restablece el `<dialog>` del navegador y pinta el velo (el contenido pone su propia superficie). */
export const MODAL_DIALOG_BASE_CLASS =
  'm-0 border-0 bg-transparent p-0 text-inherit open:flex backdrop:bg-ds-background-effect-backdrop backdrop:backdrop-blur-md';

const PLACEMENT_CLASS: Record<ModalDialogPlacement, string> = {
  center: 'fixed inset-0 m-auto max-h-[90dvh] max-w-[calc(100vw-2rem)]',
  side: [
    'fixed inset-y-0 right-0 left-auto h-dvh max-h-none max-w-full',
    'mobile:inset-x-0 mobile:top-auto mobile:bottom-0 mobile:h-auto mobile:max-h-[90dvh] mobile:w-full',
  ].join(' '),
  sheet: 'fixed inset-x-0 top-auto bottom-0 h-auto max-h-[90dvh] w-full max-w-none',
  'center-sheet': [
    'fixed inset-0 m-auto max-h-[90dvh] max-w-[calc(100vw-2rem)]',
    'mobile:inset-x-0 mobile:top-auto mobile:bottom-0 mobile:m-0 mobile:h-auto mobile:w-full mobile:max-w-none',
  ].join(' '),
};

/** Cuenta de diálogos abiertos que bloquean el desplazamiento (para anidar sin soltar el bloqueo antes de tiempo). */
let scrollLocks = 0;
let previousOverflow = '';

function lockDocumentScroll() {
  const root = document.documentElement;
  if (scrollLocks === 0) {
    previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
  }
  scrollLocks += 1;
  return () => {
    scrollLocks -= 1;
    if (scrollLocks === 0) root.style.overflow = previousOverflow;
  };
}

/**
 * Diálogo modal sobre `<dialog>` nativo (patrón APG Dialog Modal). Pieza interna: no se exporta desde el paquete.
 * La usan FilterPanel, Modal y AlertModal.
 *
 * - `showModal()`: el navegador atrapa el foco, deja inerte el resto y, al cerrar, devuelve el foco a quien lo abrió.
 * - Escape y el clic en el fondo piden el cierre con `onOpenChange(false)`; el estado manda (`open` controlado).
 *   Los popovers internos (Select, DatePicker) consumen su Escape antes (`defaultPrevented`).
 * - El clic en el fondo solo cierra si `pointerdown` y `click` fueron los dos en el fondo: arrastrar desde la superficie
 *   (seleccionar texto, mover un slider) y soltar fuera no cierra.
 * - Bloquea el desplazamiento del documento mientras está abierto.
 */
export const ModalDialog = forwardRef<HTMLDialogElement, ModalDialogProps>(
  (
    {
      open,
      onOpenChange,
      role,
      initialFocus,
      closeOnBackdrop = true,
      lockScroll = true,
      placement = 'center',
      className,
      onCancel,
      onClose,
      onKeyDown,
      onPointerDown,
      onClick,
      children,
      ...rest
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const mergedRef = useMergedRefs(dialogRef, ref);
    const pressedOnBackdrop = useRef(false);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (open && !dialog.open) {
        dialog.showModal();
        initialFocus?.current?.focus();
      } else if (!open && dialog.open) dialog.close();
    }, [open, initialFocus]);

    useEffect(() => {
      if (!open || !lockScroll) return;
      return lockDocumentScroll();
    }, [open, lockScroll]);

    return (
      <dialog
        {...rest}
        ref={mergedRef}
        role={role}
        className={cn(MODAL_DIALOG_BASE_CLASS, PLACEMENT_CLASS[placement], className)}
        onCancel={(event: SyntheticEvent<HTMLDialogElement>) => {
          onCancel?.(event);
          // Escape: se cierra por el estado para que `open` controlado mande
          event.preventDefault();
          onOpenChange(false);
        }}
        onClose={(event: SyntheticEvent<HTMLDialogElement>) => {
          onClose?.(event);
          if (open) onOpenChange(false);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDialogElement>) => {
          onKeyDown?.(event);
          // Escape también por teclado sintético; los popovers internos lo consumen antes
          if (event.key === 'Escape' && !event.defaultPrevented) {
            event.preventDefault();
            onOpenChange(false);
          }
        }}
        onPointerDown={(event: PointerEvent<HTMLDialogElement>) => {
          onPointerDown?.(event);
          pressedOnBackdrop.current = event.target === event.currentTarget;
        }}
        onClick={(event: MouseEvent<HTMLDialogElement>) => {
          onClick?.(event);
          // Fondo = el propio <dialog> (fuera de la superficie), al bajar y al subir el puntero
          const onBackdrop = event.target === event.currentTarget && pressedOnBackdrop.current;
          pressedOnBackdrop.current = false;
          if (closeOnBackdrop && onBackdrop) onOpenChange(false);
        }}
      >
        {children}
      </dialog>
    );
  }
);

ModalDialog.displayName = 'ModalDialog';
