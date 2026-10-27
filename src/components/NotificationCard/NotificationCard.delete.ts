import { useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { useControllableState } from '../../utils/controllableState';

/** Recorrido horizontal mínimo (px) para que un deslizamiento muestre u oculte el botón eliminar. */
const SWIPE_DISTANCE = 40;

interface RevealOptions {
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  /** Sin `onDelete` no hay botón que mostrar. */
  enabled: boolean;
}

/**
 * Estado "botón eliminar a la vista" y gesto de deslizar: a la izquierda lo muestra, a la derecha lo oculta (puntero,
 * táctil o ratón). El gesto es un atajo: el botón es siempre alcanzable con teclado.
 */
export function useRevealDelete({ revealed, defaultRevealed = false, onRevealedChange, enabled }: RevealOptions) {
  const [state, setRevealed] = useControllableState(revealed, defaultRevealed, onRevealedChange, 'Notification');
  const start = useRef<{ x: number; y: number } | null>(null);
  // Un deslizamiento válido no debe terminar en clic sobre el contenido (el título cubre toda la tarjeta)
  const swiped = useRef(false);
  const handlers = enabled
    ? {
        onPointerDown: (event: PointerEvent) => {
          if (event.button !== 0) return;
          swiped.current = false;
          start.current = { x: event.clientX, y: event.clientY };
        },
        onPointerUp: (event: PointerEvent) => {
          const from = start.current;
          start.current = null;
          if (!from) return;
          const dx = event.clientX - from.x;
          const dy = event.clientY - from.y;
          if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
            swiped.current = true;
            setRevealed(dx < 0);
          }
        },
        onPointerCancel: () => {
          start.current = null;
        },
        // El clic que el navegador genera al soltar tras arrastrar se descarta una sola vez
        onClickCapture: (event: MouseEvent) => {
          if (!swiped.current) return;
          swiped.current = false;
          event.preventDefault();
          event.stopPropagation();
        },
      }
    : {};
  return { revealed: enabled && state, setRevealed, handlers, touchAction: enabled ? ('pan-y' as const) : undefined };
}

/** Nombre del botón eliminar: el pasado o "Eliminar notificación" (con ": título" si el título es texto). */
export function deleteLabelFor(label: string | undefined, title: unknown) {
  return label ?? (typeof title === 'string' && title ? `Eliminar notificación: ${title}` : 'Eliminar notificación');
}
