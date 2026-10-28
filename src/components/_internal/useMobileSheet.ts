import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent, RefObject } from 'react';

interface UseMobileSheetOptions {
  /** La hoja está abierta (y se dibuja: p. ej. solo en el layout móvil). */
  open: boolean;
  /** Cambia el estado abierto (el de `useControllableState` de quien la usa). */
  setOpen: (open: boolean) => void;
  /** Contenedor del componente: Escape solo actúa si el foco está dentro (o se perdió en `body`). */
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * Hoja de menú móvil (pieza interna) que despliega un botón disclosure (`IconMenu` de Header y SideBar):
 * - Escape cierra y devuelve el foco al botón, si el foco estaba en el componente o se perdió (en `body`). Respeta un
 *   Escape ya atendido (`defaultPrevented`, p. ej. el de un panel abierto dentro).
 * - Activar un enlace (`a[href]`) dentro de la hoja la cierra; para otros controles que navegan, `close()`.
 * Devuelve el `ref` del botón y `sheetProps` (`onClick`) para la hoja. El marcado, los nombres y `aria-*` son de quien
 * la usa.
 */
export function useMobileSheet({ open, setOpen, containerRef }: UseMobileSheetOptions) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      const container = containerRef.current;
      const active = document.activeElement;
      if (container && active && active !== document.body && !container.contains(active)) return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen, containerRef]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const onSheetClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) setOpen(false);
    },
    [setOpen]
  );

  return { buttonRef, close, sheetProps: { onClick: onSheetClick } };
}
